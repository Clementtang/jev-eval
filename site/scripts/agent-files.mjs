// Files for readers that are programs: llms.txt, llms-full.txt, the papers as plain Markdown and
// the machine-readable results. Everything is derived from docs/paper/*.md, results/summary.json,
// results/addendum.json and CITATION.cff at build time, so there is no second copy to keep in sync.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const SITE_URL = "https://clementtang.github.io/jev-eval/";
export const REPO_URL = "https://github.com/Clementtang/jev-eval";
const BLOB = `${REPO_URL}/blob/main/`;

// The paper frontmatter holds only flat "key: value" lines, so a YAML dependency is not needed.
export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error("paper has no YAML frontmatter; expected it to open with ---");
  return Object.fromEntries(match[1].split("\n").map((line) => {
    const [, key, raw] = line.match(/^([\w-]+):\s*(.*)$/) ?? [];
    if (!key) throw new Error(`unexpected frontmatter line: ${line}`);
    return [key, raw.replace(/^"(.*)"$/, "$1")];
  }));
}

export const versionNumber = (version) => {
  const number = version.match(/\d+(?:\.\d+)+/)?.[0];
  if (!number) throw new Error(`no version number in frontmatter version "${version}"`);
  return number;
};

// CITATION.cff cannot read the paper, so the build fails when the two drift apart.
function checkCitation(repo, meta) {
  const cff = readFileSync(new URL("CITATION.cff", repo), "utf8");
  const expected = { version: versionNumber(meta.version), "date-released": meta.date, "date-published": meta.date };
  for (const [key, value] of Object.entries(expected)) {
    const found = [...cff.matchAll(new RegExp(`^\\s*${key}:\\s*"?([^"\\n]+)"?$`, "gm"))].map((m) => m[1]);
    if (!found.length || found.some((v) => v !== value)) {
      throw new Error(`CITATION.cff ${key} is ${found.join(", ") || "missing"} but the paper frontmatter says ${value}; update CITATION.cff`);
    }
  }
}

// Zenodo reads .zenodo.json instead of CITATION.cff when both exist, so it must name the same work
// and author as the paper; a mismatch would give the next release's DOI record the wrong metadata.
function checkZenodo(repo, meta) {
  const zenodo = JSON.parse(readFileSync(new URL(".zenodo.json", repo), "utf8"));
  const creator = meta.author_name.replace(/^(.*)\s(\S+)$/, "$2, $1");
  const problems = [
    zenodo.title !== meta.title && `title is "${zenodo.title}"`,
    zenodo.creators?.[0]?.name !== creator && `first creator is "${zenodo.creators?.[0]?.name}", expected "${creator}"`,
    zenodo.creators?.[0]?.orcid !== meta.orcid && `first creator ORCID is ${zenodo.creators?.[0]?.orcid}, expected ${meta.orcid}`,
    (zenodo.upload_type !== "publication" || zenodo.publication_type !== "preprint") && "resource type is not publication/preprint",
    zenodo.license !== "cc-by-4.0" && `license is ${zenodo.license}`,
  ].filter(Boolean);
  if (problems.length) throw new Error(`.zenodo.json disagrees with the paper: ${problems.join("; ")}`);
}

