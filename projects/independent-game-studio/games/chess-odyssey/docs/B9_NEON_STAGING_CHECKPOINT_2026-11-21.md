# Chess Odyssey — B9 Neon staging and Better Auth checkpoint (2026-11-21)

## Live verified scope (NOT production)
- Neon organization: `Konstantin`, ID `org-long-sunset-24638483`, Free.
- New isolated Neon project: **Chess Odyssey — Staging**, project ID `wild-hall-05832800`, region `aws-eu-central-1` (Frankfurt), PostgreSQL 17.
- Actual default branch: `staging`, branch ID `br-still-credit-b9voxawu`, ready.
- Database: `chess_odyssey`, current owner `chess_odyssey_owner`.
- Before migration: verified no existing tables in schema `chess_odyssey`.
- Applied the project-owned proposal in `pvp/neon-schema.proposal.sql` to this **staging** database only, as a single 20-statement transaction; apply returned success, no partial statements.
- After migration, verified **four** relations exist: `chess_odyssey.games`, `chess_odyssey.invites`, `chess_odyssey.moves`, `chess_odyssey.user_progress`. **All four have RLS=true, FORCE RLS=true, zero policies**. No public table permissions were granted.
- This is a **fail-closed schema checkpoint** only. It does *not* imply authenticated access or API connections work. No customer/profile/game records seeded.
- **Historical pre-approval finding:** Neon Auth initially returned HTTP 404 on this branch. This blocker is now **RESOLVED** following explicit owner authorization on 2026-11-21.
- **Neon Auth provisioned:** Better Auth provider, database `chess_odyssey`, authentication schema `neon_auth`. Read-back from `get_auth` and `get_neon_auth_config` verified exact branch, provider, Auth endpoint and JWKS.
- **Staging authentication policy (current verified):** email/password enabled; signup enabled for staging only; email verification is required via **OTP** on signup/signin; automatic signin after verification disabled; password reset revokes all sessions; `allow_localhost=true` for local testing; no custom trusted domains configured. Neon's shared email provider does not support verification links: initial attempt rejected with `INVALID_EMAIL_VERIFICATION_METHOD`; successfully configured native OTP instead.
- **Auth schema read-back:** 9 provider-managed tables in `neon_auth` (`account`, `invitation`, `jwks`, `member`, `organization`, `project_config`, `session`, `user`, `verification`) plus existing 4 application tables. SQL count: **0 auth users, 0 games, 0 game invites, 0 moves, 0 player profiles**.
- **NOT done:** real email delivery / user registration / OTP session tests, authenticated two-user match E2E, security RLS policy grants, deployed Functions, persistent match storage integration, any actual users, host/domain or production. No secrets copied to repository.

## Authorization, risk and acceptance
- User explicitly approved enabling **Neon Auth (Better Auth)** in the isolated Chess Odyssey Staging project and configuring it for testing; approval does not extend to production deploy, unrelated projects or public host.
- Signup is intentionally **open in staging** so genuine email-verified test users can be created; it does not yet implement the desired friends-only authorization/allowlist. Restrict public access at application/API layer before any published preview, and choose signup/allowlist policy before production.
- `allow_localhost=true` is limited to staging; disable for production. `trusted_origins=[]` means no production redirect/host approved.
- Neon Auth was verified through connector configuration and Postgres table metadata, **not** by issuing a JWT or logging in. Do not label authenticated security QA PASS.

## Source and CI evidence
- Tested GitHub branch head for B9 local engine: `d21cc1755791fc55f6df16027a13f8633999f584`, [GitHub Actions #403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027), three jobs all SUCCESS.
- B8: clock-core **32/32 unit**, B8 browser **12/12**, older B0–B7 regression and Windows smoke PASS.
- B9: server-authoritative in-memory match domain **27/27**, loopback-only synthetic HTTP **15/15**, two isolated Chrome contexts / 390px mobile **11/11**. None uses Neon, genuine Auth tokens or a durable transactional backing store.
- The `pvp/dev-server.cjs` sandbox uses a spoofable `X-Demo-User` header and MUST NOT be network-exposed or deployed. It intentionally refuses to start without `CHESS_ODYSSEY_PVP_DEV=1` and refuses NODE_ENV=production. Validated local browser tests do NOT equal authenticated E2E.

## Exact blockers and next gates
1. **Auth provisioning completed (read-back PASS):** user explicitly authorized isolated staging Better Auth. Verified OTP+password config; shared email provider requires OTP, not link. **Still BLOCKED for authenticated E2E** until real signup + email receipt + token/session validation and API integration are tested. Do not commit secrets to GitHub/client.
2. **Security policy design:** per-user access and row membership authorization, token validation, service role isolation, RLS policy verification and reject-by-default tests. Current zero RLS policies are intentionally blocked; not a failure to remediate without trusted auth.
3. **Persistent multiplayer implementation:** connect the unit-tested domain to Neon Postgres via authenticated server Functions/API. Replace process-local Maps with transactional SELECT FOR UPDATE or equivalent, atomic server-time clock and idempotent request IDs, reconnect, private invites and state sync. Current synthetic demo is NOT cloud integration.
4. **Authenticated 2-user E2E:** two genuine accounts, separate devices/browsers, invite/accept/move/timeout/reload/privacy/replay/race tests, status evidence and security checks. Hosting/frontend preview is a later design gate.
5. **B8 human gates open:** owner desktop/mobile UAT, independent RU/EN/AZ semantics, historic secondary-source review and opening additions if appropriate. Do not claim B8 fully finished until signoff.

## Boundary
These changes apply to an isolated staging project only. No production data, existing unrelated Neon/Supabase accounts, CBA/Secret Santa, main branch or unrelated games were modified. Do not call B9 READY or live online PvP PASS before true Neon Auth+DB E2E. The Neon backend and Better Auth configuration are now active; the blocker is **real authenticated API, email/OTP E2E, and user-scoped persistent PvP**, not Neon connection or provisioning permission.
