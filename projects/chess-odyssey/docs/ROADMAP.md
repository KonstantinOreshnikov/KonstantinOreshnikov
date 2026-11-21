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
| B6: Player Progress & Reputation | 16 achievements RU/EN/AZ, track/master learning, no-farming Academy Reputation, strict unassisted-only matches and transparent private 0–100 AI Ladder Index (not Elo) | **PREVIEW v0.6.0 QA PASS** — #275, 180/180 tests + 34-file GPL ZIP PASS; human editorial/release still BLOCKED | 5 completed-games minimum, rolling 20-game denominator, terminal chess.js PGN proof, no help/Undo/Stockfish fallback, save migration, real Chrome E2E |
| B7: v1.0 release gate | Full release-candidate QA: FIDE/perft special moves, organic complete Stockfish-vs-local AI match, save, RU/EN/AZ, WCAG axe, native Windows launcher, 31 primary historic games | **v0.7.0 RC: 238/238 executable PASS** (#339; Windows 1/1). **v1.0 production BLOCKED** until independent human editorial/screen-reader acceptance and explicit owner deployment | Technical A–E / parts F–H PASS; I blocked, human F/G and full secondary archives remain open |

**One-file launch:** standalone previews v0.1.1, v0.2.0, v0.2.1, v0.3.0, v0.4.0 and current **v0.7.0** are retained under dist/ for rollback. Full GPL Stockfish v0.7.0 ZIP is available via latest verified green GitHub Actions run (see QA_LOG.md). Source and provenance remain canonical.

## Product expectations
- Default no clocks and full explanations only when requested.
- Never call beginner engine moves grandmaster strength.
- Do not silently change other three games.
- Do not auto-merge into main or deploy until verified v1.0 acceptance.


## Owner scope update — 2026-11-21: timed games REQUIRED before v1.0

**Decision (planned, not implemented or tested):** Preserve **Unlimited / No clock as the default** for normal play and teaching, and add a pre-game time-control chooser for playable matches **before v1.0 release**. This is new scope after B7's 238/238 PASS and does not retroactively change the B7 QA baseline.

| Block | Scope | State | Acceptance |
| --- | --- | --- | --- |
| B8: Time controls and pre-game setup | Choice of Untimed (default), Bullet 1+0, Blitz 3+0/5+0, Rapid 10+0/15+0/15+10/20+0/30+0 and Custom minutes+increment. Labels are user-friendly; FIDE, Chess.com and Lichess classification boundaries can differ. | **REQUIRED / NOT STARTED; no code changes or QA claim** | Two actual clocks, only side to move runs, AI think time counts, proper per-move increment, timeout adjudication incl. insufficient mating material, clock pause policy for assisted practice, reload/background resilience, no exploitable saved independent matches, mobile/desktop, RU/EN/AZ and real browser regression |
| Release acceptance and v1.0 launch | Human RU/EN/AZ editorial, screen-reader/real-device testing, historic archival second-source reconciliation or disclosed owner acceptance, full B0–B8 regression, owner-approved hosting / merge / deploy / rollback | **BLOCKED / NOT STARTED** | Independent acceptance + explicit owner authorization + post-deployment smoke |

**Scope boundaries:** Academy exercises stay untimed; timed and untimed play coexist. All existing no-assistance criteria and 0–100 private AI Ladder Index honesty must be preserved; don't silently mix time controls in any skill-strength signal without an explicit method decision. No matchmaking/network multiplayer in the timed-game requirement. No runtime implementation or production authorization is implied by documenting this decision.

**External timing references:** [FIDE Laws of Chess](https://handbook.fide.com/chapter/E012023), [Chess.com time controls](https://support.chess.com/en/articles/8584509-how-do-time-controls-work-on-chess-com), [Lichess classification FAQ](https://lichess.org/faq).

### Focused v1.0 usability review (recommendations, not approved scope)
- Verify first-run mode/side/difficulty/time selection is intuitive and preserves saved user settings.
- Verify visible last move, clear check/checkmate/draw/flag-fall result, accessible time alerts and a practical rematch flow; implement only missing items after precheck.
- Keep engine legally consistent on timeout and clock persistence; test long AI thinking, promotion dialogs, background tabs, reload, Undo/coach conflicts, and small mobile viewports.
- Defer adaptive puzzles, opening explorer, styled bot personalities and human-versus-human to post-v1.0 unless separately approved.

## Historical release decision (pre-B8; superseded by 2026-11-21 time-control scope)

**Owner signoff for v1.0 release** remains the next substantive gate, not a new engineering block. Technical B7 v0.7.0 RC passed the complete actual GitHub QA #328: 237 Node/Chrome tests and one native Windows launcher smoke; includes a non-seeded **55-ply complete checkmate** from the standard start. Full evidence, problems and SHA in `docs/QA_LOG.md` and `docs/RELEASE_B7_QA.md`.

**Still open:** independent RU/EN/AZ educational/historical proofreading, human assistive-technology and cross-device manual acceptance, secondary-archive adjudication of outstanding records, and explicit owner confirmation of a production domain/host, merge and deployment. **Do not merge `main`, deploy, or call `v1.0 production ready` until Gate I and other release obligations are resolved.**

**Technical authority:** `docs/RELEASE_B7_QA.md`, `docs/SOURCE_B7_REFRESH.md`, source code, live CI + docs/QA_LOG; B6 `docs/PROGRESS_B6_DESIGN.md`, B5 `docs/MASTERS_B5_SOURCE_REGISTER.md` preserved.
