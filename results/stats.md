# 統計分析

產出時間：2026-09-25T11:06:59.245Z；資料：26796 筆成功呼叫，模型 jev、claude-haiku-4-5、claude-sonnet-5、grok-4-7、luna-6、sol-6

## 1. 主權傾向指數（95% bootstrap 信賴區間）

每個方向明確的台灣概念先換算成「支持台灣或中華民國主權」的方向（1 為完全支持，0 為完全支持中華人民共和國立場，0.5 中立），每個概念等權（有兩種措辭的概念先平均），再取 15 個概念的平均。bootstrap 以概念為單位重抽 10,000 次；概念數少時百分位 bootstrap 的區間可能偏窄，推論以第 2 節的精確符號翻轉檢定為準。
納入概念（研究者編碼，請審閱）：taiwan-sovereign（+）、roc-sovereign（+）、roc-exists-today（+）、roc-separate-from-prc（+）、taiwan-future-by-its-people（+）、taiwan-may-join-intl-orgs（+）、roc-govt-legitimate-for-taiwan（+）、taiwan-part-of-prc（−）、taiwan-province-of-prc（−）、taipei-in-prc（−）、kaohsiung-in-prc（−）、taichung-in-prc（−）、prc-holds-sovereignty-over-taiwan（−）、prc-govt-represents-taiwan（−）、taiwan-question-prc-internal-affair（−）。排除 taiwan-is-roc、taiwanese-are-chinese（方向有歧義）。

| 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| jev | 0.50 [0.37, 0.63] | 0.35 [0.23, 0.49] | 0.51 [0.38, 0.64] |
| claude-haiku-4-5 | 0.69 [0.60, 0.79] | 0.59 [0.48, 0.70] | 0.67 [0.57, 0.77] |
| claude-sonnet-5 | 0.81 [0.71, 0.90] | 0.65 [0.54, 0.76] | 0.79 [0.70, 0.88] |
| grok-4-7 | 0.85 [0.78, 0.91] | 0.78 [0.70, 0.86] | 0.85 [0.79, 0.90] |
| luna-6 | 0.89 [0.82, 0.95] | 0.85 [0.78, 0.92] | 0.87 [0.78, 0.94] |
| sol-6 | 0.93 [0.89, 0.96] | 0.85 [0.78, 0.92] | 0.91 [0.85, 0.96] |

註：生成式模型（Claude、Grok、GPT-6）的機率是模型自報值，與 Jev 的校準機率不同尺度；跨模型只解讀方向與信賴區間是否跨過 0.5，不解讀數值差距大小。

### 1b. 與中立值 0.5 的比較（精確符號翻轉檢定，Holm 校正）

以每個概念的指數值減 0.5 做單樣本精確符號翻轉檢定，18 格自成一組做 Holm 校正。「低於 0.5 的概念數」表示偏向中華人民共和國立場的概念有幾個。

| 模型 | 語言 | 指數 | 低於 0.5 的概念數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| jev | zh-TW | 0.50 | 9/15 | 0.988 | 1.000 |
| jev | zh-CN | 0.35 | 10/15 | 0.051 | 0.204 |
| jev | en | 0.51 | 9/15 | 0.931 | 1.000 |
| claude-haiku-4-5 | zh-TW | 0.69 | 2/15 | 0.002 | 0.015 * |
| claude-haiku-4-5 | zh-CN | 0.59 | 4/15 | 0.136 | 0.409 |
| claude-haiku-4-5 | en | 0.67 | 2/15 | 0.005 | 0.032 * |
| claude-sonnet-5 | zh-TW | 0.81 | 1/15 | < 0.001 | 0.002 * |
| claude-sonnet-5 | zh-CN | 0.65 | 3/15 | 0.025 | 0.125 |
| claude-sonnet-5 | en | 0.79 | 1/15 | < 0.001 | 0.002 * |
| grok-4-7 | zh-TW | 0.85 | 0/15 | < 0.001 | 0.001 * |
| grok-4-7 | zh-CN | 0.78 | 0/15 | < 0.001 | 0.001 * |
| grok-4-7 | en | 0.85 | 0/15 | < 0.001 | 0.001 * |
| luna-6 | zh-TW | 0.89 | 0/15 | < 0.001 | 0.001 * |
| luna-6 | zh-CN | 0.85 | 0/15 | < 0.001 | 0.001 * |
| luna-6 | en | 0.87 | 1/15 | < 0.001 | 0.001 * |
| sol-6 | zh-TW | 0.93 | 0/15 | < 0.001 | 0.001 * |
| sol-6 | zh-CN | 0.85 | 0/15 | < 0.001 | 0.001 * |
| sol-6 | en | 0.91 | 0/15 | < 0.001 | 0.001 * |

## 2. 成對比較（精確符號翻轉檢定，Holm 校正）

共 51 組比較。差值為主權傾向指數相減，負值代表前者較偏中華人民共和國立場。p 值來自以概念為單位的精確符號翻轉檢定（列舉全部 2^n 種正負號組合），再對全部比較做 Holm 校正；區間為概念層級的 bootstrap。「前者較低的概念數」表示在 n 個概念中有幾個概念的差值為負。

