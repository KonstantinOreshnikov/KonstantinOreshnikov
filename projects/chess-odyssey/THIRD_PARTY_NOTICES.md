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

Other text, code and learning content authored for Chess Odyssey, unless otherwise stated.
