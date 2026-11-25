# Chess Odyssey — v1.1.1 real PvP UAT and proposed v1.1.2 UX delta

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