function llmsTxt(en, zh) {
  const url = (path) => SITE_URL + path;
  return `# ${en.meta.title}

> An audit of the structured decision model TypeSafe Jev (jev-1.13.0) and five generative models on Taiwan's sovereignty, using yes or no claims, forced-choice questions and practical labeling tasks in Traditional Chinese, Simplified Chinese and English (957 items, 26,796 calls). The three instruments rank the models differently. By ${en.meta.author}, ${en.meta.version}, dated ${en.meta.date}. The paper is also available in Traditional Chinese (${zh.meta.title}).

Text, items and results are licensed under CC BY 4.0: reuse, adaptation and redistribution are allowed with attribution. Code is licensed under MIT. In the paper's own prose "China" means the People's Republic of China (PRC); item wordings are quoted as written. Generative models report their own probabilities, while Jev outputs probabilities directly, so cross-model values should be read for direction rather than size.

## Paper

- [Paper, English (Markdown)](${url("en/paper.md")}): full text with tables, methods, limitations and references.
- [Paper, Traditional Chinese (Markdown)](${url("paper.md")}): the same paper in Traditional Chinese.
- [Both papers in one file](${url("llms-full.txt")}): the English and Traditional Chinese Markdown concatenated.
- [Paper, English (web page)](${url("en/paper")}): rendered version with citation metadata.
- [Citation metadata (CITATION.cff)](${BLOB}CITATION.cff): how to cite the paper.

## Data

- [Summary results (JSON)](${url("data/summary.json")}): status, place and pooled indices with 95% bootstrap intervals, neutrality tests with exact and Holm-adjusted p, label rates, latency and cost; a schema field explains every key.
- [Item browser data (JSON)](${url("data/items.json")}): all 957 items grouped by base item type, with the wording in three languages and per-model aggregates over every call.
- [Item set (dataset.json)](${BLOB}data/dataset.json): the items exactly as sent to the models.
- [Raw call records (JSONL)](${REPO_URL}/tree/main/results/runs): one line per model call.
- [Statistical output (stats.md)](${BLOB}results/stats.md): every test and sensitivity analysis reported in the paper.

## Addendum

An addendum outside the main analysis adds Claude Sonnet 5.5 (effort low on all 957 items, effort high on the twelve status claims only) and a same-day rerun of Claude Sonnet 5, all run on 29 September 2026. The main analysis and summary.json are unchanged.

- [Addendum results (addendum.md)](${BLOB}results/addendum.md): indices, the same-day comparison, labels, forced choice, latency and cost.
- [Addendum data (JSON)](${url("data/addendum.json")}): claim agreement in the format of summary.json's claim_agreement, with the indices and a schema.
- [Addendum call records (JSONL)](${REPO_URL}/tree/main/results/runs-addendum): one line per model call.

## License

- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): paper, items and results (${BLOB}LICENSE-CC-BY-4.0.txt).
- [MIT](${BLOB}LICENSE): code.

## Optional

- [Item browser](${url("en/explore")}): search and filter every item and see the six models' answers, with a switch that adds the addendum models; each item has a link of the form ${url("en/explore")}#item=<id>.
- [Sensitivity lab](${url("en/lab")}): choose which claims enter the index and recompute it in the browser with the paper's bootstrap, optionally for the addendum models too; exploratory, no p-values.

- [Replay: stance comparison](${url("replay/stance.html")}): the six models' judgments, item by item (Traditional Chinese interface).
- [Source repository](${REPO_URL}): item generator, analysis scripts and site source.
`;
}

// papers: [{ sourcePath, target, markdown }] with markdown already carrying GitHub links.
export function writeAgentFiles({ repo, site, papers }) {
  const withMeta = papers.map((p) => ({ ...p, meta: parseFrontmatter(p.markdown) }));
  const en = withMeta.find((p) => p.target === "en/paper.md");
  const zh = withMeta.find((p) => p.target === "paper.md");
  checkCitation(repo, en.meta);
  checkZenodo(repo, en.meta);

  const write = (path, body) => {
    const out = new URL(`public/${path}`, site);
    mkdirSync(new URL(".", out), { recursive: true });
    writeFileSync(out, body);
    console.log(`agent file: site/public/${path} (${Buffer.byteLength(body)} bytes)`);
  };
  for (const p of withMeta) write(p.target, p.markdown);
  write("llms.txt", llmsTxt(en, zh));
  const full = [en, zh].map((p) => `<!-- Source: ${BLOB}${p.sourcePath} -->\n\n${p.markdown.trim()}\n`).join("\n\n");
  write("llms-full.txt", `# ${en.meta.title}\n\nFull text of the paper in English, then in Traditional Chinese. License: CC BY 4.0. Index: ${SITE_URL}llms.txt\n\n${full}`);

  mkdirSync(new URL("public/data/", site), { recursive: true });
  for (const name of ["summary.json", "addendum.json"]) {
    copyFileSync(new URL(`results/${name}`, repo), new URL(`public/data/${name}`, site));
    console.log(`agent file: results/${name} -> site/public/data/${name}`);
  }
}
