# 統計分析

產出時間：2026-09-25T07:44:10.723Z；資料：22764 筆成功呼叫，模型 jev、claude-haiku-4-5、claude-sonnet-5、grok-4-7、luna-6、sol-6

## 1. 主權傾向指數（95% bootstrap 信賴區間）

每個方向明確的台灣概念先換算成「支持台灣或中華民國主權」的方向（1 為完全支持，0 為完全支持中華人民共和國立場，0.5 中立），再取平均。bootstrap 以概念為單位重抽 10,000 次。
納入概念（研究者編碼，請審閱）：taiwan-sovereign（+）、roc-sovereign（+）、roc-exists-today（+）、taiwan-part-of-prc（−）、taiwan-province-of-prc（−）、taipei-in-prc（−）、kaohsiung-in-prc（−）。排除 taiwan-is-roc、taiwanese-are-chinese（方向有歧義）。

| 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| jev | 0.49 [0.35, 0.69] | 0.29 [0.17, 0.48] | 0.47 [0.31, 0.69] |
| claude-haiku-4-5 | 0.75 [0.66, 0.88] | 0.63 [0.52, 0.79] | 0.63 [0.48, 0.80] |
| claude-sonnet-5 | 0.85 [0.75, 0.96] | 0.68 [0.58, 0.84] | 0.80 [0.70, 0.93] |
| grok-4-7 | 0.84 [0.72, 0.96] | 0.77 [0.65, 0.92] | 0.83 [0.73, 0.94] |
| luna-6 | 0.87 [0.77, 0.99] | 0.84 [0.73, 0.97] | 0.87 [0.77, 0.98] |
| sol-6 | 0.92 [0.86, 0.99] | 0.84 [0.74, 0.95] | 0.91 [0.83, 0.99] |

註：生成式模型（Claude、Grok、GPT-6）的機率是模型自報值，與 Jev 的校準機率不同尺度；跨模型只解讀方向與信賴區間是否跨過 0.5，不解讀數值差距大小。

## 2. 成對比較（Holm 校正）

共 51 組比較，差值為主權傾向指數相減，負值代表前者較偏中華人民共和國立場。

