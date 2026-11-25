# Chess Odyssey v1.1.3 — deployed production UAT candidate

**Current web version: v1.1.3 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733). Practice HUD parity with PvP: side clocks, turn, captured pieces, last move, replay-aware information and thinner arrows. Real production UAT, latency and independent human/device acceptance remain open. Latest permanent prerelease v1.1.1; latest non-prerelease tagged package v1.1.0. v1.1.3 ZIP is a verified temporary CI artifact. No server, database or security-policy change.

## Changes

[Detailed feedback, implementation and QA](PRACTICE_HUD_V1_1_3.md). Align Practice/AI with PvP: left desktop HUD, compact mobile cards, turn/last move, grouped captures, replay-aware display, clock captions, thinner analysis arrows, RU/EN/AZ. Preserve gameplay, Stockfish, lessons, saves and existing PvP.

## Evidence

- Runtime source `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92` ([PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31)); owner authorized production website update and detailed documentation.
- [Focused CI 45670474986](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986): 24/24 mocked-transport PvP/header E2E PASS; includes real Stockfish analysis, two-browser recovery, grouped captures and targeted localization. This does not prove real Neon production PvP acceptance.
- [Full CI 45670473640](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640): 3/3 PASS: Offline, Chromium and Windows launcher/WASM. Practice UX 19/19 (including HUD history/flip/captures/reload and 1440/1280/390/320 layout), clocks 12/12, actual Stockfish 11/11, mocked PvP 24/24. [PR Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473790) and [studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473820) PASS. PR deploy skipped as expected.
- [Verified temporary v1.1.3 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986/artifacts/15049262390): 152 files, 2,063,096 bytes, SHA-256 `406a0650327912f24b5fbd332e4de097ce07078e387072a442d912eb9a26bcf6`; outer CI archive SHA-256 `7c33e12a3cde5c2ddb1feebe1474982d6b6f3c33cd673e609c2d9bfa8ae5a262`. Artifact expires 2026-12-25 18:02:02 UTC. No permanent v1.1.3 archive claimed.
- Production deployment: [Pages run 45673333733](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733) 3/3 PASS, merge `adf7132d79f60066e2cd528cbe446ff22e94abad`, zero file delta from tested `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92`. Independent direct browser readback not recorded; real user acceptance remains OPEN.

## Release boundary

Owner authorized deployment for real acceptance; deployment completed. No stable acceptance or permanent archive publication claimed. [Development history](DEVELOPMENT_HISTORY.md).
