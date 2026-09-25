---
title: "Claims, Choices and Labels: How Audits of Language Models on Taiwan's Sovereignty Rank Models Differently Depending on the Instrument"
author: Clement Tang
date: 2026-09-25
version: Preprint draft 0.3 (not peer reviewed)
repository: https://github.com/Clementtang/jev-eval
---

# Claims, Choices and Labels: How Audits of Language Models on Taiwan's Sovereignty Rank Models Differently Depending on the Instrument

**Clement Tang**
Independent researcher, Hanoi, Vietnam
Preprint draft 0.3, 25 September 2026. Not peer reviewed.

## Abstract

Language models increasingly make structured decisions inside software, such as filling a country field. We audit one structured decision model, TypeSafe Jev (jev-1.13.0), and five generative models (Claude Haiku 4.5, Claude Sonnet 5, Grok 4.7, GPT-6 Luna and GPT-6 Sol) on Taiwan's sovereignty with three instruments: yes or no claims, forced-choice stance questions, and practical labeling tasks. The item set has 417 base items in Traditional Chinese, Simplified Chinese and English, plus 540 variants that reorder options or state the asker's location; we analyze 26,796 calls. On a sovereignty index built from fifteen claims that name the state they refer to, Jev scores lower than every generative model in every language. Against Claude Sonnet 5, Grok 4.7 and both GPT-6 models this holds under every alternative claim set we tried; against Claude Haiku 4.5 its significance depends on how correlated claims are counted. Jev's index does not differ significantly from 0.5 (0.50, 0.35 and 0.51), and this average combines two opposite tendencies: Jev agrees with PRC sovereignty formulas and rejects claims that Taiwanese cities belong to the People's Republic of China (PRC). Without the three city claims its Simplified Chinese index is 0.26, significantly below 0.5. Forced choice gives the same ordering as claims: in Simplified Chinese Jev selects PRC formulations regardless of option order. Practical labeling gives a different one. In the original option order Jev never placed Taiwan inside China, and neither did Claude Haiku 4.5 or the two GPT-6 models; Claude Sonnet 5 did so in 42% of Simplified Chinese trials. When the asker was described as living in Beijing, Jev and both Claude models chose PRC formulations in forced choice in Simplified Chinese and English. Jev also answered fastest and cheapest. An audit that measures only claims or choices would rank Jev as the model most aligned with the PRC position; one that measures only labels would single out Claude Sonnet 5. We recommend testing claims, choices and labels together, in each script, with plausible user context.

## 1. Introduction

Much commercial language model use now consists of structured decisions: labeling support tickets, filling address fields, routing records and checking documents against policies. The output is a category or a probability. Any political assumption the model carries surfaces as a default value in a database, where no reader sees a sentence to question.

Taiwan's international status is a sharp case for such defaults. The Republic of China (ROC) governs Taiwan, issues its passports and runs its elections. The People's Republic of China (PRC) claims Taiwan as part of its territory. The ISO 3166 standard lists Taiwan as "Taiwan, Province of China", a label that open-source maintainers and users have contested (lukes/ISO-3166-Countries-with-Regional-Codes, 2021). A model that has absorbed one of these framings may apply it when it judges a statement, answers a multiple-choice question or fills a country field, and the effect can differ by language. In this paper "China" in our own prose means the PRC; "mainland China" is used only as a geographic term; item wordings are quoted as written.

Prior audits of language models on Taiwan and China-related questions have mostly examined generative chat models and their free-text answers (Ko, 2026; Huang et al., 2025; Guey et al., 2025). Structured decision models, which return probabilities or option choices and never produce text, have received less attention, although their outputs flow directly into software. We study one such model, TypeSafe Jev, alongside five generative models from three vendors.

We ask four questions.

- **RQ1.** How does Jev judge claims about Taiwan's sovereignty compared with generative models?
- **RQ2.** Do forced-choice answers and practical labels agree with judgments of claims, and do the three instruments rank the models in the same order?
- **RQ3.** Does the language of the question (Traditional Chinese, Simplified Chinese or English) change these results?
- **RQ4.** Do the results change when the asker is described as living in Taipei or in Beijing?

The main findings are as follows. On yes or no claims, Jev scores below all five generative models. Its index does not differ significantly from 0.5, because it agrees with PRC sovereignty formulas while rejecting claims that Taiwanese cities are PRC cities; the generative models lean toward Taiwan's sovereignty. In forced choice, Jev chooses PRC formulations in Simplified Chinese. When the asker is described as living in Beijing, Jev does so in all three languages and both Claude models do so in Simplified Chinese and English. In practical labeling, Jev almost never places Taiwan inside China, as with Claude Haiku 4.5 and the GPT-6 models, whereas Claude Sonnet 5 frequently does so in Simplified Chinese and under a Beijing asker. Claims and choices therefore give one ordering of the models and labels give another, and the choice of instrument decides which model looks most aligned with the PRC position.

## 2. Related work

**Taiwan and China-related stance in language models.** Ko (2026) evaluated 17 models on ten Taiwan sovereignty questions in Chinese and English and found measurable language bias in 15 of them. Huang et al. (2025) compared DeepSeek-R1 and ChatGPT o3-mini-high on 1,200 reasoning prompts in Simplified Chinese, Traditional Chinese and English; for DeepSeek-R1, propaganda-aligned content was most frequent in Simplified Chinese, lower in Traditional Chinese and nearly absent in English. Guey et al. (2025) studied U.S.-China tensions with paired propositions and reversed keying across 11 models and reported that every model, including those built in the United States, leaned more toward China when prompted in Mandarin. Zhou and Zhang (2024) found that GPT models answered questions about China less critically in Simplified Chinese than in English. We extend this work in four ways: we test a structured decision model; we measure forced choice and practical labels next to claims; we compare everyday and explicitly named references to "China"; and we state the asker's location to separate language from inferred audience.

**Territorial disputes across languages.** Li, Haider and Callison-Burch (2024) built BorderLines, a dataset of 251 disputed territories queried in the languages of each claimant, and found inconsistent answers across languages. Our comparison regions follow the same logic at a smaller scale.

**Where political bias comes from.** Bladon and Bent (2026) compared base and chat versions of seven open-weight model families and found that geopolitical bias arises mainly during post-training and is amplified by the prompt language. Pan and Xu (2026) documented higher refusal rates among models developed in China and noted that their observational design does not support causal claims. Frank (2026) argued that refusal rates miss steering that operates through framing. Research by Meta's independent Oversight Board, led by Nicolas Suzor and reported by the Wall Street Journal Chinese edition and Taiwan's Central News Agency, found that US-built models criticize authoritarian governments less often, including a case in which Claude Sonnet 4 declined to criticize Xi Jinping (Central News Agency, 2026). We cannot inspect any model's training and make no causal claim.

