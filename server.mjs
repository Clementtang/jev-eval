// Local-only demo server: serves the UI, persists dataset edits, and proxies model calls
// so API keys stay in this process (injected by `op run`) and never reach the browser.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { validateItem } from "./lib/schema.mjs";
import { availableTargets, TARGETS, JEV_MODEL } from "./lib/providers.mjs";
import { listRuns, readRun, runAndRecord } from "./lib/results.mjs";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT ?? 4173);
const DATASET = new URL("./data/dataset.json", import.meta.url);
const INDEX = new URL("./public/index.html", import.meta.url);
const MAX_BODY_BYTES = 1_000_000;

const loadDataset = () => JSON.parse(readFileSync(DATASET, "utf8"));
function saveDataset(items) {
  // Write-then-rename so a crash mid-write cannot truncate the dataset.
  const tmp = new URL("./data/dataset.json.tmp", import.meta.url);
  writeFileSync(tmp, JSON.stringify(items, null, 2) + "\n");
  renameSync(tmp, DATASET);
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("request body too large"), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw Object.assign(new Error("request body is not valid JSON"), { status: 400 });
  }
}

const routes = {
  "GET /": (req, res) => send(res, 200, readFileSync(INDEX), "text/html; charset=utf-8"),
  "GET /api/config": (req, res) => send(res, 200, { targets: availableTargets(), jevModel: JEV_MODEL }),
  "GET /api/dataset": (req, res) => send(res, 200, loadDataset()),
  "POST /api/items": async (req, res) => {
    const item = await readJson(req);
    const problems = validateItem(item);
    const items = loadDataset();
    if (items.some((i) => i.id === item.id)) problems.push(`id ${item.id} already exists`);
    if (problems.length) return send(res, 422, { errors: problems });
    items.push(item);
    saveDataset(items);
    send(res, 201, item);
  },
  "PUT /api/items/:id": async (req, res, id) => {
    const item = await readJson(req);
    const items = loadDataset();
    const index = items.findIndex((i) => i.id === id);
    if (index < 0) return send(res, 404, { errors: [`no item ${id}`] });
    const problems = validateItem(item);
    if (item.id !== id && items.some((i) => i.id === item.id)) problems.push(`id ${item.id} already exists`);
    if (problems.length) return send(res, 422, { errors: problems });
    items[index] = item;
    saveDataset(items);
    send(res, 200, item);
  },
  "DELETE /api/items/:id": (req, res, id) => {
    const items = loadDataset();
    const remaining = items.filter((i) => i.id !== id);
    if (remaining.length === items.length) return send(res, 404, { errors: [`no item ${id}`] });
    saveDataset(remaining);
    send(res, 200, { deleted: id });
  },
  "POST /api/run": async (req, res) => {
    const { runId, target, itemId, rep = 1 } = await readJson(req);
    if (!TARGETS[target]) return send(res, 400, { errors: [`unknown target ${target}`] });
    if (!availableTargets()[target]) return send(res, 400, { errors: [`API key for ${target} is not configured`] });
    const item = loadDataset().find((i) => i.id === itemId);
    if (!item) return send(res, 404, { errors: [`no item ${itemId}`] });
    send(res, 200, await runAndRecord({ runId, target, item, rep }));
  },
  "GET /api/runs": (req, res) => send(res, 200, listRuns()),
  "GET /api/runs/:id": (req, res, id) => {
    const records = readRun(id);
    return records ? send(res, 200, records) : send(res, 404, { errors: [`no run ${id}`] });
  },
};

function match(method, pathname) {
  if (routes[`${method} ${pathname}`]) return [routes[`${method} ${pathname}`]];
  const [, prefix, id] = pathname.match(/^(\/api\/(?:items|runs))\/([^/]+)$/) ?? [];
  const handler = prefix && routes[`${method} ${prefix}/:id`];
  return handler ? [handler, decodeURIComponent(id)] : [];
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${HOST}`);
  const [handler, id] = match(req.method, pathname);
  if (!handler) return send(res, 404, { errors: [`no route ${req.method} ${pathname}`] });
  try {
    await handler(req, res, id);
  } catch (error) {
    console.error(`${req.method} ${pathname} failed:`, error);
    if (!res.headersSent) send(res, error.status ?? 500, { errors: [error.message] });
  }
}).listen(PORT, HOST, () => {
  console.log(`jev-eval demo on http://${HOST}:${PORT}  targets: ${JSON.stringify(availableTargets())}`);
});
