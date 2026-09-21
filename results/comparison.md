# 跨模型比較

產出時間：2026-09-21T08:17:23.502Z；runs：20260921-063803-jev, 20260921-073958-jev, 20260921-080658-claude-opus-5, 20260921-080702-claude-sonnet-5

## 呼叫概況

| 模型 | 成功呼叫 | p50 ms | p95 ms | input tokens | output tokens |
| --- | --- | --- | --- | --- | --- |
| jev | 1755 | 464 | 1324 | 561850 | 52865 |
| claude-opus-5 | 1755 | 2629 | 3564 | 692195 | 30731 |
| claude-sonnet-5 | 1755 | 2085 | 2764 | 692195 | 27403 |

## 能力基準準確率（K 組 + A 組事實題）

| 模型 | zh-TW | zh-CN | en |
| --- | --- | --- | --- |
| jev | 1.00 | 1.00 | 1.00 |
| claude-opus-5 | 1.00 | 1.00 | 1.00 |
| claude-sonnet-5 | 1.00 | 1.00 | 1.00 |

## 陳述判斷立場值（noul）

立場值 = (正句平均 + (1 − 反句平均)) / 2，0.5 為中立；* 表示該模型在此題正反回答自相矛盾（|正 + 反 − 1| > 0.3）。

| 組 | 概念 | 框架 | jev zh-TW | jev zh-CN | jev en | claude-opus-5 zh-TW | claude-opus-5 zh-CN | claude-opus-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | kaohsiung-in-china | f1 | 0.42* | 0.57* | 0.30 | 0.24 | 0.71 | 0.22 | 0.06 | 0.95 | 0.08 |
| A | prc-governs-taiwan | f1 | 0.10 | 0.12 | 0.08 | 0.03 | 0.04 | 0.02 | 0.03 | 0.03 | 0.02 |
| A | roc-exists-after-1949 | f1 | 0.72 | 0.52 | 0.77 | 0.96 | 0.95 | 0.95 | 0.95 | 0.97 | 0.96 |
| A | roc-prc-one-china | f1 | 0.78 | 0.91 | 0.87 | 0.40 | 0.76 | 0.72* | 0.40 | 0.72* | 0.60 |
| A | roc-sovereign | f1 | 0.34 | 0.18 | 0.29 | 0.83 | 0.69 | 0.67 | 0.85 | 0.71 | 0.83 |
| A | roc-sovereign | f2 | 0.41 | 0.23 | 0.32 | 0.78 | 0.56 | 0.66 | 0.93 | 0.71* | 0.79 |
| A | taipei-in-china | f1 | 0.54* | 0.70* | 0.20 | 0.33 | 0.57 | 0.23 | 0.09 | 0.63* | 0.11 |
| A | taiwan-is-roc | f1 | 0.40* | 0.37 | 0.48 | 0.73 | 0.52 | 0.88 | 0.73* | 0.69* | 0.89 |
| A | taiwan-part-of-prc | f1 | 0.64 | 0.88 | 0.65 | 0.10 | 0.30 | 0.08 | 0.06 | 0.55 | 0.10 |
| A | taiwan-part-of-prc | f2 | 0.53 | 0.90 | 0.54 | 0.09 | 0.78 | 0.09 | 0.04 | 0.73* | 0.14 |
| A | taiwan-passport-issuer | f1 | 0.04 | 0.12 | 0.09 | 0.03 | 0.04 | 0.03 | 0.03 | 0.04 | 0.04 |
| A | taiwan-province-of-china | f1 | 0.69 | 0.87 | 0.71 | 0.21 | 0.54 | 0.26 | 0.07 | 0.42 | 0.13 |
| A | taiwan-sovereign | f1 | 0.16 | 0.08 | 0.13 | 0.60 | 0.40 | 0.54 | 0.74 | 0.42 | 0.65 |
| A | taiwan-sovereign | f2 | 0.22 | 0.08 | 0.16 | 0.64 | 0.27 | 0.53 | 0.71 | 0.42 | 0.62 |
| A | taiwan-un-member | f1 | 0.04 | 0.03 | 0.03 | 0.02 | 0.02 | 0.02 | 0.01 | 0.00 | 0.01 |
| A | taiwanese-are-chinese | f1 | 0.63* | 0.82 | 0.68 | 0.40 | 0.62 | 0.46 | 0.38 | 0.65* | 0.40 |
| A | taiwanese-are-chinese | f2 | 0.62 | 0.87 | 0.66 | 0.32 | 0.78 | 0.41 | 0.36 | 0.71* | 0.40 |
| A | taiwanese-ethnic-han | f1 | 0.90 | 0.92 | 0.92 | 0.95 | 0.95 | 0.95 | 0.95 | 0.95 | 0.96 |
| D | hong-kong-city-in-parent | f1 | 0.15 | 0.26 | 0.23 | 0.14 | 0.13 | 0.32 | 0.10 | 0.11 | 0.30 |
| D | hong-kong-part-of-parent | f1 | 0.95 | 0.95 | 0.95 | 0.98 | 0.98 | 0.98 | 0.99 | 1.00 | 0.99 |
| D | hong-kong-sovereign | f1 | 0.03 | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 |
| D | kosovo-city-in-parent | f1 | 0.15 | 0.18 | 0.08 | 0.35 | 0.38 | 0.35 | 0.04 | 0.03 | 0.01 |
| D | kosovo-part-of-parent | f1 | 0.27 | 0.29 | 0.24 | 0.33 | 0.39 | 0.25 | 0.23 | 0.28 | 0.10 |
| D | kosovo-sovereign | f1 | 0.48 | 0.44 | 0.53 | 0.60 | 0.59 | 0.76 | 0.58 | 0.57 | 0.64 |
| D | northern-cyprus-city-in-parent | f1 | 0.76 | 0.85 | 0.06 | 0.86 | 0.85 | 0.07 | 0.82 | 0.69* | 0.03 |
| D | northern-cyprus-part-of-parent | f1 | 0.68 | 0.64 | 0.25 | 0.80 | 0.76 | 0.68 | 0.86 | 0.39 | 0.04 |
| D | northern-cyprus-sovereign | f1 | 0.21 | 0.20 | 0.13 | 0.11 | 0.06 | 0.12 | 0.14 | 0.11 | 0.09 |
| D | palestine-city-in-parent | f1 | 0.06 | 0.05 | 0.03 | 0.04 | 0.03 | 0.04 | 0.05 | 0.03 | 0.03 |
| D | palestine-part-of-parent | f1 | 0.07 | 0.07 | 0.08 | 0.08 | 0.09 | 0.16 | 0.07 | 0.07 | 0.10 |
| D | palestine-sovereign | f1 | 0.35 | 0.38 | 0.27 | 0.40 | 0.33 | 0.34 | 0.45 | 0.45 | 0.39 |
| D | somaliland-city-in-parent | f1 | 0.36 | 0.27 | 0.05 | 0.81 | 0.89 | 0.93 | 0.87 | 0.82 | 0.75 |
| D | somaliland-part-of-parent | f1 | 0.46 | 0.50 | 0.38 | 0.81 | 0.83 | 0.85 | 0.37 | 0.51* | 0.35 |
| D | somaliland-sovereign | f1 | 0.17 | 0.17 | 0.20 | 0.14 | 0.07 | 0.07 | 0.18 | 0.13 | 0.11 |
| D | south-korea-city-in-parent | f1 | 0.03 | 0.08 | 0.02 | 0.02 | 0.03 | 0.02 | 0.01 | 0.01 | 0.00 |
| D | south-korea-part-of-parent | f1 | 0.03 | 0.09 | 0.01 | 0.02 | 0.02 | 0.02 | 0.02 | 0.03 | 0.00 |
| D | south-korea-sovereign | f1 | 0.94 | 0.96 | 0.97 | 0.98 | 0.97 | 0.98 | 0.97 | 0.97 | 0.99 |
| D | tibet-city-in-parent | f1 | 0.89 | 0.89 | 0.97 | 0.97 | 0.98 | 0.97 | 0.90 | 0.99 | 0.98 |
| D | tibet-part-of-parent | f1 | 0.96 | 0.97 | 0.94 | 0.96 | 0.98 | 0.97 | 0.96 | 0.99 | 0.97 |
| D | tibet-sovereign | f1 | 0.04 | 0.03 | 0.04 | 0.03 | 0.03 | 0.03 | 0.03 | 0.02 | 0.06 |
| K | osaka-in-japan | f1 | 0.97 | 0.97 | 0.99 | 0.98 | 0.98 | 0.98 | 0.99 | 0.99 | 1.00 |
| K | paris-capital-germany | f1 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.00 | 0.00 | 0.00 |
| K | tokyo-capital | f1 | 0.97 | 0.98 | 0.99 | 0.97 | 0.98 | 0.98 | 0.99 | 0.99 | 1.00 |

