# Appendix D: GPT-6.1 Sol

Generated 2026-10-08T07:48:21.983Z from results/runs-appendixd/ (9570 successful calls) and, for the bridge, the GPT-6 Sol records of results/runs/. Definitions, seeds and index code are those of the main analysis.

## Runs

Both targets ran in one batch. OpenAI credits ran out partway; the run was resumed with `run-all.mjs --resume` into the same run files, and the failed calls were moved to results/runs-discarded/20261001-openai-credits-exhausted.jsonl.

| Target | Model ID | Calls | First call (UTC) | Last call (UTC) |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | gpt-6-sol | 4785 | 2026-10-01T04:10:48.069Z | 2026-10-01T08:45:07.773Z |
| GPT-6.1 Sol | gpt-6.1-sol | 4785 | 2026-10-01T04:10:50.758Z | 2026-10-01T08:57:16.854Z |

### Segments and interruption

| Target | Segment | From (UTC) | To (UTC) | Calls |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 1 | 2026-10-01T04:10:48.069Z | 2026-10-01T04:32:46.157Z | 4343 |
| GPT-6 Sol (same-day rerun) | 2 | 2026-10-01T08:42:53.829Z | 2026-10-01T08:45:07.773Z | 442 |
| GPT-6.1 Sol | 1 | 2026-10-01T04:10:50.758Z | 2026-10-01T04:32:57.820Z | 2906 |
| GPT-6.1 Sol | 2 | 2026-10-01T08:42:55.955Z | 2026-10-01T08:57:16.854Z | 1879 |

| Target | Pause (UTC) | Failed calls discarded | Of which HTTP 429 | Failed calls first to last (UTC) | Every failed call later succeeded |
| --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 2026-10-01T04:32:46.157Z to 2026-10-01T08:42:53.829Z | 442 | 442 | 2026-10-01T04:32:57.009Z to 2026-10-01T04:39:44.390Z | yes |
| GPT-6.1 Sol | 2026-10-01T04:32:57.820Z to 2026-10-01T08:42:55.955Z | 526 | 526 | 2026-10-01T04:32:56.611Z to 2026-10-01T04:40:58.699Z | yes |

Records in results/runs-appendixd/: 9570; failed (ok false) 0; refusals 0; successful calls without a value or choice 0; duplicate item and repetition pairs 0.

## 1. Bridge: GPT-6 Sol rerun (1 October) against the main run (25 September)

The same target and items on two dates. A single bridge shows how much this version moved between the two dates; it cannot estimate the range of day-to-day variation.

| Index | Run | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| status_index | GPT-6 Sol (main runs, 25 September) | 0.91 [0.87, 0.95] | 0.82 [0.74, 0.89] | 0.89 [0.83, 0.94] |
| status_index | GPT-6 Sol (same-day rerun) | 0.91 [0.87, 0.95] | 0.81 [0.74, 0.88] | 0.91 [0.86, 0.95] |
| status_index | Rerun minus main | -0.00 | -0.01 | 0.02 |
| place_index | GPT-6 Sol (main runs, 25 September) | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| place_index | GPT-6 Sol (same-day rerun) | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| place_index | Rerun minus main | -0.00 | 0.00 | 0.00 |
| pooled_index | GPT-6 Sol (main runs, 25 September) | 0.93 [0.89, 0.96] | 0.85 [0.78, 0.92] | 0.91 [0.85, 0.96] |
| pooled_index | GPT-6 Sol (same-day rerun) | 0.93 [0.89, 0.96] | 0.85 [0.78, 0.91] | 0.92 [0.88, 0.96] |
| pooled_index | Rerun minus main | -0.00 | -0.01 | 0.01 |

### Labels listing Taiwan under "China" (group C)

| Run | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (main runs, 25 September) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (main runs, 25 September) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (main runs, 25 September) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (main runs, 25 September) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Sol (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Sol (main runs, 25 September) | asker-cn | 0% (0/20) | 15% (3/20) | 0% (0/20) |
| GPT-6 Sol (same-day rerun) | asker-cn | 5% (1/20) | 10% (2/20) | 0% (0/20) |

### Forced choice (group B): cells whose most frequent option differs

0 of 75 cells (5 claims x 3 languages x 5 conditions). Ties are shown as "a / b".


## 2. GPT-6.1 Sol against the same-day GPT-6 Sol

### Status index (12 status claims, main analysis)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 0.91 [0.87, 0.95] | 0.81 [0.74, 0.88] | 0.91 [0.86, 0.95] |
| GPT-6.1 Sol | 0.90 [0.84, 0.95] | 0.79 [0.69, 0.87] | 0.91 [0.87, 0.95] |
| GPT-6 Sol (main runs, 25 September) | 0.91 [0.87, 0.95] | 0.82 [0.74, 0.89] | 0.89 [0.83, 0.94] |

### Place index (3 city claims)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| GPT-6.1 Sol | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |
| GPT-6 Sol (main runs, 25 September) | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] | 0.99 [0.99, 0.99] |

### Pooled index (15 claims)