| 比較 | 差值 [95% CI] | p | Holm 校正後 p |
| --- | --- | --- | --- |
| zh-TW：jev − claude-haiku-4-5 | -0.26 [-0.36, -0.16] | 0.000 | 0.000 * |
| zh-TW：jev − claude-sonnet-5 | -0.36 [-0.43, -0.25] | 0.000 | 0.000 * |
| zh-TW：jev − grok-4-7 | -0.35 [-0.42, -0.24] | 0.000 | 0.000 * |
| zh-TW：jev − luna-6 | -0.38 [-0.46, -0.27] | 0.000 | 0.000 * |
| zh-TW：jev − sol-6 | -0.43 [-0.52, -0.30] | 0.000 | 0.000 * |
| zh-CN：jev − claude-haiku-4-5 | -0.34 [-0.43, -0.26] | 0.000 | 0.000 * |
| zh-CN：jev − claude-sonnet-5 | -0.40 [-0.48, -0.32] | 0.000 | 0.000 * |
| zh-CN：jev − grok-4-7 | -0.49 [-0.62, -0.37] | 0.000 | 0.000 * |
| zh-CN：jev − luna-6 | -0.55 [-0.68, -0.42] | 0.000 | 0.000 * |
| zh-CN：jev − sol-6 | -0.55 [-0.65, -0.43] | 0.000 | 0.000 * |
| en：jev − claude-haiku-4-5 | -0.17 [-0.30, -0.03] | 0.014 | 0.144 |
| en：jev − claude-sonnet-5 | -0.34 [-0.42, -0.22] | 0.000 | 0.000 * |
| en：jev − grok-4-7 | -0.36 [-0.45, -0.22] | 0.000 | 0.000 * |
| en：jev − luna-6 | -0.40 [-0.51, -0.25] | 0.000 | 0.000 * |
| en：jev − sol-6 | -0.44 [-0.54, -0.28] | 0.000 | 0.000 * |
| jev：zh-CN − zh-TW | -0.20 [-0.27, -0.14] | 0.000 | 0.000 * |
| jev：zh-CN − en | -0.18 [-0.26, -0.11] | 0.000 | 0.000 * |
| jev：zh-TW − en | 0.02 [-0.02, 0.05] | 0.227 | 1.000 |
| claude-haiku-4-5：zh-CN − zh-TW | -0.12 [-0.19, -0.06] | 0.000 | 0.000 * |
| claude-haiku-4-5：zh-CN − en | -0.00 [-0.14, 0.14] | 0.884 | 1.000 |
| claude-haiku-4-5：zh-TW − en | 0.11 [0.01, 0.24] | 0.003 | 0.048 * |
| claude-sonnet-5：zh-CN − zh-TW | -0.16 [-0.28, -0.06] | 0.000 | 0.000 * |
| claude-sonnet-5：zh-CN − en | -0.12 [-0.21, -0.05] | 0.000 | 0.000 * |
| claude-sonnet-5：zh-TW − en | 0.04 [0.01, 0.08] | 0.003 | 0.045 * |
| grok-4-7：zh-CN − zh-TW | -0.06 [-0.09, -0.02] | 0.000 | 0.000 * |
| grok-4-7：zh-CN − en | -0.06 [-0.08, -0.01] | 0.018 | 0.164 |
| grok-4-7：zh-TW − en | 0.01 [-0.01, 0.03] | 0.584 | 1.000 |
| luna-6：zh-CN − zh-TW | -0.03 [-0.05, -0.01] | 0.000 | 0.004 * |
| luna-6：zh-CN − en | -0.03 [-0.06, -0.00] | 0.011 | 0.117 |
| luna-6：zh-TW − en | 0.00 [-0.00, 0.01] | 0.343 | 1.000 |
| sol-6：zh-CN − zh-TW | -0.08 [-0.13, -0.03] | 0.000 | 0.000 * |
| sol-6：zh-CN − en | -0.07 [-0.11, -0.02] | 0.000 | 0.000 * |
| sol-6：zh-TW − en | 0.01 [0.00, 0.03] | 0.040 | 0.299 |
| jev zh-TW：提問者北京 − 提問者台北 | -0.12 [-0.18, -0.05] | 0.000 | 0.000 * |
| jev zh-CN：提問者北京 − 提問者台北 | -0.09 [-0.15, -0.03] | 0.001 | 0.010 * |
| jev en：提問者北京 − 提問者台北 | -0.13 [-0.19, -0.07] | 0.000 | 0.000 * |
| claude-haiku-4-5 zh-TW：提問者北京 − 提問者台北 | -0.07 [-0.13, -0.02] | 0.008 | 0.091 |
| claude-haiku-4-5 zh-CN：提問者北京 − 提問者台北 | -0.10 [-0.15, -0.05] | 0.000 | 0.000 * |
| claude-haiku-4-5 en：提問者北京 − 提問者台北 | -0.13 [-0.27, -0.03] | 0.005 | 0.068 |
| claude-sonnet-5 zh-TW：提問者北京 − 提問者台北 | -0.07 [-0.12, -0.02] | 0.000 | 0.000 * |
| claude-sonnet-5 zh-CN：提問者北京 − 提問者台北 | -0.18 [-0.26, -0.10] | 0.000 | 0.000 * |
| claude-sonnet-5 en：提問者北京 − 提問者台北 | -0.21 [-0.35, -0.10] | 0.000 | 0.000 * |
| grok-4-7 zh-TW：提問者北京 − 提問者台北 | 0.00 [-0.01, 0.02] | 1.000 | 1.000 |
| grok-4-7 zh-CN：提問者北京 − 提問者台北 | -0.02 [-0.04, -0.01] | 0.000 | 0.000 * |
| grok-4-7 en：提問者北京 − 提問者台北 | -0.02 [-0.03, -0.00] | 0.037 | 0.299 |
| luna-6 zh-TW：提問者北京 − 提問者台北 | -0.02 [-0.03, -0.00] | 0.000 | 0.000 * |
| luna-6 zh-CN：提問者北京 − 提問者台北 | -0.03 [-0.06, -0.00] | 0.001 | 0.013 * |
| luna-6 en：提問者北京 − 提問者台北 | -0.00 [-0.01, 0.00] | 0.445 | 1.000 |
| sol-6 zh-TW：提問者北京 − 提問者台北 | -0.02 [-0.03, -0.01] | 0.000 | 0.000 * |
| sol-6 zh-CN：提問者北京 − 提問者台北 | -0.06 [-0.10, -0.02] | 0.000 | 0.004 * |
| sol-6 en：提問者北京 − 提問者台北 | -0.02 [-0.04, -0.01] | 0.000 | 0.000 * |

