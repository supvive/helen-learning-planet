import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const context = {
  console,
  window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, setTimeout: (fn) => fn() },
  document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  speechSynthesis: { cancel: () => {} },
  SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
};

vm.runInNewContext(`${source}
globalThis.__chineseTest = {
  getCharacterByChar,
  getCharacterLibrary,
  normalizeChineseText,
  resolveChineseMeaning,
  resolveChineseWords,
  analyzeChineseLexicalCoverage,
  renderMeaningContent,
  extractFeedbackDiscoveredItems,
  getRecentCompleteFeedbackDays
};`, context);

const api = context.__chineseTest;
const forbiddenPlaceholders = ["这个字的释义还没有补充", "这个字的组词还没有补充", "模型识别需练习"];
forbiddenPlaceholders.forEach((text) => {
  assert(!source.includes(text), `UI source must not include placeholder: ${text}`);
});

const required = ["测", "句", "刻", "立", "秒", "确", "容", "熟", "危", "恶", "易", "预", "输", "签", "对"];
const missingTextPattern = /(暂未|还没有|待补充|请在字典|常用汉字|结合.*语境)/;

required.forEach((char) => {
  assert(api.normalizeChineseText(`char:${char}`) === char, `${char} should normalize from char:id form`);
  const meaning = api.resolveChineseMeaning(char);
  const words = api.resolveChineseWords(char);
  assert(meaning, `${char} should have a local meaning`);
  assert(!missingTextPattern.test(meaning), `${char} should not use missing or generic text`);
  assert(words.length >= 3, `${char} should have at least 3 word examples`);
  words.forEach((item) => {
    assert(item.word.includes(char), `${char} word ${item.word} should include the character`);
    assert(item.pinyin && !/\d/.test(item.pinyin), `${char} word ${item.word} should use tone-mark pinyin`);
    assert(item.meaning && !missingTextPattern.test(item.meaning), `${char} word ${item.word} should have a real meaning`);
  });
});

const coverage = api.analyzeChineseLexicalCoverage();
assert(coverage.total >= 158, "Chinese character library should include the current grade-one set");
assert(coverage.missingMeaningCount === 0, "All library characters should have meanings");
assert(coverage.missingWordsCount === 0, "All library characters should have three word examples");
assert(!missingTextPattern.test(api.renderMeaningContent(api.getCharacterByChar("测"))), "Meaning rendering should show real local content");
assert(api.resolveChineseWords("输").some((item) => item.word.includes("输")), "输 should include usable word groups");

const feedbackSample = `
Day 8 学习内容
阅读后的生字预测：
狐狸
Day 8 反馈表
通过卡顿发现的生字：
心愿的愿不认识
造不认识
任务不认识
传话的传不认识
放弃这里又将放认读成了收
家长陪读反馈：
这里不要提取
Day 9 学习内容
Day 9 反馈表
通过卡顿发现的生字：
办公室的办不熟悉
阅读后的生字预测：
龟兔
`;
const feedbackExtraction = api.extractFeedbackDiscoveredItems(feedbackSample);
const extractedKeys = feedbackExtraction.items.map((item) => `${item.type}:${item.text}`);
["char:愿", "char:造", "word:任务", "char:任", "char:务", "char:传", "char:放", "char:办"].forEach((key) => {
  assert(extractedKeys.includes(key), `feedback extraction should include ${key}`);
});
assert(!extractedKeys.includes("word:狐狸") && !extractedKeys.includes("char:狐"), "prediction area must not auto-add words");
const confused = feedbackExtraction.items.find((item) => item.text === "放");
assert(confused?.status === "混淆" && confused?.confusedWith === "收", "confused feedback should preserve confused pair");
assert(feedbackExtraction.days.length === 2 && feedbackExtraction.days.includes("Day8") && feedbackExtraction.days.includes("Day9"), "should identify complete feedback days");

console.log(JSON.stringify({
  requiredTested: required.length,
  total: coverage.total,
  meaningCount: coverage.meaningCount,
  missingMeaningCount: coverage.missingMeaningCount,
  wordsCount: coverage.wordsCount,
  missingWordsCount: coverage.missingWordsCount,
  sample: {
    测: {
      meaning: api.resolveChineseMeaning("测"),
      words: api.resolveChineseWords("测").map((item) => item.word)
    },
    句: {
      meaning: api.resolveChineseMeaning("句"),
      words: api.resolveChineseWords("句").map((item) => item.word)
    },
    刻: {
      meaning: api.resolveChineseMeaning("刻"),
      words: api.resolveChineseWords("刻").map((item) => item.word)
    },
    立: {
      meaning: api.resolveChineseMeaning("立"),
      words: api.resolveChineseWords("立").map((item) => item.word)
    },
    熟: {
      meaning: api.resolveChineseMeaning("熟"),
      words: api.resolveChineseWords("熟").map((item) => item.word)
    }
  },
  feedbackExtraction: {
    days: feedbackExtraction.days,
    itemCount: feedbackExtraction.items.length,
    sample: extractedKeys.slice(0, 8)
  },
  missingMeaningPreview: coverage.missingMeanings.slice(0, 20),
  missingWordsPreview: coverage.missingWordExamples.slice(0, 20)
}, null, 2));
