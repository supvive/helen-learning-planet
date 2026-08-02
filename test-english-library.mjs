import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const helloSchoolLibrary = JSON.parse(fs.readFileSync(new URL("./data/english-libraries/hello-school-32-lesson-library.json", import.meta.url), "utf8"));

function readArray(name) {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  if (!match) throw new Error(`Missing ${name}`);
  return [...match[1].matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)]
    .map((item) => item[1].replaceAll("’", "'").toLowerCase());
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const names = [
  "STORY_ZOO_WORDS",
  "STORY_KINDERGARTEN_WORDS",
  "STORY_PRIMARY_SCHOOL_WORDS",
  "PRIOR_LESSON_WORDS",
  "BEIJING_GRADE1_SEMESTER_1_WORDS",
  "GRADE_ONE_CORE_WORDS"
];

const arrays = Object.fromEntries(names.map((name) => [name, readArray(name)]));
const merged = new Set(names.flatMap((name) => arrays[name]));
const preBeijingMerged = new Set([
  ...arrays.STORY_ZOO_WORDS,
  ...arrays.STORY_KINDERGARTEN_WORDS,
  ...arrays.STORY_PRIMARY_SCHOOL_WORDS,
  ...arrays.PRIOR_LESSON_WORDS,
  ...arrays.GRADE_ONE_CORE_WORDS
]);
const storySets = {
  zoo: new Set(arrays.STORY_ZOO_WORDS),
  kindergarten: new Set(arrays.STORY_KINDERGARTEN_WORDS),
  helloSchool: new Set(arrays.STORY_PRIMARY_SCHOOL_WORDS)
};
const storyUnion = new Set(Object.values(storySets).flatMap((words) => [...words]));
const displayOverrides = source.match(/const DISPLAY_OVERRIDES = \{([\s\S]*?)\};/)?.[1] || "";
const textbookBlock = source.match(/const BEIJING_GRADE1_SEMESTER_1_LIBRARY = \{([\s\S]*?)\};/)?.[1] || "";
const recordEnglishResultBlock = source.match(/function recordEnglishResult[\s\S]*?\n}\n\nfunction replaceSingleEnglishCard/)?.[0] || "";
const context = {
  console,
  window: { matchMedia: () => ({ matches: false }), addEventListener: () => {} },
  document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  speechSynthesis: { cancel: () => {} },
  SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
};
vm.runInNewContext(`${source}\nglobalThis.__englishTest = { englishLibrary, SOURCE_EXAMPLES, STORY_SENTENCES, WORD_EXAMPLE_INDEX, ENGLISH_PATTERN_LIBRARY, getExamplesByWord, getExamplesByPattern, getEnglishPhonetic, getCurrentBlockPattern, getBlockAIExerciseTypes, normalizeAnswerText, isAuthenticAiMeta };`, context);
const englishTest = context.__englishTest;
const recognitionWords = new Set(englishTest.englishLibrary.map((word) => word.normalized));
const missingByStory = Object.fromEntries(
  Object.entries(storySets).map(([story, words]) => [story, [...words].filter((word) => !recognitionWords.has(word))])
);