| 比較 | 差值 [95% CI] | 前者較低的概念數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- |
| zh-TW：jev − claude-haiku-4-5 | -0.19 [-0.28, -0.11] | 14/15 | 0.001 | 0.026 * |
| zh-TW：jev − claude-sonnet-5 | -0.31 [-0.38, -0.24] | 15/15 | < 0.001 | 0.003 * |
| zh-TW：jev − grok-4-7 | -0.35 [-0.43, -0.26] | 15/15 | < 0.001 | 0.003 * |
| zh-TW：jev − luna-6 | -0.39 [-0.48, -0.30] | 15/15 | < 0.001 | 0.003 * |
| zh-TW：jev − sol-6 | -0.43 [-0.52, -0.33] | 15/15 | < 0.001 | 0.003 * |
| zh-CN：jev − claude-haiku-4-5 | -0.24 [-0.33, -0.13] | 12/15 | 0.001 | 0.026 * |
| zh-CN：jev − claude-sonnet-5 | -0.30 [-0.38, -0.22] | 15/15 | < 0.001 | 0.003 * |
| zh-CN：jev − grok-4-7 | -0.43 [-0.52, -0.33] | 15/15 | < 0.001 | 0.003 * |
| zh-CN：jev − luna-6 | -0.50 [-0.59, -0.41] | 15/15 | < 0.001 | 0.003 * |
| zh-CN：jev − sol-6 | -0.50 [-0.59, -0.41] | 15/15 | < 0.001 | 0.003 * |
| en：jev − claude-haiku-4-5 | -0.16 [-0.26, -0.07] | 13/15 | 0.005 | 0.081 |
| en：jev − claude-sonnet-5 | -0.29 [-0.36, -0.21] | 15/15 | < 0.001 | 0.003 * |
| en：jev − grok-4-7 | -0.34 [-0.43, -0.25] | 15/15 | < 0.001 | 0.003 * |
| en：jev − luna-6 | -0.36 [-0.45, -0.27] | 15/15 | < 0.001 | 0.003 * |
| en：jev − sol-6 | -0.41 [-0.50, -0.30] | 15/15 | < 0.001 | 0.003 * |
| jev：zh-CN − zh-TW | -0.14 [-0.19, -0.10] | 15/15 | < 0.001 | 0.003 * |
| jev：zh-CN − en | -0.15 [-0.20, -0.11] | 15/15 | < 0.001 | 0.003 * |
| jev：zh-TW − en | -0.01 [-0.04, 0.02] | 8/15 | 0.669 | 1.000 |
| claude-haiku-4-5：zh-CN − zh-TW | -0.10 [-0.15, -0.06] | 13/15 | < 0.001 | 0.010 * |
| claude-haiku-4-5：zh-CN − en | -0.08 [-0.16, 0.01] | 12/15 | 0.108 | 1.000 |
| claude-haiku-4-5：zh-TW − en | 0.02 [-0.05, 0.11] | 7/15 | 0.632 | 1.000 |
| claude-sonnet-5：zh-CN − zh-TW | -0.16 [-0.22, -0.11] | 15/15 | < 0.001 | 0.003 * |
| claude-sonnet-5：zh-CN − en | -0.14 [-0.21, -0.09] | 15/15 | < 0.001 | 0.003 * |
| claude-sonnet-5：zh-TW − en | 0.02 [-0.03, 0.06] | 3/15 | 0.468 | 1.000 |
| grok-4-7：zh-CN − zh-TW | -0.06 [-0.09, -0.04] | 14/15 | < 0.001 | 0.004 * |
| grok-4-7：zh-CN − en | -0.07 [-0.10, -0.03] | 13/15 | 0.001 | 0.026 * |
| grok-4-7：zh-TW − en | -0.00 [-0.02, 0.02] | 7/15 | 0.954 | 1.000 |
| luna-6：zh-CN − zh-TW | -0.04 [-0.07, -0.01] | 13/15 | 0.036 | 0.392 |
| luna-6：zh-CN − en | -0.02 [-0.07, 0.04] | 11/15 | 0.530 | 1.000 |
| luna-6：zh-TW − en | 0.02 [-0.00, 0.05] | 3/15 | 0.242 | 1.000 |
| sol-6：zh-CN − zh-TW | -0.07 [-0.11, -0.04] | 15/15 | < 0.001 | 0.003 * |
| sol-6：zh-CN − en | -0.06 [-0.09, -0.03] | 13/15 | < 0.001 | 0.020 * |
| sol-6：zh-TW − en | 0.02 [-0.00, 0.04] | 5/15 | 0.154 | 1.000 |
| jev zh-TW：提問者北京 − 提問者台北 | -0.11 [-0.15, -0.08] | 15/15 | < 0.001 | 0.003 * |
| jev zh-CN：提問者北京 − 提問者台北 | -0.09 [-0.12, -0.05] | 13/15 | < 0.001 | 0.006 * |
| jev en：提問者北京 − 提問者台北 | -0.15 [-0.19, -0.10] | 15/15 | < 0.001 | 0.003 * |
| claude-haiku-4-5 zh-TW：提問者北京 − 提問者台北 | -0.07 [-0.10, -0.04] | 12/15 | 0.001 | 0.026 * |
| claude-haiku-4-5 zh-CN：提問者北京 − 提問者台北 | -0.10 [-0.15, -0.06] | 15/15 | < 0.001 | 0.003 * |
| claude-haiku-4-5 en：提問者北京 − 提問者台北 | -0.10 [-0.17, -0.05] | 13/15 | 0.001 | 0.023 * |
| claude-sonnet-5 zh-TW：提問者北京 − 提問者台北 | -0.13 [-0.19, -0.07] | 14/15 | < 0.001 | 0.004 * |
| claude-sonnet-5 zh-CN：提問者北京 − 提問者台北 | -0.24 [-0.33, -0.16] | 15/15 | < 0.001 | 0.003 * |
| claude-sonnet-5 en：提問者北京 − 提問者台北 | -0.27 [-0.37, -0.18] | 15/15 | < 0.001 | 0.003 * |
| grok-4-7 zh-TW：提問者北京 − 提問者台北 | -0.00 [-0.02, 0.01] | 8/15 | 0.705 | 1.000 |
| grok-4-7 zh-CN：提問者北京 − 提問者台北 | -0.02 [-0.03, -0.01] | 11/15 | 0.011 | 0.137 |
| grok-4-7 en：提問者北京 − 提問者台北 | -0.02 [-0.03, -0.00] | 10/15 | 0.029 | 0.354 |
| luna-6 zh-TW：提問者北京 − 提問者台北 | -0.03 [-0.05, -0.01] | 14/15 | < 0.001 | 0.004 * |
| luna-6 zh-CN：提問者北京 − 提問者台北 | -0.03 [-0.05, -0.01] | 11/15 | 0.007 | 0.092 |
| luna-6 en：提問者北京 − 提問者台北 | -0.00 [-0.02, 0.02] | 12/15 | 0.917 | 1.000 |
| sol-6 zh-TW：提問者北京 − 提問者台北 | -0.02 [-0.04, -0.01] | 14/15 | < 0.001 | 0.004 * |
| sol-6 zh-CN：提問者北京 − 提問者台北 | -0.06 [-0.09, -0.03] | 13/15 | 0.004 | 0.064 |
| sol-6 en：提問者北京 − 提問者台北 | -0.03 [-0.05, -0.02] | 14/15 | < 0.001 | 0.010 * |

* 表示校正後 p < 0.05。

## 3. 正反不一致的雜訊門檻與最小可偵測效果

以無爭議題（K 組、南韓）與 A 組事實題的 |正 + 反 − 1| 分布，估計「沒有立場時的正常不一致程度」，取第 95 百分位數作為門檻，取代原本憑經驗訂的 0.3。

| 模型 | 無爭議題數 | 雜訊門檻（P95） | 台灣題超過門檻的比例 | 台灣題平均 \|差距\| | 重複次數 | 重複間 SD 中位數 | 單題 MDE |
| --- | --- | --- | --- | --- | --- | --- | --- |
| jev | 27 | 0.12 | 0.59 | 0.188 | 5 | 0.008 | 0.015 |
| claude-haiku-4-5 | 27 | 0.03 | 0.90 | 0.371 | 5 | 0.018 | 0.032 |
| claude-sonnet-5 | 27 | 0.02 | 0.78 | 0.128 | 5 | 0.004 | 0.008 |
| grok-4-7 | 27 | 0.02 | 0.90 | 0.132 | 3 | 0.023 | 0.053 |
| luna-6 | 27 | 0.01 | 0.72 | 0.079 | 5 | 0.015 | 0.027 |
| sol-6 | 27 | 0.01 | 0.73 | 0.071 | 5 | 0.009 | 0.016 |

無爭議題的門檻非常緊（模型對這類題目的正反句幾乎完全互補），台灣題有很高比例超過門檻，代表模型在爭議題上的正反回答本身就比較不自洽（文獻稱為附和偏誤，acquiescence）。立場值取正反句平均可以抵銷一部分，但個別題目的立場值仍要搭配差距一起解讀。

「超過門檻的比例」以各模型自己的門檻計算，門檻寬的模型（例如 Jev 0.12）會顯得比較自洽；跨模型比較自洽程度時，應看「台灣題平均 |差距|」這個絕對值。

MDE 是單一題目在兩種條件間，以該模型的重複次數可偵測的最小平均差（α = 0.05，檢定力 80%）。各模型的重複間變異都很小，因此單題層級的差異幾乎都可偵測；結論的不確定性主要來自「題目抽樣」，這是第 1、2 節以概念（主張）為推論單位的原因。

## 4. 語言一致性：各概念三語立場值的最大差距

數值越大代表同一個概念換語言後立場變化越大。只列台灣概念（含方向歧義的概念）。

