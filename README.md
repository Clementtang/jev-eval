# jev-eval

以三種題型稽核 TypeSafe 的結構化判斷模型 Jev（`jev-1.13.0`）與五個生成式模型（Claude Haiku 4.5、Claude Sonnet 5、Grok 4.7、GPT-6 Luna、GPT-6 Sol）在台灣主權議題上的判斷：是非題主張、強迫選擇題、實務標籤。題目有繁中、簡中、英文三個版本。

An audit of TypeSafe's structured decision model Jev (`jev-1.13.0`) and five generative models (Claude Haiku 4.5, Claude Sonnet 5, Grok 4.7, GPT-6 Luna, GPT-6 Sol) on Taiwan's sovereignty, using yes or no claims, forced-choice questions and practical labeling tasks in Traditional Chinese, Simplified Chinese and English.

## 論文 / Paper

- 繁體中文：[`docs/paper/paper.zh-TW.md`](docs/paper/paper.zh-TW.md)
- English: [`docs/paper/paper.en.md`](docs/paper/paper.en.md)

預印本，未經同儕審查。四輪對抗式審查的報告放在 `docs/paper/review-*.md`。

Preprint, not peer reviewed. The four adversarial review rounds are in `docs/paper/review-*.md`.

## 內容 / Contents

| 路徑 / Path             | 說明 / Description                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/dataset.json`     | 957 題：139 個基準題型 × 三語（417 題），加上 540 題選項順序與提問者變體 / 957 items: 139 base item types in three languages (417 items) plus 540 option-order and asker variants |
| `results/runs/*.jsonl`  | 分析用的 26,796 次模型呼叫原始紀錄 / Raw records of the 26,796 calls analyzed                                                                                                     |
| `results/stats.md`      | 統計分析：地位指數、精確符號翻轉檢定、Holm 校正、替代主張集合、穩健性檢查 / Status index, exact sign-flip tests, Holm correction, alternative claim sets, robustness checks       |
| `results/comparison.md` | 六個模型的逐題並排比較 / Item-level side-by-side comparison of the six models                                                                                                     |
| `docs/test-plan.md`     | 測試計畫 / Test plan                                                                                                                                                              |
| `docs/research/`        | 前人研究整理與引用查證 / Prior work and citation checks                                                                                                                           |
| `public/stance.html`    | 同題對照重播：六個模型對同一題的判斷 / Replay of the six models' judgments, one question at a time                                                                                |
| `public/race.html`      | 速度對照重播：以實測延遲重播 / Speed replay using measured latencies                                                                                                              |

`results/runs-v1/` 是第一版題庫的紀錄，`results/runs-discarded/` 是分析前排除的檔案（檔名註明原因），兩者都不納入分析。

`results/runs-v1/` holds the first item version and `results/runs-discarded/` the files excluded before analysis (reason in each file name); neither is analyzed.

## 重現 / Reproduce

需要 Node.js 24 以上。不呼叫任何 API 也可以重跑分析與重播，只讀取 `results/runs/` 的既有紀錄：

Requires Node.js 24+. Analysis and replays need no API calls; they read the existing records in `results/runs/`:

```sh
npm install
node scripts/stats.mjs     # 產生 results/stats.md / regenerate results/stats.md
node server.mjs            # 本機重播 / local replay: http://127.0.0.1:4173/stance 與 /race
```

重新呼叫模型需要各廠商的 API 金鑰。本專案以 1Password CLI 注入，`.env.op` 只放 `op://` reference，不在 repo 中，請自行建立：

Calling the models again needs each vendor's API key. This project injects them with the 1Password CLI; `.env.op` holds only `op://` references and is not in the repo, so create your own:

```sh
npm run validate                                                   # 檢查資料集結構 / validate the dataset
op run --env-file .env.op -- node scripts/run-all.mjs --repeats 5  # 全部模型 / all targets
```

## 利益揭露 / Disclosure

題目生成、程式、統計分析與論文撰寫由 Claude（Anthropic）協助完成，受測模型包含兩個 Claude 模型。前兩輪審查由另開的 Claude 工作階段執行，第三、四輪由 GPT-6 Astra（OpenAI Codex CLI）與 Grok（xAI Grok Build）執行，這兩家也各有受測模型。作者與 TypeSafe、Anthropic、xAI、OpenAI 均無財務關係，API 費用自付。

Items, code, statistical analysis and the paper were drafted with the help of Claude (Anthropic), and two Claude models are among those tested. Review rounds one and two were run by separate Claude sessions; rounds three and four by GPT-6 Astra (OpenAI Codex CLI) and Grok (xAI Grok Build), whose vendors also have tested models. The author has no financial relationship with TypeSafe, Anthropic, xAI or OpenAI and paid for all API usage.
