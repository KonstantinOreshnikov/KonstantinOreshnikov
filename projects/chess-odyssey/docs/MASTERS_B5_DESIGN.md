# Chess Odyssey — B5 Masters & Legends: Complete Design, Safety, QA

**Status:** Development v0.5.0 preview, not authorized production.  
**Scope:** historically linked playable game scores, original RU/EN/AZ explanations, legal-move identification, no fabricated master history or chess evaluations.

## Knowledge product — learning rather than raw PGN

- **31 complete historical games**, **1,923 legal SAN half-moves**, spanning **1834–2013**; 116 custom expert-designed educational critical moments with original RU/EN/AZ explanatory text and accurate move anchors.
- Four learning filters: **Attack/Combination**, **Strategy/Defence**, **Pawns/Endgames**, **Human versus Machine**. Search by player, game, year and event. Intro describes what to notice.
- Interactive isolated 8×8 master replay board, historical SAN timeline (every recorded move can be clicked), first/previous/autoplay/next/last, timeline slider, flip, keyboard left/right/home/end, full legal PGN export with exact **Source** URL.
- Highlighted teaching moments link directly to exact recorded positions, and each position has a bespoke explanation — no reused website article or engine-generated fabricated "best" evaluation.
- **Guess the historical move:** real alternatives generated only from legal chess.js moves. Correct answer means **the move actually played in this game**, not proof every alternative is inferior. Quiz success does not update Elo or ratings.
- Persistent per-game bookmarks, selected game and last ply in a separate localStorage namespace `chess-odyssey-masters-v1`. Page defaults to **Practice** so historical replay never silently resets Academy or the user's chess party. Practice board and historical board have **separate state** and separate controls.
- All B5 controls, original descriptions, move commentary and quiz feedback available in **RU/EN/AZ**; language switching retains selected game and ply. No external APIs at runtime.

## Reuse First and explicit authority

- `vendor/chess.js` **sole authority** for legal positions, SAN, FEN, final checkmate, move validation and correct game replay. Never use a simplistic board simulator for historical positions.
- B5 factual score authority: `data/masters-source-scores.json` (31 source URL-linked unannotated factual records); shipped `masters-library.js` must match raw exactly and protect original source attribution.
- Third-party site source/methodology and second-source checks are recorded in `docs/MASTERS_B5_SOURCE_REGISTER.md`. Source availability may change; browser library is offline and portable.
- Our original annotations separately owned in `masters-notes-a.js`, `masters-notes-b.js`, `masters-notes-c.js`. SAN anchoring, language parity and minimum commentary depth validated, but automatic text checks are **not independent human historical/linguistic review**.
- Pure `masters-core.js` compiles full legal FEN history, validates all 31 historic games, result/mate consistency, exact 116 note anchors, deduplicates all source IDs, and prepares reproducible full PGN.
- `masters-ui.js` owns only master interactions, and must not touch `app.js` practice chess variables or its `chess-odyssey-v01` storage.
- Historical records ending after resignation do **not** get invented terminal chess moves or fake mats. Match result is factual; terminal board state is recomputed independently by chess.js.
- Distinction between instructional difficulty ("beginner/intermediate/advanced") and master playing strength/FIDE Elo is mandatory.

## Acceptance gates and cross-project protection

1. Historical source audit: 31 URL records, correct players/years/result and move totals; historical corrections transparently logged.
2. Chess truth QA: 1,923 exact moves each legal, 31 full FEN timelines and six documented checkmates, other games explicitly not claimed to be mating.
3. Annotation QA: 116 critical move SAN anchors in same game's full score, unique and valid, original RU/EN/AZ each complete. Broken or missing content cannot become silently accessible.
4. Legal quiz QA: 116 puzzles offer only real legal moves with the authentic historical move among them; wrong answer never mutates practice or historical game state.
5. Browser E2E: separate tabs, full timeline, clicking key moments, quiz, source link, PGN download/reimport, filter/search, RU/EN/AZ, bookmark/reload, autoplay/navigation, 390px mobile viewport and standalone HTML bundle.
6. Regression: B0–B4 legal move/rules/coach/33 Academy lessons/Stockfish UCI tests all green; no loss of practice PGN or Academy progress.
7. Distribution: complete standalone v0.5.0 and reproducible full GPL Stockfish ZIP with original unmodified engine, full Copying.txt, score source register, B5 notes and tests. Source links and SHA in QA_LOG after successful GitHub CI.
8. Owner release restriction: do **not** merge `main`, deploy or declare v1.0 even if B5 succeeds. B6 progress/rating and B7 independent full-game/language/accessibility/release remain OPEN.

## Known education/research limitations

- A curated library of **31 historical games** is meaningful training material, not “all games on the internet.” Most historical score pages are independently verified by chess.js legality but not fully matched across all external archives. Six selected games have a second independent transcription, four complete and two partial.
- Some reconstructed or historic game labels and event descriptions can have variant spellings/dates in different archives. For production-grade factual certification, perform a wider source-provenance review; do not change historic game moves based on unsupported assumptions.
- Human editorial RU/EN/AZ teaching verification and stronger machine engine analysis of every critical move are **NOT TESTED**, hence not falsely represented as a PASS.
- The prompt “find master move” tests understanding/recognition of historical continuation, **not chess objective bestmove certainty**. Future deep Stockfish evaluation could support separate “which move is objectively best” tasks, but is outside B5.
- PGN download contains full factual move score and provenance, not third-party site articles; original explanations remain in the interface and versioned content. The site is local only; no accounts, no monetization, no subscriptions.