| 概念 | 框架 | jev | claude-haiku-4-5 | claude-sonnet-5 | grok-4-7 | luna-6 | sol-6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kaohsiung-in-china-colloquial | f1 | 0.17 | 0.34 | 0.91 | 0.14 | 0.15 | 0.09 |
| kaohsiung-in-prc | f1 | 0.22 | 0.11 | 0.02 | 0.02 | 0.01 | 0.00 |
| prc-govt-represents-taiwan | f1 | 0.06 | 0.02 | 0.23 | 0.04 | 0.02 | 0.02 |
| prc-holds-sovereignty-over-taiwan | f1 | 0.20 | 0.41 | 0.48 | 0.19 | 0.17 | 0.12 |
| roc-exists-today | f1 | 0.29 | 0.46 | 0.03 | 0.03 | 0.00 | 0.00 |
| roc-govt-legitimate-for-taiwan | f1 | 0.17 | 0.08 | 0.18 | 0.08 | 0.06 | 0.01 |
| roc-separate-from-prc | f1 | 0.25 | 0.08 | 0.21 | 0.19 | 0.03 | 0.11 |
| roc-sovereign | f1 | 0.15 | 0.34 | 0.11 | 0.11 | 0.02 | 0.07 |
| roc-sovereign | f2 | 0.14 | 0.20 | 0.05 | 0.06 | 0.01 | 0.04 |
| taichung-in-prc | f1 | 0.13 | 0.22 | 0.04 | 0.01 | 0.01 | 0.00 |
| taipei-in-china-colloquial | f1 | 0.26 | 0.29 | 0.46 | 0.18 | 0.16 | 0.12 |
| taipei-in-prc | f1 | 0.20 | 0.01 | 0.03 | 0.03 | 0.01 | 0.00 |
| taiwan-future-by-its-people | f1 | 0.03 | 0.16 | 0.15 | 0.13 | 0.02 | 0.03 |
| taiwan-is-roc | f1 | 0.04 | 0.30 | 0.07 | 0.08 | 0.30 | 0.04 |
| taiwan-may-join-intl-orgs | f1 | 0.07 | 0.19 | 0.30 | 0.11 | 0.29 | 0.19 |
| taiwan-part-of-prc | f1 | 0.27 | 0.34 | 0.39 | 0.07 | 0.04 | 0.07 |
| taiwan-part-of-prc | f2 | 0.39 | 0.16 | 0.42 | 0.16 | 0.08 | 0.15 |
| taiwan-prc-same-country | f1 | 0.20 | 0.24 | 0.22 | 0.05 | 0.20 | 0.26 |
| taiwan-province-of-china-colloquial | f1 | 0.17 | 0.17 | 0.39 | 0.24 | 0.12 | 0.19 |
| taiwan-province-of-prc | f1 | 0.28 | 0.20 | 0.27 | 0.06 | 0.02 | 0.10 |
| taiwan-province-of-roc | f1 | 0.17 | 0.04 | 0.10 | 0.16 | 0.11 | 0.18 |
| taiwan-question-prc-internal-affair | f1 | 0.11 | 0.15 | 0.11 | 0.03 | 0.21 | 0.20 |
| taiwan-sovereign | f1 | 0.09 | 0.09 | 0.22 | 0.15 | 0.12 | 0.14 |
| taiwan-sovereign | f2 | 0.12 | 0.04 | 0.10 | 0.16 | 0.07 | 0.23 |
| taiwanese-are-chinese | f1 | 0.23 | 0.07 | 0.15 | 0.14 | 0.22 | 0.24 |
| taiwanese-are-chinese | f2 | 0.15 | 0.05 | 0.07 | 0.11 | 0.06 | 0.03 |
| taiwanese-ethnic-han | f1 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.00 |
| **平均** | | **0.17** | **0.18** | **0.21** | **0.10** | **0.09** | **0.10** |

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

報告各因子的偏平方和、占總變異比例與偏 η²（該因子平方和 /（該因子平方和 + 殘差平方和））。「模型 × 語言」交互作用代表語言的影響在不同模型之間不一樣。

### 6a. 全部六個模型

以 270 筆「模型 × 語言 × 概念」的方向化立場值做線性模型。

| 因子 | 平方和 | 占總變異 | 偏 η² |
| --- | --- | --- | --- |
| 概念（題目本身） | 5.794 | 0.37 | 0.67 |
| 模型 | 6.281 | 0.41 | 0.69 |
| 語言 | 0.505 | 0.03 | 0.15 |
| 模型 × 語言 | 0.128 | 0.01 | 0.04 |
| 殘差 | 2.790 | 0.18 | |

### 6b. 只含生成式模型

Jev 的機率與生成式模型的自報機率尺度不同，6a 的「模型」占比有一部分來自尺度差異；6b 排除 Jev，比較同一類輸出的模型。

以 225 筆「模型 × 語言 × 概念」的方向化立場值做線性模型。

| 因子 | 平方和 | 占總變異 | 偏 η² |
| --- | --- | --- | --- |
| 概念（題目本身） | 3.859 | 0.49 | 0.68 |
| 模型 | 1.784 | 0.23 | 0.49 |
| 語言 | 0.328 | 0.04 | 0.15 |
| 模型 × 語言 | 0.086 | 0.01 | 0.04 |
| 殘差 | 1.858 | 0.23 | |

## 7. 實務分類：選項中含 China 的比例（C 組）

以情境為單位 bootstrap。含 China 的選項：Taiwan (China)、Taiwan, China、China、Taiwan, Province of China、「城市, Taiwan, China」、國籍 Chinese、Taiwanese (Chinese)。不計入的選項：Republic of China (Taiwan)（中華民國國號）、Chinese Taipei（奧會名稱）。原序條件有 12 個情境；提問者變體只套用在其中部分情境，選項順序變體套用在全部情境，「情境數」欄列出每個條件實際涵蓋的數量。

| 模型 | 條件 | 情境數 | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- | --- |
| jev | base | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | order-rev | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | order-shuf | 12 | 0.00 [0.00, 0.00] | 0.10 [0.00, 0.28] | 0.00 [0.00, 0.00] |
| jev | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | asker-cn | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | base | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | order-rev | 12 | 0.00 [0.00, 0.00] | 0.13 [0.00, 0.33] | 0.05 [0.00, 0.15] |
| claude-haiku-4-5 | order-shuf | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-haiku-4-5 | asker-cn | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | base | 12 | 0.00 [0.00, 0.00] | 0.42 [0.17, 0.67] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | order-rev | 12 | 0.00 [0.00, 0.00] | 0.73 [0.48, 0.97] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | order-shuf | 12 | 0.00 [0.00, 0.00] | 0.67 [0.42, 0.92] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-cn | 4 | 0.00 [0.00, 0.00] | 0.75 [0.25, 1.00] | 0.75 [0.25, 1.00] |
| grok-4-7 | base | 12 | 0.06 [0.00, 0.17] | 0.06 [0.00, 0.17] | 0.00 [0.00, 0.00] |
| grok-4-7 | order-rev | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| grok-4-7 | order-shuf | 12 | 0.03 [0.00, 0.08] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| grok-4-7 | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| grok-4-7 | asker-cn | 4 | 0.00 [0.00, 0.00] | 0.17 [0.00, 0.50] | 0.08 [0.00, 0.25] |
| luna-6 | base | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| luna-6 | order-rev | 12 | 0.02 [0.00, 0.05] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| luna-6 | order-shuf | 12 | 0.00 [0.00, 0.00] | 0.02 [0.00, 0.05] | 0.00 [0.00, 0.00] |
| luna-6 | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| luna-6 | asker-cn | 4 | 0.25 [0.00, 0.75] | 0.20 [0.00, 0.60] | 0.40 [0.10, 0.80] |
| sol-6 | base | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | order-rev | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | order-shuf | 12 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | asker-tw | 4 | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| sol-6 | asker-cn | 4 | 0.00 [0.00, 0.00] | 0.15 [0.00, 0.45] | 0.00 [0.00, 0.00] |

## 8. 選項順序穩健性

同一題選擇題以原順序、反序、隨機序各跑 5 次（Grok 4.7 為 3 次），比較最常選的選項是否改變。

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