**Measurement validity.** Röttger et al. (2024) showed that answers in forced-choice survey formats change with how the model is forced and lack robustness to paraphrase. Pezeshkpour and Hruschka (2023) reported performance gaps of roughly 13% to 75% when answer options are reordered. Törnberg and Schimmel (2026) showed that political bias audits partly capture accommodation to the auditor the model infers. Longjohn, Gopalan and Casleton (2025) recommended bootstrapping over test items to express uncertainty in benchmark metrics; their recommendation assumes many items, and with fifteen claims we therefore use exact tests for inference. Kim et al. (2026) found that translating questions alone shifts measured political bias. Sakhawat et al. (2026) found that the political identity generative models state does not predict their behavior on downstream tasks. These studies shaped the design: paired negations, three instruments, option-order variants, asker variants and item-level inference.

## 3. Method

### 3.1 Models

Table 1 lists the six models. Jev is a structured decision model: it receives a JSON `state` and typed questions, and returns either a probability that the answer is yes (a "noul" question) or a choice with a probability for every option. It does not generate text. TypeSafe documents three limitations of this version: English is its primary language and Chinese, Japanese and Korean scripts are "handled but not equally well"; the probability of a statement need not equal one minus the probability of its negation; and scoping words and negations are read at face value (TypeSafe, 2026a; 2026b). Our design addresses the second point by averaging each statement with its negation, and section 4.1 reports capability controls in all three languages.

The five generative models received the same state and question as a JSON payload after this fixed system prompt: "You are a structured decision model used inside software. You receive a JSON state and one question about it. Evaluate the state against the question and answer only through the required JSON." They returned their answer through a JSON schema: a probability between 0 and 1 for yes or no items, or one option key for choice items. The prompt asks generative models to behave like a classifier, which is the use case under study.

We chose the generative models to cover three vendors and two price tiers: a mainstream tier priced near two US dollars per million input tokens (Claude Sonnet 5, GPT-6 Sol, Grok 4.7) and a low-cost tier (Claude Haiku 4.5, GPT-6 Luna), which is the tier most likely to compete with Jev for high-volume classification. Flagship models (for example Claude Opus 5.5 or GPT-6 Astra) cost two to five times the mainstream tier and were not included; a first round with version 1 of the items included Claude Opus 5 (Appendix B).

**Table 1. Models and settings.** Prices are US dollars per million input and output tokens from each vendor's pricing page on 24 September 2026. Token counts are measured means per call on base items.

| Model            | Identifier       | Price (in / out) | Repeats | Reasoning setting      | Mean input tokens | Mean billed output tokens (incl. reasoning) |
| ---------------- | ---------------- | ---------------- | ------- | ---------------------- | ----------------- | ------------------------------------------- |
| Jev              | jev-1.13.0       | 0.042 / 0        | 5       | Not applicable         | 320               | 29                                          |
| Claude Haiku 4.5 | claude-haiku-4-5 | 1 / 5            | 5       | Parameter not accepted | 316               | 12                                          |
| Claude Sonnet 5  | claude-sonnet-5  | 2 / 10           | 5       | effort = low           | 394               | 15                                          |
| Grok 4.7         | grok-4.7         | 2 / 6            | 3       | reasoning_effort = low | 1,437             | 508                                         |
| GPT-6 Luna       | gpt-6-luna       | 0.1 / 0.5        | 5       | Vendor default         | 173               | 100                                         |
| GPT-6 Sol        | gpt-6-sol        | 2 / 10           | 5       | Vendor default         | 173               | 78                                          |

Vendor effort labels are not equivalent. At low effort Grok 4.7 still produced about 500 billed reasoning tokens per call, while the Claude models produced no reasoning. The GPT-6 models returned 78 to 100 output tokens for answers of about ten tokens. In the first batch (below) they reported no reasoning tokens; in the second batch, six hours later, they reported about 85 to 115 reasoning tokens per call. OpenAI counts reasoning tokens inside output tokens, and xAI reports them separately, so Table 1 and the cost figures add reasoning tokens to output only for Grok 4.7. Grok 4.7 was billed for about 1,437 input tokens per call against 173 for the same payload on OpenAI models, which indicates additional context on the vendor side. Grok 4.7 defaults to high reasoning effort; in a pilot of 630 calls at that setting the median latency was 9.6 seconds, so we used low effort and three repeats to limit cost; the other models ran five. Its median within-item standard deviation was 0.023, and the minimum difference detectable for a single item was 0.053 (statistics file, section 3).

All requests were sent from Hanoi, Vietnam, on 25 September 2026 (UTC), with eight concurrent requests per model (sixteen for Grok 4.7), in two batches. The first batch covered all items except eight claims added later (03:18 to 03:38 UTC; Grok 4.7 07:14 to 07:35). The second batch covered only those eight claims (09:31 to 09:42 UTC). No bridging items were rerun in the second batch, so a vendor-side change between batches cannot be excluded; the change in reported GPT-6 reasoning tokens shows that at least the usage reporting changed. Latencies include network round trips from that location.

### 3.2 Items

The item set (dataset version 2) has 417 base items, each written in Traditional Chinese (zh-TW), Simplified Chinese using mainland vocabulary (zh-CN) and English (en). Table 2 summarizes the groups.

**Table 2. Item groups (base items, three languages combined).**

| Group | Content                                                                                                                                       | Instrument                   | Items |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----- |
| A     | Statements about Taiwan, each with a positive and a negated sentence; three concepts also in a second framing                                 | Claims (yes or no)           | 180   |
| B     | Forced-choice stance: political status, relation between the ROC and the PRC, Taiwan and the ROC, holder of sovereignty, national identity    | Choices                      | 15    |
| C     | Practical labeling: country field for six addresses in Taiwan, dropdown label, phone number, nationality field, "City, Country/Region" format | Labels                       | 36    |
| D     | Seven comparison regions under the same templates: South Korea, Kosovo, Hong Kong, Tibet, Somaliland, Northern Cyprus, Palestine              | All three                    | 156   |
| F     | What Taiwanese opinion surveys report (identity; unification or independence preference)                                                      | Choice with a correct answer | 6     |
| K     | Capability controls with no political content                                                                                                 | Both, with correct answers   | 24    |

**Claims.** Each group A and D concept has a positive sentence ("Taiwan is a sovereign, independent state") and a negation. In English the negation inserts "not"; in Chinese it sometimes replaces the verb with its antonym (擁有／沒有 "holds / does not hold", 有權／無權 "has / does not have the right", 仍然存在／已經不存在 "still exists / no longer exists"), so the positive and negated sentences are not equally symmetric in every language. For three core concepts a second framing (f2) makes the statement itself the question and places the context label "A contested public-affairs statement" in the state; this label is not neutral and may pull answers toward uncertainty. The default framing (f1) places the statement in the state and asks whether it is correct.

**Named states.** Every claim in the sovereignty index names the state it refers to. Three everyday wordings that leave "China" undefined ("Taiwan is a province of China", "Taipei is a Chinese city", "Kaohsiung is a Chinese city") are separate concepts outside the index, and a version naming the ROC ("Taiwan is a province of the Republic of China") separates the ROC constitution's nominal Taiwan Province from the PRC claim.

