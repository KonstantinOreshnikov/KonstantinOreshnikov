# Chess Odyssey — B2 Coach Analysis Contract

Version: B2 preview, 2026-11-21. Not a claim of expert chess strength.

## Reuse First / technical boundary

- Chess legality remains delegated to vendored chess.js v0.10.3. No new third-party dependencies, API services or accounts.
- coach-engine.js is a separate pure analysis module. app.js owns the board, coaching UI, reviews, localization and saved practice state.
- A standalone HTML distribution embeds rules, coach, UI and styling without network access.

## B2 algorithm and meanings

1. Enumerate candidate moves from chess.js legal SAN for the side to move.
2. For each candidate, play it, enumerate every *legal immediate reply*, evaluate the most adverse reply for the mover using material + central pawn/development heuristic; then undo every temporary move.
3. Show up to three candidate moves, a concise reason tied to move attributes, and a verified legal opponent reply.
4. If the moved piece can immediately be captured on its destination by a legal reply, warn of this *possibility*, not a forced loss.
5. Before each actual player move, compare it against the best two-ply candidate from the original position. Differences under 100 heuristic units = fine; from 100 = warning; from 300 = major. These units are not Stockfish centipawns and do not certify objective blunders.
6. Save every trainee move's analysis and show three key learning moments ranked by estimated gap, on request or automatically at game end.
7. Undo removes notes attached to undone moves; terminal undo reverses win/loss/draw accounting. Lesson mode parks the active practice session and its notes.

## QA

- tests/coach-engine.cjs: legal candidate and reply, both colors, mate, hanging queen, grading, invalid move and immutable FEN/PGN.
- tests/dom-smoke.cjs: three hints, AI answer, saved note, review, undo, Academy restore and language switch.
- tests/postgame-smoke.cjs: mate-in-one through real rules and synthetic UI, automatic postgame review, reload and Undo rollback.
- tests/browser.cjs: actual Chromium practice, notes/review, RU/AZ/EN, mobile, standalone B2 distribution.
- docs/QA_LOG.md: executed PASS/FAIL/BLOCKED gates and CI run IDs.

## Limitations

Two-ply only: no deep tactical proof or full principal variation. The displayed reply is adverse according to a simple heuristic, not necessarily the best grandmaster response. A legal capture is not proof of unavoidable loss. Opening suggestions use simple centre/development weights, not memorized theory. No Stockfish, official Elo, paid API or production deployment is claimed.

Remaining before v1.0: stronger engine benchmarks, broader tactics, independently verified full translation, complete UI games, promotion testing, accessibility and security/release gates.
