# Chess Odyssey — Changelog

## 2026-11-25 — v1.1.2 deployed for production UAT

- Owner/colleague real v1.1.1 five-minute PvP playtest: playable, reduced freezes, residual lag; eight UX requirements. PR #28 implements coordinates, active side, last move, captured figures, result, postgame Stockfish, Practice dock and trilingual controls; adds bounded latency diagnostics. [Feedback and repair register](docs/DEVELOPMENT_HISTORY.md).
- Tested source: `fcf88bfaaf096ad42e468e15967f3df970c29964`; merged at `09224c6dd9bcae0aad86dd80694969578cda99d2`, zero file delta from tested PR head.
- [Focused run 45624812948](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948): 24/24 two-browser mocked-transport PvP, actual Stockfish analysis, 40 half-moves, F5, lost-response idempotency, terminal dialog, captured pawn grouping, localized turn, Practice layout, outsider denial; scope limited to executed cases.
- [Full regression 45624812883](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883): 3/3 (offline, Chromium, Windows compatibility launcher/Stockfish). [Studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812899) and [Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812924) PASS.
- [Production deployment 45627594965](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965): 3/3 PASS. Direct independent public-browser readback not recorded for v1.1.2; no runtime/database/security change in this documentation audit.
- [Verified v1.1.2 CI ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948/artifacts/15028348210): 152 files, 2,058,248 bytes, SHA-256 `ce58b5da0687ebe2cdd7b0e29c0683b154dd646ffcc201ecacee8e71576729c2`; outer artifact digest `1580be6dd4ad0f5a8eef24ac75cdc6c3fa4c65096675d65dd8df49b08904f67b`. Permanent publication not authorized.

## 2026-11-25 — v1.1.1 hotfix published prerelease

