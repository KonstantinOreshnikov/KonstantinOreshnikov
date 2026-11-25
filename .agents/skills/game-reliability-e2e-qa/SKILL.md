---
name: game-reliability-e2e-qa
description: Verify actual gameplay, persistence, multiplayer recovery and release environment without conflating synthetic tests with live acceptance.
---

# game-reliability-e2e-qa

Version: 1.0.0 (2026-11-25).

Establish reproducible defect and baseline. Test rules, AI, win/loss, representative full loop, save/load and migration, F5/reopen, desktop/mobile controls, layout and performance. For multiplayer: independent two-client authenticated invite/accept, sustained alternating turns (at least 40 half-moves for chess hotfix regression), stale/out-of-order replies, network timeout/lost response, idempotent retry, disconnect/reconnect, F5 both clients, room restoration, authoritative clocks, outsider denial and progress preservation. Use isolated identities and data; no real progress reset without approval. Separate unit, synthetic browser, authenticated staging, production UAT and physical-device gates. Actual production failure opens targeted QA issue despite prior synthetic PASS; preserve unrelated evidence. For hotfixes check exact candidate artifact, regression and authorized deployment readback. Owner-approved deferred tests stay NOT VERIFIED/FAIL; no false completion.

## Required output
Record scope, gate, identity, verdict, evidence and next step. Use the shared ledger contract; preserve approval boundaries and project-specific requirements. Never claim runtime verification not performed.
