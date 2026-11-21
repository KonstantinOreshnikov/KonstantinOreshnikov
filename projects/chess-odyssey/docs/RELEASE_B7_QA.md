# Chess Odyssey B7 — v0.7.0 Release-Candidate QA Protocol

**Status:** Acceptance execution pending (do not declare PASS before CI).  
**Branch:** `game/chess-odyssey-v0.1`; **release policy:** no `main` merge or deployment without explicit owner authorization.  
**Baseline:** B6 v0.6.0 successful GitHub Actions #275, 180/180 automated checks plus 34-file GPL source-inclusive ZIP.

## Scope: Unlazy QA and conservative release discipline

Rebuild from the complete source with no new backend, subscription, ads, remote chess API or proprietary historical commentary. Verify the *actual playable build*: 33 Academy lessons, 31 source-linked full games, 116 RU/EN/AZ original notes, six difficulty settings, true Stockfish Worker+WASM when HTTP hosted, Coach, special moves, saved PGN/undo, strict independent-game scoring, third Progress tab, and Windows localhost launcher.

### A–I release acceptance matrix (to be updated from executed evidence)

| Gate | Required evidence | Status at design |
| --- | --- | --- |
| A — Legal chess | Known perft 20/400/8902/197281, both castles, en passant expiry, Q/N promotion, checkmate, stalemate, insufficient material and threefold exercise draw | **PENDING** full B7 run |
| B — AI and Coach | Stockfish legal UCI and mate proof; no stale Worker reply; historical 31 complete games, original 116 teaching SAN positions; 33 valid lessons | **PENDING** full B7 regression |
| C — Practice/rated separation | B6 strict no live help, duplicate-result/Undo/fallback exclusions, full standard-start PGN proof, multi-reload integrity | **PENDING** full B7 run |
| D — Distribution/licensing | Versioned full GPL ZIP with unmodified Stockfish binary, manifest/source link, third-party notices, CRC and SHA256, no external runtime scripts | **PENDING** built artifact |
| E — Desktop/mobile | Real Chrome keyboard/pointer moves; castling, en passant, modal promotions, repetition draw and re-undo, checkmate, full source-game replay, autosave, 320/390/768/1024px, standalone | **PENDING** B7 Chromium |
| F — RU/EN/AZ | Coverage and semantic key assertions of all 33 lessons/116 notes/16 achievements, keyboard instructions, names, promotion; independent human professional proofreading | **AUTOMATED COVERAGE PENDING; HUMAN NOT TESTED** |
| G — Accessibility | Real axe-core WCAG 2.2 A/AA scans 3 tabs at 1280/390, modal, keyboard arrows/roving Tab/focus trap, accessible speech labels; screen-reader manual audit | **AUTOMATED PENDING; SCREEN READER NOT TESTED** |
| H — Regression & rollback | B0–B6 180 checks + B7 new tests green, all critical defects resolved or individually tracked; old v0.6.0 artifacts retained, reproducible v0.7.0 package, actual Windows runner | **PENDING** full CI + Windows |
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

## Verification and handoff

- Node: `tests/release-rules.cjs`; Chrome: `tests/release-browser.cjs`; automated WCAG: `tests/release-accessibility.cjs`; Windows runner: `.github/workflows/chess-odyssey-ci.yml`.
- Preserve B0–B6 existing tests and run them again without weakening assertions just to turn the pipeline green.
- Record every real failure with root cause, patch/commit, retest and final artifact SHA in `docs/QA_LOG.md`. Do not treat static test code as proof of execution.
- Keep v0.6.0 ZIP and standalone intact for rollback. The only approved release boundary here is B7 development test work on the dedicated non-main branch.
