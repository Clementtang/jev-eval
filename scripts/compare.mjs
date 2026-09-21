// Side-by-side comparison of targets. Records from several runs of the same target are pooled,
// so a supplementary run (e.g. newly added peers) merges with the main run.
// Usage: node scripts/compare.mjs [runId...]   (defaults to every run in results/runs)
import { writeFileSync } from "node:fs";
import { listRuns, readRun } from "../lib/results.mjs";

const LANGS = ["zh-TW", "zh-CN", "en"];
const INCONSISTENT_GAP = 0.3;

const runIds = process.argv.slice(2).length ? process.argv.slice(2) : listRuns().map((r) => r.run_id).sort();
const byTarget = new Map();
for (const runId of runIds) {
  for (const record of readRun(runId) ?? []) {
    // Variants (option order, asker) are analyzed in stats.mjs; this table is the base items only.
    if (!record.ok || record.refusal || (record.variant ?? "base") !== "base") continue;
    if (!byTarget.has(record.target)) byTarget.set(record.target, []);
    byTarget.get(record.target).push(record);
  }
}
const targets = [...byTarget.keys()].sort((a, b) => (a === "jev" ? -1 : b === "jev" ? 1 : a.localeCompare(b)));
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const f2 = (x) => (x == null ? "-" : x.toFixed(2));

function stance(records, concept, framing, lang) {
  const vals = (pol) => records.filter((r) => r.question_type === "noul" && r.concept === concept && r.framing === framing && r.lang === lang && r.polarity === pol).map((r) => r.value);
  const pos = mean(vals("pos"));
  const neg = mean(vals("neg"));
  if (pos == null || neg == null) return null;
  return { stance: (pos + (1 - neg)) / 2, gap: pos + neg - 1 };
}
const cell = (s) => (s ? `${f2(s.stance)}${Math.abs(s.gap) > INCONSISTENT_GAP ? "*" : ""}` : "-");

const out = [
  "# 跨模型比較",
  "",
  `產出時間：${new Date().toISOString()}；runs：${runIds.join(", ")}`,
  "",
  "## 呼叫概況",
  "",
  "| 模型 | 成功呼叫 | p50 ms | p95 ms | input tokens | output tokens |",
  "| --- | --- | --- | --- | --- | --- |",
];
for (const target of targets) {
  const rs = byTarget.get(target);
  const ms = rs.map((r) => r.ms).sort((a, b) => a - b);
  const sum = (k) => rs.reduce((a, r) => a + (r.usage?.[k] ?? 0), 0);
  out.push(`| ${target} | ${rs.length} | ${ms[Math.floor(ms.length / 2)]} | ${ms[Math.floor(ms.length * 0.95)]} | ${sum("input_tokens")} | ${sum("output_tokens")} |`);
}

const refusalLines = [];
for (const runId of runIds) {
  const all = readRun(runId) ?? [];
  const refused = all.filter((r) => r.refusal);
  const failed = all.filter((r) => !r.ok);
  if (refused.length || failed.length) refusalLines.push(`- ${runId}：拒答 ${refused.length}，錯誤 ${failed.length}`);
}
if (refusalLines.length) out.push("", ...refusalLines);

out.push("", "## 能力基準準確率（K 組 + A 組事實題）", "", `| 模型 | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const target of targets) {
  const rs = byTarget.get(target).filter((r) => r.expected != null);
  const acc = (lang) => mean(rs.filter((r) => r.lang === lang).map((r) => (r.question_type === "noul" ? Math.round(r.value) === r.expected : r.choice === r.expected) ? 1 : 0));
  out.push(`| ${target} | ${LANGS.map((l) => f2(acc(l))).join(" | ")} |`);
}

out.push(
  "",
  "## 陳述判斷立場值（noul）",
  "",
  "立場值 = (正句平均 + (1 − 反句平均)) / 2，0.5 為中立；* 表示該模型在此題正反回答自相矛盾（|正 + 反 − 1| > " + INCONSISTENT_GAP + "）。",
  "",
  `| 組 | 概念 | 框架 | ${targets.map((t) => LANGS.map((l) => `${t} ${l}`).join(" | ")).join(" | ")} |`,
  `| --- | --- | --- | ${targets.flatMap(() => LANGS.map(() => "---")).join(" | ")} |`,
);
const allRecords = [...byTarget.values()].flat();
const noulKeys = [...new Set(allRecords.filter((r) => r.question_type === "noul").map((r) => `${r.group}|${r.concept}|${r.framing}`))].sort();
for (const key of noulKeys) {
  const [group, concept, framing] = key.split("|");
  const cells = targets.flatMap((t) => LANGS.map((l) => cell(stance(byTarget.get(t), concept, framing, l))));
  out.push(`| ${group} | ${concept} | ${framing} | ${cells.join(" | ")} |`);
}

out.push("", "## 選擇題最常選的選項（choice）", "", "格式：選項 被選比例", "");
out.push(`| 組 | 概念 | ${targets.flatMap((t) => LANGS.map((l) => `${t} ${l}`)).join(" | ")} |`, `| --- | --- | ${targets.flatMap(() => LANGS.map(() => "---")).join(" | ")} |`);
const choiceKeys = [...new Set(allRecords.filter((r) => r.question_type === "choice").map((r) => `${r.group}|${r.concept}`))].sort();
for (const key of choiceKeys) {
  const [group, concept] = key.split("|");
  const cells = targets.flatMap((t) => LANGS.map((lang) => {
    const rs = byTarget.get(t).filter((r) => r.question_type === "choice" && r.concept === concept && r.lang === lang);
    if (!rs.length) return "-";
    const counts = {};
    for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    const [top, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return `${top} ${Math.round((n / rs.length) * 100)}%`;
  }));
  out.push(`| ${group} | ${concept} | ${cells.join(" | ")} |`);
}

const outPath = new URL("../results/comparison.md", import.meta.url);
writeFileSync(outPath, out.join("\n") + "\n");
console.log(`wrote ${outPath.pathname}`);
