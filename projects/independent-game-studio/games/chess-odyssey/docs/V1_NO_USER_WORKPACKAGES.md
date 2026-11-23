# Chess Odyssey v1.0 — user-independent implementation work packages

**Status:** EXECUTING on isolated development branch `feature/chess-odyssey-v1-auth-hardening-20261123` (based on `feature/chess-odyssey-v1-foundation-20261123`). The public GitHub Pages staging preview and Neon Functions deployment remain unchanged by this branch until independent QA and explicit promotion.

## Verified baseline and source precedence (2026-11-23)

- Published staging: [Chess Odyssey on GitHub Pages](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/), successful [Pages run #45147523810 attempt 2](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45147523810) and independent [live browser smoke](https://agent.tinyfish.ai/runs/f48adaae-66b4-4339-a0d1-353e9c56a954). Local practice and UI work; production v1.0 NOT approved.
- Neon staging `wild-hall-05832800` / `br-still-credit-b9voxawu`, DB `chess_odyssey`, Function `chesscloud` deployment #4. Four game-data tables RLS+FORCE RLS, one SELECT policy each; `api_gate` config table separate. Six executable RPCs granted to `authenticated`, privileged `authorized_actor` private. Last verified: 0 auth users, progress records, games, invites and moves.
- API `/health` and anonymous-deny endpoints verified. **No authentic OTP/login/JWT, cross-device saves or real two-user PvP E2E verified.**
- Neon primary source: [Managed Better Auth JWT](https://neon.com/docs/auth/guides/plugins/jwt) (2026-11-06) and [SDK reference](https://neon.com/docs/reference/javascript-sdk). They specify `auth.getSession()` → `data.session.token` as the JWT for separate bearer APIs. `auth.getJWTToken()` is not documented in the current SDK reference. This corrects a previous source-level assumption; do not automatically deploy an unverified replacement.

## Ordered independent work packages

| ID | Work | Acceptance evidence | Current status |
| --- | --- | --- | --- |
| NU-01 | Isolate development branch; repair SDK JWT retrieval; validate compact JWT shape; fetch cloud revision after sign-in to prevent false conflict on an existing account | Unit/contract tests PASS, full chess CI green, no changes to live Pages or Neon staging | SOURCE IMPLEMENTED; CI pending |
| NU-02 | Validate authorization architecture and DB access contracts, without any new users or live data writes | Read-only inventory of RLS/FORCE, GRANTs, trusted origins, JWT role and API-only RPC permissions; fail-closed expectations documented | READ-ONLY INVENTORY PASS; positive account-scoped E2E OPEN |
| NU-03 | Expand no-user tests for PvP replay/idempotency, stale version, invite expiry, draw/resign, privacy and clock boundary cases | Reproducible fake-JWT/mock-transport or isolated disposable test-branch tests with exact PASS/FAIL evidence; no fixture identity header in public runtime | PENDING |
| NU-04 | Staging frontend smoke/regression in Chromium including cloud panel UX (without signup), 10 theme × 10 style structural render, RU/EN/AZ labels | Automated UI test evidence, zero regressions; existing public preview unaffected until promotion | PENDING |
| NU-05 | Prepare staging account-based E2E script, synthetic data policy, rollback, backup, release checklist | Runbook/test fixtures built; tests requiring email delivery/OTP and actual user sessions marked BLOCKED, never inferred from mocks | PENDING |

## Boundary: user-dependent gates, not to be silently closed

1. At least two actual registered/verified accounts with email OTP delivered and validated; signed JWT issuer/audience/role checks against live Function and Data API.
2. Save/load progress across two independent devices; third account denied; prove revision CAS, rollback and reconciliation.
3. Online friend invitation, accept/decline, legal move, timeout, two concurrent moves, reconnect, rematch, resign/draw and outsider denial against real persisted records.
4. Independent RU/EN/AZ editorial review, real PC/Android owner UAT, visual 100 theme/style combinations, privacy/accessibility/backup and security release proof.
5. Production deploy/main merge and auth security policy or production DB changes need their separate authorization.

**Release rules:** PASS requires actual evidence; a synthetic mock, CI green, or static HTTPS page is not a real-user acceptance. Keep existing staging service and public site stable during isolated hardening. Review/merge only after checks pass. Historical errors remain QA evidence.
