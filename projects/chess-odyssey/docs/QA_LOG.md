# Chess Odyssey QA Ledger

**CURRENT VERIFIED CHECKPOINT (2026-11-21): B6 v0.6.0 Preview, GitHub Actions run #268 — 180/180 executable tests PASS + verified 34-file GPL Stockfish ZIP integrity PASS. Production v1.0 remains BLOCKED.**  
Current GitHub CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44845023609  
Current technical authority: docs/PROGRESS_B6_DESIGN.md + progress-core.js + progress-ui.js, on top of B5 source register, B4 Academy and B3 Stockfish. Earlier B0–B5 ledger entries remain historical evidence and are not claims of production release.

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


## B5 — complete Masters & Legends historical learning package (2026-11-21)

**Implemented:** 31 fully linked historical chess move scores, **1,923 actual legal half-moves** spanning **1834–2013**, **116 original RU/EN/AZ critical SAN annotations**. New separate Masters & Legends browser tab: custom independent 8×8 historical board, complete SAN timeline/slider/first-prev-autoplay-next-last, keyboard navigation, all-game replay, theme/player/year search, authentic recorded 1-0/0-1 results with end-position checkmate calculation, original stage explanation, strictly chess.js-legal historical-move quiz, personal bookmarks/reload, full-source PGN download and 390px mobile view. Existing 33 Academy lessons, Coach and Stockfish unaffected.

### Source evidence, freshness and conflicts

- Canonical factual source register: `data/masters-source-scores.json`, exact source URL per game, unannotated score only. Source links, version, provenance, move counts, rights limitations and six second-source checks documented in `docs/MASTERS_B5_SOURCE_REGISTER.md`.
- Six external secondary historical comparison pages examined at https://chessdna.app/games/; **4/6 independently match the complete full move score** (Opera Game, Immortal Game, Evergreen Game, Deep Blue 1997); **2/6 match only a documented partial initial segment** (Game of the Century 1956, Kasparov–Topalov 1999). Other 25 full scores: primary source + full chess.js legality QA, **not** falsely certified as second-source-verified. No internet-wide historical archive or "every game ever" claims.
- **Source attribution QA conflict** early in intake: source URLs for Byrne–Fischer 1963 and McDonnell–La Bourdonnais 1834 were initially mismatched to 1986/2013 data. The year/suffix consistency validator detected it; replaced using the exact full correct primary source URLs and rereplayed every move, commit `d95d0c863fd89970aec0ec160cbb225426e91248`. History preserved; current scores correct per registered source.
- No source website's editorial prose, articles, media, code, evaluations or game-analysis conclusions copied; Chess Odyssey explanatory material independently authored and versioned in `masters-notes-a/b/c.js`. External page links are reference-only: runtime works offline with no network request.
- **6/31 actual on-board checkmate results**, verified chess.js; the rest must not be labelled checkmate merely from a recorded win. `masters-core.js` calculates/checks this for all positions. Recorded resignation reasons may vary by archive.

### Unlazy red/green and exact CI evidence

| GitHub Actions | Outcome | Root cause and corrective action |
| --- | --- | --- |
| **#197**, run **44828862449** | **FAIL** in existing B0/B1 test | Existing smoke test banned every http(s) string in HTML; B5 now links to vetted historical score source. Replaced assertion with **no external scripts/styles** plus permission for explicit source hyperlinks. Commit `8c2e4d0003b62a71c8e61ac49225c1cbafc253d1` |
| **#199**, run **44828977562** | **FAIL** in legacy Chrome test | Adding the independent master chessboard made an old unscoped `button[aria-label^=e2]` match two boards. Scoped all practice/Academy/masters E2E clicks to `#board`, preserving semantic independence; commits `49733d67fa80b248ce8a0de9d2f9c9fb03f83721`, `672eed489b5d0c5515bd4eb12d3c4f13dd8a9bb4`, `d3abcfdb60db4295a027be98178e1d05c01cc677` |
| **#204**, run **44829168151** | **FAIL** in new B5 E2E script | Test tried to click First when current ply 0, where the button is correctly disabled. Corrected test to advance then return to start and asserted proper disabled behavior; commit `91e4145ce65a10ba77368abd9baae0efa94d198c` |
| **#206**, run **44829450536** | **PASS** | Unit, legal history, 116 notes, valid multiple choices, three languages, real Chrome old/new tests, genuine Stockfish, standalone rebuild and 31-file ZIP all green |

