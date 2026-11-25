# Chess Odyssey v1.1.2 — published production UAT candidate

**Current web version: v1.1.2 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #28](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/28) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965). Real v1.1.2 two-player UAT, measured production latency and full human/device acceptance remain open. Latest permanent package is [v1.1.1 prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1); latest non-prerelease tagged package is [v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0). v1.1.2 ZIP is a verified temporary CI artifact, not a permanent GitHub Release.

## Changes

Eight UX requirements from owner/colleague feedback: coordinates; absolute turn/arrow and clocks; confirmed last move; captured figures grouped by original color; perspective-aware result and reason; finished-game-only Stockfish review for both participants; compact non-sticky Practice dock; RU/EN/AZ labels. Cached canonical PGN and bounded timing diagnostics address performance overhead, not proven production network latency. No backend policy or database mutation.

## Evidence

- Tested source: `fcf88bfaaf096ad42e468e15967f3df970c29964`; merged at `09224c6dd9bcae0aad86dd80694969578cda99d2`, zero file delta from tested PR head.
- [Focused run 45624812948](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948): 24/24 two-browser mocked-transport PvP, actual Stockfish analysis, 40 half-moves, F5, lost-response idempotency, terminal dialog, captured pawn grouping, localized turn, Practice layout, outsider denial; scope limited to executed cases.
- [Full regression 45624812883](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883): 3/3 (offline, Chromium, Windows compatibility launcher/Stockfish). [Studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812899) and [Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812924) PASS.
- [Production deployment 45627594965](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965): 3/3 PASS. Direct independent public-browser readback not recorded for v1.1.2; no runtime/database/security change in this documentation audit.
- [Verified v1.1.2 CI ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948/artifacts/15028348210): 152 files, 2,058,248 bytes, SHA-256 `ce58b5da0687ebe2cdd7b0e29c0683b154dd646ffcc201ecacee8e71576729c2`; outer artifact digest `1580be6dd4ad0f5a8eef24ac75cdc6c3fa4c65096675d65dd8df49b08904f67b`. Permanent publication not authorized.

## Acceptance

[Full issue-by-issue register](DEVELOPMENT_HISTORY.md#production-feedback--fix--retest). Production UAT remains OPEN. No stable release or permanent v1.1.2 archive claimed. Prior permanent artifacts remain unchanged.