# Architecture and Data Flow

[← Case study](README.md)

This page presents a **generalized reference architecture** derived from the project's documented methods. It does **not** expose or assert a particular company's physical database topology, deployed ETL, access model or production lineage.

## 1. Reference analytical pipeline

~~~mermaid
flowchart LR
  S["Generic data sources"] --> V["Source validation"]
  V --> T["SQL preparation"]
  T --> M["Metric calculations"]
  M --> R["Reconciliation"]
  R --> O["Reporting outputs"]
  O --> D["Management dashboard (DESIGN)"]
  R --> Q["QA findings / exceptions"]
  Q --> V
~~~

The control points are intentional: checks run both **before** transformation (source eligibility and grain) and **after** aggregation (metric integrity and independent totals).

## 2. Logical layers — reference model, not an installed stack

~~~mermaid
flowchart TB
  A["Source extracts (illustrative)"] --> B["RAW / source-aligned view"]
  B --> C{"Completeness, keys, dates"}
  C -->|Qualified| E["PREPARED / normalized entities"]
  C -->|Exceptions| X["Exception register"]
  E --> F["Metric contract / transformations"]
  F --> G["REPORTING / additive measures"]
  G --> H{"Reconcile with control totals"}
  H -->|Accepted| I["Tables, trends and commentary"]
  H -->|Investigate| X
  X --> J["Triage and correction"]
  J --> C
~~~

**RAW**, **PREPARED** and **REPORTING** are useful *logical separations*. Their appearance in this diagram does not mean three physical schemas, tables or services were created.

| Logical part | Responsibility | Key invariant |
|---|---|---|
| Source-aligned view | Retain source identity, dates, load context and raw status | Do not conceal the upstream population |
| Prepared entities | Normalize types, align periods, resolve legitimate multiplicity | One row per declared business key |
| Metric layer | Apply approved numerator, denominator and maturity rules | Additive inputs before ratios |
| Reporting output | Present reconciled values with scope, labels and caveats | Report totals agree with accepted controls |
| Evidence / exception track | Record tests, conflicts, exclusions and version | Every material discrepancy remains traceable |

## 3. The workspace is more than a diagram

~~~mermaid
flowchart LR
  A["Business question"] --> B["Approved metric definition"]
  B --> C["Reusable SQL / analysis"]
  C --> D["QA and reconciliation"]
  D --> E["Reviewed output"]
  F["Versioned documentation"] -.-> B
  F -.-> C
  G["Decision and exception log"] -.-> D
  D -.-> G
  E --> H["Feedback / next change"]
  H --> B
~~~

The documented workspace keeps technical rules version-controlled, assigns separate roles to operational notes and working evidence, and protects approved baselines. This is a **governance approach**; it is not an advertised automated synchronization service.

## 4. Provenance and refresh controls

A reproducible run should identify the source/version, observation period, entity grain, eligible population, exclusions, transformation revision, refresh timestamp, exception count and reconciliation reference. A rerun against revised source data is a **new reporting observation**, not an invisible replacement of an old number.

For periodic reporting, a control should distinguish a **missing snapshot** from a genuinely zero balance or count. For joined events, join cardinality must be tested before measuring trends.

## 5. Automation boundary

The supported design is to automate **repeatable, verified steps**: parameterized source selection, quality tests, reconciliation, report refresh and exception reporting. Scheduling, production access, unattended execution and SLA compliance are **not evidenced by this public case**.

## Engineering decisions

1. Protect the input population before tuning query performance.
2. Describe grain and time logic alongside every material measure.
3. Keep exceptions available to QA, even when an agreed management view excludes them.
4. Separate calculation from visualization and commentary.
5. Promote a change only after evidence supports its acceptance gates.

See [SQL engineering](sql-engineering.md), [data quality](data-quality.md), and the public [controlled reporting workflow](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/docs/reporting-workflow.md).

---

**RU · Кратко:** показана обезличенная логическая архитектура от источника до management reporting. Разделение RAW / PREPARED / REPORTING — концептуальная модель, а не подтверждённая физическая схема базы.
