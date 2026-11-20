# Chess Odyssey — Changelog

## 2026-11-21 — Development Preview v0.1
- Started dedicated branch game/chess-odyssey-v0.1 from earlier docs concept branch.
- Preserved approved owner concept under docs/ORIGINAL_CONCEPT_2026-11-20.md.
- Vendored chess.js v0.10.3 with original BSD-2-Clause notice.
- Built responsive 8×8 board, highlighted legal moves, game history, side switching, board flip, promotion picker and no chess clock.
- Added non-random shallow-search opponent with two deliberately weak levels and basic contextual coach.
- Created three interactive board lessons, including verified Qxf7#.
- Added RU, EN and AZ interface text, local save/restore, practice stats, undo and no-rated mode.
- Added deterministic 12-case Node smoke script, 10-check Playwright browser E2E and GitHub Actions workflow.
- Fixed real chess.js board() API integration issue (board pieces do not carry square attribute in v0.10.3).
- Ran 15 isolated V8 source-backed checks: 15 PASS; real browser E2E still unverified.
- State: DEVELOPMENT PREVIEW ONLY; no merge, release or deploy.


## 2026-11-21 — Preview v0.1.1 (B1.1)
- Added Return to Game after lessons without overwriting parked practice PGN, and corrected terminal-result accounting on practice Undo.
- Distributed refreshed self-contained offline HTML under dist/ChessOdyssey_v0.1.1_PREVIEW.html.
- Added a synthetic DOM regression test, created scoped AGENTS.md for Unlazy / Reuse First / Humanizer / Translation QA and opt-in Grill Me.
- GitHub Actions red/green: #17 failed due to DOM test counting coordinates; fixed test. #19 passed Unit/DOM but failed browser installation on Ubuntu 26.04; pinned Ubuntu 24.04.
- **Run #21 PASS:** Node rules 12/12, synthetic DOM 7/7, real Chromium 10/10.
- Remaining v1.0 gates explicitly incomplete; production untouched.
