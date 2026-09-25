// Runs several targets inside one process, so one `op run` authorization covers the whole study.
// Usage: op run --env-file .env.op -- node scripts/run-all.mjs [--targets a,b] [--repeats 5] [--group A,B] [--limit 3]
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { availableTargets, TARGETS } from "../lib/providers.mjs";
import { newRunId, runAndRecord } from "../lib/results.mjs";

const { values } = parseArgs({
  options: {
    targets: { type: "string", default: "jev,grok-4-7,claude-opus-5-5,luna-6" },
    repeats: { type: "string", default: "5" },
    concurrency: { type: "string", default: "8" },
    group: { type: "string" },
    variant: { type: "string" },
    concept: { type: "string" },
    limit: { type: "string" },
  },
});

const available = availableTargets();
const targets = values.targets.split(",").filter(Boolean);
const missing = targets.filter((t) => !TARGETS[t] || !available[t]);
if (missing.length) {
  console.error(`unavailable targets (unknown or missing API key): ${missing.join(", ")}`);
  process.exit(1);
}

let items = JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url), "utf8"));
if (values.group) items = items.filter((i) => values.group.split(",").includes(i.group));
if (values.variant) items = items.filter((i) => values.variant.split(",").includes(i.variant ?? "base"));
if (values.concept) items = items.filter((i) => values.concept.split(",").includes(i.concept));
if (values.limit) items = items.slice(0, Number(values.limit));
const repeats = Number(values.repeats);
const concurrency = Number(values.concurrency);

async function runTarget(target) {
  const runId = newRunId(target);
  const queue = [];
  for (let rep = 1; rep <= repeats; rep++) for (const item of items) queue.push({ item, rep });
  const total = queue.length;
  let done = 0;
  let failed = 0;
  const firstErrors = [];
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const { item, rep } = queue.shift();
      const record = await runAndRecord({ runId, target, item, rep });
      done += 1;
      if (!record.ok) {
        failed += 1;
        if (firstErrors.length < 3) firstErrors.push(`${item.id}: ${record.error}`);
      }
      if (done % 200 === 0) console.log(`  ${target} ${done}/${total} (${failed} failed)`);
    }
  }));
  for (const e of firstErrors) console.error(`  FAIL ${e}`);
  console.log(`${target}: ${done} calls, ${failed} failed, run ${runId}`);
  return { target, runId, done, failed };
}

console.log(`${items.length} items x ${repeats} repeats x ${targets.length} targets = ${items.length * repeats * targets.length} calls`);
// Targets run in parallel: they are separate services, and each keeps its own concurrency cap.
const results = await Promise.all(targets.map(runTarget));
console.log(results.map((r) => `${r.target} ${r.done - r.failed}/${r.done}`).join(" | "));
