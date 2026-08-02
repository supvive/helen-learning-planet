import fs from "node:fs";
import vm from "node:vm";

const appSource = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const stylesSource = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractFunction(name, nextName) {
  const start = appSource.indexOf(`function ${name}`);
  const end = appSource.indexOf(`function ${nextName}`, start);
  assert(start >= 0 && end > start, `Could not extract ${name}`);
  return appSource.slice(start, end);
}

const context = {
  COURSE_RESULT_LABELS: {
    independent: "独立完成",
    prompted: "少量提醒",
    modeled: "示范后完成",
    not_yet: "暂未完成"
  }
};
vm.runInNewContext([
  extractFunction("escapeHtml", "displayText"),
  extractFunction("formatClock", "getRecordingClipsForActivity"),
  extractFunction("renderCourseResultControls", "renderRecordingCard"),
  extractFunction("renderBreakCard", "formatClock")
].join("\n"), context);

const resultHtml = context.renderCourseResultControls("chinese:four_grid", { result: "prompted" });
assert(resultHtml.includes('data-course-result="chinese:four_grid"'), "Feedback controls must keep data-course-result");
assert(resultHtml.includes('data-result-value="prompted"'), "Feedback controls must keep data-result-value");

const initialBreak = context.renderBreakCard("chinese:break", "课间休息", 5, {}, "喝水、看远处");
assert(initialBreak.includes('<span>休</span><h3>课间休息</h3>'), "Break card must keep the 休 marker and title");
assert(initialBreak.includes('class="break-countdown'), "Break card must render its countdown");
assert(initialBreak.includes('data-break-start="chinese:break"') && initialBreak.includes('data-break-end="chinese:break"'), "Break card must render both controls");
assert(initialBreak.includes('data-break-end="chinese:break" disabled'), "End must be disabled before a break starts");

const activeBreak = context.renderBreakCard("chinese:break", "课间休息", 5, {
  breakStartedAt: 1_000,
  breakEndsAt: 301_000,
  breakResumeRecordingOnEnd: true
}, "喝水、看远处");
assert(activeBreak.includes("is-active"), "Active break countdown must retain its state class");
assert(/data-break-start="chinese:break"[^>]*\sdisabled/.test(activeBreak), "Start must be disabled while a break is active");
assert(!activeBreak.includes('data-break-end="chinese:break" disabled'), "End must remain enabled while a break is active");

const finishedBreak = context.renderBreakCard("chinese:break", "课间休息", 5, { breakFinishedAt: "2026-08-02T10:00:00.000Z" });
assert(/data-break-start="chinese:break"[^>]*\sdisabled/.test(finishedBreak) && /data-break-end="chinese:break"[^>]*\sdisabled/.test(finishedBreak), "Finished breaks must keep both controls visible but disabled");

assert(/\.course-result-row\s*,[\s\S]*?display:\s*flex;/.test(stylesSource), "Feedback rows must inherit flex layout");
assert(!/\.course-result-group \.course-result-row\s*\{[^}]*display:\s*grid/.test(stylesSource), "Feedback rows must not use the four-column grid override");
assert(!/\.course-result-group \.course-result-row\s*\{[^}]*grid-template-columns/.test(stylesSource), "Feedback rows must not use grid columns");
assert(/\.course-result-group \.course-result-row \.button\s*\{[^}]*min-width:\s*fit-content/.test(stylesSource), "Feedback buttons must keep natural minimum width");
assert(/\.course-result-row \.compact-button[\s\S]*?min-height:\s*44px/.test(stylesSource), "Feedback buttons must keep 44px touch height");
assert(/\.break-card\s*\{[^}]*background:\s*rgba\(234,\s*245,\s*226,\s*0\.72\)/.test(stylesSource), "Break cards must use the green surface");
assert(/\.break-countdown\s*\{[^}]*font-size:\s*clamp\(40px,\s*8vw,\s*72px\)[^}]*text-align:\s*center/.test(stylesSource), "Break countdown must be large and centered");

console.log("course visual regressions: ok");
