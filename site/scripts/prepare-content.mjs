// Copies the build inputs that live outside site/ into it, so each has one source in the repo:
// the papers (docs/paper/*.md) and the replay pages (public/*.html). The copies are gitignored.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { posix } from "node:path";

const REPO = new URL("../../", import.meta.url);
const SITE = new URL("../", import.meta.url);
const GITHUB_BLOB = "https://github.com/Clementtang/jev-eval/blob/main/";
const PAPER_DIR = "docs/paper/";

const PAPERS = [
  { source: "paper.zh-TW.md", target: "paper.md", sourceNote: "本頁由 repo 中的論文原始檔產生：" },
  { source: "paper.en.md", target: "en/paper.md", sourceNote: "This page is generated from the paper source in the repository:" },
];
const REPLAYS = ["stance.html", "race.html"];
const REPLAY_DATA = ["replay.json", "dataset.json"];
const DATA_SOURCE_META = '<meta name="jev-data-source" content="server" />';

// Relative links resolve against docs/paper/ in the repo but would 404 on the site.
function toGithubUrl(target) {
  if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) return target;
  const [path, hash = ""] = target.split(/(?=#)/);
  return GITHUB_BLOB + posix.normalize(posix.join(PAPER_DIR, path)) + hash;
}

function rewriteLinks(markdown) {
  return markdown
    .replace(/(\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (_, open, target, close) => open + toGithubUrl(target) + close)
    .replace(/^(\s*\[[^\]]+\]:\s+)(\S+)/gm, (_, label, target) => label + toGithubUrl(target));
}

// Numbers such as "0.40 [0.31, 0.50] *" or "0.17 / 0.08 / 0.12" wrapped mid-value in narrow
// table columns on phones; non-breaking spaces keep each value on one line and the table scrolls.
function keepTableValuesTogether(markdown) {
  return markdown.replace(/^\|.*\|$/gm, (row) => row.replace(/(?<=[\d\],/*]) (?=[\d[\]/*−-])/g, " "));
}

function addFrontmatter(markdown, lines) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error("paper has no YAML frontmatter; expected it to open with ---");
  return `---\n${match[1]}\n${lines.join("\n")}\n---\n` + markdown.slice(match[0].length);
}

function preparePaper({ source, target, sourceNote }) {
  const sourcePath = PAPER_DIR + source;
  const original = readFileSync(new URL(sourcePath, REPO), "utf8");
  const body = addFrontmatter(keepTableValuesTogether(rewriteLinks(original)), ["outline: [2, 3]", "pageClass: paper-page"]);
  const footer = `\n\n---\n\n<p class="paper-source">${sourceNote} <a href="${GITHUB_BLOB}${sourcePath}">${sourcePath}</a></p>\n`;
  const out = new URL(target, SITE);
  mkdirSync(new URL(".", out), { recursive: true });
  writeFileSync(out, body.trimEnd() + footer);
  console.log(`paper: ${sourcePath} -> site/${target}`);
}

function prepareReplay(name) {
  const html = readFileSync(new URL(`public/${name}`, REPO), "utf8");
  const count = html.split(DATA_SOURCE_META).length - 1;
  if (count !== 1) throw new Error(`public/${name}: expected one ${DATA_SOURCE_META}, found ${count}`);
  const out = new URL(`public/replay/${name}`, SITE);
  mkdirSync(new URL(".", out), { recursive: true });
  writeFileSync(out, html.replace(DATA_SOURCE_META, DATA_SOURCE_META.replace('"server"', '"static"')));
  console.log(`replay: public/${name} -> site/public/replay/${name} (data source: static)`);
}

function checkReplayData() {
  const missing = REPLAY_DATA.filter((name) => !existsSync(new URL(`public/replay/data/${name}`, SITE)));
  if (missing.length) {
    throw new Error(`site/public/replay/data is missing ${missing.join(", ")}; run node scripts/export-site-data.mjs from the repo root first`);
  }
}

PAPERS.forEach(preparePaper);
REPLAYS.forEach(prepareReplay);
checkReplayData();
