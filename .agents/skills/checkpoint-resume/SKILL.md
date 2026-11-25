---
name: checkpoint-resume
description: Resume interrupted or cross-agent tasks using a durable exact checkpoint and bounded blocker retries.
---

# checkpoint-resume

Version: 1.0.0 (2026-11-25).

Load project entrypoints, current branch/artifact identity, approved scope, latest gate ledger and queue before action. Confirm current versus historical authority and record conflicts; reuse existing checkpoint schema when possible. Save atomic checkpoint after coherent work: task ID, environment, commit/revision, counts by status, evidence links, exact next ID, blockers and attempt counts, writer ownership. Single writer for canonical register; claim work before edits. At most two actual failed attempts for the same blocker per run (one conclusive failure may suffice); persist and skip to eligible authorized work only if it does not violate stage order. Do not retry unchanged blockers without new evidence, or restart finished work. Report no eligible work truthfully.

## Required output
Record scope, gate, identity, verdict, evidence and next step. Use the shared ledger contract; preserve approval boundaries and project-specific requirements. Never claim runtime verification not performed.
