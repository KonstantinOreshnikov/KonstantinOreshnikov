# Chess Odyssey QA Ledger

**CURRENT VERIFIED CHECKPOINT (2026-11-21): B4 v0.4.0 Preview, run #170 — 99/99 executable tests PASS + documentation-synchronized 22-file GPL Stockfish ZIP integrity PASS. Production v1.0 remains BLOCKED.**  
Current GitHub CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44825370339  
Current authority: docs/ACADEMY_B4_DESIGN.md + academy.js + docs/ENGINE_B3_DESIGN.md + engine/MANIFEST.md. B0–B3 statements below are historical release checkpoints, not current production status.

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

Historical B1 checkpoint CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44811717245


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
| Run #72, ID 44815259494 | regression after fileRank restoration | CANCELLED by superseding docs/PR run, not a technical FAIL |
| Run #73, ID 44815318694 | B2.1 after fileRank fix and refreshed standalone: rules 12/12; coach 8/8; postgame 5/5; synthetic DOM 9/9; **Chromium 21/21** | **PASS**; step logs read back |

**Release boundary:** B2 unit / browser evidence is not a v1.0 release signoff. Full-length game E2E across outcomes, promotions in UI, strong engine / six levels, all planned Academy lessons, full independently checked RU/EN/AZ, performance/UX accessibility and production signoff remain NOT TESTED or NOT IMPLEMENTED. No merge or production deploy.

### Verified B2.1 checkpoint (21 November 2026)

- **Current validated distribution:** dist/ChessOdyssey_v0.2.1_PREVIEW.html (standalone). B2.1 app and all four test categories passed GitHub Actions #73: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44815318694.
- **PASS:** legal SAN and opponent replies; positive mate/no-reply detection; immediate capture warning; heuristic grading; saved review; automatic postgame review; Undo stats rollback; lesson resume; RU/EN/AZ in-browser switching including active hints; offline bundle rendering.
- **Remaining NOT TESTED / NOT IMPLEMENTED:** full translation independent proofreading, entire UI games with all terminal scenarios, all promotions in UI, strong engine tiers, source-verified grandmaster PGN, learning route breadth, independent rated mode/reputation and final mobile/accessibility/release gates.
- **Production:** BLOCKED. No main merge, no deployment. The original historical FAIL runs and corrections are retained above.


## B3 — genuine Stockfish 19 and six-level preview (2026-11-21)

**Scope:** six game levels, Stockfish.js 19.0.1 Lite single-threaded WASM as separate local Web Worker, explicit offline fallback, UCI/legality gating, cancellation, packaging and GPL source evidence.

### Provenance / asset integrity — PASS

- Real upstream npm package **stockfish@19.0.1**, GPL-3.0, corresponding source https://github.com/nmrugg/stockfish.js/tree/v19.0.1.
- Vendored binaries unmodified; matching file versions and full engine/Copying.txt read back from GitHub. Engine MANIFEST: engine/MANIFEST.md.
- JS: **28,230 bytes**, SHA256 **ccb130d7ff29408531c47d859a49f91d59d4f482d05a53eb1a3231a4f624c91a**.
- WASM: **1,845,971 bytes**, SHA256 **ee4f115bdb2d32cadf96cada104a05b5ec257d7ad6f57582190b49bc71f096de**.
- Source version and licence checked by scripts/vendor-stockfish.cjs; actual Node UCI acceptance run before vendored assets were committed by a scoped GitHub Actions workflow.

### Executed red/green evidence

