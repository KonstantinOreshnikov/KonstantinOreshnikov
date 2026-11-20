# Chess Odyssey — Incremental Roadmap

## Delivery discipline
Each block: reuse precheck -> minimal implementation -> targeted unit/perft -> browser regression -> checkpoint with commit hash -> next block. A completed feature is not a release.

| Block | Scope | State | Acceptance |
| --- | --- | --- | --- |
| B0: Chess foundation | Offline legal rules engine, standard 8×8 board, valid moves, no time control | CODE COMMITTED; UNIT PASS; browser unknown | perft, special moves, PGN, click board |
| B1: Gentle practice | Beginner and Novice AI with legal search, move history, undo, hints, auto save, black/white, 3 board lessons, RU/EN/AZ UI | CODE COMMITTED; PARTIAL QA | Real Chromium full-game runs and content review |
| B2: Trainer upgrade | Actual 2–3 candidate comparison with search-aware counterplay, blunder classification and post-game review | BACKLOG | Legal PV and verifiable explanation for every claim |
| B3: Engine strength | Configurable 6 levels, optional Stockfish separate-worker WASM integration and GPL source compliance | BACKLOG | Search strength/speed baseline, no invented Elo |
| B4: Academy expansion | Castling, en passant, tactical motifs, annotated openings both colors, endgame mini-drills | BACKLOG | Legal FENs, meaningful exercises, independent teaching QA |
| B5: Masters & Legends | Verified historical PGNs and annotated variations | BACKLOG | Source provenance per game; full move matching |
| B6: Progress | Training stats, Academy Reputation, provisional internal rating only for no-hint independent rated games | BACKLOG | Rated/training separation, no fake FIDE Elo |
| B7: v1.0 release gate | Mobile/desktop E2E, promotion, draw, complete games, save/recovery, RU/EN/AZ review, legal, accessibility | BLOCKED | All gates A–I PASS, verified deployment |

**One-file launch:** create a standalone HTML bundle as a distribution artifact only after tests; multi-file sources remain canonical and diffable.

## Product expectations
- Default no clocks and full explanations only when requested.
- Never call beginner engine moves grandmaster strength.
- Do not silently change other three games.
- Do not auto-merge into main or deploy until verified v1.0 acceptance.
