# 統計分析

產出時間：2026-09-21T11:05:01.596Z；資料：11025 筆成功呼叫，模型 jev、claude-opus-5、claude-sonnet-5

## 1. 主權傾向指數（95% bootstrap 信賴區間）

每個方向明確的台灣概念先換算成「支持台灣或中華民國主權」的方向（1 為完全支持，0 為完全支持中華人民共和國立場，0.5 中立），再取平均。bootstrap 以概念為單位重抽 10,000 次。
納入概念（研究者編碼，請審閱）：taiwan-sovereign（+）、roc-sovereign（+）、roc-exists-after-1949（+）、taiwan-part-of-prc（−）、roc-prc-one-china（−）、taiwan-province-of-china（−）、taipei-in-china（−）、kaohsiung-in-china（−）。排除 taiwan-is-roc、taiwanese-are-chinese（方向有歧義）。

| 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| jev | 0.39 [0.29, 0.51] | 0.20 [0.12, 0.32] | 0.40 [0.26, 0.58] |
| claude-opus-5 | 0.77 [0.68, 0.85] | 0.47 [0.35, 0.61] | 0.70 [0.57, 0.84] |
| claude-sonnet-5 | 0.86 [0.78, 0.94] | 0.47 [0.32, 0.64] | 0.79 [0.68, 0.89] |

註：Claude 的機率是自報值，與 Jev 的校準機率不同尺度；跨模型只解讀方向與信賴區間是否跨過 0.5，不解讀數值差距大小。

## 2. 成對比較（Holm 校正）

共 24 組比較，差值為主權傾向指數相減，負值代表前者較偏中華人民共和國立場。

| 比較 | 差值 [95% CI] | p | Holm 校正後 p |
| --- | --- | --- | --- |
| zh-TW：jev − claude-opus-5 | -0.38 [-0.44, -0.29] | 0.000 | 0.000 * |
| zh-TW：jev − claude-sonnet-5 | -0.47 [-0.53, -0.39] | 0.000 | 0.000 * |
| zh-CN：jev − claude-opus-5 | -0.27 [-0.36, -0.14] | 0.000 | 0.001 * |
| zh-CN：jev − claude-sonnet-5 | -0.27 [-0.41, -0.08] | 0.009 | 0.026 * |
| en：jev − claude-opus-5 | -0.30 [-0.41, -0.17] | 0.000 | 0.000 * |
| en：jev − claude-sonnet-5 | -0.39 [-0.48, -0.26] | 0.000 | 0.000 * |
| jev：zh-CN − zh-TW | -0.18 [-0.24, -0.14] | 0.000 | 0.000 * |
| jev：zh-CN − en | -0.19 [-0.29, -0.11] | 0.000 | 0.000 * |
| jev：zh-TW − en | -0.01 [-0.11, 0.05] | 0.812 | 0.812 |
| claude-opus-5：zh-CN − zh-TW | -0.30 [-0.39, -0.20] | 0.000 | 0.000 * |
| claude-opus-5：zh-CN − en | -0.23 [-0.36, -0.11] | 0.000 | 0.000 * |
| claude-opus-5：zh-TW − en | 0.06 [-0.01, 0.14] | 0.069 | 0.138 |
| claude-sonnet-5：zh-CN − zh-TW | -0.39 [-0.56, -0.23] | 0.000 | 0.000 * |
| claude-sonnet-5：zh-CN − en | -0.32 [-0.49, -0.16] | 0.000 | 0.000 * |
| claude-sonnet-5：zh-TW − en | 0.07 [0.04, 0.11] | 0.000 | 0.000 * |
| jev zh-TW：提問者北京 − 提問者台北 | -0.08 [-0.12, -0.04] | 0.000 | 0.000 * |
| jev zh-CN：提問者北京 − 提問者台北 | -0.07 [-0.11, -0.03] | 0.000 | 0.000 * |
| jev en：提問者北京 − 提問者台北 | -0.11 [-0.15, -0.08] | 0.000 | 0.000 * |
| claude-opus-5 zh-TW：提問者北京 − 提問者台北 | -0.12 [-0.19, -0.07] | 0.000 | 0.000 * |
| claude-opus-5 zh-CN：提問者北京 − 提問者台北 | -0.23 [-0.31, -0.15] | 0.000 | 0.000 * |
| claude-opus-5 en：提問者北京 − 提問者台北 | -0.14 [-0.20, -0.07] | 0.000 | 0.000 * |
| claude-sonnet-5 zh-TW：提問者北京 − 提問者台北 | -0.10 [-0.17, -0.05] | 0.000 | 0.000 * |
| claude-sonnet-5 zh-CN：提問者北京 − 提問者台北 | -0.27 [-0.35, -0.18] | 0.000 | 0.000 * |
| claude-sonnet-5 en：提問者北京 − 提問者台北 | -0.29 [-0.40, -0.21] | 0.000 | 0.000 * |

