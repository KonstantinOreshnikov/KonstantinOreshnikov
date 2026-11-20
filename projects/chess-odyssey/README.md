# Chess Odyssey — Academy & Arena

**Development Preview v0.4.0 · B4 complete Academy and six-level chess opponent. NOT production-ready.**  
**Game-only branch:** `game/chess-odyssey-v0.1`. No changes to Kingdoms of Ember, Caribbean Merchant or Lord of Ultima.

## Start playing

**Full Stockfish + Academy:** open the passing [GitHub Actions B4 run #166](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44825370339), find the **Artifacts** section and download `ChessOdyssey-v0.4.0-Academy-Stockfish-PREVIEW`. Extract the ZIP (22 files), then double-click `START_WINDOWS.cmd` on Windows. Python 3 or Node.js must be on PATH. It hosts the game **only on 127.0.0.1** and opens your local browser. Alternatively, in the project directory run:

```sh
python -m http.server 8765 --bind 127.0.0.1
# or
node scripts/serve-local.cjs
```

Visit http://127.0.0.1:8765/index.html. Nothing is deployed to a public server.

**One-file, no-server option:** download `dist/ChessOdyssey_v0.4.0_PREVIEW.html` and open it locally. All 33 lessons and practice controls work offline, but intermediate and stronger levels fall back to an **explicitly labelled weaker local AI** due to file:// Worker restrictions. To use the real Stockfish WASM engine, use the full ZIP and localhost.

## Four complete Academy tracks — 33 exercises / 49 learner moves

| Track | Count | What is taught |
| --- | ---: | --- |
| **Rules and essentials** | 9 | Pawn, knight, bishop, rook, queen, castling, en passant, promotion, check |
| **Tactics and combinations** | 8 | Mate on f7, knight/pawn forks, absolute pin, protected skewer, discovered check, back-rank mate, capturing a loose rook |
| **Opening ideas** | 8 | Italian, Ruy Lopez, Queen's Gambit, London **as White**; Sicilian, King's Indian, French, Caro–Kann **as Black**; each has three correctly sequenced board moves with scripted opponent replies |
| **Endgame** | 8 | Queen+king/rook+king mates, opposition, underpromotion, passed pawn and square rule, rook behind passed pawn and active king |

Select a track, then an exercise. Make legal moves on the chessboard. Wrong moves do not advance or alter the lesson; **Hint** highlights the starting square and shows the expected SAN. Opening exercises follow staged moves with a legal scripted reply. A **Next lesson** button supports continuous learning. Completed lesson IDs and an in-progress multi-step lesson survive a reload; an existing practice game is safely parked and restored.

Russian, English and Azerbaijani lesson intros, instructions and step counters are all available. The training data are original constructed learning positions, **not claimed to be historical grandmaster games**; those belong to B5.

## Six difficulty levels

| Level | Opponent implementation |
| --- | --- |
| Beginner | Gentle local 1-ply search |
| Novice | Local 2-ply search |
| Intermediate | Real Stockfish 19 Lite, Skill Level 2, 180 ms |
| Advanced | Real Stockfish 19 Lite, Skill Level 8, 350 ms |
| Expert | Real Stockfish 19 Lite, Skill Level 15, 750 ms |
| Grandmaster Challenge | Real Stockfish 19 Lite, Skill Level 20, 1450 ms |

The names indicate **game difficulty presets**, not calibrated FIDE Elo or titles. Real Stockfish requires the full ZIP served via HTTP. The B2 AI Coach remains independent: three legal candidate moves, possible opponent replies and quick two-ply teaching feedback, not deep certified Stockfish analysis. Practice games do not change any rating.

## Code structure

| Path | Purpose |
| --- | --- |
| `vendor/chess.js` | Chess legality, special rules, FEN and PGN, pinned BSD-2-Clause |
| `coach-engine.js` | B2 explainable two-ply tutor |
| `engine-bridge.js` | B3 real Stockfish UCI Worker bridge, six tiers, safe cancellation |
| `academy.js` | B4 33 source-backed executable RU/EN/AZ lessons, validated FEN/SAN/steps |
| `app.js` | Interactive board, lesson orchestration, persistence, local AI and translation |
| `index.html`, `styles.css` | Responsive accessible controls and four learning tracks |
| `engine/` | Unmodified Stockfish 19.0.1 Lite JS/WASM, GPLv3 license and SHA256 manifest |
| `tests/*.cjs` | Legality/perft, UCI, coach, content, DOM, real Chromium/Chrome, persistence, promotion |
| `scripts/`, `START_WINDOWS.cmd` | Offline HTML, verified ZIP and localhost launcher |
| `docs/ACADEMY_B4_DESIGN.md` | B4 method and acceptance criteria |
| `docs/ENGINE_B3_DESIGN.md` | Engine integration and GPL provenance |
| `docs/QA_LOG.md`, `docs/ROADMAP.md`, `CHANGELOG.md` | Current checkpoint, prior failures and next blocks |

Third-party licenses: chess.js v0.10.3 (BSD-2-Clause) and genuine [Stockfish.js v19.0.1](https://github.com/nmrugg/stockfish.js/tree/v19.0.1) (GPLv3). See `THIRD_PARTY_NOTICES.md`, `engine/Copying.txt` and `engine/MANIFEST.md` for exact attribution and source/build pointers.

## Evidence and what remains

- **B4 full green CI #170:** [99/99 functional tests and verified ZIP integrity](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44825370339), covering all 33 lesson positions, both-colour multi-step openings, reload, wrong moves, correct queen/knight promotions, RU/EN/AZ switching and mobile overflow, plus retained Stockfish E2E.
- The 22-file ZIP integrity and GPL inclusion are verified. Independent *editorial* RU/EN/AZ semantic proofreading and physical Windows CMD testing remain **NOT TESTED** and are not falsely counted as PASS.
- Previous build failures and repairs remain in `docs/QA_LOG.md`; B0/B1/B2/B3 source and standalone files are kept for rollback.
- **Next B5:** source-verified historical master PGNs with chess teaching commentary. Then B6 playing progress/reputation, and B7 full release gates (complete games, usability, promotion/draw outcomes, accessibility, independent translations, versioned deployment).
- **v1.0 production BLOCKED. No merge to main and no deployment.**
