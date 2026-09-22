# jev-eval

測試 TypeSafe 的結構化判斷模型 Jev（`jev-1.13.0`）在台灣主權相關題目上的立場，並以 Claude Sonnet 5、Claude Opus 5 為對照。

Measures the stance of TypeSafe's structured decision model Jev (`jev-1.13.0`) on questions about Taiwan's sovereignty, with Claude Sonnet 5 and Claude Opus 5 as comparison models.

## 內容 / Contents

| 路徑 / Path             | 說明 / Description                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/dataset.json`     | 735 題（351 題基準題加上選項順序、提問者身分變體），繁中、簡中、英文 / 735 items (351 base items plus option-order and asker variants) in Traditional Chinese, Simplified Chinese and English |
| `results/runs/*.jsonl`  | 每一次模型呼叫的原始紀錄 / Raw record of every model call                                                                                                                                     |
| `results/stats.md`      | 統計分析：bootstrap 信賴區間、Holm 校正、因子分解、穩健性檢查 / Bootstrap CIs, Holm-corrected comparisons, factor decomposition, robustness checks                                            |
| `results/comparison.md` | 三個模型的逐題並排比較 / Item-level side-by-side comparison                                                                                                                                   |
| `docs/test-plan.md`     | 測試計劃與方法 / Test plan and method                                                                                                                                                         |
| `docs/research/`        | 前人研究整理與引用查證 / Prior work and citation checks                                                                                                                                       |
| `public/race.html`      | 以實測延遲重播的賽跑畫面 / Race replay using measured latencies                                                                                                                               |

## 重現 / Reproduce

需要 Node.js 24 以上。金鑰透過 1Password CLI 注入，`.env.op` 只放 `op://` reference（此檔不在 repo 中，請自行建立）。

Requires Node.js 24+. API keys are injected with the 1Password CLI; `.env.op` holds only `op://` references and is not in the repo, so create your own.

```sh
npm install
npm run validate                                   # 檢查資料集結構 / validate dataset structure
npm run batch -- --target jev --repeats 5          # 需要 TYPESAFE_API_KEY
npm run batch -- --target claude-opus-5 --repeats 5  # 需要 ANTHROPIC_API_KEY
node scripts/stats.mjs                             # 產生 results/stats.md
npm start                                          # 本機 demo：http://127.0.0.1:4173 與 /race
```

不呼叫任何 API 也可以重跑分析：`node scripts/stats.mjs` 只讀取 `results/runs/` 的既有紀錄。

The analysis can be rerun without any API calls: `node scripts/stats.mjs` only reads the existing records in `results/runs/`.

## 利益揭露 / Disclosure

題目生成、程式撰寫與統計分析由 Claude（Anthropic）協助完成，而 Claude 同時是受測對象之一。對 Claude 不利的結果照實列出。

Item generation, code and statistical analysis were done with the help of Claude (Anthropic), which is also one of the models under test. Results unfavorable to Claude are reported as found.