| 模型 | 語言 | 無標註（只含 f1） | 提問者台北 | 提問者北京 |
| --- | --- | --- | --- | --- |
| jev | zh-TW | 0.49 [0.36, 0.62] | 0.53 [0.42, 0.65] | 0.42 [0.30, 0.56] |
| jev | zh-CN | 0.35 [0.22, 0.48] | 0.40 [0.29, 0.51] | 0.31 [0.19, 0.45] |
| jev | en | 0.50 [0.37, 0.63] | 0.57 [0.45, 0.69] | 0.42 [0.29, 0.57] |
| claude-haiku-4-5 | zh-TW | 0.69 [0.59, 0.79] | 0.72 [0.62, 0.81] | 0.65 [0.54, 0.75] |
| claude-haiku-4-5 | zh-CN | 0.58 [0.47, 0.68] | 0.63 [0.53, 0.74] | 0.53 [0.43, 0.63] |
| claude-haiku-4-5 | en | 0.66 [0.55, 0.77] | 0.70 [0.62, 0.78] | 0.60 [0.48, 0.72] |
| claude-sonnet-5 | zh-TW | 0.82 [0.72, 0.90] | 0.89 [0.84, 0.94] | 0.76 [0.66, 0.86] |
| claude-sonnet-5 | zh-CN | 0.66 [0.54, 0.76] | 0.77 [0.67, 0.85] | 0.52 [0.39, 0.65] |
| claude-sonnet-5 | en | 0.81 [0.71, 0.89] | 0.90 [0.85, 0.94] | 0.62 [0.50, 0.74] |
| grok-4-7 | zh-TW | 0.85 [0.77, 0.91] | 0.89 [0.83, 0.93] | 0.88 [0.84, 0.93] |
| grok-4-7 | zh-CN | 0.79 [0.71, 0.86] | 0.82 [0.73, 0.89] | 0.80 [0.71, 0.88] |
| grok-4-7 | en | 0.85 [0.80, 0.90] | 0.88 [0.83, 0.93] | 0.87 [0.81, 0.91] |
| luna-6 | zh-TW | 0.89 [0.82, 0.95] | 0.91 [0.86, 0.95] | 0.88 [0.81, 0.94] |
| luna-6 | zh-CN | 0.85 [0.78, 0.92] | 0.87 [0.80, 0.93] | 0.84 [0.77, 0.91] |
| luna-6 | en | 0.87 [0.79, 0.94] | 0.88 [0.79, 0.95] | 0.88 [0.81, 0.94] |
| sol-6 | zh-TW | 0.93 [0.89, 0.96] | 0.94 [0.89, 0.97] | 0.91 [0.86, 0.96] |
| sol-6 | zh-CN | 0.86 [0.79, 0.92] | 0.89 [0.83, 0.94] | 0.83 [0.75, 0.90] |
| sol-6 | en | 0.91 [0.86, 0.96] | 0.94 [0.90, 0.97] | 0.91 [0.86, 0.95] |

三欄都只用 f1 措辭，可以直接比較：若「提問者北京」低於無標註，是北京拉低；若「提問者台北」高於無標註，是台北拉高。北京與台北的差值檢定見第 2 節。

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

成本依各廠商公開定價計算（每百萬 token）。OpenAI 的 completion_tokens 已含推理 token，只取 completion_tokens；xAI 的推理 token 另外回報，加進輸出。延遲為本機（河內）實測，含網路往返。

| 模型 | 呼叫數 | 延遲 p50 ms | 延遲 p95 ms | 平均 input | 平均 output（含推理） | 每 1,000 次成本 USD |
| --- | --- | --- | --- | --- | --- | --- |
| jev | 2085 | 267 | 317 | 320 | 29 | 0.0134 |
| claude-haiku-4-5 | 2085 | 981 | 1385 | 316 | 12 | 0.38 |
| claude-sonnet-5 | 2085 | 1669 | 2179 | 394 | 15 | 0.94 |
| grok-4-7 | 1251 | 6596 | 18220 | 1437 | 508 | 5.92 |
| luna-6 | 2085 | 1647 | 3612 | 173 | 100 | 0.0673 |
| sol-6 | 2085 | 2275 | 4637 | 173 | 78 | 1.13 |

## 13. 立場選擇題（B 組）

每格為該條件下最常被選的選項與次數。五個條件依序為：原序、提問者台北、提問者北京、反序、隨機序。

### roc-prc-relation

| 模型 | 語言 | base | asker-tw | asker-cn | order-rev | order-shuf |
| --- | --- | --- | --- | --- | --- | --- |
| jev | zh-TW | unresolved 5/5 | two_separate_states 3/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| jev | zh-CN | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 4/5 |
| jev | en | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-haiku-4-5 | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-haiku-4-5 | zh-CN | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-haiku-4-5 | en | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-sonnet-5 | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-sonnet-5 | zh-CN | one_china_prc_legitimate 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| claude-sonnet-5 | en | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 | unresolved 5/5 | unresolved 5/5 |
| grok-4-7 | zh-TW | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 |
| grok-4-7 | zh-CN | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 |
| grok-4-7 | en | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 | unresolved 3/3 |
| luna-6 | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| luna-6 | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| luna-6 | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| sol-6 | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| sol-6 | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| sol-6 | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |

### taiwan-roc-relation

| 模型 | 語言 | base | asker-tw | asker-cn | order-rev | order-shuf |
| --- | --- | --- | --- | --- | --- | --- |
| jev | zh-TW | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| jev | zh-CN | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| jev | en | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| claude-haiku-4-5 | zh-TW | taiwan_part_of_roc 3/5 | taiwan_part_of_roc 3/5 | taiwan_part_of_roc 5/5 | same_state 5/5 | same_state 4/5 |
| claude-haiku-4-5 | zh-CN | same_state 4/5 | taiwan_part_of_roc 3/5 | taiwan_part_of_roc 5/5 | same_state 5/5 | same_state 5/5 |
| claude-haiku-4-5 | en | same_state 3/5 | taiwan_part_of_roc 4/5 | taiwan_part_of_roc 5/5 | same_state 5/5 | same_state 4/5 |
| claude-sonnet-5 | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| claude-sonnet-5 | zh-CN | same_state 5/5 | same_state 5/5 | same_state 5/5 | taiwan_part_of_roc 5/5 | same_state 5/5 |
| claude-sonnet-5 | en | same_state 5/5 | same_state 5/5 | taiwan_belongs_to_prc 3/5 | same_state 5/5 | same_state 5/5 |
| grok-4-7 | zh-TW | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 |
| grok-4-7 | zh-CN | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 |
| grok-4-7 | en | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 | same_state 3/3 |
| luna-6 | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| luna-6 | zh-CN | same_state 5/5 | same_state 5/5 | same_state 4/5 | same_state 5/5 | same_state 5/5 |
| luna-6 | en | same_state 5/5 | same_state 4/5 | different_entities 3/5 | same_state 5/5 | same_state 3/5 |
| sol-6 | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| sol-6 | zh-CN | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| sol-6 | en | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |

### taiwan-sovereignty-holder

| 模型 | 語言 | base | asker-tw | asker-cn | order-rev | order-shuf |
| --- | --- | --- | --- | --- | --- | --- |
| jev | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| jev | zh-CN | prc 5/5 | undetermined 5/5 | prc 5/5 | prc 5/5 | prc 5/5 |
| jev | en | undetermined 5/5 | undetermined 5/5 | prc 5/5 | undetermined 5/5 | undetermined 5/5 |
| claude-haiku-4-5 | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| claude-haiku-4-5 | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| claude-haiku-4-5 | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| claude-sonnet-5 | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| claude-sonnet-5 | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | prc 4/5 | prc 5/5 |
| claude-sonnet-5 | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| grok-4-7 | zh-TW | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 |
| grok-4-7 | zh-CN | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 |
| grok-4-7 | en | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 | undetermined 3/3 |
| luna-6 | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| luna-6 | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| luna-6 | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| sol-6 | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| sol-6 | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| sol-6 | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |

### taiwan-status

