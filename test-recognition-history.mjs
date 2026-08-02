import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const appSource = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const historySource = fs.readFileSync(new URL("./data/learning-history/helen-recognition-history-v1.js", import.meta.url), "utf8");
const storageKey = "hanzi-memory-app-v1";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeContext(savedState = null, profileOverride = null) {
  const store = {};
  if (savedState) store[storageKey] = JSON.stringify(savedState);
  const context = {
    console,
    TextEncoder,
    URL,
    URLSearchParams,
    Blob,
    Date,
    Math,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    window: {
      matchMedia: () => ({ matches: false }),
      addEventListener: () => {},
      setTimeout: (fn) => fn()
    },
    document: {
      addEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => []
    },
    localStorage: {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; }
    },
    speechSynthesis: { cancel: () => {}, speak: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
  };
  vm.runInNewContext(historySource, context);
  if (profileOverride) context.HELEN_RECOGNITION_HISTORY = profileOverride;
  vm.runInNewContext(`${appSource}
globalThis.__recognitionTest = {
  state,
  buildHistoricalRecognitionSnapshot,
  getCharacterPracticeLibrary,
  getCharacterPracticePriority,
  initializeHistoricalRecognitionProfile,
  updateChineseRecognitionResult,
  recordPassiveRecognitionEvidence,
  mergeChinesePackTargets,
  syncReadingAnnotationEvidence
};`, context);
  context.__store = store;
  return context;
}

{
  const context = makeContext();
  const { state, buildHistoricalRecognitionSnapshot } = context.__recognitionTest;
  assert(state.recognitionHistoryVersion === 2, "History profile should migrate to version 2");
  ["叼", "漂", "领", "绕"].forEach((char) => {
    assert(state.learnerChars[char]?.status === "mastered", `${char} should use its later mastered evidence`);
    assert(state.learnerChars[char]?.inCharacterPractice === false, `${char} should exit character practice`);
  });
  assert(state.learnerChars["逐"]?.status === "unstable", "逐 should use the later Day12 unsure evidence");
  assert(state.learnerChars["逐"]?.inCharacterPractice === true, "逐 should remain active");
  const custom = buildHistoricalRecognitionSnapshot({
    chinese: { days: [{ dayId: "Day1", unknown: "同", unsure: "", mastered: "同" }] }
  });
  assert(custom.get("同")?.latest?.status === "mastered", "Explicit mastered evidence should win within the same day");
}

{
  const context = makeContext({
    recognitionHistoryVersion: 1,
    learnerChars: {
      "叼": {
        char: "叼",
        status: "unknown",
        latestStatus: "unknown",
        inCharacterPractice: true,
        historicalStatus: "unknown",
        historyOrder: 7
      }
    },
    wordbook: {
      "叼": { text: "叼", note: "keep-me", addedAt: "2026-07-20T00:00:00.000Z" }
    }
  });
  const { state } = context.__recognitionTest;
  assert(state.learnerChars["叼"].status === "mastered", "Old migrated status fields must not override newer static mastery");
  assert(state.learnerChars["叼"].inCharacterPractice === false, "Old inCharacterPractice residue must not keep mastered chars active");
  assert(state.wordbook["叼"]?.note === "keep-me", "Migration must not clear the wordbook");
}

{
  const laterAt = Date.parse("2026-07-28T08:00:00+08:00");
  const context = makeContext({
    recognitionHistoryVersion: 1,
    learnerChars: { "叼": { char: "叼", status: "unknown", inCharacterPractice: true } },
    chineseRecognition: {
      version: 2,
      items: {
        "char:叼": {
          itemId: "char:叼",
          seenCount: 1,
          masteryCount: 0,
          unsureCount: 0,
          unknownCount: 1,
          skipCount: 0,
          hintCount: 0,
          lastSeenAt: laterAt,
          lastResult: "unknown",
          recentResults: ["unknown"]
        }
      },
      recentlyShownIds: []
    }
  });
  const { state } = context.__recognitionTest;
  assert(state.learnerChars["叼"].status === "unknown", "A real later recognition action should override static mastery");
  assert(state.learnerChars["叼"].inCharacterPractice === true, "A real later unknown result should re-enter practice");
}

