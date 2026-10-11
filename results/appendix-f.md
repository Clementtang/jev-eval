# Appendix F: GPT-6 Luna through the Decisions API

Generated 2026-10-10T12:38:11.206Z from results/runs-appendixf/ (14350 successful calls) and, for the bridges, the GPT-6 Luna and Jev records of results/runs/. Definitions, seeds and index code are those of the main analysis.

## Runs

The three targets ran in one batch on the same day. GPT-6 Luna through the Decisions API receives the state and question as Jev does, with no system prompt; through chat completions it receives the main analysis prompt.

| Target | Model ID | Interface | Calls | Failed | First call (UTC) | Last call (UTC) |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | gpt-6-luna | chat completions, JSON schema, model writes the number | 4785 | 0 | 2026-10-10T12:17:05.242Z | 2026-10-10T12:37:02.831Z |
| GPT-6 Luna, Decisions API | gpt-6-luna | Decisions API, model probabilities | 4780 | 0 | 2026-10-10T12:17:04.689Z | 2026-10-10T12:20:23.326Z |
| Jev (same-day rerun) | jev-1.13.0 | TypeSafe systemone, model probabilities | 4785 | 0 | 2026-10-10T12:17:02.031Z | 2026-10-10T12:19:36.179Z |

Records in results/runs-appendixf/: 14355; failed (ok false) 0; refusals 5; successful calls without a value or choice 0; duplicate item and repetition pairs 0.

Refused items (left out of every table, as in the main analysis):

| Target | Item | Repetitions refused |
| --- | --- | --- |
| GPT-6 Luna, Decisions API | A-taiwan-part-of-prc-zh-CN-pos-f2 | 5/5 |

## 1. Bridges: same-day reruns (10 October) against the main runs (25 September)

The same target and items on two dates. A single bridge shows how much each target moved between the two dates; it cannot estimate the range of day-to-day variation.

### GPT-6 Luna

| Index | Run | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| status_index | GPT-6 Luna, chat completions (main runs, 25 September) | 0.86 [0.79, 0.93] | 0.82 [0.74, 0.89] | 0.84 [0.74, 0.92] |
| status_index | GPT-6 Luna, chat completions (same-day rerun) | 0.88 [0.82, 0.93] | 0.83 [0.75, 0.90] | 0.84 [0.72, 0.93] |
| status_index | Rerun minus main | 0.01 | 0.01 | -0.00 |
| place_index | GPT-6 Luna, chat completions (main runs, 25 September) | 1.00 [0.99, 1.00] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| place_index | GPT-6 Luna, chat completions (same-day rerun) | 0.99 [0.99, 1.00] | 0.99 [0.99, 0.99] | 0.96 [0.89, 0.99] |
| place_index | Rerun minus main | -0.00 | 0.00 | -0.04 |
| pooled_index | GPT-6 Luna, chat completions (main runs, 25 September) | 0.89 [0.82, 0.95] | 0.85 [0.78, 0.92] | 0.87 [0.78, 0.94] |
| pooled_index | GPT-6 Luna, chat completions (same-day rerun) | 0.90 [0.84, 0.95] | 0.86 [0.79, 0.92] | 0.86 [0.76, 0.94] |
| pooled_index | Rerun minus main | 0.01 | 0.01 | -0.01 |

Labels listing Taiwan under "China" (group C):