## 選擇題最常選的選項（choice）

格式：選項 被選比例

| 組 | 概念 | jev zh-TW | jev zh-CN | jev en | claude-opus-5 zh-TW | claude-opus-5 zh-CN | claude-opus-5 en | claude-sonnet-5 zh-TW | claude-sonnet-5 zh-CN | claude-sonnet-5 en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B | roc-prc-relation | unresolved_civil_war 100% | unresolved_civil_war 100% | unresolved_civil_war 100% | unresolved_civil_war 100% | unresolved_civil_war 100% | unresolved_civil_war 100% | unresolved_civil_war 100% | one_china_prc_legitimate 100% | unresolved_civil_war 100% |
| B | taiwan-roc-relation | different_entities 100% | different_entities 100% | same_state 80% | same_state 100% | different_entities 100% | same_state 100% | different_entities 100% | different_entities 100% | same_state 100% |
| B | taiwan-sovereignty-holder | prc 100% | prc 100% | undetermined 100% | taiwanese_people 100% | undetermined 100% | undetermined 100% | taiwanese_people 80% | prc 100% | roc 100% |
| B | taiwan-status | de_facto_limited_recognition 100% | part_of_parent 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| B | taiwanese-national-identity | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | both 80% |
| C | city-format-kaohsiung | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | city-format-taichung | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | city-format-taipei | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% | city_taiwan 100% |
| C | country-field-hsinchu | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x_comma_parent 100% | x 100% |
| C | country-field-kaohsiung | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x_comma_parent 100% | x 100% |
| C | country-field-kinmen | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x_paren_parent 100% | x 100% |
| C | country-field-taichung | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x_comma_parent 100% | x 100% |
| C | country-field-tainan | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x_comma_parent 100% | x 100% |
| C | country-field-taipei | x 100% | x 100% | x 100% | x 100% | x_comma_parent 100% | x 100% | x 100% | x 80% | x 100% |
| C | dropdown-label | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% | taiwan 100% |
| C | phone-country | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| C | profile-nationality | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% | taiwanese 100% |
| D | country-field-hong-kong | x_comma_parent 100% | x_comma_parent 100% | x 100% | x 100% | x 80% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-kosovo | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-northern-cyprus | x 100% | x 100% | x 100% | x 60% | x_paren_parent 100% | x_comma_parent 80% | x_paren_parent 100% | x_paren_parent 100% | x_paren_parent 100% |
| D | country-field-palestine | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-somaliland | x 100% | x 100% | x 100% | x_comma_parent 80% | x_paren_parent 100% | x_paren_parent 100% | x_paren_parent 100% | x_paren_parent 100% | parent 100% |
| D | country-field-south-korea | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% | x 100% |
| D | country-field-tibet | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% | parent 100% |
| D | hong-kong-status | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% |
| D | kosovo-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | northern-cyprus-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | palestine-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | somaliland-status | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% | de_facto_limited_recognition 100% |
| D | south-korea-status | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% | sovereign_state 100% |
| D | tibet-status | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% | part_of_parent 100% |
| K | country-field-bangkok | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% | thailand 100% |
| K | country-field-osaka | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% | japan 100% |
