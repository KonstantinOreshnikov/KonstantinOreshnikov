# Chess Odyssey — Academy & Arena

**Status:** v0.1 DEVELOPMENT PREVIEW — NOT production-ready  
**Branch:** game/chess-odyssey-v0.1  
**Project isolation:** separate from all other games.  
**Last updated:** 2026-11-21.

A local-first browser game designed to teach chess while playing. No chess clock, account, payment, advertisement or external API call.

## Run

1. Open index.html in a modern browser. Keep vendor/chess.js, app.js and styles.css in their relative positions.
2. Choose Beginner (1-ply) or Novice (2-ply), and White or Black.
3. Click a piece, then a highlighted legal square. Ask AI Coach for 2–3 legal options.
4. Choose an Academy lesson: pawn development, knight development or a verified mate-in-one.
5. Use Undo in free practice, choose RU / EN / AZ, flip the board and restore an automatically saved game after reload.

**Honest limitation:** This is a deliberately weak shallow-search opponent, not Stockfish. Its coaching is introductory, not a grandmaster analysis service. No FIDE or independent online rating is claimed.

## Source map

| Path | Purpose |
| --- | --- |
| index.html | Board and semantic controls |
| styles.css | Responsive design and focus |
| vendor/chess.js | Legal rules, moves, checks and draws |
| app.js | AI, coach, lessons, languages, local persistence |
| tests/chess-smoke.cjs | Offline regression |
| tests/browser.cjs | Real Chromium E2E script |
| docs/DEVELOPMENT_PROTOCOL.md | Quality process |
| docs/ROADMAP.md | Blocks and release gates |
| docs/QA_LOG.md | Verified checks and blockers |
| docs/ORIGINAL_CONCEPT_2026-11-20.md | Untouched original concept |

## Source provenance and legal

Rules: upstream jhlywa/chess.js v0.10.3, BSD-2-Clause, copyright notice retained; [original source](https://github.com/jhlywa/chess.js/blob/v0.10.3/chess.js). Git blob SHA: 120494d6ace6c522cc71aa4f0a764938b196f94c.

AI: custom short-depth search. Stockfish is not integrated. Future Stockfish browser builds must observe GPLv3 and complete corresponding source requirements.

Practice progress is stored locally in the browser. No external accounts or telemetry.

## QA status

15 / 15 isolated V8 runtime checks PASSED against the actual GitHub vendor and application code on 2026-11-21, including perft 20/400/8902, illegal move rejection, checkmate, castling, en passant, promotion/underpromotion, threefold, stalemate, insufficient material, the authored lesson mate, PGN round trip and app API smoke.

Browser E2E is NOT VERIFIED, and release QA remains BLOCKED until a real Chromium execution record, full responsive testing and translation consistency validation exist. GitHub Actions workflow is committed, but its successful execution was not yet confirmed.

To run from this project directory: node tests/chess-smoke.cjs. The separate browser script requires Playwright and Chromium.

**No production deploy or merge to main.**