* 表示校正後 p < 0.05。概念只有 8 個，信賴區間偏寬，屬保守估計。

## 3. 正反不一致的雜訊門檻與最小可偵測效果

以無爭議題（K 組、南韓）與 A 組事實題的 |正 + 反 − 1| 分布，估計「沒有立場時的正常不一致程度」，取第 95 百分位數作為門檻，取代原本憑經驗訂的 0.3。

| 模型 | 無爭議題數 | 雜訊門檻（P95） | 台灣題超過門檻的比例 | 重複間 SD 中位數 | 單題 MDE（n=5） |
| --- | --- | --- | --- | --- | --- |
| jev | 27 | 0.12 | 0.44 | 0.007 | 0.013 |
| claude-opus-5 | 27 | 0.01 | 0.87 | 0.000 | 0.000 |
| claude-sonnet-5 | 27 | 0.03 | 0.82 | 0.004 | 0.008 |

無爭議題的門檻非常緊（模型對這類題目的正反句幾乎完全互補），台灣題有很高比例超過門檻，代表模型在爭議題上的正反回答本身就比較不自洽（文獻稱為附和偏誤，acquiescence）。立場值取正反句平均可以抵銷一部分，但個別題目的立場值仍要搭配差距一起解讀。

MDE 是單一題目在兩種條件間，以 5 次重複可偵測的最小平均差（α = 0.05，檢定力 80%）。三個模型的重複間變異都很小，因此單題層級的差異幾乎都可偵測；結論的不確定性主要來自「題目抽樣」，這正是第 1、2 節以概念為單位做 bootstrap 的原因。

## 4. 語言一致性：各概念三語立場值的最大差距

數值越大代表同一個概念換語言後立場變化越大。只列台灣概念（含方向歧義的概念）。

| 概念 | 框架 | jev | claude-opus-5 | claude-sonnet-5 |
| --- | --- | --- | --- | --- |
| kaohsiung-in-china | f1 | 0.27 | 0.49 | 0.89 |
| roc-exists-after-1949 | f1 | 0.25 | 0.01 | 0.02 |
| roc-prc-one-china | f1 | 0.14 | 0.36 | 0.32 |
| roc-sovereign | f1 | 0.15 | 0.16 | 0.15 |
| roc-sovereign | f2 | 0.18 | 0.22 | 0.21 |
| taipei-in-china | f1 | 0.49 | 0.35 | 0.54 |
| taiwan-is-roc | f1 | 0.11 | 0.37 | 0.20 |
| taiwan-part-of-prc | f1 | 0.25 | 0.22 | 0.50 |
| taiwan-part-of-prc | f2 | 0.37 | 0.70 | 0.70 |
| taiwan-province-of-china | f1 | 0.18 | 0.33 | 0.35 |
| taiwan-sovereign | f1 | 0.08 | 0.20 | 0.33 |
| taiwan-sovereign | f2 | 0.14 | 0.37 | 0.29 |
| taiwanese-are-chinese | f1 | 0.19 | 0.22 | 0.27 |
| taiwanese-are-chinese | f2 | 0.25 | 0.46 | 0.34 |
| taiwanese-ethnic-han | f1 | 0.02 | 0.01 | 0.01 |
| **平均** | | **0.21** | **0.30** | **0.34** |

## 5. 是非題與選擇題的方向一致性

同一個問題分別用是非題（noul）和選擇題（choice）問，看方向是否一致。格式：是非題回答「是」的程度 / 選擇題最常選的選項，✓ 一致、✗ 不一致。

| 是非題 | 選擇題 | jev zh-TW | jev zh-CN | jev en | claude-opus-5 zh-TW | claude-opus-5 zh-CN | claude-opus-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| taiwan-part-of-prc | taiwan-status | 0.64 / de_facto_limited_recognition ✗ | 0.88 / part_of_parent ✓ | 0.65 / de_facto_limited_recognition ✗ | 0.10 / de_facto_limited_recognition ✓ | 0.30 / de_facto_limited_recognition ✓ | 0.09 / de_facto_limited_recognition ✓ | 0.06 / de_facto_limited_recognition ✓ | 0.55 / de_facto_limited_recognition ✗ | 0.10 / de_facto_limited_recognition ✓ |
| taiwanese-are-chinese | taiwanese-national-identity | 0.63 / taiwanese ✗ | 0.82 / taiwanese ✗ | 0.68 / taiwanese ✗ | 0.40 / taiwanese ✓ | 0.62 / taiwanese ✗ | 0.46 / taiwanese ✓ | 0.38 / taiwanese ✓ | 0.65 / taiwanese ✗ | 0.40 / both ✗ |
| taiwan-is-roc | taiwan-roc-relation | 0.40 / different_entities ✓ | 0.37 / different_entities ✓ | 0.48 / same_state ✗ | 0.73 / same_state ✓ | 0.52 / different_entities ✗ | 0.88 / same_state ✓ | 0.73 / different_entities ✗ | 0.68 / different_entities ✗ | 0.88 / same_state ✓ |
| taipei-in-china | country-field-taipei | 0.54 / x ✗ | 0.70 / x ✗ | 0.20 / x ✓ | 0.33 / x ✓ | 0.57 / x_comma_parent ✓ | 0.23 / x ✓ | 0.09 / x ✓ | 0.63 / x ✗ | 0.11 / x ✓ |
| kaohsiung-in-china | country-field-kaohsiung | 0.42 / x ✓ | 0.57 / x ✗ | 0.30 / x ✓ | 0.24 / x ✓ | 0.71 / x_comma_parent ✓ | 0.22 / x ✓ | 0.06 / x ✓ | 0.95 / x_comma_parent ✓ | 0.08 / x ✓ |

