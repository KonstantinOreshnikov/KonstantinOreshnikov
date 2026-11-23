# Chess Odyssey — colleague-feedback UX and chess analysis proposal

**Date:** 2026-11-23 (Asia/Baku)  
**Classification:** OWNER FEEDBACK + DESIGN CANDIDATE — NOT APPROVED, NOT IMPLEMENTED, NOT RELEASED.  
**Technical project:** `projects/independent-game-studio/games/chess-odyssey/` on GitHub `main` (the game was migrated under `independent-game-studio/games`; prior `projects/chess-odyssey/` pointers are obsolete).  
**Current baseline:** B9 / v0.9 development; last verified playable v0.8.0 preview; prior main-branch CI #407 PASS, **not** evidence of the new requested features. Production/cloud human-vs-human E2E remains OPEN.

## Owner feedback (verbatim intent, paraphrased)
Colleagues tested a standalone HTML. Reported that they did not have backward/forward move navigation or a visible complete trilingual interface; requested a polished theme selector, multiple piece silhouettes/finishes and color compatibility, per-move visual classifications during learning and after ordinary AI/PvP games, a step-through move review, and a two-side performance summary (opening, tactics, coordination, advantage conversion, endgame). User requested **proposal and visual options for discussion before any runtime changes**, not immediate implementation. Screenshot contains sample human-written Azerbaijani subjective grades; **do not treat those grades as generated Stockfish outputs**.

## PRECHECK / QA conflict (verified source versus user-observed behavior)
- In `index.html` and the *reproducibly bundled* `dist/ChessOdyssey_v0.8.0_PREVIEW.html`, HTML contains a language selector `#lang` with `ru/en/az` and an `#undo` button. `app.js` wires language change to `refreshLabels()`, and `undo()` exists. These *source-presence facts do not prove visibility or usability in the colleague's exact opened file*. The exact tested copy/file hash was not provided; do not conclude the tester was wrong.
- The main Practice/Academy tab has **no redo, start/end, move-index scrubber or full interactive ply-by-ply timeline**. `undo()` deletes moves (normally a human+AI pair), while dedicated history navigation `#m-prev`, `#m-next` exists only in Masters & Legends. `#lang`, `#m-lang` and `#progress-lang` are separate UI controls. Thus *unified discoverable locale switching and standard-party replay are genuine feature gaps*.
- The local Coach `renderReview()` shows up to three ranked key notes, not a full deep Stockfish classification of **every** move by **both** colors. `engine-bridge.js` `Bridge.choose()` handles `bestmove` for opponent AI, but does **not** expose versioned MultiPV/depth/centipawn/mate evaluation series for full-game review.
- Standalone `file://` cannot load the existing Stockfish 19 Lite Worker+WASM in the current build. It uses a weaker local fallback. Therefore **never advertise deep Stockfish analysis inside a lone `.html` unless a new offline-safe worker-bundle is actually engineered and QA-passed**. Support the robust ZIP + localhost launch as the primary deeper review environment, or explicitly degrade to lightweight explanatory coaching with `engine unavailable` disclosure.
- Current `main` and last tested ZIP may differ from copies held by colleagues. B8's previous automated PASS is **not equivalent to owner UAT**: this is a newly surfaced QA/user-experience gap. Do not rewrite historical CI.

## Scope proposal — ordered priorities

### P0. Unify languages and move navigation, fix discoverability
1. Persistent **global RU | EN | AZ** selector in the visible top application bar, on mobile and desktop. Switching language **must not start/reset a game**. Propagate to all tabs: Practice, Academy, Masters, Progress, clocks, modal dialogs, review, accessibility strings, status messages and all new settings. Keep only one language source of truth, with backwards-compatible migration from existing separate locale settings.
2. Move browser toolbar on any ordinary game's board: `|◀` beginning, `◀` previous half-move, `▶` next half-move, `▶|` latest/live; click a SAN in the move list to jump to it, show `ply / total plies`. On completion, allow all 0…N positions, including initial FEN, captures, castling, promotion and checks. Provide **Return to live** when match is still running.
3. **Separate concepts:** `Review previous position` is a non-destructive *read-only timeline cursor*; `Undo last move` changes the actual practice game (and may invalidate AI scoring or require clock/history rollback). Never use the same control for both. During independent/competitive AI and online PvP, historical browsing is allowed while the real authoritative game continues, but actual move undo is restricted/disabled by game policy. No hints/engine evaluation shown for active competitive PvP.
4. Keep move-timeline cursor independent from canonical `game` and clock, with explicit return to live; UI board reconstruction from immutable SAN/PGN via chess.js. Handle reload, keyboard focus (existing arrows navigate squares when the chessboard has focus), timestamps and last move highlighting. Avoid phantom changes to score, localStorage and server state.
5. Add visible version in standalone header and one concise filename/hash support aid. E2E compare separately `index.html`, freshly generated `v0.8.0` standalone, ZIP/localhost; verify screenshot/colleague's exact copy when available. Do not ask for rework of existing legacy content without a demonstrated gap.

