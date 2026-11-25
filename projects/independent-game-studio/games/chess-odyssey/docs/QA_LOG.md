# Chess Odyssey QA Ledger

**v1.1.3 Practice HUD — production publication authorized; final regression/deployment evidence pending.** [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused CI PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640). Published v1.1.2 remains the verified web baseline until deployment succeeds. Owner requests PvP-style Practice conveniences; no runtime server or database policy changes.

[Practice HUD feedback and QA](PRACTICE_HUD_V1_1_3.md).

**Current web version: v1.1.2 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #28](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/28) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965). Real v1.1.2 two-player UAT, measured production latency and full human/device acceptance remain open. Latest permanent package is [v1.1.1 prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1); latest non-prerelease tagged package is [v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0). v1.1.2 ZIP is a verified temporary CI artifact, not a permanent GitHub Release.

[Complete development history / defect register](DEVELOPMENT_HISTORY.md) · [v1.1.2 release notes](RELEASE_V1_1_2.md).

- Tested source: `fcf88bfaaf096ad42e468e15967f3df970c29964`; merged at `09224c6dd9bcae0aad86dd80694969578cda99d2`, zero file delta from tested PR head.
- [Focused run 45624812948](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948): 24/24 two-browser mocked-transport PvP, actual Stockfish analysis, 40 half-moves, F5, lost-response idempotency, terminal dialog, captured pawn grouping, localized turn, Practice layout, outsider denial; scope limited to executed cases.
- [Full regression 45624812883](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883): 3/3 (offline, Chromium, Windows compatibility launcher/Stockfish). [Studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812899) and [Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812924) PASS.
- [Production deployment 45627594965](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965): 3/3 PASS. Direct independent public-browser readback not recorded for v1.1.2; no runtime/database/security change in this documentation audit.
- [Verified v1.1.2 CI ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948/artifacts/15028348210): 152 files, 2,058,248 bytes, SHA-256 `ce58b5da0687ebe2cdd7b0e29c0683b154dd646ffcc201ecacee8e71576729c2`; outer artifact digest `1580be6dd4ad0f5a8eef24ac75cdc6c3fa4c65096675d65dd8df49b08904f67b`. Permanent publication not authorized.

All earlier dated sections below are **historical checkpoints**, not current version, blockers or permissions. Preserve their original test results; consult the current summary and development history for latest dispositions.

## Verified Phase 1 QA checkpoint (2026-11-23)