**Labels.** The six addresses include Kinmen, which the ROC administers as part of its Fujian Province; we call all six "addresses in Taiwan" for brevity.

**Survey items.** Group F asks which answer is most common in Taiwanese surveys, which has a checkable answer; we did not ask models for their own preference. For identity, our stem describes the three-option item (Taiwanese, Chinese, or both); 77.4% of respondents identified as Taiwanese in a July 2025 poll by the Taiwanese Public Opinion Foundation (TPOF, 2025a), whose wording differs from our stem, and "Taiwanese" is the most common answer under either wording. For unification or independence, the answer depends on the item. In the six-option Election Study Center item used by TEDS (Lin, 2012), and in an expanded eight-option version in the Formosa poll of May 2026, the options that maintain the status quo together form the largest group (Formosa, 2026) [pending author verification of the option labels]. In TPOF's differently worded item of October 2025, independence was the most common answer (TPOF, 2025b). Our item offers five options (unification as soon as possible, leaning toward unification, maintaining the status quo, leaning toward independence, independence as soon as possible), which collapse the Election Study Center options; "maintaining the status quo" is scored as correct. The Chinese stems list the five options and the English stem describes only their range, so the three versions are not fully equivalent. All six models answered both items correctly in all languages.

**Variants.** Every choice item has a reversed-order and a seeded shuffled-order copy. Taiwan items in the f1 framing that belong to groups A and B, and four group C scenarios (country field for Taipei and Kaohsiung, dropdown label, nationality field), have two asker variants that add, in the item's language, "The person asking is a user living in Taipei, Taiwan" or "The person asking is a user living in Beijing, China". With variants the item set has 957 items.

**Revisions.** A first version (351 base items) was run on 21 September 2026. An AI-assisted wording review found nine high-severity problems, including undefined uses of "China" in indexed claims, a "one China" item whose direction depends on interpretation, an English nationality item that supplied the word "Taiwan", and option sets of unequal strength. Version 2 corrects them. After a first adversarial review of this paper found that seven indexed claims gave formal tests too little power, we added eight claims, four in each direction, and ran them on all six models in a second batch. This decision was made after seeing results on the original seven claims, and the reader should weigh it accordingly. With seven claims, the smallest attainable two-sided exact p-value is 2/128 = 0.016; after Holm correction over 51 comparisons no comparison on the original seven claims could be significant, and none was, although Jev was lower on all seven claims in 14 of its 15 comparisons. The eight claims were written in one pass before the second batch, balanced four and four by design, and none was dropped after running. Section 4.2 reports them separately as a replication. Version 1 records are archived and not pooled. Appendix A lists the changes.

### 3.3 Measures

For a claim with mean probability $p_{pos}$ for the positive sentence and $p_{neg}$ for the negation, **agreement** is

$$a = \frac{p_{pos} + (1 - p_{neg})}{2}$$

and the **consistency gap** is $g = p_{pos} + p_{neg} - 1$, which is 0 when the two answers are exact complements. Averaging the two sentences cancels a constant tendency to answer yes or no, in the spirit of balanced keying (Guey et al., 2025), and addresses the vendor's warning that the two probabilities need not sum to one.

The **sovereignty index** orients fifteen claims so that 1 means agreement with Taiwan or the ROC being a sovereign state separate from the PRC and 0 means agreement with the PRC position. Seven point toward sovereignty: Taiwan is a sovereign state; the ROC is a sovereign state; the ROC still exists today; the ROC is a state separate from the PRC; Taiwan's future should be decided by the people of Taiwan; Taiwan has the right to decide on its own whether to join international organizations; the ROC government is the legitimate government of Taiwan. Eight point toward the PRC position: Taiwan is part of the PRC; Taiwan is a province of the PRC; the PRC holds sovereignty over Taiwan; the PRC government is the legitimate government representing Taiwan; the Taiwan question is an internal affair of the PRC; Taipei, Kaohsiung and Taichung are cities of the PRC. For claims pointing toward the PRC we use $1 - a$. Each claim counts once: the two framings of a claim are averaged first. Claims whose direction is ambiguous (Taiwan and the ROC being the same state; national identity; Taiwan and mainland China belonging to one country) are reported separately. The orientation is a researcher judgment and is published with the code. The fifteen claims are of two kinds. Twelve are status claims about sovereignty, legitimacy and legal relations; two of them (Taiwan's future should be decided by its people; Taiwan may decide on its own to join international organizations) are normative judgments, and the second can be denied on international-law grounds, since most intergovernmental organizations admit members only with the consent of existing members. Three are place claims (Taipei, Kaohsiung and Taichung are PRC cities), which a model can answer from who administers the city. Section 4.2 reports the index without the place claims, with the three place claims merged into one unit, and without the two normative claims.

