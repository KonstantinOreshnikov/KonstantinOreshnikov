# Chess Odyssey — B3 Engine Architecture and QA Contract

**Date:** 2026-11-21. **Scope:** B3, game-only branch game/chess-odyssey-v0.1.  
**Current state:** 0.3.0 development preview, not production or FIDE-rated.

## Real engine selection and Reuse First

- Stockfish.js **19.0.1**, npm package **stockfish@19.0.1**, from https://github.com/nmrugg/stockfish.js/tree/v19.0.1.
- Upstream engine: https://github.com/official-stockfish/Stockfish.
- Browser flavor: **19 Lite single-threaded**, separate JavaScript Web Worker and WASM, no cross-origin isolation requirement. This is the upstream-recommended compact web variant, NOT full 94MB Stockfish.
- Upstream package is licensed **GPL-3.0**. Retain the original unmodified assets, full engine/Copying.txt and a precise source/build-location link. Do not claim own authorship of Stockfish.
- Vendor process: scripts/vendor-stockfish.cjs, pinned npm version and package verification, actual Node UCI test before committing engine assets to this non-main game branch. No npm lifecycle scripts run during vendor download.
- SHA256 and file sizes: engine/MANIFEST.md. The upstream source remains the build authority, not a rewritten third-party library.

## Six distinct player-facing difficulty profiles

| UI level | Engine | UCI Skill Level | Search time | Explicit meaning |
| --- | --- | ---: | ---: | --- |
| Beginner | Built-in low-depth legal-move search | N/A | 1 ply | Gentle learning opponent; multiple near-best options |
| Novice | Built-in low-depth legal-move search | N/A | 2 plies | Slightly less forgiving |
| Intermediate | Stockfish 19 Lite (Worker) | 2 | 180 ms | Beginner-friendly real engine |
| Advanced | Stockfish 19 Lite (Worker) | 8 | 350 ms | More calculation and stronger skill setting |
| Expert | Stockfish 19 Lite (Worker) | 15 | 750 ms | Advanced UCI engine |
| Grandmaster Challenge | Stockfish 19 Lite (Worker) | 20 | 1450 ms | Maximum configured strength in this compact browser build |

These are **game levels**, never a guarantee of FIDE Elo, official titles or a calibrated rating comparison. Skill parameters and durations are configuration choices, **not verified Elo equivalents**. Underpowered/mobile hardware may change response latency.

## Runtime separation

- vendor/chess.js is still the sole authority for chess move legality and SAN/FEN/PGN.
- engine-bridge.js owns UCI Worker lifecycle, handshake, position, Skill Level, time budget, stop/cancel, errors and a bounded startup/search timeout.
- app.js maps six profiles to the opponent; checks the engine bestmove **against chess.js legal moves**, position FEN and game token before applying. Changing mode/new game/Undo/lesson cancels the old engine and invalidates stale replies.
- coach-engine.js remains a transparent **two-ply heuristic tutor**. Its educational commentary is NOT presented as Stockfish's deep principal variation.
- Levels Intermediate–Grandmaster prefer real Stockfish under a served http(s) origin. If Worker/WASM fails, the game visibly displays a **weaker built-in fallback**; it does not silently claim Stockfish power.
- Opening the **single HTML** directly from file:// retains a fully playable offline game and all six selectable labels, but levels above Novice use that explicitly labeled weaker fallback. The B3 Stockfish files are sidecars because local file Workers cannot reliably load WASM in modern browsers.

## Launch and distribution

For actual Stockfish on a Windows PC, unpack the complete B3 ZIP and double-click START_WINDOWS.cmd (Python 3 or Node.js on PATH). This starts a server **bound only to 127.0.0.1** and opens http://127.0.0.1:8765/index.html. Alternatively, from the game directory run python -m http.server 8765 --bind 127.0.0.1 or node scripts/serve-local.cjs. No online back end and no paid service.

The bare single HTML dist/ChessOdyssey_v0.3.0_PREVIEW.html can be opened offline for the fallback practice mode. It is not equivalent to a full Stockfish browser Worker package.

## Acceptance gates

1. Source+version: pinned real package, GPL Copying.txt and corresponding upstream source, SHA256 readback.
2. UCI: genuine Node UCI handshake, legal opening bestmove and verified mate-in-one bestmove.
3. Adapter: six profiles, monotone higher-tier Skill/movetime parameters, legal chess.js UCI validation, cancelled/stale queries rejected, nonfunctional Worker surfaces errors.
4. Browser http(s): actual Stockfish moves in all four stronger profiles, saving level after reload, stale calculation cancellation and UI status reporting engine identity; no fake stubs.
5. Browser file://: transparent lower-power fallback; no false Stockfish status.
6. Regression: B0/B1/B2 all green, languages, training, offline standalone, responsive mobile.
7. Packaging: single HTML with honest local fallback; full engine ZIP includes GPL and Windows launcher and passes archive integrity checks.
8. Release: **B3 QA does not authorize v1.0**. B4 academy, B5 historical games, B6 reputation/rating and B7 full UI and language QA remain separate blockers.

## Known restrictions

- Full 94MB Stockfish and multi-thread WASM not included in B3; small Lite build chosen for manageable local experience.
- Search time and Skill Level do not guarantee strict monotonic win rates in short match sets. No Elo claims.
- Stockfish's internal evaluations are not yet translated into detailed pedagogical prose. B2 coach explains general ideas separately.
- No automated browser tests yet cover every promotion, draw path or long full game; those remain v1 release gates.
- CI test/packaging status and failures must be recorded in docs/QA_LOG.md, including FAIL/CANCELLED and final rerun. Do not silently discard historical failures.
