# Chess Odyssey — Academy & Arena

**Development Preview v0.5.0 · B5 Masters & Legends fully implemented and automated-QA PASS.**  
**Not a production v1.0 release.** Dedicated game branch: `game/chess-odyssey-v0.1`. Does not alter Kingdoms of Ember, Caribbean Merchant, Lord of Ultima or CBA examination platform.

## Play and learn — two separate tabs

**Practice & Academy** preserves the six AI difficulty settings, actual Stockfish 19 Lite Worker+WASM (when served through HTTP), B2 AI Coach and **33 complete RU/EN/AZ interactive Academy lessons** across rules, tactics, opening ideas and endgames. Practice scores, saved PGN, Undo, board promotion and lesson progress remain unchanged.

**Masters & Legends (NEW B5)** offers **31 full historically sourced chess game scores, 1,923 legal recorded half-moves, 116 original annotated key moments**, with instructional **Russian / English / Azerbaijani** commentary. Games span **1834–2013**, across attacks, positional play, defence, gambits, pawn endings, zugzwang, king hunts and human-versus-computer play.

For each historic game:
- Replay **every actual move** on its independent 8×8 chessboard, by clicking the score, using the slider, First/Prev/Next/Last, keyboard arrows or autoplay.
- Filter by theme or search player/title/year. Display player names, event/year, original recorded outcome and a direct link to the historical score source.
- Read hand-written thematic introduction and **3–4 historically move-bound critical-moment explanations in all three languages**, anchored to the exact chess.js position. Non-highlighted moves receive modest factual "capture/check" context, not fabricated deep analysis.
- Choose **Guess the Master's Move** to select among strictly chess.js-legal options. Success means identifying what was **actually played historically**, **not** proving the other legal choices are objectively inferior.
- Save private **bookmarks** and resume at the last game/ply across reloads. Download complete parseable **PGN with exact source URL** and recorded result. Neither practice PGN nor rating is modified by replay/quiz.
- A game won on resignation is shown as a recorded result, **not falsely called checkmate**. True on-board checkmate is derived from the chess.js final position.

## Launch

**Full game + genuine Stockfish:** open the verified [GitHub Actions B5 v0.5.0 run #213](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44830022599), find **Artifacts** and download `ChessOdyssey-v0.5.0-Masters-Stockfish-PREVIEW`. Unpack the ZIP and, on Windows, double-click `START_WINDOWS.cmd`. A locally installed Python 3 or Node.js is required. The helper runs a small server bound **only to localhost** `127.0.0.1`.

Manual alternatives, from the unpacked game folder:

```sh
python -m http.server 8765 --bind 127.0.0.1
# or
node scripts/serve-local.cjs
```

Open **http://127.0.0.1:8765/index.html**. No account, paid features, server-side login, telemetry, public deployment or external chess API.

**Offline one-file option:** download and open `dist/ChessOdyssey_v0.5.0_PREVIEW.html`. The complete Academy and all 31 historical master games work with no installation or internet, but intermediate-to-Grandmaster difficulty falls back to an **explicitly labelled weaker local AI**; real Stockfish Web Worker needs HTTP delivery of the licensed companion WASM.

## Six game levels

| Level | AI in the complete locally served package |
| --- | --- |
| Beginner | Gentle one-ply local search |
| Novice | Local two-ply search |
| Intermediate | Stockfish.js 19 Lite, UCI Skill 2, 180 ms |
| Advanced | Stockfish.js 19 Lite, UCI Skill 8, 350 ms |
| Expert | Stockfish.js 19 Lite, UCI Skill 15, 750 ms |
| Grandmaster Challenge | Stockfish.js 19 Lite, UCI Skill 20, 1450 ms |

These are **game challenge tiers**, not calibrated FIDE Elo ratings or certification of master strength. The B2 two-ply educational coach remains independent of Stockfish and never pretends its heuristic ideas are deep engine principal variations.

## Sources and licensing — quality-first, no false provenance

- **Historical game move facts, player/year/event/result:** exact source URL for each game in `data/masters-source-scores.json` and `docs/MASTERS_B5_SOURCE_REGISTER.md`; the main factual scores were curated from https://chessgator.com/games/. Their entire SAN sequences were **independently replayed and validated against chess.js**.
- **Secondary cross-check:** selected scores were compared to independent ChessDNA pages. Four have exact full-score matches; two have only prefix matches; **25 others have not been independently matched across a second full archival score**. No claim is made to have imported "every game on the internet".
- **Educational text:** all 31 original RU/EN/AZ summaries and **116 original move-specific explanatory notes** in `masters-notes-a.js`, `masters-notes-b.js`, `masters-notes-c.js`. **No source website's editorial prose, screenshots or engine evaluations were copied.**
- **Chess legality:** pinned `chess.js` v0.10.3 (BSD-2-Clause, original notice retained). **Real Stockfish.js** 19.0.1 Lite is GPLv3, unmodified WASM and JS, with full `engine/Copying.txt`, exact SHA256 in `engine/MANIFEST.md`, corresponding upstream source https://github.com/nmrugg/stockfish.js/tree/v19.0.1. Attribution and obligations are in `THIRD_PARTY_NOTICES.md`.
- **More references:** `docs/MASTERS_B5_SOURCE_REGISTER.md` records secondary archives and factual uncertainty. Historical score legality is **not** automatic authoritative resolution of every disputed game date/event. Independent editorial/historical and human RU/EN/AZ proofread remain required for production v1.0.

## Technical structure

| File | Role |
| --- | --- |
| `index.html`, `styles.css` | Tabbed, mobile-responsive game, Academy, Masters UI |
| `app.js`, `academy.js`, `coach-engine.js` | Practice gameplay, 33 verified lessons, heuristic educational Coach |
| `engine-bridge.js`, `engine/*` | Six-level AI interface and genuine licensed Stockfish UCI worker |
| `data/masters-source-scores.json` | 31 original source links and canonical factual move scores |
| `masters-library.js` | Offline bundled historical full move corpus |
| `masters-notes-a.js` / `b.js` / `c.js` | Original RU/EN/AZ historical-game teaching |
| `masters-core.js` | Full chess.js score/FEN replay and verification, note anchors, legal quizzes, PGN export |
| `masters-ui.js` | Separate board, move history, UI, search, bookmarks, quiz and language |
| `tests/*.cjs` | Chess truth, sources, coach, Stockfish, all 31 masters, all 116 quizzes, Browser E2E |
| `docs/MASTERS_B5_DESIGN.md`, `docs/MASTERS_B5_SOURCE_REGISTER.md` | Architecture/QA and source authority |
| `docs/QA_LOG.md`, `docs/ROADMAP.md`, `CHANGELOG.md` | Reproducible checkpoint, unresolved release gates, history |

## Verified QA and release boundary

The first full passing B5 [GitHub Actions run **#213**](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44830022599) achieved **135/135 actual executable PASS**: all B0–B4 regressions, 31 complete source scores, 1,923 legal SAN, 116 original notes, PGN round-trips and browser replay/quiz/bookmark/localization, plus genuine Stockfish and a CRC-verified GPL-containing ZIP.

**B5 development preview is feature-complete and passes automated QA.** It is NOT v1.0 release-ready: B6 separate progress/Academy Reputation/rating logic, B7 full-game/multi-device/desktop/mobile/accessibility/independent language QA, physical Windows launcher and production acceptance remain OPEN. No merge to main and no deployment.
