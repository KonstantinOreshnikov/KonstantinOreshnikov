# Chess Odyssey — Academy & Arena

**Development Preview v0.3.0 · B3: six AI levels and real Stockfish 19 Lite**  
**NOT production-ready — game-only branch `game/chess-odyssey-v0.1`.**  
The goal remains learning chess by playing on a real board, with an AI Coach that explains *why*. No clocks, ads, payment, account or external API.

## 1. Play on Windows with a real chess engine

The complete source/engine distribution is available as the `ChessOdyssey-v0.3.0-Stockfish-PREVIEW` **GitHub Actions artifact** after a successful CI package job. Download and unzip the package, then **double-click `START_WINDOWS.cmd`**. This requires Python 3 or Node.js already installed. It serves the files locally at `http://127.0.0.1:8765/index.html` — not on a public server.

For developers, open a terminal in this project directory and run one of:

```sh
python -m http.server 8765 --bind 127.0.0.1
# or
node scripts/serve-local.cjs
```

Then visit `http://127.0.0.1:8765/index.html`. The project contains the unmodified pinned `engine/stockfish-19-lite-single.js`, matching `.wasm`, GPL `Copying.txt` and SHA-256 manifest. The interface explicitly reports **Stockfish 19 Lite** when a real UCI move is received.

**Standalone one-file option:** download `dist/ChessOdyssey_v0.3.0_PREVIEW.html` and open it without a server or internet. Every game feature still works, but stronger levels switch to a visibly labelled **weaker local fallback AI**. This is due to browser restrictions for `file://` workers and WASM, not a claimed Stockfish engine in the HTML. Do not confuse the one-file and full-engine distributions.

## 2. Levels and coaching

| Level | AI in served full-engine version | Strength interpretation |
| --- | --- | --- |
| Beginner | Local one-ply gentle search | forgiving training |
| Novice | Local two-ply search | introductory opponent |
| Intermediate | Stockfish Lite Skill 2, 180ms | entry Stockfish |
| Advanced | Stockfish Lite Skill 8, 350ms | progressively stronger |
| Expert | Stockfish Lite Skill 15, 750ms | high difficulty |
| Grandmaster Challenge | Stockfish Lite Skill 20, 1450ms | strongest configured lite engine |

The names are **game levels**, not actual Elo/FIDE chess titles or calibrated win rates. Intermediate–Grandmaster require HTTP(s) Worker+WASM; without it the UI clearly indicates fallback, and the levels do not imply their nominal strength.

- Chess rules and legal turns come from pinned `chess.js` (BSD-2-Clause), including special moves and draw conditions.
- B2 AI Coach continues to show **2–3 legal candidate moves**, an opponent reply, immediate captures and limited material-based feedback. It is a separate, intentionally *shallow two-ply tutor*; it does not misrepresent its commentary as a deep Stockfish variation.
- Three interactive Academy lessons (pawn, knight and checkmate), practice session return, hints, PGN autosave/reload, Undo, move history, top-three postgame review, RU/EN/AZ localization, desktop/mobile board and no timer.

## 3. Technical files

| Path | Responsibility |
| --- | --- |
| `vendor/chess.js` | Legal moves, checkmate/draw, FEN/PGN |
| `coach-engine.js` | Lightweight explainable tutor |
| `engine-bridge.js` | Stockfish UCI Worker lifecycle, six profiles, cancellation, validated bestmove |
| `engine/*` | Pinned unmodified real Stockfish WASM engine, GPL and checksums |
| `app.js` | Game, AI dispatch, local practice fallback, lessons, persistence, RU/EN/AZ |
| `index.html` / `styles.css` | UI and clear engine status |
| `scripts/serve-local.cjs` / `START_WINDOWS.cmd` | Local-only full-engine launch |
| `scripts/build-standalone.cjs` / `scripts/package-preview.py` | Reproducible builds |
| `tests/*.cjs` | Chess, Coach, UCI, postgame, DOM and Chromium regression |
| `docs/ENGINE_B3_DESIGN.md` | B3 architecture, license and QA gates |
| `docs/QA_LOG.md` / `docs/ROADMAP.md` | Verified checkpoints and next stages |
| `AGENTS.md` / `docs/DEVELOPMENT_PROTOCOL.md` | Reuse First, Unlazy, Humanizer, translation/browser QA, opt-in Grill Me |

## 4. Licensing and source provenance

- `chess.js` v0.10.3 — BSD-2-Clause; upstream copyright notice retained in the file.
- Stockfish.js **19.0.1 Lite single-threaded** — GPLv3, port https://github.com/nmrugg/stockfish.js/tree/v19.0.1, original engine https://github.com/official-stockfish/Stockfish. Corresponding source/build scripts available at the pinned port source tree; full licence in `engine/Copying.txt`. Exact binary SHA256 in `engine/MANIFEST.md`. This project does **not** claim to author Stockfish.
- See `THIRD_PARTY_NOTICES.md` and `docs/ENGINE_B3_DESIGN.md` for the exact distribution contract.

## 5. Verified QA and release boundary

- **B3 v0.3.0 QA PASS:** [GitHub Actions #112](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44818905664) — **75/75 executable checks PASS**: rules 12, coach 8, UCI bridge 7, genuine Stockfish native 2 (including Qxf7#), postgame 5, synthetic DOM 9, previous real Chromium 21, and real HTTP Stockfish browser 11.
- Tested actual Stockfish Lite in **Intermediate, Advanced, Expert, Grandmaster Challenge**, and verified local fallback is correctly named when loading with file://.
- **Complete GPL ZIP PASS:** 20 files and verified archive integrity. GitHub Actions artifact `ChessOdyssey-v0.3.0-Stockfish-PREVIEW` available on run #112 until 2026-12-20; it can be rebuilt from source after that. Stockfish source and manifest remain versioned in GitHub.
- See [docs/QA_LOG.md](docs/QA_LOG.md) for exact commit/run evidence, canceled runs, checksums and remaining gates.

**Still NOT production v1.0:** full Academy, authoritative historical grandmaster PGNs, independent playing rating/reputation, complete win/loss/draw UI games, every promotion path, independently reviewed RU/EN/AZ semantics, and physical Windows launcher/UX/accessibility verification. No merge to `main` and no production deployment.
