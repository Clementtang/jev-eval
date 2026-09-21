// Headless batch runner for the full study: node scripts/run-batch.mjs --target jev --repeats 5
// Uses the same result store as the demo UI, so batch runs show up in its "載入紀錄" menu.
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { availableTargets } from "../lib/providers.mjs";
import { newRunId, runAndRecord } from "../lib/results.mjs";

const { values } = parseArgs({
  options: {
    target: { type: "string", default: "jev" },
    repeats: { type: "string", default: "5" },
    concurrency: { type: "string", default: "8" },
    group: { type: "string" },
    subject: { type: "string" },
    variant: { type: "string" },
    limit: { type: "string" },
  },
});
if (!availableTargets()[values.target]) {
  console.error(`target ${values.target} unavailable: API key missing or unknown target`);
  process.exit(1);
}

let items = JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url), "utf8"));
if (values.group) items = items.filter((i) => values.group.split(",").includes(i.group));
if (values.subject) items = items.filter((i) => values.subject.split(",").includes(i.subject));
if (values.variant) items = items.filter((i) => values.variant.split(",").includes(i.variant ?? "base"));
if (values.limit) items = items.slice(0, Number(values.limit));
const repeats = Number(values.repeats);
const runId = newRunId(values.target);

const queue = [];
for (let rep = 1; rep <= repeats; rep++) for (const item of items) queue.push({ item, rep });
const total = queue.length;
let done = 0;
let failed = 0;

async function worker() {
  while (queue.length) {
    const { item, rep } = queue.shift();
    const record = await runAndRecord({ runId, target: values.target, item, rep });
    done += 1;
    if (!record.ok) {
      failed += 1;
      console.error(`FAIL ${item.id} rep ${rep}: ${record.error}`);
    }
    if (done % 50 === 0 || done === total) console.log(`${done}/${total} (${failed} failed)`);
  }
}
await Promise.all(Array.from({ length: Number(values.concurrency) }, worker));
console.log(`run ${runId} finished: ${done} calls, ${failed} failed`);
