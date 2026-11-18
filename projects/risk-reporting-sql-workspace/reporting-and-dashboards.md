# Reporting and Dashboard Design

[← Case study](README.md)

A report should make a decision easier **without concealing how its numbers were produced**. The workspace documents a management-reporting method and a conceptual end-to-end dashboard. **No live dashboard deployment, automatic refresh or production integration is claimed here.**

## Status ledger

| Component | Status | What is available |
|---|---|---|
| KPI definition and reporting controls | **DOCUMENTED** | Source/grain/period/eligibility contract, additive measures and QA rules |
| Executive commentary method | **DOCUMENTED** | Fact → materiality → supported interpretation → action |
| Interactive filter and visualization principles | **DOCUMENTED DESIGN GUIDANCE** | Filter propagation, denominators, small-base warnings, reset/no-data behavior |
| Integrated credit-risk dashboard | **DESIGN** | Layered conceptual modules and acceptance gates |
| Operational refresh, access controls, browser E2E | **NOT VERIFIED** | No public-safe execution evidence |

## 1. Executive information hierarchy

~~~mermaid
flowchart TD
  A["Executive summary: validated changes"] --> B["Portfolio and process trends"]
  B --> C["Segment / cohort drill-down"]
  C --> D["Drivers and anomaly review"]
  D --> E["QA exceptions and methodology"]
  E --> F["Management action / owner / next review"]
~~~

This represents the **information hierarchy**, not implemented UI screens.

## 2. Proposed dashboard modules

| Section | Decision support | Required safeguards |
|---|---|---|
| Executive Summary | What changed and which movement deserves attention? | Period, scope, prior comparison and minimum-volume warning |
| Portfolio Quality | Which portfolio components explain the observed movement? | Consistent eligible population and exposure/count distinction |
| Process Funnel | At which stage are cases lost? | Unique case grain and cumulative reached-stage rules |
| Cohort View | Are cohorts comparable at the same maturity? | Explicit cohort age and incomplete observation flag |
| Segmentation | Is a change concentrated or broad-based? | Valid dimension for the full denominator |
| Data Quality | Can the report be trusted? | Exceptions, source coverage and reconciliation state |
| Management Actions | What requires review, escalation or a decision? | Named issue, evidence, uncertainty and follow-up condition |

Cohort View and several advanced analytics are **design modules**, not certified delivered calculations.

## 3. A synthetic management finding

The following numbers and segment names are **invented solely to illustrate wording**:

> The synthetic completion rate increased from **62% to 66%** between two fictional periods (**+4 percentage points**). The increase is visible in Segment A, while Segment B is broadly unchanged. The breakdown suggests a concentration of the movement, but it does not establish causality. Review case mix and source coverage before changing the process.

The interpretation is deliberately narrower than the observation. An unexplained movement should not become an asserted driver merely because a chart makes it plausible.

## 4. Filter and visual contract

Every filter must change **all dependent values** — KPI cards, trends, subtotals, heatmaps, export and commentary. A percentage is recalculated from the newly filtered additive numerator and denominator, not averaged from displayed percentages.

Small samples remain visible but are clearly labelled; they should not automatically top a best/worst ranking. Missing periods are distinguished from zero-valued periods. A reset operation returns to a documented default scope, while the no-data state explains which filters produced no eligible records.

## 5. Acceptance model — not a test result

| Gate | Acceptance question |
|---|---|
| Source | Does the selected period match the provided source extract? |
| Metrics | Are numerator and denominator eligible under the same filters? |
| Reconciliation | Do additive details match totals and the control reference? |
| Filters | Do dependent visuals and commentary recompute together? |
| Edge cases | Are zero denominators, missing periods and tiny bases handled? |
| Executive reading | Does commentary separate fact, hypothesis and action? |
| Interactive E2E | If a browser implementation exists, have representative synthetic journeys been executed? |

Until executed evidence exists for a particular report, these gates are **criteria**, not `PASS` results.

Related guidance: [Management commentary](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/docs/management-commentary.md) and [Engineering / QA](engineering-and-qa.md).

---

**RU · Кратко:** management dashboard представлен как концепция с прозрачными KPI, динамическими фильтрами, QA-панелью и управленческими выводами. Наличие дизайн-спецификации не выдаётся за готовую production-систему.