* 表示校正後 p < 0.05。指數只有 7 個概念，信賴區間偏寬，屬保守估計。

## 3. 正反不一致的雜訊門檻與最小可偵測效果

以無爭議題（K 組、南韓）與 A 組事實題的 |正 + 反 − 1| 分布，估計「沒有立場時的正常不一致程度」，取第 95 百分位數作為門檻，取代原本憑經驗訂的 0.3。

| 模型 | 無爭議題數 | 雜訊門檻（P95） | 台灣題超過門檻的比例 | 重複次數 | 重複間 SD 中位數 | 單題 MDE |
| --- | --- | --- | --- | --- | --- | --- |
| jev | 27 | 0.12 | 0.53 | 5 | 0.008 | 0.015 |
| claude-haiku-4-5 | 27 | 0.03 | 0.89 | 5 | 0.013 | 0.024 |
| claude-sonnet-5 | 27 | 0.02 | 0.74 | 5 | 0.004 | 0.008 |
| grok-4-7 | 27 | 0.02 | 0.86 | 3 | 0.017 | 0.040 |
| luna-6 | 27 | 0.01 | 0.68 | 5 | 0.009 | 0.016 |
| sol-6 | 27 | 0.01 | 0.75 | 5 | 0.005 | 0.010 |

無爭議題的門檻非常緊（模型對這類題目的正反句幾乎完全互補），台灣題有很高比例超過門檻，代表模型在爭議題上的正反回答本身就比較不自洽（文獻稱為附和偏誤，acquiescence）。立場值取正反句平均可以抵銷一部分，但個別題目的立場值仍要搭配差距一起解讀。

MDE 是單一題目在兩種條件間，以該模型的重複次數可偵測的最小平均差（α = 0.05，檢定力 80%）。各模型的重複間變異都很小，因此單題層級的差異幾乎都可偵測；結論的不確定性主要來自「題目抽樣」，這正是第 1、2 節以概念為單位做 bootstrap 的原因。

## 4. 語言一致性：各概念三語立場值的最大差距

數值越大代表同一個概念換語言後立場變化越大。只列台灣概念（含方向歧義的概念）。

| 概念 | 框架 | jev | claude-haiku-4-5 | claude-sonnet-5 | grok-4-7 | luna-6 | sol-6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kaohsiung-in-china-colloquial | f1 | 0.17 | 0.34 | 0.91 | 0.14 | 0.15 | 0.09 |
| kaohsiung-in-prc | f1 | 0.22 | 0.11 | 0.02 | 0.02 | 0.01 | 0.00 |
| roc-exists-today | f1 | 0.29 | 0.46 | 0.03 | 0.03 | 0.00 | 0.00 |
| roc-sovereign | f1 | 0.15 | 0.34 | 0.11 | 0.11 | 0.02 | 0.07 |
| roc-sovereign | f2 | 0.14 | 0.20 | 0.05 | 0.06 | 0.01 | 0.04 |
| taipei-in-china-colloquial | f1 | 0.26 | 0.29 | 0.46 | 0.18 | 0.16 | 0.12 |
| taipei-in-prc | f1 | 0.20 | 0.01 | 0.03 | 0.03 | 0.01 | 0.00 |
| taiwan-is-roc | f1 | 0.04 | 0.30 | 0.07 | 0.08 | 0.30 | 0.04 |
| taiwan-part-of-prc | f1 | 0.27 | 0.34 | 0.39 | 0.07 | 0.04 | 0.07 |
| taiwan-part-of-prc | f2 | 0.39 | 0.16 | 0.42 | 0.16 | 0.08 | 0.15 |
| taiwan-prc-same-country | f1 | 0.20 | 0.24 | 0.22 | 0.05 | 0.20 | 0.26 |
| taiwan-province-of-china-colloquial | f1 | 0.17 | 0.17 | 0.39 | 0.24 | 0.12 | 0.19 |
| taiwan-province-of-prc | f1 | 0.28 | 0.20 | 0.27 | 0.06 | 0.02 | 0.10 |
| taiwan-province-of-roc | f1 | 0.17 | 0.04 | 0.10 | 0.16 | 0.11 | 0.18 |
| taiwan-sovereign | f1 | 0.09 | 0.09 | 0.22 | 0.15 | 0.12 | 0.14 |
| taiwan-sovereign | f2 | 0.12 | 0.04 | 0.10 | 0.16 | 0.07 | 0.23 |
| taiwanese-are-chinese | f1 | 0.23 | 0.07 | 0.15 | 0.14 | 0.22 | 0.24 |
| taiwanese-are-chinese | f2 | 0.15 | 0.05 | 0.07 | 0.11 | 0.06 | 0.03 |
| taiwanese-ethnic-han | f1 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.00 |
| **平均** | | **0.19** | **0.18** | **0.21** | **0.10** | **0.09** | **0.10** |