- [PR #27](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/27) merged at `eb535fd863f3450a160454cc7d386c178db55445`; [Pages 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45571962966), [permanent prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1) with exact ZIP SHA-256 `96a6035446ccd3053cf3a954120a43d3c1a9bd96188db81d030873c843662cac`. Earlier v1.1 FAIL preserved; real v1.1.1 game playable with remaining issues. [Release note](docs/RELEASE_V1_1_1.md).

## 2026-11-25 — v1.1.0 public web and official archive

- [PR #24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/24) friend invites, Login, text-only zoom; [PR #25](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/25) official archive; [PR #26](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/26) portfolio and Pages race repair. [Official v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0), [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45475469995). Later real UAT exposed BUG-01–04; no claim of complete production acceptance.

## 2026-11-25 — v1.1.1 pre-publication hotfix checkpoint (historical)

- Production v1.1 defects: stalls after 1–2 moves, slow sync, lost room on refresh, incomplete locale labels. Candidate adds 1.2s polling, serialized refresh, version guards, account-bound restoration, bounded requests, idempotent replay, clock rendering and RU/EN/AZ fixes.
- Tested source `c42e1c16b379405c1029b9088c4648176f13f11f`: [full CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653763), [focused QA PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790) including 19/19 PvP/header and 9/9 cloud UI, 26/26 mock cloud API; 40 half-moves; exact candidate ZIP 152 files, 2,047,853 bytes, SHA-256 `96a6035446ccd3053cf3a954120a43d3c1a9bd96188db81d030873c843662cac`. [Artifact](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790/artifacts/14997604931).
- Production real users, full language acceptance and physical-device UAT remain open; no merge, deployment, DB writes or security-policy change. Existing v1.1.0 official release preserved.

## 2026-11-24 — v1.0.0 public release

- [Play online](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Windows Stockfish v1.0.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329/artifacts/14857182056) · [Release notes](docs/RELEASE_V1_0_0.md).
- 33 Academy lessons, contextual/mobile game controls, 300 historic score records (31 original annotated plus 269 World Championship games), Stockfish review and RU/EN/AZ.
- [Full automated QA 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329); [live public UI smoke PASS](https://agent.tinyfish.ai/runs/ad1e13fb-00f5-4e26-a235-cd9013ae371d).
- **Owner-approved early release** with outstanding live multi-device CAS, 2-player PvP, third-user security and human localization/device tests disclosed in release notes. Neon backend stays on existing staging instance and existing account progress is preserved.
- Historical v0.9.0 entries below are preserved as source evidence, not current release state.

## 2026-11-23 — Post-merge main QA and authoritative v0.9 artifact

- [Actual `main` run #45126130111](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111) **3/3 JOBS PASS** on merge commit `a81c5132e6bf0570744720551e857ec2f5f432c9`: offline/unit, real Chromium, Windows launcher/WASM. P0–P2 new UX Chrome 16/16; B9 synthetic two-Chrome 11/11.
- [Main-produced v0.9.0 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974): **46 files**, 1,593,653 bytes; inner SHA-256 `64a75e7fe2d95adf66207207882adae1c146817d4aefe6f58bc4679d29877bf1`; outer artifact SHA-256 `c0283f72b4a7c820ccad17fc1f9f4bbc54b423d13ef7c4404a718e129fe17a92`, expires 2026-12-23. Both archives independently downloaded, opened and CRC-checked with zero errors. This main artifact supersedes the *feature-branch ZIP as the latest preview*, while earlier feature test and package hashes remain historical proof.
- This remains a **development preview**. Real persistent Neon Auth/PvP E2E, human RU/EN/AZ content proofread, actual device UAT and full 10×10 legibility check are OPEN; no production deployment.


## 2026-11-23 — Chess Odyssey v0.9.0 P0–P2 development source published to main

- [PR #18 merged](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18), merge `a81c5132e6bf0570744720551e857ec2f5f432c9`: P0 global RU/EN/AZ and replay; P1 appearance presets (10 themes × 10 piece styles) and wide mode; P2 depth-aware genuine Stockfish Game Review, directional arrows, accuracy figures and legend.
- [Chess CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080) + Studio smoke PASS: UX Node 27/27, Chrome 16/16; historical regression, real Stockfish and Windows passed. [Main post-merge CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111) is separately tracked.
- [v0.9.0 46-file development ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080/artifacts/14796265039) inner SHA256 `fc6db2dcc41d9515414d73de2a0442e9a7ee8bff9c360c8f1d21fd187f208e66`, outer artifact SHA256 `80db5319d0ae2252cc796c511dfb7f4fbeefddb0a46adf40b91ac0336b73e04f`; ZIP not checked into git, expires 2026-12-23. Source/build scripts permanent. v0.8.0 ZIP archived in repo, unchanged.
- Production v1.0, genuine authenticated Neon OTP/two-user PvP, independent tri-language semantic review, 100-pair theme/style and real-device UAT remain open.

**Historical B9 / v0.9 Development checkpoint**, not an idea and not yet a shipped v0.9 binary. At the 2026-11-21 baseline, last archived in-repo preview was **v0.8.0** (feature PR #18 separately has verified v0.9.0 development preview); actual CI: [#403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027) (3/3 PASS). See [canonical current status](docs/CURRENT_STATUS.md). The entries below are intentionally chronological and do not supersede newer gates.

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
- Actual executable GitHub Actions **#339 SUCCESS: 238/238 checks including Windows**; 40-file GPL ZIP built and CRC verified. See [complete technical QA](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44882567499), `docs/QA_LOG.md` and `docs/RELEASE_B7_QA.md`.
- Transparently retained red→green history: #312 obsolete Academy aria-label selector after adding accessible names, #314 genuine promotion Escape retry bug, #316 axe-core serious nested-interactive master board, all corrected with actual retest. No suppressed tests or unexplained PASS.
- **Not production v1.0:** official FIDE threefold claim procedure is simplified by pinned practice engine, original historic event/date cross-source verification is incomplete, external professional RU/EN/AZ review and manual assistive-technology acceptance were not performed, and no production domain/merge/deployment has owner approval. **PR remains DRAFT; no main merge or public deployment.**

**Final QA evidence:** The documentation-synchronized [run #339](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44883137898) reconfirmed all **238/238 PASS**, with a **second genuine full game** finishing after 55 legal half-moves; 40-file ZIP SHA256 `bb9fa7b525f320ce50fdc0465ca63c5eac2d91807cc234f914bb9f5fafa37d94`. The original #328 21-ply match is retained as prior evidence. Production gates for owner and independent human review remain BLOCKED.

## 2026-11-21 — B8 Development v0.8.0: timed match core and UI
- Added separate deterministic `clock-core.js`: nine documented presets/custom time, exact side-to-move debit, increment after legal move, resume/pause/restore/timeout/stop; 18 reproducible unit gates.
- Integrated two live local clocks with AI think-time debit, timeout outcome with narrow material exception, saving and restoring clock settings, educational pause policy and strict exclusion of timed AI games from the legacy AI Ladder Index. Added resign/rematch, 3-language labels, digital and decorative turning hourglass displays with reduced motion; optional synthesized check/end/low-time sounds.
- Preserved Academy/Masters/Progress, 33 lessons, 31 historical games, 116 notes, Stockfish WASM, 16 achievements and B7 historical evidence. The B2 postgame review remains reusable. No extra opening lesson was added in this checkpoint.
- CI red→green: #361/#362 failed only on new browser test's millisecond-exact comparison; #369 failed on double-escaped time-display regex; both tests corrected with realistic bounded real-browser assertions. [#372](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44888424604): unit, Chrome, native Windows all SUCCESS; **B8 18/18 unit + 12/12 browser**, earlier browser suites all green. Reproducible 42-file GPL ZIP SHA256 `d89214184b7e2cd9a45b2d8c17d01c8049d6d4e70fb40fb823974164f7d55daa`.
- **Historical status at the B8-only #372 checkpoint:** NOT v1.0 production; owner real-device/screen-reader/language QA outstanding; openings and deeper post-game UI optional. B9 was **not started at that historical checkpoint** but has subsequently progressed to local synthetic PvP and configured Neon staging; see the newer B9 entry below. No main merge or deploy.

## 2026-11-21 — B9 / v0.9 Development: local PvP, Neon staging and Better Auth (historical)
- Owner confirmed **human Player-vs-Player is required for v1.0** for 5–10 invited friends/colleagues, with Academy and Stockfish AI as training. v0.9 refers to **development stage**, not a released binary.
- Implemented server-authoritative **in-memory** `pvp/match-service.cjs`: turn/legal move verification via chess.js, invites, canonical FEN/PGN, two clocks, server-time/flag fall, resignation, agreed draws, rematch, replay/idempotency and per-player privacy checks.
- Implemented deliberately **unsafe loopback-only** synthetic `pvp/dev-server.cjs` plus `demo.html`, `demo-client.js`, `demo.css`: test-only `X-Demo-User` must never be deployed. CI #403: **27/27 domain, 15/15 HTTP, 11/11 real dual-browser Chrome** PASS. Existing B0–B8 regression and actual Windows smoke remain green.
- Expanded B8 clock truth to **32/32 clock unit PASS** (including material exceptions, wall-clock rollback) and **12/12 B8 Chrome PASS** in #403, without making a new manual/semantic/historical acceptance claim.
- Connected Neon Free; created isolated Chess Odyssey — Staging (Frankfurt, PostgreSQL 17). Verified schema with 4 app tables, RLS + FORCE RLS and **zero** permissive policies; no game/account data seeded.
- With explicit owner consent, provisioned **Neon Better Auth** in that staging DB and configured email/password with **mandatory email verification OTP**, revocation on password reset, staging-only localhost and no trusted production origins. Initial verification-link request was rejected because shared Neon mail sender supports OTP only; OTP configuration read-back PASS. **9 Auth tables**, last inspected **0 users / 0 games**.
- **Still BLOCKED** for true cloud multiplayer: no authenticated real user signup/received OTP/login E2E, no persistent trusted server API with transaction/RLS permissions, no private live authenticated 2-user game, no public hosting, no v1.0 signoff. Independent human RU/EN/AZ, owner desktop/phone, historical second-archive and extra-opening gates remain open.
- [CI #403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027) **all three jobs PASS**; 42-file v0.8.0 GPL Stockfish ZIP internal SHA256 `3aa43053b4b395df415431fa099c2f8b5a084b9a416d638c8bebc246408d79c2`. Historical #372/#339 artifacts remain earlier evidence. No release of v0.9 as a binary; no merge to main or production deployment.

## 2026-11-21 — GitHub main source merge and verified main CI #407
- Owner explicitly authorized GitHub merge. PR #8 (main-branch portfolio status) merged SHA `56d6c8406989c9887164c526c275e248de690f66`; PR #7 (all Chess Odyssey code, history, WASM, CI) merged SHA `cc3934d4fdefd0635339ef146cb760e43bb2553d`; follow-up PR #9 (main CI triggers and post-merge docs) merged SHA `4a425823206c806df671c0abc9b69f02770067b7`.
- Reconciled original source branch with latest main via true two-parent Git commit, retaining all 86 Chess workflow/source blobs and all main non-game contents. No unexpected lost or overwritten files.
- **Post-merge main GitHub Actions [#407](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865): all 3 jobs PASS**, B8 clock 32/32, B8 Chrome 12/12, B9 local domain 27/27, B9 localhost HTTP 15/15, B9 two-browser 11/11, legacy regression, native Windows loopback/GPL/Stockfish WASM 1/1 PASS. Rebuilt last playable preview **v0.8.0**, 42-file GPL ZIP SHA256 `3bac88d0d34bcf41fdaedb4b63e482398e6f850c5ba183f2d15bf0e07fcb3395` ([Artifact #14705809423](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865/artifacts/14705809423)).
- Repo now reflects **B9/v0.9 DEVELOPMENT**, not original idea or production v1.0. Genuine authenticated Neon-cloud PvP, hosted multiplayer API, two real user OTP E2E, owner PC/mobile and human RU/EN/AZ source QA still OPEN. No production deployment or user records created by these GitHub merges.