### P1. Board customization with compact previews
Two dropdowns in a single `Board appearance` menu: **10 curated board color presets** (selection by aesthetic/legibility rather than unverified global popularity rankings) and **10 distinct piece-style options**. Suggested default: **Walnut Classic + Staunton**. A third optional `Piece color` choice is auto-recommended and user-changeable only among accessible variants. Board and piece sets must share a coherent visual language and preserve clear white/black separation.

| ID | Board theme | Light squares | Dark squares | Recommended pair |
| --- | --- | --- | --- | --- |
| 01 | Walnut Classic / Классика | `#F0D9B5` | `#B58863` | Ivory & Ebony Staunton |
| 02 | Deep Graphite / Графит | `#9CAAB6` | `#374757` | White/Black bold outlined |
| 03 | Steel Blue / Синяя сталь | `#DCE8F3` | `#6289B1` | Ivory & charcoal tournament |
| 04 | Tournament Green / Турнирная зелёная | `#EEEED2` | `#769656` | Ivory & ebony Staunton |
| 05 | Sandstone / Песочная | `#F4E9CE` | `#B59E78` | Black outline / light ivory |
| 06 | Silver Minimal / Серая | `#E7ECEF` | `#747E87` | High-contrast minimalist |
| 07 | Bordeaux / Бордо | `#F1E2DC` | `#974A60` | Ivory & dark charcoal classic |
| 08 | Amethyst / Аметист | `#E9E0F4` | `#8063A4` | Ivory & ebony neo |
| 09 | Sea Breeze / Морской бриз | `#D8E9E7` | `#478B90` | Ivory & navy modern |
| 10 | High-Contrast / Контрастная | `#FAFAF7` | `#38414A` | Outlined white & black |

**Piece styles to prototype, each requiring six distinguishable roles × two sides:** 1 Staunton Classic, 2 Tournament Bold, 3 Neo Flat, 4 Modern Minimal, 5 Outline, 6 Wooden, 7 Marble, 8 Metallic, 9 Soft 3D, 10 High-Contrast. These are **concept labels, not assets already sourced/implemented**; independently design them or inspect each upstream asset's specific author/license before inclusion. Do not blindly copy Chess.com UI/art. Reference: Lichess COPYING records varying licenses for different piece sets; one label does not imply all are free to relicense.

**Color and contrast gating:** guarantee visible white-vs-black separation on BOTH light and dark cells, and readable last-move, selection, check and valid-move indicators. Default auto-assign piece fills and a dual-tone stroke/shadow (light outline around dark piece on dark cell, dark outline around light piece on light cell), with a contrast audit using rendered 64-square boards, WCAG non-text contrast as a design target and color-blind simulated screenshots. Disallow/correct poor combos (e.g. yellow pieces on beige/yellow board, green silhouettes on green board). Ensure legibility in small mobile squares, flipped boards, dark/light app UI. Store `boardThemeId`, `pieceSetId`, `pieceColorwayId` in versioned persistent display preferences; apply across Practice, Masters, Academy, replay and PvP without changing chess rules or PGN. Fast, offline-safe switch; no gameplay reset.

### P2. Complete two-side per-move Game Review
**Two analysis states, never mixed:**
- `Learn / coached practice`: after the learner plays a legal move, show short on-board move verdict plus optional explanation, tactical threat and alternative; optionally richer Stockfish assessment when a real licensed analysis Worker is available. Give actual immediate feedback during Academy only when appropriate for a pedagogical exercise; never spoil the next expected answer before user commits. Avoid claiming current shallow COACH heuristic is an objective engine score.
- `Completed ordinary AI / PvP / independent match`: compute a **full post-game asynchronous** evaluation, scoring **every half-move** for both colors from canonical played PGN. Each classification must map to a specific move, FEN, evaluated before/after position, engine depth, engine version, best legal alternative, PV and uncertainty/fallback. The analysis is separate from the server-authoritative game, clocks, results and AI Ladder Index.
- `Active PvP or unassisted competitive AI`: **no live Stockfish evaluation, hint overlays or best-move reveal**. Analysis is available only after the server commits a finished result, for both players.