### Final verified B5 automated QA — 135/135

| Gate | Checks | Result |
| --- | ---: | --- |
| B0/B1 chess rules and smoke | 12/12 | PASS |
| B2 Coach 2-ply logic | 8/8 | PASS |
| B3 UCI bridge and levels | 7/7 | PASS |
| B4 all 33 Academy lesson chess truth | 8/8 | PASS |
| **B5 31 full source scores, 1,923 chess.js replays, 116 annotation anchors, RU/EN/AZ, legal quiz and parseable PGN** | **10/10** | **PASS** |
| Actual native Stockfish UCI/checkmate | 2/2 | PASS |
| B2 postgame | 5/5 | PASS |
| Synthetic DOM regressions | 9/9 | PASS |
| B0–B4 real browser UI regressions | 21/21 | PASS |
| Genuine browser Stockfish UCI+WASM | 11/11 | PASS |
| B4 Academy real Chrome E2E | 16/16 | PASS |
| **B5 Masters real Chrome E2E** | **26/26** | **PASS** |
| **Total** | **135/135** | **PASS** |

**Browser evidence:** verified 31 games, 64 historical squares, exact Morphy move Qb8+, legal wrong/correct quiz branch, player search and filtering, source link, PGN export with source and result, persistent bookmarks across reload, full replay navigation, RU/EN/AZ switching, keyboard controls, independent Practice/Academy PGN and user settings, full `dist/ChessOdyssey_v0.5.0_PREVIEW.html`, mobile 390px no horizontal overflow. No external runtime chess API or authentication.

**Archive evidence — #206:** the versioned `ChessOdyssey_v0.5.0_Stockfish_Preview.zip` was actually built and CRC-checked with **31 files** (including original Stockfish GPL full licence, binary and exact SHA). Internal ZIP size **1,460,523 bytes** and SHA256 **0bf4606b428cf476ed01394bc0e3a35811865c382b9ef6c8289cad5fb153fa14**. GitHub Actions artifact **14674983982**, `ChessOdyssey-v0.5.0-Masters-Stockfish-PREVIEW`, wrapper SHA256 `1908440d6bfcfab4c78080ca8acd939ab2f7bbc1bd0c3a86bb3b167ffebac662`, retained through **2026-12-20 UTC**. [Download and full logs](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44829450536).

### Remaining release barriers — NOT PASS

- B5 development functionality plus automated QA **PASS**, but this is **not** a claim that 31 historical event identities, dates or tournament rounds were independently certified from official archival records. Non-primary full cross-source verification for 25 games and full secondary verification of two partial matches is **OPEN**.
- Independent human editorial correctness review of RU/EN/AZ, and deep Stockfish validation of whether all 116 explanations are strategically optimal, **NOT TESTED**. Explanations are human-readable instructional context, not engine certification.
- Real physical Windows `START_WINDOWS.cmd` double-click and cross-OS install E2E **NOT TESTED**; local Chrome and licensed localhost Stockfish proved earlier.
- B6 independent Player Progress, Academy Reputation and unrated/rated separation **NOT IMPLEMENTED**. B7 complete games, full accessibility, promotion/draw paths, production deployment gates **OPEN**.
- **v1.0 production remains BLOCKED. No merge to `main`, no deployment, no edits to other games or CBA platform.**

### Final documented-source package rerun — #213 (2026-11-21)

