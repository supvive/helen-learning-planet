import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createLocalStorage(seed = {}) {
  const store = { ...seed };
  return {
    store,
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; }
  };
}

function makeContext(seed = {}, elements = {}) {
  const localStorage = createLocalStorage(seed);
  const context = {
    console,
    TextEncoder,
    window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, location: { origin: "http://localhost" } },
    document: { addEventListener: () => {}, querySelector: (selector) => elements[selector] || null, querySelectorAll: () => [] },
    localStorage,
    speechSynthesis: { cancel: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
  };
  vm.runInNewContext(`${source}
globalThis.__packTest = {
  parseLearningPackInput,
  parseAndPreviewLearningPack,
  buildLearningPackPreview,
  importLearningPack,
  getLatestLearningPack,
  focusFromLearningPack,
  questionsFromLearningPack,
  buildEnglishWordLibrary,
  getTodayPackBlockPattern,
  getCharacterByChar,
  saveState,
  state,
  englishProgress
};`, context);
  return context;
}

const pack = JSON.parse(fs.readFileSync(new URL("./examples/learning-pack-v1.example.json", import.meta.url), "utf8"));
const packText = JSON.stringify(pack, null, 2);
const day14Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-26-day14-revision-e.json", import.meta.url), "utf8"));
const day15Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json", import.meta.url), "utf8"));
const revisionAPack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-29-revision-a.json", import.meta.url), "utf8"));
const builtinManifest = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/manifest.json", import.meta.url), "utf8"));
const builtinBundleSource = fs.readFileSync(new URL("./data/learning-packs/builtin-learning-packs.js", import.meta.url), "utf8");
const builtinBundle = (() => {
  const bundleContext = {};
  vm.runInNewContext(builtinBundleSource, bundleContext);
  return bundleContext.HELEN_BUILTIN_LEARNING_PACKS;
})();

[
  packText,
  `\`\`\`json\n${packText}\n\`\`\``,
  `这是今天的学习包：\n${packText}\n请导入。`
].forEach((input) => {
  const context = makeContext();
  const parsed = context.__packTest.parseLearningPackInput(input);
  assert(parsed.packId === pack.packId, "Learning pack should parse from raw JSON, fenced JSON, and prose-wrapped JSON");
});

{
  const context = makeContext();
  const before = JSON.stringify(context.localStorage.store);
  const parsed = context.__packTest.parseLearningPackInput(packText);
  context.__packTest.buildLearningPackPreview(parsed);
  assert(JSON.stringify(context.localStorage.store) === before, "Preview must not modify localStorage");
}

[
  { ...pack, schemaVersion: "wrong" },
  { ...pack, packId: "" },
  { ...pack, loadMode: "heavy" },
  { ...pack, chinese: { characters: [{ text: "逐渐" }] } },
  { ...pack, english: { ...pack.english, words: [{ text: { text: "open", meaningZh: "打开" } }] } }
].forEach((badPack) => {
  const context = makeContext();
  const before = JSON.stringify(context.localStorage.store);
  const beforeState = JSON.stringify(context.__packTest.state);
  let failed = false;
  try {
    context.__packTest.parseLearningPackInput(JSON.stringify(badPack));
  } catch {
    failed = true;
  }
  assert(failed, "Invalid package should fail validation");
  assert(JSON.stringify(context.localStorage.store) === before, "Invalid package must not modify state");
  assert(JSON.stringify(context.__packTest.state) === beforeState, "Invalid package must not modify in-memory learning data");
});

{
  const context = makeContext();
  let failed = false;
  try {
    context.__packTest.parseLearningPackInput(`<script>alert(1)</script>${packText}`);
  } catch {
    failed = true;
  }
  assert(failed, "Script content should be rejected");
}

{
  const context = makeContext();
  context.__packTest.state.learningPacks.legacy = {
    data: {
      packId: "legacy",
      date: "2026-07-01",
      english: { words: [{ text: "[object Object]" }, { text: "open", meaningZh: "打开" }] }
    }
  };
  const library = context.__packTest.buildEnglishWordLibrary();
  assert(!library.some((item) => item.text === "[object Object]" || item.id === "object"), "Legacy object text must be hidden from word recognition");
  assert(library.some((item) => item.id === "open"), "Filtering legacy garbage must preserve valid English words");
}

