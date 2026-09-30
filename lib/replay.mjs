// Replay payloads shared by the local server (GET /api/replay, GET /api/dataset) and the static
// site export, so the published replays read exactly what the local replays read.
import { readdirSync, readFileSync } from "node:fs";
import { PRICING, TARGETS } from "./targets.mjs";
import { listRuns, readRun } from "./results.mjs";
import { ADDENDUM_SUFFIX, ADDENDUM_TARGETS } from "./addendum.mjs";

const DATASET = new URL("../data/dataset.json", import.meta.url);
const ADDENDUM_RUNS = new URL("../results/runs-addendum/", import.meta.url);
const REPLAY_FIELDS = ["target", "run_id", "item_id", "rep", "ms", "value", "choice", "lang", "group", "topic", "concept", "subject", "polarity", "framing", "question_type"];

export const loadDataset = () => JSON.parse(readFileSync(DATASET, "utf8"));

// Read directly rather than through lib/results.mjs, whose directory follows JEV_RUNS_DIR.
// The suffix keeps the same-day rerun apart from the main analysis's claude-sonnet-5.
export function addendumRecords() {
  return readdirSync(ADDENDUM_RUNS).filter((f) => f.endsWith(".jsonl")).sort()
    .flatMap((f) => readFileSync(new URL(f, ADDENDUM_RUNS), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)))
    .map((r) => ({ ...r, target: r.target + ADDENDUM_SUFFIX }));
}

const baseTarget = (target) => (target.endsWith(ADDENDUM_SUFFIX) ? target.slice(0, -ADDENDUM_SUFFIX.length) : target);

// Base-item records from every run, trimmed to what the replays need. Addendum records follow
// the main ones; the pages keep them out of view until a viewer ticks them.
export function buildReplay() {
  const records = [...listRuns().flatMap((r) => readRun(r.run_id) ?? []), ...addendumRecords()]
    .filter((r) => r.ok && !r.refusal && (r.variant ?? "base") === "base")
    .map((r) => ({ ...Object.fromEntries(REPLAY_FIELDS.map((f) => [f, r[f]])), input_tokens: r.usage?.input_tokens ?? 0,
      // xAI bills reasoning tokens outside output tokens; OpenAI already includes them (same rule as stats.mjs).
      output_tokens: (r.usage?.output_tokens ?? 0) + (TARGETS[baseTarget(r.target)]?.reasoningOutsideOutput ? r.usage?.reasoning_tokens ?? 0 : 0) }));
  const addendumPricing = Object.fromEntries(ADDENDUM_TARGETS.map((t) => [t + ADDENDUM_SUFFIX, PRICING[t]]));
  return { pricing: { ...PRICING, ...addendumPricing }, records };
}
