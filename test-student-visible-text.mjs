import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");

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
const vmSource = source + "\n" + "globalThis.__textTest = { cleanStudentInstructionText, sanitizeStudentFacingArtText };";
vm.runInNewContext(vmSource, context);

const clean = context.__textTest.cleanStudentInstructionText;
const art = context.__textTest.sanitizeStudentFacingArtText;
const directAddress = clean("请家长帮助孩子先读；孩子可以再说一次，宝宝请回答。");
assert(!/孩子|儿童|小朋友|宝贝|宝宝|小孩|请家长帮助|家长帮助/.test(directAddress), "Direct student guidance retained a childlike term: " + directAddress);
assert(directAddress.includes("你先") && directAddress.includes("你可以"), "Direct student guidance should use second-person wording");
assert(clean("课间到了操场，孩子们做了哪三个动作？").includes("孩子们"), "Story wording should remain unchanged");

const artText = art("无毒儿童安全水性马克笔；请孩子先试色。", 120);
assert(!/孩子|儿童|小朋友|宝贝|宝宝|小孩|请家长帮助|家长帮助/.test(artText), "Student art text retained a childlike term: " + artText);
assert(artText.includes("请先试色"), "Student art guidance should keep its action after removing the child-directed wording");

console.log(JSON.stringify({ ok: true, directAddress, artText }, null, 2));
