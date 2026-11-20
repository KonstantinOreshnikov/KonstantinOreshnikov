# Chess Odyssey QA Ledger

Date: 2026-11-21
Branch: game/chess-odyssey-v0.1
Scope: B0 + B1 first implementation
Evidence: GitHub source readback and JavaScript V8 runtime tests, not a rendered browser.

## Executed runtime verification: 15 PASS / 0 FAIL
1. Start position perft(1) = 20 — PASS.
2. Start position perft(2) = 400 — PASS.
3. Start position perft(3) = 8,902 — PASS.
4. Illegal e2-e5 rejected; unchanged FEN — PASS.
5. Fool's Mate detected — PASS.
6. White kingside castling king g1 and rook f1 — PASS.
7. En passant move e5xd6 and d5 cleared — PASS.
8. Queen promotion — PASS.
9. Knight underpromotion — PASS.
10. Threefold repetition — PASS.
11. Stalemate sample position — PASS.
12. Bare kings insufficient material — PASS.
13. Academy Qxf7# lesson sequence — PASS.
14. PGN save/load FEN equality — PASS.
15. Application parsed and QA API returned 20 moves, correct lesson IDs, balanced starting position — PASS.

Actual source fetched through GitHub connector: chess.js upstream vendored blob SHA 120494d6ace6c522cc71aa4f0a764938b196f94c; custom app blob SHA 8669024e6fec3bd431dcbe17381898cd83a8bb61 at the time of test.

## Release-blocking gates
- Real Chromium E2E workflow result: NOT TESTED / not yet obtained. Browser script and Actions YAML being present do not count as PASS.
- Complete game from new game to win/loss/draw with UI: NOT TESTED.
- Promotion selection UI and board on desktop/mobile: NOT TESTED.
- Full RU/EN/AZ semantic checker: NOT TESTED.
- Human review of educational hints: NOT TESTED.
- Internal rating and reputation: NOT IMPLEMENTED (out of B0/B1 scope).
- Stockfish, strong 6-level AI: NOT IMPLEMENTED (out of B0/B1 scope).
- v1.0 production deployment: BLOCKED.

## Known risk / improvement backlog
- Shallow search recommendations may miss tactics; show as introductory candidate ideas only.
- Entering an academy exercise replaces the visible practice board; returning to the prior practice session needs a dedicated UX path.
- Undo after recorded terminal result should protect statistics against double-counting; track and test.
- Need browser-level validation of HTML interactions, accessibility, responsive overflow and auto-save.
- Existing third-party chess.js v0.10.3 is not latest; retain pinned license/provenance and evaluate safe upgrade separately before full release.

## Next checkpoint
Run actual Chromium E2E or equivalent, fix any observed failures, add regression, then increase coach quality. Never declare v1.0 production-ready based on unit PASS alone.


## Executed GitHub CI chronology and repair evidence

1. Run #17 (ID 44810865705), PR #7, initial browser gate: **FAIL** at synthetic DOM test. Rules script itself 12/12 PASS. Root cause: test counted coordinate labels on empty board squares as pieces, resulting 36 vs 32. Production code was not at fault. Fixed DOM test selector to count only .piece spans in commit e245f95527885934d55e9cf4bc10f373d9e523a2.
2. Run #19 (ID 44810965348): **UNIT + SYNTHETIC DOM PASS** (12/12 + 7/7); browser dependency installation **FAIL** because ubuntu-latest resolved to Ubuntu 26.04, which Playwright 1.57.0 did not support for Chromium installation. Fixed CI to pin ubuntu-24.04, commit 4af9b82038c839ba4e6ac4cc4762dcd9d3cde712.
3. Run #21 (ID 44811071040), head 4af9b82038c839ba4e6ac4cc4762dcd9d3cde712: **UNIT 12/12 PASS; SYNTHETIC DOM 7/7 PASS; REAL CHROMIUM E2E 10/10 PASS.** Browser test checked initial piece count, legal targets, player/AI move, reload persistence, undo, academy lesson, AZ/EN switching, black-side AI first move and mobile horizontal-overflow absence. Logs and step status read back from GitHub Actions.

Verified CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44811071040

**Remaining NOT TESTED:** promotion dialog interaction, entire games with UI to victory/loss/draw, all special moves in UI, independent RU/EN/AZ full proofreading, accessibility audit and advanced AI pedagogy. Release gate remains BLOCKED.

**Operational limitation:** GitHub Issues are disabled in this repository (API returned 410 on issue creation). Use this QA_LOG and ROADMAP plus draft PR #7 as the interim error/feature tracker; do not falsely claim an issue was created.


4. Run #35 (ID 44811717245), with docs-only CI suppression and versioned standalone coverage: **Offline 12/12 PASS, synthetic DOM 7/7 PASS, Chromium 12/12 PASS.** Two added browser assertions verified the self-contained dist/ChessOdyssey_v0.1.1_PREVIEW.html opens with all 64 squares and accepts a legal e2-e4 move in real Chromium. Head code/test revision: 7ee8625adc0542b8589e2ab7f7ce2eb61387506f. Logs read back with no exit-code error.

Latest verified CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44811717245


## B2 — Coach 2.0 QA (21 November 2026)

**Scope:** coach-engine.js two-ply hints, legal SAN and opponent replies, risk notices, move grading, top-three review, PGN-bound saved notes, RU/EN/AZ explanations and standalone version 0.2.1.

| Run / source | Verification | Result |
| --- | --- | --- |
| B2 candidate evaluator and unit checks | legal lines for white and black, mate in one, hanging queen, classification, invalid SAN, FEN not modified | 8/8 PASS |
| GitHub Actions run #54, ID 44814480716 | chess rules 12/12 and B2 coach 8/8 PASS; synthetic DOM fixture failed due incomplete replaceChildren() emulation | FAIL at DOM, correctly recorded |
| Fix 06fdbda38715b392f35620423a4234404d2e1d91 | implement native replaceChildren() zero-argument behavior in synthetic DOM | Corrective commit |
| Run #56, ID 44814572577 | Node rules 12/12, B2 coach 8/8, synthetic DOM 9/9, real Chromium 18/18 | PASS, logs read back |
| Run #60, ID 44814804891 | rules 12/12 + coach 8/8 + postgame 5/5 + DOM 9/9 + Chromium 18/18 | PASS, logs read back |
| Run #68, ID 44815128576 | removal of fileRank() (mistakenly judged dead) broke board render; production code regression detected by postgame test | FAIL; not concealed |
| Fix d3a79f0c8de6a6804d79e1a48aec805cfbea7ada | restore fileRank() required by board rendering; distribution v0.2.1 re-bundled | Corrective commit |
| Run #72, ID 44815259494 | regression after fileRank restoration and current distribution bundle | PENDING until GitHub logs confirm result |

**Release boundary:** B2 unit / browser evidence is not a v1.0 release signoff. Full-length game E2E across outcomes, promotions in UI, strong engine / six levels, all planned Academy lessons, full independently checked RU/EN/AZ, performance/UX accessibility and production signoff remain NOT TESTED or NOT IMPLEMENTED. No merge or production deploy.
