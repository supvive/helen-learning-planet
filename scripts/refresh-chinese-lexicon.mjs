import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const APP_DIR = path.resolve(import.meta.dirname, "..");
const APP_JS = path.join(APP_DIR, "app.js");
const KEY_FILE = path.join(APP_DIR, ".deepseek_api_key");
const DATA_DIR = path.join(APP_DIR, "data");
const OUTPUT_JSON = path.join(DATA_DIR, "chinese-lexicon-v2.5.1.json");
const BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";
const BATCH_SIZE = Number(process.env.LEXICON_BATCH_SIZE || 12);
const MAX_BATCH_REPAIR_SIZE = 8;
const REQUEST_TIMEOUT_MS = Number(process.env.LEXICON_TIMEOUT_MS || 90000);
const ONLY_MISSING = process.argv.includes("--only-missing");
const SUPPLEMENTAL_REFRESH_CHARS = "输练认河路包校师友测句刻立秒确容熟危恶易预境读写学词桥";

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function extractBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing marker: ${startMarker}`);
  const valueStart = start + startMarker.length;
  const end = source.indexOf(endMarker, valueStart);
  if (end < 0) throw new Error(`Missing marker: ${endMarker}`);
  return source.slice(valueStart, end).trim();
}

function extractArray(source, name, nextMarker) {
  const literal = extractBetween(source, `const ${name} = `, nextMarker).replace(/;$/, "");
  return vm.runInNewContext(`(${literal})`);
}

function extractStringConst(source, name) {
  const match = source.match(new RegExp(`const ${name} = "([^"]*)";`));
  if (!match) throw new Error(`Missing string const: ${name}`);
  return match[1];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getLibraryChars(source) {
  const hanzi = extractArray(source, "HANZI_DATA", "\n\nconst EXTRA_HANZI_DATA");
  const extra = extractArray(source, "EXTRA_HANZI_DATA", "\n\nconst BASE_HANZI_DATA");
  const pep = extractStringConst(source, "PEP_GRADE_ONE_CHARS");
  const math = extractStringConst(source, "GRADE_ONE_MATH_CHARS");
  return unique([
    ...hanzi.map((item) => item.char),
    ...extra.map((item) => item.char),
    ...[...pep],
    ...[...math],
    ...[...SUPPLEMENTAL_REFRESH_CHARS],
    ...Object.keys(extractExistingLexicon(source)),
  ]).filter((char) => /^[\u4e00-\u9fff]$/.test(char));
}

function extractExistingLexicon(source) {
  const startMarker = "const CHINESE_LEXICAL_INFO = ";
  const endMarker = "\n\nconst SAMPLE_TEXT";
  const start = source.indexOf(startMarker);
  if (start < 0) return {};
  const end = source.indexOf(endMarker, start);
  if (end < 0) return {};
  const literal = source.slice(start + startMarker.length, end).trim().replace(/;$/, "");
  try {
    return vm.runInNewContext(`(${literal})`);
  } catch {
    return {};
  }
}

function readApiKey() {
  const key = process.env.DEEPSEEK_API_KEY || (fs.existsSync(KEY_FILE) ? readText(KEY_FILE).trim() : "");
  if (!key) throw new Error("Missing DeepSeek API key. Save it in .deepseek_api_key first.");
  return key;
}

function buildPrompt(chars) {
  return [
    "请为中国幼小衔接到小学一年级儿童生成本地识字字库信息。",
    "输入是一组单个汉字。必须逐字返回，不要漏字，不要增加输入外的字。",
    "每个字需要：标准普通话拼音（必须用声调符号，不要数字声调）、简短真实释义、3到5个常用组词、每个组词的拼音和儿童能懂的释义、一个不超过15个汉字的短句。",
    "组词必须包含目标汉字，优先一年级常见词，避免成人化、生僻、抽象过重的词。",
    "释义不能写“常用汉字”“结合语境理解”“一年级常用字”这类糊弄文字。",
    "如果是多音字，选择小学低年级最常用读音；必要时可在释义中简短说明。",
    "只输出 JSON，不要 Markdown。",
    "JSON 格式：",
    '{"items":[{"char":"放","pinyin":"fàng","meaning":"把东西安放在某处，或让它离开手。","words":[{"word":"放下","pinyin":"fàng xià","meaning":"把拿着的东西放到下面或别处。"},{"word":"放心","pinyin":"fàng xīn","meaning":"心里不担心。"},{"word":"放学","pinyin":"fàng xué","meaning":"一天的课结束后离开学校。"}],"sentence":"请把书放桌上。"}]}',
    `输入汉字：${chars.join("、")}`,
  ].join("\n");
}

