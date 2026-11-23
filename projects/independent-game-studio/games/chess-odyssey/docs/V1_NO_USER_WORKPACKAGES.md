# Chess Odyssey v1.0 — user-independent implementation work packages

**Status:** EXECUTING on isolated development branch `feature/chess-odyssey-v1-auth-hardening-20261123` (based on `feature/chess-odyssey-v1-foundation-20261123`). The public GitHub Pages staging preview and Neon Functions deployment remain unchanged by this branch until independent QA and explicit promotion.

## Verified baseline and source precedence (2026-11-23)

- Published staging: [Chess Odyssey on GitHub Pages](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/), successful [Pages run #45147523810 attempt 2](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45147523810) and independent [live browser smoke](https://agent.tinyfish.ai/runs/f48adaae-66b4-4339-a0d1-353e9c56a954). Local practice and UI work; production v1.0 NOT approved.
- Neon staging `wild-hall-05832800` / `br-still-credit-b9voxawu`, DB `chess_odyssey`, Function `chesscloud` deployment #4. Four game-data tables RLS+FORCE RLS, one SELECT policy each; `api_gate` config table separate. Six executable RPCs granted to `authenticated`, privileged `authorized_actor` private. Last verified: 0 auth users, progress records, games, invites and moves.
- API `/health` and anonymous-deny endpoints verified. **No authentic OTP/login/JWT, cross-device saves or real two-user PvP E2E verified.**
- Neon primary source: [Managed Better Auth JWT](https://neon.com/docs/auth/guides/plugins/jwt) (2026-11-06) and [SDK reference](https://neon.com/docs/reference/javascript-sdk). They specify `auth.getSession()` → `data.session.token` as the JWT for separate bearer APIs. `auth.getJWTToken()` is not documented in the current SDK reference. This corrects a previous source-level assumption; do not automatically deploy an unverified replacement.

## Verified implementation checkpoint — 2026-11-23

- **Source SHA:** `938c77cf17da73e09f36103a4b7f0c6e683e39dc`, [draft PR #21](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/21), no merge/deploy.
- **[Chess Odyssey QA #45151032505](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45151032505): 3/3 jobs PASS**: offline unit (Auth Client **9/9**, Cloud signed-JWT suite, PvP mock **26/26**), real Chromium UI and Windows native Stockfish/launcher.
- Auth SDK getter corrected to documented `getSession().data.session.token`; authenticated profile pulls current cloud revision on sign-in before a save.
- PvP commits are server-led; on stale request ID, read `moves` with actor/game-scoped RLS before deciding replay. Identical retry returns duplicate success; changed move/other actor rejected. Live Neon deployment #4 does NOT contain this work until explicitly promoted.
- Independent SQL readback (no writes): four user tables FORCE RLS+policy, only authenticated SELECT grants, six authenticated RPC EXECUTE grants, no anonymous table grants. This proves catalog access configuration, **not** individual user's end-to-end access.
- Historical intermediate CI failure/cancellations reflect commits where CI was enabled before the new test file landed; final full run above supersedes interim state. Preserve historical runs; do not rewrite failure history.

## Latest verified browser/hardening milestone — 2026-11-23

- [Chess Odyssey QA #45153407632](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45153407632), implementation source SHA `467895acba1072e27b0ecf660e8d0410ab92bb8d`: **3/3 jobs SUCCESS** (Node unit, Chromium real browser, Windows Stockfish/launcher).
- Chromium **Appearance 6/6 PASS**: programmatic selection of all **10×10=100** theme and piece combinations across Practice, Masters and PvP 64-cell boards; SVG assets loaded; localized RU/EN/AZ options, persisted selection and 390px mobile width.
- Chromium **Cloud UI 10/10 PASS**, using exclusively intercepted HTTPS static pages and a synthetic Neon SDK/API fixture: signup OTP, login revision=7, save→8, stale 409 does not mutate local state, relogin revision=9, save→10, canceled cloud download, RU/EN/AZ and no real cloud requests. These are **MOCKED browser interactions, not live Auth success**.
- Read-only live PostgreSQL catalog evidence: four user-data tables RLS+FORCE and participant/owner read policies; authenticated SELECT only and no anonymous table grant; `authorized_actor` not executable by `authenticated`; other six business RPCs callable by authenticated; unique `moves(game_id,request_id)`, per-game move PK and invite token hash unique. No DB writes.
- [Authenticated staging runbook](V1_STAGING_E2E_RUNBOOK.md) prepared, with preconditions, actor isolation, OTP, cross-device revisions, PvP race/reconnect, third-account denial and rollback. **Actual account-backed acceptance remains BLOCKED/UNEXECUTED**.
- Changes confined to draft PR #21's development branch; prior public Pages deployment and Neon Function #4 not modified. Documentation-only commits after tested code are not runtime promotions.

## Ordered independent work packages

| ID | Work | Acceptance evidence | Current status |
| --- | --- | --- | --- |
| NU-01 | Isolate development branch; repair SDK JWT retrieval; validate compact JWT shape; fetch cloud revision after sign-in to prevent false conflict on an existing account | Unit/contract tests PASS, full chess CI green, no changes to live Pages or Neon staging | **PASS** — Auth Client 9/9; Chess QA 3/3 at #45151032505 |
| NU-02 | Validate authorization architecture and DB access contracts, without any new users or live data writes | Read-only inventory of RLS/FORCE, GRANTs, trusted origins, JWT role and API-only RPC permissions; fail-closed expectations documented | READ-ONLY INVENTORY PASS; positive account-scoped E2E OPEN |
| NU-03 | Expand no-user tests for PvP replay/idempotency, stale version, invite expiry, draw/resign, privacy and clock boundary cases | Reproducible fake-JWT/mock-transport or isolated disposable test-branch tests with exact PASS/FAIL evidence; no fixture identity header in public runtime | **PARTIAL PASS** — 26/26 signed-JWT/mock-PvP tests, including replay across completion and changed-request denial; true DB race/clock E2E OPEN |
| NU-04 | Staging frontend smoke/regression in Chromium with synthetic HTTPS cloud-panel flow, 10 theme × 10 style structural render, RU/EN/AZ labels | Automated Chromium evidence, zero regressions; existing public preview unaffected until promotion | **PASS** — Appearance 6/6 and synthetic Cloud UI 10/10, all 100 combinations; #45153407632 |
| NU-05 | Prepare staging authenticated E2E script, synthetic data policy, rollback, backup, release checklist | Runbook and acceptance gates prepared; actual OTP and real signed-in sessions require later execution | **RUNBOOK PREPARED** — [V1_STAGING_E2E_RUNBOOK.md](V1_STAGING_E2E_RUNBOOK.md); real-user E2E BLOCKED, not yet executed |

## Boundary: user-dependent gates, not to be silently closed

1. At least two actual registered/verified accounts with email OTP delivered and validated; signed JWT issuer/audience/role checks against live Function and Data API.
2. Save/load progress across two independent devices; third account denied; prove revision CAS, rollback and reconciliation.
3. Online friend invitation, accept/decline, legal move, timeout, two concurrent moves, reconnect, rematch, resign/draw and outsider denial against real persisted records.
4. Independent RU/EN/AZ editorial review, real PC/Android owner UAT, visual 100 theme/style combinations, privacy/accessibility/backup and security release proof.
5. Production deploy/main merge and auth security policy or production DB changes need their separate authorization.

**Release rules:** PASS requires actual evidence; a synthetic mock, CI green, or static HTTPS page is not a real-user acceptance. Keep existing staging service and public site stable during isolated hardening. Review/merge only after checks pass. Historical errors remain QA evidence.
