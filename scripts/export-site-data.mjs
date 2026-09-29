// Writes the data the static site serves: the replay payloads in place of GET /api/replay and
// GET /api/dataset (bytes match the server responses, which JSON.stringify the same payloads), and
// the item browser payload.
// Needs no npm install: it imports only SDK-free modules.
import { mkdirSync, writeFileSync } from "node:fs";
import { buildReplay, loadDataset } from "../lib/replay.mjs";
import { buildItems } from "../lib/item-browser.mjs";

const SITE_PUBLIC = new URL("../site/public/", import.meta.url);
const outputs = {
  "replay/data/replay.json": buildReplay(),
  "replay/data/dataset.json": loadDataset(),
  "data/items.json": buildItems(),
};
for (const [path, payload] of Object.entries(outputs)) {
  const out = new URL(path, SITE_PUBLIC);
  mkdirSync(new URL(".", out), { recursive: true });
  const body = JSON.stringify(payload);
  writeFileSync(out, body);
  console.log(`wrote site/public/${path} (${Buffer.byteLength(body)} bytes)`);
}
