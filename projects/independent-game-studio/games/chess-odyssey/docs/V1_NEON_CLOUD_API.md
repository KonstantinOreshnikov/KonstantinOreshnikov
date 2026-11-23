# Chess Odyssey v1.0 — Neon Staging Cloud API

Deployment target: `wild-hall-05832800`, `staging` branch `br-still-credit-b9voxawu`, `chess_odyssey` DB. **DO NOT DEPLOY TO PRODUCTION.**

Source: `functions/chesscloud/index.mjs` (Node.js 24, no external dependencies). The entrypoint enforces cryptographic Ed25519 verification against Neon's JWKS, `iss/aud/exp/nbf/role/emailVerified/sub`, explicit CORS allowlist, no synthetic `X-Demo-User`, no environment fallback. JWT is forwarded to Data API, which independently verifies and enforces authenticated-role RLS.

Public endpoints: `GET /health` staging status only; `GET /api/me` real JWT only; `GET /api/progress` owner-only RLS; `PUT /api/progress` revision-safe JSON save via `chess_odyssey.save_progress`. There is no user-id input in the SQL mutation.

Data API provisioned 2026-11-23 with schema `chess_odyssey` only, no default table grants, GitHub HTTPS CORS only. Neon Auth trusted origin also GitHub HTTPS. DB migration `db/migrations/20261123_v1_progress_staging.sql` contains the narrow RLS and CAS grants. Identity tokens are not exposed in logs or persisted.

`node tests/v1-cloud-api.cjs`: 19 tests including real Ed25519 signing/verification, forged signature, wrong claims, stale revision and origin denial. These are offline cryptographic integration tests with mocked DB transport; **live OTP, Neon JWKS and two-account real E2E remain required for release**.
