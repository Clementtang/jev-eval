// Writes the replay data the static site serves in place of GET /api/replay and GET /api/dataset.
// The bytes match the server responses, which JSON.stringify the same payloads.
// Needs no npm install: it imports only SDK-free modules.
import { mkdirSync, writeFileSync } from "node:fs";
import { buildReplay, loadDataset } from "../lib/replay.mjs";

const OUT_DIR = new URL("../site/public/replay/data/", import.meta.url);

mkdirSync(OUT_DIR, { recursive: true });
const outputs = { "replay.json": buildReplay(), "dataset.json": loadDataset() };
for (const [name, payload] of Object.entries(outputs)) {
  const body = JSON.stringify(payload);
  writeFileSync(new URL(name, OUT_DIR), body);
  console.log(`wrote site/public/replay/data/${name} (${Buffer.byteLength(body)} bytes)`);
}