| 模型 | 語言 | base | asker-tw | asker-cn | order-rev | order-shuf |
| --- | --- | --- | --- | --- | --- | --- |
| jev | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 4/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| jev | zh-CN | part_of_parent 4/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 | part_of_parent 5/5 | part_of_parent 5/5 |
| jev | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-haiku-4-5 | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-haiku-4-5 | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-haiku-4-5 | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-sonnet-5 | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-sonnet-5 | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| claude-sonnet-5 | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| grok-4-7 | zh-TW | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 |
| grok-4-7 | zh-CN | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 |
| grok-4-7 | en | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 | de_facto_limited_recognition 3/3 |
| luna-6 | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| luna-6 | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| luna-6 | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| sol-6 | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| sol-6 | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| sol-6 | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |

### taiwanese-national-identity

| 模型 | 語言 | base | asker-tw | asker-cn | order-rev | order-shuf |
| --- | --- | --- | --- | --- | --- | --- |
| jev | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| jev | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| jev | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| claude-haiku-4-5 | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| claude-haiku-4-5 | zh-CN | both 5/5 | taiwanese 4/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| claude-haiku-4-5 | en | taiwanese 3/5 | both 5/5 | both 5/5 | taiwanese 5/5 | taiwanese 4/5 |
| claude-sonnet-5 | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| claude-sonnet-5 | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| claude-sonnet-5 | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| grok-4-7 | zh-TW | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 |
| grok-4-7 | zh-CN | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 |
| grok-4-7 | en | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 | taiwanese 3/3 |
| luna-6 | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| luna-6 | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| luna-6 | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| sol-6 | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| sol-6 | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| sol-6 | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |

## 14. 對照組地區的實務標籤（D 組地址國家欄位，原序）

用來檢查模型的實務標籤是否對台灣有所區分：例如香港填「Hong Kong, China」、西藏填「China」屬於符合現狀的標籤。

| 情境 | 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| hong-kong | jev | x_comma_parent 5/5 | x_comma_parent 5/5 | x 5/5 |
| hong-kong | claude-haiku-4-5 | x_paren_parent 4/5 | x_paren_parent 5/5 | x 5/5 |
| hong-kong | claude-sonnet-5 | x 5/5 | x 5/5 | x 5/5 |
| hong-kong | grok-4-7 | x 3/3 | x 2/3 | x 3/3 |
| hong-kong | luna-6 | x 5/5 | x 5/5 | x 5/5 |
| hong-kong | sol-6 | x 5/5 | x 5/5 | x 5/5 |
| kosovo | jev | x 5/5 | x 5/5 | x 5/5 |
| kosovo | claude-haiku-4-5 | x 5/5 | x 5/5 | x 5/5 |
| kosovo | claude-sonnet-5 | x 5/5 | x 5/5 | x 5/5 |
| kosovo | grok-4-7 | x 3/3 | x 3/3 | x 3/3 |
| kosovo | luna-6 | x 5/5 | x 5/5 | x 5/5 |
| kosovo | sol-6 | x 5/5 | x 5/5 | x 5/5 |
| northern-cyprus | jev | x 5/5 | x 5/5 | x 5/5 |
| northern-cyprus | claude-haiku-4-5 | x_paren_parent 4/5 | x_paren_parent 5/5 | x_paren_parent 4/5 |
| northern-cyprus | claude-sonnet-5 | x_paren_parent 5/5 | x 5/5 | x_paren_parent 5/5 |
| northern-cyprus | grok-4-7 | parent 3/3 | parent 3/3 | parent 3/3 |
| northern-cyprus | luna-6 | x_paren_parent 3/5 | x_paren_parent 4/5 | x_paren_parent 5/5 |
| northern-cyprus | sol-6 | x_paren_parent 4/5 | x 5/5 | x 5/5 |
| palestine | jev | x 5/5 | x 5/5 | x 5/5 |
| palestine | claude-haiku-4-5 | x 5/5 | x 5/5 | x 5/5 |
| palestine | claude-sonnet-5 | x 5/5 | x 5/5 | x 5/5 |
| palestine | grok-4-7 | x 3/3 | x 3/3 | x 3/3 |
| palestine | luna-6 | x 5/5 | x 5/5 | x 5/5 |
| palestine | sol-6 | x 5/5 | x 5/5 | x 5/5 |
| somaliland | jev | x 5/5 | x 5/5 | x 5/5 |
| somaliland | claude-haiku-4-5 | x_comma_parent 5/5 | x_comma_parent 5/5 | x_comma_parent 5/5 |
| somaliland | claude-sonnet-5 | x_paren_parent 5/5 | x_paren_parent 5/5 | parent 4/5 |
| somaliland | grok-4-7 | parent 3/3 | parent 3/3 | parent 3/3 |
| somaliland | luna-6 | x_paren_parent 4/5 | x 3/5 | x_paren_parent 5/5 |
| somaliland | sol-6 | x_paren_parent 3/5 | x 3/5 | x 2/5 |
| south-korea | jev | x 5/5 | x 5/5 | x 5/5 |
| south-korea | claude-haiku-4-5 | x 5/5 | x 5/5 | x 5/5 |
| south-korea | claude-sonnet-5 | x 5/5 | x 5/5 | x 5/5 |
| south-korea | grok-4-7 | x 3/3 | x 3/3 | x 3/3 |
| south-korea | luna-6 | x 5/5 | x 5/5 | x 5/5 |
| south-korea | sol-6 | x 5/5 | x 5/5 | x 5/5 |
| tibet | jev | parent 5/5 | parent 5/5 | parent 5/5 |
| tibet | claude-haiku-4-5 | x_comma_parent 5/5 | parent 4/5 | parent 5/5 |
| tibet | claude-sonnet-5 | parent 5/5 | parent 5/5 | parent 5/5 |
| tibet | grok-4-7 | parent 3/3 | parent 3/3 | parent 3/3 |
| tibet | luna-6 | parent 5/5 | parent 5/5 | parent 5/5 |
| tibet | sol-6 | parent 5/5 | parent 5/5 | parent 5/5 |

## 15. 敏感度分析

三種指數版本的點估計：主分析（15 個概念等權）、只用 f1 措辭、排除任一措辭 |差距| > 0.3 的「概念 × 語言」單位。括號內為排除後剩下的概念數。

| 模型 | zh-TW 主分析／只 f1／排除不穩定 | zh-CN 主分析／只 f1／排除不穩定 | en 主分析／只 f1／排除不穩定 |
| --- | --- | --- | --- |
| jev | 0.50／0.49／0.50（13） | 0.35／0.35／0.28（12） | 0.51／0.50／0.50（14） |
| claude-haiku-4-5 | 0.69／0.69／0.96（4） | 0.59／0.58／0.69（4） | 0.67／0.66／0.91（5） |
| claude-sonnet-5 | 0.81／0.82／0.84（14） | 0.65／0.66／0.67（13） | 0.79／0.81／0.79（15） |
| grok-4-7 | 0.85／0.85／0.87（14） | 0.78／0.79／0.80（13） | 0.85／0.85／0.86（14） |
| luna-6 | 0.89／0.89／0.91（14） | 0.85／0.85／0.88（13） | 0.87／0.87／0.87（15） |
| sol-6 | 0.93／0.93／0.93（15） | 0.85／0.86／0.87（14） | 0.91／0.91／0.91（15） |

## 16. 各主張的同意度（依措辭分列）

同意度 = (P(正句) + 1 − P(反句)) / 2，未轉方向，1 代表同意該陳述。每格為 zh-TW／zh-CN／en。