一致率：jev 6/15，claude-opus-5 13/15，claude-sonnet-5 9/15

## 6. 因子分解（主權傾向，基準題）

以 99 筆「模型 × 語言 × 概念框架」的方向化立場值做線性模型，報告各因子的偏 η²（該因子平方和 /（該因子平方和 + 殘差平方和））與占總變異比例。

| 因子 | 平方和 | 占總變異 | 偏 η² |
| --- | --- | --- | --- |
| 概念（題目本身） | 1.889 | 0.24 | 0.57 |
| 模型 | 2.719 | 0.35 | 0.66 |
| 語言 | 1.610 | 0.21 | 0.53 |
| 模型 × 語言 | 0.121 | 0.02 | 0.08 |
| 殘差 | 1.410 | 0.18 | |

「模型 × 語言」交互作用代表「語言的影響在不同模型之間不一樣」。

## 7. 實務分類：選項中含 China 的比例（C 組）

以 12 個實務情境為單位 bootstrap。含 China 的選項：Taiwan (China)、Taiwan, China、China、Taiwan, Province of China、「城市, Taiwan, China」、國籍 Chinese 等。

| 模型 | 條件 | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| jev | base | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| jev | asker-cn | 0.20 [0.00, 0.60] | 0.20 [0.00, 0.60] | 0.25 [0.00, 0.75] |
| claude-opus-5 | base | 0.00 [0.00, 0.00] | 0.50 [0.25, 0.75] | 0.00 [0.00, 0.00] |
| claude-opus-5 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-opus-5 | asker-cn | 0.25 [0.00, 0.75] | 0.75 [0.25, 1.00] | 0.75 [0.25, 1.00] |
| claude-sonnet-5 | base | 0.00 [0.00, 0.00] | 0.43 [0.18, 0.70] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-tw | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] | 0.00 [0.00, 0.00] |
| claude-sonnet-5 | asker-cn | 0.15 [0.00, 0.45] | 0.75 [0.25, 1.00] | 0.75 [0.25, 1.00] |

## 8. 選項順序穩健性

同一題選擇題以原順序、反序、隨機序各跑 5 次，比較最常選的選項是否改變。

| 模型 | 題數 | 三種順序最常選的選項都相同 | 原序與反序的選擇分布總變異距離（平均） |
| --- | --- | --- | --- |
| jev | 99 | 95/99 | 0.02 |
| claude-opus-5 | 99 | 91/99 | 0.07 |
| claude-sonnet-5 | 99 | 77/99 | 0.18 |

