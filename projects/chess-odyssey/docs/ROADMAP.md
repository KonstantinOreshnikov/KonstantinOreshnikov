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
| B5: Masters & Legends | 31 provenance-linked full master games (1,923 legal plies) + 116 original RU/EN/AZ key moments, separate interactive board/slider/SAN/quiz/bookmarks/export/search | **PREVIEW v0.5.0 AUTOMATED QA PASS** — #206, 135/135 tests + 31-file ZIP PASS; secondary full-score parity incomplete for 25 games, independent editorial QA NOT TESTED | 31 source URLs, complete legal FEN replay, 116 legal quizzes/notes, Chrome mobile/desktop, practice isolation, GPL and PGN roundtrip |
| B6: Progress | Training stats, Academy Reputation, provisional internal rating only for no-hint independent rated games | BACKLOG | Rated/training separation, no fake FIDE Elo |
| B7: v1.0 release gate | Mobile/desktop E2E, promotion, draw, complete games, save/recovery, RU/EN/AZ review, legal, accessibility | BLOCKED | All gates A–I PASS, verified deployment |

**One-file launch:** standalone previews v0.1.1, v0.2.0, v0.2.1, v0.3.0, v0.4.0 and current **v0.5.0** are retained under dist/ for rollback. Full GPL Stockfish v0.5.0 ZIP is available via GitHub Actions #206. Source and provenance remain canonical.

## Product expectations
- Default no clocks and full explanations only when requested.
- Never call beginner engine moves grandmaster strength.
- Do not silently change other three games.
- Do not auto-merge into main or deploy until verified v1.0 acceptance.

## Next implementation block

**B6 — Player Progress and Reputation:** clear separation between Academy Reputation, learning progress, master-game studying and an internally calibrated provisional **playing skill** metric earned only from genuinely unaided independent matches. No fictitious FIDE Elo or chess titles; do not rate hinted, assisted, guided or replayed sessions. Verified persistence, migration of saved v0.1–v0.5 practice and Academy progress, transparent denominators and QA.

**After B6: B7 final release gates** for full-game outcomes, every special rule/promotion, independent RU/EN/AZ semantics/historical evidence review, mobile/keyboard/accessibility and physical Windows launcher. **Do not merge main or deploy** unless v1.0 gates A–I PASS and owner approves the release destination.

B5 source/citation authority: `docs/MASTERS_B5_SOURCE_REGISTER.md` + `data/masters-source-scores.json`; technical/QA authority: `docs/MASTERS_B5_DESIGN.md`, `masters-core.js`, `docs/QA_LOG.md`.
