# Risk Reporting & SQL Workspace
### A privacy-safe case study in analytical engineering and risk reporting

**Domain:** portfolio analytics, SQL engineering, data quality, and management information  
**Portfolio status:** documented methods and published synthetic examples; the end-to-end management dashboard remains a **design**, not a verified production deployment.  
**Disclosure:** documentation only. No employer assets, real portfolios, private SQL, customer records, proprietary thresholds, or operational infrastructure.

## The problem

Analytical reporting becomes difficult to trust when similar KPIs are calculated from different populations, joins multiply records, observation dates drift, or exceptions disappear between the extract and the final chart. A dashboard can look consistent while its denominator is wrong.

Risk Reporting & SQL Workspace addresses this class of problems through a controlled working method: define the decision and metric contract, inspect source grain, develop or reuse SQL, reconcile the output, and only then prepare management commentary. The project combines technical guidance, reusable quality gates, and an evolving reporting design.

## What exists — and what does not

| Area | Evidence-based status | Public evidence |
|---|---|---|
| Analytical methodology | **DOCUMENTED** — metric contracts, population control, reconciliation and reporting rules | [Risk Analytics Playbook](https://github.com/KonstantinOreshnikov/risk-analytics-playbook) |
| SQL patterns | **PUBLISHED EXAMPLES** — independently authored synthetic Oracle and ClickHouse scripts | [SQL Patterns for Risk Analytics](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics) |
| Technical governance | **VERSIONED** — private rule registry, review workflow and quality-gate definitions | Described here; private implementation is not disclosed |
| Reporting design | **DOCUMENTED** — audience, KPI, filter, exception and commentary principles | [Reporting and dashboards](reporting-and-dashboards.md) |
| Credit Risk Management Dashboard | **DESIGN** — conceptual end-to-end dashboard architecture and acceptance criteria | [Reporting and dashboards](reporting-and-dashboards.md) |
| Production analytics, automated refresh and browser E2E | **NOT CLAIMED** — no public-safe execution evidence is offered | Not presented as completed work |

These are distinct evidence levels. A documented metric rule is not a certified live calculation; a synthetic test is not production reconciliation.

## How the pieces fit

~~~mermaid
flowchart LR
  A["Decision / reporting need"] --> B["Metric contract"]
  B --> C["Source and grain checks"]
  C --> D["SQL transformation"]
  D --> E["Reconciliation and QA"]
  E --> F["Management report"]
  F --> G["Decision or investigation"]
  E --> H["Versioned evidence"]
  H --> B
~~~

This is the **working method**, not a physical deployment diagram.

## Case-study chapters

| Chapter | Focus |
|---|---|
| [Architecture and data flow](architecture.md) | Reference pipeline, layers, provenance and change control |
| [Credit risk analytics](credit-risk-analytics.md) | Portfolio-quality and funnel concepts with explicit evidence boundaries |
| [SQL engineering](sql-engineering.md) | Oracle / ClickHouse, join cardinality, periods and safe aggregation |
| [Data quality and reconciliation](data-quality.md) | Reproducible controls and synthetic QA examples |
| [Reporting and dashboards](reporting-and-dashboards.md) | Executive information design and dashboard acceptance model |
| [Engineering workflow and QA](engineering-and-qa.md) | Reuse First, version control, Unlazy QA and editorial review |

## Tools and practices

Oracle SQL, ClickHouse, DBeaver, Excel, GitHub, Markdown and Mermaid appear across the documented workflow or its published demonstrations. The broader working process also uses controlled document storage and versioned decision records. Tool mentions identify **working methods**, not claims that a particular enterprise integration is deployed.

## What this project demonstrates

- Translating reporting questions into inspectable metric definitions.
- Defending one-row-per-entity assumptions and preventing silent join multiplication.
- Separating data-quality exceptions from the reporting population.
- Reconciling before interpretation; keeping statements of causality evidence-based.
- Preserving approved logic while making changes reviewable and repeatable.
- Publishing educational examples without revealing private operating context.

## Explore the related public repositories

- [Risk Analytics Playbook](https://github.com/KonstantinOreshnikov/risk-analytics-playbook): reusable methodology, definitions and review checklists.
- [SQL Patterns for Risk Analytics](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics): runnable **synthetic** patterns and a training-schema validation pack.

**Scope note:** neither repository is the source code of a private analytics system. They are separately authored, generic learning artifacts.

---

**RU · Краткое резюме:** инженерный подход к риск-аналитике и управленческой отчётности: контракт метрики, контроль grain и denominator, безопасные SQL-преобразования, reconciliation, Data Quality и проверяемые выводы. Публичные SQL и примеры полностью синтетические. Dashboard показан как проектная концепция; реализация в production не заявляется.
