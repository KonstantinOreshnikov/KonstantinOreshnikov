# Credit Risk Analytics

[← Case study](README.md)

The workspace covers analytical methods used to ask better questions about credit portfolios and application flows. **Methods below are not claims about observed results at any institution.** Definitions require an agreed population, observation point and risk classification before they become reportable KPIs.

## Where the work concentrates

| Analytical question | Approach represented in the workspace | Status in this public case |
|---|---|---|
| How is portfolio quality changing? | Snapshot selection, balance/count measures, product segmentation and denominator control | **DOCUMENTED METHOD** |
| Which observations are delinquent? | Explicit ageing/status definitions and scope alignment | **DOCUMENTED METHOD**; no proprietary thresholds |
| Where does the application flow lose cases? | Stage-level populations, unique cases, conversions and period alignment | **DOCUMENTED METHOD / SYNTHETIC DEMO** |
| Do cohorts evolve differently? | Fixed origination cohorts, observation age and maturity-aware comparison | **ANALYTICAL DESIGN** |
| Are accounts changing risk state? | Same-entity period-to-period pairing and transition matrices | **ILLUSTRATIVE EXTENSION** |
| Are exposures concentrated? | Segment shares and concentration views | **ILLUSTRATIVE EXTENSION** |
| Which cases merit earlier attention? | Candidate early-warning signals with separate evidence and governance | **DESIGN ONLY** |

Only the first three rows have substantive documented project-methodology coverage. The remaining topics are included as **explicitly illustrative extensions** and not described as delivered analytics.

## 1. Portfolio-quality measurement

A portfolio trend needs a coherent contract: which accounts are eligible, what defines the observation date, whether a measure is a **count** or an **exposure**, and what gets excluded. A percentage based on all eligible accounts cannot be compared to one based only on matured accounts.

A generic exposure share is:

$$
\text{Risk-status exposure share} =
\frac{\sum \text{Eligible exposure in selected status}}
{\sum \text{All eligible exposure}}
$$

The public example deliberately omits any institution-specific status mapping or internal definition of non-performing exposure.

## 2. Delinquency is not one universal metric

DPD-based counts, exposure in an arrears bucket, NPL classification, and payment-event delinquency are different measurement problems. Thresholds, balance bases and eligibility criteria vary by an approved methodology. **Do not infer an NPL value from an arbitrary DPD label**, or silently change a strict boundary into an inclusive one.

A useful report shows its eligibility rule and denominator alongside its measure, not just a familiar KPI acronym.

## 3. Funnel and conversion

At a fixed one-case grain, a generic conversion is:

$$
\text{Completion rate} =
\frac{\text{Eligible unique cases completed}}
{\text{Eligible unique cases entering the process}}
$$

For a multistage funnel, **cumulative reached-stage counts** should normally decline or remain unchanged as stages progress. A terminal-stage distribution is a different visualization. Review source duplicates, stage order and alternative paths before declaring an increase an error.

A selected segment must exist for the entire denominator. Segmenting rejected cases by a field populated **only after approval**, for example, can produce a biased rate.

## 4. Cohorts and migration: distinguish the questions

**Vintage / cohort analysis (illustrative):** group cases by a common starting month and compare outcomes at the same age. Exclude immature observations or flag them explicitly.

**Roll rate / migration (illustrative):** join the **same unique entity** at two observation points and classify its state transition. A comparison of two different status sources *within one month* is a discrepancy matrix, **not** a month-to-month migration.

## 5. From measure to action

| Display | What a reviewer should ask |
|---|---|
| Overall trend | Is the movement material after controlling for changing population? |
| Segment drill-down | Is concentration driven by volume, mix or within-segment movement? |
| Cohort comparison | Are cohorts compared at the same maturity? |
| Exception panel | Were nulls, duplicates or unclassified records retained for investigation? |
| Management commentary | Is the statement a fact, an interpretation or an untested hypothesis? |

The aim is not to maximize the number of charts. It is to reduce the risk of taking action on a technically plausible but methodologically inconsistent figure.

Related methodology: [Metric contracts](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/docs/metric-contracts.md) and [Portfolio analysis contracts](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/docs/portfolio-analysis-contracts.md).

---

**RU · Кратко:** рассмотрены правила корректного анализа качества портфеля и воронки. Когорты, миграции, концентрации и ранние индикаторы явно отмечены как иллюстративные направления, а не внедрённые отчёты.
