# Chess Odyssey v1.1.3 — Practice HUD feedback, implementation and QA

**v1.1.3 Practice HUD — production publication authorized; final regression/deployment evidence pending.** [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused CI PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640). Published v1.1.2 remains the verified web baseline until deployment succeeds. Owner requests PvP-style Practice conveniences; no runtime server or database policy changes.

## Feedback and scope

Owner feedback after a completed Practice match: bring the same convenience as PvP to Practice, including clocks, turn, captured pieces and move history. The prior layout placed clocks above the board and had room for a sidebar. The screenshot also showed existing Stockfish analysis, which is preserved. No personal game score or screenshot is included.

| ID | Owner feedback / requirement | Implementation and scope | Verification |
| --- | --- | --- | --- |
| UX-113-01 | Practice clocks and player information above board use space inefficiently | Desktop left HUD; compact above board on smaller screens, orientation-aware White/Black order; same canonical clock state | Full browser gate pending; physical PC/mobile UAT open |
| UX-113-02 | Need clear turn and move information as in PvP | Absolute side to move, active-color arrow, latest SAN with correct side, existing from/to highlight; no active turn at finished position | Targeted Practice E2E in full suite pending |
| UX-113-03 | Show captured figures by original color with ×N | Counts derived from verbose history, cut at replay cursor; no material-count guesses; untimed games and lessons retain HUD | Grouped pawn/queen and history cursor cases in full suite pending; special capture/promotion coverage not exhaustive |
| UX-113-04 | Make review and replay easier | Board and controls share column, thinner arrows, capture/turn reflect viewed position. Clock remains actual live/final time, never fabricated historical snapshots | Full replay and clock regression pending |
| UX-113-05 | RU/EN/AZ and mobile consistency | New labels, piece tooltips/aria, active turn, clock captions, wrap chips; compact layout | 3-language and 1440/1280/390/320 viewport checks in full suite pending; independent semantic review open |

## Technical implementation

- `index.html`: board/replay column and color-specific HUD cards; existing clock and analysis IDs retained.
- `app.js`: read-only derived HUD from actual move history, viewed position and flip; live clock remains governed by ChessClock, untimed shows a dash, replay time labels distinguish current/final time; no scoring or saved-game schema mutation. Current history read once per board render.
- `styles.css`: responsive grid, grouped piece chips, active-side arrow, board-aligned controls, thinner arrows.
- `tests/p0p2-browser.cjs`: new Practice HUD history/flip/language/layout/reload fixture; `tests/b8-clock-browser.cjs`: updated untimed HUD expectation. Existing PvP gates and Stockfish remain required.

## Evidence

- Runtime source `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92` ([PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31)); owner authorized production website update and detailed documentation.
- [Focused CI 45670474986](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986): 24/24 mocked-transport PvP/header E2E PASS; includes real Stockfish analysis, two-browser recovery, grouped captures and targeted localization. This does not prove real Neon production PvP acceptance.
- [Full CI 45670473640](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640): offline PASS; Chromium/Windows final conclusion pending at this checkpoint. [PR Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473790) and [studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473820) PASS. PR deploy skipped as expected.
- [Verified temporary v1.1.3 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986/artifacts/15049262390): 152 files, 2,063,096 bytes, SHA-256 `406a0650327912f24b5fbd332e4de097ce07078e387072a442d912eb9a26bcf6`; outer CI archive SHA-256 `7c33e12a3cde5c2ddb1feebe1474982d6b6f3c33cd673e609c2d9bfa8ae5a262`. Artifact expires 2026-12-25 18:02:02 UTC. No permanent v1.1.3 archive claimed.
- Production deployment and final user acceptance: pending at this checkpoint. Existing v1.1.2 remains published.

## Acceptance

Production candidate must preserve prior real UAT backlog; no claim of complete localization or network acceptance. Owner home test: Practice and PvP, timed/untimed, both colors, flip, capture groups, replay, F5, lessons, Stockfish, desktop/mobile. No changes to Neon data, security or stored progress.
