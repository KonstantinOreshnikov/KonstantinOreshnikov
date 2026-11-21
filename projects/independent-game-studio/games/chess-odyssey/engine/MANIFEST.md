# Chess Odyssey — Pinned Third-party Chess Engine

Version: stockfish npm 19.0.1 (Stockfish.js 19 Lite single-threaded)
License: GPL-3.0, full Copying.txt included
Upstream engine port: https://github.com/nmrugg/stockfish.js/tree/v19.0.1
Upstream engine: https://github.com/official-stockfish/Stockfish
Package: https://www.npmjs.com/package/stockfish/v/19.0.1
Files reproduced from npm stockfish@19.0.1, without changes to binary or glue code.
Source and build scripts: pinned upstream source tree above (corresponding version).

Asset | Bytes | SHA256
--- | ---: | ---
stockfish-19-lite-single.js | 28230 | ccb130d7ff29408531c47d859a49f91d59d4f482d05a53eb1a3231a4f624c91a
stockfish-19-lite-single.wasm | 1845971 | ee4f115bdb2d32cadf96cada104a05b5ec257d7ad6f57582190b49bc71f096de

Note: single-threaded WASM can run on a conventional static HTTP host; an
offline file:// browser load may block Workers. Chess Odyssey then reports
and uses a clearly labeled built-in fallback rather than silently mislabeling it.