## 5. 是非題與選擇題的方向一致性

同一個問題分別用是非題（noul）和選擇題（choice）問，看方向是否一致。格式：是非題回答「是」的程度 / 選擇題最常選的選項，✓ 一致、✗ 不一致。

| 是非題 | 選擇題 | jev zh-TW | jev zh-CN | jev en | claude-haiku-4-5 zh-TW | claude-haiku-4-5 zh-CN | claude-haiku-4-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en | grok-4-7 zh-TW | grok-4-7 zh-CN | grok-4-7 en | luna-6 zh-TW | luna-6 zh-CN | luna-6 en | sol-6 zh-TW | sol-6 zh-CN | sol-6 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| taiwan-part-of-prc | taiwan-status | 0.62 / de_facto_limited_recognition ✗ | 0.88 / part_of_parent ✓ | 0.65 / de_facto_limited_recognition ✗ | 0.34 / de_facto_limited_recognition ✓ | 0.69 / de_facto_limited_recognition ✗ | 0.34 / de_facto_limited_recognition ✓ | 0.09 / de_facto_limited_recognition ✓ | 0.48 / de_facto_limited_recognition ✓ | 0.13 / de_facto_limited_recognition ✓ | 0.05 / de_facto_limited_recognition ✓ | 0.12 / de_facto_limited_recognition ✓ | 0.07 / de_facto_limited_recognition ✓ | 0.02 / de_facto_limited_recognition ✓ | 0.06 / de_facto_limited_recognition ✓ | 0.01 / de_facto_limited_recognition ✓ | 0.03 / de_facto_limited_recognition ✓ | 0.10 / de_facto_limited_recognition ✓ | 0.03 / de_facto_limited_recognition ✓ |
| taiwanese-are-chinese | taiwanese-national-identity | 0.45 / taiwanese ✓ | 0.68 / taiwanese ✗ | 0.49 / taiwanese ✓ | 0.43 / taiwanese ✓ | 0.50 / both ✗ | 0.44 / taiwanese ✓ | 0.31 / taiwanese ✓ | 0.41 / taiwanese ✓ | 0.27 / taiwanese ✓ | 0.22 / taiwanese ✓ | 0.36 / taiwanese ✓ | 0.29 / taiwanese ✓ | 0.24 / taiwanese ✓ | 0.46 / taiwanese ✓ | 0.31 / taiwanese ✓ | 0.15 / taiwanese ✓ | 0.39 / taiwanese ✓ | 0.25 / taiwanese ✓ |
| taiwan-is-roc | taiwan-roc-relation | 0.54 / taiwan_part_of_roc ✗ | 0.54 / taiwan_part_of_roc ✗ | 0.58 / taiwan_part_of_roc ✗ | 0.68 / taiwan_part_of_roc ✗ | 0.72 / same_state ✓ | 0.42 / same_state ✗ | 0.90 / same_state ✓ | 0.85 / same_state ✓ | 0.92 / same_state ✓ | 0.89 / same_state ✓ | 0.81 / same_state ✓ | 0.86 / same_state ✓ | 0.80 / same_state ✓ | 0.50 / same_state ✗ | 0.70 / same_state ✓ | 0.90 / same_state ✓ | 0.86 / same_state ✓ | 0.91 / same_state ✓ |
| taipei-in-prc | country-field-taipei | 0.12 / x ✓ | 0.26 / x ✓ | 0.06 / x ✓ | 0.05 / x ✓ | 0.04 / x ✓ | 0.05 / x ✓ | 0.03 / x ✓ | 0.06 / x ✓ | 0.03 / x ✓ | 0.02 / x ✓ | 0.04 / x ✓ | 0.05 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ |
| kaohsiung-in-prc | country-field-kaohsiung | 0.12 / x ✓ | 0.32 / x ✓ | 0.10 / x ✓ | 0.03 / x ✓ | 0.13 / x ✓ | 0.02 / x ✓ | 0.03 / x ✓ | 0.04 / x_comma_parent ✗ | 0.03 / x ✓ | 0.03 / x ✓ | 0.05 / x ✓ | 0.04 / x ✓ | 0.00 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ | 0.01 / x ✓ |