{
  const beforeAuditAt = Date.parse("2026-07-26T08:00:00+08:00");
  const context = makeContext({
    recognitionHistoryVersion: 1,
    learnerChars: {
      "叼": {
        char: "叼",
        liveSources: [{ dayId: "Day9", sectionId: "reading", status: "unknown", recordedAt: new Date(beforeAuditAt).toISOString() }]
      }
    }
  });
  const { state } = context.__recognitionTest;
  assert(state.learnerChars["叼"].status === "mastered", "An older same-Day marker must not override the later audited mastery evidence");
  assert(state.learnerChars["叼"].inCharacterPractice === false, "An older same-Day marker must not reactivate a mastered character");
}

{
  const context = makeContext();
  const api = context.__recognitionTest;
  api.updateChineseRecognitionResult("叼", "unknown", false);
  assert(api.state.learnerChars["叼"].inCharacterPractice === true, "A later unknown result should re-enter practice");
  assert(api.getCharacterPracticeLibrary().some((item) => item.char === "叼"), "Re-entered character should be visible in practice");
  assert(api.recordPassiveRecognitionEvidence("叼", "Day15:reading") === false, "One later unmarked reading should not retire a character");
  assert(api.recordPassiveRecognitionEvidence("叼", "Day16:reading") === true, "Two later unmarked readings should retire a character");
  assert(api.state.learnerChars["叼"].status === "mastered" && !api.state.learnerChars["叼"].inCharacterPractice, "Passive mastery should exit practice");
  assert(!api.getCharacterPracticeLibrary().some((item) => item.char === "叼"), "Passively mastered character should disappear from practice");
  api.updateChineseRecognitionResult("叼", "unsure", false);
  assert(api.state.learnerChars["叼"].inCharacterPractice === true, "Later unsure evidence should re-enter after passive mastery");
  assert(api.state.learnerChars["叼"].passiveRecognitionDays.length === 0, "New difficulty should restart the two-reading counter");
}

{
  const context = makeContext();
  const api = context.__recognitionTest;
  api.updateChineseRecognitionResult("逐", "mastered", false);
  assert(api.state.learnerChars["逐"].status === "mastered", "One explicit 已掌握 action should be authoritative");
  assert(api.state.learnerChars["逐"].inCharacterPractice === false, "One explicit 已掌握 action should exit practice");
  assert(!api.getCharacterPracticeLibrary().some((item) => item.char === "逐"), "An explicitly mastered character should disappear immediately");
}

{
  const context = makeContext();
  const api = context.__recognitionTest;
  api.mergeChinesePackTargets({
    chinese: {
      characters: [{ text: "新", status: "target" }],
      words: []
    }
  }, "daily_pack:test", "2026-07-28T09:00:00.000Z");
  assert(api.state.learnerChars["新"]?.inCharacterPractice === true, "A new pack target should enter character practice");
  api.syncReadingAnnotationEvidence("读", "unknown", "reading");
  assert(api.state.learnerChars["读"]?.inCharacterPractice === true, "A reading click marker should enter character practice");
}

{
  const context = makeContext();
  const api = context.__recognitionTest;
  api.state.learnerChars["甲"] = { char: "甲", status: "unknown", inCharacterPractice: true, historicalFoundCount: 3, latestDifficultyOrder: 10 };
  api.state.learnerChars["乙"] = { char: "乙", status: "unknown", inCharacterPractice: true, historicalFoundCount: 1, latestDifficultyOrder: 10 };
  assert(api.getCharacterPracticePriority("甲") > api.getCharacterPracticePriority("乙"), "Repeated difficulty should sort ahead when recency is equal");
  api.state.learnerChars["丙"] = { char: "丙", status: "unstable", inCharacterPractice: true, historicalFoundCount: 1, latestDifficultyOrder: 14 };
  api.state.learnerChars["丁"] = { char: "丁", status: "unstable", inCharacterPractice: true, historicalFoundCount: 1, latestDifficultyOrder: 10 };
  assert(api.getCharacterPracticePriority("丙") > api.getCharacterPracticePriority("丁"), "More recent difficulty should sort ahead when frequency is equal");
}

assert(!appSource.includes("已审计历史") && !appSource.includes("多次不认识优先"), "Student practice stats should not contain technical explanations");
assert(appSource.includes('$("#characterSetMeta").textContent = `共 ${library.length} 字`'), "Student practice stats should stay concise");

console.log(JSON.stringify({
  ok: true,
  historyVersion: 2,
  verified: [
    "later mastered evidence exits practice",
    "old migration residue is ignored",
    "later live difficulty re-enters practice",
    "two later unmarked readings exit practice",
    "pack targets and reading markers enter practice",
    "frequency and recency affect ordering",
    "wordbook remains intact",
    "student stats remain concise"
  ]
}, null, 2));
