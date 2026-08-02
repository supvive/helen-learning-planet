import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pack(day) {
  return JSON.parse(fs.readFileSync(new URL(`./data/learning-packs/english-diagnostic-${day.toLowerCase()}.json`, import.meta.url)));
}

const context = {
  console,
  TextEncoder,
  window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, location: { origin: "http://localhost", protocol: "http:", href: "http://localhost/" } },
  document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
  location: { hash: "", pathname: "/", protocol: "http:", href: "http://localhost/" },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  speechSynthesis: { cancel: () => {} },
  SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {}
};
vm.runInNewContext(source + `\nglobalThis.__letterTest = { parseLearningPackInput, renderAdaptiveEnglishActivity, renderAdaptiveSourceCard, renderAdaptiveProgressRail };`, context);

const parsed = {};
for (const day of ["D01", "D14"]) {
  parsed[day] = context.__letterTest.parseLearningPackInput(JSON.stringify(pack(day)));
  const activities = parsed[day].english.lesson.activities;
  assert(activities.length === 6, `${day} must contain exactly six activities`);
  assert(activities.every((activity, index) => activity.activityId === `${day.toLowerCase()}_0${index + 1}`), `${day} activity ids must remain dXX_01–dXX_06`);
  assert(activities.map((activity) => activity.titleZh).join("|") === "听对整句|听懂用途|盲听抓词|听后找关键部分|换场景说一句|完成一轮回应", `${day} titles must use the fixed six-question contract`);
  activities.slice(0, 4).forEach((activity, index) => {
    const interaction = activity.interaction;
    ["externalTool", "libraryId", "materialId", "materialIds", "lessonIndex", "sourceSentenceId", "playCount", "hideEnglish"].forEach((field) => assert(interaction[field] !== undefined, `${day} Q${index + 1} missing ${field}`));
    assert(interaction.externalTool === "每日英语听力", `${day} Q${index + 1} must name the audio source`);
    assert(interaction.lessonIndex >= 1 && interaction.lessonIndex <= 32, `${day} Q${index + 1} must expose a lesson index`);
    assert(interaction.sourceSentenceId === interaction.materialId, `${day} Q${index + 1} must keep one source sentence id for its material`);
    assert(interaction.sourceSentenceId && interaction.sourceSentenceId === activities[0].interaction.sourceSentenceId, `${day} sourceSentenceId must remain stable across the listening set`);
  });
  assert((activities[2].childVisible.options || []).length === 3, `${day} Q3 must have three options`);
  assert(activities[2].childVisible.instructionZh.includes("英文暂时隐藏"), `${day} Q3 must explicitly hide English before playback`);
  assert(activities[3].childVisible.categoryZh, `${day} Q4 must expose a listening category`);
  assert(activities[4].recording?.mode === "required_response" && activities[5].recording?.mode === "required_response", `${day} Q5/Q6 need recording controls`);
}

const steps = parsed.D14.english.lesson.activities;
const emptyProgress = { english: { steps: {} } };
const q3Before = context.__letterTest.renderAdaptiveEnglishActivity(parsed.D14, steps[2], 2, 6, "light", emptyProgress);
assert(!q3Before.includes("Goodbye") && !q3Before.includes("tomorrow") && !q3Before.includes("morning"), "D14 Q3 must not expose its target words before playback");
const q3After = context.__letterTest.renderAdaptiveEnglishActivity(parsed.D14, steps[2], 2, 6, "light", { english: { steps: { "english:d14_03": { audioPlayCount: 2 } } } });
assert(q3After.includes("Goodbye") && q3After.includes("tomorrow") && q3After.includes("morning"), "D14 Q3 options must appear after the required plays");
const q5 = context.__letterTest.renderAdaptiveEnglishActivity(parsed.D01, parsed.D01.english.lesson.activities[4], 4, 6, "light", emptyProgress);
const q6 = context.__letterTest.renderAdaptiveEnglishActivity(parsed.D14, parsed.D14.english.lesson.activities[5], 5, 6, "light", emptyProgress);
assert(q5.includes("录音回应") && q5.includes("新场景") && q5.includes("先说者") && q5.includes("你的回应"), "Q5 must show scene, speaker and recording");
assert(q6.includes("录音回应") && q6.includes("先说者") && q6.includes("你的回应"), "Q6 must show speaker, response and recording");
assert(/adaptive-progress-rail/.test(styles) && /overflow-x:\s*auto/.test(styles), "The six-question rail must stay scroll-safe on narrow screens");
assert(/adaptive-source-card/.test(styles) && /adaptive-recording-card/.test(styles), "Letter source and recording cards need dedicated visual styles");
assert(/overflow-wrap:\s*anywhere/.test(styles), "Long English source text must wrap safely");

console.log(JSON.stringify({ ok: true, lessons: ["D01", "D14"], activitiesPerLesson: 6 }, null, 2));
