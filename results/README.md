# 執行紀錄的資料夾說明

| 資料夾 | 內容 |
| --- | --- |
| `runs/` | 目前分析所使用的紀錄。第 2 版題庫，`scripts/stats.mjs` 與 `scripts/compare.mjs` 只讀這裡 |
| `runs-v1/` | 第 1 版題庫（2026-09-21）的紀錄。題目已改寫，數字不可與 `runs/` 併用 |
| `runs-discarded/` | 第 2 版期間作廢的紀錄，檔名標明原因 |
| `runs-smoke/` | 冒煙測試，每個模型僅數十筆，不納入分析 |

## 作廢紀錄的原因

- `claude-haiku-4-5-failed-effort-param*`：Haiku 4.5 不接受 `output_config.effort`，整批 400 失敗，未計費，修正後重跑
- `grok-4-7-high-reasoning`：Grok 4.7 預設 `reasoning_effort: high`，與其他模型的 low 設定不對等，改設定後重跑
- `grok-4-7-partial`：低推理強度的部分紀錄，因改為 3 次重複而作廢
- `grok-partial-credits-exhausted`：xAI 餘額用盡中止

## 各模型的設定

| 模型 | 重複次數 | 推理設定 |
| --- | --- | --- |
| jev | 5 | 無此參數 |
| claude-sonnet-5、claude-haiku-4-5 | 5 | Sonnet 為 effort low；Haiku 不支援此參數，未設定 |
| luna-6、sol-6 | 5 | 未設定，採用預設 |
| grok-4-7 | 3 | reasoning_effort low（預設為 high，成本與延遲過高） |