- GitHub branch `feature/chess-odyssey-v1-foundation-20261123`, tested source commit `dd5b2af0ac43caf0070ed99029655bcdc42c2f64` (PR #20 DRAFT, not merged/deployed).
- [Chess QA #45133287865](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287865) **3/3 jobs PASS**: offline Node/unit, Chromium real display and 10-style selection, Masters, historical tests, actual Windows launcher/Stockfish WASM. Earlier red [#45132878410](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45132878410) failed in a new test due forbidden fetch(file://SVG); repaired with SVG Image.onload validation. No chess-state semantics were changed.
- [GitHub Pages package run #45133287871](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287871) **6/6 PASS** including 96 same-origin SVG assets, engine, notices and no synthetic backend/secrets. [Studio smoke #45133287855](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287855) **PASS**.
- [Download compiled P0-P2 + SVG preview](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45133287865/artifacts/14799470086); 146-file Stockfish ZIP with 96 SVGs, original CSS preview and offline standalone. Both ZIP layers downloaded and CRC-checked: no errors.
- **OPEN:** live GitHub Pages site and URL not confirmed; Neon staging Functions empty, Data API disabled, Auth E2E zero verified users, four protected game tables RLS+FORCE RLS and zero permissive policies; genuine cloud statistics/PvP and owner device/linguistic QA remain unverified. No production release.

## 2026-11-23 — Post-merge main QA and authoritative v0.9 artifact

- [Actual `main` run #45126130111](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111) **3/3 JOBS PASS** on merge commit `a81c5132e6bf0570744720551e857ec2f5f432c9`: offline/unit, real Chromium, Windows launcher/WASM. P0–P2 new UX Chrome 16/16; B9 synthetic two-Chrome 11/11.
- [Main-produced v0.9.0 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974): **46 files**, 1,593,653 bytes; inner SHA-256 `64a75e7fe2d95adf66207207882adae1c146817d4aefe6f58bc4679d29877bf1`; outer artifact SHA-256 `c0283f72b4a7c820ccad17fc1f9f4bbc54b423d13ef7c4404a718e129fe17a92`, expires 2026-12-23. Both archives independently downloaded, opened and CRC-checked with zero errors. This main artifact supersedes the *feature-branch ZIP as the latest preview*, while earlier feature test and package hashes remain historical proof.
- This remains a **development preview**. Real persistent Neon Auth/PvP E2E, human RU/EN/AZ content proofread, actual device UAT and full 10×10 legibility check are OPEN; no production deployment.


## 2026-11-23 — P0–P2 merged source and verified development preview

- [PR #18](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18) **MERGED into `main`** at `a81c5132e6bf0570744720551e857ec2f5f432c9`. P0 global RU/EN/AZ, non-destructive SAN replay; P1 10×10 theme/piece options and wide board; P2 Stockfish postgame review/arrows, per-side analyzed moves/accuracy and multilingual move legend. Neither production auth nor Neon DB was changed.
- Source commit `b8306da9aef74241d6f91e5be7fb1b6067e720e8`: [Chess QA 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080); new UX Node **27/27**, real Chrome **16/16**, B8 clocks **32/32**, synthetic B9 **27/27 domain + 15/15 HTTP + 11/11 dual-Chrome**, native Windows Stockfish/GPL smoke PASS. [Studio smoke #45125452895](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125452895) 1/1 PASS.
- [Post-merge `main` CI #45126130111](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111) **3/3 PASS**, separately verified, see top checkpoint.
- [v0.9.0 development preview ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080/artifacts/14796265039), 46 files, 1,593,653 bytes, verified inner SHA-256 `fc6db2dcc41d9515414d73de2a0442e9a7ee8bff9c360c8f1d21fd187f208e66`, outer Actions artifact SHA-256 `80db5319d0ae2252cc796c511dfb7f4fbeefddb0a46adf40b91ac0336b73e04f`. Both ZIPs checked for CRC errors; none. Outer artifact expires 2026-12-23; code/build scripts remain on `main`. Historical v0.8.0 archive retained.
- Preserve historical PR #18 red-to-green runs (#45123329659, #45123725453, #45124096306), corrected through targeted selector/legacy regression repairs.
- **OPEN / not production release:** actual independent human RU/EN/AZ semantic proofreading; physical Android/desktop UAT and exhaustive 100 visual combinations; real authenticated two-user durable Neon PvP E2E with negative access testing. `X-Demo-User` local fixture is not production Auth.

## Historical 2026-11-21 main CI checkpoint

**CURRENT MAIN-BRANCH CHECKPOINT (2026-11-21): [GitHub Actions #407](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865) **3/3 jobs SUCCESS** on `main` commit `4a425823206c806df671c0abc9b69f02770067b7`. B8 32/32 clock unit + 12/12 real-browser; B9 27/27 local authoritative domain + 15/15 synthetic HTTP + 11/11 dual-browser; earlier B0–B7 regression and native Windows 1/1 all PASS. Verified playable artifact v0.8.0 ZIP 42 files, inner SHA256 `3bac88d0d34bcf41fdaedb4b63e482398e6f850c5ba183f2d15bf0e07fcb3395` and [artifact #14705809423](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865/artifacts/14705809423). Source merged into main via PR #7/#8/#9; **Neon authenticated cloud PvP still BLOCKED**, no production deploy. Prior #403 and #339 checkpoints preserved chronologically.**

**HISTORICAL PRE-MERGE CHECKPOINT (2026-11-21): B8 automated clock QA 32/32 + browser 12/12 PASS, B9 isolated PvP 27/27 + HTTP 15/15 + dual-browser 11/11 PASS; [CI #403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027), all three jobs successful. New Neon staging project `wild-hall-05832800`, `staging` branch `br-still-credit-b9voxawu`: four RLS/FORCE RLS tables applied and independently read back; Neon Better Auth ENABLED and configured with verified email OTP on staging; actual signup/login/JWT and cloud PvP E2E NOT RUN. B8 human QA OPEN; B9 still BLOCKED on verified real-user Auth E2E, user-scoped APIs and durable persistence. Evidence: [B9 Neon checkpoint](B9_NEON_STAGING_CHECKPOINT_2026-11-21.md). No v1.0 production release.**  
Last independently VERIFIED gameplay CI: https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027 (B8/B9 developer-branch #403, 3/3 jobs green; NOT a post-merge main-branch run). B7 archive #339 retained. Verify next main CI separately.  
Current technical authority: [CURRENT_STATUS.md](CURRENT_STATUS.md) for navigation; B9 `pvp/match-service.cjs`, `docs/B9_NEON_INTEGRATION.md`, `docs/B9_NEON_STAGING_CHECKPOINT_2026-11-21.md`, local B9 tests and live #403 for executed proof; B8 `clock-core.js`, `app.js` and tests; `docs/ROADMAP.md` for owner scope. Historical B7 source/regression baseline remains intact. Earlier B0–B6 entries are historical checkpoints, not production-release claims.

## Historical QA chronology — B0/B1 original checkpoint and later milestones

**The sections below are immutable historical work-package snapshots; statements such as "NOT IMPLEMENTED", "NOT TESTED" and "next gate" are relative to their original B0/B1/B2/B3/B4 phase, NOT the current B9 stage.** Always use the current status banner above and [CURRENT_STATUS.md](CURRENT_STATUS.md) for live operational status.

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

### Final successful source/docs-synchronized ZIP checkpoint — run #275 (2026-11-21)

- After updating README, ROADMAP, CHANGELOG and B6 historical QA ledger, **GitHub Actions #275 (ID 44845418646)** independently reran BOTH jobs: **PASS**. Exactly **180/180** executable checks still pass, including 19 pure B6 methodology tests, 26 real Chrome B6 E2E tests, existing 135 B0–B5 regression tests and real licensed Stockfish.
- Full 34-file ZIP `ChessOdyssey_v0.6.0_Stockfish_Preview.zip`, actually generated and reopened/CRC checked: **1,500,167 bytes**, internal SHA256 `77a8ee312f95c0d23408584d669418627ba1a626a39ac0b76fc2de8707d40e68`.
- New downloadable artifact **ID 14682882393**, `ChessOdyssey-v0.6.0-Progress-Stockfish-PREVIEW`, outer GitHub archive digest `c82ee8d82dfe5c7650e3d8f59d39c493308a856205e419d6119f5c2e181deeab`, retained through **2026-12-21 UTC**. [Final full QA + downloadable ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44845418646).
- Prior #268 ZIP SHA/size above is *historical evidence*, not the current full artifact's SHA. This final QA pointer was committed after #275 via `[skip ci]`; as always, the artifact cannot retroactively contain its own final recording.
- B6 baseline **accepted only as green development preview**. B7 production still gated. No merge/main/deploy and no other-game change.


## B7 — full-game release-candidate QA v0.7.0 (2026-11-21)

**Development baseline:** all B0–B6 functionality preserved, including 33 Academy lessons, 31 historic linked games with 1,923 SAN half-moves/116 original notes, original Coach, real Stockfish, 16 achievements and transparent, non-Elo independent AI Ladder Index. Dedicated branch `game/chess-odyssey-v0.1`; draft PR #7. No main merge or production deployment.

### B7 PRECHECK and technical fixes

- `docs/DEVELOPMENT_PROTOCOL.md` hard gates A–I, `AGENTS.md`, existing #275 180/180 passed suite, `ROADMAP.md` and source register read live. No direct production changes.
- Hardened `progress-core.validateMatch`: every claimed independent match is **replayed entirely from standard initial chess position**; a post-setup custom-FEN checkmate PGN must not be credited. Still rejects coaching/hint/Undo/invalid opponent level/fallback/duplicate ID.
- Full practice chessboard **roving keyboard focus**; arrows respect actual orientation, Enter/Space selects/moves, controls preserve focus after rerender. All 64 squares have Russian, English or Azerbaijani accessible *semantic* labels, not opaque “w q”.
- Promotion dialog opens with keyboard focus, Tab wraps, Escape cancels/reverts pending selection, focus returns to origin, no phantom selected pawn preventing second try; all 4 promotions accessible and correctly named.
- Read-only Masters replay board switched from 64 ineffective HTML buttons to **64 static div cells** under a localized spoken `role=img` position summary, eliminating an actual serious nested-interactive WCAG issue.
- Tablist ArrowLeft/ArrowRight/Home/End keyboard navigation and responsive 320/390/768/1024px controls.
- Independent source refresh `docs/SOURCE_B7_REFRESH.md`: live 2026-11-21 re-fetch of **31/31 primary historical game URLs**, match **1,923/1,923 SAN half-moves**, 31 white/black players, 31 years and 31 recorded results against registered primary pages. Crucial: this is **primary-source freshness**, not an independent secondary archive; B5 second-source parity status remains **4 full / 2 partial / 25 not independently double-verified**.

### Red→green failure history — never silently discard

| Run | Exact result | Investigation, repair and retest |
| --- | --- | --- |
| **#312** `44881519499` | Unit successful, Browser **FAIL** in existing B4 test | New accessible square names changed `aria-label` from machine-coded `a8 w q` to `a8 — белый ферзь`. Updated B4 test to assert the **exact semantic accessible queen/knight**, not to weaken promotion QA; `tests/academy-browser.cjs`. |
| **#314** `44881735089` | Old B0–B6 browser PASSED, B7 Chrome **FAIL** on second promotion attempt | Escape closed dialog but preserved selected pawn. Next click deselected it, so a second promotion wasn't offered. Updated `closePromotion` to clear pending state and selection, rerender and restore focus; B7 retest 27/27. |
| **#316** `44881941979` | B7 Chrome **27/27 PASS**, axe 1280px Practice PASS, Masters **FAIL** serious `nested-interactive` | Masters visual board used 64 HTML buttons inside `role=img`. Removed bogus buttons: static non-interactive squares, localized position/ply summary. Adjusted original B5 and B7 browser tests to assert real display behavior. |
| **#322** `44882203445` | **Three jobs SUCCESS**: B0–B7 unit, browser+axe, Windows real .cmd launcher | First green B7 236/236 Node+Chrome + Windows 1/1. Historical source, WCAG and legal QA all PASS. Preserved as earlier passing candidate artifact, not overwritten. |
| **#328** `44882567499` | **Three jobs SUCCESS** after adding a full **organic game** test | 237/237 Node+Chrome and Windows 1/1: 238/238; actual Stockfish-generated human moves versus real Beginner bot on the standard board, checkmate at **21 legal half-moves / 11 user turns**; score once + reload once. |

### Executed release candidate QA #328 — 238 / 238 PASS

| Gate | Checks | Result |
| --- | ---: | --- |
| Original B0–B6 exact suite | 180 | PASS |
| B7 chess perft(4)=197,281, special moves, FIDE claim caveat, full-start PGN, sources and RU/EN/AZ checks | 22 | PASS |
| B7 real desktop/mobile full game controls, castling/en passant, Q/N promotion, Escape/retry, tab/board keyboard, 320–1024px, local save and full Morphy historical replay | 27 | PASS |
| B7 **non-seeded complete independent game** with actual Stockfish/real local AI | 1 | PASS; **21 plies, checkmate**, no game-result double count |
| B7 **axe-core WCAG 2.2 A/AA** real Chrome scans: all 3 tabs × 1280/390 and actual modal | 7 | PASS; **zero automated rule violations** |
| **Node + Chrome subtotal** | **237** | **PASS** |
| Actual **Windows Server 2022** runner: extracted complete GPL ZIP, `START_WINDOWS.cmd` execution, loopback-only bind, real Stockfish WASM HTTP and progress module | 1 | PASS |
| **TOTAL EXECUTED** | **238** | **238 PASS, 0 FAIL** |

**Important evidence granularity:** The organic match starts from a fresh standard board and has no seeded PGN. Stockfish 19 chooses user moves via real UCI and actual browser clicks; app's original Beginner bot replies, and actual chess.js checkmate completes the game. This proves a full end-to-end game, **not human Elo calibration**, nor a claim that every possible full game has been explored. Detailed automated navigation and explicit limitations in `docs/RELEASE_B7_QA.md`.

**Artifact #328:** 40 files, full source and GPL with unmodified Stockfish JS/WASM. `ChessOdyssey_v0.7.0_Stockfish_Preview.zip` **1,522,339 bytes**, built and CRC reopened SHA256 **`282ce29786d345d3416f3f2f9083265575659b768f0d48b3ebc48d3ac6b56928`**. GitHub Actions artifact `ChessOdyssey-v0.7.0-Release-Candidate-Stockfish-PREVIEW` ID **14699065412**, outer wrapper SHA256 `b70348c9448052c6834fdd0d5d1b4088584d94f5f81657dc9f531ecae2dd7f83`, expires **2026-12-21 UTC**. [Full CI, Windows and download](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44882567499).

### Release blockers and accepted scope boundaries

- **B7 automated functional QA PASS**, but `v1.0 production` remains BLOCKED by **Gate I**: owner has not specified/approved production destination, merge or deployment. Nothing has been deployed and `main` remains untouched.
- Gate F **human independent RU/EN/AZ educational and historical proofreading NOT TESTED** (automation checks coverage and representative meaning, not independent expert semantic certification).
- Gate G **human screen reader/assistive-device certification NOT TESTED**; axe found zero automatic A/AA rules violations but that alone is **not full WCAG conformance**.
- B5 historical archive second-source full verification is incomplete for 25 games, and partial for 2; 31 fresh primary-source matches must not be misrepresented as 31 independent second-source corroborations.
- Practice chess.js v0.10.3 **automatically adjudicates threefold repetition** rather than waiting for a player's FIDE claim (official 2023 FIDE Article 9.2); acceptable training simplification is disclosed, but **not an official tournament procedure**.
- Real Windows GitHub Actions virtual machine ran the .cmd launcher and verified loopback/Stockfish assets; **manual owner double-click and proprietary browser setups NOT TESTED**.
- LocalStorage scores remain private and not anti-cheat secure; the AI Ladder Index is not Elo/FIDE.

**Final technical authority:** `docs/RELEASE_B7_QA.md`, `docs/SOURCE_B7_REFRESH.md`, `docs/PROGRESS_B6_DESIGN.md`, B5 primary source register, full CI #328, exact SHA. No autodeploy or project mixing.


### Final documentation-synchronized release-candidate package — #339

**GitHub Actions run #339**, ID **44883137898**, is **SUCCESS for all three actual jobs** after the substantive B7 README, QA, release-gate/source authority and changelog documentation was saved. It independently reran **238/238 tests PASS** (237 Node/Chrome + native Windows 1) and rebuilt the packaged real Stockfish preview. B7 game code and tests are unchanged relative to the previous green #328.

- An additional **fully organic**, no-seeded-PGN, standard-start end-to-end game was played: actual Stockfish 19 calculated user moves, the game executed them via Chrome, and the real Beginner bot answered. **55 SAN half-moves / 28 player turns / checkmate**, single independent result persisted after reload. This confirms independent end-to-end behavior under another non-deterministic AI line. Earlier #328 **21-ply checkmate** remains a valid separate historical test; the two run lengths are not contradictory.
- B7 chess legal Unit checks **22/22**, UI Chrome **27/27**, axe WCAG scans **7/7 with zero detected violations**, existing B0–B6 **180/180**, actual Windows .cmd+loopback+GPL/WASM smoke **1/1** all PASS.
- Final actual inner `ChessOdyssey_v0.7.0_Stockfish_Preview.zip`: **40 files**, **1,527,860 bytes**, SHA256 **`bb9fa7b525f320ce50fdc0465ca63c5eac2d91807cc234f914bb9f5fafa37d94`**. The CI build reopened the zip with CRC validation.
- GitHub downloadable artifact name **`ChessOdyssey-v0.7.0-Release-Candidate-Stockfish-PREVIEW`**, ID **14697794883**; GitHub wrapper SHA256 **`2d5df0f05146e92bd7270dd947e696fe069750dca1ced3b648bde272f07ef18f`**, expires **2026-12-21 UTC**. [Final tested package and logs](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44883137898).
- The older #328 package ID, size and SHA above remain immutable historical audit evidence, **not** the latest distribution.
- This final pointer was written **after** the #339 package, using a **documentation-only [skip ci] commit**. As expected, the #339 ZIP contains the full B7 substantive documentation used for the run but cannot retroactively contain this final checkpoint paragraph.
- No move to `main`, no merge or production deployment was requested or performed. **Release Gate I remains BLOCKED**; independent human RU/EN/AZ teaching editorial signoff, manual screen-reader audit and comprehensive second-archive verification have not been executed. All older red-to-green failure history is preserved above.

## B8 v0.8.0 (2026-11-21) — executable clock checkpoint, not production
- Branch: `game/chess-odyssey-v0.1`. Tested source SHA `5030740f2a0f8c0b9c1c0b0709db905381844be8`, [CI #372](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44888424604): all 3 jobs **success**.
- New tests: `tests/clock-core.cjs` **18/18 PASS** (presets, monotonic elapsed debit, increments, flags, pause/resume, reload validation, custom constraints, no-clock). `tests/b8-clock-browser.cjs` **12/12 PASS** under real Google Chrome (timer 15+10, 20s debit, correct 10s increment, hourglass, reload, multilingual labels, 390px viewport, rematch, resignation, bullet flag and reload, zero JS errors).
- Previous B0–B7 unit and Chrome suites all green in same CI, including real non-seeded Stockfish-vs-Beginner complete game, seven axe checks with zero reported serious/critical violations, 33 Academy exercises, 31 historical games and original Index proof. Native Windows 2022 launcher, GPL license and WASM localhost smoke **1/1 PASS**.
- ZIP: `ChessOdyssey_v0.8.0_Stockfish_Preview.zip`, **42 files / 1,545,715 bytes**, inner SHA256 `d89214184b7e2cd9a45b2d8c17d01c8049d6d4e70fb40fb823974164f7d55daa` as executed in #372. Build emitted updated standalone `dist/ChessOdyssey_v0.8.0_PREVIEW.html`; unmodified versioned older rollback artifacts remain in repository.
- Preserved failures: #361 / #362 B8 test incorrectly demanded exact millisecond in real Chrome despite actual legal-timing behavior; fixed to bounded millisecond tolerance; #369 B8 test regex incorrectly matched a literal backslash rather than `15:00`; fixed. Both were test-harness errors; do not relabel as a source chess-rule defect.
- OPEN / NOT TESTED: owner manual Windows+phone UX and audio, professional RU/EN/AZ semantics, exhaustive exceptional timeout-material reasoning, further bounded opening content, full secondary archive historical parity and final host/production owner gate. Existing AI Index never ingests timed games; this is a deliberate conservative methodology choice, not verified timed skill calibration. B9 private multiplayer/Neon remains separate future work.
- No merge to main, no production deployment and no cloud credentials or DB updates occurred.

## 2026-11-21 — B8 expanded and B9 Neon staging verification
- Exact GitHub CI [#403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027): all jobs SUCCESS; B8 clock unit 32/32, browser 12/12; B9 local server domain 27/27, localhost HTTP 15/15, two real isolated browser contexts 11/11; legacy regression and Windows smoke green. Local fixture is not real online E2E.
- Verified Neon connected, organization Free; created isolated `Chess Odyssey — Staging` project `wild-hall-05832800`, `aws-eu-central-1`, PostgreSQL 17, branch `br-still-credit-b9voxawu`.
- Staging schema `chess_odyssey` 4 tables applied in one 20-statement transaction; readback confirmed RLS=true, FORCE RLS=true, policies=0 on every table. None of this is production. Neon Auth get returned HTTP 404/not enabled; real-user security QA is **BLOCKED** pending explicit authorization to change runtime Auth.
- Canonical detailed checkpoint: [B9_NEON_STAGING_CHECKPOINT_2026-11-21.md](B9_NEON_STAGING_CHECKPOINT_2026-11-21.md). No credentials committed, no real account provisioned, no API/Functions deployed, no merge/deploy.

## 2026-11-21 — Better Auth provisioning and staging security configuration (owner authorized)
- Neon target explicitly verified: `Chess Odyssey — Staging`, project `wild-hall-05832800`, database `chess_odyssey`, branch `br-still-credit-b9voxawu`.
- Auth provider **Better Auth enabled**; verified provider record, Auth endpoint and JWKS URL by independent connector readback; 9 Neon-auth managed tables exist.
- Owner-authorized staging settings: email/password ON; email-verification OTP required; send email on signup/signin ON; password reset revokes sessions; automatic sign-in after verification OFF; staging signups ON, localhost allowed, trusted production origins NONE.
- Initial request for email verification by **link** returned provider error `INVALID_EMAIL_VERIFICATION_METHOD`: Neon shared sender supports OTP only. Retested with OTP, successful configuration readback **PASS**.
- Zero auth users, game matches, invites, moves and player profiles from direct SQL count. No credentials/source secrets committed. Existing four game tables still deny access by default (RLS + FORCE RLS; no application policies).
- **Open:** real signup + delivered OTP + session/JWKS verification + access controls, durable transactions, actual authenticated dual-user browser E2E, production host and B8 human QA. Production UNTOUCHED.

## 2026-11-21 — Owner-authorized GitHub source and portfolio merges; pending distinct main CI
- **PR #8** (portfolio docs only) merged to `main`: `56d6c8406989c9887164c526c275e248de690f66`. It corrected the stale Chess Odyssey idea-only description without prematurely releasing chess runtime.
- Resolved **PR #7** branch/base divergence using a genuine two-parent merge commit `a406bcf843f0aea12025e441939df226e8571ccd`: exact 86 Chess Odyssey source/workflow blobs over current `main` base tree, verified zero missing Chess files, unrelated base changes or deleted files. No force push.
- **PR #7** then merged by explicit owner authorization to `main`: `cc3934d4fdefd0635339ef146cb760e43bb2553d`. Both PRs merged and read back.
- **QA limitation:** prior full code CI #403 is green, but a **new main-branch run** is required to validate merge integration; this docs/CI PR enables `main` push and PR triggers. No real Neon authenticated match, cloud service deploy or v1.0 release claimed.

## 2026-11-21 — POST-MERGE MAIN CI #407 (new verified source authority)
- PR #7 Chess source and PR #8 portfolio docs merged under owner's explicit authorization, then post-merge QA/links/CI PR #9 merged at `4a425823206c806df671c0abc9b69f02770067b7`.
- GitHub Actions [#407](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865) on `main` **3/3 jobs SUCCESS**: Linux Node + app/unit/integration B8 clock **32/32**, B9 domain **27/27**, B9 HTTP **15/15**; actual Chrome B8 browser **12/12**, genuine isolated Chrome contexts B9 **11/11**, B0–B7 regressions including organic Stockfish game; Windows `START_WINDOWS.cmd` 127.0.0.1-only localhost, real WASM, GPL license **1/1**.
- Built archive `ChessOdyssey_v0.8.0_Stockfish_Preview.zip` **42 files, 1,555,177 bytes**, SHA256 `3bac88d0d34bcf41fdaedb4b63e482398e6f850c5ba183f2d15bf0e07fcb3395`; GitHub outer artifact upload `#14705809423`, SHA256 `60ef4e19d535601e10f8cfca232496cd9e3f438d056eb7e1af678be61c233e32`. [Direct GitHub Artifact](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44901266865/artifacts/14705809423).
- **This is a post-merge MAIN CODE QA PASS.** Original historical failed runs and prior #403 QA remain in ledger, no rewrites. Website production/hosting and two real authenticated Neon users remain NOT DONE, manual B8 language/PC/phone acceptance OPEN; `v0.9` denotes current development phase, not distributed binary.
