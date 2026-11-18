# SQL Engineering

[← Case study](README.md)

The SQL work is organized around a simple contract: **one declared grain, explicit period logic, controlled joins and totals that can be reconciled**. The public repository contains separate, independently authored synthetic examples — **not extracts of private SQL**.

## Engineering controls

| Failure mode | Defensive pattern |
|---|---|
| Many-to-many amplification | Check source keys; rank or aggregate the child relation to the required grain before joining |
| Wrong rate | Sum eligible numerator and denominator separately; divide **after** filtering and grouping |
| Period drift | Specify observation date and use aligned intervals/snapshots |
| Invalid text arithmetic | Validate or explicitly convert text fields before numeric calculations |
| Ambiguous latest row | Use a deterministic `ROW_NUMBER()` order with a complete tie-breaker |
| False performance improvement | Compare outputs and reconciliation checks against the reference result before optimizing |

## Example A — Oracle: synthetic join at a declared grain

This example uses the public disposable [demo schema](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/00_synthetic_schema.sql). The event rows are invented inside the query; no second database table is required.

```sql
WITH synthetic_events AS (
    SELECT 1001 application_id, DATE '2026-01-03' event_dt, 1 event_seq, 'OPENED' event_name FROM dual
    UNION ALL
    SELECT 1001, DATE '2026-01-05', 2, 'CLOSED' FROM dual
    UNION ALL
    SELECT 1004, DATE '2026-02-06', 1, 'CLOSED' FROM dual
),
latest_event AS (
    SELECT application_id, event_name,
           ROW_NUMBER() OVER (
               PARTITION BY application_id
               ORDER BY event_dt DESC, event_seq DESC
           ) AS rn
    FROM synthetic_events
)
SELECT a.application_id, a.stage_name, e.event_name
FROM demo_applications a
LEFT JOIN latest_event e
  ON e.application_id = a.application_id
 AND e.rn = 1
ORDER BY a.application_id;
```

**Declared output grain:** one row per `demo_applications.application_id`. The two events for synthetic case 1001 must not produce two report rows. On the unchanged published demo fixture, the expected output is **four cases**, including a null event for unmatched cases. This is a **fixture expectation**, not evidence of an executed database test.

An expanded sample and review assertions: [Safe event join](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/06_safe_event_join.sql).

## Example B — ClickHouse: eligible numerator and denominator

This query uses an **invented** event model: `demo_cases(case_id, event_date, completed_flag, eligible_flag)`, where each row represents one unique case. It does not correspond to a real schema.

```sql
SELECT toStartOfMonth(event_date) AS observation_month,
       countIf(eligible_flag = 1) AS eligible_cases,
       countIf(eligible_flag = 1 AND completed_flag = 1) AS completed_cases,
       round(
           100.0 * completed_cases / nullIf(eligible_cases, 0),
           2
       ) AS completion_pct
FROM demo_cases
WHERE event_date >= toDate('2026-01-01')
  AND event_date <  toDate('2026-04-01')
GROUP BY observation_month
ORDER BY observation_month;
```

**Important precondition:** uniqueness of `case_id` within the chosen observation grain must first be tested. This is a pattern, **not an executable fixture backed by a supplied ClickHouse table**.

## Example C — Oracle: duplicate-key audit

The following works against the published disposable Oracle demo schema:

```sql
SELECT application_id, COUNT(*) AS rows_per_case
FROM demo_applications
GROUP BY application_id
HAVING COUNT(*) > 1
ORDER BY rows_per_case DESC, application_id;
```

On the published fixture, the expected result is **zero rows** because the demo table declares `application_id` as its primary key. This is not a claim of a live test execution.

## Practical performance discipline

First confirm correctness of source keys, date predicates, selectivity, and duplicate handling. Then inspect the query plan and apply the smallest safe optimization. A query running faster with a different denominator or an unintentionally restricted population is **not** an improvement.

The full public pattern library also includes [safe numeric conversion](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/01_safe_numeric_conversion.sql), [month-end snapshot selection](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/03_month_end_snapshots.sql), [source reconciliation](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/oracle/05_reconciliation.sql) and [ClickHouse period parameters](https://github.com/KonstantinOreshnikov/sql-patterns-for-risk-analytics/blob/main/sql/clickhouse/01_date_parameters.sql).

---

**RU · Кратко:** демонстрируются синтетические Oracle/ClickHouse SQL-паттерны: безопасный join, контроль уникальности, корректное вычисление долей и периодов. Примеры не копируют рабочие запросы или внутренние схемы.
