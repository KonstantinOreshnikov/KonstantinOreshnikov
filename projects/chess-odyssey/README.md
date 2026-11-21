# Chess Odyssey — Academy, Arena & Legends

**Development preview v0.6.0 — B6 Player Progress & Reputation. Not a v1.0 production release.**  
**Development branch:** `game/chess-odyssey-v0.1`. The game is independent of the CBA Examinations Platform and the other three game projects.

## What is playable

**Tab 1: Practice & Academy.** Play a full game with Beginner, Novice, Intermediate, Advanced, Expert, or Grandmaster Challenge AI presets. The four stronger settings use the **genuine Stockfish 19 Lite WASM** in a local HTTP-served package; if its Worker is unavailable the UI clearly labels a weaker fallback. B2 Coach gives shallow, legal two-ply hints in **Coached Practice**. The existing **33 original RU/EN/AZ chess exercises** across 9 Rules, 8 Tactics, 8 Openings (White and Black) and 8 Endgames are fully playable. Learned lessons, step position and parked practice session remain saved.

**Tab 2: Masters & Legends.** Explore **31 complete historical move scores** (1834–2013, 1,923 verified legal half-moves) with **116 original RU/EN/AZ explanatory critical moments**. The independent historical chessboard has selectable SAN timeline, step/slider/autoplay controls, search/filter, legal "Guess the historical move" quizzes, source hyperlinks, PGN download and bookmarks. Winning by recorded resignation is **never incorrectly labelled a played checkmate**. The score source/cross-check provenance and limits are documented in `docs/MASTERS_B5_SOURCE_REGISTER.md`.

**Tab 3: My Progress — NEW B6.** Real completion and learning achievements without fabricated chess strength:

| Measure | Data population and criterion |
| --- | --- |
| **Academy Reputation** | Unique completed lessons (20 points each), historical key positions actually studied (4 each), correctly solved unique master quizzes (12 each), complete source-game studies (20 each) and first eligible independent win per AI tier (15 each). No point-farming by repeats |
| **Academy progress** | 33 stable task IDs; four exact topic denominators (9/8/8/8). Older B4/B5 completed IDs automatically count, never double count |
| **Masters studies** | 31 games; complete study requires **all annotated moments + historical final position**; separate distinct count of correctly guessed moves |
| **Achievements** | 16 original RU/EN/AZ milestones; unlocked from actual saved facts, not paid, manually selected, or sourced from fake Elo |
| **AI Ladder Index** | Private 0–100 indication from actual independently played games **against these six bot tiers**, not a FIDE/Elo or externally calibrated player rating |

### How the independent AI index works

By default the game is **Coached Practice**. You can explicitly select **Independent game · no assistance** in the game settings to start a completely new game. During that match, live hints, Coach grading, candidate destination highlights, undo, Academy selection and live review are disabled. **After a completed game**, you may open post-game review freely; the recorded result is already final.

Only a genuinely **completed game played from the ordinary starting position** can enter the independent-match ledger: every move in its PGN is replayed through chess.js, game-over/checkmate or draw is checked, and the winner is determined from the chess position. Matches that used help, Undo, an unexpected weaker AI fallback at Stockfish tiers, invalid/corrupt PGN or a previously counted match ID are excluded. Abandoning or switching the difficulty begins another game and does not register a result. Academy lessons, master quizzes and prior coached wins never become rated.

**Internal index formula**, with full visibility:

```text
score = 1 (win), 0.5 (draw), 0 (loss)
tier  = 1 Beginner, 2 Novice, 3 Intermediate, 4 Advanced, 5 Expert, 6 GM Challenge
AI Ladder Index = round( average(100 × tier/6 × score) over last 20 eligible games )
```

The index is **hidden until at least 5 eligible independent games** exist. From 5–19 games, it is explicitly **provisional**; 20+ means more local data, **not certified confidence or skill calibration**. It is not comparable to Elo, FIDE, Lichess or Chess.com ratings. It measures a personal 0–100 in-game trend against fixed bot tier labels; changing AI builds could alter its meaning.

