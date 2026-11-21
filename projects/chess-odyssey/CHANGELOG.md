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


## 2026-11-21 — B5 Masters & Legends complete · Preview v0.5.0

- Researched primary historical chess game source pages, independent ChessDNA corroboration for four complete and two partial game scores, source-register URL/version governance and attribution limits. Imported **31 full recorded historical games, 1,923 chess.js-legal SAN moves (1834–2013)**. Corrected early mismatched source mappings of Byrne–Fischer 1963 and McDonnell–La Bourdonnais 1834 before publishing.
- Wrote **116 original RU/EN/AZ explanatory key moments** (3–4 per selected game, never copied from third-party editorial content); direct source link, player, match year and recorded result preserved. Six score final positions are checkmate; the other recorded wins are not relabelled as mate.
- Introduced `masters-core.js` independent historical full FEN replay, SAN anchor validation, legal quiz options, parseable PGN with source provenance. `masters-ui.js` presents a separate interactive master board, exhaustive SAN timeline, scrubber, autoplay, keyboard, theme filters, player search, bookmark and restore, PGN download, RU/EN/AZ switch and legal `Guess historical move` challenges. Master and practice/Academy sessions have separate state.
- Added source-authority `docs/MASTERS_B5_SOURCE_REGISTER.md` and `docs/MASTERS_B5_DESIGN.md`, `data/masters-source-scores.json`, three original trilingual note modules, B5 unit and real Chrome E2E tests. Updated versioned one-file `dist/ChessOdyssey_v0.5.0_PREVIEW.html`, ZIP workflow and Windows launcher; B0–B4 artifacts retained.
- Recorded red→green failures: CI #197 old blanket external-URL test (source citations now allowed, remote scripts still banned); #199 ambiguous unscoped square selectors from new independent board; #204 test incorrectly clicked intentionally disabled first button at ply 0. Exact repairs in QA_LOG.md.
- **CI #206 PASS: 135/135 executable tests**, real Chrome historical UI and legal quizzes, 31-file CRC-checked GPL Stockfish ZIP. [QA evidence and package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44829450536). No main merge, no production deploy, no invented FIDE Elo.
- Source confidence disclosed: complete second-source independent matching confirmed only for 4 games; 2 partial; remaining 25 not independently matched across complete external archives. Independent human RU/EN/AZ editorial QA, full history provenance adjudication, B6 progression and B7 v1.0 release gates remain OPEN.


## 2026-11-21 — B6 Player Progress & Reputation · Preview v0.6.0

- Added third **My Progress** tab with genuine local RU/EN/AZ learning indicators: 33 stable Academy lessons by four tracks, 31 curated master-game studies, 116 source-bound critical moments, 16 unique achievements, anti-farming Academy Reputation, separate independent-match W/D/L.
- Introduced pure `progress-core.js` with source-reconciled event grains and deterministic point schema: 20 per unique completed Academy lesson, 4 per unique historical moment, 12 per unique solved historical quiz, 20 per full study (all highlighted positions **and** final ply), 15 per first win at each eligible bot tier. Repeats award zero.
- **Independent game mode** (opt-in) adds no-live-help policy: hints, two-ply grading, legal-destination highlights, Undo, Academy entry and game-time review disabled. Full-game postgame analysis is available only after completed match, with no retroactive change to independent score.
- **AI Ladder Index 0–100 (not Elo/FIDE):** actual finished chess.js PGN, known side/level and terminal outcome; exclude practice, guided games, duplicate IDs, hint/Undo/abandonments and weaker Stockfish fallback. Minimum 5 games before display; rolling last-20 denominator; provisional for under 20. Explicitly local, uncalibrated and not comparable across other players or online platforms.
- Versioned `chess-odyssey-progress-v1` ledger is separate from B1–B5 `chess-odyssey-v01` and `chess-odyssey-masters-v1` state. Existing lessons, PGNs, notes, practice statistics and saved B5 bookmarks survive unchanged. No accounts/cloud sync/payment. Local storage is not cheat-proof; capped retained match history at 500.
- Source and QA: `docs/PROGRESS_B6_DESIGN.md`; 19 detailed algorithm/migration/integrity tests in `tests/progress-content.cjs`; 26 real browser interaction cases in `tests/progress-browser.cjs`; existing full B0–B5 regressions and third-party source/licensing remain mandatory.
- Red→green in progress: initial methodology QA expected zero completed studies when many historical final moves themselves carry annotated critical positions; corrected test for real source grain, with explicit separate-final test. Initial Chrome Progress language test revealed missing visible language selector; added a synchronized RU/EN/AZ picker within Progress itself. **Actual run #275 green: 180/180 executable checks PASS + CRC-validated 34-file GPL Stockfish ZIP.** [Executed evidence](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44845418646); all failed/cancelled previous runs are retained in QA_LOG.md.
- No merge to `main`, no production deployment. B7 release QA, independent human language/source proofing and physical Windows launcher remain future gates.


