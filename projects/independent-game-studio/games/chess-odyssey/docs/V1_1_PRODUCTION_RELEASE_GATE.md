# Chess Odyssey v1.1 — production release gate and operational rollout

**Date:** 2026-11-24. **Status:** RELEASE HOLD — separate owner approval required. **Branch:** `feature/chess-odyssey-v1-1-pvp-header-zoom-20261124`, [PR #24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/24). Never treat QA staging configuration as production.

## Release scope and evidence

- Combined P0/P1/P2: friend invite/share/join flow, header Login (single reused form), fixed language toolbar and device-persistent A−/A+ text zoom. Existing game state and real user progress must be preserved.
- Real isolated Neon: `wild-hall-05832800` / QA branch `br-muddy-truth-b96hxtdg` / Function **#5**. Verified three genuine Better Auth signed JWT actors and real Postgres: invite/accept, outsider isolation, single-use invitation, wrong-turn 409, moves e2e4 and e7e5, duplicate identical `requestId` 200 (idempotent), stale version 409. [Full real JWT/PvP test — successful run attempt](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45454226087).
- Earlier [live HTTP 8/8](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45448520540), [focused browser mock 13/13](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45414940864), [original full CI 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45413190812) PASS.
- Backend `scripts/build-chesscloud.cjs` generates single-entry `index.mjs` ZIP from actual source + chess.js + clock. `tests/chesscloud-package.cjs` validates Node syntax, replay logic and reproducibility. CI unit PASS [#45455383454](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45455383454); **full Chromium and Windows checks are pending unless that run finishes with evidence**.
- **Outstanding independent acceptance:** real email OTP receive/verify/reuse/expiry on controlled test mailboxes in isolated QA (the 3 synthetic QA JWT test actors were admin-confirmed; no genuine OTP receipt), real cross-device browser with registered friends. Do not claim these PASS from mock tests or prior production owner feedback.

## Production boundary

The published v1.0.0 GitHub Pages currently targets the Neon **default** branch `br-still-credit-b9voxawu`. Its Function `chesscloud` is **#4**, with `CHESS_ALLOWED_ORIGINS` only and no custom `CHESS_RPC_SECRET` — **live invites remain unconfigured**. The QA branch's new secret/hash and Function source must not be assumed available on the default branch.

**Explicit owner permission must name:** merge PR #24 into `main` and GitHub Pages deployment; update production-linked Neon Function source and its scoped env; generate/configure a fresh private `CHESS_RPC_SECRET` and matching default-branch `chess_odyssey.api_gate` SHA-256; non-destructive smoke/test records in production only if separately approved. Do not touch authentication/security policy, existing account progression, production data outside the narrowly approved gate.

## Coordinated deployment checklist (AFTER owner approval)

1. Read back `main`/PR HEAD and working Neon Function/DB/Auth/Data API. Verify current progress count, revision and table RLS/permissions. Preserve a private reversible copy of existing `api_gate` **hash** (not the raw secret) and record the deployed Function version/source manifest. No personal data or secrets in GitHub.
2. Re-run complete source CI on the final PR head. Package Function from pinned GitHub source: `node scripts/build-chesscloud.cjs`. Confirm deterministic package SHA-256 and `index.mjs` syntax. Do not copy a file from unrelated branches.
3. Fetch target **default branch** Auth base/JWKS/Data API URLs from Neon, not QA URLs. Deploy reviewed Function ZIP to the default branch with allowlisted origin. Generate a **new random 96+ character RPC secret** privately and provision matching `chess_odyssey.api_gate` hash on default branch in the narrowest approved transaction; store secret **only** in Function environment. Never log it, pass it to the browser or commit it to GitHub. Confirm Function deployed env names + health.
4. Reverify `/api/me`, cloud GET, CORS, bad-JWT denial and an authorized invite/accept/move with **controlled approved** production test identities; check outsider-negative. No mutations to the owner's progress. If this gate fails, **HOLD** frontend merge and investigate/revert only this scoped backend delta.
5. Only after successful backend smoke, merge PR #24 into `main` and wait for GitHub Pages production 3/3 PASS. Verify new UI header Login, locale stability, 90–130% text zoom, board dimensions, share/accept and two-player reconnect on actual deployed HTTPS.
6. Record final exact merge commit, production Function deployment number, Data API/DB branch, source ZIP digest and GitHub Pages workflow URLs. Keep unresolved OTP/editorial/device checks in QA with unambiguous ownership.

## Rollback / stop criteria

- STOP if new Function fails health, JWT validation or read-only cloud progress; do not publish frontend. Restore original `api_gate` hash from the private predeployment checkpoint and redeploy/re-enable the previously known Function source/configuration if feasible. An unspecified `main` revert is **not** an adequate backend rollback.
- If only frontend has an issue, revert the release PR through normal GitHub review and republish the prior v1.0.0 Pages build; keep the new backend only after verifying existing progress and account behavior are unaffected.
- No production deletes, user resets, schema/RLS changes, authentication policy changes or unrelated game changes are in scope.