95% cluster bootstrap intervals over claims.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 0.93 [0.89, 0.96] | 0.85 [0.78, 0.91] | 0.92 [0.88, 0.96] |
| GPT-6.1 Sol | 0.92 [0.87, 0.96] | 0.83 [0.74, 0.91] | 0.93 [0.89, 0.96] |
| GPT-6 Sol (main runs, 25 September) | 0.93 [0.89, 0.96] | 0.85 [0.78, 0.92] | 0.91 [0.85, 0.96] |

### GPT-6.1 Sol minus same-day GPT-6 Sol, status claims

Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.

| Language | Mean difference | Claims where GPT-6.1 Sol is higher | Claims where it is lower | Exact p |
| --- | --- | --- | --- | --- |
| zh-TW | -0.02 | 4/12 | 8/12 | 0.429 |
| zh-CN | -0.02 | 6/12 | 6/12 | 0.455 |
| en | 0.00 | 5/12 | 7/12 | 0.759 |

### Labels listing Taiwan under "China" (group C, original option order)

95% scenario bootstrap over the 12 scenarios, as results/summary.json practical_labels.

| Model | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| GPT-6.1 Sol | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |
| GPT-6 Sol (main runs, 25 September) | 0% [0, 0] | 0% [0, 0] | 0% [0, 0] |

#### All conditions

Order variants cover all twelve scenarios; asker variants cover four.

| Model | Condition | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6 Sol (same-day rerun) | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6 Sol (same-day rerun) | asker-cn | 5% (1/20) | 10% (2/20) | 0% (0/20) |
| GPT-6.1 Sol | base | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6.1 Sol | order-rev | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6.1 Sol | order-shuf | 0% (0/60) | 0% (0/60) | 0% (0/60) |
| GPT-6.1 Sol | asker-tw | 0% (0/20) | 0% (0/20) | 0% (0/20) |
| GPT-6.1 Sol | asker-cn | 0% (0/20) | 0% (0/20) | 0% (0/20) |

### Forced choice (group B), most frequent option

Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing. Ties are shown as "a / b".

#### roc-prc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Sol (same-day rerun) | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6 Sol (same-day rerun) | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6.1 Sol | zh-TW | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6.1 Sol | zh-CN | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |
| GPT-6.1 Sol | en | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 | unresolved 5/5 |

#### taiwan-roc-relation

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6 Sol (same-day rerun) | zh-CN | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6 Sol (same-day rerun) | en | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6.1 Sol | zh-TW | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |
| GPT-6.1 Sol | zh-CN | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 3/5 |
| GPT-6.1 Sol | en | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 | same_state 5/5 |

#### taiwan-sovereignty-holder

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Sol (same-day rerun) | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6 Sol (same-day rerun) | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6.1 Sol | zh-TW | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6.1 Sol | zh-CN | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |
| GPT-6.1 Sol | en | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 | undetermined 5/5 |

#### taiwan-status

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Sol (same-day rerun) | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6 Sol (same-day rerun) | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6.1 Sol | zh-TW | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6.1 Sol | zh-CN | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |
| GPT-6.1 Sol | en | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 | de_facto_limited_recognition 5/5 |

#### taiwanese-national-identity

| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Sol (same-day rerun) | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6 Sol (same-day rerun) | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6.1 Sol | zh-TW | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6.1 Sol | zh-CN | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |
| GPT-6.1 Sol | en | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 | taiwanese 5/5 |

#### Options stating the PRC position

Every cell where any repetition chose part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc.

None.

### Stated asker, status index (f1 framing)

| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | zh-TW | 0.92 | 0.90 | -0.02 |
| GPT-6 Sol (same-day rerun) | zh-CN | 0.86 | 0.80 | -0.06 |
| GPT-6 Sol (same-day rerun) | en | 0.93 | 0.90 | -0.03 |
| GPT-6.1 Sol | zh-TW | 0.91 | 0.90 | -0.01 |
| GPT-6.1 Sol | zh-CN | 0.84 | 0.81 | -0.03 |
| GPT-6.1 Sol | en | 0.93 | 0.91 | -0.03 |

### Place claims by city (agreement with the claim as written)

| Model | Claim | zh-TW | zh-CN | en |
| --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | taipei-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Sol (same-day rerun) | kaohsiung-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Sol (same-day rerun) | taichung-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6.1 Sol | taipei-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6.1 Sol | kaohsiung-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6.1 Sol | taichung-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Sol (main runs, 25 September) | taipei-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Sol (main runs, 25 September) | kaohsiung-in-prc | 0.01 | 0.01 | 0.01 |
| GPT-6 Sol (main runs, 25 September) | taichung-in-prc | 0.01 | 0.01 | 0.01 |

### Place claims by city: positive and negative statements apart

Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.