- Full **GitHub Actions run #213**, ID **44830022599**, both jobs **success** after the latest README, ROADMAP, B5 source authority/register, CHANGELOG and third-party legal notice updates. **All 135/135 executable checks still PASS**, including all 31 historical games, 116 anchored explanations, old B0–B4 browser and Stockfish, and new Masters Chrome browser **26/26**.
- Complete ZIP **31 files**, **1,464,906 bytes**, SHA256 **cf59914bfb1c68ad54e274d853c08fd1c5c6ea78a7f2a4caf9e177422483d03a**, verified by actual build+CRC re-open.
- GitHub Actions artifact **ID 14676340023**, `ChessOdyssey-v0.5.0-Masters-Stockfish-PREVIEW`, artifact ZIP wrapper SHA256 **53232468e0bef88f83f77537d7ae20d737e1a530ed36bd23f350b1ac55efcdb8**, expires **2026-12-20 UTC**. Current download and QA: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44830022599.
- Artifact #206 and its SHA above are retained as immutable earlier proof. The #213 snapshot includes the substantive B5 docs and source register; this final log entry records #213 **after** that build, so this added line cannot appear retroactively inside the archived ZIP.
- Nothing changed in `main` or deployed production. All B5 source/QA rules and limitations in docs/MASTERS_B5_SOURCE_REGISTER.md remain authoritative; **B6/B7 still open**.


## B6 — Player Progress & Reputation · development preview v0.6.0 (2026-11-21)

**New working product:** third Progress tab (RU/EN/AZ), 33/33 existing Academy lesson IDs with 4 track denominators, 31 historical game study statuses, 116 existing historical critical-move markers, 16 distinct named achievements, local unique-event Academy Reputation, and separate independently scored no-hint AI match outcomes. Live on-screen study progress is backed by the exact saved facts and cannot accumulate duplicate rewards for repeated Academy lessons, source moments or identical historical quizzes.

**Rating integrity and exclusions:** opt-in `independent` match creates a fresh game and a new local match ID. UI disables hints, candidate legal-square markers, live B2 Coach, Undo, Academy entry and live review until the game ends. The score is accepted only after replay of a real completed chess.js PGN, correct recorded side/outcome and level/engine, with no admitted assistance or Stockfish fallback. Repeated match IDs ignored; changing mode/side/tier aborts the current game without counting. The client does not offer a fake FIDE Elo: **AI Ladder Index 0–100**, visible only after **5 eligible games**, provisional until 20, recent denominator `min(eligible_game_count,20)`, formula fully disclosed in `docs/PROGRESS_B6_DESIGN.md`. After result acceptance, B2 lightweight review is available without changing the recorded independent score.

**Durable migration:** existing `chess-odyssey-v01` practice PGN/notes/lesson progress/stats and `chess-odyssey-masters-v1` bookmarks stay intact; new derived study and validated match metadata stored separately in `chess-odyssey-progress-v1`. Old coaching games are never retroactively counted as independent. Invalid B6 payload safely resets B6 state without replacing old course or practice state.

### Red/green QA history

| GitHub Actions run | Observed failure and repair |
| --- | --- |
| **#244**, ID `44844240544` | **FAIL** new pure B6 test: expected zero fully studied master games after visiting all annotated moves; several true final moves are themselves annotated, so those *do* satisfy the final-position criterion. Test repaired against actual full-game source truth. |
| **#246**, ID `44844332581` | **FAIL** one additional assertion in the new B6 test: expected only visit+quiz points after studying all annotated moments, forgetting already-earned complete-game points. Corrected transparent denominator/reputation reconciliation. |
| **#248**, ID `44844437906` | **FAIL** B6 Chrome E2E: attempted to use Practice's language selector while the Progress tab hid that section. Product UX genuinely lacked a visible Progress language switch. Added a first-class synchronized RU/EN/AZ selector and retargeted the test. |
| **#257**, ID `44844743962` | **CANCELLED** by subsequent implementation and test commits before final verdict; not recorded as PASS. Added independent **post-game** two-ply Coach review, guarded against midgame leakage, plus a browser acceptance test. |
| **#268**, ID `44845023609` | **PASS BOTH JOBS**: exactly 180/180 execution checks; complete source tests, real Chrome app/Stockfish, Studio/Arena, 26 new B6 browser cases, offline HTML and GPL ZIP. |