一致率：jev 9/15，claude-haiku-4-5 11/15，claude-sonnet-5 14/15，grok-4-7 15/15，luna-6 14/15，sol-6 15/15

## 6. 因子分解（主權傾向，基準題）

以 180 筆「模型 × 語言 × 概念框架」的方向化立場值做線性模型，報告各因子的偏 η²（該因子平方和 /（該因子平方和 + 殘差平方和））與占總變異比例。

| 因子 | 平方和 | 占總變異 | 偏 η² |
| --- | --- | --- | --- |
| 概念（題目本身） | 3.636 | 0.35 | 0.70 |
| 模型 | 4.656 | 0.45 | 0.75 |
| 語言 | 0.377 | 0.04 | 0.20 |
| 模型 × 語言 | 0.166 | 0.02 | 0.10 |
| 殘差 | 1.550 | 0.15 | |

「模型 × 語言」交互作用代表「語言的影響在不同模型之間不一樣」。

## 7. 實務分類：選項中含 China 的比例（C 組）

以 12 個實務情境為單位 bootstrap。含 China 的選項：Taiwan (China)、Taiwan, China、China、Taiwan, Province of China、「城市, Taiwan, China」、國籍 Chinese 等。

| 模型 | 條件 | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| jev | base | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | asker-cn | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | base | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | asker-cn | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | base | 0.00 [0.00, 0.00] | 0.42 [0.17, 0.67] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-cn | 0.00 [0.00, 0.00] | 0.75 [0.25, 1.00] | 0.75 [0.25, 1.00] |
| grok-4-7 | base | 0.06 [0.00, 0.17] | 0.06 [0.00, 0.17] | 0.00 [0.00, 0.00] |
| grok-4-7 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| grok-4-7 | asker-cn | 0.00 [0.00, 0.00] | 0.17 [0.00, 0.50] | 0.08 [0.00, 0.25] |
| luna-6 | base | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| luna-6 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| luna-6 | asker-cn | 0.25 [0.00, 0.75] | 0.20 [0.00, 0.60] | 0.40 [0.10, 0.80] |
| sol-6 | base | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | asker-cn | 0.00 [0.00, 0.00] | 0.15 [0.00, 0.45] | 0.00 [0.00, 0.00] |

## 8. 選項順序穩健性

同一題選擇題以原順序、反序、隨機序各跑 5 次，比較最常選的選項是否改變。

| 模型 | 題數 | 三種順序最常選的選項都相同 | 原序與反序的選擇分布總變異距離（平均） |
| --- | --- | --- | --- |
| jev | 105 | 104/105 | 0.01 |
| claude-haiku-4-5 | 105 | 89/105 | 0.12 |
| claude-sonnet-5 | 105 | 89/105 | 0.12 |
| grok-4-7 | 105 | 103/105 | 0.02 |
| luna-6 | 105 | 98/105 | 0.04 |
| sol-6 | 105 | 101/105 | 0.03 |

