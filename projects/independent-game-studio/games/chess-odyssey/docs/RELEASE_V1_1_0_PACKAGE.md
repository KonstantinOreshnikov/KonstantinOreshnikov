# Chess Odyssey v1.1.0 — official downloadable package

**Web release:** Chess Odyssey v1.1, published 2026-11-25 (Asia/Baku).  
**Play online:** https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/  
**GitHub tag:** `chess-odyssey-v1.1.0`  
**Windows/Stockfish archive:** `ChessOdyssey_v1.1.0_Stockfish_Preview.zip`

## What's included

- The v1.1 game UI, including the friend-invitation interface, Login/Account beside RU/EN/AZ, and persistent A−/100%/A+ text zoom without resizing the chessboard.
- Academy with 33 lessons and historical catalogue of 300 games (31 annotated + 269 additional historical game scores).
- Local chess application files, the Windows starter, chess.js, Stockfish 19 Lite WASM, corresponding GPL text and third-party source notices.
- Standalone local preview `dist/ChessOdyssey_v1.1.0_PREVIEW.html` (local fallback, **not** a substitute for a live authenticated cloud game).

## Windows quick start

1. Extract the ZIP and open `ChessOdyssey_v1.1.0`.
2. Start `START_WINDOWS.cmd` with Node.js available. Use the local address shown by the launcher.
3. To invite a real online friend and use production cloud accounts, **use the public HTTPS game link above**; the local package is not a production-hosted PvP backend and can be subject to origin restrictions.

## Release verification

The release GitHub Actions workflow rebuilds both the backwards-compatible v1.0.0 archive and this v1.1.0 package, validates archive integrity and the 1.1 UI marker, and prints SHA-256 for the exact uploaded ZIP. Check the workflow logs and the published GitHub asset for the final checksum.

Web release: [PR #24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/24), [release-head CI 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45475469995) and [Pages deployment](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45479132236). The production Neon secret/hash and owner login/invite were verified in the original web release. The downloadable archive build does not modify the cloud backend.

## Accepted open production acceptance

A **second real production account** has not yet been observed accepting an invitation and playing both turns; outsider denial on production and cross-device conflict testing also remain open. A separate three-identity real JWT/Neon regression passed; it does not replace this production check. Physical mobile/desktop acceptance remains pending.

**Preservation:** No resets of existing player progress, database writes, changes to OTP/RLS/authentication policy, or changes to the v1.0.0 release/tag/ZIP are part of this package release.
