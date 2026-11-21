# Chess Odyssey B9 — Server-authoritative PvP + Neon integration contract

**2026-11-21 | CURRENT B9 / v0.9 DEVELOPMENT | Local PvP QA PASS, Neon staging schema + Better Auth configured | AUTHENTICATED CLOUD PvP NOT IMPLEMENTED/TESTED | NOT DEPLOYED**  

**Operational source:** [CURRENT_STATUS.md](CURRENT_STATUS.md) and [Neon staging live read-back evidence](B9_NEON_STAGING_CHECKPOINT_2026-11-21.md). `v0.9` means current development phase, not a packaged v0.9 release.

## Product and non-negotiable requirement
Owner intent: 5–10 invited players learn in Academy, practice against local Stockfish, and then compete in live Player vs Player on the same website. Human PvP belongs in **v1.0**, not deferred to v1.1. Existing B0–B8 local game/offline distribution retained.

## Capabilities available now (offline development)
- `pvp/match-service.cjs` contains a deterministic, server-owned game state machine. All actions require actor identity resolved outside request payload: invite, acceptance/decline, legal turn-based moves, canonical PGN/FEN, request idempotency, revision concurrency checks, server-time clock debit/increment, timeout, resignation, draw offer/accept, rematch.
- `pvp/dev-server.cjs` and `pvp/demo.{html,js,css}` are **unsafe synthetic tests only**. To start locally: `CHESS_ODYSSEY_PVP_DEV=1 node pvp/dev-server.cjs`. It binds 127.0.0.1:8781, has no persistence, accepts easily spoofed `X-Demo-User` headers and **refuses to run under NODE_ENV=production**. NEVER deploy or publicly proxy it. Open two tabs `/demo?user=alice` and `/demo?user=bob`; separate browser contexts verify independent views.
- Test coverage: `tests/b9-match-service.cjs`, `tests/b9-http.cjs`, `tests/b9-browser.cjs`; status only per most recent actual GitHub CI. A green synthetic browser is NOT Neon Auth/DB E2E.

## Neon staging — actual verified implementation, no longer a hypothetical provider

| Gate / item | Verified live evidence on 2026-11-21 |
| --- | --- |
| Owner Neon registration/connection | **DONE**: organization `Konstantin`, Free; accessible through connected Neon tool |
| Isolated staging project | **DONE**: Chess Odyssey — Staging, ID `wild-hall-05832800`, Frankfurt `aws-eu-central-1`, PostgreSQL 17, `staging` branch `br-still-credit-b9voxawu` |
| Database and app tables | **APPLIED TO STAGING**: `chess_odyssey` schema `chess_odyssey`; `games`, `invites`, `moves`, `user_progress`. Transaction successful, independently read back |
| Data protection | **FAIL CLOSED**: all 4 app tables RLS + FORCE RLS, **0** permissive policies. No public access granted, no actual user data |
| Neon Better Auth | **PROVISIONED WITH EXPLICIT OWNER APPROVAL**: `neon_auth` schema (9 tables), password+mandatory email OTP, verified email on signup/signin, session revocation on reset, localhost allowed on staging, no production trusted origins |
| Shared mail provider | **LIMITATION HANDLED**: Neon shared email sender rejects verification-by-link; configured supported **OTP** instead, read back |
| Real authenticated two-user cloud PvP | **BLOCKED / NOT TESTED**: no real signup/email receipt/login/JWKS token E2E; no durable transactional server adapter/real-game API yet |
| GitHub `main` source | **MERGED BY OWNER AUTHORIZATION**: PR #7. This does not constitute a v0.9 release or real multiplayer service. |
| Public hosting and production domain | **NOT AUTHORIZED / NOT DEPLOYED**; original local v0.8.0 preview preserved |

Verified data checkpoint: **0 real auth users, 0 games, 0 app RLS allow policies**. The actual API/token and permission tests have not occurred; table creation and provider-side Auth config are NOT equivalent to live online play.

### Immediate implementation / acceptance sequence
1. Implement a trusted persistent service: validate Better Auth session/JWKS server-side (issuer/audience/expiration), separate DB credentials from browser, derive identity only from verified session; stage behind scoped endpoints.
2. Implement transactional Postgres game state (atomic `SELECT FOR UPDATE` or serializable), idempotent unique request IDs, server-time clocks, legal chess moves, invite/use-once/reconnect handling.
3. Add secure user-scoped read/write policy or server-only role with proof of deny-by-default/outsider denial; do not open public tables or unguarded Realtime live queries.
4. Test genuine verified email OTP signup/signin and **two independent users** on staging, real game persistence and forbidden third-user access; record real HTTP/DB E2E evidence, rate limiting and privacy tests.
5. Preserve B8 owner/human acceptance gates; GitHub source merge #7 is complete, **but public hosting, authenticated deployment, production DB writes and final release still require distinct authorization and QA**.