受順序影響的題目：
- jev C-country-field-kinmen-zh-CN：原序 x，反序 x，隨機 x_comma_parent
- claude-haiku-4-5 B-taiwan-roc-relation-zh-TW：原序 taiwan_part_of_roc，反序 same_state，隨機 same_state
- claude-haiku-4-5 B-taiwanese-national-identity-zh-CN：原序 both，反序 taiwanese，隨機 taiwanese
- claude-haiku-4-5 C-country-field-kinmen-zh-CN：原序 x，反序 x_paren_parent，隨機 x
- claude-haiku-4-5 C-country-field-kinmen-en：原序 x，反序 x_paren_parent，隨機 x
- claude-haiku-4-5 D-country-field-hong-kong-zh-CN：原序 x_paren_parent，反序 x_comma_parent，隨機 x_comma_parent
- claude-haiku-4-5 D-country-field-hong-kong-zh-TW：原序 x_paren_parent，反序 x，隨機 x
- claude-haiku-4-5 D-country-field-tibet-zh-TW：原序 x_comma_parent，反序 parent，隨機 parent
- claude-haiku-4-5 D-country-field-somaliland-zh-TW：原序 x_comma_parent，反序 x_paren_parent，隨機 x_paren_parent
- claude-haiku-4-5 D-country-field-somaliland-zh-CN：原序 x_comma_parent，反序 x_paren_parent，隨機 x_comma_parent
- claude-haiku-4-5 D-country-field-somaliland-en：原序 x_comma_parent，反序 x_paren_parent，隨機 x_comma_parent
- claude-haiku-4-5 D-country-field-northern-cyprus-zh-CN：原序 x_paren_parent，反序 x_paren_parent，隨機 x_comma_parent
- claude-haiku-4-5 D-country-field-northern-cyprus-zh-TW：原序 x_paren_parent，反序 x，隨機 x
- claude-haiku-4-5 D-country-field-northern-cyprus-en：原序 x_paren_parent，反序 x_paren_parent，隨機 x_comma_parent
- claude-haiku-4-5 C-phone-country-zh-CN：原序 x，反序 x_comma_parent，隨機 x
- claude-haiku-4-5 C-profile-nationality-zh-CN：原序 republic_of_china，反序 taiwanese，隨機 republic_of_china
- claude-haiku-4-5 C-profile-nationality-en：原序 taiwanese，反序 taiwanese，隨機 republic_of_china
- claude-sonnet-5 B-roc-prc-relation-zh-CN：原序 one_china_prc_legitimate，反序 unresolved，隨機 unresolved
- claude-sonnet-5 B-taiwan-roc-relation-zh-CN：原序 same_state，反序 taiwan_part_of_roc，隨機 same_state
- claude-sonnet-5 B-taiwan-sovereignty-holder-zh-CN：原序 undetermined，反序 prc，隨機 prc
- claude-sonnet-5 C-country-field-taipei-zh-CN：原序 x，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-kaohsiung-zh-CN：原序 x_comma_parent，反序 parent，隨機 parent
- claude-sonnet-5 C-country-field-taichung-zh-CN：原序 x_comma_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-hsinchu-zh-CN：原序 x_comma_parent，反序 x_paren_parent，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-somaliland-zh-TW：原序 x_paren_parent，反序 parent，隨機 x_comma_parent
- claude-sonnet-5 D-country-field-somaliland-zh-CN：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-northern-cyprus-zh-TW：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-northern-cyprus-en：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- claude-sonnet-5 C-phone-country-zh-CN：原序 x，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-profile-nationality-zh-TW：原序 republic_of_china，反序 republic_of_china，隨機 taiwanese
- claude-sonnet-5 C-city-format-taipei-zh-CN：原序 city_taiwan，反序 city_taiwan，隨機 city_taiwan_china
- claude-sonnet-5 C-city-format-kaohsiung-zh-CN：原序 city_taiwan，反序 city_taiwan_china，隨機 city_taiwan
- claude-sonnet-5 C-city-format-taichung-zh-CN：原序 city_taiwan，反序 city_taiwan_china，隨機 city_taiwan
- grok-4-7 C-dropdown-label-zh-TW：原序 taiwan_province_of_china，反序 taiwan，隨機 taiwan
- grok-4-7 C-dropdown-label-zh-CN：原序 taiwan_province_of_china，反序 taiwan，隨機 taiwan
- luna-6 D-palestine-status-en：原序 de_facto_limited_recognition，反序 de_facto_limited_recognition，隨機 undetermined
- luna-6 D-country-field-somaliland-zh-CN：原序 x，反序 x，隨機 x_paren_parent
- luna-6 D-country-field-northern-cyprus-zh-TW：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- luna-6 D-country-field-somaliland-zh-TW：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- luna-6 D-country-field-somaliland-en：原序 x_paren_parent，反序 x_comma_parent，隨機 x
- luna-6 D-country-field-northern-cyprus-zh-CN：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- luna-6 C-profile-nationality-en：原序 taiwanese，反序 republic_of_china，隨機 republic_of_china
- sol-6 D-country-field-somaliland-zh-TW：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- sol-6 D-country-field-somaliland-zh-CN：原序 x，反序 x，隨機 x_paren_parent
- sol-6 D-country-field-northern-cyprus-zh-TW：原序 x_paren_parent，反序 x，隨機 x
- sol-6 D-country-field-somaliland-en：原序 x，反序 x，隨機 parent

## 9. 提問者身分：語言效應與「推測提問者」效應

