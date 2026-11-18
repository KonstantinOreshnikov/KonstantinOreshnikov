# Data Quality and Reconciliation

[← Case study](README.md)

Data quality is part of the metric definition, not a cosmetic check after the chart is built. A report is only comparable across periods if its source coverage, grain, eligible population and reconciliation rule are known.

## Control matrix

| Check | Synthetic test question | Warning or failure condition | Typical action |
|---|---|---|---|
| Completeness | Are `case_id` and `event_date` present? | Missing required key or observation date | Quarantine or resolve with owner |
| Uniqueness | Is one row retained per case at the declared grain? | `COUNT(*) > COUNT(DISTINCT case_id)` | Examine join path or revision history |
| Referential integrity | Does every child event map to a known case? | Orphan child identifier | Investigate ingestion / mapping |
| Validity | Are statuses and numbers within an agreed generic domain? | Unknown status or invalid numeric text | Flag; do not coerce silently |
| Consistency | Does a completed case have a completion date? | Contradictory fields | Return to source or rule owner |
| Freshness | Is the expected observation period present? | Missing snapshot or stale refresh | Mark period missing; never invent zero |
| Population / exclusions | Are eligible and QA-excluded records accounted for? | Unexplained removal | Publish exception counts separately |
| Reconciliation | Does the output equal the independent control total? | Non-zero unexplained difference | Block acceptance and investigate |

Each check has a **defined grain**. A duplicate in a case table and repeated events for the same case are not necessarily the same defect.

## Synthetic QA exercise

Assume a **fictional** dataset with six rows, five distinct case IDs and one duplicate key. One row has a missing date. These values are invented for illustration, not sampled from operational data.

| Check | Synthetic observed | Expected | Illustrative outcome |
|---|---:|---:|---|
| Input rows | 6 | 6 | Consistent with fixture |
| Distinct case IDs | 5 | 6 | **FAIL** at one-row-per-case grain |
| Rows with missing observation date | 1 | 0 | **FAIL** |
| Reporting rows after silent deduplication | 5 | 6 input rows accounted for | **BLOCKED** until exclusion is explained |

The lesson is not that removing duplicates is forbidden. The lesson is that a correction must preserve **provenance, counts and rationale** so the report can be reconstructed.

## Synthetic SQL check (Oracle)

```sql
SELECT COUNT(*) AS row_count,
       COUNT(DISTINCT application_id) AS distinct_cases,
       COUNT(*) - COUNT(DISTINCT application_id) AS extra_rows,
       MIN(application_date) AS first_day,
       MAX(application_date) AS last_day
FROM demo_applications;
```

The public [disposable demo schema](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/00_synthetic_schema.sql) defines the columns above. Check null keys separately if the source schema does not enforce a non-null primary key.

## Reconciliation contract

For an additive amount:

```text
Difference = calculated total − independent control total
Main population + documented QA exceptions = source population
```

Both sides must share the **same period, grain, units and eligibility scope**. A zero numeric difference may still conceal offsetting segment errors, so reconcile relevant breakdowns as well as the grand total.

For a rate, compare **its underlying numerator and denominator**, not only the resulting percentage. For joined data, compare record counts and sums **before and after** each relationship that might increase cardinality.

## Investigation sequence

1. Confirm observation periods and refresh coverage.
2. Align population, exclusions and maturity.
3. Inspect duplicate keys and join multiplicity.
4. Check typing, nulls and status interpretation.
5. Rebuild additive measures and compare with the independent control.
6. Document the remaining discrepancy; do not convert a failed gate into a green chart.

**Evidence boundary:** the checklist describes tests to perform. Only a recorded execution against a specified dataset can establish that a particular reconciliation passed.

See the [public Data Quality Framework](https://github.com/KonstantinOreshnikov/risk-analytics-playbook/blob/main/docs/data-quality-framework.md) and [Oracle quality checks](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/tests/quality_checks.sql).

---

**RU · Кратко:** контроль полноты, уникальности, целостности, периодов, исключений и сверок на полностью вымышленных данных. Показано, почему даже совпадение общей суммы не заменяет проверку сегментов и denominator.
