# 跨模型比較

產出時間：2026-09-25T07:35:29.500Z；runs：20260925-031837-claude-sonnet-5, 20260925-031837-jev, 20260925-031837-luna-6, 20260925-031837-sol-6, 20260925-032128-claude-haiku-4-5, 20260925-071443-grok-4-7

## 呼叫概況

| 模型 | 成功呼叫 | p50 ms | p95 ms | input tokens | output tokens |
| --- | --- | --- | --- | --- | --- |
| jev | 1845 | 267 | 309 | 595315 | 56286 |
| claude-haiku-4-5 | 1845 | 984 | 1371 | 587670 | 22573 |
| claude-sonnet-5 | 1845 | 1669 | 2162 | 733255 | 28578 |
| grok-4-7 | 1107 | 6145 | 17682 | 1593045 | 9616 |
| luna-6 | 1845 | 1567 | 3439 | 323545 | 176086 |
| sol-6 | 1845 | 2116 | 4422 | 323545 | 138100 |

## 能力基準準確率（K 組 + A 組事實題）

| 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| jev | 1.00 | 1.00 | 1.00 |
| claude-haiku-4-5 | 1.00 | 0.94 | 1.00 |
| claude-sonnet-5 | 1.00 | 1.00 | 1.00 |
| grok-4-7 | 1.00 | 1.00 | 1.00 |
| luna-6 | 1.00 | 1.00 | 1.00 |
| sol-6 | 1.00 | 1.00 | 1.00 |

## 陳述判斷立場值（noul）

立場值 = (正句平均 + (1 − 反句平均)) / 2，0.5 為中立；* 表示該模型在此題正反回答自相矛盾（|正 + 反 − 1| > 0.3）。

