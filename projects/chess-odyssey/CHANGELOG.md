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