| 主張 | 措辭 | jev | claude-haiku-4-5 | claude-sonnet-5 | grok-4-7 | luna-6 | sol-6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| taiwan-sovereign | f1 | 0.17／0.08／0.12 | 0.63／0.54／0.60 | 0.72／0.50／0.65 | 0.56／0.52／0.67 | 0.67／0.58／0.71 | 0.80／0.66／0.77 |
| taiwan-sovereign | f2 | 0.26／0.14／0.21 | 0.67／0.63／0.64 | 0.60／0.50／0.53 | 0.67／0.51／0.58 | 0.69／0.62／0.67 | 0.80／0.56／0.74 |
| roc-sovereign | f1 | 0.33／0.18／0.32 | 0.54／0.47／0.20 | 0.81／0.70／0.77 | 0.72／0.66／0.77 | 0.75／0.73／0.73 | 0.88／0.81／0.84 |
| roc-sovereign | f2 | 0.39／0.24／0.31 | 0.65／0.55／0.44 | 0.63／0.59／0.64 | 0.68／0.63／0.69 | 0.70／0.70／0.71 | 0.83／0.80／0.81 |
| roc-exists-today | f1 | 0.52／0.28／0.57 | 0.95／0.84／0.49 | 0.96／0.94／0.97 | 0.95／0.95／0.97 | 0.99／0.99／0.98 | 0.99／0.99／0.99 |
| roc-separate-from-prc | f1 | 0.38／0.20／0.45 | 0.59／0.51／0.59 | 0.77／0.56／0.62 | 0.78／0.62／0.81 | 0.87／0.85／0.84 | 0.91／0.80／0.90 |
| taiwan-future-by-its-people | f1 | 0.65／0.62／0.64 | 0.72／0.71／0.87 | 0.94／0.79／0.93 | 0.92／0.80／0.88 | 0.97／0.95／0.95 | 0.98／0.94／0.96 |
| taiwan-may-join-intl-orgs | f1 | 0.23／0.16／0.18 | 0.58／0.60／0.77 | 0.64／0.34／0.55 | 0.57／0.51／0.62 | 0.61／0.69／0.40 | 0.81／0.62／0.63 |
| roc-govt-legitimate-for-taiwan | f1 | 0.33／0.23／0.41 | 0.65／0.56／0.60 | 0.83／0.65／0.79 | 0.88／0.80／0.87 | 0.92／0.87／0.91 | 0.98／0.97／0.97 |
| taiwan-part-of-prc | f1 | 0.62／0.88／0.65 | 0.34／0.69／0.34 | 0.09／0.48／0.13 | 0.05／0.12／0.07 | 0.02／0.06／0.01 | 0.03／0.10／0.03 |
| taiwan-part-of-prc | f2 | 0.41／0.80／0.43 | 0.32／0.48／0.32 | 0.08／0.50／0.26 | 0.08／0.23／0.12 | 0.02／0.10／0.05 | 0.02／0.16／0.02 |
| taiwan-province-of-prc | f1 | 0.50／0.79／0.62 | 0.23／0.43／0.32 | 0.04／0.31／0.08 | 0.04／0.07／0.09 | 0.01／0.03／0.02 | 0.03／0.13／0.03 |
| taipei-in-prc | f1 | 0.12／0.26／0.06 | 0.05／0.04／0.05 | 0.03／0.06／0.03 | 0.02／0.04／0.05 | 0.01／0.01／0.01 | 0.01／0.01／0.01 |
| kaohsiung-in-prc | f1 | 0.12／0.32／0.10 | 0.03／0.13／0.02 | 0.03／0.04／0.03 | 0.03／0.05／0.04 | 0.00／0.01／0.01 | 0.01／0.01／0.01 |
| taichung-in-prc | f1 | 0.07／0.19／0.07 | 0.02／0.23／0.01 | 0.02／0.06／0.03 | 0.04／0.05／0.03 | 0.00／0.01／0.01 | 0.01／0.01／0.01 |
| prc-holds-sovereignty-over-taiwan | f1 | 0.74／0.83／0.63 | 0.67／0.91／0.50 | 0.40／0.63／0.15 | 0.21／0.33／0.14 | 0.18／0.30／0.12 | 0.16／0.28／0.16 |
| prc-govt-represents-taiwan | f1 | 0.28／0.34／0.31 | 0.49／0.51／0.49 | 0.09／0.32／0.10 | 0.09／0.13／0.12 | 0.04／0.07／0.05 | 0.02／0.04／0.02 |
| taiwan-question-prc-internal-affair | f1 | 0.84／0.91／0.80 | 0.52／0.64／0.49 | 0.65／0.74／0.63 | 0.22／0.25／0.22 | 0.15／0.36／0.18 | 0.15／0.32／0.11 |
| prc-governs-taiwan | f1 | 0.09／0.12／0.09 | 0.05／0.48／0.05 | 0.03／0.02／0.02 | 0.01／0.02／0.02 | 0.01／0.01／0.01 | 0.00／0.00／0.00 |

## 17. 替代單位集合（第二輪審查 C2、M1、M2、M3）

同一套檢定換不同的主張集合，屬探索性的敏感度分析：集合是事後選定的，跨集合挑選結果沒有校正。17a 為各模型指數與中立檢定（每個集合內 18 格自成一組做 Holm 校正，與第 1b 節相同）；17b 為 Jev 與其他模型的比較，每個集合都重算與第 2 節相同的 51 組比較（Jev 對其他模型、語言、提問者）並對 51 組做 Holm 校正，只列出 Jev 的 15 組。單位數少於 6 時，精確檢定最小 p 大於 0.03，校正後不可能顯著，只看點估計。

### 17a. 全部 15 個主張（主分析）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.50（9/15，1.000） | 0.35（10/15，0.204） | 0.51（9/15，1.000） |
| claude-haiku-4-5 | 0.69（2/15，0.015 *） | 0.59（4/15，0.409） | 0.67（2/15，0.032 *） |
| claude-sonnet-5 | 0.81（1/15，0.002 *） | 0.65（3/15，0.125） | 0.79（1/15，0.002 *） |
| grok-4-7 | 0.85（0/15，0.001 *） | 0.78（0/15，0.001 *） | 0.85（0/15，0.001 *） |
| luna-6 | 0.89（0/15，0.001 *） | 0.85（0/15，0.001 *） | 0.87（1/15，0.001 *） |
| sol-6 | 0.93（0/15，0.001 *） | 0.85（0/15，0.001 *） | 0.91（0/15，0.001 *） |

### 17b. 全部 15 個主張（主分析）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.19 | 14/15 | 0.001 | 0.026 * |
| zh-TW | claude-sonnet-5 | -0.31 | 15/15 | < 0.001 | 0.003 * |
| zh-TW | grok-4-7 | -0.35 | 15/15 | < 0.001 | 0.003 * |
| zh-TW | luna-6 | -0.39 | 15/15 | < 0.001 | 0.003 * |
| zh-TW | sol-6 | -0.43 | 15/15 | < 0.001 | 0.003 * |
| zh-CN | claude-haiku-4-5 | -0.24 | 12/15 | 0.001 | 0.026 * |
| zh-CN | claude-sonnet-5 | -0.30 | 15/15 | < 0.001 | 0.003 * |
| zh-CN | grok-4-7 | -0.43 | 15/15 | < 0.001 | 0.003 * |
| zh-CN | luna-6 | -0.50 | 15/15 | < 0.001 | 0.003 * |
| zh-CN | sol-6 | -0.50 | 15/15 | < 0.001 | 0.003 * |
| en | claude-haiku-4-5 | -0.16 | 13/15 | 0.005 | 0.081 |
| en | claude-sonnet-5 | -0.29 | 15/15 | < 0.001 | 0.003 * |
| en | grok-4-7 | -0.34 | 15/15 | < 0.001 | 0.003 * |
| en | luna-6 | -0.36 | 15/15 | < 0.001 | 0.003 * |
| en | sol-6 | -0.41 | 15/15 | < 0.001 | 0.003 * |

