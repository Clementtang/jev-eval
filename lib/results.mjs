// Append-only JSONL result store: one file per run, one line per call.
// Each line snapshots the item's labels because the dataset can be edited after a run.
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { runItem } from "./providers.mjs";

const RUNS_DIR = new URL("../results/runs/", import.meta.url);
const RUN_ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;

export function newRunId(target) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
  return `${stamp}-${target}`;
}

function runFile(runId) {
  if (!RUN_ID_PATTERN.test(runId)) throw Object.assign(new Error(`invalid run id ${runId}`), { status: 400 });
  return new URL(`${runId}.jsonl`, RUNS_DIR);
}

export async function runAndRecord({ runId, target, item, rep }) {
  const result = await runItem(target, item);
  const record = {
    run_id: runId,
    ts: new Date().toISOString(),
    rep,
    item_id: item.id,
    group: item.group, topic: item.topic, concept: item.concept, subject: item.subject,
    lang: item.lang, variant: item.variant ?? "base", polarity: item.polarity, framing: item.framing, expected: item.expected ?? null,
    question_type: item.question.type,
    ...result,
  };
  appendFileSync(runFile(runId), JSON.stringify(record) + "\n");
  return record;
}

export function listRuns() {
  if (!existsSync(RUNS_DIR)) return [];
  return readdirSync(RUNS_DIR)
    .filter((name) => name.endsWith(".jsonl"))
    .map((name) => {
      const path = new URL(name, RUNS_DIR);
      const lines = readFileSync(path, "utf8").split("\n").filter(Boolean).length;
      return { run_id: name.replace(/\.jsonl$/, ""), calls: lines, updated: statSync(path).mtime.toISOString() };
    })
    // File names start with a UTC timestamp, so sorting by name is chronological and, unlike
    // mtime, does not change when files are copied; analysis output is then reproducible.
    .sort((a, b) => b.run_id.localeCompare(a.run_id));
}

export function readRun(runId) {
  const path = runFile(runId);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line));
}
