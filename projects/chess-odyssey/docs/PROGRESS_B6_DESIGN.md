# Chess Odyssey — B6 Player Progress & Reputation

**Scope:** development preview v0.6.0, GitHub game branch `game/chess-odyssey-v0.1`, not a production deployment. Original product concept authority: `docs/ORIGINAL_CONCEPT_2026-11-20.md`. Independently verify B0–B5 regressions.

## Product: three honest and independent signals

| Signal | Grain / denominator | Source of truth | Exclusions / caveats |
| --- | --- | --- | --- |
| **Academy progress** | 33 unique stable lesson IDs, tracks 9/8/8/8 | Existing `chess-odyssey-v01.completed` from B4 | Repeated lessons no extra credit. Historic v0.1–v0.5 completed IDs honored. No silent reset. |
| **Masters study** | 116 unique annotated historical half-move markers across 31 games | Exact validated `masters-core.js` game IDs + ply; new `chess-odyssey-progress-v1.masters` | A game counts as fully studied only after *all* key moments and the final recorded position have been viewed. Guess-the-move must be actually solved. No invented bestmove claims. |
| **Independent bot games** | unique terminal games with real chess.js PGN | `app.js` independently played matches + revalidated `progress-core.js` | Practice, AI Coach, hints, Undo, assisted/aborted games, Academy, Masters replays, invalid/nonterminal PGN, duplicate match IDs or Stockfish fallback are **excluded**. Old games are **not retroactively declared independent**. |

### Academy Reputation — cumulative, bounded and non-purchasable

Reputation is derived from unique verified facts, not a mutable raw points counter. Formula:

```text
Academy Reputation =
  20 × distinct completed Academy lessons
+  4 × distinct master key moments visited
+ 12 × distinct master-move quizzes answered correctly
+ 20 × distinct full historical game studies
+ 15 × distinct AI tiers beaten in eligible independent matches
```

Every term has a **precise population and no double counting**; revisiting or replaying a lesson, moment or quiz does not add points. Full study requires all annotated moments **and** final move, not a jump directly to end. Wins over one bot tier count at most once for reputation, regardless of rematches. This is an educational engagement measure, **not playing strength**. Unlock achievements are **derived** from predicates over those same source facts, and can be recalculated after reload without extra mutable state.

Achievement themes: first lesson, four fully completed Academy tracks, all Academy, first/ten master moments, first/ten solved master quizzes, first/ten/all fully studied historical games, first completed independent match, first independent win and five eligible independent matches. RU/EN/AZ translations are shipped with every achievement.

### AI Ladder Index (0–100) — internal and NOT Elo

**Why not Elo?** There is no external calibrated human match population, certified rating of a bot tier, global matchmaking or verified opponent-skill reference. Displaying a conventional Elo would manufacture precision.

An internal **AI Ladder Index** is nevertheless useful as a small-sample indicator of results against the game's own six tiers, with *fully disclosed* rule:

```text
Each eligible game:
    outcome = 1.0 (win), 0.5 (draw), 0.0 (loss)
    tier    = 1 Beginner, 2 Novice, 3 Intermediate, 4 Advanced, 5 Expert, 6 GM Challenge
    contribution = 100 × outcome × (tier / 6)

Index = round(mean(contribution over the last 20 eligible games))
Display only when eligible_game_count >= 5.
Mark provisional while eligible_game_count < 20.
```

**Denominator** for the displayed index = `min(eligible_game_count, 20)`, **not** number of all games or lesson attempts. Five-game minimum; below this the UI shows “—”. The index is based on a rolling 20-game window; it can rise or fall, and is **not comparable** across other sites/AI versions or with FIDE Elo. Frequent weak-tier wins cannot be mistaken for master-level performance: Beginner wins contribute ~17/100; five highest-tier wins can yield 100/100. The point of the number is personal trend against the available presets, not statistical measurement of human strength.

