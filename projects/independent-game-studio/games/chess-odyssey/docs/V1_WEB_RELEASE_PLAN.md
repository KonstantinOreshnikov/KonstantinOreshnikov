# Chess Odyssey v1.0 — staged implementation and release gates

## Verified Phase 1 QA checkpoint (2026-11-23)

- GitHub branch `feature/chess-odyssey-v1-foundation-20261123`, tested source commit `dd5b2af0ac43caf0070ed99029655bcdc42c2f64` (PR #20 DRAFT, not merged/deployed).
- [Chess QA #45133287865](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287865) **3/3 jobs PASS**: offline Node/unit, Chromium real display and 10-style selection, Masters, historical tests, actual Windows launcher/Stockfish WASM. Earlier red [#45132878410](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45132878410) failed in a new test due forbidden fetch(file://SVG); repaired with SVG Image.onload validation. No chess-state semantics were changed.
- [GitHub Pages package run #45133287871](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287871) **6/6 PASS** including 96 same-origin SVG assets, engine, notices and no synthetic backend/secrets. [Studio smoke #45133287855](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287855) **PASS**.
- [Download compiled P0-P2 + SVG preview](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287865/artifacts/14799470086); 146-file Stockfish ZIP with 96 SVGs, original CSS preview and offline standalone. Both ZIP layers downloaded and CRC-checked: no errors.
- **OPEN:** live GitHub Pages site and URL not confirmed; Neon staging Functions empty, Data API disabled, Auth E2E zero verified users, four protected game tables RLS+FORCE RLS and zero permissive policies; genuine cloud statistics/PvP and owner device/linguistic QA remain unverified. No production release.

**Approved direction (2026-11-23):** production-grade single website, 8–10 genuinely different licensed SVG chess piece sets, GitHub-hosted static UI with on-device Stockfish WASM, Neon authenticated user statistics and durable private friend PvP. Reuse v0.9.0 code, do not replace it.

## Verified baseline / PRECHECK
- `main` at `e9484d31b2484dbd99e938210289d60cfedebeb5`; last packaged v0.9.0 main QA **3/3 PASS**, plus historical v0.8.0 rollback.
- Neon project `wild-hall-05832800`, database `chess_odyssey`, branch `br-still-credit-b9voxawu`; tables `chess_odyssey.games`, `invites`, `moves`, `user_progress` exist, **RLS and FORCE RLS ON; 0 policies; 0 game/invite/move/progress records**.
- Neon Auth email/password + email OTP exists on staging with localhost permitted, trusted origins empty. Data API disabled, Functions empty. **Not a verified production backend**.
- PvP `pvp/dev-server.cjs` trusts spoofable `X-Demo-User` and is **never deployable**; only `pvp/match-service.cjs` logic is reusable after secure adapter.
- GitHub Pages site status/settings unavailable via current GitHub connector; **live URL is NOT verified**. Publishing workflow is manual until Pages is explicitly configured, to avoid replacing an existing Pages site.

## Work packages, checkpoints, acceptance
| Gate | Work package | Accept only after |
| --- | --- | --- |
| V1-WEB | Isolated allowlist static bundle, `chess-odyssey/` URL path, HTTPS GitHub Pages | 5/5 package tests, genuine browser HTTPS/WASM Game Review, no dev server or secrets, verified live URL |
| V1-ART | 8–10 **actual distinct licensed SVG drawing sets**, not Unicode/CSS filter aliases; visual catalog and full board previews | License/source register and hashes; 12 assets/set; selection/reload, Practice/Masters parity; Chrome/Android visual contrast |
| V1-AUTH | Auth via Neon Better Auth, signup/signin email OTP and trusted HTTPS origins | Real two-user auth, server-side validated identity; third-user and replay/CSRF tests |
| V1-DATA | Protected user-owned stats/progress and opt-in non-destructive local import | Server-side dedupe, atomicity, exact denominators, reload/cross-device and third-user denial |
| V1-PVP | Trusted Neon Functions API + persistent transaction/locks + private invites; never expose `X-Demo-User` | Real two-account invite/game/move/rematch/reconnect; negative API/RLS rate-limit, clocks and simultaneous requests |
| V1-QA | Complete desktop/Android/browser, independent RU/EN/AZ education, accessibility, game-review safety, security+privacy | Evidence-backed PASS; no release on BLOCKED or FAIL |
| V1-RELEASE | Production account/origin config, domain, rollback, backup/recovery, deploy | Dedicated release approval after test evidence; staging != production |

## Hosting contract
- GitHub repository remains source authority. Static preview is packaged with `scripts/build-pages.cjs`; only explicit browser assets are copied. GitHub Pages preview deploy is **manual `workflow_dispatch` from `main`**, after Pages settings are enabled and Pages is confirmed not to override another site.
- Expected project-site route, **NOT yet tested**: `https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/`. Never claim this is active until live HTTP + browser verification.
- Engine WASM runs in a same-origin Worker on HTTPS; **Neon is not needed for local Stockfish review**.
- Neon Functions will hold trusted API identity, transactional chess state and progress; Postgres credentials and signing secrets must stay server-side. No wildcard public RLS policies or client SQL credentials. Staging is isolated.
- Production release requires separate proof of auth, real PvP/DB, 100 style combinations and owner UAT, not just a green synthetic GitHub workflow.
- Do not touch CBA Examinations Platform, other games, legacy archives or `main` without a verified QA and the release approval boundary.
