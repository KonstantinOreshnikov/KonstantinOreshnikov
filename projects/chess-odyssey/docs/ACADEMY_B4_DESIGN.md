# Chess Odyssey — B4 Complete Academy Design and Acceptance

**Working branch:** game/chess-odyssey-v0.1. **Delivery:** v0.4.0 development preview, not v1.0 production.  
**Reuse First:** chess.js v0.10.3 remains the rules engine. ChessAcademy dataset contains exercises and localized guidance only; it never reimplements check, castling, en passant, promotions or move legality.

## Four complete learning tracks — 33 board exercises

| Track | Exercises | Learning goals |
| --- | ---: | --- |
| Rules and essentials | 9 | Pawn, knight, bishop, rook, queen movement; castling legality; en passant; queen promotion; check |
| Tactics and combinations | 8 | Verified mate on f7; knight fork; absolute pin; defended skewer; discovered check; pawn fork; back-rank mate; capture an exposed rook |
| Opening ideas | 8 | Italian, Ruy Lopez, Queen's Gambit, London (White), Sicilian, King's Indian, French, Caro–Kann (Black). Each is a **three-move interactive guided line**, with real legal scripted opponent replies |
| Endgame | 8 | Queen + king mate, rook + king mate, opposition, knight underpromotion, rook behind passed pawn, active king, square-rule/pawn race introduction, pawn escort |

**Counts:** 9 + 8 + 8 + 8 = 33. Each lesson has an individual stable ID, meaningful RU/EN/AZ original introduction and instructions at every required move, exact legal SAN, starting FEN or legal setup history and a validated goal. Tactics are educational positions, not source-verified historical games (that is B5). Scripted opening responses are labelled training sequences, not "forced best moves" or guaranteed winning repertoires.

## Interactive contract

1. Select a learning track, then a lesson. It loads a standard start, a legal scripted opening prefix or a checked custom FEN, preserving the ongoing practice PGN and settings.
2. Learner must execute the expected chess.js-legal move on the board. A different legal move does not advance the lesson or mutate the position; choose "Hint" to reveal the exact required SAN and highlight its starting square.
3. Promotion exercises require selecting the correct piece in the existing UI — both queen promotion and intentional knight underpromotion are taught.
4. In multi-step opening training, an opponent's **fixed legal reply** is played automatically between steps; the learner continues on the same board. Both White and Black opening lessons are provided.
5. Once all steps pass, mark the stable lesson ID completed, show "Next lesson", and permit returning to the original practice game. Completed progress is saved with the previous localStorage key for backward-compatible migration from B1–B3.
6. Mid-lesson reload reconstructs the *exact stage* deterministically from legal initial setup, verified SAN and scripted replies while retaining the parked practice PGN, notes, side and difficulty.
7. RU/EN/AZ change updates titles, lesson introduction, active step prompt, progress and controls without resetting lesson state. No user-created HTML is injected.
8. Academy never records fake rated games or changes Win/Loss/Draw training stats. B2 coach remains separate and the B3 Stockfish Worker is cancelled before an Academy starts.

## Quality and accessibility

- Content validation: tests/academy-content.cjs with ChessAcademy.validate(Chess) checks **every FEN, expected SAN, legal reply and three-language fields**, and objective goals for castling, en passant, capture, check, mate and promotions.
- Deep tactical spot checks verify the real pin (knight cannot legally move), protected skewer, discovered check, knight fork, and checked mate endings.
- Real Chromium: tests/academy-browser.cjs tests wrong move rejection, move-stage progression and reload, Italian and Sicilian as both colors, RU/EN/AZ mid-step, both promotion dialogs and choices, return to parked practice, track filtering, progress and narrow phone viewport.
- Retest *all* B0–B3 regressions (rules/perft, coach, genuine UCI Stockfish, B2 postgame, DOM, Chromium, package/GPv3) and standalone one-file rendering.
- Preserve previous previews 0.1–0.3 as rollback; pin B4 executable artifact and checksum in QA log.

## Quality limitations and release boundary

A complete B4 **feature package** does not mean the entire world of chess pedagogy is covered. These 33 exercises provide fundamentals, tactics, representative openings, and introductory endgames, not an unlimited tactical puzzle collection, certified coaching curriculum, objectively deep engine commentary or master-game historiography. Independent in-language editorial verification remains required for final v1.0 release; structural tri-language coverage and executable chess truth are programmatically tested.

B5 historical games, B6 player progress/reputation/rating separation and B7 final release security/accessibility/full-game gates still follow. Do not merge main or deploy without explicit approval and release evidence.
