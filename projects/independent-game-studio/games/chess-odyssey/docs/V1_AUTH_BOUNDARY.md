# Chess Odyssey v1.0 — Neon Auth API boundary (source candidate)

**Status:** code + offline authorization contract only, **NOT DEPLOYED**. This is not a functioning Neon-backed user portal.

- `functions/chess-auth/index.mjs` is a Neon Function entrypoint for **Node.js 24**, using `jose` to verify Neon Auth's EdDSA JWTs against injected `NEON_AUTH_JWKS_URL`, with strict `issuer`, `audience` and token expiration verification.
- `pvp/cloud/auth-gateway.cjs` handles explicit HTTPS origin allowlist, CORS, verified email and `sub` extraction; never accepts spoofable `X-Demo-User`, never treats local state as authenticated, and exposes **only** `GET /health` and authorized `GET /api/me`.
- A real browser account must have email OTP verified. Browser obtains a short-lived JWT from Neon Auth; no DB credentials go to browser. HTTPS frontend and Neon Function will have distinct origins; cross-domain Safari cookie behaviour and trusted origins need live E2E.
- Neon staging `wild-hall-05832800`, database `chess_odyssey`, has 4 tables under RLS+FORCE RLS and zero permissive policies; it must remain FAIL CLOSED. The Progress and PvP service need **a separately approved minimal RLS/server role design** and transaction-grade implementation, plus positive and negative API E2E. Do not deploy `pvp/dev-server.cjs`.
- Secrets and trusted origins must be injected into function runtime, never committed. `CHESS_ALLOWED_ORIGINS` must be an explicit comma-separated list of secure origins. On empty/missing configuration the function throws at startup; no public fallback.
- **Acceptance:** run `node tests/v1-auth-boundary.cjs`; must PASS 11/11, then deploy only to isolated Neon staging with genuine OTP/JWT, CORS and third-user denial tests, then add private persistent stats and live PvP. No production release before authorization.
