// Summarizes one or more runs into results/summary-<runIds>.md.
// Usage: node scripts/analyze.mjs <runId> [runId...]   (defaults to the newest run)
import { writeFileSync } from "node:fs";
import { listRuns, readRun } from "../lib/results.mjs";

const LANGS = ["zh-TW", "zh-CN", "en"];
// Above this |pos + neg - 1| a concept's answers contradict each other too much to read as a stance.
const INCONSISTENT_GAP = 0.3;

const runIds = process.argv.slice(2).length ? process.argv.slice(2) : [listRuns()[0]?.run_id].filter(Boolean);
if (!runIds.length) {
  console.error("no runs found in results/runs");
  process.exit(1);
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const sd = (xs) => {
  const m = mean(xs);
  return xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)) : null;
};
const f2 = (x) => (x == null ? "-" : x.toFixed(2));
const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];

function summarize(records) {
  const out = [];
  const ok = records.filter((r) => r.ok && !r.refusal);
  const ms = ok.map((r) => r.ms).sort((a, b) => a - b);
  out.push(`- 呼叫數 ${records.length}，成功 ${ok.length}，錯誤 ${records.filter((r) => !r.ok).length}，拒答 ${records.filter((r) => r.refusal).length}`);
  if (ms.length) out.push(`- 延遲 p50 ${pct(ms, 0.5)} ms，p95 ${pct(ms, 0.95)} ms`);
  const tokens = ok.reduce((a, r) => a + (r.usage?.input_tokens ?? 0), 0);
  out.push(`- input tokens 合計 ${tokens}`);

  // Capability controls and factual anchors: accuracy per language.
  out.push("", "### 能力基準（K 組與 A 組事實題）", "", `| 語言 | K 準確率 | A 事實題準確率 |`, `| --- | --- | --- |`);
  const correct = (r) => (r.question_type === "noul" ? Math.round(r.value) === r.expected : r.choice === r.expected);
  for (const lang of LANGS) {
    const k = ok.filter((r) => r.group === "K" && r.lang === lang && r.expected != null);
    const a = ok.filter((r) => r.group === "A" && r.lang === lang && r.expected != null);
    out.push(`| ${lang} | ${f2(mean(k.map((r) => (correct(r) ? 1 : 0))))} | ${f2(mean(a.map((r) => (correct(r) ? 1 : 0))))} |`);
  }

  // Noul stance table.
  out.push("", "### 陳述判斷（noul）", "", "立場值 = (正句平均 + (1 − 反句平均)) / 2；差距 = 正 + 反 − 1；標 * 表示 |差距| > " + INCONSISTENT_GAP + "，回答自相矛盾。", "");
  out.push(`| 組 | 概念 | 框架 | ${LANGS.map((l) => `${l} 正 / 反 / 立場 / 差距 / sd`).join(" | ")} |`);
  out.push(`| --- | --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
  const noul = ok.filter((r) => r.question_type === "noul");
  const keys = [...new Set(noul.map((r) => `${r.group}|${r.subject}|${r.concept}|${r.framing}`))].sort();
  for (const key of keys) {
    const [group, , concept, framing] = key.split("|");
    const cells = LANGS.map((lang) => {
      const vals = (pol) => noul.filter((r) => `${r.group}|${r.subject}|${r.concept}|${r.framing}` === key && r.lang === lang && r.polarity === pol).map((r) => r.value);
      const pos = mean(vals("pos"));
      const neg = mean(vals("neg"));
      if (pos == null || neg == null) return "-";
      const gap = pos + neg - 1;
      const stance = (pos + (1 - neg)) / 2;
      const spread = Math.max(sd(vals("pos")) ?? 0, sd(vals("neg")) ?? 0);
      return `${f2(pos)} / ${f2(neg)} / **${f2(stance)}** / ${f2(gap)}${Math.abs(gap) > INCONSISTENT_GAP ? "*" : ""} / ${f2(spread)}`;
    });
    out.push(`| ${group} | ${concept} | ${framing} | ${cells.join(" | ")} |`);
  }

  // Choice distributions.
  out.push("", "### 選擇題（choice）", "", "格式：選項 被選比例（Jev 回傳該選項的平均機率）", "");
  out.push(`| 組 | 概念 | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
  const choice = ok.filter((r) => r.question_type === "choice");
  for (const key of [...new Set(choice.map((r) => `${r.group}|${r.concept}`))].sort()) {
    const [group, concept] = key.split("|");
    const cells = LANGS.map((lang) => {
      const rs = choice.filter((r) => r.group === group && r.concept === concept && r.lang === lang);
      if (!rs.length) return "-";
      const counts = {};
      for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([c, n]) => {
        const prob = mean(rs.map((r) => r.probabilities?.[c]).filter((p) => p != null));
        return `${c} ${Math.round((n / rs.length) * 100)}%${prob == null ? "" : ` (${f2(prob)})`}`;
      }).join("<br>");
    });
    out.push(`| ${group} | ${concept} | ${cells.join(" | ")} |`);
  }
  return out.join("\n");
}

const sections = [`# 結果彙整`, "", `產出時間：${new Date().toISOString()}`, ""];
for (const runId of runIds) {
  const records = readRun(runId);
  if (!records) {
    console.error(`run ${runId} not found`);
    process.exit(1);
  }
  sections.push(`## ${runId}（${records[0]?.model ?? "?"}）`, "", summarize(records), "");
}
const outPath = new URL(`../results/summary-${runIds.join("+")}.md`, import.meta.url);
writeFileSync(outPath, sections.join("\n"));
console.log(`wrote ${outPath.pathname}`);