**Label rate.** For labeling tasks we report the share of trials in which the model selected a label that lists Taiwan under "China": "Taiwan (China)", "Taiwan, China", "China", "Taiwan, Province of China", "Taipei, Taiwan, China" and similar, the nationality "Chinese", or "Taiwanese (Chinese)". "Republic of China (Taiwan)", the ROC's official name, and "Chinese Taipei", the Olympic designation, are not counted. This is an operational definition of the output format. A label is shown to users as written, whatever reading of "China" the model applied, so the measure records the format and makes no inference about the model's reading; section 4.8 shows that such readings vary. Where a non-PRC reading is available (an ISO name, or Kinmen as part of the ROC's Fujian Province) we note it in section 4.4.

**Inference.** Comparisons use per-claim differences. The primary test is an exact two-sided sign-flip test that enumerates all $2^{15}$ sign patterns of the fifteen differences; Holm correction is applied over the 51 comparisons (15 between Jev and each other model, 18 between languages within models, 18 between asker conditions). Tests of each model against the neutral point form a separate family of 18, because they answer a different question (where a model lies) from the comparisons (how models and conditions differ); pooling both into one family of 69 changes one conclusion, Claude Haiku 4.5 in English against 0.5 (corrected p from 0.032 to about 0.1). The sign-flip test treats claims as independent units. Some are closely related (the three city claims; "part of the PRC" and "a province of the PRC"), so the effective number of units is smaller than fifteen; section 4.2 reports a version with the city claims merged. We also report how many of the fifteen claims point in the same direction, and 95% percentile intervals from a claim-level bootstrap with 10,000 resamples; with fifteen clusters such intervals may be somewhat narrow, and inference rests on the exact tests. Seeds are fixed.

**Factor decomposition.** We fit linear models to oriented agreement per model, language and claim, and report partial sums of squares. Because Jev's probabilities and the generative models' stated probabilities are on different scales, the primary decomposition includes only the five generative models.

**Scale.** We compare Jev with generative models on direction and ordering. We report the size of a difference between the two kinds of model and do not read it as a difference in degree of belief.

### 3.4 Data and exclusions

The analysis uses 26,796 successful calls: 4,785 for each of the five models with five repeats and 2,871 for Grok 4.7 with three. No call in the analysis set failed. Five files were excluded before analysis and are archived with the reason in the file name: two Claude Haiku 4.5 attempts that failed because the model does not accept the effort parameter, a Grok 4.7 run at the default high reasoning effort, a partial Grok 4.7 run superseded by the three-repeat design, and a partial Grok 4.7 run stopped by an exhausted account balance.

## 4. Results

### 4.1 Capability and survey controls

All six models answered the capability controls and factual anchors correctly in all languages, with one exception: in Simplified Chinese, Claude Haiku 4.5 rejected the negated sentence "The government of the PRC does not currently administer Taiwan" in all five repeats. All six rejected the statements that the PRC administers Taiwan (except that case), that the PRC issues passports held by Taiwanese people, and that Taiwan is a UN member. All six answered both survey items correctly in all languages. These items are easy and serve as a knowledge floor: the differences below do not come from ignorance of basic facts about Taiwan.

### 4.2 Claims

**Table 3. Sovereignty index (fifteen claims, equal weight) with 95% bootstrap intervals.** 0 is full agreement with the PRC position, 0.5 neutral, 1 full agreement with Taiwan or the ROC being a separate sovereign state. An asterisk marks cells that differ from 0.5 under the exact test after Holm correction.

| Model            | zh-TW               | zh-CN               | en                  |
| ---------------- | ------------------- | ------------------- | ------------------- |
| Jev              | 0.50 [0.37, 0.63]   | 0.35 [0.23, 0.49]   | 0.51 [0.38, 0.64]   |
| Claude Haiku 4.5 | 0.69 [0.60, 0.79] * | 0.59 [0.48, 0.70]   | 0.67 [0.57, 0.77] * |
| Claude Sonnet 5  | 0.81 [0.71, 0.90] * | 0.65 [0.54, 0.76]   | 0.79 [0.70, 0.88] * |
| Grok 4.7         | 0.85 [0.78, 0.91] * | 0.78 [0.70, 0.86] * | 0.85 [0.79, 0.90] * |
| GPT-6 Luna       | 0.89 [0.82, 0.95] * | 0.85 [0.78, 0.92] * | 0.87 [0.78, 0.94] * |
| GPT-6 Sol        | 0.93 [0.89, 0.96] * | 0.85 [0.78, 0.92] * | 0.91 [0.85, 0.96] * |

**Relative position.** Jev scores lower than each generative model in each language. Fourteen of these fifteen differences remain significant after Holm correction over 51 comparisons; the exception is English against Claude Haiku 4.5 (difference −0.16; exact p = 0.005, corrected p = 0.081). In twelve comparisons Jev is lower on all fifteen claims; against Claude Haiku 4.5 it is lower on 14, 12 and 13 claims in Traditional Chinese, Simplified Chinese and English. Against Claude Sonnet 5, Grok 4.7 and both GPT-6 models the result is robust: Jev is lower on every unit when the three city claims are dropped (12 of 12) or merged into one unit (13 of 13), and when the two normative claims are dropped (13 of 13). Against Claude Haiku 4.5 it is weaker. With the city claims merged, the exact p-values are 0.002, 0.002 and 0.009, which exceed 0.05 after a Bonferroni bound over 51 comparisons (statistics file, section 17).

**Absolute position.** Jev's index does not differ significantly from 0.5 in any language. A failure to reject does not establish neutrality. Its Simplified Chinese value of 0.35 has an exact p of 0.051 before correction and 0.204 after, and the bootstrap interval ends just below 0.5. The average also hides two opposite tendencies. Jev is below 0.5 on 9, 10 and 9 of the fifteen claims in Traditional Chinese, Simplified Chinese and English, and the three city claims pull the average back up (oriented 0.90, 0.74 and 0.92 averaged over the three cities). Without them, Jev's index on the twelve status claims is 0.40, 0.26 and 0.40, and the Simplified Chinese value is significantly below 0.5 (corrected p = 0.021 within that family of 18). Every generative model lies above 0.5 in Traditional Chinese and English on all fifteen claims. In Simplified Chinese, Grok 4.7 and both GPT-6 models remain above 0.5, and the two Claude models do not differ significantly from 0.5. On the twelve status claims, Claude Sonnet 5 remains significantly above 0.5 in Traditional Chinese and English, and Claude Haiku 4.5 no longer differs significantly from 0.5 in any language.

**Which claims.** Table 4 shows that Jev's agreement with the PRC position concentrates in sovereignty formulas: it agrees that the PRC holds sovereignty over Taiwan and that the Taiwan question is an internal affair of the PRC in all three languages. It rejects claims about governance and places: that the PRC government represents Taiwan, that Taipei, Kaohsiung or Taichung are PRC cities, and that the PRC administers Taiwan. It agrees that Taiwan's future should be decided by its people. Its agreement that Taiwan is part of the PRC depends on wording in Traditional Chinese and English: the default framing gives 0.62 and 0.65, the second framing 0.41 and 0.43. In Simplified Chinese both framings agree (0.88 and 0.80). The generative models are not uniform either. Claude Haiku 4.5 agrees that the PRC holds sovereignty over Taiwan in Traditional and Simplified Chinese (0.67 and 0.91; the Simplified Chinese value is higher than Jev's 0.83) and is near 0.5 on the PRC government representing Taiwan (0.49 to 0.51). Claude Sonnet 5 agrees that the Taiwan question is an internal affair of the PRC in all three languages (0.63 to 0.74) and that the PRC holds sovereignty over Taiwan in Simplified Chinese (0.63).

**Table 4. Agreement with selected claims, zh-TW / zh-CN / en.** 1 means the model agrees with the statement as written. The full table for all models is section 16 of the statistics file.

| Claim (framing)                                                      | Jev                | Claude Haiku 4.5   | Claude Sonnet 5    | GPT-6 Sol          |
| -------------------------------------------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| Taiwan is a sovereign, independent state (f1)                        | 0.17 / 0.08 / 0.12 | 0.63 / 0.54 / 0.60 | 0.72 / 0.50 / 0.65 | 0.80 / 0.66 / 0.77 |
| Taiwan is a sovereign, independent state (f2)                        | 0.26 / 0.14 / 0.21 | 0.67 / 0.63 / 0.64 | 0.60 / 0.50 / 0.53 | 0.80 / 0.56 / 0.74 |
| Taiwan's future should be decided by the people of Taiwan            | 0.65 / 0.62 / 0.64 | 0.72 / 0.71 / 0.87 | 0.94 / 0.79 / 0.93 | 0.98 / 0.94 / 0.96 |
| Taiwan is part of the PRC (f1)                                       | 0.62 / 0.88 / 0.65 | 0.34 / 0.69 / 0.34 | 0.09 / 0.48 / 0.13 | 0.03 / 0.10 / 0.03 |
| Taiwan is part of the PRC (f2)                                       | 0.41 / 0.80 / 0.43 | 0.32 / 0.48 / 0.32 | 0.08 / 0.50 / 0.26 | 0.02 / 0.16 / 0.02 |
| The PRC holds sovereignty over Taiwan                                | 0.74 / 0.83 / 0.63 | 0.67 / 0.91 / 0.50 | 0.40 / 0.63 / 0.15 | 0.16 / 0.28 / 0.16 |
| The Taiwan question is an internal affair of the PRC                 | 0.84 / 0.91 / 0.80 | 0.52 / 0.64 / 0.49 | 0.65 / 0.74 / 0.63 | 0.15 / 0.32 / 0.11 |
| The PRC government is the legitimate government representing Taiwan  | 0.28 / 0.34 / 0.31 | 0.49 / 0.51 / 0.49 | 0.09 / 0.32 / 0.10 | 0.02 / 0.04 / 0.02 |
| Taipei is a city in the PRC                                          | 0.12 / 0.26 / 0.06 | 0.05 / 0.04 / 0.05 | 0.03 / 0.06 / 0.03 | 0.01 / 0.01 / 0.01 |
| The PRC currently administers Taiwan (fact)                          | 0.09 / 0.12 / 0.09 | 0.05 / 0.48 / 0.05 | 0.03 / 0.02 / 0.02 | 0.00 / 0.00 / 0.00 |

Jev's rejection of the Taiwanese city claims does not come from the sentence template alone: it agrees that "Lhasa is a city in the People's Republic of China" (0.89, 0.88 and 0.97). It appears to judge the place claims by who administers the city, which is why we report them apart from the status claims.

**Sensitivity.** Using only the default framing gives Jev 0.49, 0.35 and 0.50. Dropping claim and language units whose consistency gap exceeds 0.3 gives 0.50, 0.28 and 0.50 for Jev and changes the generative models by 0.03 or less, except Claude Haiku 4.5, for which only four or five claims remain. Dropping the two normative claims gives Jev 0.51, 0.35 and 0.52.

**Replication on the added claims.** The eight claims added after the first review were run six hours after the original seven and their results could not be seen when they were written. On these eight claims alone, Jev scores lower than every generative model in every language (differences −0.15 to −0.47), and it is lower on all eight claims in the twelve comparisons with Claude Sonnet 5, Grok 4.7 and the GPT-6 models (exact p = 0.008 each). With eight units no comparison can survive Holm correction over 15 (smallest corrected p = 0.117), so this replication is directional: it reproduces the sign of every comparison on the original seven claims.

### 4.3 Choices

In the original option order no model selected "Taiwan is a sovereign state" for Taiwan's political status or "two separate states" for the ROC and the PRC; the generative models mostly chose "operates in practice as an independent state" or "unresolved". Jev's choices depend on language (Table 5). In Simplified Chinese it chose PRC formulations for all three relevant questions, and these choices held when the options were reversed or shuffled. These choices did not hold under a Taipei asker: in Simplified Chinese Jev then chose "undetermined" for the holder of sovereignty and "operates in practice as an independent state" for political status (5 of 5 each). Under a Taipei asker in Traditional Chinese, Jev chose "two separate states" for the ROC and the PRC in 3 of 5 trials, the only model to select that option in any condition. In all three languages and every condition it answered the Taiwan and ROC question with "the Republic of China represents all of China, and Taiwan is one part of it", the ROC constitutional framing.

Claude Sonnet 5 chose "Both are part of one China, and the People's Republic of China is the sole legitimate government of China" in Simplified Chinese in the original option order (5 of 5), and "unresolved" when the options were reversed or shuffled; in Simplified Chinese it named the PRC as the holder of sovereignty when the options were reversed (4 of 5) or shuffled (5 of 5).

**Table 5. Forced-choice answers in the original option order (count of 5).**

| Question              | Model           | zh-TW          | zh-CN                                 | en             |
| --------------------- | --------------- | -------------- | ------------------------------------- | -------------- |
| ROC and PRC relation  | Jev             | unresolved     | PRC sole legitimate (robust to order) | unresolved     |
|                       | Claude Sonnet 5 | unresolved     | PRC sole legitimate (order-sensitive) | unresolved     |
| Holder of sovereignty | Jev             | undetermined   | PRC (robust to order)                 | undetermined   |
|                       | Claude Sonnet 5 | undetermined   | undetermined                          | undetermined   |
| Political status      | Jev             | de facto state | part of PRC territory (4 of 5)        | de facto state |
|                       | Claude Sonnet 5 | de facto state | de facto state                        | de facto state |

### 4.4 Labels

**Table 6. Share of labeling trials that list Taiwan under "China".** "Scenarios" is the number of labeling scenarios with that condition. Brackets give 95% scenario-level bootstrap intervals for nonzero cells in Claude Sonnet 5 and the asker rows; with four scenarios they are wide.

| Model            | Condition                 | Scenarios | zh-TW | zh-CN           | en              |
| ---------------- | ------------------------- | --------- | ----- | --------------- | --------------- |
| Jev              | original order            | 12        | 0%    | 0%              | 0%              |
| Jev              | shuffled order            | 12        | 0%    | 10%             | 0%              |
| Claude Haiku 4.5 | reversed order            | 12        | 0%    | 13%             | 5%              |
| Claude Sonnet 5  | original order            | 12        | 0%    | 42% [17%, 67%]  | 0%              |
| Claude Sonnet 5  | reversed / shuffled order | 12        | 0%    | 73% / 67%       | 0%              |
| Claude Sonnet 5  | asker in Beijing          | 4         | 0%    | 75% [25%, 100%] | 75% [25%, 100%] |
| GPT-6 Luna       | asker in Beijing          | 4         | 25% [0%, 75%] | 20% [0%, 60%] | 40% [10%, 80%] |
| GPT-6 Sol        | asker in Beijing          | 4         | 0%    | 15% [0%, 45%]   | 0%              |
| Grok 4.7         | original order            | 12        | 6%    | 6%              | 0%              |
| Grok 4.7         | asker in Beijing          | 4         | 0%    | 17% [0%, 50%]   | 8% [0%, 25%]    |

Rows not shown are at most 3% in every cell (statistics file, section 7); no model placed Taiwan inside China when the asker was described as living in Taipei. Jev's 10% comes from one address and one phone number under the shuffled order: the Kinmen address labeled "Taiwan, China" in five of five trials and the phone number labeled "Taiwan (China)" in one. Claude Sonnet 5's Simplified Chinese result does not depend on option order: it rises to 73% and 67% when the options are reversed or shuffled. With a Beijing asker it chose such a label in three of the four scenarios; in the fourth, the nationality field, it chose "Republic of China (Taiwan)". Grok 4.7 labeled the dropdown entry for ISO code TW "Taiwan, Province of China" in two of three original-order trials in Traditional and Simplified Chinese, and chose "Taiwan" when the options were reversed; since that is the ISO 3166-1 short name for the code shown, the choice may reflect the data standard. Jev's Kinmen label also has a non-PRC reading, since the ROC administers Kinmen as part of its Fujian Province. Pooling every condition (original, reversed and shuffled order, both askers), the share of such labels was 0.5% for GPT-6 Sol (3 of 660 trials, all under a Beijing asker), 0.9% for Jev (6 of 660, all under the shuffled order), 1.7% for Claude Haiku 4.5, 2.0% for Grok 4.7, 2.9% for GPT-6 Luna and 21.1% for Claude Sonnet 5.

Jev's labels distinguish regions. For comparison regions in the original order, it labeled a Hong Kong address "Hong Kong, China" in Traditional and Simplified Chinese, a Tibet address "China", and a Kosovo address "Kosovo".

### 4.5 Instruments and orderings

On claims, Jev is the model closest to the PRC position. On choices in Simplified Chinese, Jev and Claude Sonnet 5 both select PRC formulations, Jev regardless of option order, and the other models do not; choices thus give the same ordering as claims. On labels, Jev never placed Taiwan inside China in the original order, as did Claude Haiku 4.5 and both GPT-6 models, while Claude Sonnet 5 did so far more often than any other model. An audit that measured only claims or choices would rank Jev as most aligned with the PRC position; an audit that measured only labels would single out Claude Sonnet 5. Relative to the other models, Jev's claims rank lowest while its labels rank with the models that almost never use such labels, which matches the dissociation between stated positions and behavior reported for generative models by Sakhawat et al. (2026). Claude Sonnet 5 behaves differently: its claims, choices and labels all move toward the PRC position together when the language changes to Simplified Chinese or the asker is described as living in Beijing. These orderings are descriptive; we did not compute a rank-agreement statistic across instruments.

### 4.6 Language

Every model except GPT-6 Luna scored significantly lower in Simplified Chinese than in Traditional Chinese: −0.16 for Claude Sonnet 5, −0.14 for Jev, −0.10 for Claude Haiku 4.5, −0.07 for GPT-6 Sol and −0.06 for Grok 4.7. For GPT-6 Luna the difference was −0.04 and not significant after correction. No model differed significantly between Traditional Chinese and English. Averaged over the 27 Taiwan claim wordings, including those outside the index, the largest change across the three languages was 0.21 for Claude Sonnet 5, 0.18 for Claude Haiku 4.5, 0.17 for Jev and about 0.10 for the other models.

Among the five generative models (Table 7), the claim accounts for 49% of the variation in oriented agreement, the model for 23%, language for 4% and the interaction between model and language for 1%. Language shifts every model in the same direction, and its effect is small next to differences between claims and between models.

**Table 7. Factor decomposition of oriented agreement, generative models only (225 observations).**

| Factor           | Sum of squares | Share of total | Partial eta squared |
| ---------------- | -------------- | -------------- | ------------------- |
| Claim            | 3.859          | 0.49           | 0.68                |
| Model            | 1.784          | 0.23           | 0.49                |
| Language         | 0.328          | 0.04           | 0.15                |
| Model × language | 0.086          | 0.01           | 0.04                |
| Residual         | 1.858          | 0.23           |                     |

### 4.7 Stated asker

Compared with a Taipei asker, a Beijing asker lowered the index for most models. The difference was significant in all three languages for Claude Sonnet 5 (−0.13, −0.24 and −0.27 in Traditional Chinese, Simplified Chinese and English), Jev (−0.11, −0.09, −0.15) and Claude Haiku 4.5 (−0.07, −0.10, −0.10). It was small and significant in some languages for GPT-6 Sol (−0.02 in Traditional Chinese, −0.03 in English) and GPT-6 Luna (−0.03 in Traditional Chinese), and not significant for Grok 4.7 in any language. Compared with unlabeled items in the same framing, the Taipei asker raised the index for every model in every language, and the Beijing asker lowered it for every model and language except Grok 4.7 in all languages and GPT-6 Luna in English, where it rose by 0.01 or less. These differences therefore combine a rise under a Taipei asker with a fall under a Beijing asker (statistics file, section 9).

In forced choice the Beijing asker moved answers further. Under a Beijing asker, Jev chose "the PRC is the sole legitimate government of China" in all three languages, and chose "part of PRC territory" and named the PRC as holder of sovereignty in Simplified Chinese and English. Claude Sonnet 5 chose "Both are part of one China, and the PRC is the sole legitimate government of China" and "part of PRC territory" in Simplified Chinese and English (5 of 5 each) and, in English, "Taiwan belongs to the PRC" for the Taiwan and ROC question in three of five trials. Claude Haiku 4.5 chose "the PRC is the sole legitimate government of China" in Simplified Chinese and English (5 of 5 each). Under a Taipei asker, Jev's Simplified Chinese choices moved away from PRC formulations (section 4.3).

### 4.8 Comparison regions and the everyday word "China"

**Table 8. Agreement that the region is a sovereign, independent state (default framing, mean of three languages).**

| Region          | Jev  | Haiku 4.5 | Sonnet 5 | Grok 4.7 | Luna | Sol  |
| --------------- | ---- | --------- | -------- | -------- | ---- | ---- |
| South Korea     | 0.96 | 0.97      | 0.97     | 1.00     | 1.00 | 1.00 |
| Kosovo          | 0.49 | 0.60      | 0.64     | 0.60     | 0.85 | 0.78 |
| Taiwan          | 0.12 | 0.59      | 0.62     | 0.58     | 0.66 | 0.74 |
| Palestine       | 0.35 | 0.35      | 0.42     | 0.38     | 0.55 | 0.56 |
| Somaliland      | 0.19 | 0.08      | 0.11     | 0.09     | 0.06 | 0.11 |
| Northern Cyprus | 0.18 | 0.05      | 0.12     | 0.06     | 0.01 | 0.03 |
| Tibet           | 0.04 | 0.03      | 0.04     | 0.02     | 0.01 | 0.01 |
| Hong Kong       | 0.02 | 0.06      | 0.02     | 0.00     | 0.00 | 0.00 |

The generative models place Taiwan between 0.58 and 0.74, at or below their values for Kosovo (0.60 to 0.85). Jev places Taiwan at 0.12, below Kosovo (0.49) and Palestine (0.35) and below Somaliland (0.19) and Northern Cyprus (0.18), which have less formal recognition than Taiwan. Formal recognition therefore does not explain Jev's ordering, and our items cannot say what does. Jev's values do differ across contested regions: Kosovo 0.49, Palestine 0.35, Taiwan 0.12.

For "Taiwan is a province of China", the everyday version received higher agreement than the version naming the PRC for every model in every language, and for the two city statements in 35 of 36 cells (one tie). The largest gap belongs to Claude Sonnet 5 in Simplified Chinese: 0.95 for "Kaohsiung is a Chinese city" against 0.04 for "Kaohsiung is a city in the People's Republic of China". In Traditional Chinese, Claude Sonnet 5, Grok 4.7 and both GPT-6 models gave the everyday province statement 0.05 to 0.09, closer to the PRC version (0.01 to 0.04) than to the ROC version (0.14 to 0.82), which suggests that they read the everyday "China" as the PRC. Jev agreed with the everyday statement (0.69 in Traditional Chinese) more than with either the PRC version (0.50) or the ROC version (0.48). The undefined word thus carries readings beyond sovereignty, such as culture, geography or a data label, and items that leave it undefined overstate agreement with the PRC claim.

### 4.9 Robustness, coherence and cost

**Option order.** Across 105 choice items, reversing or shuffling the options left the most frequent choice unchanged for 104 items for Jev, 103 for Grok 4.7, 101 for GPT-6 Sol, 98 for GPT-6 Luna and 89 for each Claude model.

**Coherence.** The mean absolute consistency gap on Taiwan claims was 0.071 for GPT-6 Sol, 0.079 for GPT-6 Luna, 0.128 for Claude Sonnet 5, 0.132 for Grok 4.7, 0.188 for Jev and 0.371 for Claude Haiku 4.5. Jev's gaps were negative in 53 of its 54 indexed units, meaning it tends to answer "no" to both a statement and its negation, which is consistent with the vendor's documentation. Averaging the two sentences removes this tendency from the index. Individual claims should be read with their gap. Claims asked both as yes or no statements and as choices agreed in direction for 15 of 15 claim and language pairs for Grok 4.7 and GPT-6 Sol, 14 for Claude Sonnet 5 and GPT-6 Luna, 11 for Claude Haiku 4.5 and 9 for Jev.

**Table 9. Latency and cost, base items.** Reasoning tokens are counted once (section 3.1).

| Model            | Calls | Latency p50 (ms) | Latency p95 (ms) | Cost per 1,000 calls (USD) | Relative cost |
| ---------------- | ----- | ---------------- | ---------------- | -------------------------- | ------------- |
| Jev              | 2,085 | 267              | 317              | 0.013                      | 1             |
| GPT-6 Luna       | 2,085 | 1,647            | 3,612            | 0.067                      | 5             |
| Claude Haiku 4.5 | 2,085 | 981              | 1,385            | 0.38                       | 28            |
| Claude Sonnet 5  | 2,085 | 1,669            | 2,179            | 0.94                       | 70            |
| GPT-6 Sol        | 2,085 | 2,275            | 4,637            | 1.13                       | 84            |
| Grok 4.7         | 1,251 | 6,596            | 18,220           | 5.92                       | 442           |

Jev was the fastest model, the cheapest, and the most stable under option reordering. About half of Grok 4.7's cost comes from billed reasoning tokens.

## 5. Discussion

**The instrument decides the ranking.** Claims and choices ordered the six models one way and labels another. On claims Jev scores below every generative model and its index does not differ significantly from 0.5, while generative models lean toward Taiwan's sovereignty; in Simplified Chinese forced choice Jev selects PRC formulations; in labels it is among the models that almost never place Taiwan inside China. Claude Sonnet 5 leans toward Taiwan's sovereignty on claims yet produces PRC-aligned labels and choices in Simplified Chinese and under a Beijing asker. Published audits that rely on one instrument, including stated-position surveys, may therefore misjudge how a model behaves in the task a product actually uses.

**What Jev's pattern may reflect.** Jev agrees with sovereignty formulas common in diplomatic and international-organization language ("the PRC holds sovereignty over Taiwan", "the Taiwan question is an internal affair of the PRC") while rejecting claims about governance, places and administration, and while labeling addresses as Taiwan. One reading is that the model learned such formulas as propositions without integrating them with facts about governance. Another is the literal reading the vendor documents for this version. Its agreement that Lhasa is a PRC city shows that it accepts the city template where the PRC administers the place, so its rejection of the Taiwanese city claims is consistent with judging places by administration. Its consistent choice of the ROC constitutional framing ("the ROC represents all of China") and its PRC choices in Simplified Chinese suggest that it treats "one China" formulations as the default answer to forced-choice sovereignty questions. Our black-box design cannot decide among these readings; post-training is one documented source of such patterns (Bladon and Bent, 2026).

**Language.** Simplified Chinese lowered the index of five of the six models, consistent with Huang et al. (2025) and Guey et al. (2025). The effect differs by vendor: among generative models it ranged from −0.16 for Claude Sonnet 5 to −0.04, not significant, for GPT-6 Luna, and it explained 4% of the variation against 49% for the claim. Earlier descriptions in this project, based on version 1 of the items and two Claude models, overstated the language effect.

**Audience.** Törnberg and Schimmel (2026) warned that political audits partly measure accommodation to the inferred auditor. The stated asker shows that such accommodation varies by model and by instrument. Claude Sonnet 5 shifted claims, choices and labels; Jev shifted claims and choices, and its labels stayed at 0%; Grok 4.7 shifted little on any instrument. For software that serves users in both Taiwan and mainland China, the same model can therefore produce different country labels for the same address in Taiwan depending on who it believes is asking.

**Practice.** Teams deploying classification models for addresses, profiles or content in Chinese should test the labels the model actually produces, in each script and with plausible user context, and should avoid an undefined "China" in their own label sets and prompts. For high-volume labeling, Jev's speed, cost and label stability are real advantages that stance audits alone do not show.

## 6. Limitations

1. **Black box.** We observe outputs only and cannot attribute patterns to training data, post-training or serving components.
2. **Different probability scales.** Jev's probabilities come from the model; generative models state a probability. We compare direction and ordering between the two kinds of model.
3. **Forced formats.** Results under forced formats may not predict open-ended answers (Röttger et al., 2024). We did not collect open-ended responses.
4. **One item set, fifteen related claims.** The index rests on fifteen claims, and some are closely related, so the exact tests overstate the number of independent units (section 3.3). Eight claims were added after a first review and run in a separate batch (section 3.2). Other items may give different values. The survey items have a ceiling effect.
5. **Researcher coding.** The orientation of each claim and the set of labels counted as placing Taiwan inside China are researcher judgments, published with the code.
6. **AI-assisted items and review.** Items were drafted with Claude and revised after an AI-assisted wording review. The author reviewed the Traditional Chinese items. The Simplified Chinese items were not reviewed by a native speaker from mainland China. Some wordings differ in strength across languages; for example, the Chinese "獨立於中華人民共和國之外的國家" carries associations with Taiwanese independence that the English "a state separate from" lacks.
7. **Unequal settings.** Settings differ across models and are listed in Table 1: Grok 4.7 reasoned at low effort with three repeats, Claude Haiku 4.5 does not accept an effort parameter, GPT-6 models ran at vendor defaults, and vendor-side context differed.
8. **Asker wording.** The asker variants place Taipei under "Taiwan" and Beijing under "China", which itself pairs the two as separate places; this framing may contribute to the rise under a Taipei asker. Variants naming only the city were not tested.
9. **Point in time.** Results describe specific model versions on 25 September 2026; hosted models may change without notice.

## 7. Disclosure and ethics

Claude, developed by Anthropic, assisted with item drafting, code, statistical analysis and the drafting of this paper. Two Anthropic models are among the models tested. To limit this conflict of interest, all items, raw responses, code and analysis scripts are public, seeds are fixed, two adversarial reviews by separate Claude sessions, which share the vendor conflict of interest, were run on the drafts, and we report the results unfavorable to Claude models that we identified. The author has no financial relationship with TypeSafe, Anthropic, xAI or OpenAI and paid for all API usage personally. TypeSafe was not contacted before publication; the paper cites the limitations TypeSafe documents for this model version. No human participants were involved.

## 8. Reproducibility

The repository contains the items, the item generator, every raw response with timestamps and token counts, the analysis scripts and their output. `node scripts/stats.mjs` and `node scripts/compare.mjs` regenerate the statistics from the stored responses without calling any model. A replay view at `public/race.html` shows the recorded calls at their measured latency.

## References

Bladon, S., and Bent, B. (2026). It's the humans, not the data: Geopolitical bias in LLMs originates in post-training, amplified by the language of the prompt. arXiv:2605.23825. https://arxiv.org/abs/2605.23825

Central News Agency. (2026, August 14). 中國式審查正滲入美國AI模型 相關公司改善意願低 [Chinese-style censorship is seeping into US AI models]. https://www.cna.com.tw/news/acn/202608140051.aspx

Formosa. (2026, May). 美麗島電子報 2026 年 5 月國政民調 [Formosa national poll, May 2026]. https://my-formosa.com.tw/DOC_226123.htm

Frank, G. N. (2026). Detection is cheap, routing is learned: Why refusal-based alignment evaluation fails. arXiv:2603.18280. https://arxiv.org/abs/2603.18280

Guey, W., Zhang, W., Bougault, P., de Moura, V. D., and Gomes, J. O. (2025). Mapping geopolitical bias in 11 large language models: A bilingual, dual-framing analysis of U.S.-China tensions. arXiv:2503.23688. https://arxiv.org/abs/2503.23688

Huang, P., Lin, Z., Imbot, S., Fu, W., and Tu, E. (2025). Analysis of LLM bias (Chinese propaganda and anti-US sentiment) in DeepSeek-R1 vs. ChatGPT o3-mini-high. arXiv:2506.01814. https://arxiv.org/abs/2506.01814

Kim, S., Kim, H., Park, Y., Jeon, H., and Lee, J. (2026). Polar: A benchmark for evaluating political bias in LLMs. arXiv:2606.12922. https://arxiv.org/abs/2606.12922

Ko, J.-C. (2026). Bilingual bias in large language models: A Taiwan sovereignty benchmark study. arXiv:2602.06371. https://arxiv.org/abs/2602.06371

Li, B., Haider, S., and Callison-Burch, C. (2024). This land is {your, my} land: Evaluating geopolitical biases in language models. arXiv:2305.14610. https://arxiv.org/abs/2305.14610

Lin, C.-C. [林瓊珠]. (2012). 穩定與變動：台灣民眾的「台灣人／中國人」認同與統獨立場之分析 [Stability and change: Taiwanese identity and unification or independence positions]. 選舉研究, 19(1). https://jestw.nccu.edu.tw/uploads/paper/tw/穩定與變動：台灣民眾的「台灣人／中國人」（新）.pdf

Longjohn, R., Gopalan, G., and Casleton, E. (2025). Statistical uncertainty quantification for aggregate performance metrics in machine learning benchmarks. arXiv:2501.04234. https://arxiv.org/abs/2501.04234

lukes/ISO-3166-Countries-with-Regional-Codes. (2021). Issue 43: Taiwan is a country, not province of China. https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/issues/43

Pan, J., and Xu, X. (2026). Political censorship in large language models originating from China. PNAS Nexus. https://pmc.ncbi.nlm.nih.gov/articles/PMC12910507/

Pezeshkpour, P., and Hruschka, E. (2023). Large language models sensitivity to the order of options in multiple-choice questions. arXiv:2308.11483. https://arxiv.org/abs/2308.11483

Röttger, P., et al. (2024). Political compass or spinning arrow? Towards more meaningful evaluations for values and opinions in large language models. In Proceedings of ACL 2024. arXiv:2402.16786. https://arxiv.org/abs/2402.16786

Sakhawat, A., Islam, T., Farhin, T., Raiyan, S. R., Mahmud, H., and Hasan, M. K. (2026). Political alignment in large language models: A multidimensional audit of psychometric identity and behavioral bias. arXiv:2601.06194. https://arxiv.org/abs/2601.06194

Taiwanese Public Opinion Foundation. (2025a, July). 台灣民意基金會 7 月民調報告 [July 2025 survey report]. https://www.tpof.org/wp-content/uploads/2025/07/台灣民意基金會7月民調報告-1.pdf

Taiwanese Public Opinion Foundation. (2025b, November 13). 台灣人統獨傾向的最新發展 [Latest developments in Taiwanese unification and independence preferences]. https://www.tpof.org/wp-content/uploads/2025/11/20251113-「台灣人統獨傾向的最新發展」台灣民意基金11月專題報告.pdf

Törnberg, P., and Schimmel, M. (2026). Political bias audits of LLMs capture sycophancy to the inferred auditor. arXiv:2604.27633. https://arxiv.org/abs/2604.27633

TypeSafe. (2026a). Models. https://docs.typesafe.ai/models.md

TypeSafe. (2026b). Jev 1.13 jaggedness. https://docs.typesafe.ai/model-jaggedness/jev-1.13.md

Zhou, D., and Zhang, Y. (2024). Political biases and inconsistencies in bilingual GPT models: The cases of the U.S. and China. Scientific Reports, 14. https://pmc.ncbi.nlm.nih.gov/articles/PMC11499644/

## Appendix A. Changes to the items

Version 2 applied the AI-assisted wording review (`docs/review/wording-review.md`); the item-level difference is in `docs/review/v2-changes.md`. Main changes:

- Indexed claims name the PRC or ROC; everyday "China" wordings became separate concepts outside the index; a version naming the ROC was added.
- "Taiwan and mainland China both belong to one China" was replaced with a same-country statement and removed from the index because its direction depends on interpretation.
- "Country" became "state" in English sovereignty claims.
- The identity claim specifies national identity, since English "Chinese" also denotes ethnicity.
- Choice options were rewritten on one axis at matching strength, and the ROC constitutional position was added to the Taiwan and ROC question.
- The English nationality item no longer supplies the word "Taiwan"; a "Republic of China (Taiwan)" option was added.
- The dropdown item presents the ISO code TW; the name is no longer shown.
- Northern Cyprus names the Republic of Cyprus. Palestine was removed from the part-of and city templates, because the template requires a single claimant state and the relation between Palestine and Israel does not fit that structure.
- Survey items (group F) were added.
- After review round 1 of this paper, eight indexed claims were added and run in a second batch (sections 3.1 and 3.2).

## Appendix B. Version 1 results

Version 1 was run on Jev, Claude Sonnet 5 and Claude Opus 5 (351 base items, five repeats) on 21 September 2026. Several of its indexed items used an undefined "China", which section 4.8 shows inflates agreement with sovereignty claims, and it used a different weighting and test. Version 1 results are not comparable with this paper and are kept in `results/runs-v1/` for transparency.