| Run | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (main runs, 25 September) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (main runs, 25 September) | order-rev | 2% (1/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (main runs, 25 September) | order-shuf | 0% (0/60) | 2% (1/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | order-shuf | 0% (0/60) | 2% (1/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (main runs, 25 September) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Luna, chat completions (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Luna, chat completions (main runs, 25 September) | asker-cn | 25% (5/20) | 20% (4/20) | 40% (8/20) |
| GPT-6 Luna, chat completions (same-day rerun) | asker-cn | 25% (5/20) | 20% (4/20) | 35% (7/20) |

Forced choice (group B): 1 of 75 cells (5 claims x 3 languages x 5 conditions) have a different most frequent option. Ties are shown as "a / b".

| Claim | Language | Condition | Main run | Rerun |
| --- | --- | --- | --- | --- |
| taiwan-roc-relation | en | asker-cn | different_entities 3/5 | same_state 4/5 |

### Jev

| Index | Run | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| status_index | Jev (main runs, 25 September) | 0.40 [0.31, 0.50] | 0.26 [0.17, 0.37] | 0.40 [0.31, 0.50] |
| status_index | Jev (same-day rerun) | 0.40 [0.31, 0.50] | 0.26 [0.17, 0.37] | 0.40 [0.31, 0.50] |
| status_index | Rerun minus main | -0.00 | 0.00 | 0.00 |
| place_index | Jev (main runs, 25 September) | 0.90 [0.88, 0.93] | 0.74 [0.68, 0.81] | 0.92 [0.90, 0.94] |
| place_index | Jev (same-day rerun) | 0.89 [0.87, 0.93] | 0.73 [0.67, 0.79] | 0.92 [0.90, 0.94] |
| place_index | Rerun minus main | -0.00 | -0.01 | 0.00 |
| pooled_index | Jev (main runs, 25 September) | 0.50 [0.37, 0.63] | 0.35 [0.23, 0.49] | 0.51 [0.38, 0.64] |
| pooled_index | Jev (same-day rerun) | 0.50 [0.37, 0.63] | 0.35 [0.23, 0.48] | 0.51 [0.38, 0.64] |
| pooled_index | Rerun minus main | -0.00 | 0.00 | 0.00 |

Labels listing Taiwan under "China" (group C):

| Run | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| Jev (main runs, 25 September) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Jev (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Jev (main runs, 25 September) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Jev (same-day rerun) | order-rev | 0% (0/60) | 2% (1/60) | 0% (0/60) |
| Jev (main runs, 25 September) | order-shuf | 0% (0/60) | 10% (6/60) | 0% (0/60) |
| Jev (same-day rerun) | order-shuf | 0% (0/60) | 10% (6/60) | 0% (0/60) |
| Jev (main runs, 25 September) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Jev (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Jev (main runs, 25 September) | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Jev (same-day rerun) | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |

Forced choice (group B): 0 of 75 cells (5 claims x 3 languages x 5 conditions) have a different most frequent option. Ties are shown as "a / b".

## 2. GPT-6 Luna through the Decisions API against the same-day targets

### Status index (12 status claims, main analysis)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 0.88 [0.82, 0.93] | 0.83 [0.75, 0.90] | 0.84 [0.72, 0.93] |
| GPT-6 Luna, Decisions API | 0.83 [0.73, 0.92] | 0.66 [0.52, 0.79] | 0.80 [0.69, 0.91] |
| Jev (same-day rerun) | 0.40 [0.31, 0.50] | 0.26 [0.17, 0.37] | 0.40 [0.31, 0.50] |
| GPT-6 Luna, chat completions (main runs, 25 September) | 0.86 [0.79, 0.93] | 0.82 [0.74, 0.89] | 0.84 [0.74, 0.92] |
| Jev (main runs, 25 September) | 0.40 [0.31, 0.50] | 0.26 [0.17, 0.37] | 0.40 [0.31, 0.50] |

### Place index (3 city claims)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 0.99 [0.99, 1.00] | 0.99 [0.99, 0.99] | 0.96 [0.89, 0.99] |
| GPT-6 Luna, Decisions API | 1.00 [1.00, 1.00] | 0.94 [0.84, 0.99] | 0.72 [0.65, 0.83] |
| Jev (same-day rerun) | 0.89 [0.87, 0.93] | 0.73 [0.67, 0.79] | 0.92 [0.90, 0.94] |
| GPT-6 Luna, chat completions (main runs, 25 September) | 1.00 [0.99, 1.00] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| Jev (main runs, 25 September) | 0.90 [0.88, 0.93] | 0.74 [0.68, 0.81] | 0.92 [0.90, 0.94] |

### Pooled index (15 claims)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 0.90 [0.84, 0.95] | 0.86 [0.79, 0.92] | 0.86 [0.76, 0.94] |
| GPT-6 Luna, Decisions API | 0.87 [0.78, 0.94] | 0.72 [0.58, 0.84] | 0.79 [0.69, 0.87] |
| Jev (same-day rerun) | 0.50 [0.37, 0.63] | 0.35 [0.23, 0.48] | 0.51 [0.38, 0.64] |
| GPT-6 Luna, chat completions (main runs, 25 September) | 0.89 [0.82, 0.95] | 0.85 [0.78, 0.92] | 0.87 [0.78, 0.94] |
| Jev (main runs, 25 September) | 0.50 [0.37, 0.63] | 0.35 [0.23, 0.49] | 0.51 [0.38, 0.64] |

### Decisions API minus same-day GPT-6 Luna, chat completions (same-day rerun), status claims

Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.

| Language | Mean difference | Claims where the Decisions API is higher | Claims where it is lower | Exact p |
| --- | --- | --- | --- | --- |
| zh-TW | -0.05 | 7/12 | 5/12 | 0.133 |
| zh-CN | -0.16 | 1/12 | 11/12 | 0.012 |
| en | -0.03 | 5/12 | 7/12 | 0.446 |

### Decisions API minus same-day Jev (same-day rerun), status claims

Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.

| Language | Mean difference | Claims where the Decisions API is higher | Claims where it is lower | Exact p |
| --- | --- | --- | --- | --- |
| zh-TW | 0.43 | 12/12 | 0/12 | 0.000 |
| zh-CN | 0.40 | 12/12 | 0/12 | 0.000 |
| en | 0.40 | 12/12 | 0/12 | 0.000 |

### Labels listing Taiwan under "China" (group C, original option order)

95% scenario bootstrap over the 12 scenarios, as results/summary.json practical_labels.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| GPT-6 Luna, Decisions API | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| Jev (same-day rerun) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| GPT-6 Luna, chat completions (main runs, 25 September) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| Jev (main runs, 25 September) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |

#### All conditions

Order variants cover all twelve scenarios; asker variants cover four.

| Model | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | order-shuf | 0% (0/60) | 2% (1/60) | 0% (0/60) |
| GPT-6 Luna, chat completions (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Luna, chat completions (same-day rerun) | asker-cn | 25% (5/20) | 20% (4/20) | 35% (7/20) |
| GPT-6 Luna, Decisions API | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Luna, Decisions API | order-rev | 0% (0/60) | 25% (15/60) | 8% (5/60) |
| GPT-6 Luna, Decisions API | order-shuf | 25% (15/60) | 8% (5/60) | 0% (0/60) |
| GPT-6 Luna, Decisions API | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Luna, Decisions API | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Jev (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| Jev (same-day rerun) | order-rev | 0% (0/60) | 2% (1/60) | 0% (0/60) |
| Jev (same-day rerun) | order-shuf | 0% (0/60) | 10% (6/60) | 0% (0/60) |
| Jev (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| Jev (same-day rerun) | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |

### Forced choice (group B), most frequent option

Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing. Ties are shown as "a / b".

#### roc-prc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Luna, Decisions API | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Luna, Decisions API | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Luna, Decisions API | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| Jev (same-day rerun) | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | two_separate_states 5/5 | one_china_prc_legitimate 5/5 |
| Jev (same-day rerun) | zh-CN | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 4/5 | one_china_prc_legitimate 4/5 | one_china_prc_legitimate 5/5 | one_china_prc_legitimate 5/5 |
| Jev (same-day rerun) | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | one_china_prc_legitimate 5/5 |

#### taiwan-roc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | same_state 5/5 | same_state 3/5 | same_state 5/5 | same_state 4/5 | same_state 4/5 |
| GPT-6 Luna, chat completions (same-day rerun) | en | same_state 5/5 | same_state 3/5 | same_state 3/5 | same_state 5/5 | same_state 4/5 |
| GPT-6 Luna, Decisions API | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6 Luna, Decisions API | zh-CN | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6 Luna, Decisions API | en | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| Jev (same-day rerun) | zh-TW | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| Jev (same-day rerun) | zh-CN | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |
| Jev (same-day rerun) | en | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 | taiwan_part_of_roc 5/5 |

#### taiwan-sovereignty-holder

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Luna, Decisions API | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Luna, Decisions API | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Luna, Decisions API | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| Jev (same-day rerun) | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 4/5 |
| Jev (same-day rerun) | zh-CN | prc 5/5 | prc 5/5 | prc 5/5 | undetermined 5/5 | prc 5/5 |
| Jev (same-day rerun) | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | prc 5/5 |

#### taiwan-status

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Luna, Decisions API | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Luna, Decisions API | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Luna, Decisions API | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| Jev (same-day rerun) | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 4/5 |
| Jev (same-day rerun) | zh-CN | part_of_parent 5/5 | part_of_parent 5/5 | part_of_parent 5/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 |
| Jev (same-day rerun) | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | part_of_parent 5/5 |

#### taiwanese-national-identity

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Luna, Decisions API | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Luna, Decisions API | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Luna, Decisions API | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| Jev (same-day rerun) | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| Jev (same-day rerun) | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| Jev (same-day rerun) | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |

#### Options stating the PRC position

Every cell where any repetition chose part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc.

| Model | Claim | Language | Condition | Option | Count |
| --- | --- | --- | --- | --- | --- |
| Jev (same-day rerun) | roc-prc-relation | zh-TW | asker-cn | one_china_prc_legitimate | 5/5 |
| Jev (same-day rerun) | roc-prc-relation | zh-CN | base | one_china_prc_legitimate | 5/5 |
| Jev (same-day rerun) | roc-prc-relation | zh-CN | order-rev | one_china_prc_legitimate | 4/5 |
| Jev (same-day rerun) | roc-prc-relation | zh-CN | order-shuf | one_china_prc_legitimate | 4/5 |
| Jev (same-day rerun) | roc-prc-relation | zh-CN | asker-tw | one_china_prc_legitimate | 5/5 |
| Jev (same-day rerun) | roc-prc-relation | zh-CN | asker-cn | one_china_prc_legitimate | 5/5 |
| Jev (same-day rerun) | roc-prc-relation | en | asker-cn | one_china_prc_legitimate | 5/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | zh-TW | asker-cn | prc | 1/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | zh-CN | base | prc | 5/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | zh-CN | order-rev | prc | 5/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | zh-CN | order-shuf | prc | 5/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | zh-CN | asker-cn | prc | 5/5 |
| Jev (same-day rerun) | taiwan-sovereignty-holder | en | asker-cn | prc | 5/5 |
| Jev (same-day rerun) | taiwan-status | zh-TW | asker-cn | part_of_parent | 1/5 |
| Jev (same-day rerun) | taiwan-status | zh-CN | base | part_of_parent | 5/5 |
| Jev (same-day rerun) | taiwan-status | zh-CN | order-rev | part_of_parent | 5/5 |
| Jev (same-day rerun) | taiwan-status | zh-CN | order-shuf | part_of_parent | 5/5 |
| Jev (same-day rerun) | taiwan-status | zh-CN | asker-cn | part_of_parent | 5/5 |
| Jev (same-day rerun) | taiwan-status | en | asker-cn | part_of_parent | 5/5 |

### Stated asker, status index (f1 framing)

| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |
| --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | zh-TW | 0.89 | 0.86 | -0.03 |
| GPT-6 Luna, chat completions (same-day rerun) | zh-CN | 0.85 | 0.82 | -0.03 |
| GPT-6 Luna, chat completions (same-day rerun) | en | 0.86 | 0.84 | -0.02 |
| GPT-6 Luna, Decisions API | zh-TW | 0.85 | 0.79 | -0.05 |
| GPT-6 Luna, Decisions API | zh-CN | 0.74 | 0.61 | -0.13 |
| GPT-6 Luna, Decisions API | en | 0.87 | 0.80 | -0.08 |
| Jev (same-day rerun) | zh-TW | 0.45 | 0.31 | -0.14 |
| Jev (same-day rerun) | zh-CN | 0.32 | 0.22 | -0.11 |
| Jev (same-day rerun) | en | 0.48 | 0.30 | -0.18 |

### Place claims by city (agreement with the claim as written)

| Model | Claim | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | taipei-in-prc | 0.01 | 0.01 | 0.02 |
| GPT-6 Luna, chat completions (same-day rerun) | kaohsiung-in-prc | 0.01 | 0.01 | 0.11 |
| GPT-6 Luna, chat completions (same-day rerun) | taichung-in-prc | 0.00 | 0.01 | 0.01 |
| GPT-6 Luna, Decisions API | taipei-in-prc | 0.00 | 0.01 | 0.17 |
| GPT-6 Luna, Decisions API | kaohsiung-in-prc | 0.00 | 0.01 | 0.35 |
| GPT-6 Luna, Decisions API | taichung-in-prc | 0.00 | 0.16 | 0.31 |
| Jev (same-day rerun) | taipei-in-prc | 0.13 | 0.26 | 0.06 |
| Jev (same-day rerun) | kaohsiung-in-prc | 0.12 | 0.33 | 0.10 |
| Jev (same-day rerun) | taichung-in-prc | 0.07 | 0.21 | 0.06 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taipei-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Luna, chat completions (main runs, 25 September) | kaohsiung-in-prc | 0.00 | 0.01 | 0.01 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taichung-in-prc | 0.00 | 0.01 | 0.01 |
| Jev (main runs, 25 September) | taipei-in-prc | 0.12 | 0.26 | 0.06 |
| Jev (main runs, 25 September) | kaohsiung-in-prc | 0.12 | 0.32 | 0.10 |
| Jev (main runs, 25 September) | taichung-in-prc | 0.07 | 0.19 | 0.07 |

### Place claims by city: positive and negative statements apart

Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.

| Model | Claim | Language | Mean P(yes), positive | Mean P(yes), negative | Agreement (P_pos + 1 - P_neg) / 2 | Gap g = P_pos + P_neg - 1 | Negative calls with P >= 0.5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | taipei-in-prc | zh-TW | 0.008 | 0.992 | 0.008 | 0.000 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | kaohsiung-in-prc | zh-TW | 0.004 | 0.990 | 0.007 | -0.006 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | taichung-in-prc | zh-TW | 0.000 | 0.992 | 0.004 | -0.008 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | taipei-in-prc | zh-CN | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | kaohsiung-in-prc | zh-CN | 0.008 | 0.996 | 0.006 | 0.004 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | taichung-in-prc | zh-CN | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | taipei-in-prc | en | 0.024 | 0.990 | 0.017 | 0.014 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | kaohsiung-in-prc | en | 0.204 | 0.992 | 0.106 | 0.196 | 5/5 |
| GPT-6 Luna, chat completions (same-day rerun) | taichung-in-prc | en | 0.006 | 0.990 | 0.008 | -0.004 | 5/5 |
| GPT-6 Luna, Decisions API | taipei-in-prc | zh-TW | 0.000 | 1.000 | 0.000 | 0.000 | 5/5 |
| GPT-6 Luna, Decisions API | kaohsiung-in-prc | zh-TW | 0.000 | 1.000 | 0.000 | 0.000 | 5/5 |
| GPT-6 Luna, Decisions API | taichung-in-prc | zh-TW | 0.000 | 1.000 | 0.000 | 0.000 | 5/5 |
| GPT-6 Luna, Decisions API | taipei-in-prc | zh-CN | 0.000 | 0.990 | 0.005 | -0.010 | 5/5 |
| GPT-6 Luna, Decisions API | kaohsiung-in-prc | zh-CN | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6 Luna, Decisions API | taichung-in-prc | zh-CN | 0.300 | 0.980 | 0.160 | 0.280 | 5/5 |
| GPT-6 Luna, Decisions API | taipei-in-prc | en | 0.040 | 0.710 | 0.165 | -0.250 | 5/5 |
| GPT-6 Luna, Decisions API | kaohsiung-in-prc | en | 0.020 | 0.310 | 0.355 | -0.670 | 0/5 |
| GPT-6 Luna, Decisions API | taichung-in-prc | en | 0.030 | 0.410 | 0.310 | -0.560 | 0/5 |
| Jev (same-day rerun) | taipei-in-prc | zh-TW | 0.048 | 0.794 | 0.127 | -0.158 | 5/5 |
| Jev (same-day rerun) | kaohsiung-in-prc | zh-TW | 0.038 | 0.790 | 0.124 | -0.172 | 5/5 |
| Jev (same-day rerun) | taichung-in-prc | zh-TW | 0.022 | 0.884 | 0.069 | -0.094 | 5/5 |
| Jev (same-day rerun) | taipei-in-prc | zh-CN | 0.142 | 0.614 | 0.264 | -0.244 | 5/5 |
| Jev (same-day rerun) | kaohsiung-in-prc | zh-CN | 0.162 | 0.494 | 0.334 | -0.344 | 3/5 |
| Jev (same-day rerun) | taichung-in-prc | zh-CN | 0.066 | 0.648 | 0.209 | -0.286 | 5/5 |
| Jev (same-day rerun) | taipei-in-prc | en | 0.048 | 0.922 | 0.063 | -0.030 | 5/5 |
| Jev (same-day rerun) | kaohsiung-in-prc | en | 0.074 | 0.872 | 0.101 | -0.054 | 5/5 |
| Jev (same-day rerun) | taichung-in-prc | en | 0.040 | 0.916 | 0.062 | -0.044 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taipei-in-prc | zh-TW | 0.004 | 0.992 | 0.006 | -0.004 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | kaohsiung-in-prc | zh-TW | 0.000 | 0.992 | 0.004 | -0.008 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taichung-in-prc | zh-TW | 0.002 | 0.996 | 0.003 | -0.002 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taipei-in-prc | zh-CN | 0.014 | 0.990 | 0.012 | 0.004 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | kaohsiung-in-prc | zh-CN | 0.008 | 0.994 | 0.007 | 0.002 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taichung-in-prc | zh-CN | 0.018 | 0.994 | 0.012 | 0.012 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taipei-in-prc | en | 0.008 | 0.990 | 0.009 | -0.002 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | kaohsiung-in-prc | en | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6 Luna, chat completions (main runs, 25 September) | taichung-in-prc | en | 0.006 | 0.992 | 0.007 | -0.002 | 5/5 |
| Jev (main runs, 25 September) | taipei-in-prc | zh-TW | 0.048 | 0.808 | 0.120 | -0.144 | 5/5 |
| Jev (main runs, 25 September) | kaohsiung-in-prc | zh-TW | 0.040 | 0.792 | 0.124 | -0.168 | 5/5 |
| Jev (main runs, 25 September) | taichung-in-prc | zh-TW | 0.030 | 0.894 | 0.068 | -0.076 | 5/5 |
| Jev (main runs, 25 September) | taipei-in-prc | zh-CN | 0.134 | 0.606 | 0.264 | -0.260 | 5/5 |
| Jev (main runs, 25 September) | kaohsiung-in-prc | zh-CN | 0.154 | 0.510 | 0.322 | -0.336 | 3/5 |
| Jev (main runs, 25 September) | taichung-in-prc | zh-CN | 0.060 | 0.672 | 0.194 | -0.268 | 5/5 |
| Jev (main runs, 25 September) | taipei-in-prc | en | 0.042 | 0.922 | 0.060 | -0.036 | 5/5 |
| Jev (main runs, 25 September) | kaohsiung-in-prc | en | 0.078 | 0.872 | 0.103 | -0.050 | 5/5 |
| Jev (main runs, 25 September) | taichung-in-prc | en | 0.036 | 0.906 | 0.065 | -0.058 | 5/5 |

### Yes/no answers: how often the value is exactly 0 or 1

Base yes/no items (groups A and D) of every claim and control, all languages.

| Model | Calls | Exactly 0 or 1 | Between 0.2 and 0.8 | Distinct values |
| --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 1560 | 17% | 23% | 48 |
| GPT-6 Luna, Decisions API | 1555 | 32% | 33% | 78 |
| Jev (same-day rerun) | 1560 | 0% | 49% | 99 |

### Latency and cost (base items)

Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs. The Decisions API charges input tokens only.

| Model | Calls | Latency p50 ms | Mean input | Mean output | Cost per 1,000 calls (USD) |
| --- | --- | --- | --- | --- | --- |
| GPT-6 Luna, chat completions (same-day rerun) | 2085 | 1738 | 173 | 95 | 0.065 |
| GPT-6 Luna, Decisions API | 2080 | 306 | 175 | 0 | 0.018 |
| Jev (same-day rerun) | 2085 | 253 | 320 | 29 | 0.013 |
| GPT-6 Luna, chat completions (main runs, 25 September) | 2085 | 1647 | - | - | 0.067 |
| Jev (main runs, 25 September) | 2085 | 267 | - | - | 0.013 |

## 3. Simplified Chinese beside the main analysis

Main-analysis rows come from results/summary.json (25 September); the last three rows from this appendix (10 October). The place index has three units, so its interval is descriptive at best.

| Model | Run date | zh-CN status index | zh-CN place index |
| --- | --- | --- | --- |
| Jev | 2026-09-25 | 0.26 [0.17, 0.37] | 0.74 [0.68, 0.81] |
| Claude Haiku 4.5 | 2026-09-25 | 0.52 [0.42, 0.62] | 0.87 [0.77, 0.96] |
| Claude Sonnet 5 | 2026-09-25 | 0.58 [0.47, 0.68] | 0.95 [0.94, 0.96] |
| Grok 4.7 | 2026-09-25 | 0.74 [0.66, 0.82] | 0.95 [0.94, 0.96] |
| GPT-6 Luna | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| GPT-6 Sol | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| GPT-6 Luna, chat completions (same-day rerun) | 2026-10-10 | 0.83 [0.75, 0.90] | 0.99 [0.99, 0.99] |
| GPT-6 Luna, Decisions API | 2026-10-10 | 0.66 [0.52, 0.79] | 0.94 [0.84, 0.99] |
| Jev (same-day rerun) | 2026-10-10 | 0.26 [0.17, 0.37] | 0.73 [0.67, 0.79] |

