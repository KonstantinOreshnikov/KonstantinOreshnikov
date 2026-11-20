# Chess Odyssey — Incremental Roadmap

## Delivery discipline
Each block: reuse precheck -> minimal implementation -> targeted unit/perft -> browser regression -> checkpoint with commit hash -> next block. A completed feature is not a release.

| Block | Scope | State | Acceptance |
| --- | --- | --- | --- |
| B0: Chess foundation | Offline legal rules engine, standard 8×8 board, valid moves, no time control | CODE COMMITTED; CI UNIT PASS + first Chromium E2E PASS | perft, special moves, PGN, click board |
| B1: Gentle practice | Beginner and Novice AI with legal search, move history, undo, hints, auto save, black/white, 3 board lessons, RU/EN/AZ UI | CODE COMMITTED; unit + synthetic DOM + first Chromium E2E PASS; deeper review pending | Real Chromium full-game runs and content review |
| B2: Trainer upgrade | Legal 2–3 candidate comparisons, one opponent reply, immediate threat warnings, shallow move grading, local notes and 3-moment endgame review | PREVIEW v0.2.1 CODE COMPLETE; unit / synthetic DOM / Chromium PASS on prior B2 run; latest patch retest tracked in QA_LOG | Every recommended SAN/reply verified legal, caveats explicit; deeper truth/translation QA before v1.0 |
| B3: Engine strength | Six profiles, real Stockfish.js 19.0.1 Lite Worker+WASM in HTTP mode, honest offline fallback, GPL/sha256, Windows localhost launcher and zipped distribution | PREVIEW v0.3.0 **QA PASS**: #112, 75/75 tests + ZIP PASS; physical Windows and calibrated strengths NOT TESTED | No invented Elo; actual UCI moves legal, cancelled move ignored, localhost only, asset and license integrity |
| B4: Complete Academy | 33 playable RU/EN/AZ exercises across 4 tracks (rules 9, tactics 8, openings 8 in both colors, endgame 8); 49 learner moves, exact SAN, scripted replies, saved stages and progress | **PREVIEW v0.4.0 QA PASS** — #166, 99/99 all regression tests + 22-file ZIP integrity PASS. Independent editorial language review remains NOT TESTED | All starts nonterminal, special rules/objectives validated via chess.js, both-color/multi-step/promotions and mobile Chrome E2E |
| B5: Masters & Legends | Verified historical PGNs and annotated variations | BACKLOG | Source provenance per game; full move matching |
| B6: Progress | Training stats, Academy Reputation, provisional internal rating only for no-hint independent rated games | BACKLOG | Rated/training separation, no fake FIDE Elo |
| B7: v1.0 release gate | Mobile/desktop E2E, promotion, draw, complete games, save/recovery, RU/EN/AZ review, legal, accessibility | BLOCKED | All gates A–I PASS, verified deployment |

**One-file launch:** versioned standalone previews v0.1.1, v0.2.0, v0.2.1, v0.3.0 and current v0.4.0 are retained in dist/ for rollback; complete latest Stockfish WASM bundle is published as the GitHub Actions #166 verified ZIP artifact. Source remains canonical.

## Product expectations
- Default no clocks and full explanations only when requested.
- Never call beginner engine moves grandmaster strength.
- Do not silently change other three games.
- Do not auto-merge into main or deploy until verified v1.0 acceptance.

## Next implementation block

**B5 — Masters & Legends:** research verifiable public historical PGNs for representative master games (player, year, event, reliable PGN source, independent replay and exact move matching); offer on-board move-by-move annotated teaching in RU/EN/AZ with bookmarks and no invented claims. Reuse B4 Academy engine and ensure copyright/source-provenance controls. Preserve fully passing B0–B4 and do not touch other games.

**After B5:** B6 progress and rating/reputation separation; B7 production acceptance. Independent B4 RU/AZ/EN editorial review, accessibility, full-game outcomes and physical Windows launch must still be checked for v1.0. **Never merge main or deploy without explicit release authorization.**