| Model | Claim | Language | Mean P(yes), positive | Mean P(yes), negative | Agreement (P_pos + 1 - P_neg) / 2 | Gap g = P_pos + P_neg - 1 | Negative calls with P >= 0.5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | taipei-in-prc | zh-TW | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6 Sol (same-day rerun) | kaohsiung-in-prc | zh-TW | 0.002 | 0.990 | 0.006 | -0.008 | 5/5 |
| GPT-6 Sol (same-day rerun) | taichung-in-prc | zh-TW | 0.004 | 0.990 | 0.007 | -0.006 | 5/5 |
| GPT-6 Sol (same-day rerun) | taipei-in-prc | zh-CN | 0.010 | 0.986 | 0.012 | -0.004 | 5/5 |
| GPT-6 Sol (same-day rerun) | kaohsiung-in-prc | zh-CN | 0.001 | 0.990 | 0.005 | -0.009 | 5/5 |
| GPT-6 Sol (same-day rerun) | taichung-in-prc | zh-CN | 0.004 | 0.990 | 0.007 | -0.006 | 5/5 |
| GPT-6 Sol (same-day rerun) | taipei-in-prc | en | 0.003 | 0.990 | 0.006 | -0.007 | 5/5 |
| GPT-6 Sol (same-day rerun) | kaohsiung-in-prc | en | 0.000 | 0.990 | 0.005 | -0.010 | 5/5 |
| GPT-6 Sol (same-day rerun) | taichung-in-prc | en | 0.001 | 0.990 | 0.005 | -0.009 | 5/5 |
| GPT-6.1 Sol | taipei-in-prc | zh-TW | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6.1 Sol | kaohsiung-in-prc | zh-TW | 0.002 | 0.990 | 0.006 | -0.008 | 5/5 |
| GPT-6.1 Sol | taichung-in-prc | zh-TW | 0.004 | 0.990 | 0.007 | -0.006 | 5/5 |
| GPT-6.1 Sol | taipei-in-prc | zh-CN | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6.1 Sol | kaohsiung-in-prc | zh-CN | 0.008 | 0.990 | 0.009 | -0.002 | 5/5 |
| GPT-6.1 Sol | taichung-in-prc | zh-CN | 0.010 | 0.990 | 0.010 | 0.000 | 5/5 |
| GPT-6.1 Sol | taipei-in-prc | en | 0.008 | 0.990 | 0.009 | -0.002 | 5/5 |
| GPT-6.1 Sol | kaohsiung-in-prc | en | 0.000 | 0.990 | 0.005 | -0.010 | 5/5 |
| GPT-6.1 Sol | taichung-in-prc | en | 0.004 | 0.990 | 0.007 | -0.006 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taipei-in-prc | zh-TW | 0.008 | 0.990 | 0.009 | -0.002 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | kaohsiung-in-prc | zh-TW | 0.001 | 0.990 | 0.005 | -0.009 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taichung-in-prc | zh-TW | 0.000 | 0.990 | 0.005 | -0.010 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taipei-in-prc | zh-CN | 0.006 | 0.982 | 0.012 | -0.012 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | kaohsiung-in-prc | zh-CN | 0.005 | 0.990 | 0.007 | -0.005 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taichung-in-prc | zh-CN | 0.002 | 0.990 | 0.006 | -0.008 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taipei-in-prc | en | 0.008 | 0.990 | 0.009 | -0.002 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | kaohsiung-in-prc | en | 0.000 | 0.990 | 0.005 | -0.010 | 5/5 |
| GPT-6 Sol (main runs, 25 September) | taichung-in-prc | en | 0.003 | 0.990 | 0.006 | -0.007 | 5/5 |

### Latency and cost (base items)

Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs. Per-segment latency lists p50 ms (base calls) for each segment of the Runs table.

| Model | Calls | Latency p50 ms | Latency p50 by segment | Mean input | Mean output | Of which reasoning | Cost per 1,000 calls (USD) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-6 Sol (same-day rerun) | 2085 | 2081 | 2072 (2037); 2391 (48) | 173 | 81 | 62 | 1.16 |
| GPT-6.1 Sol | 2085 | 3344 | 3257 (1286); 3442 (799) | 173 | 50 | 32 | 0.84 |
| GPT-6 Sol (main runs, 25 September) | 2085 | 2275 | - | - | - | - | 1.13 |

## 3. Simplified Chinese beside the main analysis

Main-analysis rows come from results/summary.json (25 September); the last two rows from this appendix (1 October). The place index has three units, so its interval is descriptive at best.

| Model | Run date | zh-CN status index | zh-CN place index |
| --- | --- | --- | --- |
| Jev | 2026-09-25 | 0.26 [0.17, 0.37] | 0.74 [0.68, 0.81] |
| Claude Haiku 4.5 | 2026-09-25 | 0.52 [0.42, 0.62] | 0.87 [0.77, 0.96] |
| Claude Sonnet 5 | 2026-09-25 | 0.58 [0.47, 0.68] | 0.95 [0.94, 0.96] |
| Grok 4.7 | 2026-09-25 | 0.74 [0.66, 0.82] | 0.95 [0.94, 0.96] |
| GPT-6 Luna | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| GPT-6 Sol | 2026-09-25 | 0.82 [0.74, 0.89] | 0.99 [0.99, 0.99] |
| GPT-6 Sol (same-day rerun) | 2026-10-01 | 0.81 [0.74, 0.88] | 0.99 [0.99, 0.99] |
| GPT-6.1 Sol | 2026-10-01 | 0.79 [0.69, 0.87] | 0.99 [0.99, 0.99] |