## Recommended architecture, deliberately provider-bound only at the edge

```text
HTTPS static site (game UI + chess.js + Stockfish WASM browser-local)
 |  authenticated token with verified subject (NO simulated x-demo-user)
 v
Neon Function / server-side trusted API (verify Managed Better Auth session)
 |  transactional SELECT FOR UPDATE; validate turn/PGN/clock/result/idempotency
 v
Neon Postgres  [invites, games, moves, private progress]
 |
 +-> Authorized polling every 1-2 seconds for first 5-10 users
     Later optional secure per-game websocket; Neon Realtime beta live queries
     must not expose private match data without proven authorization.
```

### Security contract (mandatory release blocker until proven)
- Every API endpoint checks token/JWT signature, issuer, audience, expiration and validated `sub`; never accept caller identity from JSON/header aliases, URLs or user editable local storage as proof.
- Invites: recipient (or properly signed short-lived invite token), expiry, single use, two distinct users, no enumerable invitation metadata.
- Single point of authority: server computes chess.js move legality, PGN, outcome, monotonic revision and clock from trusted time; client may display clock but cannot write it. Server performs all validations under a serialized database transaction with row lock, atomic move and idempotency insert; malicious double submits must return same result or version conflict.
- Private data: deny access to users not in game; no direct read policy for unscoped Realtime; users can access only their own profile/progress. `pvp/neon-schema.proposal.sql` was **applied once to the isolated staging database** with owner's B9 integration scope; all 4 RLS/FORCE RLS tables and **zero policies** independently read back. Its filename remains a historical source artifact; do not reapply blindly, and do not imply production migration.
- No engine analysis/hints/undo during active human fair play. Postgame analysis only after canonical terminal result; do not call browser-fabricated PGN a competitive result.
- Account/local progress migration: opt-in import; keep local original; stable IDs + JSON schema validation + dedupe; never allow client to forge a global rating. PvP rating separate from B6 local AI Ladder Index and not automatically Elo.
- HTTPS only in production; appropriate CORS/CSRF, CSP, rate limits, input limits, origin protections, sanitized errors, log minimization, account deletion and backup policy.

## Release gates
| Gate | Target / evidence | Current at authoring |
| --- | --- | --- |
| B9-A | In-memory legal PvP state machine, strict turns/server time | **PASS 27/27** domain tests in #403; synthetic only |
| B9-B | Isolated loopback HTTP with unauthorized/duplicate request rejection | **PASS 15/15** in #403; synthetic only |
| B9-C | Two independent real Chromium contexts, localhost, mobile, reload | **PASS 11/11** in #403; **no actual Neon Auth** |
| B9-D1 | Neon Staging PostgreSQL schema, fail-closed RLS | **PASS**: 4/4 tables present with RLS+FORCE, 0 allow policies |
| B9-D2 | Better Auth provider configuration | **PASS**: enabled, email/password+mandatory email OTP verified by readback, 9 auth tables |
| B9-D3 | Trusted authenticated durable transactional DB adapter | **BLOCKED**: not yet built/verified |
| B9-E | Two **real authenticated** Neon users and persistent DB E2E | **BLOCKED**: no real OTP token/login and cloud sessions |
| B9-F | Secure per-game live updates, outsider/negative E2E, rate limits | **NOT TESTED** against cloud; local denial only |
| B9-G | Owner PC/phone UAT, deployment and production decision | **NOT TESTED / requires explicit approval** |

## Provider reference
- https://neon.com/blog/whats-new-with-the-neon-backend (2026-11-10; Auth, Functions, Postgres)
- https://neon.com/blog/neon-now-has-realtime (2026-10-15; public beta; live-query RLS limitation)
- https://neon.com/blog/a-postgrest-compatible-data-api-now-on-neon (Data API and RLS)
- https://handbook.fide.com/chapter/E012023 (6.9 flag fall and no possible mate exception)

**Boundaries:** only isolated Neon **staging** schema and owner-authorized Better Auth configuration were modified; no production database, public site, user records or unrelated projects. **Owner-authorized PR #7 merged Chess Odyssey source into main; no public runtime deployment occurred.** Live authenticated PvP is NOT ready. Version `v0.9` is current development phase only. See [current status](CURRENT_STATUS.md).