function stripJsonText(text) {
  const cleaned = String(text || "").replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first < 0 || last < first) throw new Error("Model response did not contain a JSON object");
  return cleaned.slice(first, last + 1).replace(/,\s*([}\]])/g, "$1");
}

function parseJsonResponse(text) {
  return JSON.parse(stripJsonText(text));
}

function validateEntry(entry, expectedChar) {
  const badText = /(暂无|待补充|还没有|结合.*语境|常用汉字|一年级常用字|请在字典|查完整)/;
  const entryChar = entry?.char || entry?.text;
  if (!entry || entryChar !== expectedChar) throw new Error(`${expectedChar}: char mismatch`);
  if (!/^[\u4e00-\u9fff]$/.test(entryChar)) throw new Error(`${expectedChar}: invalid char`);
  if (!entry.pinyin || /\d/.test(entry.pinyin)) throw new Error(`${expectedChar}: invalid pinyin`);
  if (!entry.meaning || badText.test(entry.meaning) || entry.meaning.length < 4) {
    throw new Error(`${expectedChar}: invalid meaning`);
  }
  if (!Array.isArray(entry.words) || entry.words.length < 3) throw new Error(`${expectedChar}: too few words`);
  entry.words.slice(0, 5).forEach((wordItem, index) => {
    if (!wordItem?.word?.includes(expectedChar)) throw new Error(`${expectedChar}: word ${index + 1} must include char`);
    if (!wordItem.pinyin || /\d/.test(wordItem.pinyin)) throw new Error(`${expectedChar}: word ${index + 1} invalid pinyin`);
    if (!wordItem.meaning || badText.test(wordItem.meaning)) throw new Error(`${expectedChar}: word ${index + 1} invalid meaning`);
  });
  if (!entry.sentence || entry.sentence.length > 24) throw new Error(`${expectedChar}: invalid sentence`);
}

