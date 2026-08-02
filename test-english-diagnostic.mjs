import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const manifest = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/manifest.json", import.meta.url), "utf8"));
const library = JSON.parse(fs.readFileSync(new URL("./data/english-libraries/hello-school-32-lesson-library.json", import.meta.url), "utf8"));

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

function makeContext(seed = {}) {
  const localStorage = createLocalStorage(seed);
  const context = {
    console,
    TextEncoder,
    window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, location: { origin: "http://localhost", protocol: "http:", href: "http://localhost/" } },
    document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
    location: { hash: "", pathname: "/", protocol: "http:", href: "http://localhost/" },
    localStorage,
    speechSynthesis: { cancel: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
  };
  vm.runInNewContext(source + "\n" + [
    "globalThis.__diagnosticTest = {",
    "  parseLearningPackInput, buildLearningPackPreview, importLearningPack,",
    "  importEnglishLessonLibrary, getEnglishLessonLibrary, getEnglishLessonSteps,",
    "  getLearningCourseSequence, getActiveEnglishPack, isAdaptiveEnglishPack,",
    "  initializeCourseProgress, buildFeedbackPackage, state, localStorage",
    "};"
  ].join("\n"), context);
  return context;
}

const entries = manifest.packs.filter((entry) => /^2026-08-\d{2}-english-diagnostic-d\d{2}$/.test(entry.packId));
assert(entries.length === 14, "Expected 14 diagnostic packs, found " + entries.length);
assert(entries.every((entry) => entry.availableSubjects?.length === 1 && entry.availableSubjects[0] === "english"), "Diagnostic packs must schedule English only");
const rawPacks = entries.map((entry) => ({
  entry,
  raw: fs.readFileSync(new URL("./data/learning-packs/" + entry.path.replace(/^\.\//, ""), import.meta.url), "utf8")
}));
assert(rawPacks.every(({ raw }) => JSON.parse(raw).english.courseArchitectureVersion === "letter-planet-adaptive/1"), "All diagnostic packs must use the adaptive architecture");

{
  const context = makeContext();
  for (const item of rawPacks) {
    const beforeState = JSON.stringify(context.__diagnosticTest.state);
    const beforeStorage = JSON.stringify(context.__diagnosticTest.localStorage.store);
    const parsed = context.__diagnosticTest.parseLearningPackInput(item.raw);
    const preview = context.__diagnosticTest.buildLearningPackPreview(parsed);
    assert(preview.valid && preview.warnings.length === 0, item.entry.packId + " should parse without warnings");
    assert(JSON.stringify(context.__diagnosticTest.state) === beforeState, item.entry.packId + " parse/preview must not mutate in-memory state");
    assert(JSON.stringify(context.__diagnosticTest.localStorage.store) === beforeStorage, item.entry.packId + " parse/preview must not mutate persisted state");
    const activities = parsed.english.lesson.activities;
    assert(activities.length >= 5 && activities.length <= 7, item.entry.packId + " must contain 5–7 activities");
    assert(activities.slice(0, 4).every((activity) => activity.interaction.delivery === "daily_english_listening"), item.entry.packId + " first four activities must use Daily English Listening");
    assert(activities.slice(4).every((activity) => ["website", "website_and_daily_english_listening"].includes(activity.interaction.delivery)), item.entry.packId + " website activities must follow the first four");
    assert(new Set(activities.map((activity) => activity.activityId)).size === activities.length, item.entry.packId + " activity ids must be unique");
    assert(parsed.english.lesson.durationByMode.lightMinutes >= 15 && parsed.english.lesson.durationByMode.lightMinutes <= 20, item.entry.packId + " light duration must be 15–20 minutes");
    assert(parsed.english.lesson.durationByMode.standardMinutes >= 20 && parsed.english.lesson.durationByMode.standardMinutes <= 25, item.entry.packId + " standard duration must be 20–25 minutes");
  }
}

{
  const context = makeContext();
  context.__diagnosticTest.importEnglishLessonLibrary(library, { source: "diagnostic_test" });
  const historicalPack = context.__diagnosticTest.getActiveEnglishPack();
  const wordFocusBefore = JSON.stringify(context.__diagnosticTest.getEnglishLessonLibrary().lessons.map((lesson) => lesson.wordFocus));
  context.__diagnosticTest.initializeCourseProgress(historicalPack);
  context.__diagnosticTest.state.courseProgress[historicalPack.packId].english.steps["english:blocks"] = {
    startedAt: "2026-08-02T08:00:00.000Z",
    finishedAt: "2026-08-02T08:05:00.000Z",
    result: "independent",
    attempts: 1
  };
  const historicalProgressBefore = JSON.stringify(context.__diagnosticTest.state.courseProgress[historicalPack.packId]);
  const historicalLibraryStateBefore = JSON.stringify(context.__diagnosticTest.getEnglishLessonLibrary());
  const parsedPacks = rawPacks.map((item) => context.__diagnosticTest.parseLearningPackInput(item.raw));
  parsedPacks.forEach((pack, index) => {
    const result = context.__diagnosticTest.importLearningPack(pack, context.__diagnosticTest.buildLearningPackPreview(pack), {
      select: false, markLatest: false, publishedAt: entries[index].publishedAt
    });
    assert(result.added === 0 && result.updated === 0, pack.packId + " must not add unapproved English words");
  });
  assert(JSON.stringify(context.__diagnosticTest.getEnglishLessonLibrary()) === historicalLibraryStateBefore, "Importing diagnostic packs must not mutate Hello School library");
  assert(JSON.stringify(context.__diagnosticTest.getEnglishLessonLibrary().lessons.map((lesson) => lesson.wordFocus)) === wordFocusBefore, "Diagnostic packs must preserve historical wordFocus");
  assert(JSON.stringify(context.__diagnosticTest.state.courseProgress[historicalPack.packId]) === historicalProgressBefore, "Diagnostic packs must preserve historical English progress");
  const sequence = context.__diagnosticTest.getLearningCourseSequence("english");
  assert(sequence.length === 14 && sequence.at(-1).packId === entries.at(-1).packId, "Diagnostic packs must form a 14-day English sequence");

  const first = parsedPacks[0];
  const light = context.__diagnosticTest.getEnglishLessonSteps(first, "light");
  const standard = context.__diagnosticTest.getEnglishLessonSteps(first, "standard");
  assert(light.length >= 5 && light.length <= standard.length && standard.length <= 7, "Light/standard mode must filter only standard-only activities");
  assert(light.slice(0, 4).every((activity) => activity.interaction.delivery === "daily_english_listening"), "Light mode must keep the four external activities first");
  assert(standard.slice(0, 4).every((activity) => activity.interaction.delivery === "daily_english_listening"), "Standard mode must keep the four external activities first");
}

{
  const context = makeContext();
  const pack = context.__diagnosticTest.parseLearningPackInput(rawPacks[0].raw);
  const first = context.__diagnosticTest.importLearningPack(pack, context.__diagnosticTest.buildLearningPackPreview(pack), { select: true, markLatest: true });
  const firstRecord = context.__diagnosticTest.state.learningPacks[pack.packId];
  const second = context.__diagnosticTest.importLearningPack(pack, context.__diagnosticTest.buildLearningPackPreview(pack), { select: true, markLatest: true });
  assert(first.added === 0 && second.repeat && second.added === 0 && second.updated === 0, "Repeated diagnostic import must be idempotent");
  const secondRecord = context.__diagnosticTest.state.learningPacks[pack.packId];
  assert(secondRecord.importCount === firstRecord.importCount && secondRecord.targets.length === firstRecord.targets.length, "Repeated diagnostic import must not duplicate data");

  context.__diagnosticTest.state.selectedLearningPackId = pack.packId;
  context.__diagnosticTest.state.englishCourseSource = "adaptive";
  context.__diagnosticTest.initializeCourseProgress(pack);
  const progress = context.__diagnosticTest.state.courseProgress[pack.packId].english;
  const activity = pack.english.lesson.activities[0];
  const key = "english:" + activity.activityId;
  progress.steps[key] = {
    adaptiveAnswer: "yes",
    result: "prompted",
    attempts: 2,
    hintLevelUsed: 1,
    elapsedMs: 4200,
    recordingClipIds: ["clip-diagnostic-1"],
    finishedAt: "2026-08-02T08:10:00.000Z"
  };
  const feedback = context.__diagnosticTest.buildFeedbackPackage("english").payload;
  assert(feedback.schemaVersion === "helen-learning-feedback/1", "Diagnostic feedback must keep the existing top-level schema");
  const diagnostic = feedback.english.adaptive;
  assert(diagnostic.routeDay && diagnostic.baselineOrRetest && Array.isArray(diagnostic.strengths) && Array.isArray(diagnostic.reviewQueue) && diagnostic.nextRecommendation, "Diagnostic feedback must include route metadata");
  const activityFeedback = diagnostic.activities.find((item) => item.activityId === activity.activityId);
  assert(activityFeedback?.completion === "completed" && activityFeedback?.result === "prompted" && activityFeedback?.adaptiveAnswer === "yes", "Adaptive feedback must retain completion/result/answer");
  assert(activityFeedback?.attempts === 2 && activityFeedback?.hintLevelUsed === 1 && activityFeedback?.elapsedSeconds === 4, "Adaptive feedback must retain attempts/hints/elapsed time");
  assert(JSON.stringify(activityFeedback?.recordingClipIds) === JSON.stringify(["clip-diagnostic-1"]), "Adaptive feedback must retain recording clips");
  assert(activityFeedback?.evidenceTargetIds?.length, "Adaptive feedback must retain activity evidenceTargetIds");
}

console.log(JSON.stringify({ ok: true, diagnosticPacks: entries.length }, null, 2));
