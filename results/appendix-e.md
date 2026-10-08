# Appendix E: Claude Haiku 5.5

Generated 2026-10-08T07:48:22.550Z from results/runs-appendixe/ (10020 successful calls) and, for the bridge, the Claude Haiku 4.5 records of results/runs/. Definitions, seeds and index code are those of the main analysis.

## Runs

All three targets ran in one batch on 8 October 2026 (UTC) without interruption or failed calls. The medium arm started after the other two finished.

| Target | Model ID | Effort | Calls | Expected | Missing | First call (UTC) | Last call (UTC) | Longest gap between calls (s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | claude-haiku-4-5 | none | 4785 | 4785 | 0 | 2026-10-08T05:36:05.562Z | 2026-10-08T05:48:04.618Z | 1 |
| Claude Haiku 5.5, effort low | claude-haiku-5-5 | low | 4785 | 4785 | 0 | 2026-10-08T05:36:05.729Z | 2026-10-08T05:53:03.451Z | 1 |
| Claude Haiku 5.5, effort medium | claude-haiku-5-5 | medium (API default) | 450 | 450 | 0 | 2026-10-08T05:53:05.588Z | 2026-10-08T05:55:01.441Z | 1 |

Records in results/runs-appendixe/: 10020; failed (ok false) 0; refusals 0; successful calls without a value or choice 0; duplicate item and repetition pairs 0. Expected calls are every item of the target's coverage times 5 repetitions.

## 1. Bridge: Claude Haiku 4.5 rerun (8 October) against the main run (25 September)

The same target and items on two dates. A single bridge shows how much this version moved between the two dates; it cannot estimate the range of day-to-day variation.

| Index | Run | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| status_index | Claude Haiku 4.5 (main runs, 25 September) | 0.62 [0.54, 0.71] | 0.52 [0.42, 0.62] | 0.59 [0.51, 0.67] |
| status_index | Claude Haiku 4.5 (same-day rerun) | 0.62 [0.54, 0.71] | 0.53 [0.45, 0.60] | 0.62 [0.53, 0.69] |
| status_index | Rerun minus main | -0.00 | 0.00 | 0.02 |
| place_index | Claude Haiku 4.5 (main runs, 25 September) | 0.97 [0.95, 0.98] | 0.87 [0.77, 0.96] | 0.97 [0.95, 0.98] |
| place_index | Claude Haiku 4.5 (same-day rerun) | 0.98 [0.96, 0.99] | 0.77 [0.49, 0.95] | 0.98 [0.95, 1.00] |
| place_index | Rerun minus main | 0.01 | -0.10 | 0.00 |
| pooled_index | Claude Haiku 4.5 (main runs, 25 September) | 0.69 [0.60, 0.79] | 0.59 [0.48, 0.70] | 0.67 [0.57, 0.77] |
| pooled_index | Claude Haiku 4.5 (same-day rerun) | 0.69 [0.59, 0.80] | 0.57 [0.48, 0.67] | 0.69 [0.59, 0.79] |
| pooled_index | Rerun minus main | 0.00 | -0.02 | 0.02 |

### Labels listing Taiwan under "China" (group C)

| Run | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (main runs, 25 September) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (main runs, 25 September) | order-rev | 0% (0/60) | 13% (8/60) | 5% (3/60) |
| Claude Haiku 4.5 (same-day rerun) | order-rev | 0% (0/60) | 13% (8/60) | 3% (2/60) |
| Claude Haiku 4.5 (main runs, 25 September) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (same-day rerun) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (main runs, 25 September) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Claude Haiku 4.5 (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Claude Haiku 4.5 (main runs, 25 September) | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Claude Haiku 4.5 (same-day rerun) | asker-cn | 0% (0/20) | 5% (1/20) | 0% (0/20) |

### Forced choice (group B): cells whose most frequent option differs

4 of 75 cells (5 claims x 3 languages x 5 conditions). Ties are shown as "a / b".

| Claim | Language | Condition | Main run | Rerun |
| --- | --- | --- | --- | --- |
| taiwan-roc-relation | zh-CN | asker-tw | taiwan_part_of_roc 3/5 | same_state 3/5 |
| taiwan-roc-relation | en | base | same_state 3/5 | taiwan_part_of_roc 4/5 |
| taiwan-roc-relation | en | order-shuf | same_state 4/5 | taiwan_part_of_roc 4/5 |
| taiwanese-national-identity | en | base | taiwanese 3/5 | both 5/5 |

## 2. Claude Haiku 5.5 (effort low) against the same-day Claude Haiku 4.5

### Status index (12 status claims, main analysis)

95% cluster bootstrap intervals over claims. The effort-medium arm covers the status claims only.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | 0.62 [0.54, 0.71] | 0.53 [0.45, 0.60] | 0.62 [0.53, 0.69] |
| Claude Haiku 5.5, effort low | 0.74 [0.66, 0.81] | 0.66 [0.58, 0.75] | 0.73 [0.64, 0.81] |
| Claude Haiku 5.5, effort medium | 0.73 [0.66, 0.81] | 0.68 [0.60, 0.76] | 0.76 [0.70, 0.83] |
| Claude Haiku 4.5 (main runs, 25 September) | 0.62 [0.54, 0.71] | 0.52 [0.42, 0.62] | 0.59 [0.51, 0.67] |

### Place index (3 city claims)

95% cluster bootstrap intervals over claims. The effort-medium arm covers the status claims only.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | 0.98 [0.96, 0.99] | 0.77 [0.49, 0.95] | 0.98 [0.95, 1.00] |
| Claude Haiku 5.5, effort low | 0.94 [0.93, 0.95] | 0.90 [0.88, 0.92] | 0.75 [0.50, 0.97] |
| Claude Haiku 5.5, effort medium | - | - | - |
| Claude Haiku 4.5 (main runs, 25 September) | 0.97 [0.95, 0.98] | 0.87 [0.77, 0.96] | 0.97 [0.95, 0.98] |

### Pooled index (15 claims)

95% cluster bootstrap intervals over claims. The effort-medium arm covers the status claims only.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | 0.69 [0.59, 0.80] | 0.57 [0.48, 0.67] | 0.69 [0.59, 0.79] |
| Claude Haiku 5.5, effort low | 0.78 [0.70, 0.85] | 0.71 [0.63, 0.79] | 0.73 [0.65, 0.81] |
| Claude Haiku 5.5, effort medium | - | - | - |
| Claude Haiku 4.5 (main runs, 25 September) | 0.69 [0.60, 0.79] | 0.59 [0.48, 0.70] | 0.67 [0.57, 0.77] |

### Claude Haiku 5.5 (low) minus same-day Claude Haiku 4.5, status claims

Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.

| Language | Mean difference | Claims where Haiku 5.5 is higher | Claims where it is lower | Exact p |
| --- | --- | --- | --- | --- |
| zh-TW | 0.12 | 9/12 | 3/12 | 0.011 |
| zh-CN | 0.14 | 10/12 | 2/12 | 0.004 |
| en | 0.11 | 9/12 | 3/12 | 0.057 |

### Labels listing Taiwan under "China" (group C, original option order)

95% scenario bootstrap over the 12 scenarios, as results/summary.json practical_labels.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| Claude Haiku 5.5, effort low | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| Claude Haiku 4.5 (main runs, 25 September) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |

#### All conditions

Order variants cover all twelve scenarios; asker variants cover four.

| Model | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (same-day rerun) | order-rev | 0% (0/60) | 13% (8/60) | 3% (2/60) |
| Claude Haiku 4.5 (same-day rerun) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 4.5 (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Claude Haiku 4.5 (same-day rerun) | asker-cn | 0% (0/20) | 5% (1/20) | 0% (0/20) |
| Claude Haiku 5.5, effort low | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 5.5, effort low | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 5.5, effort low | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Claude Haiku 5.5, effort low | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Claude Haiku 5.5, effort low | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |

### Forced choice (group B), most frequent option

Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing. Ties are shown as "a / b".

#### roc-prc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 |
| Claude Haiku 4.5 (same-day rerun) | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 |
| Claude Haiku 5.5, effort low | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| Claude Haiku 5.5, effort low | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| Claude Haiku 5.5, effort low | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |

#### taiwan-roc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | taiwan_part_of_roc 4/5 | same_state 4/5 | same_state 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | same_state 4/5 | same_state 5/5 | same_state 5/5 | same_state 3/5 | taiwan_part_of_roc 5/5 |
| Claude Haiku 4.5 (same-day rerun) | en | taiwan_part_of_roc 4/5 | same_state 5/5 | taiwan_part_of_roc 4/5 | taiwan_part_of_roc 3/5 | taiwan_part_of_roc 5/5 |
| Claude Haiku 5.5, effort low | zh-TW | different_entities 5/5 | different_entities 3/5 | different_entities 4/5 | different_entities 5/5 | different_entities 4/5 |
| Claude Haiku 5.5, effort low | zh-CN | different_entities 5/5 | different_entities 3/5 | different_entities 4/5 | different_entities 5/5 | different_entities 5/5 |
| Claude Haiku 5.5, effort low | en | different_entities 5/5 | different_entities 4/5 | different_entities 5/5 | same_state 3/5 | different_entities 4/5 |

#### taiwan-sovereignty-holder

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Claude Haiku 4.5 (same-day rerun) | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Claude Haiku 5.5, effort low | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Claude Haiku 5.5, effort low | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Claude Haiku 5.5, effort low | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |

#### taiwan-status

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Claude Haiku 4.5 (same-day rerun) | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Claude Haiku 5.5, effort low | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Claude Haiku 5.5, effort low | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Claude Haiku 5.5, effort low | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |

#### taiwanese-national-identity

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 3/5 | taiwanese 5/5 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | both 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 4/5 | taiwanese 5/5 |
| Claude Haiku 4.5 (same-day rerun) | en | both 5/5 | taiwanese 5/5 | taiwanese 4/5 | both 5/5 | both 5/5 |
| Claude Haiku 5.5, effort low | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| Claude Haiku 5.5, effort low | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| Claude Haiku 5.5, effort low | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |

#### Options stating the PRC position

Every cell where any repetition chose part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc.

| Model | Claim | Language | Condition | Option | Count |
| --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | roc-prc-relation | zh-CN | asker-cn | one_china_prc_legitimate | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | roc-prc-relation | en | asker-cn | one_china_prc_legitimate | 5/5 |

### Stated asker, status index (f1 framing)

| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |
| --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | zh-TW | 0.66 | 0.58 | -0.08 |
| Claude Haiku 4.5 (same-day rerun) | zh-CN | 0.56 | 0.49 | -0.07 |
| Claude Haiku 4.5 (same-day rerun) | en | 0.65 | 0.49 | -0.16 |
| Claude Haiku 5.5, effort low | zh-TW | 0.78 | 0.67 | -0.11 |
| Claude Haiku 5.5, effort low | zh-CN | 0.71 | 0.60 | -0.12 |
| Claude Haiku 5.5, effort low | en | 0.80 | 0.73 | -0.07 |

### Place claims by city (agreement with the claim as written)

| Model | Claim | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | taipei-in-prc | 0.04 | 0.05 | 0.05 |
| Claude Haiku 4.5 (same-day rerun) | kaohsiung-in-prc | 0.01 | 0.13 | 0.00 |
| Claude Haiku 4.5 (same-day rerun) | taichung-in-prc | 0.01 | 0.52 | 0.02 |
| Claude Haiku 5.5, effort low | taipei-in-prc | 0.07 | 0.08 | 0.50 |
| Claude Haiku 5.5, effort low | kaohsiung-in-prc | 0.05 | 0.11 | 0.03 |
| Claude Haiku 5.5, effort low | taichung-in-prc | 0.06 | 0.12 | 0.24 |
| Claude Haiku 4.5 (main runs, 25 September) | taipei-in-prc | 0.05 | 0.04 | 0.05 |
| Claude Haiku 4.5 (main runs, 25 September) | kaohsiung-in-prc | 0.03 | 0.13 | 0.02 |
| Claude Haiku 4.5 (main runs, 25 September) | taichung-in-prc | 0.02 | 0.23 | 0.01 |

### Place claims by city: positive and negative statements apart

Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.

| Model | Claim | Language | Mean P(yes), positive | Mean P(yes), negative | Agreement (P_pos + 1 - P_neg) / 2 | Gap g = P_pos + P_neg - 1 | Negative calls with P >= 0.5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | taipei-in-prc | zh-TW | 0.044 | 0.960 | 0.042 | 0.004 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | kaohsiung-in-prc | zh-TW | 0.020 | 1.000 | 0.010 | 0.020 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | taichung-in-prc | zh-TW | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | taipei-in-prc | zh-CN | 0.050 | 0.960 | 0.045 | 0.010 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | kaohsiung-in-prc | zh-CN | 0.020 | 0.766 | 0.127 | -0.214 | 4/5 |
| Claude Haiku 4.5 (same-day rerun) | taichung-in-prc | zh-CN | 0.040 | 0.010 | 0.515 | -0.950 | 0/5 |
| Claude Haiku 4.5 (same-day rerun) | taipei-in-prc | en | 0.050 | 0.950 | 0.050 | 0.000 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | kaohsiung-in-prc | en | 0.004 | 1.000 | 0.002 | 0.004 | 5/5 |
| Claude Haiku 4.5 (same-day rerun) | taichung-in-prc | en | 0.044 | 1.000 | 0.022 | 0.044 | 5/5 |
| Claude Haiku 5.5, effort low | taipei-in-prc | zh-TW | 0.020 | 0.870 | 0.075 | -0.110 | 5/5 |
| Claude Haiku 5.5, effort low | kaohsiung-in-prc | zh-TW | 0.002 | 0.896 | 0.053 | -0.102 | 5/5 |
| Claude Haiku 5.5, effort low | taichung-in-prc | zh-TW | 0.010 | 0.880 | 0.065 | -0.110 | 5/5 |
| Claude Haiku 5.5, effort low | taipei-in-prc | zh-CN | 0.026 | 0.870 | 0.078 | -0.104 | 5/5 |
| Claude Haiku 5.5, effort low | kaohsiung-in-prc | zh-CN | 0.052 | 0.840 | 0.106 | -0.108 | 5/5 |
| Claude Haiku 5.5, effort low | taichung-in-prc | zh-CN | 0.076 | 0.830 | 0.123 | -0.094 | 5/5 |
| Claude Haiku 5.5, effort low | taipei-in-prc | en | 0.020 | 0.028 | 0.496 | -0.952 | 0/5 |
| Claude Haiku 5.5, effort low | kaohsiung-in-prc | en | 0.020 | 0.970 | 0.025 | -0.010 | 5/5 |
| Claude Haiku 5.5, effort low | taichung-in-prc | en | 0.026 | 0.550 | 0.238 | -0.424 | 3/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taipei-in-prc | zh-TW | 0.050 | 0.950 | 0.050 | 0.000 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | kaohsiung-in-prc | zh-TW | 0.044 | 0.990 | 0.027 | 0.034 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taichung-in-prc | zh-TW | 0.032 | 0.990 | 0.021 | 0.022 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taipei-in-prc | zh-CN | 0.034 | 0.950 | 0.042 | -0.016 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | kaohsiung-in-prc | zh-CN | 0.020 | 0.760 | 0.130 | -0.220 | 4/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taichung-in-prc | zh-CN | 0.040 | 0.580 | 0.230 | -0.380 | 3/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taipei-in-prc | en | 0.050 | 0.960 | 0.045 | 0.010 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | kaohsiung-in-prc | en | 0.004 | 0.960 | 0.022 | -0.036 | 5/5 |
| Claude Haiku 4.5 (main runs, 25 September) | taichung-in-prc | en | 0.010 | 0.980 | 0.015 | -0.010 | 5/5 |

### Latency and cost (base items)

Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs (Claude Haiku 5.5 USD 0.1 and 0.5, Claude Haiku 4.5 USD 1 and 5 per million input and output tokens). Claude Haiku 5.5 uses a new tokenizer that, per Anthropic, yields about 30% more tokens for the same text; on these items its mean input is 1.25 times that of Claude Haiku 4.5 for identical prompts. The Anthropic API counts reasoning (extended thinking) inside the output tokens and reports no separate figure, so the output column includes it.

| Model | Calls | Latency p50 ms | Mean input | Mean output | Of which reasoning | Cost per 1,000 calls (USD) |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 (same-day rerun) | 2085 | 1281 | 316 | 12 | not reported | 0.38 |
| Claude Haiku 5.5, effort low | 2085 | 1575 | 396 | 99 | not reported | 0.09 |
| Claude Haiku 4.5 (main runs, 25 September) | 2085 | 981 | - | - | - | 0.38 |

## 3. Reasoning effort on the same calls (Claude Haiku 5.5, status claims, base items)

Restricted to the 450 item and repetition pairs the effort-medium arm covers (the 90 base items of the twelve status claims, 5 repetitions each).

| Model | Calls | Status index zh-TW | Status index zh-CN | Status index en | Mean input | Mean output tokens | Median output tokens | Latency p50 ms | Cost per 1,000 calls (USD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku 5.5, effort medium | 450 | 0.73 [0.66, 0.81] | 0.68 [0.60, 0.76] | 0.76 [0.70, 0.83] | 366 | 216.7 | 216 | 2068 | 0.14 |
| Claude Haiku 5.5, effort low | 450 | 0.74 [0.66, 0.81] | 0.66 [0.58, 0.75] | 0.73 [0.64, 0.81] | 366 | 142.2 | 166 | 1799 | 0.11 |

### Effort medium minus effort low, status claims

Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.

| Language | Mean difference | Claims where medium is higher | Claims where it is lower | Exact p |
| --- | --- | --- | --- | --- |
| zh-TW | -0.01 | 7/12 | 5/12 | 0.446 |
| zh-CN | 0.02 | 8/12 | 4/12 | 0.322 |
| en | 0.04 | 7/12 | 5/12 | 0.240 |

## 4. Simplified Chinese beside the main analysis

Main-analysis rows come from results/summary.json (25 September); the last three rows from this appendix (8 October). The effort-medium arm has no place claims. The place index has three units, so its interval is descriptive at best.

| Model | Run date | zh-CN status index | zh-CN place index |
| --- | --- | --- | --- |
| Jev | 2026-09-25 | 0.26 [0.17, 0.37] | 0.74 [0.68, 0.81] |
| Claude Haiku 4.5 | 2026-09-25 | 0.52 [0.42, 0.62] | 0.87 [0.77, 0.96] |
| Claude Sonnet 5 | 2026-09-25 | 0.58 [0.47, 0.68] | 0.95 [0.94, 0.96] |
| Grok 4.7 | 2026-09-25 | 0.74 [0.66, 0.82] | 0.95 [0.94, 0.96] |
| GPT-6 Luna | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| GPT-6 Sol | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| Claude Haiku 4.5 (same-day rerun) | 2026-10-08 | 0.53 [0.45, 0.60] | 0.77 [0.49, 0.95] |
| Claude Haiku 5.5, effort low | 2026-10-08 | 0.66 [0.58, 0.75] | 0.90 [0.88, 0.92] |
| Claude Haiku 5.5, effort medium | 2026-10-08 | 0.68 [0.60, 0.76] | - |

