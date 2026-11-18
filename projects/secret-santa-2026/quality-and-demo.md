# Secret Santa — Quality Gates and Synthetic Demo

## Real aggregate verification

A read-only check of the event database on **2026-11-18** returned:

| Invariant | Expected | Observed | Outcome |
|---|---:|---:|---|
| Registered / event participants | 15 / 15 | 15 / 15 | PASS |
| Completed gift wishes | 15 | 15 | PASS |
| Total assignments | 15 | 15 | PASS |
| Distinct givers | 15 | 15 | PASS |
| Distinct recipients | 15 | 15 | PASS |
| Self-assignments | 0 | 0 | PASS |
| Event status | Drawn | Drawn | PASS |

These checks validate **one actual saved draw**. They do not establish a penetration-test result, multi-event load capacity or statistical fairness for every conceivable input. The production participant records were not exported to this repository.

## Illustrative assignment — synthetic, four people

The following names and relationships were **invented** to show the rule. They are unrelated to the real event.

| Giver | Recipient |
|---|---|
| Participant A | Participant C |
| Participant B | Participant D |
| Participant C | Participant B |
| Participant D | Participant A |

All four recipients are unique and none equals the giver.

## Example acceptance checklist

- Participants are eligible and ready before the organizer starts the draw.
- Unauthorized users cannot initiate the draw.
- Assigned recipients form a one-to-one permutation.
- No one is assigned to themselves.
- Draw completion cannot be accidentally repeated.
- Actual recipient data is never included in logs, screenshots or public documentation.
- Negative cases (incomplete registration, insufficient participants, invalid access) are covered before a future general release.

The last list is a **test plan / acceptance model**. Only the real aggregate checks in the table above are claimed as verified here.

## Delivery lessons

A small event application still benefits from explicit state transitions, database-backed invariants, server-side randomness, access boundaries and read-only post-run reconciliation. A clean design can replace tedious manual coordination while keeping pairings private.
