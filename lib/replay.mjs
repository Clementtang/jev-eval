// Replay payloads shared by the local server (GET /api/replay, GET /api/dataset) and the static
// site export, so the published replays read exactly what the local replays read.
import { readFileSync } from "node:fs";
import { PRICING, TARGETS } from "./targets.mjs";
import { listRuns, readRun } from "./results.mjs";

const DATASET = new URL("../data/dataset.json", import.meta.url);
const REPLAY_FIELDS = ["target", "run_id", "item_id", "rep", "ms", "value", "choice", "lang", "group", "topic", "concept", "subject", "polarity", "framing", "question_type"];

export const loadDataset = () => JSON.parse(readFileSync(DATASET, "utf8"));

// Base-item records from every run, trimmed to what the replays need.
export function buildReplay() {
  const records = listRuns().flatMap((r) => readRun(r.run_id) ?? [])
    .filter((r) => r.ok && !r.refusal && (r.variant ?? "base") === "base")
    .map((r) => ({ ...Object.fromEntries(REPLAY_FIELDS.map((f) => [f, r[f]])), input_tokens: r.usage?.input_tokens ?? 0,
      // xAI bills reasoning tokens outside output tokens; OpenAI already includes them (same rule as stats.mjs).
      output_tokens: (r.usage?.output_tokens ?? 0) + (TARGETS[r.target]?.reasoningOutsideOutput ? r.usage?.reasoning_tokens ?? 0 : 0) }));
  return { pricing: PRICING, records };
}