| Evidence | Result | Notes |
| --- | --- | --- |
| CI #98, run ID 44817996084 | **PASS** | 12 chess rules, 8 B2 coach, 7 B3 adapter, 1 native Stockfish UCI, 5 postgame, 9 DOM, 21 Chromium B2 and 9 actual Stockfish HTTP E2E |
| CI #102 / #109 and intermediate code/docs checks | **CANCELLED by superseding commits** | Not a test FAIL; preserve prior run links/history |
| CI **#112**, ID **44818905664** | **PASS** | 12 rules + 8 B2 coach + 7 B3 bridge + 2 native Stockfish UCI positions + 5 postgame + 9 DOM + 21 existing Chromium + 11 real Stockfish browser = **75 / 75 PASS** |
| Real Stockfish native UCI | **PASS 2/2** | Legal opening move e2e3 and verified mate-in-one **h5f7 (Qxf7#)** at depth 5 |
| Real browser all four UCI levels | **PASS 11/11** | Intermediate, Advanced, Expert and Grandmaster Challenge each returned a real Stockfish move via localhost Worker and .wasm; save/reload of level, stale search cancellation, and transparent file:// fallback |
| Package build | **PASS** | ZIP created and reopened/CRC-checked: **20 files**, unmodified engine assets, GPL license, launcher and sources. Internal ZIP **1,313,545 bytes**, SHA256 **7f0ede9564828e8819b1ed74e780465adfd5fe75e61c3fc552547ce313092e48** |
| GitHub Actions artifact | **PASS** | Artifact ID **14671266705**, name ChessOdyssey-v0.3.0-Stockfish-PREVIEW, attached to run #112. Artifact retention until **2026-12-20 UTC**; source and reproducible build remain in GitHub. |

Full logs and downloadable ZIP: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44818905664.

### Release gates remaining — explicitly NOT TESTED / NOT IMPLEMENTED

- B3 is a **working Preview**, not a measured Elo or scientifically validated monotonically increasing difficulty ladder. Actual UCI Skill Level settings increase across tiers, but win-rate calibration is NOT TESTED.
- **Windows double-click launcher:** packaged, but physical Windows end-to-end NOT TESTED; locally served HTTP path and real Chromium WASM on Ubuntu PASS.
- The full 94MB multi-thread Stockfish is not bundled; Lite chosen intentionally. Single standalone HTML offers weaker local fallback and must not be labelled genuine Stockfish.
- Entire UI games to every win/loss/draw outcome, all promotion UI paths, accessibility/touch review, independent RU/EN/AZ semantic QA, more academy lessons, historical verified PGNs, unassisted rating and Academy Reputation remain release blockers.
- B4–B7 and all v1.0 release acceptance gates remain **OPEN**. No merge to main and no production deployment.

**Next block:** B4 learning content and tactics (board-first lessons in RU/EN/AZ), with B3 strength and B2 coaching preserved and regression-tested.


## B4 — complete 33-lesson interactive Academy · 2026-11-21

**Actual implementation:** 4 category tracks, 33 unique exercises (Rules 9, Tactics 8, Openings 8, Endgames 8), 49 learner turns. Each has legal chess.js-backed opening history/FEN, expected SAN, scripted opponent responses where applicable, and RU/EN/AZ full title + intro + per-stage guidance. New application behavior: incorrect move rejection without board mutation, multi-step both-colour openings, next lesson, filtered track progress, in-progress exercise reload and practice-game return, queen vs knight promotion selection, mobile UI. Existing B2 coach and genuine B3 Stockfish retained.

### Red/green issue history (not silently removed)

| GitHub Actions | Status | Cause and correction |
| --- | --- | --- |
| #148, run 44823481011 | **FAIL** in content QA | French Defence EN step hint was too terse for the explicit quality threshold; expanded the English explanation; not a chess legality defect |
| #151, run 44823633669 | **FAIL** in content QA | King-opposition setup contained only kings, automatically terminal by insufficient material; inserted distant pawns and added a gate rejecting already-finished lesson starts |
| #154, run 44823774903 | **FAIL** in new Chromium B4 E2E | After a wrong valid move, piece selection remained active and re-clicking the piece deselected it; fixed by clearing selection and re-rendering before retry |
| #157, run 44823995162 | **FAIL** in new E2E assertion | Test expected `c5 Nf3` without legal PGN move number `2.`; test repaired to accept `c5 2. Nf3`, game output itself correct |
| #159, run 44824293554 | **CANCELLED**, not technical PASS | GitHub runner held at redundant Playwright `--with-deps` Chromium installation; moved CI to installed Chrome when available with Chromium-download fallback, retaining real-browser tests |
| **#166, run 44824986016** | **PASS ALL GATES** | 99/99 executable checks, actual Stockfish and full new B4 Chromium behavior, 22-file ZIP integrity and artifact upload |

### Verified final QA (run #166) — **99/99**

| Gate | Count | Result |
| --- | ---: | --- |
| Chess legal rules + existing app smoke | 12 / 12 | PASS |
| B2 candidate/reply and shallow coach | 8 / 8 | PASS |
| B3 UCI bridge and six levels | 7 / 7 | PASS |
| **B4 all Academy datasets / rules / RU-EN-AZ field coverage** | **8 / 8** | **PASS** |
| Actual Stockfish native UCI (legal opening + Qxf7# mate) | 2 / 2 | PASS |
| B2 postgame + persistence + rollback | 5 / 5 | PASS |
| Synthetic DOM regressions | 9 / 9 | PASS |
| Existing real browser E2E | 21 / 21 | PASS |
| Genuine Stockfish Worker+WASM real browser E2E | 11 / 11 | PASS |
| **B4 real Chromium-family browser exercises** | **16 / 16** | **PASS** |
| **Total** | **99 / 99** | **PASS** |

B4 browser acceptance explicitly exercised: four-track selector, incorrect-but-legal move, knight-fork completion and Next Lesson, exact parked-game return, three-step Sicilian as Black with scripted White replies, page reload at step 2, RU/EN/AZ mid-stage, both queen promotion and underpromotion knight selection, three-step Italian as White, persisted progress, 390px viewport overflow and the full v0.4.0 standalone bundle.

**Source-backed build evidence:** `dist/ChessOdyssey_v0.4.0_PREVIEW.html`; `scripts/build-standalone.cjs`; `scripts/package-preview.py`; `engine/MANIFEST.md`. The full ZIP was actually generated and reopened with CRC tests: **22 files**, 1,347,257 bytes, internal SHA256 **ff812088f359c3a680a2a681917e5ceff89bc448836f99de62ec43aec4b263ac**. The GitHub Actions downloadable artifact **14673516854**, name `ChessOdyssey-v0.4.0-Academy-Stockfish-PREVIEW`, is retained until 2026-12-20 UTC (artifact-archive digest SHA256 `a5e7c418cbbf0139c53ab3f6ec795fd5bf08df32ff03c74845853083485431b7`). Archive and logs: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44824986016.

### Hard boundaries after B4

- **B4 Feature/technical QA: PASS**, including programmatic structural coverage in RU/EN/AZ; not an independent human editorial language PASS.
- Physical **Windows double-click launcher end-to-end NOT TESTED**, though Node+HTTP and Chrome Browser E2E PASS.
- The 33 exercises are a bounded introductory full four-track package, not an unlimited/accredited chess textbook, certified coach or verified master history.
- B5 verified historical grandmaster PGNs, B6 separate Academy Reputation / provisional unrated-game separation and B7 production gates remain NOT IMPLEMENTED / BLOCKED.
- Full-length win/loss/draw games in UI, all promotion paths, standalone accessibility review, independent RU/EN/AZ teaching correctness and production deployment remain release gates. Do not merge `main`; no production deploy. **Next block: B5 Masters & Legends**.

### Final documentation-synchronized packaging checkpoint — run #170 (2026-11-21)

- **GitHub Actions run #170, ID 44825370339: PASS both Offline rules + app smoke and real Chromium-family browser jobs.** All B4 99/99 checks remain green; B0–B3 regression preserved. Documentation README/ROADMAP/QA_LOG/CHANGELOG changes included in the runtime ZIP from this run.
- Built and CRC-verified ZIP: `ChessOdyssey_v0.4.0_Stockfish_Preview.zip`, **22 files**, **1,349,477 bytes**, internal ZIP SHA256 **474c4b7af011b2498408151e886ab1c0c25626a5b972aa6d49a5b0739715f28a**.
- Downloadable GitHub Actions artifact **ID 14673682316**, `ChessOdyssey-v0.4.0-Academy-Stockfish-PREVIEW`; artifact-wrapper SHA256 **0207531a8df00165befbf73150bf848902d5f57daea066ef9a98f0f91df0647d**, expires **2026-12-20 UTC**.
- **Current full package + QA:** https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44825370339. Previous #166 package and SHA above remain immutable historical evidence, not current package hash. Source content and v0.4.0 standalone in the game branch remain durable.
- No main merge, no production deployment; B5/B6/B7 and independent language/editorial review remain open.
