# Chess Odyssey v1.0 — Staging authenticated E2E and release QA runbook

**Prepared:** 2026-11-23. **Status:** PREPARED, **NOT EXECUTED**. An offline/mock PASS does not close any live-auth, data-persistence, security, PvP or release gate.

## Owner-approved v1.0 progress baseline — 2026-11-23

- All progress accumulated during pre-v1.0 anonymous/local testing is **test-only and out of scope**. Do **not** build or execute migration, historical backfill, local-to-cloud import, or retroactive reward/achievement credit.
- Every newly registered and verified account starts its **cloud-owned** Academy progress, stats and achievements at zero, irrespective of preexisting device-local progress. Historical `localStorage` data must not silently populate or overwrite the new account. No destructive local-data wipe is required by this decision.
- Only lessons/games completed **after registration in the authenticated account** are eligible to save and synchronize between phone/PC. Subsequent sign-in on another device loads that account's actual server-owned progress; first-use zero is **not** a reset at every login.
- Acceptance: register on a device containing legacy 23/33 or other nonzero local test progress -> authenticated profile stays 0/33; complete one new lesson -> account shows 1/33, sync to a second device -> 1/33; sign out and return -> 1/33; unrelated account still 0/33. Do not assert real E2E PASS without live OTP, Neon write/readback and RLS evidence.

## Authority and strict boundaries

