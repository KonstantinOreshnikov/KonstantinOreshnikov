# Chess Odyssey — Incremental Roadmap

## Delivery discipline
Each block: reuse precheck -> minimal implementation -> targeted unit/perft -> browser regression -> checkpoint with commit hash -> next block. A completed feature is not a release.

| Block | Scope | State | Acceptance |
| --- | --- | --- | --- |
| B0: Chess foundation | Offline legal rules engine, standard 8×8 board, valid moves, no time control | CODE COMMITTED; CI UNIT PASS + first Chromium E2E PASS | perft, special moves, PGN, click board |
| B1: Gentle practice | Beginner and Novice AI with legal search, move history, undo, hints, auto save, black/white, 3 board lessons, RU/EN/AZ UI | CODE COMMITTED; unit + synthetic DOM + first Chromium E2E PASS; deeper review pending | Real Chromium full-game runs and content review |
| B2: Trainer upgrade | Legal 2–3 candidate comparisons, one opponent reply, immediate threat warnings, shallow move grading, local notes and 3-moment endgame review | PREVIEW v0.2.1 CODE COMPLETE; unit / synthetic DOM / Chromium PASS on prior B2 run; latest patch retest tracked in QA_LOG | Every recommended SAN/reply verified legal, caveats explicit; deeper truth/translation QA before v1.0 |
| B3: Engine strength | Six profiles, real Stockfish.js 19.0.1 Lite Worker+WASM in HTTP mode, honest offline fallback, GPL/sha256, Windows localhost launcher and zipped distribution | PREVIEW v0.3.0 **QA PASS**: #112, 75/75 tests + ZIP PASS; physical Windows and calibrated strengths NOT TESTED | No invented Elo; actual UCI moves legal, cancelled move ignored, localhost only, asset and license integrity |
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

**B4 — academy expansion:** complete basic rules training (castling, en passant, promotions, checks/draws), intermediate tactics and endgame instruction through verified legal board exercises in RU/EN/AZ. Preserve the running six-level engine and B2 review; record real browser QA, content accuracy and license requirements. v1.0 remains blocked until B4–B7 requirements pass.
