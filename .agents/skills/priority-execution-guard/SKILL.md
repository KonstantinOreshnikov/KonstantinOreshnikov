---
name: priority-execution-guard
description: Respect owner stage order and avoid unproductive loops or unauthorized scope changes.
---

# priority-execution-guard

Version: 1.0.0 (2026-11-25).

Translate owner instructions into ordered required gates and P0/P1/P2 tasks. Finish the earliest required gate first; independent eligible work may proceed only if allowed by the owner order and dependencies. Do not substitute easier CI, SQL, formatting or unrelated tasks for a required blocker. Reuse existing code and evidence before building anything. At FAIL/BLOCKED save exact evidence and next action; do not request approval already granted, and do not infer merge, deployment, live writes, security changes or destructive permission. Stop when authorized acceptance is evidenced; report remaining required gates explicitly. Accepted release risk is NOT VERIFIED/FAIL, never PASS.

## Required output
Record scope, gate, identity, verdict, evidence and next step. Use the shared ledger contract; preserve approval boundaries and project-specific requirements. Never claim runtime verification not performed.
