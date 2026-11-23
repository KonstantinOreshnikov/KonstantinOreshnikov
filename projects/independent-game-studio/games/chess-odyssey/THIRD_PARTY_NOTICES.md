# Third-party Notices

## chess.js
- Upstream: https://github.com/jhlywa/chess.js
- Pinned source: https://github.com/jhlywa/chess.js/blob/v0.10.3/chess.js
- Version: 0.10.3
- Git source blob SHA: 120494d6ace6c522cc71aa4f0a764938b196f94c
- License: BSD-2-Clause
- Copyright (c) 2020, Jeff Hlywa. Full license and disclaimer retained in vendor/chess.js.
- Project uses this third-party library for legal chess move generation and PGN/FEN support. The independent AI/trainer/UI are not part of chess.js.

## Stockfish 19 Lite single-threaded — INCLUDED AS AN OPTIONAL BROWSER ENGINE
- Stockfish.js port and exact tagged corresponding source: https://github.com/nmrugg/stockfish.js/tree/v19.0.1
- Original engine source: https://github.com/official-stockfish/Stockfish
- Distributed unmodified prebuilt package version: stockfish@19.0.1 (npm), GPL-3.0.
- Package source: https://www.npmjs.com/package/stockfish/v/19.0.1
- Distributed files: engine/stockfish-19-lite-single.js and engine/stockfish-19-lite-single.wasm.
- Full GNU GPLv3 license: engine/Copying.txt.
- Exact SHA256 and binary sizes: engine/MANIFEST.md.
- Automated provenance and real UCI validation: scripts/vendor-stockfish.cjs, tests/stockfish-uci.cjs.
- License applies to the covered Stockfish engine. Chess Odyssey does not claim to author that engine.
- Stockfish is loaded from a separate local Web Worker in HTTP-served mode; no external API or engine server.
- A bare file:// standalone HTML uses a visibly labeled built-in weaker AI rather than misrepresenting it as Stockfish.

## B5 factual historical game score sources
- The `masters-library.js` and `data/masters-source-scores.json` datasets contain **historical factual moves and basic metadata**, with the exact independent primary source hyperlink recorded for each of 31 selected games.
- The optional `masters-expanded.js` contains 269 additional historical factual move scores from the World Chess Championship PGN compilation at https://github.com/bgard68/ClaudeChessApp/blob/main/public/games/world-championship-title-matches.pgn (upstream project GPL-3.0; see https://github.com/bgard68/ClaudeChessApp/blob/main/LICENSE). Game scores, participant/result metadata and independently authored factual RU/EN/AZ descriptions only; no upstream instructional annotations or application code copied. Exact selection indices are preserved in `sourceIndex`. Standalone compilation and redistribution remain subject to source-license review.
- Source directory: https://chessgator.com/games/; exact 31 page URLs, dates, source checking and known uncertainty: `docs/MASTERS_B5_SOURCE_REGISTER.md`.
- Select secondary game transcriptions were compared with https://chessdna.app/games/; full independent parity is not claimed for the whole collection.
- No third-party site commentary, prose explanations, engine evaluation labels, artwork, stylesheet or website code is redistributed from these game sources. We do not claim ownership of external websites. Their historical move data are treated as facts, not as a copied editorial database.
- All original explanatory RU/EN/AZ teaching text is separately authored and preserved in `masters-notes-a.js`, `masters-notes-b.js` and `masters-notes-c.js`.
- If a source score's factual accuracy or rights becomes contested, exclude and verify the affected record, retaining provenance/error history. Do not treat public web availability as a blanket redistribution license.

Other original code, commentary and learning content authored for Chess Odyssey, unless otherwise stated.


## Visual chess piece SVGs (Chess Odyssey v1.0 workstream)

These SVG files are redistributed from [lichess-org/lila at pinned commit a2e6a5219bf851d85a99e38059741451eca003b8](https://github.com/lichess-org/lila/tree/a2e6a5219bf851d85a99e38059741451eca003b8/public/piece), credited and classified in [pieces/SOURCE_REGISTER.md](pieces/SOURCE_REGISTER.md). The artwork is authored by third parties, not by Chess Odyssey. The pieces are kept as separate, inspectable static files.

- Fantasy, Spatial, Celtic: Copyright Maurizio Monge, **MIT License**, full text [pieces/LICENSE-MIT.txt](pieces/LICENSE-MIT.txt).
- Chessnut: Copyright Alexis Luengas, **Apache License 2.0**, full text [pieces/LICENSE-APACHE-2.0.txt](pieces/LICENSE-APACHE-2.0.txt).
- RhosGFX: **CC0-1.0**, https://creativecommons.org/publicdomain/zero/1.0/.
- Kiwen-suwi: neverRare, **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/.
- Totoy: Kosal Sen, **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/.
- Papercut: Nikolay Anzarov, **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/.

Golden Elite and Obsidian Pro are CSS finish treatments applied to licensed SVG sources; no claim of ownership of original art.