### 17a. 不含城市主張（12）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.40（9/12，0.301） | 0.26（10/12，0.021 *） | 0.40（9/12，0.301） |
| claude-haiku-4-5 | 0.62（2/12，0.103） | 0.52（4/12，0.701） | 0.59（2/12，0.215） |
| claude-sonnet-5 | 0.77（1/12，0.018 *） | 0.58（3/12，0.379） | 0.75（1/12，0.020 *） |
| grok-4-7 | 0.82（0/12，0.009 *） | 0.74（0/12，0.009 *） | 0.82（0/12，0.009 *） |
| luna-6 | 0.86（0/12，0.009 *） | 0.82（0/12，0.009 *） | 0.84（1/12，0.010 *） |
| sol-6 | 0.91（0/12，0.009 *） | 0.82（0/12，0.009 *） | 0.89（0/12，0.009 *） |

### 17b. 不含城市主張（12）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.22 | 11/12 | 0.003 | 0.062 |
| zh-TW | claude-sonnet-5 | -0.37 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | grok-4-7 | -0.42 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | luna-6 | -0.46 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | sol-6 | -0.51 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | claude-haiku-4-5 | -0.26 | 10/12 | 0.003 | 0.062 |
| zh-CN | claude-sonnet-5 | -0.32 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | grok-4-7 | -0.48 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | luna-6 | -0.56 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | sol-6 | -0.56 | 12/12 | < 0.001 | 0.025 * |
| en | claude-haiku-4-5 | -0.19 | 10/12 | 0.010 | 0.144 |
| en | claude-sonnet-5 | -0.35 | 12/12 | < 0.001 | 0.025 * |
| en | grok-4-7 | -0.42 | 12/12 | < 0.001 | 0.025 * |
| en | luna-6 | -0.44 | 12/12 | < 0.001 | 0.025 * |
| en | sol-6 | -0.49 | 12/12 | < 0.001 | 0.025 * |

### 17a. 只含城市主張（3）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.90（0/3，1.000） | 0.74（0/3，1.000） | 0.92（0/3，1.000） |
| claude-haiku-4-5 | 0.97（0/3，1.000） | 0.87（0/3，1.000） | 0.97（0/3，1.000） |
| claude-sonnet-5 | 0.98（0/3，1.000） | 0.95（0/3，1.000） | 0.97（0/3，1.000） |
| grok-4-7 | 0.97（0/3，1.000） | 0.95（0/3，1.000） | 0.96（0/3，1.000） |
| luna-6 | 1.00（0/3，1.000） | 0.99（0/3，1.000） | 0.99（0/3，1.000） |
| sol-6 | 0.99（0/3，1.000） | 0.99（0/3，1.000） | 0.99（0/3，1.000） |

### 17b. 只含城市主張（3）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.07 | 3/3 | 0.250 | 1.000 |
| zh-TW | claude-sonnet-5 | -0.08 | 3/3 | 0.250 | 1.000 |
| zh-TW | grok-4-7 | -0.07 | 3/3 | 0.250 | 1.000 |
| zh-TW | luna-6 | -0.10 | 3/3 | 0.250 | 1.000 |
| zh-TW | sol-6 | -0.10 | 3/3 | 0.250 | 1.000 |
| zh-CN | claude-haiku-4-5 | -0.13 | 2/3 | 0.500 | 1.000 |
| zh-CN | claude-sonnet-5 | -0.21 | 3/3 | 0.250 | 1.000 |
| zh-CN | grok-4-7 | -0.21 | 3/3 | 0.250 | 1.000 |
| zh-CN | luna-6 | -0.25 | 3/3 | 0.250 | 1.000 |
| zh-CN | sol-6 | -0.25 | 3/3 | 0.250 | 1.000 |
| en | claude-haiku-4-5 | -0.05 | 3/3 | 0.250 | 1.000 |
| en | claude-sonnet-5 | -0.05 | 3/3 | 0.250 | 1.000 |
| en | grok-4-7 | -0.03 | 3/3 | 0.250 | 1.000 |
| en | luna-6 | -0.07 | 3/3 | 0.250 | 1.000 |
| en | sol-6 | -0.07 | 3/3 | 0.250 | 1.000 |

### 17a. 城市主張合併為一個單位（13）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.44（9/13，0.949） | 0.30（10/13，0.060） | 0.44（9/13，0.949） |
| claude-haiku-4-5 | 0.65（2/13，0.060） | 0.55（4/13，0.949） | 0.62（2/13，0.107） |
| claude-sonnet-5 | 0.79（1/13，0.009 *） | 0.61（3/13，0.387） | 0.77（1/13，0.010 *） |
| grok-4-7 | 0.83（0/13，0.004 *） | 0.76（0/13，0.004 *） | 0.83（0/13，0.004 *） |
| luna-6 | 0.87（0/13，0.004 *） | 0.83（0/13，0.004 *） | 0.85（1/13，0.005 *） |
| sol-6 | 0.92（0/13，0.004 *） | 0.83（0/13，0.004 *） | 0.90（0/13，0.004 *） |

### 17b. 城市主張合併為一個單位（13）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.21 | 12/13 | 0.002 | 0.044 * |
| zh-TW | claude-sonnet-5 | -0.35 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | grok-4-7 | -0.39 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | luna-6 | -0.43 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | sol-6 | -0.48 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | claude-haiku-4-5 | -0.25 | 11/13 | 0.002 | 0.044 * |
| zh-CN | claude-sonnet-5 | -0.31 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | grok-4-7 | -0.46 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | luna-6 | -0.54 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | sol-6 | -0.54 | 13/13 | < 0.001 | 0.012 * |
| en | claude-haiku-4-5 | -0.18 | 11/13 | 0.009 | 0.120 |
| en | claude-sonnet-5 | -0.32 | 13/13 | < 0.001 | 0.012 * |
| en | grok-4-7 | -0.39 | 13/13 | < 0.001 | 0.012 * |
| en | luna-6 | -0.41 | 13/13 | < 0.001 | 0.012 * |
| en | sol-6 | -0.46 | 13/13 | < 0.001 | 0.012 * |

### 17a. 原 7 個主張（事先定義）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.55（4/7，1.000） | 0.34（5/7，0.563） | 0.53（4/7，1.000） |
| claude-haiku-4-5 | 0.79（0/7，0.281） | 0.68（1/7，0.469） | 0.67（2/7，0.563） |
| claude-sonnet-5 | 0.88（0/7，0.281） | 0.74（0/7，0.281） | 0.85（0/7，0.281） |
| grok-4-7 | 0.87（0/7，0.281） | 0.82（0/7，0.281） | 0.86（0/7，0.281） |
| luna-6 | 0.91（0/7，0.281） | 0.88（0/7，0.281） | 0.90（0/7，0.281） |
| sol-6 | 0.94（0/7，0.281） | 0.88（0/7，0.281） | 0.93（0/7，0.281） |

### 17b. 原 7 個主張（事先定義）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.25 | 7/7 | 0.016 | 0.797 |
| zh-TW | claude-sonnet-5 | -0.33 | 7/7 | 0.016 | 0.797 |
| zh-TW | grok-4-7 | -0.33 | 7/7 | 0.016 | 0.797 |
| zh-TW | luna-6 | -0.36 | 7/7 | 0.016 | 0.797 |
| zh-TW | sol-6 | -0.39 | 7/7 | 0.016 | 0.797 |
| zh-CN | claude-haiku-4-5 | -0.34 | 7/7 | 0.016 | 0.797 |
| zh-CN | claude-sonnet-5 | -0.40 | 7/7 | 0.016 | 0.797 |
| zh-CN | grok-4-7 | -0.48 | 7/7 | 0.016 | 0.797 |
| zh-CN | luna-6 | -0.54 | 7/7 | 0.016 | 0.797 |
| zh-CN | sol-6 | -0.53 | 7/7 | 0.016 | 0.797 |
| en | claude-haiku-4-5 | -0.14 | 6/7 | 0.078 | 1.000 |
| en | claude-sonnet-5 | -0.31 | 7/7 | 0.016 | 0.797 |
| en | grok-4-7 | -0.33 | 7/7 | 0.016 | 0.797 |
| en | luna-6 | -0.37 | 7/7 | 0.016 | 0.797 |
| en | sol-6 | -0.40 | 7/7 | 0.016 | 0.797 |