Sample bias/guardrails: results depend on bot version, tier settings, game positions and local environment; sample is small, no time control and repeated opponents are not independent observations of global playing skill. **No age/identity/rating badge can be inferred**. Engine fallback in levels requiring real Stockfish invalidates the entire match for the index; only genuine verified Stockfish UCI games or built-in Beginner/Novice tiers are eligible. A local browser and localStorage are not tamper-proof, so the score is private and explicitly not a competitive leaderboard.

### Strict session isolation and backcompat

- The default mode is **Coached Practice**, with existing coach, hint and undo, and **no independent rating**. UI explicitly selects “Independent match without assistance” to start a fresh game from the standard initial position.
- During independent play: **hint, two-ply Coach, live grading, alternative variations, Undo, Academy starts and legal move destination hints are disabled**. Normal chess check/status and historic move notation remain. Detailed post-game review is permitted after the result; it has no influence on the already finished game.
- Match has a unique local ID, exact side/tier and independent flags, persisted in the existing `chess-odyssey-v01` payload with backwards-compatible additional properties. Side, AI level or mode changes start a **new** game, with no retroactive credit for an abandoned one. A completed game cannot be undone to reuse a rating entry.
- On terminal result only, the app passes the PGN/metadata to `progress-core.js`, which **replays the entire PGN via chess.js**, asserts `game_over()`, establishes winner/draw from actual terminal board state, rejects engine mismatch or any assist flags and deduplicates match ID. Accumulated ledger is saved separately to `chess-odyssey-progress-v1` and validated/sanitized on reload.
- B5 Masters visits and quiz-solves record only **genuine UI actions** and stable source game+ply IDs; no downloads, bookmarks, mere search, wrong quiz answer or unvisited positions earn reputation.
- Existing `chess-odyssey-v01` and `chess-odyssey-masters-v1` keys retain their formats and can be read untouched. Corrupted B6 key resets only B6 progress, never the historic practice PGN, stats, Academy completion or B5 bookmarks.
- Limit loaded match ledger to latest 500 locally recorded games to prevent unbounded storage growth. **Known tradeoff:** if the 501st match is reached, old match counts/reputation achievements may be based on the retained window; not a lifetime audited ledger. Potential v1 alternative is compact cumulative aggregates with tamper checks and explicit migrations. Do not present 500-game results as lifetime all-time without disclosure.

## Quality gates and source evidence

1. **Unit:** 19+ pure-methodology checks for empty, migration, 33 lessons, 116 moments, 31 study completion gates, unique solves, incorrect IDs, anti-farming, completed PGN checks, wrong winner/side, wrong engine, aid/undo/fallback, duplicate match ID, formula 5/20 thresholds, all 3 languages.
2. **Browser E2E:** real Chrome three tabs, complete B4 pawn lesson, actual B5 historical move quiz, unique study and persisted reload, integrity locked independent mode, no hint/undo/visible legal destinations/Coach, deterministic legal PGN fixture with the **last mating move clicked in the live browser**, one match record/reload/no double count, five-game provisional index and mobile 390px no overflow.
3. **Regression:** old chess.js perft, B2 coach/postgame, B3 genuine Stockfish, B4 33 lessons and B5 31 historical games all remain green; no main merge or deployment.
4. **Distribution:** versioned v0.6.0 fully standalone original lesson/master/progress HTML + versioned full 33+ file ZIP with original Stockfish GPL, source attribution and documentation, SHA256 + ZIP integrity + CI artifacts.
5. **Honest limitations:** browser-seeded endgame E2E is a deterministic fixture plus actual human-facing final move, **not** a claim that 5 complete organic chess games against the bot have been physically played. A clean external tournament, Windows double-click, deeper historical/editorial RU/EN/AZ proofreading and full accessibility review belong to B7.

**Release:** B6 feature QA PASS must not be conflated with production v1.0; require B7 gates A–I and owner approval before merge/deploy. No other game or CBA site changes.
