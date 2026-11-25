# Chess Odyssey v1.1.3 — Practice HUD release candidate

**v1.1.3 Practice HUD — production publication authorized; final regression/deployment evidence pending.** [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused CI PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640). Published v1.1.2 remains the verified web baseline until deployment succeeds. Owner requests PvP-style Practice conveniences; no runtime server or database policy changes.

## Changes

[Detailed feedback, implementation and QA](PRACTICE_HUD_V1_1_3.md). Align Practice/AI with PvP: left desktop HUD, compact mobile cards, turn/last move, grouped captures, replay-aware display, clock captions, thinner analysis arrows, RU/EN/AZ. Preserve gameplay, Stockfish, lessons, saves and existing PvP.

## Evidence

- Runtime source `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92` ([PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31)); owner authorized production website update and detailed documentation.
- [Focused CI 45670474986](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986): 24/24 mocked-transport PvP/header E2E PASS; includes real Stockfish analysis, two-browser recovery, grouped captures and targeted localization. This does not prove real Neon production PvP acceptance.
- [Full CI 45670473640](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640): offline PASS; Chromium/Windows final conclusion pending at this checkpoint. [PR Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473790) and [studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473820) PASS. PR deploy skipped as expected.
- [Verified temporary v1.1.3 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986/artifacts/15049262390): 152 files, 2,063,096 bytes, SHA-256 `406a0650327912f24b5fbd332e4de097ce07078e387072a442d912eb9a26bcf6`; outer CI archive SHA-256 `7c33e12a3cde5c2ddb1feebe1474982d6b6f3c33cd673e609c2d9bfa8ae5a262`. Artifact expires 2026-12-25 18:02:02 UTC. No permanent v1.1.3 archive claimed.
- Production deployment and final user acceptance: pending at this checkpoint. Existing v1.1.2 remains published.

## Release boundary

Owner authorized deployment for real acceptance. No stable acceptance or permanent archive publication claimed. [Development history](DEVELOPMENT_HISTORY.md).