### Executed final feature and regression totals — run #268

| Executed QA gate | Pass | Fail |
| --- | ---: | ---: |
| B0/B1 chess legality and UI smoke | 12 | 0 |
| B2 candidate/reply Coach unit | 8 | 0 |
| B3 genuine engine UCI bridge | 7 | 0 |
| B4 33-lesson legal/content checks | 8 | 0 |
| B5 historic 31-game/1,923 SAN/116 note QA | 10 | 0 |
| **B6 progress rules, methodology, migration and eligibility** | **19** | **0** |
| Actual Stockfish native UCI and mate proof | 2 | 0 |
| B2 postgame accounting and persisted note regressions | 5 | 0 |
| Synthetic DOM legacy smoke | 9 | 0 |
| Legacy real browser E2E | 21 | 0 |
| Real Stockfish Worker+WASM browser E2E | 11 | 0 |
| B4 real Chrome Academy | 16 | 0 |
| B5 real Chrome Masters & Legends | 26 | 0 |
| **B6 real Chrome Player Progress/Elo-exclusion and mobile** | **26** | **0** |
| **TOTAL** | **180** | **0** |

B6 real-browser gates include: no initial fake index, all three tabs, real B4 lesson completion and persisted ID, B5 true key-move visit/quiz/complete study and anti-farming, synchronized RU/EN/AZ, independent no-help/Undo/Coach+legal-destination blocking, match identity recovery after reload, practice isolation, a **deterministic fully legal six-ply Scholar Mate prefix** followed by the real browser UI click **Qxf7#** to complete an independent terminal game, postgame analysis after recording, deduplication across reloads, five separate fixture games giving 17/100 provisional Beginner index, invalid/incomplete PGN rejection, Stockfish fallback exclusion from file://, full offline `dist/ChessOdyssey_v0.6.0_PREVIEW.html`, 390px viewport and zero browser page errors. **Those seeded fixtures are deterministic functional QA, not a claim of five organic full-length live bot games**; B7 separately gates that.

**Artifact #268:** actual `ChessOdyssey_v0.6.0_Stockfish_Preview.zip` built and CRC re-opened, **34 files**, **1,497,333 bytes**, internal SHA256 `bd3df6b169680442c3f30f09b7a94c9f8476e4197eb27d45d4d11676cf9f383b`. Download artifact `ChessOdyssey-v0.6.0-Progress-Stockfish-PREVIEW` (ID **14682112804**) has outer wrapper digest `19ccc9eaf541b2eb07b4bfbd82bceae9c8d63319acd8856f219aa685e1a82577`, retained through **2026-12-21 UTC**. Full evidence: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44845023609.

### B6 accepted limitations and explicit B7 blockers

- **Functional and automated QA: PASS**. This does **not** establish statistical Elo calibration or an official competitive rating. Bot's six strength presets have no human-rated calibration dataset, and localStorage entries are user-mutable. No leaderboard/identity verification/secure anti-cheat is claimed.
- History capped at latest **500** local match entries (storage bound); very old games beyond that cap are not maintained in an audited lifetime ledger. Index uses only last 20 for denominator even before storage cap.
- B6 browser test used a seeded legal terminal chess position and an actually clicked decisive move; independent long-game end-to-end/tournament sampling from ordinary new game through final position with human-like strategy is **NOT TESTED** here, and remains in B7.
- Independent historical B5 source verification of every date/event, human RU/EN/AZ editorial audit, WCAG keyboard/contrast/assistive-technology validation, and physical Windows launcher E2E remain **NOT FULLY TESTED**.
- B7 full production acceptance, deployment site and explicit owner-approved release boundary **BLOCKED**; `main` and production untouched.