**Storage and privacy:** `chess-odyssey-progress-v1` is local to the browser, source-grain separated from old `chess-odyssey-v01` practice/Academy and `chess-odyssey-masters-v1` historic bookmarks. No account, payment or telemetry. Clearing browser data clears local scores. Local storage **is not anti-cheat-secure**; never treat the index as a global competitive rating. The retained independent game ledger holds at most 500 entries, and can no longer mean literal all-time beyond that cap.

## How to play

**Complete package with Stockfish:**

1. Open the [latest Chess Odyssey QA run](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/workflows/chess-odyssey-ci.yml).
2. In a **green, successful v0.6.0** run, open *Artifacts*, download `ChessOdyssey-v0.6.0-Progress-Stockfish-PREVIEW`, and extract the ZIP.
3. On Windows double-click `START_WINDOWS.cmd` (Python 3 or Node.js required) to open the locally hosted game at `http://127.0.0.1:8765/index.html`. A physical Windows host test remains a v1.0 gate.

Alternatively, from the extracted folder:

```sh
python -m http.server 8765 --bind 127.0.0.1
# or
node scripts/serve-local.cjs
```

**Offline one-file:** `dist/ChessOdyssey_v0.6.0_PREVIEW.html` contains *all* Practice, Academy, Masters and Progress features without a server or internet. The four stronger Stockfish tiers fall back visibly to a weaker local engine because a file://-loaded HTML cannot run the licensed WASM Worker correctly. **Such fallback games are ineligible for the independent AI index.**

## Executed QA — B6 v0.6.0

**[GitHub Actions #268](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44845023609): 180/180 PASS**, covering B0–B5 regression, 19 independent Progress methodology/PGN/denominator cases, 26 new real Chrome desktop/mobile cases, genuine Stockfish and 34-file ZIP integrity. Detailed chronology of earlier failed/cancelled runs and explicit B7 limitations is in `docs/QA_LOG.md`. The current passing build and final distribution link should be checked against the latest run in the branch before sharing the ZIP.

## Evidence, source and licensing

- **B6 technical and measurement authority:** `docs/PROGRESS_B6_DESIGN.md` and exact original executable `progress-core.js` (pure progress+match verification), `progress-ui.js` (three-language display and persistence). B6 Node methodology tests: `tests/progress-content.cjs`; real browser integration: `tests/progress-browser.cjs`.
- **Full prior baseline:** B5 `docs/MASTERS_B5_DESIGN.md` + historical source register and factual scores, B4 `docs/ACADEMY_B4_DESIGN.md`, B3 `docs/ENGINE_B3_DESIGN.md`, B2 coach design and unchanged B0/B1 chess.js rules. `docs/QA_LOG.md` contains exact PASS/FAIL evidence, hashes, regression status and source conflicts.
- chess.js **v0.10.3 BSD-2-Clause**, original license retained in `vendor/chess.js`. Genuine **Stockfish.js v19.0.1 Lite GPLv3** source https://github.com/nmrugg/stockfish.js/tree/v19.0.1, unmodified binary in `engine/*`, GNU GPLv3 text `engine/Copying.txt`, binary SHA256 in `engine/MANIFEST.md`; `THIRD_PARTY_NOTICES.md` attributes components. No proprietary third-party game commentary was copied.
- Follow Reuse First, Unlazy QA, Humanizer and Translation QA; historical source provenance and RU/EN/AZ semantic parity are held to explicit gates, never certified without evidence.

**Development release boundary:** B6 source/preview and technical QA are tracked by GitHub Actions; any failed gate remains visible. **B7** is still required for full-game tournament E2E, accessible interaction, human language and historical editorial signoff, physical Windows launcher and explicit owner-approved production release. **No merging into `main` or deployment.**