{
  const context = makeContext();
  let failed = false;
  try {
    context.__packTest.parseLearningPackInput("x".repeat(101 * 1024));
  } catch {
    failed = true;
  }
  assert(failed, "Oversized package should be rejected");
}

{
  const seedState = {
    "hanzi-memory-app-v1": JSON.stringify({
      wordbook: { 逐: { mastered: true, addedAt: "old", sources: ["manual"], count: 1 } },
      learnerChars: { 逐: { char: "逐", status: "mastered" } },
      dailyRecords: [],
      settings: {},
      mastery: {},
      chineseRecognition: { version: 2, items: { "char:逐": { itemId: "char:逐", masteryCount: 3, recentResults: ["mastered"] } }, recentlyShownIds: [] },
      dictionaryCache: {}
    }),
    "english-word-recognition-progress-v2": JSON.stringify({
      version: 2,
      words: { open: { itemId: "open", masteryCount: 2, recentResults: ["mastered"] } },
      recentlyShownIds: [],
      dailyStats: {},
      settings: { scope: "all" }
    })
  };
  const context = makeContext(seedState);
  const parsed = context.__packTest.parseLearningPackInput(packText);
  const preview = context.__packTest.buildLearningPackPreview(parsed);
  assert(preview.added > 0 || preview.updated > 0, "First preview should show adds or updates");
  const result = context.__packTest.importLearningPack(parsed, preview);
  assert(result.added >= 1, "First import should add targets");
  assert(context.__packTest.state.learningPacks[pack.packId], "Imported pack should be saved");
  assert(context.__packTest.state.learnerChars["逐"].meaning === "一个接一个。", "Chinese character meaning should come from pack");
  assert(context.__packTest.state.learnerChars["逐"].words.length >= 3, "Chinese character words should come from pack");
  assert(context.__packTest.state.wordbook["逐"].mastered === true, "Existing mastered wordbook state must be preserved");
  assert(context.__packTest.englishProgress.words.open.masteryCount === 2, "Existing English progress must be preserved");

  const library = context.__packTest.buildEnglishWordLibrary();
  const open = library.find((item) => item.id === "open");
  assert(open?.sources.some((source) => source === `daily_pack:${pack.packId}`), "English word should enter dynamic daily pack library");
  assert(open.chinese === "打开", "English word should keep pack meaning");

  const blockPattern = context.__packTest.getTodayPackBlockPattern();
  assert(blockPattern?.example.includes("Our teacher says"), "Anchor sentence should be available to English Blocks");

  const repeatPreview = context.__packTest.buildLearningPackPreview(parsed);
  const repeat = context.__packTest.importLearningPack(parsed, repeatPreview);
  assert(repeat.repeat && repeat.added === 0 && repeat.updated === 0, "Repeated same packId/checksum should be idempotent");

  const changed = { ...pack, chinese: { ...pack.chinese, characters: [{ ...pack.chinese.characters[0], meaning: "按顺序一个接一个。" }]} };
  const changedParsed = context.__packTest.parseLearningPackInput(JSON.stringify(changed));
  const changedPreview = context.__packTest.buildLearningPackPreview(changedParsed);
  assert(changedPreview.isPackUpdate && changedPreview.updated > 0, "Same packId with changed content should preview updates");

  context.__packTest.saveState();
  const restored = makeContext(context.localStorage.store);
  assert(restored.__packTest.state.learningPacks[pack.packId], "Imported pack should survive refresh");
  assert(restored.__packTest.state.wordbook["逐"].mastered === true, "Existing learning history should survive import and refresh");
  assert(restored.__packTest.englishProgress.words.open.masteryCount === 2, "Existing English progress should survive import and refresh");
}

{
  const elements = {
    "#learningPackInput": { value: "<script>alert(1)</script>" },
    "#confirmPackBtn": {},
    "#packSuccessPanel": { setAttribute: () => {} },
    "#packPreviewTitle": {},
    "#packPreviewContent": {},
    "#packStatus": {}
  };
  const context = makeContext({}, elements);
  context.__packTest.parseAndPreviewLearningPack();
  assert(elements["#learningPackInput"].value === "<script>alert(1)</script>", "Failed import should preserve the pasted input");
  assert(!elements["#packStatus"].textContent.includes("。。"), "Failed import message should not contain duplicate punctuation");
  assert(JSON.stringify(context.localStorage.store) === "{}", "Failed one-click import should not write localStorage");
}

