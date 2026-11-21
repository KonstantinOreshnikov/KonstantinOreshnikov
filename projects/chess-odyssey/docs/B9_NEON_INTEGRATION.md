# Chess Odyssey B9 — Server-authoritative PvP + Neon integration contract

**2026-11-21 | IMPLEMENTATION IN PROGRESS | NOT DEPLOYED | NOT LIVE AUTH CERTIFIED**

## Product and non-negotiable requirement
Owner intent: 5–10 invited players learn in Academy, practice against local Stockfish, and then compete in live Player vs Player on the same website. Human PvP belongs in **v1.0**, not deferred to v1.1. Existing B0–B8 local game/offline distribution retained.

## Capabilities available now (offline development)
- `pvp/match-service.cjs` contains a deterministic, server-owned game state machine. All actions require actor identity resolved outside request payload: invite, acceptance/decline, legal turn-based moves, canonical PGN/FEN, request idempotency, revision concurrency checks, server-time clock debit/increment, timeout, resignation, draw offer/accept, rematch.
- `pvp/dev-server.cjs` and `pvp/demo.{html,js,css}` are **unsafe synthetic tests only**. To start locally: `CHESS_ODYSSEY_PVP_DEV=1 node pvp/dev-server.cjs`. It binds 127.0.0.1:8781, has no persistence, accepts easily spoofed `X-Demo-User` headers and **refuses to run under NODE_ENV=production**. NEVER deploy or publicly proxy it. Open two tabs `/demo?user=alice` and `/demo?user=bob`; separate browser contexts verify independent views.
- Test coverage: `tests/b9-match-service.cjs`, `tests/b9-http.cjs`, `tests/b9-browser.cjs`; status only per most recent actual GitHub CI. A green synthetic browser is NOT Neon Auth/DB E2E.

## Deployment prerequisites / owner action (BLOCKED until account exists)
1. **Owner creates Neon account** via https://console.neon.tech/ and verifies email/SSO. The assistant cannot complete personal registration, ownership confirmation or ToS on behalf of the owner without owner action.
2. Owner connects the **Neon plugin for ChatGPT** or grants access to a specifically scoped non-production project; no database credentials should be pasted into this chat. Do not embed a database URL or admin keys in browser JS or GitHub.
3. Owner approves creation of an **isolated development/staging Neon project**, region and quota. Current code does not assume a Neon project already exists.
4. Evaluate the live Neon plan, Managed Better Auth settings, Functions / Data API / Realtime beta region support and costs. Only then choose real auth and data adapter.
5. **Separate explicit authorization** required before applying schema to a live/production database, changing authentication policies or production deploying. Staging API/DB implementation subject to owner scope and security QA.

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
- Private data: deny access to users not in game; no direct read policy for unscoped Realtime; users can access only their own profile/progress. Schema proposal `pvp/neon-schema.proposal.sql` is NOT an executed migration; it enables default-deny RLS pending verified Neon roles and SQL policies.
- No engine analysis/hints/undo during active human fair play. Postgame analysis only after canonical terminal result; do not call browser-fabricated PGN a competitive result.
- Account/local progress migration: opt-in import; keep local original; stable IDs + JSON schema validation + dedupe; never allow client to forge a global rating. PvP rating separate from B6 local AI Ladder Index and not automatically Elo.
- HTTPS only in production; appropriate CORS/CSRF, CSP, rate limits, input limits, origin protections, sanitized errors, log minimization, account deletion and backup policy.

## Release gates
| Gate | Target / evidence | Current at authoring |
| --- | --- | --- |
| B9-A | In-memory legal game state machine, no client-side authority | implemented, CI evidence pending |
| B9-B | Isolated HTTP synthetic two-users, rejected outsider, replay/race/time | implemented, CI evidence pending |
| B9-C | Two real independent Chromium sessions on localhost, mobile and reload | implemented, CI evidence pending |
| B9-D | Neon project, Managed Better Auth and transactional DB adapter | BLOCKED: Neon not registered/connected |
| B9-E | Two **real authenticated** Neon users and persistent DB E2E | BLOCKED: requires B9-D |
| B9-F | private live updates, security negative E2E, rate limits | NOT TESTED |
| B9-G | owner PC + phone UAT and explicit production release approval | NOT TESTED / separately authorized |

## Provider reference
- https://neon.com/blog/whats-new-with-the-neon-backend (2026-11-10; Auth, Functions, Postgres)
- https://neon.com/blog/neon-now-has-realtime (2026-10-15; public beta; live-query RLS limitation)
- https://neon.com/blog/a-postgrest-compatible-data-api-now-on-neon (Data API and RLS)
- https://handbook.fide.com/chapter/E012023 (6.9 flag fall and no possible mate exception)

**No production release, no main merge, no live DB writes and no real security-policy changes authorized here.**