**Proposed generic move label taxonomy, independent implementation (not a copy of Chess.com's proprietary model):**

| Tag | Russian | English | Azerbaijani | Behavior |
| --- | --- | --- | --- | --- |
| `book` | Дебютный | Book | Debüt gedişi | Only if linked to an actual approved opening library, otherwise omit |
| `brilliant` | Блестящий | Brilliant | Parlaq | Optional advanced heuristic; **DO NOT fabricate** from simple cp-loss threshold |
| `best` ★ | Лучший | Best | Ən yaxşı | Matched a top engine variation (within analysis confidence) |
| `excellent` ! | Отличный | Excellent | Əla | Very small loss of position value |
| `good` ✓ | Хороший | Good | Yaxşı | Reasonable but not top |
| `inaccuracy` ?! | Неточность | Inaccuracy | Qeyri-dəqiqlik | Noticeable loss of practical winning chances |
| `mistake` ? | Ошибка | Mistake | Səhv | Significant loss of winning chances |
| `blunder` ?? | Грубая ошибка | Blunder | Kobud səhv | Severe loss; red marker with text (not color-only) |
| `unknown` — | Нет оценки | Not evaluated | Qiymətləndirilməyib | Worker absent, insufficient depth or failed analysis |

Implement distinct **visual badges**, not just emoji, and a textual accessible label for each; retain chess annotation marks `!`, `?`, `?!`, `??` where meaningful. The full per-move classification is a **new deterministic documented methodology**, preferably based on calibrated, versioned **win-probability / expected-points loss**, rather than arbitrary raw centipawn cutoffs. The two prominent references are *Chess.com Game Review* classifications (published 9 Feb 2026 Expected Points V2, including special-case Brilliant/Great/Miss) and *Lichess Accuracy* (Win% and volatility-weighted metrics). **Reference these ideas, do not misrepresent our scoring as the same proprietary Chess.com algorithm.**

**Evaluation architecture:** existing `engine-bridge.js` currently parses only `bestmove` for play, not `info ... score cp|mate, multipv, pv, depth`. Build a *separate* `AnalysisBridge` with UCI `MultiPV` support and score normalization from side-to-move into consistent player/white point of view. Analyze initial and each intermediate legal game position, including mate and special draw score; use caching by `PGN/FEN, ply, engine SHA/version, depth, perspective and method version`. Collect exact completed/failed/countable moves and avoid mixing only-available scores with unanalysed moves. Provide user-configured CPU/time budget (quick/balanced/deep); do not block board, UI or game clock, and do not queue one long job per render. Expose partial progress and cancellation. Reconcile exact PGN replay and protect against worker timeout/fallback. Genuine engine is available in ZIP via localhost/HTTPS; unsupported `file://` mode displays unavailable/limited verdict, never fictional deep scores.

**Full report format:** `White vs Black` columns with independently computed accuracy (%) and counts for Best, Excellent, Good, Inaccuracy, Mistake, Blunder, Book/Unclassified; total analyzed plies for each color, explicit denominator/exclusions, evaluation chart over each *half-move*, opening/tactics/coordination/conversion/endgame **coaching dimensions only when measurable by published transparent heuristics**. Treat phase categories as optional educational annotations, **not pseudo-authoritative 5/10 grades without source**. Differentiate **ply (half-move)** from **full turn** and actual stored result from checkmate claim. Avoid claims like engine-estimated FIDE Elo or guaranteed real skill rating.

**Review UX:**
- Step arrows `first/prev/next/last`, clickable timestamped SAN list and `next critical mistake`; reconstruct board as of selected ply, highlight move with an arrow and badge. At each move show `Actual: ... / Best: ... / Position before -> after / Why / one or two likely continuations`; explain in simple RU, EN or AZ. Never reveal an evaluation during active competitive play.
- Progress graph anchored to actual plies. Click a graph point to jump to that position.
- `Retry from this position` is a **separate training fork**, never a modification of finished PGN/official result or PvP cloud record.
- On mobile, board occupies the upper panel and report collapses below; clock is only live during active game. Saving analysis is optional and bounded.

## Priority and actual release scope (proposal, not approved)
- **P0 / hotfix candidate before calling B8 user-accepted:** trilingual discoverability + one-language truth + full **non-destructive move replay** and independent Practice-only `undo`. This directly addresses the reported failure.
- **P1:** ten curated boards + ten piece styles + automatic legible color pair and mobile previews, preferences/migration.
- **P2:** independent analysis Worker, Full Game Review for both colors, verified per-move taxonomy, score chart, retry; immediate educational feedback only in Academy/Coached Practice.
- **B9 existing committed core stays in scope:** actual Neon authenticated persistent PvP as previously approved. Do not replace this with a UI-only update or claim cloud E2E by finishing themes.
- **B10:** real mobile/desktop owner and colleague acceptance, trilingual human content QA, full legacy+new E2E, accessibility, licensing, v1.0 production after separate owner approval.

## QA / Unlazy acceptance gates
1. **Binary provenance:** record colleague's exact HTML/ZIP filename, hash and capability header when obtained; compare main source, standalone and ZIP. If selector/undo exists but is hidden/unusable, reproduce it on exact device/viewport. File presence != user-visible PASS.
2. **Localization:** switch language while a game is ongoing and at every tab; verify no loss of game, PGN, score, clocks, saved progress and all explanatory copy. Validate Russian/English/Azerbaijani semantics, including piece names, SAN, pluralization and screen readers. No duplicate manual translation forks.
3. **Navigation:** test first/last/prev/next 0..N on mate, draw, resignation, timed flag, castling, underpromotion, en passant, black-to-move, AI async and reconnect; ensure read-only replay cannot change canonical match revision, clocks, scores or achievements.
4. **Theme:** 10 × 10 theme/style compatibility matrix (100 combinations) across both orientations, light/dark squares, 390px phone and desktop; ensure text labels/contrast, promotion picker, clock/check highlights, last-move color and persisted restore; never change chess semantics, game completion or historical replay.
5. **Review engine correctness:** compare classifications to legal independent UCI evaluations on small golden PGNs (incl. strong/weak move, mate, tactical refutation, initially equal, clearly winning, insufficient mating material). Parse cp, mate, MultiPV, async timeout/cancel, score perspective and all denominators. Repeat runs stable within declared depth, and expose `not evaluated` on engine unavailable.
6. **Fair play:** no analysis/hints in active PvP; only server-confirmed finished PGN triggers player-accessible review; test unauthorized opponent, third-user access, client manipulation and stale session.
7. **Packaging/licensing:** standalone local HTML minimal mode and complete ZIP/localhost Stockfish mode explicitly tested; all piece asset authors and licenses documented, GPL Stockfish source preserved, no unpublished web-host assumptions.
8. **Evidence:** actual commit SHA, CI job, desktop and Android screenshots, user/colleague acceptance, PASS/FAIL/BLOCKED ledger; no retroactive relabel of #407.

## Reference authority (read 2026-11-23)
- Official Chess.com move-category methodology, Feb 9, 2026: https://support.chess.com/en/articles/8572705-how-are-moves-classified-what-is-a-blunder-or-brilliant-etc
- Official Chess.com Game Review documentation: https://support.chess.com/en/articles/8584089-how-does-game-review-work
- Official Lichess Accuracy methodology including limits of cross-site comparability: https://lichess.org/page/accuracy
- Lichess piece/board art licenses vary by individual set: https://github.com/lichess-org/lila/blob/master/COPYING.md
- Lichess Chessground GPL-3.0 source: https://github.com/lichess-org/chessground
- Current project scope and historical source/license ledger: `README.md`, `docs/CURRENT_STATUS.md`, `docs/QA_LOG.md`, `AGENTS.md`, `THIRD_PARTY_NOTICES.md`.

**Decision status:** Feedback received and proposition prepared; **no approval to implement these additions has been inferred**. Proposed preview mockups in conversation are illustrative only, with invented example game scores/accuracy and hypothetical piece/theme graphics, *not computed chess data or licensed production art*. Do not mutate approved gameplay state/Neon production or claim feature completion from this document.