assert(new Set(arrays.STORY_ZOO_WORDS).size === 81, "ZOO unique count should be 81");
assert(new Set(arrays.STORY_KINDERGARTEN_WORDS).size === 119, "Kindergarten unique count should be 119");
assert(new Set(arrays.STORY_PRIMARY_SCHOOL_WORDS).size === 106, "Story 3 unique count should be 106");
assert(storyUnion.size === 212, "The three Story source arrays should contain 212 unique words in union");
assert(englishTest.englishLibrary.length === 404, "The final recognition library should contain 404 words including non-Story extensions");
Object.entries(missingByStory).forEach(([story, words]) => {
  assert(words.length === 0, `${story} source words missing from recognition library: ${words.join(", ")}`);
});
assert(new Set(arrays.BEIJING_GRADE1_SEMESTER_1_WORDS).size === 0, "Beijing textbook words should stay empty until source material is provided");
assert(textbookBlock.includes('coverageStatus: "partial"'), "Beijing textbook coverage should be partial while no complete textbook is imported");
assert(textbookBlock.includes("units: []"), "Beijing textbook unit list should be dynamic and currently empty");
assert(!source.includes("beijing_grade1_unit_1"), "Do not use old Unit 1-3 source ids as full textbook ids");
assert(preBeijingMerged.size === 404, "Pre-Beijing merged English library should be 404 unique words");
assert(merged.size === 404, "Merged English library should remain 404 while Beijing textbook data is empty");
assert(englishTest.STORY_SENTENCES.length === 91, "Story paired source records should be parsed from the three provided txt files");
assert(helloSchoolLibrary.totalLessons === 32 && helloSchoolLibrary.lessons.length === 32, "Hello School lesson library should keep all 32 lessons");
assert(helloSchoolLibrary.currentLessonId === "hello-school-lesson-26", "Hello School current lesson should remain lesson 26");
assert(helloSchoolLibrary.currentAnchorSentence === "Our teacher says, “Open your books. Let’s read together.”", "Hello School current anchor sentence should remain unchanged");
const currentHelloSchoolLesson = helloSchoolLibrary.lessons.find((lesson) => lesson.lessonId === helloSchoolLibrary.currentLessonId);
assert(currentHelloSchoolLesson?.anchorSentence === helloSchoolLibrary.currentAnchorSentence, "Lesson 26 anchor sentence should match the library current anchor");
assert(englishTest.SOURCE_EXAMPLES.some((item) => item.english.includes("Good morning! I’m Miss Wang")), "Verified Story 3 original sentence should be present");
assert(englishTest.SOURCE_EXAMPLES.some((item) => item.english.includes("We run, jump and skip in the playground.")), "Skip should be connected to a Story 3 sentence");
assert(source.includes("function getExamplesByWord"), "Unified source example matcher should exist");
assert(source.includes("WORD_EXAMPLE_INDEX"), "Story matching should use a reverse word-example index");
assert(!source.includes("lemmat"), "Story example matching must not lemmatize or rewrite word forms");
assert(source.includes("/api/generate-block-example"), "Block sentence generation should use a server endpoint");
assert(source.includes("/api/english-blocks/generate"), "English Blocks AI exercises should use a server endpoint");
assert(source.includes("ENGLISH_BLOCK_EXAMPLE_CACHE_KEY"), "Block sentence generation should use local cache");
assert(source.includes("const ENGLISH_BLOCK_PATTERNS"), "English Blocks pattern library should exist");
assert((source.match(/id: "/g) || []).length >= 8, "English Blocks should include multiple local patterns");
assert(source.includes("function replaceSingleEnglishCard"), "Recognition result should replace a single card");
assert(source.includes("renderEnglishCardAtIndex(cardIndex)"), "Card interactions should rerender only one card");
assert(!recordEnglishResultBlock.includes("renderEnglishRecognition()"), "recordEnglishResult must not rerender the whole group");
assert(source.includes("data-example-text"), "Examples should be clickable text for speech and phonetics");
assert(source.includes("data-example-translation"), "Examples should have a Chinese visibility toggle");
assert(!source.includes("朗读例句<br><span>Read</span>"), "Standalone example read button should be removed");
assert(englishTest.getExamplesByWord("do").length === 12, "do should have 12 exact-token source examples");
assert(englishTest.getExamplesByWord("here").length === 9, "here should have 9 exact-token source examples");
assert(englishTest.getExamplesByWord("want").length === 3, "want should have 3 exact-token source examples");
assert(englishTest.getExamplesByWord("he").every((item) => item.normalizedTokens.includes("he")), "he must not match the");
assert(englishTest.getExamplesByWord("at").every((item) => item.normalizedTokens.includes("at")), "at must not match that");
["can't", "don't", "i'm", "it's", "what's", "let's"].forEach((word) => {
  assert(englishTest.getExamplesByWord(word).length > 0, `${word} should be retrievable despite punctuation style`);
});
assert(englishTest.getExamplesByPattern("want_to_do").length === 3, "want_to_do should connect to three source examples");
assert(englishTest.englishLibrary.every((word) => Array.isArray(word.exampleIds)), "Every English word should carry exampleIds");
assert(englishTest.englishLibrary.every((word) => englishTest.getEnglishPhonetic(word)), "Every English word should render non-empty phonetic text");

const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");
assert(html.includes('id="english-blocks"'), "Independent English Blocks page should exist");
assert(html.includes("积木英语"), "English Blocks should remain reachable inside English Planet");
assert(html.includes('id="englishWordGrid"'), "English recognition should use multi-card grid");
assert(html.includes('id="english-planet"'), "English Planet should host English modules");
assert(html.includes('class="button secondary parent-settings-button" type="button">家长设置</button>'), "Parent settings should use a single concise non-wrapping label");
assert(html.includes("<p>句型</p>"), "English Blocks should use the concise Pattern heading");
assert(html.includes('id="blocksPatternSelect"'), "English Blocks should expose a left-side pattern selector");
assert(html.includes("<p>AI练习题</p>"), "English Blocks should use one concise AI exercise heading");
assert(html.includes("<strong>AI例句数量</strong>"), "English Blocks should keep concise AI example count controls in the main example area");
assert(html.includes("<strong>题量</strong>"), "Exercise count heading should remain concise");
assert(!html.includes("Story 1—3 + 北京版结构"), "Old English Blocks source info card should be removed");
assert(!html.includes("blocksSourceTitle"), "Old source title element should be removed");
assert(!html.includes("blocksProgressMeta"), "Old progress/source metadata element should be removed");
assert(html.includes("blocks-source-filter"), "Source selector should move into the Pattern card");
const aiExampleButtonIndex = html.indexOf('id="samePatternBtn"');
const sourceButtonIndex = html.indexOf('id="blocksShowSourceBtn"');
assert(!html.includes('id="newPatternBtn"'), "Random/cycle Pattern button should be removed");
assert(aiExampleButtonIndex < sourceButtonIndex, "English Blocks buttons should put AI Example before Source");
assert(!html.includes("generated-example-controls"), "Old generated example section should be removed");
assert(!html.includes("generatePatternExamplesBtn"), "Old standalone generated example button should be removed");
assert(!html.includes("blocksGeneratedExamplesPanel"), "Old generated example panel should be removed");
assert(!html.includes("blocksRegenerateActions"), "Duplicate regenerate actions should be removed");
assert(!html.includes("regenerateCurrentBlockTypeBtn"), "Current type regeneration button should be removed");
assert(!html.includes("当前句型 / Current Pattern"), "Old Current Pattern heading must not render");
assert(!html.includes("围绕当前句型 / Based on This Pattern"), "Duplicate Based on This Pattern heading must not render");
assert(!html.includes("按需生成 / On Demand"), "Old On Demand heading must not render");
assert(html.includes("exercise-type-tabs"), "Exercise type tabs should use the v2.4.2 one-line layout");
assert(html.includes("question-count-options"), "Question count buttons should use the v2.4.2 one-line layout");
assert(source.includes("function OrderingExerciseCard"), "Ordering exercise component should exist");
assert(source.includes("function FillBlankExerciseCard"), "Fill blank exercise component should exist");
assert(source.includes("function TranslationBuildExerciseCard"), "Translation build exercise component should exist");
assert(source.includes("function ChooseCorrectExerciseCard"), "Choose correct exercise component should exist");
assert(source.includes("function PatternReplaceExerciseCard"), "Pattern replace exercise component should exist");
assert(source.includes("/api/english-blocks/examples"), "AI Example button should use the English Blocks examples endpoint");
assert(source.includes("selectedPatternId"), "AI requests should include selectedPatternId");
assert(source.includes("selectedPattern"), "AI requests should include selectedPattern payload");
assert(source.includes("blockedSentences"), "Exercise generation should send blocked sentences to prevent answer leakage");
assert(source.includes("blockExamplesCollapsed = true"), "Exercise generation should collapse examples after success");
assert(source.includes("blockExerciseError"), "Frontend should surface server quality validation failures");
assert(source.includes("function renderExamplePhoneticLine"), "English Blocks examples should render sentence phonetics");
const phoneticCss = css.match(/\.example-phonetic\s*\{[\s\S]*?\}/)?.[0] || "";
assert(phoneticCss.includes("white-space: normal"), "Example phonetic CSS should allow wrapping");
assert(phoneticCss.includes("overflow-wrap: anywhere"), "Example phonetic CSS should prevent clipping");
assert(!phoneticCss.includes("overflow: hidden"), "Example phonetic CSS must not clip text");
assert(!phoneticCss.includes("white-space: nowrap"), "Example phonetic CSS must not force one-line display");
const blockExampleRender = source.match(/function renderBlockExampleDisplay[\s\S]*?\n}\n\nfunction renderCurrentPatternExample/)?.[0] || "";
assert(blockExampleRender.includes("example-phonetic"), "English Blocks example display should include phonetic rendering");
assert(!blockExampleRender.includes("example-blocks"), "English Blocks example display should not render sentence block chips");
assert(!source.includes("句型示范 / Pattern Example"), "English Blocks should not render old Pattern Example title");
assert(source.includes("function shuffleUntilDifferent"), "shuffleUntilDifferent should exist");
assert(!source.includes("sort(() => Math.random() - 0.5)"), "Shuffle must not use random sort");

const pattern = englishTest.getCurrentBlockPattern();
assert(englishTest.ENGLISH_PATTERN_LIBRARY.length > 30, "Pattern library should contain more than 30 patterns");
const patternIds = new Set();
englishTest.ENGLISH_PATTERN_LIBRARY.forEach((item) => {
  assert(item.id, "Every pattern needs an id");
  assert(!patternIds.has(item.id), `Duplicate pattern id: ${item.id}`);
  patternIds.add(item.id);
  assert(item.category, `${item.id} should have a category`);
  assert(item.displayZh, `${item.id} should have displayZh`);
  assert(item.displayEn, `${item.id} should have displayEn`);
  assert(item.explanationZh, `${item.id} should have explanationZh`);
  assert(Array.isArray(item.sourceTags) && item.sourceTags.length > 0, `${item.id} should have sourceTags`);
  assert(Array.isArray(item.exampleSeeds) && item.exampleSeeds.length > 0, `${item.id} should have exampleSeeds`);
});
assert(source.includes('{ id: "all_sources", label: "全部来源" }'), "Source filter should say 全部来源");
assert(!source.includes("全部句型") && !source.includes("All Patterns"), "Source filter should not say All Patterns");
assert(source.includes("function setSelectedBlockPatternId"), "Pattern selector should persist selected pattern");
assert(source.includes("english-blocks-selected-pattern-id-v1"), "Selected pattern should use localStorage");
const exerciseTypes = englishTest.getBlockAIExerciseTypes().map((type) => type.id);
assert(exerciseTypes.length === 5, "English Blocks should expose five AI exercise types");
assert(!source.includes("function makeLocalExerciseSet"), "AI exercise generation must not expose a local template generator");
assert(!source.includes("ai_fallback"), "AI examples must not silently fall back to local examples");
assert(source.includes("isAuthenticAiMeta"), "AI rendering should verify generation meta");
assert(englishTest.isAuthenticAiMeta({ provider: "deepseek", model: "deepseek-v4-pro", requestId: "test-123", latencyMs: 1200 }), "DeepSeek meta should be accepted");
assert(!englishTest.isAuthenticAiMeta({ provider: "deepseek", model: "deepseek-v4-pro", latencyMs: 1200 }), "DeepSeek meta without requestId must be rejected");
assert(!englishTest.isAuthenticAiMeta({ provider: "deepseek", model: "deepseek-v4-pro", requestId: "test-123", latencyMs: 95000 }), "Too-slow DeepSeek meta must be rejected");
assert(!englishTest.isAuthenticAiMeta({ provider: "local", model: "template" }), "Local meta must be rejected");
assert(!englishTest.isAuthenticAiMeta({ provider: "mock", model: "mock" }), "Mock meta must be rejected");

[
  "book", "books", "sit", "sits", "stand", "stands", "starts",
  "say", "says", "panda", "pandas", "run", "runs", "teach", "teaches",
  "i'm", "it's", "what's", "let's"
].forEach((word) => assert(merged.has(word), `Expected ${word} to be preserved`));

[
  "i", "i'm", "it's", "what's", "let's", "amy", "helen", "miss", "wang", "ok"
].forEach((word) => {
  assert(displayOverrides.includes(`${word}:`) || displayOverrides.includes(`"${word}"`), `Missing display override for ${word}`);
});

console.log(JSON.stringify({
  zoo: new Set(arrays.STORY_ZOO_WORDS).size,
  kindergarten: new Set(arrays.STORY_KINDERGARTEN_WORDS).size,
  story3: new Set(arrays.STORY_PRIMARY_SCHOOL_WORDS).size,
  storyUnion: storyUnion.size,
  recognitionMerged: englishTest.englishLibrary.length,
  missingByStory,
  beijingRaw: arrays.BEIJING_GRADE1_SEMESTER_1_WORDS.length,
  beijingUnique: new Set(arrays.BEIJING_GRADE1_SEMESTER_1_WORDS).size,
  preBeijingMerged: preBeijingMerged.size,
  merged: merged.size,
  textbookCoverage: "partial",
  verifiedStorySentences: englishTest.STORY_SENTENCES.length,
  doExamples: englishTest.getExamplesByWord("do").length,
  hereExamples: englishTest.getExamplesByWord("here").length,
  wantExamples: englishTest.getExamplesByWord("want").length,
  hasEnglishBlocksPage: true,
  startInProvidedArrays: merged.has("start"),
  note: "Beijing Grade 1A source is scaffolded as partial; no textbook words are fabricated."
}, null, 2));
