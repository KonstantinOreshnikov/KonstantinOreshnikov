# Chess Odyssey — Incremental Roadmap

## Delivery discipline
Each block: reuse precheck -> minimal implementation -> targeted unit/perft -> browser regression -> checkpoint with commit hash -> next block. A completed feature is not a release.

| Block | Scope | State | Acceptance |
| --- | --- | --- | --- |
| B0: Chess foundation | Offline legal rules engine, standard 8×8 board, valid moves, no time control | CODE COMMITTED; CI UNIT PASS + first Chromium E2E PASS | perft, special moves, PGN, click board |
| B1: Gentle practice | Beginner and Novice AI with legal search, move history, undo, hints, auto save, black/white, 3 board lessons, RU/EN/AZ UI | CODE COMMITTED; unit + synthetic DOM + first Chromium E2E PASS; deeper review pending | Real Chromium full-game runs and content review |
| B2: Trainer upgrade | Legal 2–3 candidate comparisons, one opponent reply, immediate threat warnings, shallow move grading, local notes and 3-moment endgame review | PREVIEW v0.2.1 CODE COMPLETE; unit / synthetic DOM / Chromium PASS on prior B2 run; latest patch retest tracked in QA_LOG | Every recommended SAN/reply verified legal, caveats explicit; deeper truth/translation QA before v1.0 |
| B3: Engine strength | Configurable 6 levels, optional Stockfish separate-worker WASM integration and GPL source compliance | BACKLOG | Search strength/speed baseline, no invented Elo |
| B4: Academy expansion | Castling, en passant, tactical motifs, annotated openings both colors, endgame mini-drills | BACKLOG | Legal FENs, meaningful exercises, independent teaching QA |
| B5: Masters & Legends | Verified historical PGNs and annotated variations | BACKLOG | Source provenance per game; full move matching |
| B6: Progress | Training stats, Academy Reputation, provisional internal rating only for no-hint independent rated games | BACKLOG | Rated/training separation, no fake FIDE Elo |
| B7: v1.0 release gate | Mobile/desktop E2E, promotion, draw, complete games, save/recovery, RU/EN/AZ review, legal, accessibility | BLOCKED | All gates A–I PASS, verified deployment |

**One-file launch:** self-contained previews exist at dist/ChessOdyssey_v0.1.1_PREVIEW.html, v0.2.0_PREVIEW.html and v0.2.1_PREVIEW.html; source files remain canonical. Latest QA outcome and warnings are in QA_LOG.md.

## Product expectations
- Default no clocks and full explanations only when requested.
- Never call beginner engine moves grandmaster strength.
- Do not silently change other three games.
- Do not auto-merge into main or deploy until verified v1.0 acceptance.

## Next implementation block

**B3 — chess engine tiers:** research a browser-capable Stockfish build (GPLv3 distribution obligations and offline WASM size), build six sensible strength levels and verify a legal/consistent opponent on reference positions. Keep B2 explainable coach separate from engine scores; do not fake Elo. Follow Unlazy gates and preserve the weak learning opponent. v1.0 remains blocked until B3–B7 requirements pass.
