import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const appPath = "/Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/app.js";
const appSource = fs.readFileSync(appPath, "utf8");
const candidatePath = "/Users/jackie/Documents/Codex/2026-08-02/nick-nic-nick-alan/outputs/2026-08-05-latest-text-feedback-run-01/nick-next-course-candidate-revision-8.json";
const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));

function makeContext() {
  const store = {};
  const localStorage = {
    store,
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; }
  };
  const context = {
    console,
    TextEncoder,
    window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, location: { origin: "http://localhost" } },
    document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
    localStorage,
    speechSynthesis: { cancel: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
  };
  vm.runInNewContext(`${appSource}\nglobalThis.__revision8Test = { parseLearningPackInput, buildLearningPackPreview, importLearningPack, auditChineseFeedbackImportGate, state };`, context);
  return context;
}

const context = makeContext();
const api = context.__revision8Test;
const parsed = api.parseLearningPackInput(JSON.stringify(candidate));
const preview = api.buildLearningPackPreview(parsed);
const sectionIds = parsed.chinese.lesson.sections.map((section) => section.id);
const expectedSections = ["review_words", "fill_blanks", "reading_excerpts", "word_understanding", "four_grid_retell", "comprehension", "fixed_break", "transfer_scenario", "post_check"];
assert.equal(JSON.stringify(sectionIds), JSON.stringify(expectedSections), "production parser must retain repaired section order");
assert.equal(parsed.semanticReview.status, "approved");
assert.equal(parsed.semanticReview.candidateDigest, candidate.contentDigest);
assert.equal(parsed.releaseAudit.ready, true);
assert.equal(preview.valid, true, `candidate preview must be valid: ${(preview.errors || []).join(";")}`);
assert.equal(JSON.stringify(preview.auditBlockers || []), "[]", "ready candidate must have no runtime audit blockers");
const retell = parsed.chinese.lesson.sections.find((section) => section.id === "four_grid_retell");
assert.equal(retell.prompts.length, 4);
assert.equal(retell.questions?.length || 0, 0, "legacy single retell question must not survive normalization");
const breakSection = parsed.chinese.lesson.sections.find((section) => section.id === "fixed_break");
assert.equal(breakSection.type, "break");
assert.equal((breakSection.questions || []).length, 0);
assert.equal(breakSection.parentOnly.pauseBehavior.resumeOn, "manual_end");

const beforeImportState = JSON.stringify(api.state);
const beforeImportStorage = JSON.stringify(context.localStorage.store);
api.importLearningPack(parsed, preview, { select: false, markLatest: false });
assert.ok(api.state.learningPacks[candidate.packId], "valid pack must be imported in isolated runtime");
assert.equal(api.state.learningPacks[candidate.packId].data.contentDigest, candidate.contentDigest);
const archiveCountAfterFirst = api.state.learningPackArchive.entries.filter((entry) => entry.packId === candidate.packId).length;
api.importLearningPack(parsed, preview, { select: false, markLatest: false });
const archiveCountAfterSecond = api.state.learningPackArchive.entries.filter((entry) => entry.packId === candidate.packId).length;
assert.equal(archiveCountAfterSecond, archiveCountAfterFirst, "duplicate import must be idempotent");

const stateAfterValidImport = JSON.stringify(api.state);
const storageAfterValidImport = JSON.stringify(context.localStorage.store);
const invalid = JSON.parse(JSON.stringify(candidate));
invalid.releaseAudit.ready = false;
const invalidParsed = api.parseLearningPackInput(JSON.stringify(invalid));
const invalidPreview = api.buildLearningPackPreview(invalidParsed);
assert.equal(invalidPreview.valid, false, "invalid audit marker must stay blocked");
assert.ok((invalidPreview.auditBlockers || []).includes("CN-IMPORT-AUDIT"), "invalid audit marker must expose CN-IMPORT-AUDIT");
assert.throws(() => api.importLearningPack(invalidParsed, invalidPreview, { select: false, markLatest: false }), /审核中|质量门闸|不能导入/);
assert.equal(JSON.stringify(api.state), stateAfterValidImport, "blocked import must not mutate state");
assert.equal(JSON.stringify(context.localStorage.store), storageAfterValidImport, "blocked import must not write localStorage");

console.log(JSON.stringify({
  ok: true,
  packId: parsed.packId,
  previewValid: preview.valid,
  auditBlockers: preview.auditBlockers || [],
  sections: sectionIds,
  fourGridPrompts: retell.prompts.length,
  duplicateImportIdempotent: archiveCountAfterSecond === archiveCountAfterFirst,
  invalidImportZeroWrite: JSON.stringify(api.state) === stateAfterValidImport && JSON.stringify(context.localStorage.store) === storageAfterValidImport,
  firstStateUnchangedBeforeImport: beforeImportState !== JSON.stringify(api.state),
  firstStorageUnchangedBeforeImport: beforeImportStorage !== JSON.stringify(context.localStorage.store)
}, null, 2));