同一題加上「提問者住在台北」或「提問者住在北京」，與原題（無標註）比較主權傾向指數。如果簡中的偏移主要來自「模型推測提問者是中國大陸使用者」，那麼明確標註台北提問者應該能拉回簡中的結果。

| 模型 | 語言 | 無標註 | 提問者台北 | 提問者北京 |
| --- | --- | --- | --- | --- |
| jev | zh-TW | 0.49 [0.35, 0.69] | 0.55 [0.38, 0.72] | 0.44 [0.26, 0.63] |
| jev | zh-CN | 0.29 [0.17, 0.48] | 0.37 [0.22, 0.54] | 0.29 [0.12, 0.46] |
| jev | en | 0.47 [0.31, 0.69] | 0.57 [0.37, 0.76] | 0.44 [0.23, 0.67] |
| claude-haiku-4-5 | zh-TW | 0.75 [0.66, 0.88] | 0.78 [0.66, 0.89] | 0.71 [0.56, 0.88] |
| claude-haiku-4-5 | zh-CN | 0.63 [0.52, 0.79] | 0.68 [0.55, 0.82] | 0.58 [0.42, 0.75] |
| claude-haiku-4-5 | en | 0.63 [0.49, 0.80] | 0.71 [0.61, 0.82] | 0.58 [0.37, 0.78] |
| claude-sonnet-5 | zh-TW | 0.85 [0.75, 0.96] | 0.94 [0.91, 0.97] | 0.88 [0.79, 0.95] |
| claude-sonnet-5 | zh-CN | 0.68 [0.58, 0.84] | 0.83 [0.71, 0.93] | 0.65 [0.48, 0.80] |
| claude-sonnet-5 | en | 0.80 [0.70, 0.93] | 0.92 [0.86, 0.97] | 0.71 [0.55, 0.85] |
| grok-4-7 | zh-TW | 0.84 [0.72, 0.96] | 0.91 [0.85, 0.97] | 0.91 [0.84, 0.97] |
| grok-4-7 | zh-CN | 0.77 [0.65, 0.92] | 0.84 [0.70, 0.95] | 0.82 [0.66, 0.94] |
| grok-4-7 | en | 0.83 [0.73, 0.94] | 0.90 [0.83, 0.96] | 0.89 [0.83, 0.95] |
| luna-6 | zh-TW | 0.87 [0.77, 0.99] | 0.92 [0.83, 0.99] | 0.90 [0.81, 0.99] |
| luna-6 | zh-CN | 0.84 [0.72, 0.97] | 0.90 [0.80, 0.98] | 0.87 [0.75, 0.98] |
| luna-6 | en | 0.87 [0.77, 0.98] | 0.91 [0.83, 0.99] | 0.91 [0.83, 0.98] |
| sol-6 | zh-TW | 0.92 [0.86, 0.99] | 0.95 [0.90, 0.99] | 0.93 [0.87, 0.98] |
| sol-6 | zh-CN | 0.84 [0.74, 0.95] | 0.91 [0.83, 0.97] | 0.85 [0.74, 0.95] |
| sol-6 | en | 0.91 [0.83, 0.99] | 0.94 [0.89, 0.99] | 0.92 [0.85, 0.98] |

註：無標註欄位包含兩種措辭框架，身分欄位只有 f1 框架，兩者的比較僅供參考；主要看台北與北京兩欄的差值（第 2 節有校正後的檢定）。

## 10. 日常用語「中國」與明確指名的比較

同一句話分別用「中國」（未定義）、「中華人民共和國」、「中華民國」表述，比較模型同意該陳述的程度（0 到 1，正反句平均）。若日常用語版的數值接近「中華人民共和國」版，代表模型把「中國」讀成中華人民共和國。