| 組 | 概念 | 框架 | jev zh-TW | jev zh-CN | jev en | claude-haiku-4-5 zh-TW | claude-haiku-4-5 zh-CN | claude-haiku-4-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en | grok-4-7 zh-TW | grok-4-7 zh-CN | grok-4-7 en | luna-6 zh-TW | luna-6 zh-CN | luna-6 en | sol-6 zh-TW | sol-6 zh-CN | sol-6 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | kaohsiung-in-china-colloquial | f1 | 0.41* | 0.58* | 0.50 | 0.61* | 0.52* | 0.86 | 0.04 | 0.95 | 0.32 | 0.13 | 0.27 | 0.26 | 0.03 | 0.12 | 0.18 | 0.01 | 0.10 | 0.07 |
| A | kaohsiung-in-prc | f1 | 0.12 | 0.32* | 0.10 | 0.03 | 0.13 | 0.02 | 0.03 | 0.04 | 0.03 | 0.03 | 0.05 | 0.04 | 0.00 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| A | prc-governs-taiwan | f1 | 0.09 | 0.12 | 0.09 | 0.05 | 0.48* | 0.05 | 0.03 | 0.02 | 0.02 | 0.01 | 0.02 | 0.02 | 0.01 | 0.01 | 0.01 | 0.00 | 0.00 | 0.00 |
| A | roc-exists-today | f1 | 0.52 | 0.28 | 0.57 | 0.95 | 0.84 | 0.49* | 0.96 | 0.94 | 0.97 | 0.95 | 0.95 | 0.97 | 0.99 | 0.99 | 0.98 | 0.99 | 0.99 | 0.99 |
| A | roc-sovereign | f1 | 0.33 | 0.18 | 0.32 | 0.53* | 0.47* | 0.20 | 0.81 | 0.70 | 0.77 | 0.72 | 0.66 | 0.77 | 0.75 | 0.73 | 0.73 | 0.88 | 0.81 | 0.84 |
| A | roc-sovereign | f2 | 0.39 | 0.24 | 0.31 | 0.65* | 0.55* | 0.44* | 0.63 | 0.59 | 0.64 | 0.68 | 0.63 | 0.69 | 0.70 | 0.70 | 0.71 | 0.83 | 0.80 | 0.81 |
| A | taipei-in-china-colloquial | f1 | 0.55* | 0.69* | 0.43* | 0.51* | 0.52* | 0.80 | 0.09 | 0.55* | 0.24* | 0.18 | 0.21 | 0.36 | 0.09 | 0.19 | 0.26 | 0.05 | 0.12 | 0.17 |
| A | taipei-in-prc | f1 | 0.12 | 0.26 | 0.06 | 0.05 | 0.04 | 0.05 | 0.03 | 0.06 | 0.03 | 0.03 | 0.04 | 0.05 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| A | taiwan-is-roc | f1 | 0.54 | 0.54 | 0.58 | 0.68* | 0.72* | 0.42* | 0.90 | 0.85 | 0.92 | 0.89 | 0.81 | 0.86 | 0.80 | 0.50 | 0.70 | 0.90 | 0.86 | 0.91 |
| A | taiwan-part-of-prc | f1 | 0.62 | 0.88 | 0.65 | 0.34* | 0.69* | 0.35* | 0.09 | 0.48 | 0.13 | 0.05 | 0.12 | 0.07 | 0.02 | 0.06 | 0.01 | 0.03 | 0.10 | 0.03 |
| A | taiwan-part-of-prc | f2 | 0.41 | 0.80 | 0.43 | 0.32* | 0.48 | 0.33* | 0.07 | 0.50 | 0.26 | 0.08 | 0.23 | 0.12 | 0.02 | 0.10 | 0.05 | 0.02 | 0.17 | 0.02 |
| A | taiwan-passport-issuer | f1 | 0.04 | 0.11 | 0.09 | 0.05 | 0.07 | 0.05 | 0.03 | 0.03 | 0.03 | 0.00 | 0.01 | 0.02 | 0.01 | 0.01 | 0.02 | 0.01 | 0.01 | 0.01 |
| A | taiwan-prc-same-country | f1 | 0.62 | 0.75 | 0.81 | 0.36 | 0.59 | 0.60 | 0.34 | 0.56 | 0.47 | 0.29 | 0.34 | 0.31 | 0.23 | 0.44 | 0.25 | 0.25 | 0.51 | 0.27 |
| A | taiwan-province-of-china-colloquial | f1 | 0.69 | 0.87 | 0.72 | 0.38* | 0.55 | 0.38* | 0.08 | 0.47* | 0.14 | 0.09 | 0.34 | 0.17 | 0.06 | 0.19 | 0.16 | 0.05 | 0.24 | 0.14 |
| A | taiwan-province-of-prc | f1 | 0.50 | 0.79 | 0.62 | 0.23* | 0.43* | 0.32* | 0.04 | 0.31 | 0.08 | 0.04 | 0.07 | 0.09 | 0.01 | 0.03 | 0.02 | 0.03 | 0.13 | 0.03 |
| A | taiwan-province-of-roc | f1 | 0.48 | 0.47 | 0.64 | 0.50* | 0.51* | 0.47* | 0.13 | 0.24 | 0.22 | 0.64* | 0.70* | 0.80 | 0.82 | 0.86 | 0.93 | 0.73 | 0.86 | 0.91 |
| A | taiwan-sovereign | f1 | 0.17 | 0.07 | 0.12 | 0.63* | 0.54* | 0.60* | 0.72 | 0.50 | 0.65 | 0.56 | 0.52 | 0.67 | 0.67 | 0.58 | 0.71 | 0.80 | 0.66 | 0.77 |
| A | taiwan-sovereign | f2 | 0.26 | 0.14 | 0.21 | 0.67* | 0.63* | 0.64* | 0.60 | 0.50 | 0.53 | 0.67 | 0.51 | 0.58 | 0.69 | 0.62 | 0.67 | 0.80 | 0.56 | 0.74 |
| A | taiwan-un-member | f1 | 0.04 | 0.03 | 0.03 | 0.03 | 0.03 | 0.03 | 0.02 | 0.01 | 0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| A | taiwanese-are-chinese | f1 | 0.45 | 0.68 | 0.49* | 0.43 | 0.50* | 0.44 | 0.32* | 0.41 | 0.26 | 0.22 | 0.36* | 0.29* | 0.24* | 0.46* | 0.31* | 0.15 | 0.39* | 0.25* |
| A | taiwanese-are-chinese | f2 | 0.42* | 0.56 | 0.48* | 0.44 | 0.49* | 0.50* | 0.34* | 0.40 | 0.33* | 0.23 | 0.32* | 0.21 | 0.25 | 0.29* | 0.23 | 0.20 | 0.22 | 0.19 |
| A | taiwanese-ethnic-han | f1 | 0.94 | 0.94 | 0.94 | 0.89 | 0.90 | 0.90 | 0.96 | 0.97 | 0.97 | 0.98 | 0.97 | 0.97 | 0.98 | 0.99 | 0.99 | 0.99 | 0.99 | 0.99 |
| D | hong-kong-city-in-parent | f1 | 0.37 | 0.37 | 0.61 | 0.96 | 0.97 | 0.93 | 0.79* | 0.72* | 0.92 | 0.95 | 0.93 | 0.93 | 0.25* | 0.06 | 0.98 | 0.98 | 0.98 | 0.99 |
| D | hong-kong-part-of-parent | f1 | 0.96 | 0.96 | 0.96 | 0.97 | 0.99 | 0.97 | 0.98 | 1.00 | 0.99 | 0.99 | 0.99 | 0.98 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| D | hong-kong-sovereign | f1 | 0.03 | 0.02 | 0.02 | 0.05 | 0.04 | 0.08 | 0.02 | 0.02 | 0.02 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.01 | 0.00 | 0.00 | 0.00 |
| D | kosovo-city-in-parent | f1 | 0.16 | 0.19 | 0.08 | 0.05 | 0.04 | 0.02 | 0.04 | 0.03 | 0.02 | 0.18 | 0.21 | 0.12 | 0.05 | 0.04 | 0.25* | 0.06 | 0.07 | 0.06 |
| D | kosovo-part-of-parent | f1 | 0.35 | 0.38 | 0.33 | 0.38* | 0.45* | 0.37* | 0.38 | 0.40 | 0.21 | 0.31 | 0.35 | 0.32 | 0.35 | 0.44 | 0.31 | 0.28 | 0.36 | 0.26 |
| D | kosovo-sovereign | f1 | 0.47 | 0.44 | 0.55 | 0.58* | 0.52* | 0.71 | 0.59 | 0.61 | 0.71 | 0.52 | 0.57 | 0.72 | 0.86 | 0.82 | 0.86 | 0.79 | 0.72 | 0.83 |
| D | northern-cyprus-city-in-parent | f1 | 0.10 | 0.09 | 0.06 | 0.08 | 0.53* | 0.09 | 0.05 | 0.07 | 0.03 | 0.16 | 0.11 | 0.08 | 0.02 | 0.06 | 0.15 | 0.11 | 0.17 | 0.14 |
| D | northern-cyprus-part-of-parent | f1 | 0.43* | 0.56 | 0.60 | 0.09 | 0.09 | 0.73 | 0.94 | 0.84 | 0.95 | 0.93 | 0.94 | 0.92 | 0.98 | 0.98 | 0.98 | 0.99 | 0.99 | 0.99 |
| D | northern-cyprus-sovereign | f1 | 0.22 | 0.19 | 0.14 | 0.05 | 0.05 | 0.05 | 0.12 | 0.14 | 0.10 | 0.05 | 0.05 | 0.07 | 0.01 | 0.01 | 0.02 | 0.03 | 0.02 | 0.03 |
| D | palestine-sovereign | f1 | 0.34 | 0.38 | 0.34 | 0.43* | 0.40* | 0.21 | 0.44 | 0.45 | 0.38 | 0.40 | 0.40 | 0.33 | 0.54 | 0.65 | 0.47 | 0.57 | 0.59 | 0.52 |
| D | somaliland-city-in-parent | f1 | 0.34 | 0.27 | 0.04 | 0.86 | 0.81 | 0.95 | 0.92 | 0.74 | 0.74 | 0.92 | 0.92 | 0.92 | 0.97 | 0.97 | 0.93 | 0.98 | 0.96 | 0.96 |
| D | somaliland-part-of-parent | f1 | 0.58 | 0.58 | 0.59 | 0.51* | 0.73 | 0.49* | 0.69 | 0.70 | 0.54 | 0.92 | 0.91 | 0.91 | 0.95 | 0.96 | 0.96 | 0.97 | 0.97 | 0.97 |
| D | somaliland-sovereign | f1 | 0.17 | 0.17 | 0.22 | 0.08 | 0.06 | 0.09 | 0.11 | 0.12 | 0.11 | 0.06 | 0.05 | 0.15 | 0.07 | 0.05 | 0.07 | 0.11 | 0.10 | 0.12 |
| D | south-korea-city-in-parent | f1 | 0.02 | 0.02 | 0.02 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| D | south-korea-part-of-parent | f1 | 0.10 | 0.04 | 0.01 | 0.02 | 0.02 | 0.00 | 0.03 | 0.03 | 0.02 | 0.02 | 0.03 | 0.01 | 0.00 | 0.01 | 0.00 | 0.00 | 0.01 | 0.01 |
| D | south-korea-sovereign | f1 | 0.94 | 0.96 | 0.97 | 0.97 | 0.97 | 0.98 | 0.97 | 0.98 | 0.98 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| D | tibet-city-in-parent | f1 | 0.89 | 0.88 | 0.97 | 0.97 | 1.00 | 0.98 | 0.96 | 0.98 | 0.98 | 0.98 | 1.00 | 0.99 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| D | tibet-part-of-parent | f1 | 0.96 | 0.97 | 0.95 | 0.99 | 1.00 | 0.95 | 0.97 | 0.99 | 0.98 | 0.96 | 0.99 | 0.97 | 0.99 | 1.00 | 0.99 | 0.99 | 1.00 | 0.99 |
| D | tibet-sovereign | f1 | 0.04 | 0.03 | 0.04 | 0.02 | 0.00 | 0.07 | 0.03 | 0.02 | 0.06 | 0.03 | 0.01 | 0.03 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| K | osaka-in-japan | f1 | 0.97 | 0.97 | 0.99 | 1.00 | 1.00 | 1.00 | 0.99 | 0.99 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| K | paris-capital-germany | f1 | 0.01 | 0.01 | 0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| K | tokyo-capital | f1 | 0.97 | 0.98 | 0.99 | 1.00 | 1.00 | 1.00 | 0.99 | 0.99 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |

## 選擇題最常選的選項（choice）

格式：選項 被選比例

| 組 | 概念 | jev zh-TW | jev zh-CN | jev en | claude-haiku-4-5 zh-TW | claude-haiku-4-5 zh-CN | claude-haiku-4-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en | grok-4-7 zh-TW | grok-4-7 zh-CN | grok-4-7 en | luna-6 zh-TW | luna-6 zh-CN | luna-6 en | sol-6 zh-TW | sol-6 zh-CN | sol-6 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B | roc-prc-relation | unresolved 100% | one_china_prc_legitimate 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | one_china_prc_legitimate 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% | unresolved 100% |
| B | taiwan-roc-relation | taiwan_part_of_roc 100% | taiwan_part_of_roc 100% | taiwan_part_of_roc 100% | taiwan_part_of_roc 60% | same_state 80% | same_state 60% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% | same_state 100% |
| B | taiwan-sovereignty-holder | undetermined 100% | prc 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% | undetermined 100% |
| B | taiwan-status | de_facto_limited_recognition 100% | part_of_parent 80% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| B | taiwanese-national-identity | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | both 100% | taiwanese 60% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% |
| C | city-format-kaohsiung | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | city-format-taichung | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | city-format-taipei | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | country-field-hsinchu | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | country-field-kaohsiung | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | country-field-kinmen | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x_paren_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | country-field-taichung | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | country-field-tainan | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | country-field-taipei | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | dropdown-label | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan_province_of_china 67% | taiwan_province_of_china 67% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% |
| C | phone-country | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | profile-nationality | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | taiwanese 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% | taiwanese 60% | republic_of_china 100% | republic_of_china 100% | republic_of_china 100% |
| D | country-field-hong-kong | x_comma_parent 100% | x_comma_parent 100% | x 100% | x_paren_parent 80% | x_paren_parent 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 67% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-kosovo | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-northern-cyprus | x 100% | x 100% | x 100% | x_paren_parent 80% | x_paren_parent 100% | x_paren_parent 80% | x_paren_parent 100% | x 100% | x_paren_parent 100% | parent 100% | parent 100% | parent 100% | x_paren_parent 60% | x_paren_parent 80% | x_paren_parent 100% | x_paren_parent 80% | x 100% | x 100% |
| D | country-field-palestine | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-somaliland | x 100% | x 100% | x 100% | x_comma_parent 100% | x_comma_parent 100% | x_comma_parent 100% | x_paren_parent 100% | x_paren_parent 100% | parent 80% | parent 100% | parent 100% | parent 100% | x_paren_parent 80% | x 60% | x_paren_parent 100% | x_paren_parent 60% | x 60% | x 40% |
| D | country-field-south-korea | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-tibet | parent 100% | parent 100% | parent 100% | x_comma_parent 100% | parent 80% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% |
| D | hong-kong-status | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% |
| D | kosovo-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | northern-cyprus-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | palestine-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | undetermined 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 80% | de_facto_limited_recognition 80% | de_facto_limited_recognition 100% | sovereign_state 100% |
| D | somaliland-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | south-korea-status | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% |
| D | tibet-status | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% |
| F | identity-distribution | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% |
| F | unification-independence-distribution | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% | status_quo 100% |
| K | country-field-bangkok | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% |
| K | country-field-osaka | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% |