## 2026-11-21 — B7 release candidate v0.7.0: full-game, native Windows, keyboard and WCAG 2.2 QA

- Audited the entire existing **B0–B6** system and protected all 33 original RU/EN/AZ lessons, 31 historical score games, 116 teaching anchor positions, 16 progress achievements, genuine GPL Stockfish 19.0.1 binary and previous archived standalone/ZIP builds for rollback.
- Added keyboard chessboard arrow navigation with orientation awareness, unique focusable square, Enter/Space move confirmation and focus restoration across render, localized names for all pieces and keyboard instructions in RU/EN/AZ. Fixed pawn promotion dialog auto-focus, Escape cancellation, Tab cycle, accessible queen/rook/bishop/knight choices and retry after cancellation.
- Upgraded tablist to WAI-style roving keyboard selection; converted 64 fake clickable historical squares to **non-interactive accessible chess position cells** with one localized spoken current-SAN/ply summary. This resolves actual axe-core **nested-interactive serious violation**.
- **Independent match integrity hardening:** a submitted terminal PGN must now be replayable *in full* from the standard starting position, not merely loaded from a composed custom late-game FEN; all previous no-help, no-Undo, backend-free AI tier and duplicate-ID exclusion rules preserved.
- **Fresh source provenance:** all **31 primary historical URL pages** re-fetched on 2026-11-21, and all **1,923 SAN half-moves**, player names, years and recorded outcomes exactly matched primary pages. This is not claimed to be independent archival corroboration for remaining 25 games. Evidence in `docs/SOURCE_B7_REFRESH.md`.
- Added **22** real chess rules/PGN/license/translation Unit tests, **27** actual Chrome special/keyboard/responsive/reload/full-history browser checks, **7** axe-core WCAG 2.2 A/AA audits (three tabs × desktop/mobile plus promotion), **one truly organic non-seeded full match** (real Stockfish-generated user moves against real local Beginner opponent, 21 half-moves, genuine checkmate, result dedupe/reload), and **one native Windows 2022 .cmd + GPL/WASM/localhost-only packaging smoke**.
- Actual executable GitHub Actions **#328 SUCCESS: 238/238 checks including Windows**; 40-file GPL ZIP built and CRC verified. See [complete technical QA](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44882567499), `docs/QA_LOG.md` and `docs/RELEASE_B7_QA.md`.
- Transparently retained red→green history: #312 obsolete Academy aria-label selector after adding accessible names, #314 genuine promotion Escape retry bug, #316 axe-core serious nested-interactive master board, all corrected with actual retest. No suppressed tests or unexplained PASS.
- **Not production v1.0:** official FIDE threefold claim procedure is simplified by pinned practice engine, original historic event/date cross-source verification is incomplete, external professional RU/EN/AZ review and manual assistive-technology acceptance were not performed, and no production domain/merge/deployment has owner approval. **PR remains DRAFT; no main merge or public deployment.**
