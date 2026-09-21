// Structural completeness check for data/dataset.json. Validates shape and coverage only;
// it deliberately does not judge whether any statement is politically "right".
import { readFileSync } from "node:fs";
import { validateItem, LANGS } from "../lib/schema.mjs";

const items = JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url), "utf8"));
const errors = [];
const warnings = [];

const ids = new Set();
for (const item of items) {
  if (ids.has(item.id)) errors.push(`duplicate id ${item.id}`);
  ids.add(item.id);
  for (const problem of validateItem(item)) errors.push(`${item.id}: ${problem}`);
}

// Characters that only exist in one script. Heuristic, so hits are warnings for a human to check.
const TRADITIONAL_ONLY = "臺灣國與這個區體對實於為會屬獨權華廣護發聯員數當號鎮縣東雲選單標籤電話欄";
const SIMPLIFIED_ONLY = "湾国与这个区体对实于为会属独权华广护发联员数当号镇县东云选单标签电话栏";
const textOf = (item) => JSON.stringify([item.state, item.question]);
for (const item of items) {
  const text = textOf(item);
  if (item.lang === "zh-CN") {
    const hits = [...text].filter((ch) => TRADITIONAL_ONLY.includes(ch));
    if (hits.length) warnings.push(`${item.id}: traditional characters in zh-CN item: ${[...new Set(hits)].join("")}`);
  }
  if (item.lang === "zh-TW") {
    const hits = [...text].filter((ch) => SIMPLIFIED_ONLY.includes(ch));
    if (hits.length) warnings.push(`${item.id}: simplified characters in zh-TW item: ${[...new Set(hits)].join("")}`);
  }
  if (item.lang === "en" && /[㐀-鿿]/.test(text)) warnings.push(`${item.id}: CJK characters in en item`);
}

// Coverage: every concept must exist in all languages, and noul concepts need both polarities.
const byConcept = new Map();
for (const item of items) {
  const key = `${item.group}|${item.concept}|${item.framing}`;
  if (!byConcept.has(key)) byConcept.set(key, []);
  byConcept.get(key).push(item);
}
for (const [key, group] of byConcept) {
  const langs = new Set(group.map((i) => i.lang));
  for (const lang of LANGS) if (!langs.has(lang)) errors.push(`${key}: missing language ${lang}`);
  if (group[0].question.type === "noul") {
    for (const lang of LANGS) {
      const polarities = new Set(group.filter((i) => i.lang === lang).map((i) => i.polarity));
      if (!polarities.has("pos") || !polarities.has("neg")) errors.push(`${key} ${lang}: noul pair incomplete`);
    }
  }
  if (group[0].question.type === "choice") {
    const optionSets = new Set(group.map((i) => Object.keys(i.question.criteria).sort().join(",")));
    if (optionSets.size > 1) errors.push(`${key}: option keys differ across languages`);
  }
}

// Every Taiwan template should have at least one mirror in group D, and the user's required topics must exist.
const REQUIRED_TOPICS = ["sovereignty", "roc-prc", "taiwan-roc", "identity", "classification", "cities"];
const topics = new Set(items.filter((i) => i.subject === "Taiwan").map((i) => i.topic.replace(/-fact$/, "")));
for (const topic of REQUIRED_TOPICS) if (!topics.has(topic)) errors.push(`no Taiwan items for required topic ${topic}`);
if (!items.some((i) => i.group === "K")) errors.push("no capability control items (group K)");

// Coverage matrix: group x language
const matrix = {};
for (const item of items) {
  matrix[item.group] ??= Object.fromEntries(LANGS.map((l) => [l, 0]));
  matrix[item.group][item.lang] += 1;
}
console.table(matrix);
const topicCount = {};
for (const item of items) topicCount[`${item.group}:${item.topic}`] = (topicCount[`${item.group}:${item.topic}`] ?? 0) + 1;
console.table(topicCount);

for (const w of warnings) console.warn("WARN", w);
for (const e of errors) console.error("ERROR", e);
console.log(`${items.length} items, ${byConcept.size} concept groups, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