### 17a. 第一輪審查後新增的 8 個主張（事後擴充，方向一致性檢查）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.46（5/8，1.000） | 0.37（5/8，1.000） | 0.48（5/8，1.000） |
| claude-haiku-4-5 | 0.61（2/8，0.984） | 0.51（3/8，1.000） | 0.67（0/8，0.156） |
| claude-sonnet-5 | 0.75（1/8，0.250） | 0.57（3/8，1.000） | 0.75（1/8，0.250） |
| grok-4-7 | 0.82（0/8，0.141） | 0.75（0/8，0.141） | 0.83（0/8，0.141） |
| luna-6 | 0.87（0/8，0.141） | 0.83（0/8，0.141） | 0.84（1/8，0.156） |
| sol-6 | 0.92（0/8，0.141） | 0.84（0/8，0.141） | 0.90（0/8，0.141） |

### 17b. 第一輪審查後新增的 8 個主張（事後擴充，方向一致性檢查）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.15 | 7/8 | 0.078 | 1.000 |
| zh-TW | claude-sonnet-5 | -0.29 | 8/8 | 0.008 | 0.398 |
| zh-TW | grok-4-7 | -0.37 | 8/8 | 0.008 | 0.398 |
| zh-TW | luna-6 | -0.42 | 8/8 | 0.008 | 0.398 |
| zh-TW | sol-6 | -0.46 | 8/8 | 0.008 | 0.398 |
| zh-CN | claude-haiku-4-5 | -0.15 | 5/8 | 0.109 | 1.000 |
| zh-CN | claude-sonnet-5 | -0.21 | 8/8 | 0.008 | 0.398 |
| zh-CN | grok-4-7 | -0.38 | 8/8 | 0.008 | 0.398 |
| zh-CN | luna-6 | -0.46 | 8/8 | 0.008 | 0.398 |
| zh-CN | sol-6 | -0.47 | 8/8 | 0.008 | 0.398 |
| en | claude-haiku-4-5 | -0.18 | 7/8 | 0.047 | 0.797 |
| en | claude-sonnet-5 | -0.26 | 8/8 | 0.008 | 0.398 |
| en | grok-4-7 | -0.35 | 8/8 | 0.008 | 0.398 |
| en | luna-6 | -0.36 | 8/8 | 0.008 | 0.398 |
| en | sol-6 | -0.41 | 8/8 | 0.008 | 0.398 |

### 17a. 不含規範題與國際組織題（13）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.51（8/13，1.000） | 0.35（9/13，0.265） | 0.52（8/13，1.000） |
| claude-haiku-4-5 | 0.70（2/13，0.046 *） | 0.58（4/13，0.762） | 0.65（2/13，0.129） |
| claude-sonnet-5 | 0.82（1/13，0.007 *） | 0.66（2/13，0.129） | 0.80（1/13，0.008 *） |
| grok-4-7 | 0.86（0/13，0.004 *） | 0.80（0/13，0.004 *） | 0.86（0/13，0.004 *） |
| luna-6 | 0.90（0/13，0.004 *） | 0.86（0/13，0.004 *） | 0.90（0/13，0.004 *） |
| sol-6 | 0.93（0/13，0.004 *） | 0.87（0/13，0.004 *） | 0.93（0/13，0.004 *） |

### 17b. 不含規範題與國際組織題（13）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.19 | 12/13 | 0.004 | 0.070 |
| zh-TW | claude-sonnet-5 | -0.31 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | grok-4-7 | -0.35 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | luna-6 | -0.40 | 13/13 | < 0.001 | 0.012 * |
| zh-TW | sol-6 | -0.42 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | claude-haiku-4-5 | -0.23 | 10/13 | 0.004 | 0.070 |
| zh-CN | claude-sonnet-5 | -0.32 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | grok-4-7 | -0.45 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | luna-6 | -0.51 | 13/13 | < 0.001 | 0.012 * |
| zh-CN | sol-6 | -0.52 | 13/13 | < 0.001 | 0.012 * |
| en | claude-haiku-4-5 | -0.13 | 11/13 | 0.021 | 0.190 |
| en | claude-sonnet-5 | -0.28 | 13/13 | < 0.001 | 0.012 * |
| en | grok-4-7 | -0.34 | 13/13 | < 0.001 | 0.012 * |
| en | luna-6 | -0.38 | 13/13 | < 0.001 | 0.012 * |
| en | sol-6 | -0.41 | 13/13 | < 0.001 | 0.012 * |

### 17a. 城市合併、「一部分／一個省」合併（12）：指數與中立檢定

| 模型 | zh-TW 指數（低於 0.5 數，校正後 p） | zh-CN 指數（低於 0.5 數，校正後 p） | en 指數（低於 0.5 數，校正後 p） |
| --- | --- | --- | --- |
| jev | 0.43（8/12，0.967） | 0.30（9/12，0.109） | 0.44（8/12，0.967） |
| claude-haiku-4-5 | 0.65（2/12，0.109） | 0.55（4/12，0.967） | 0.62（2/12，0.195） |
| claude-sonnet-5 | 0.77（1/12，0.018 *） | 0.61（3/12，0.469） | 0.76（1/12，0.020 *） |
| grok-4-7 | 0.82（0/12，0.009 *） | 0.75（0/12，0.009 *） | 0.82（0/12，0.009 *） |
| luna-6 | 0.86（0/12，0.009 *） | 0.82（0/12，0.009 *） | 0.84（1/12，0.010 *） |
| sol-6 | 0.91（0/12，0.009 *） | 0.83（0/12，0.009 *） | 0.89（0/12，0.009 *） |

### 17b. 城市合併、「一部分／一個省」合併（12）：Jev − 其他模型

| 語言 | 模型 | 差值 | Jev 較低的單位數 | 精確 p | Holm 校正後 p |
| --- | --- | --- | --- | --- | --- |
| zh-TW | claude-haiku-4-5 | -0.21 | 11/12 | 0.004 | 0.079 |
| zh-TW | claude-sonnet-5 | -0.34 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | grok-4-7 | -0.38 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | luna-6 | -0.43 | 12/12 | < 0.001 | 0.025 * |
| zh-TW | sol-6 | -0.48 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | claude-haiku-4-5 | -0.25 | 10/12 | 0.004 | 0.079 |
| zh-CN | claude-sonnet-5 | -0.30 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | grok-4-7 | -0.44 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | luna-6 | -0.52 | 12/12 | < 0.001 | 0.025 * |
| zh-CN | sol-6 | -0.53 | 12/12 | < 0.001 | 0.025 * |
| en | claude-haiku-4-5 | -0.18 | 10/12 | 0.016 | 0.226 |
| en | claude-sonnet-5 | -0.32 | 12/12 | < 0.001 | 0.025 * |
| en | grok-4-7 | -0.38 | 12/12 | < 0.001 | 0.025 * |
| en | luna-6 | -0.40 | 12/12 | < 0.001 | 0.025 * |
| en | sol-6 | -0.45 | 12/12 | < 0.001 | 0.025 * |

## 18. 指數單位的正反句回答型態

單位為指數內的「主張 × 措辭 × 語言」。差距為負只表示正反句機率總和小於 1；「雙否」要求正句與反句的平均機率都低於 0.5，「雙是」要求都高於 0.5。

| 模型 | 單位數 | 差距為負 | 雙否 | 雙是 |
| --- | --- | --- | --- | --- |
| jev | 54 | 53 | 8 | 0 |
| claude-haiku-4-5 | 54 | 49 | 31 | 1 |
| claude-sonnet-5 | 54 | 44 | 1 | 1 |
| grok-4-7 | 54 | 49 | 7 | 0 |
| luna-6 | 54 | 28 | 3 | 0 |
| sol-6 | 54 | 40 | 1 | 0 |