- GitHub staging source: draft [PR #21](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/21), branched from draft v1.0 [PR #20](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/20); `main` protected.
- Public **staging preview**: https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/. It is open to anonymous local practice; do not call the service a production-ready release.
- Neon **staging only**: `wild-hall-05832800` / `br-still-credit-b9voxawu`, DB `chess_odyssey`; Function `chesscloud` deployment **#4** is the previous live baseline until explicitly updated after review. The code in PR #21 has **not** been deployed to the live Function or public Pages.
- No real-user accounts, mailboxes, OTP codes, tokens, credentials, user progress, or screenshots containing PII in GitHub commits, CI logs or reports.
- Keep runtime Auth policy, secret rotation, production DB, `main` merge, release, and destructive cleanup outside this runbook's standing authorization. Obtain the required explicit approvals before any such action.
- Never use `X-Demo-User` as a live auth mechanism. Do not enable broad/wildcard database grants or CORS origin.
- Use dedicated test mailboxes/accounts only when an accountable operator can receive OTP, with a third outsider account for negative checks. Avoid personal accounts.

## Preconditions — fail closed

| Gate | Required evidence |
| --- | --- |
| S0 | Reviewed code commit and CI full 3/3 jobs PASS; Pages URL live and linked to intended commit |
| S1 | Exact Neon Auth origin, JWKS, Data API URL, Function deployment and env variable names checked against provider configuration without printing secret values |
| S2 | `CHESS_RPC_SECRET` present as a Function secret and its hash is provisioned via the approved staging-only DB procedure, with no secret in browser/response/logs |
| S3 | Explicitly permitted staging test accounts, OTP access and consent to execute real staging writes; preserve an export/backup and record a rollback reference |
| S4 | Individual RLS/table/RPC GRANT policies and `moves(game_id,request_id)` unique constraint verified against live schema |
| S5 | Two independent browser contexts/devices, third outsider context, stable network and exact branch/commit/deploy identified |

A gate marked BLOCKED must not be treated as PASS simply because synthetic tests passed. Current status: **S2–S3 not verified**, and signed-in sessions are untested.

## Auth (A) — actual email/OTP, never mocked

1. **A1** — Sign up with two separately controlled, non-personal accounts; receive correct OTP; verify email and then sign in. Expect valid short-lived EdDSA JWT, `iss`/`aud` matching the Neon Auth URL origin, `sub` matching the authenticated account, `role=authenticated`, `emailVerified=true`. Keep tokens out of logs. Validate `GET /api/me` returns each user's own ID, never a supplied ID.
2. **A2** — Invalid, expired or reused OTP and signed-out/expired session are rejected. Unverified email, forged signature, wrong issuer/role and unknown origin are rejected by live API (401 or 403).
3. **A3** — Browser refresh/reauth restores the correct session, without altering local game state. Sign-out clears the cloud session while retaining local progress.

## Cloud progress (P) — real Neon rows and cross-device persistence

1. **P1** — After authenticated sign-in on device A, complete a NEW training result (not imported from an anonymous/local test) and save voluntarily. Expect revision `0→1` (or last known revision + 1), one row owned by the verified JWT `sub`, and no implicit overwrite.
2. **P2** — On device B, sign in as the SAME user, fetch and explicitly accept cloud download; match the stored completed lessons, history, game stats and version. Verify local backup is created before replacement.
3. **P3** — Competing save from two devices: only one request with `expectedRevision` succeeds; the other returns 409. Local data on the conflict device remains unchanged. After refreshing revision, the user can retry safely.
4. **P4** — Third outsider user cannot SELECT/modify another account's progress or use another identity; denial must be verified in real API+RLS, not only mock tests. Anonymous access is denied.

## PvP (V) — two real players plus outsider

1. **V1** — A generates a 24-hour invite; B accepts once; A cannot accept own token; used, forged and expired invites fail.
2. **V2** — A/B perform `e2-e4`, `e7-e5`, an illegal move attempt, out-of-turn attempt and concurrent submissions. Only one current-version legal move is committed atomically per turn.
3. **V3** — A retries the SAME `requestId` after simulated response loss: no second row; 200 with `duplicate=true`. Mutated payload, wrong actor, stale unrelated `requestId` and outsider access must fail.
4. **V4** — Both clients reconnect and reload canonical FEN/PGN, move count, clocks and result; run 5-minute clock, increment and flag-fall test, including clock expiry with insufficient mating material.
5. **V5** — Draw offer/accept/decline, resignation, checkmate, agreed draw, rematch with swapped colors and post-completion move rejection.
6. **V6** — Third account cannot list/read game/moves/invites; anonymous or spoofed `X-Demo-User` cannot act. Exercise rate limits, unexpected payload, CSRF/origin and no sensitive response leakage.

## Browser / content / release (B)

- **B1:** Chromium script + Android and PC manual UAT. Run 100 visual theme × SVG-set combinations, keyboard navigation, touch targets, contrast, full-screen mode and no sideways scroll.
- **B2:** Independent Russian, English and Azerbaijani wording review for learning content, controls, chess notation and tooltips. Automated matching is not independent linguistic approval.
- **B3:** Offline game, AI, history and Stockfish remain usable when Neon/Auth is down. No local game/progress deletion on failed cloud sync.
- **B4:** Re-check GPL/third-party asset notices, privacy/retention, monitoring, restore backup and rollback execution. Approve a reproducible release artifact, then obtain explicit separate production release/merge authority.

## Evidence record template

For each check capture **Test ID | UTC timestamp | source SHA | Pages deployed SHA | Neon branch/Function deployment ID | synthetic test actor (anonymized) | observed result | expected result | PASS/FAIL/BLOCKED | evidence link | defect/next action**. Redact credentials and OTP. Record actual numbers, no inferred coverage percentages. Run negative tests in staging before any wider rollout. Preserve failed evidence and re-test links.

## Rollback and cleanup policy

- Keep the working public preview and Neon Function deployment #4 unchanged until a reviewed deployment with rollback approval; do not merge incomplete v1.0 code into `main`.
- If staging deployment fails: stop promotion, inspect logs and restore the last previously verified source/config through an approved procedure, then perform live health, auth-denial and local-play smoke again. Do not claim DB rollback from code rollback.
- Do not delete staging accounts or game rows without explicit authorization and a reviewed cleanup plan; credentials, OTP and session tokens never become stored project evidence.

**Acceptance:** release requires actual user Auth/PvP/data evidence and manual device+linguistic QA. `MOCK_PASS` and `STAGING_PUBLISHED` are separate states; neither implies `V1_RELEASE_PASS`.
