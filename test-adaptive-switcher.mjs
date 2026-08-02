import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
const vmSource = source + "\n" + "globalThis.__switcherTest = { getAdaptiveEnglishCourseOptionLabel };";
vm.runInNewContext(vmSource, context);

const option = context.__switcherTest.getAdaptiveEnglishCourseOptionLabel({
  title: "基线听辨",
  pack: { english: { lesson: { diagnostic: { routeDay: "D01" } } } }
});
assert(option === "D01｜基线听辨", `Diagnostic option should be compact, got ${option}`);
assert(source.includes('class="course-pack-select-label adaptive-course-select-label"'), "Adaptive selector should render a visible course-list label");
assert(source.includes("<span>课程列表</span>"), "Adaptive selector should expose the short visible label 课程列表");
assert(source.includes("getAdaptiveEnglishCourseOptionLabel(item)"), "Adaptive selector should use compact option labels");
assert(/\.english-adaptive-switcher\s*\{[\s\S]*?grid-template-columns:\s*auto minmax\(180px, 1fr\) auto auto;[\s\S]*?align-items:\s*center;/.test(css), "Desktop adaptive switcher should reserve four columns on one baseline");
assert(!/\.adaptive-history-link\s*\{[\s\S]*?margin-top:\s*-6px/.test(css), "Adaptive history link should not use a vertical offset hack");
assert(/\.date-switcher\.english-adaptive-switcher > \.adaptive-course-select-label[\s\S]*?grid-column:\s*1 \/ -1[\s\S]*?grid-row:\s*1/.test(css), "Mobile adaptive switcher should keep the selector on row one");
assert(/\.date-switcher\.english-adaptive-switcher > \[data-course-sequence-nav="prev"\][\s\S]*?grid-row:\s*2/.test(css) && /\.date-switcher\.english-adaptive-switcher > \[data-english-history-library\][\s\S]*?grid-row:\s*3/.test(css), "Mobile adaptive switcher should preserve the three-row layout");

console.log(JSON.stringify({ ok: true, option }, null, 2));
