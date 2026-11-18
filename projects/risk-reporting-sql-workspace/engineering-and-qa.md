# Engineering Workflow and Evidence-led QA

[← Case study](README.md)

The engineering objective is repeatable, inspectable change — not a large pile of scripts whose lineage is difficult to reconstruct. The private working registry documents technical operating rules; public artifacts demonstrate selected **generic** practices without exposing the original working material.

## 1. Delivery lifecycle

~~~mermaid
flowchart LR
  A["Request and approved baseline"] --> B["Reuse-first inspection"]
  B --> C["Minimal scoped change"]
  C --> D["Static and data QA"]
  D --> E{"Required gates passed?"}
  E -->|No| F["Record issue / correct delta"]
  F --> D
  E -->|Yes| G["Review and version"]
  G --> H["Readback / checkpoint"]
~~~

A reviewable change does not automatically imply a deployed or production-tested change.

## 2. Reuse First

Before creating a query, report or framework, look for a **compatible, verified** pattern. Check source assumptions, column types, grain, date windows, population, exclusions and calculation semantics. Reuse unchanged when safe; otherwise apply a minimal patch. A similarly named file or a newer timestamp is insufficient evidence of approval.

The public [Playbook](https://github.com/KonstantinOreshnikov/risk-analytics-playbook) and [SQL Patterns](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics) offer reusable examples, but their synthetic defaults are **not** production business contracts.

## 3. Practical quality gates

| Gate | Evidence required | Not sufficient |
|---|---|---|
| Requirements | Intended question, reporting period, population and owner decision | A vague chart request |
| Source/grain | Distinct key check, expected joins and date coverage | `SELECT COUNT(*)` alone |
| Metric integrity | Traceable numerator, denominator, unit and exclusions | A plausible percentage |
| Reconciliation | Same-scope source/control totals and explained exceptions | Total without scope |
| Regression | Before/after comparison at the same observation grain | Faster runtime alone |
| Deliverable | Link/content inspection, formatting and editorial QA | File exists |
| Runtime/E2E | Actual executable/browser evidence where required | A written testing plan |
| Checkpoint | Commit/version, changed scope, PASS/FAIL/BLOCKED and next action | A generic “done” |

## 4. Unlazy QA

For material work, define required gates **before** claiming completion. Run the tests actually available and distinguish:

- **PASS:** evidence exists for the stated gate and scope.
- **FAIL:** the observed outcome contradicts acceptance criteria.
- **BLOCKED:** a required source or runtime is unavailable.
- **NOT_APPLICABLE:** the gate is irrelevant to this artifact.

A successful static SQL review must never be relabelled as production reconciliation. A rendered Mermaid diagram does not certify a running data pipeline.

## 5. Change and evidence discipline

GitHub preserves technical documentation and change history. Working evidence, operational summaries and source material may live in different restricted stores, each with a defined purpose. An approval boundary protects the current baseline from unrelated edits.

For a real analytical change, record the source version, branch/commit, altered population or metric contract (if any), checks actually executed, unresolved exceptions and next step. This enables a new reviewer to understand **what changed and what remains unverified**.

## 6. Humanizer — editorial QA, not a calculation tool

Review English and Russian text for repetition, vague promotional language, unsupported causality and imprecise status words. Keep original figures, dates, units, formula boundaries, scope and uncertainty intact. Editorial polish follows factual QA; it does not replace it.

## 7. Publication privacy gate

This case and its linked examples deliberately exclude customer/employee identifiers, internal database names, employer-owned SQL, private service URLs, proprietary thresholds, credentials, reporting extracts and operational security details. All illustrative amounts, cases, dates and categories are invented independently.

If ownership or disclosure rights are uncertain, **omit the material** rather than “anonymize” a nearly-identical private script.

## Evidence boundaries

- The current public repositories and Markdown files are inspectable artifacts.
- Documented rules and QA checklists are **methodology**, not evidence of executed live tests.
- The integrated dashboard is **DESIGN**. Production deployment and browser E2E are **not claimed**.

See the public [release checklist](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/templates/release-checklist.md) and [privacy policy](../PRIVACY.md).

---

**RU · Кратко:** версия, baseline, Reuse First, проверяемые gates, readback и редакционная проверка. Факты отделены от дизайн-решений, а публичные материалы не содержат частного SQL или внутренних данных.
