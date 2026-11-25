# Chess Odyssey — v1.1.1 real PvP UAT and proposed v1.1.2 UX delta

**Current web version: v1.1.2 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #28](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/28) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965). Real v1.1.2 two-player UAT, measured production latency and full human/device acceptance remain open. Latest permanent package is [v1.1.1 prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1); latest non-prerelease tagged package is [v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0). v1.1.2 ZIP is a verified temporary CI artifact, not a permanent GitHub Release.

The original OPEN table below is the intake snapshot, not current implementation status. [Current per-item fix/test disposition](DEVELOPMENT_HISTORY.md#production-feedback--fix--retest). Owner authorized implementation and website deployment; both completed. Permanent archive and final live acceptance remain open.

- Tested source: `fcf88bfaaf096ad42e468e15967f3df970c29964`; merged at `09224c6dd9bcae0aad86dd80694969578cda99d2`, zero file delta from tested PR head.
- [Focused run 45624812948](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948): 24/24 two-browser mocked-transport PvP, actual Stockfish analysis, 40 half-moves, F5, lost-response idempotency, terminal dialog, captured pawn grouping, localized turn, Practice layout, outsider denial; scope limited to executed cases.
- [Full regression 45624812883](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883): 3/3 (offline, Chromium, Windows compatibility launcher/Stockfish). [Studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812899) and [Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812924) PASS.
- [Production deployment 45627594965](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965): 3/3 PASS. Direct independent public-browser readback not recorded for v1.1.2; no runtime/database/security change in this documentation audit.
- [Verified v1.1.2 CI ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948/artifacts/15028348210): 152 files, 2,058,248 bytes, SHA-256 `ce58b5da0687ebe2cdd7b0e29c0683b154dd646ffcc201ecacee8e71576729c2`; outer artifact digest `1580be6dd4ad0f5a8eef24ac75cdc6c3fa4c65096675d65dd8df49b08904f67b`. Permanent publication not authorized.

2026-11-25 Asia/Baku. Baseline production merge `eb535fd863f3450a160454cc7d386c178db55445`. Owner reports a real two-player five-minute match: playable, freezes/lag materially reduced but some lag remains. This is partial production acceptance, not a complete 40-ply/F5/reconnect/latency/locale PASS. Earlier v1.1 FAIL and v1.1.1 synthetic PASS retained. No runtime changes in this triage.

| ID | Priority | Requirement | State |
|---|---|---|---|
| UX-112-01 | P1 | Visible A–H / 1–8 board coordinates, correct with both player orientations and flip | OPEN |
| UX-112-02 | P1 | Localized active-side indication with arrow/highlight and clocks beside the board on desktop, compact on mobile; show White/Black turn to both players, not solely “your turn” | OPEN |
| UX-112-03 | P1 | Highlight from/to squares of the latest server-confirmed move for both clients; preserve after F5/flip | OPEN |
| UX-112-04 | P1 | End-of-game result dialog for both players, winner/loser/draw and server-confirmed reason (mate, timeout, resignation, draw etc.); correct perspective, localization, replay/analysis entry | OPEN |
| UX-112-05 | P1 | Post-game review for both participants regardless of host (recommended design), reuse existing Stockfish/replay where feasible; use authoritative completed PGN; no live assistance or progress changes | OPEN |
| UX-112-06 | P1 | Practice replay controls: remove sticky overlay, align exactly under board, compact accessible control size and no content obstruction during scroll | OPEN |
| UX-112-08 | P1 | Complete RU/EN/AZ localization of all affected PvP and Practice UI, including left panel, labels, tooltips, result reasons and dynamic states; no unintended fallback | OPEN |
| UX-112-09 | P1 | Compact captured-piece display in the left PvP panel: group captured pieces by their original color (white losses with White, black losses with Black); use one piece icon and ×N for repeated pieces, including pawns; update from confirmed move history and restore after F5/reconnect/flip | OPEN |
| PERF-112-01 | P2 | Residual PvP lag: measure actual request/propagation latency and determine cause before optimizing | OPEN |

## Verified source gaps
- `pvp/pvp-ui.js` render creates squares with selected/legal classes only; does not render visible coordinates or last-move markers. Active status uses relative your-turn/opponent labels; clocks exist, but no prominent absolute turn cue. Finished status is text only.
- `index.html` and `app.js` already contain Practice result notification and review UI: reuse existing concepts and shared review pipeline, but keep online game context isolated. Server remains authority for result, moves and time.
- `styles.css`: `.board-replay-dock` uses `position:sticky;bottom:8px;z-index:20` and width up to 650px, explaining the reported overlay/misalignment risk.

## Acceptance / next cursor
Before implementation, inspect actual board/review and styles helpers; prefer reuse, minimal scope and independent two-account verification. Run coordinate/flip, captured-piece count and last-move tests for both colors (including en passant and promotion); check turn transition/clock labels; finished states (win, loss, draw, timeout, resign), read-only post-game replay and no in-game engine assistance; scroll/no overlap, responsive desktop/mobile and all RU/EN/AZ dynamic strings. Retain earlier scoped PASS; verify affected regressions only. Physical device, complete locale and formal production performance acceptance remain open. Proposed version v1.1.2, not yet implemented or authorized for release. No player game transcript or account details included.

Owner explicitly authorized implementation on 2026-11-25. Release/merge remain separately gated. Compact icon grouping is the proposed layout; final visual arrangement may be adjusted during implementation.

## Implementation checkpoint
- PR #28: new board HUD, coordinates, last confirmed move, captured original-color groups, localized terminal dialog, finished-only Stockfish analysis and replay, non-sticky Practice dock, cached validated PGN and bounded client timing diagnostics. Production latency measurement remains pending real UAT; no server, authentication or database mutations. Targeted and required regression CI started. No release authorization.