受順序影響的題目：
- jev B-taiwan-roc-relation-en：原序 same_state，反序 different_entities，隨機 different_entities
- jev C-country-field-kinmen-zh-CN：原序 x，反序 x，隨機 x_comma_parent
- jev D-country-field-hong-kong-zh-CN：原序 x_comma_parent，反序 x，隨機 x_comma_parent
- jev C-phone-country-zh-CN：原序 x，反序 x_comma_parent，隨機 x
- claude-opus-5 B-taiwan-sovereignty-holder-zh-CN：原序 undetermined，反序 taiwanese_people，隨機 prc
- claude-opus-5 C-country-field-kinmen-zh-CN：原序 x_comma_parent，反序 parent，隨機 x_comma_parent
- claude-opus-5 D-country-field-hong-kong-zh-CN：原序 x，反序 x_comma_parent，隨機 x
- claude-opus-5 D-country-field-somaliland-zh-CN：原序 x_paren_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-opus-5 D-country-field-somaliland-en：原序 x_paren_parent，反序 parent，隨機 x_paren_parent
- claude-opus-5 D-country-field-northern-cyprus-zh-TW：原序 x，反序 x_comma_parent，隨機 x
- claude-opus-5 D-country-field-northern-cyprus-zh-CN：原序 x_paren_parent，反序 x，隨機 x
- claude-opus-5 D-country-field-northern-cyprus-en：原序 x_comma_parent，反序 x_paren_parent，隨機 x_paren_parent
- claude-sonnet-5 B-roc-prc-relation-zh-TW：原序 unresolved_civil_war，反序 unresolved_civil_war，隨機 two_separate_states
- claude-sonnet-5 B-roc-prc-relation-zh-CN：原序 one_china_prc_legitimate，反序 unresolved_civil_war，隨機 unresolved_civil_war
- claude-sonnet-5 B-taiwan-roc-relation-zh-TW：原序 different_entities，反序 same_state，隨機 same_state
- claude-sonnet-5 B-taiwan-roc-relation-zh-CN：原序 different_entities，反序 same_state，隨機 different_entities
- claude-sonnet-5 B-taiwan-sovereignty-holder-en：原序 roc，反序 taiwanese_people，隨機 roc
- claude-sonnet-5 B-taiwanese-national-identity-en：原序 both，反序 taiwanese，隨機 taiwanese
- claude-sonnet-5 C-country-field-kaohsiung-zh-CN：原序 x_comma_parent，反序 parent，隨機 parent
- claude-sonnet-5 C-country-field-taipei-zh-CN：原序 x，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-taichung-zh-CN：原序 x_comma_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-tainan-zh-CN：原序 x_comma_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-hsinchu-zh-CN：原序 x_comma_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-country-field-kinmen-zh-CN：原序 x_paren_parent，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-somaliland-zh-TW：原序 x_paren_parent，反序 x，隨機 parent
- claude-sonnet-5 D-country-field-somaliland-zh-CN：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-northern-cyprus-en：原序 x_paren_parent，反序 x，隨機 x_paren_parent
- claude-sonnet-5 D-country-field-northern-cyprus-zh-TW：原序 x_paren_parent，反序 x，隨機 x
- claude-sonnet-5 D-country-field-northern-cyprus-zh-CN：原序 x_paren_parent，反序 x，隨機 x
- claude-sonnet-5 C-dropdown-label-zh-CN：原序 taiwan，反序 taiwan_province_of_china，隨機 taiwan
- claude-sonnet-5 C-phone-country-zh-CN：原序 x，反序 x_comma_parent，隨機 x_paren_parent
- claude-sonnet-5 C-city-format-taipei-zh-CN：原序 city_taiwan，反序 city_taiwan_china，隨機 city_taiwan_china
- claude-sonnet-5 C-city-format-kaohsiung-zh-CN：原序 city_taiwan，反序 city_taiwan_china，隨機 city_taiwan
- claude-sonnet-5 C-city-format-taichung-zh-CN：原序 city_taiwan，反序 city_taiwan_china，隨機 city_taiwan

## 9. 提問者身分：語言效應與「推測提問者」效應

同一題加上「提問者住在台北」或「提問者住在北京」，與原題（無標註）比較主權傾向指數。如果簡中的偏移主要來自「模型推測提問者是中國大陸使用者」，那麼明確標註台北提問者應該能拉回簡中的結果。

| 模型 | 語言 | 無標註 | 提問者台北 | 提問者北京 |
| --- | --- | --- | --- | --- |
| jev | zh-TW | 0.39 [0.29, 0.51] | 0.41 [0.31, 0.53] | 0.33 [0.23, 0.45] |
| jev | zh-CN | 0.20 [0.12, 0.32] | 0.26 [0.17, 0.38] | 0.20 [0.11, 0.29] |
| jev | en | 0.40 [0.26, 0.59] | 0.48 [0.32, 0.64] | 0.37 [0.21, 0.54] |
| claude-opus-5 | zh-TW | 0.77 [0.68, 0.85] | 0.84 [0.77, 0.90] | 0.72 [0.64, 0.81] |
| claude-opus-5 | zh-CN | 0.47 [0.35, 0.61] | 0.67 [0.58, 0.77] | 0.44 [0.29, 0.61] |
| claude-opus-5 | en | 0.70 [0.57, 0.84] | 0.79 [0.70, 0.87] | 0.66 [0.53, 0.78] |
| claude-sonnet-5 | zh-TW | 0.86 [0.78, 0.94] | 0.89 [0.80, 0.95] | 0.79 [0.64, 0.89] |
| claude-sonnet-5 | zh-CN | 0.47 [0.32, 0.64] | 0.61 [0.43, 0.77] | 0.34 [0.23, 0.47] |
| claude-sonnet-5 | en | 0.79 [0.67, 0.89] | 0.85 [0.74, 0.93] | 0.55 [0.37, 0.71] |

註：無標註欄位包含兩種措辭框架，身分欄位只有 f1 框架，兩者的比較僅供參考；主要看台北與北京兩欄的差值（第 2 節有校正後的檢定）。

