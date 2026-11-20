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

- QA enhancement: isolated 64-square and legal e2-e4 Chromium checks on the actual single-file distribution; run #35 PASS (Node 12/12, DOM 7/7, browser 12/12).
- CI efficiency: skip documentation-only changes and cancel obsolete same-branch runs.

## 2026-11-21 — B2 Coach 2.0 and patch v0.2.1
- Reused existing chess.js legal move engine; added custom deterministic coach-engine.js with full two-ply candidate and immediate-reply analysis and position-preservation checks. No Stockfish dependency or invented Elo.
- Ranked 2–3 candidate moves with legal SAN, an explained purpose and actual legal reply; distinguished capturable piece from forced material loss.
- Added material-and-center heuristic estimates, warning/major/fine review labels, compact contextual hint panel and three-moment player review.
- Added retained local review notes, automatic terminal review, Undo rollback and lesson-session restoration of notes; corrupt/mismatched saved PGN review notes filtered on restore.
- Refreshed coaching explanations and hint candidates when switching RU / EN / AZ. Rebalanced central pawn preference for useful beginner recommendations.
- Created B2 source and tests: coach-engine.cjs, postgame-smoke.cjs, enhanced dom-smoke.cjs and Chromium browser.cjs; bundled standalone v0.2.0 and patch v0.2.1 for rollback.
- CI failure #54: synthetic DOM test fixture incorrectly implemented replaceChildren() with required argument; fixed in commit 06fdbda38715b392f35620423a4234404d2e1d91.
- CI #56: 12 rules + 8 coach + 9 DOM + 18 browser PASS. CI #60: added 5 postgame tests PASS, previous gates remain PASS.
- B2.1 patch CI: see QA_LOG.md for the final verified run. Production v1.0 remains BLOCKED.

## 2026-11-21 — B3 Real Stockfish and six levels · Preview v0.3.0
- Added genuine Stockfish.js 19.0.1 Lite single-threaded JavaScript+WASM from the exact GPLv3 npm release, with full Copying.txt, package provenance, source links, binary sizes and SHA256 checksums. No third-party engine code claimed as ours.
- Added a separate engine-bridge.js UCI Worker adapter: handshake, ready gating, Skill Level/movetime configuration, startup/think timeouts, worker cancellation on new game/lesson/Undo, strict chess.js legal UCI validation and position/epoch guards.
- Added six distinct game levels: Beginner and Novice preserve the gentle local AI; Intermediate (Skill 2/180ms), Advanced (8/350ms), Expert (15/750ms), Grandmaster Challenge (20/1450ms) use the real Stockfish Worker when served through HTTP(s).
- Local file:// single-file mode remains fully playable with an **explicitly labelled weaker fallback**. UI RU/EN/AZ now identifies actual Stockfish vs weaker fallback. No fake rating or official FIDE/Elo estimate.
- Added stockfish UCI and mock-protocol regressions, real Chromium Stockfish WASM E2E, local localhost server, Windows launcher and reproducible single-HTML/ZIP scripts.
- Added docs/ENGINE_B3_DESIGN.md, changed obsolete third-party notes and retained previous versions for rollback. v1.0 remains blocked pending B4–B7.
- Initial B3 CI run #98: rules 12/12, coach 8/8, bridge 7/7, real Stockfish native UCI 1 test, postgame 5/5, synthetic DOM 9/9, Chromium 21/21 and actual Stockfish HTTP-browser 9/9 PASS. Later expanded mate-in-one, all-four-tier and ZIP checks are recorded in QA_LOG.md after verification.

- **B3 QA closure — CI #112 PASS:** rules 12/12 + B2 coach 8/8 + B3 adapter 7/7 + native Stockfish UCI 2/2 (legal opening and Qxf7# mate) + postgame 5/5 + DOM 9/9 + real Chromium prior 21/21 + Stockfish HTTP levels 11/11 = **75/75**. Packaged full GPL engine ZIP, 20 files, SHA256 recorded in QA_LOG; Actions artifact ID 14671266705 (retained until 2026-12-20). Full release remains BLOCKED on B4–B7.

## 2026-11-21 — B4 Full Academy · Preview v0.4.0

- Reused chess.js as the legal-move authority and introduced `academy.js`, a pure educational dataset with **33 exercises in four tracks**: Rules 9, Tactics 8, Openings 8 (four White/four Black), Endgames 8. Total learner moves: 49. Every exercise includes original RU/EN/AZ titles, introductions, stage instructions, verified setup FEN or opening line, expected legal SAN and scripted opponent replies where necessary.
- New track filter, stage-by-stage guidance, wrong-but-legal move rejection, hint with correct SAN, Next Lesson navigation and completion counters by track. Multi-step openings use real scripted legal chess replies; both chess colors play on the normal board.
- Original practice session remains parked during exercises and is restored with PGN, statistics and side/settings. In-progress lesson stage survives reload, reconstructing an exact legal position from the canonical data. B2/B3 game behavior, ratings-off practice and Stockfish Worker cancellation retained.
- Special-action lessons explicitly teach valid kingside castling, en passant, queen promotion and knight underpromotion. New tests reject terminal positions and false teaching goals; tactical pins, forks, skewers, discovered checks and mates are independently asserted with chess.js.
- Added `tests/academy-content.cjs` and `tests/academy-browser.cjs`, plus refreshed B0–B3 regressions. Versioned `dist/ChessOdyssey_v0.4.0_PREVIEW.html`, `START_WINDOWS.cmd`, complete 22-file GPL Stockfish ZIP and SHA256 CI proof.
- Red/green Unlazy trail: CI #148 English teaching prompt too short, fixed; #151 opposition with only kings was an already-drawn game, fixed FEN and future validator; #154 piece selection remained active on failed lesson move, fixed; #157 PGN test ignored turn numbering, fixed test; #159 Chromium download bottleneck, switched to preinstalled real Chrome on GitHub runners with Chromium fallback.
- **CI #166 green:** 99/99 actual tests PASS; ZIP 22 files and integrity PASS; [evidence](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44824986016). Original fail/cancelled runs preserved in QA_LOG.md.
- B4 is a completed **development Preview**, **not** v1.0 production: independent RU/AZ/EN editorial proofread, physical Windows launcher, complete-game outcomes, accessibility and B5–B7 gates still open. No main merge or deployment.