assert(!html.includes("ChatGPT 分享链接 / ChatGPT Share Link"), "Homepage must not show old ChatGPT share link label");
assert(!html.includes("粘贴链接，AI出题"), "Homepage must not show old link-to-AI workflow");
const dailyHtml = html.slice(html.indexOf("<section id=\"daily\""), html.indexOf("<section id=\"chinese-planet\""));
assert(dailyHtml.includes('id="planetOverview"') && !dailyHtml.includes("learningPackInput") && !dailyHtml.includes("检查并导入"), "Daily homepage should expose only the builtin planet flow, not ordinary pack paste");
assert(!dailyHtml.includes("课程已更新") && !dailyHtml.includes("今日课程已准备好"), "Daily homepage should not expose transient course-status copy");
assert(!dailyHtml.includes("learningPackFile"), "Daily homepage should not expose file import");
const parentHtml = html.slice(html.indexOf("<section id=\"parent\""), html.indexOf("</main>"));
assert(parentHtml.indexOf("parent-import-card") < parentHtml.indexOf("三科进度"), "Course import should be the first Parent Observatory card");
assert(parentHtml.includes(">导入课程</button>") && parentHtml.includes('placeholder="粘贴完整课包"') && parentHtml.includes('role="status"'), "Parent Observatory should expose the compact one-click import card");
assert(!parentHtml.includes("粘贴课程 JSON，系统会自动校验、导入并打开新课。"), "Import card should omit the old explanatory paragraph");
assert(!parentHtml.includes("开发应急导入") && !parentHtml.includes("检查并导入"), "Parent import should not use developer or two-step language");
assert(source.includes("checkAndImportLearningPack") && source.includes("confirmLearningPackImport({ autoNavigate: true })"), "Import button should reuse the parse, preview, and import chain");
assert(source.includes('showView("daily", true, { skipRouteDateSelection: true })'), "Successful import should navigate to the planet homepage");
assert(source.includes('$("#learningPackInput").value = "";') && !source.includes("restoreLearningPackInput"), "Import input should start empty and clear only after success");
assert(/\.parent-import-card \.compact-pack-input\s*\{[\s\S]*?min-height:\s*140px;[\s\S]*?max-height:\s*180px;/.test(css), "Parent import textarea should keep its compact height over the generic pack input");
assert(html.includes("v=v3.9.12") && !html.includes("v=v3.9.11") && !html.includes("v=v3.9.10") && !html.includes("v=v3.9.9") && !html.includes("v=v3.9.8"), "Page resources should use the v3.9.12 cache key");
assert(!html.includes("解析并预览"), "Daily homepage should not show the old preview button text");
assert(!/🔊|🔈|📢|♪|read-aloud-button|听姐姐说|慢一点/.test(`${source}\n${html}\n${css}`), "Read aloud UI must not regress to emoji/music-note or large text buttons");
assert(source.includes("speakerIconSvg") && source.includes("read-aloud-icon"), "Read aloud should use the shared inline SVG icon button");
assert(!css.includes("grid-template-columns: minmax(0, 1fr) 40px"), "Prompt row must not reserve a right-side icon column");
assert(css.includes("margin-left: 0.25em") && css.includes(".read-aloud-icon"), "Read aloud icon should sit inline after prompt text");
assert(/\.prompt-text h3,\s*\.prompt-text p,\s*\.prompt-text strong\s*\{[\s\S]*display:\s*inline/.test(css), "Prompt heading text must be inline so the speaker follows the final character");
assert(!/<select[^>]*course-hardest/.test(html) && source.includes("hardestSections") && source.includes("hardest-chip-list"), "Hardest sections must be multi-select chips, not a native select");

{
  const context = makeContext();
  const parsed = context.__packTest.parseLearningPackInput(JSON.stringify(day15Pack));
  const preview = context.__packTest.buildLearningPackPreview(parsed);
  assert(preview.valid && preview.warnings.length === 0, "Day15 Revision B production pack should parse and preview cleanly");
  assert(parsed.contentPolicy.authority === "codex-course-designer" && parsed.contentPolicy.websiteMode === "render-only" && parsed.contentPolicy.allowModelGeneration === false, "Day15 integrated pack must use render-only policy");
  assert(parsed.date === "2026-07-27" && parsed.sharedPlan.plannedChineseMinutes === 23, "Day15 integrated pack should carry the approved date and Chinese minutes");
  assert(parsed.chinese.lesson.sections.length === 9, "Day15 integrated pack should carry nine Chinese sections");
  const parsedDay14 = context.__packTest.parseLearningPackInput(JSON.stringify(day14Pack));
  assert(JSON.stringify(parsed.english) === JSON.stringify(parsedDay14.english), "Day15 integrated pack should preserve the approved English object");
  assert(JSON.stringify(parsed.art) === JSON.stringify(parsedDay14.art), "Day15 integrated pack should preserve the approved Color Planet object");
  assert(builtinManifest.packs.some((entry) => entry.packId === day15Pack.packId && entry.path.includes("day15-revision-b")), "Manifest should keep Day15 Revision B archived");
  assert(["2026-07-25", "2026-07-26", "2026-07-27", "2026-07-29"].every((date) => builtinManifest.packs.some((entry) => entry.date === date)), "Manifest should keep the four historical dates alongside Revision A");
  assert(builtinBundle.packs[day15Pack.packId], "Built-in bundle should keep Day15 Revision B archived");
}

{
  const context = makeContext();
  const parsed = context.__packTest.parseLearningPackInput(JSON.stringify(revisionAPack));
  const preview = context.__packTest.buildLearningPackPreview(parsed);
  assert(preview.valid && preview.warnings.length === 0, "Revision A production pack should parse without warnings");
  const lesson = parsed.chinese.lesson;
  assert(lesson.sections.length === 9, "Revision A should carry nine Chinese sections");
  assert(new Set(lesson.sections.map((section) => section.id)).size === 9, "Revision A should keep nine distinct Chinese section ids");
  const fixedBreak = lesson.sections.find((section) => section.id === "fixed_break");
  const rawFixedBreak = revisionAPack.chinese.lesson.sections.find((section) => section.id === "fixed_break");
  assert(rawFixedBreak?.isQuestion === false && fixedBreak?.type === "break", "Revision A fixed break must be marked as non-question");
  const fourGrid = lesson.sections.find((section) => section.id === "four_grid_retell");
  const rawFourGrid = revisionAPack.chinese.lesson.sections.find((section) => section.id === "four_grid_retell");
  assert(JSON.stringify(rawFourGrid?.sectionResultOptions) === JSON.stringify(["independent", "prompted"]) && fourGrid?.prompts?.length, "Revision A four-grid section should expose section result options");
  const reading = lesson.sections.find((section) => section.id === "reading_excerpts");
  assert(reading?.textTitle && reading.paragraphs?.length === 4, "Revision A should include the reading title and paragraphs");
  const wordUnderstanding = lesson.sections.find((section) => section.id === "word_understanding");
  assert(wordUnderstanding?.questions?.some((question) => question.prompt.includes("露出") && question.answer.includes("看见")), "Revision A should include the approved word-meaning question");
  assert(builtinManifest.latestPackId === revisionAPack.packId && builtinManifest.latest.includes("helen-learning-pack-2026-07-29-revision-a"), "Manifest latest should point to Revision A");
  const historicalPackIds = [
    "2026-07-29-allen-chinese-repair-book-box-01",
    "2026-07-27-helen-day15-revision-b-water-table-art01",
    "2026-07-26-helen-day14-revision-e-open-books-art01",
    "2026-07-25-helen-day13-en-next-art01-rev2",
    "2026-07-25-helen-day13-en-next-art01"
  ];
  assert(historicalPackIds.every((packId) => builtinManifest.packs.some((entry) => entry.packId === packId)) && builtinManifest.packs.some((entry) => entry.packId === revisionAPack.packId), "Manifest should retain the historical packs plus Revision A");
  assert(builtinBundle.manifest.latestPackId === revisionAPack.packId && builtinBundle.packs[revisionAPack.packId], "Built-in bundle should include Revision A as latest");
  assert(!JSON.stringify(revisionAPack).includes("/Users/jackie/"), "Published Revision A must not expose local absolute paths");
}

console.log(JSON.stringify({ ok: true, packId: pack.packId }, null, 2));
