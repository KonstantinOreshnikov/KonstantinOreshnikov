# Chess Odyssey B7 — v0.7.0 Release-Candidate QA Protocol

**Status:** **B7 functional and automated RC acceptance PASS** — [final documentation-synchronized three-job GitHub Actions #339](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44883137898): 238/238 automated checks PASS, 40-file licensed ZIP. **v1.0 production still BLOCKED** on remaining human/owner gates.  
**Branch:** `game/chess-odyssey-v0.1`; **release policy:** no `main` merge or deployment without explicit owner authorization.  
**Baseline:** B6 v0.6.0 successful GitHub Actions #275, 180/180 automated checks plus 34-file GPL source-inclusive ZIP.

## Scope: Unlazy QA and conservative release discipline

Rebuild from the complete source with no new backend, subscription, ads, remote chess API or proprietary historical commentary. Verify the *actual playable build*: 33 Academy lessons, 31 source-linked full games, 116 RU/EN/AZ original notes, six difficulty settings, true Stockfish Worker+WASM when HTTP hosted, Coach, special moves, saved PGN/undo, strict independent-game scoring, third Progress tab, and Windows localhost launcher.

### A–I release acceptance matrix (to be updated from executed evidence)

| Gate | Required evidence | Status at design |
| --- | --- | --- |
| A — Legal chess | Known perft 20/400/8902/197281, both castles, en passant expiry, Q/N promotion, checkmate, stalemate, insufficient material and threefold exercise draw | **PASS — 22/22 added B7 Unit QA plus baseline** |
| B — AI and Coach | Stockfish legal UCI and mate proof; no stale Worker reply; historical 31 complete games, original 116 teaching SAN positions; 33 valid lessons | **PASS — all B0–B6 regressions + real Stockfish** |
| C — Practice/rated separation | B6 strict no live help, duplicate-result/Undo/fallback exclusions, full standard-start PGN proof, multi-reload integrity | **PASS — organic independent game and protected PGN** |
| D — Distribution/licensing | Versioned full GPL ZIP with unmodified Stockfish binary, manifest/source link, third-party notices, CRC and SHA256, no external runtime scripts | **PASS — 40-file GPL ZIP and SHA/CRC validated** |
| E — Desktop/mobile | Real Chrome keyboard/pointer moves; castling, en passant, modal promotions, repetition draw and re-undo, checkmate, full source-game replay, autosave, 320/390/768/1024px, standalone | **PASS — 27/27 Browser + 1/1 full unseeded game** |
| F — RU/EN/AZ | Coverage and semantic key assertions of all 33 lessons/116 notes/16 achievements, keyboard instructions, names, promotion; independent human professional proofreading | **AUTOMATED COVERAGE PASS; HUMAN EDITORIAL NOT TESTED** |
| G — Accessibility | Real axe-core WCAG 2.2 A/AA scans 3 tabs at 1280/390, modal, keyboard arrows/roving Tab/focus trap, accessible speech labels; screen-reader manual audit | **AXE 7/7 PASS, zero violations; HUMAN SCREEN READER NOT TESTED** |
| H — Regression & rollback | B0–B6 180 checks + B7 new tests green, all critical defects resolved or individually tracked; old v0.6.0 artifacts retained, reproducible v0.7.0 package, actual Windows runner | **PASS — 237/237 Node+Chrome checks and Windows 1/1** |
| I — Production owner | Approved production hostname/hosting, user acceptance of external historical/editorial limitations, authorized merge and verified release | **BLOCKED — requires explicit owner approval** |

**Do not call `v1.0 ready` while Gate I is blocked or material high-impact defects remain.** A green v0.7.0 release candidate is a **development milestone**, not a public deployment.

## Critical release repairs built into B7

1. **No fake full games:** B6 `progress-core.validateMatch` now validates that every SAN move can be replayed from the standard chess starting position and reconciles exact terminal FEN. A checkmate PGN generated from a custom late-game FEN is **not** credited as an independent match.
2. **Keyboard chessboard:** arrow-navigation respects board flip, one roving Tab stop, Enter/Space selects the actual cell, updates focus after DOM re-render, RU/EN/AZ accessible labels for all 12 colored piece types and empty squares.
3. **Pawn promotion dialog:** modal initial focus, keyboard Tab wrap, Escape cancellation, focus returned to piece/cell, semantic labels on all four promoted-piece buttons; no board moves while promotion choice pending.
4. **Three-tab WAI patterns:** roving Tab focus and Left/Right/Home/End navigation, selected panel hidden using `hidden`, historical display board stays 64 source-backed cells but avoids 64 dead keyboard stops and announces current ply.
5. **Automated accessibility:** `@axe-core/playwright` pinned in dev-only CI; fail on serious/critical WCAG 2.2 A/AA violations in three tabs at desktop/phone and promotion modal. No claim of human screen-reader test from axe alone.
6. **Windows launch:** actual Windows GitHub Actions VM unpacks the full release package, invokes the Windows launcher and probes localhost HTML/real engine assets; **not** misrepresented as a human double-click experience on the owner's PC.

## Known standard / research caveats

- Official [FIDE Laws of Chess effective 1 Jan 2023](https://handbook.fide.com/chapter/E012023) Article 9.2 treats threefold-repetition as a **claimable draw**; pinned `chess.js` v0.10.3 automatically declares a draw at threefold repetition (and uses training-friendly claimable-draw shortcuts). The product is an **offline coaching game with simplified automatic adjudication**, not a regulated FIDE tournament arbiter. Keep visible training scope; do not claim complete tournament-claim procedure.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) requirements are used for automated AXE rules, keyboard reachability and focus. **Automated axe PASS does not prove full WCAG conformance**, screen-reader parity, physical-device readability or native-language educational correctness.
- B7 primary score re-fetch: `docs/SOURCE_B7_REFRESH.md` records **31/31 full primary-page matches / 1,923 SAN** and all metadata. This **does not independently double-source** the 25 remaining historic score records; B5 register owns second-archive provenance limitations.
- Last 500 local independently recorded bot matches are retained; not a lifetime audited total and not a secure human skill estimate. AI Ladder Index 0–100 is not Elo.
- A correct UI checkmate reached from a seeded **legal, standard-start PGN prefix** is a deterministic E2E check, not a claim of many organic, fully independent games played by people.

## Executed B7 checkpoint — GitHub Actions #328

**Three jobs SUCCESS:** Offline rules+app, genuine Chromium E2E and actual packaged Windows .cmd launcher/loopback/Stockfish assets.

| Gate family | Executed checks | Result |
| --- | ---: | --- |
| B0–B6 existing complete baseline | 180 | PASS |
| New B7 perft/special chess rules/PGN provenance/source/legal translation | 22 | PASS |
| B7 real Chrome desktop/mobile/practice special moves, keyboard/ARIA | 27 | PASS |
| **Organic unseeded actual Stockfish-as-user vs Beginner bot full match** | **1** | **PASS — 21 plies, 11 user turns, checkmate** |
| B7 axe-core WCAG 2.2 A/AA on 3 tabs × 2 viewports + actual promotion modal | 7 | PASS — 0 automated violations |
| **Subtotal Node + Chromium** | **237** | **PASS** |
| Real Windows 2022 .cmd packaged local server, loopback binding, GPL, WASM | 1 | PASS |
| **Total executable gates** | **238** | **238 PASS / 0 FAIL** |

**Real organic game evidence:** Browser opened `index.html` via localhost, selected Independent/Beginner; a **second genuine Stockfish 19 Lite Worker** calculated user moves, clicked each on the actual chessboard, and the real Beginner AI replied through app.js. **No PGN was seeded and no bot move was mocked.** Normal starting position to real **21-ply checkmate**. The terminal result was counted once as an independent match and remained once after reload; the AI Index stayed hidden because only one independent match existed. This verifies **complete gameplay**, but is **not** human skill calibration or proof of every potential opening.

**Source reconciliation:** all 31 historical primary game pages freshly re-fetched, 1,923 full SAN moves matched and all recorded players/years/results consistent; independent secondary archive gaps disclosed in `docs/SOURCE_B7_REFRESH.md`.

**Executed B7 package in #328:** 40 files, 1,522,339 bytes, SHA256 `282ce29786d345d3416f3f2f9083265575659b768f0d48b3ebc48d3ac6b56928`. Note that this is the **#328 snapshot**, and a later documentation-synchronized repack can have a new deterministic SHA; the current SHA and artifact are tracked in QA_LOG.md. [Complete CI #328](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44882567499).

### Truthful v1.0 gate summary

**Automated functional QA A–E and technical parts of F–H PASS.** There is **no claim of full WCAG certification** from axe, nor human editorial RU/AZ/EN sign-off, nor independent historical double-source proof for every score. Gate I remains **BLOCKED** until an explicit owner-approved destination, merge, production deploy and post-deploy smoke. No authorization to do any of those actions has been received in this turn.

### Final reread — CI #339 and independently played second full game

Final three-job CI #339 (`44883137898`) **SUCCESS** after packaging the substantive source/register and release documentation. B0–B7 tests still **238/238 PASS**, including genuine Windows launcher and zero automated WCAG A/AA violations. A new non-seeded, standard-start real Stockfish-user-vs-Beginner-AI game ended in **55 legal half-moves (28 user turns), checkmate**; the independent record remained single-counted after reload. This differs from the previous #328 **21-ply checkmate** only because the AI chooses variable legal lines. Source and historical limitations remain unchanged.

Latest CRC-verified inner **40-file ZIP**: 1,527,860 bytes, SHA256 `bb9fa7b525f320ce50fdc0465ca63c5eac2d91807cc234f914bb9f5fafa37d94`; GitHub Actions artifact `ChessOdyssey-v0.7.0-Release-Candidate-Stockfish-PREVIEW`, ID **14697794883**, retains full GPL notices, source/register docs and the standalone. Exact [final evidence and file](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44883137898). No `main` merge or deployment, no change to open independent human/owner gates.

## Verification and handoff

- Node: `tests/release-rules.cjs`; Chrome: `tests/release-browser.cjs`; automated WCAG: `tests/release-accessibility.cjs`; Windows runner: `.github/workflows/chess-odyssey-ci.yml`.
- Preserve B0–B6 existing tests and run them again without weakening assertions just to turn the pipeline green.
- Record every real failure with root cause, patch/commit, retest and final artifact SHA in `docs/QA_LOG.md`. Do not treat static test code as proof of execution.
- Keep v0.6.0 ZIP and standalone intact for rollback. The only approved release boundary here is B7 development test work on the dedicated non-main branch.