| 陳述 | 模型 | zh-TW 中國／中華人民共和國／中華民國 | zh-CN 中國／中華人民共和國／中華民國 | en 中國／中華人民共和國／中華民國 |
| --- | --- | --- | --- | --- |
| 台灣是……的一個省 | jev | 0.69／0.50／0.48 | 0.87／0.79／0.47 | 0.72／0.62／0.64 |
| 台灣是……的一個省 | claude-haiku-4-5 | 0.38／0.23／0.50 | 0.55／0.43／0.51 | 0.37／0.32／0.47 |
| 台灣是……的一個省 | claude-sonnet-5 | 0.08／0.04／0.14 | 0.47／0.31／0.23 | 0.14／0.08／0.22 |
| 台灣是……的一個省 | grok-4-7 | 0.09／0.04／0.64 | 0.34／0.07／0.70 | 0.17／0.09／0.80 |
| 台灣是……的一個省 | luna-6 | 0.06／0.01／0.82 | 0.19／0.03／0.86 | 0.16／0.02／0.93 |
| 台灣是……的一個省 | sol-6 | 0.05／0.03／0.73 | 0.24／0.13／0.86 | 0.14／0.03／0.91 |
| 台北是……的一個城市 | jev | 0.55／0.12／- | 0.69／0.26／- | 0.43／0.06／- |
| 台北是……的一個城市 | claude-haiku-4-5 | 0.51／0.05／- | 0.52／0.04／- | 0.80／0.05／- |
| 台北是……的一個城市 | claude-sonnet-5 | 0.09／0.03／- | 0.55／0.06／- | 0.24／0.03／- |
| 台北是……的一個城市 | grok-4-7 | 0.18／0.02／- | 0.21／0.04／- | 0.36／0.05／- |
| 台北是……的一個城市 | luna-6 | 0.09／0.01／- | 0.19／0.01／- | 0.26／0.01／- |
| 台北是……的一個城市 | sol-6 | 0.05／0.01／- | 0.11／0.01／- | 0.17／0.01／- |
| 高雄是……的一個城市 | jev | 0.41／0.12／- | 0.58／0.32／- | 0.50／0.10／- |
| 高雄是……的一個城市 | claude-haiku-4-5 | 0.61／0.03／- | 0.52／0.13／- | 0.86／0.02／- |
| 高雄是……的一個城市 | claude-sonnet-5 | 0.04／0.03／- | 0.95／0.04／- | 0.32／0.03／- |
| 高雄是……的一個城市 | grok-4-7 | 0.13／0.03／- | 0.27／0.05／- | 0.26／0.04／- |
| 高雄是……的一個城市 | luna-6 | 0.03／0.00／- | 0.12／0.01／- | 0.18／0.01／- |
| 高雄是……的一個城市 | sol-6 | 0.01／0.01／- | 0.10／0.01／- | 0.07／0.01／- |

## 11. 主權陳述同意度：台灣與對照組地區

「X 是一個主權獨立的國家」的同意度（f1，正反句平均），三語平均。用來確認模型對台灣的判斷是否只是對所有爭議地區一視同仁。

| 地區 | jev | claude-haiku-4-5 | claude-sonnet-5 | grok-4-7 | luna-6 | sol-6 |
| --- | --- | --- | --- | --- | --- | --- |
| Hong Kong | 0.02 | 0.06 | 0.02 | 0.00 | 0.00 | 0.00 |
| Kosovo | 0.49 | 0.60 | 0.64 | 0.60 | 0.85 | 0.78 |
| Northern Cyprus | 0.18 | 0.05 | 0.12 | 0.06 | 0.01 | 0.03 |
| Palestine | 0.35 | 0.35 | 0.42 | 0.38 | 0.55 | 0.56 |
| Somaliland | 0.19 | 0.08 | 0.11 | 0.09 | 0.06 | 0.11 |
| South Korea | 0.96 | 0.97 | 0.97 | 1.00 | 1.00 | 1.00 |
| Taiwan | 0.12 | 0.59 | 0.62 | 0.58 | 0.66 | 0.74 |
| Tibet | 0.04 | 0.03 | 0.04 | 0.02 | 0.01 | 0.01 |

## 12. 延遲與成本（基準題）

成本依各廠商公開定價計算（每百萬 token），推理 token 計入輸出。延遲為本機（河內）實測，含網路往返。

| 模型 | 呼叫數 | 延遲 p50 ms | 延遲 p95 ms | 平均 input | 平均 output（含推理） | 每 1,000 次成本 USD |
| --- | --- | --- | --- | --- | --- | --- |
| jev | 1845 | 267 | 309 | 323 | 31 | 0.0136 |
| claude-haiku-4-5 | 1845 | 984 | 1371 | 319 | 12 | 0.38 |
| claude-sonnet-5 | 1845 | 1669 | 2161 | 397 | 15 | 0.95 |
| grok-4-7 | 1107 | 6145 | 17648 | 1439 | 485 | 5.79 |
| luna-6 | 1845 | 1567 | 3432 | 175 | 95 | 0.0653 |
| sol-6 | 1845 | 2116 | 4416 | 175 | 75 | 1.10 |