async function callDeepSeek(apiKey, chars, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const started = Date.now();
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "你是小学一年级语文识字词典编辑。你只输出严格 JSON，不输出 Markdown 或解释。",
          },
          { role: "user", content: buildPrompt(chars) },
        ],
        max_tokens: 5200,
        temperature: 0.15,
        stream: false,
      }),
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`${label}: HTTP ${response.status} ${raw.slice(0, 500)}`);
    const data = JSON.parse(raw);
    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = parseJsonResponse(text);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const byChar = new Map(items.map((item) => [item.char, item]));
    const valid = [];
    const invalid = [];
    for (const char of chars) {
      try {
        const entry = byChar.get(char);
        validateEntry(entry, char);
        valid.push(normalizeEntry(entry));
      } catch (error) {
        invalid.push({ char, reason: error.message });
      }
    }
    return {
      valid,
      invalid,
      latencyMs: Date.now() - started,
      requestId: data?.id || "",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeEntry(entry) {
  return {
    text: entry.char,
    type: "character",
    pinyin: String(entry.pinyin).trim(),
    meaning: String(entry.meaning).trim(),
    words: entry.words.slice(0, 5).map((item) => ({
      word: String(item.word).trim(),
      pinyin: String(item.pinyin).trim(),
      meaning: String(item.meaning).trim(),
    })),
    sentence: String(entry.sentence).trim(),
    source: "deepseek-v4-pro-bulk-v2.5.1",
    updatedAt: todayLocal(),
  };
}

function todayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toJsString(value) {
  return JSON.stringify(value);
}

function formatLexicon(entries) {
  const lines = ["const CHINESE_LEXICAL_INFO = {"];
  entries.forEach((entry, index) => {
    const comma = index === entries.length - 1 ? "" : ",";
    lines.push(`  ${entry.text}: { text: ${toJsString(entry.text)}, type: "character", pinyin: ${toJsString(entry.pinyin)}, meaning: ${toJsString(entry.meaning)}, words: [`);
    entry.words.forEach((wordItem, wordIndex) => {
      const wordComma = wordIndex === entry.words.length - 1 ? "" : ",";
      lines.push(`    { word: ${toJsString(wordItem.word)}, pinyin: ${toJsString(wordItem.pinyin)}, meaning: ${toJsString(wordItem.meaning)} }${wordComma}`);
    });
    lines.push(`  ], sentence: ${toJsString(entry.sentence)}, source: ${toJsString(entry.source)}, updatedAt: ${toJsString(entry.updatedAt)} }${comma}`);
  });
  lines.push("};");
  return lines.join("\n");
}

function replaceLexiconBlock(source, entries) {
  const start = source.indexOf("const CHINESE_LEXICAL_INFO = {");
  const endMarker = "\n\nconst SAMPLE_TEXT";
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error("Could not locate CHINESE_LEXICAL_INFO block");
  return `${source.slice(0, start)}${formatLexicon(entries)}${source.slice(end)}`;
}

async function main() {
  const source = readText(APP_JS);
  const chars = getLibraryChars(source);
  const existingLexicon = extractExistingLexicon(source);
  const apiKey = readApiKey();
  const byChar = new Map();
  if (ONLY_MISSING) {
    for (const char of chars) {
      const existing = existingLexicon[char];
      try {
        validateEntry(existing, char);
        byChar.set(char, existing);
      } catch {
        // Missing or incomplete entries are intentionally regenerated below.
      }
    }
  }
  const stats = [];
  console.log(JSON.stringify({ event: "lexicon_refresh_start", model: MODEL, totalChars: chars.length, existingValid: byChar.size, onlyMissing: ONLY_MISSING, batchSize: BATCH_SIZE }));

  const charsToRefresh = ONLY_MISSING ? chars.filter((char) => !byChar.has(char)) : chars;

  for (let index = 0; index < charsToRefresh.length; index += BATCH_SIZE) {
    const batch = charsToRefresh.slice(index, index + BATCH_SIZE);
    const result = await callDeepSeek(apiKey, batch, `batch_${Math.floor(index / BATCH_SIZE) + 1}`);
    result.valid.forEach((entry) => byChar.set(entry.text, entry));
    stats.push({ batch: Math.floor(index / BATCH_SIZE) + 1, chars: batch, latencyMs: result.latencyMs, requestId: result.requestId, invalid: result.invalid });
    console.log(JSON.stringify(stats.at(-1)));
  }

  let missing = chars.filter((char) => !byChar.has(char));
  if (missing.length) {
    console.log(JSON.stringify({ event: "lexicon_repair_start", missing }));
    for (let index = 0; index < missing.length; index += MAX_BATCH_REPAIR_SIZE) {
      const batch = missing.slice(index, index + MAX_BATCH_REPAIR_SIZE);
      const result = await callDeepSeek(apiKey, batch, `repair_${Math.floor(index / MAX_BATCH_REPAIR_SIZE) + 1}`);
      result.valid.forEach((entry) => byChar.set(entry.text, entry));
      stats.push({ batch: `repair_${Math.floor(index / MAX_BATCH_REPAIR_SIZE) + 1}`, chars: batch, latencyMs: result.latencyMs, requestId: result.requestId, invalid: result.invalid });
      console.log(JSON.stringify(stats.at(-1)));
    }
  }

  missing = chars.filter((char) => !byChar.has(char));
  if (missing.length) throw new Error(`Still missing valid lexicon entries: ${missing.join("、")}`);

  const entries = chars.map((char) => byChar.get(char));
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify({ model: MODEL, total: entries.length, updatedAt: todayLocal(), stats, items: entries }, null, 2), "utf8");
  fs.writeFileSync(APP_JS, replaceLexiconBlock(source, entries), "utf8");
  console.log(JSON.stringify({
    event: "lexicon_refresh_complete",
    total: entries.length,
    outputJson: path.relative(APP_DIR, OUTPUT_JSON),
    appJs: path.relative(APP_DIR, APP_JS),
    totalLatencyMs: stats.reduce((sum, item) => sum + item.latencyMs, 0),
  }));
}

main().catch((error) => {
  console.error(JSON.stringify({ event: "lexicon_refresh_failed", message: error.message }));
  process.exit(1);
});
