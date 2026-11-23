# Chess Odyssey v1.0.0 — Public Release

**Official GitHub Release:** https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.0.0
**Permanent ZIP SHA-256:** `f115a80859502a0c9c5610813a1d513a17c7b3314559f6a273002367b85193a4` (2,027,337 bytes)
**Date:** 24 November 2026  
**Public game:** https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/  
**Windows / Stockfish package:** https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.0.0/ChessOdyssey_v1.0.0_Stockfish_Preview.zip.  
**QA:** https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329

## Highlights

- Complete browser chessboard, six AI levels, time controls and genuine Stockfish-based game analysis.
- **33 Academy lessons** with mobile-friendly controls, near-board lesson navigation, hints and progress.
- **300 full historical games**: 31 curated annotated lessons (116 critical-move comments) plus 269 additional sourced World Championship move scores from 1886–2024, for independent replay. The extra 269 are *not* presented as author-annotated analyses.
- RU, EN and AZ interface, 10 board styles, 10 piece sets and post-game review.
- Email/password + email OTP registration, account progress UI and invite-based online friend play using the already connected Neon integration.

## Verified release baseline

- [Automated CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329) (unit/integration; real Chromium UI E2E; Windows launcher and Stockfish/WASM).
- [Live independent browser smoke PASS](https://agent.tinyfish.ai/runs/ad1e13fb-00f5-4e26-a235-cd9013ae371d): 8×8 board, 33 lessons, 300-game catalog, filters 269/31 and game replay.
- Neon read-only checks at release preparation confirmed a registered user with a server-owned 33/33 Academy record (revision 36), without accessing or modifying account data.

## Known risks explicitly accepted by the owner for release

The owner requested publication **before** the remaining live E2E tests. These are **OPEN**, not implied PASS:

1. Multi-device cloud reload/autosave and competing revision conflict (CAS).
2. Live two-player PvP, invitations, reconnects, clocks and third-user authorization-denial tests.
3. Independent RU/EN/AZ pedagogical review, physical Android/desktop UAT and all appearance combinations.
4. A dedicated production-isolated Neon backend has not been established. Public GitHub Pages connects to the existing Neon staging service. The release did **not** alter Neon production data, user accounts, deployed Function #4, auth policy, or secrets.

**Rollback:** pre-release published version was commit `c7d5786a0b80664c9d9e5a7133fff841b339b144`; the historical local v0.8.0 ZIP remains in source. Preserve current server-owned user progress. Review open risks in [current technical status](CURRENT_STATUS.md).

## Maintenance

Follow-up authenticated cloud, PvP and security tests are tracked in the [v1.0 post-release QA register](POST_RELEASE_QA_V1_0_0.md); do not backdate their outcomes as release validation. The user authorized merge to `main` and production GitHub Pages publication on 24 November 2026.
