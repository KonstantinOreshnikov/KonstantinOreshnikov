---
name: verified-pass-lock
description: Reuse a verified final PASS for the exact scope, gate, identity and environment; reopen only on evidence.
---

# verified-pass-lock

Version: 1.0.0 (2026-11-25).

Before any QA, load the authoritative ledger. Record stable object ID, gate ID, scope fingerprint, relevant dependency fingerprint, environment identity, gate-contract version, reviewer ID, independence where required, evidence reference and approval. A verified PASS is immutable historical evidence, not a promise that future revisions pass. If all scoped fingerprints match, reuse PASS without repeating the substantive test. A new chat, agent, filename, unrelated version increment, elapsed time or cosmetic change is not grounds for reopening. Record a separate targeted review for observed material defects, integrity mismatch, changed binding requirements or a changed dependency that affects the gate; cite evidence, affected scope and reason. Never erase the original PASS. New mandatory gates, environments and changed code have their own evidence. Security/release regression required by an applicable contract is a distinct gate. No fake PASS, no blanket re-review.

## Required output
Record scope, gate, identity, verdict, evidence and next step. Use the shared ledger contract; preserve approval boundaries and project-specific requirements. Never claim runtime verification not performed.
