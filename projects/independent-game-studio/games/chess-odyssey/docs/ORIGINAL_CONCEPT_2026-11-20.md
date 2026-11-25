> **ARCHIVED ORIGINAL IDEA — NOT CURRENT PROJECT STATUS.** Original 20 November 2026 concept retained below. Current site is v1.1.2 production UAT candidate; see [development history](DEVELOPMENT_HISTORY.md), [current status](CURRENT_STATUS.md) and [roadmap](ROADMAP.md). All original idea-only statements describe the original snapshot, not today's product.

# Chess Odyssey — Academy & Arena

**Working title:** Chess Odyssey — Академия и Арена  
**Status:** OWNER IDEA / PRODUCT CONCEPT ONLY · 20 November 2026 · No implementation, no engine integration and no QA.  
**Separate scope:** distinct from Caribbean Merchant, Kingdoms of Ember and Lord of Ultima.

## Mission

A welcoming, beautifully designed **play-and-learn chess game** for a returning player who knows that chess exists but wants to **restart at beginner level** without books, pressure or clocks. Instruction must happen **while actually playing on a board**, in context, with visual highlights and plain-language explanations of **why** a move is sensible or dangerous.

The first lesson should never assume familiarity with algebraic notation or opening jargon. No mandatory reading or book-based progression.

## First experience: zero-to-confident novice

- No time control, no chess clocks. User can pause, explore and undo a practice line.
- Interactive refresher: board, squares, piece movement, capturing, castling, promotion, en passant, check, mate, stalemate and common draws. One concept at a time, directly on the board.
- Move-by-move guided opening instruction both **as White and as Black**. Example: if White begins with **1.e4**, show several legal, mainstream replies with visually explained differences (e.g. **...e5**, **...c5** or **...e6**); clarify *purpose*, not memorized forced moves. If White begins **1.d4**, explain another family of replies. User chooses and tries the consequences on the board.
- Warn about concrete threats: free piece capture, mate-in-one, hanging queen, pinned defender, weak king, tactical fork or overloaded defender. Offer **why** plus **safer alternatives**, not just opaque engine evaluations.
- Hints for beginner can show candidate destination squares, highlight attacked squares, and compare 2–3 candidate moves. A "Why not this move?" preview shows the opponent's likely best reply and teaches the pattern.
- Short, replayable interactive mini-lessons for forks, pins, skewers, discovered attacks, double attacks, back-rank mate, pawn structure, exchanges, king safety and common endgames.
- Start with wins and understandable mistakes; after each game show **three learning moments**, avoiding a wall of raw engine centipawns.

## Adaptive ladder (proposed labels, not FIDE titles)

| Learning stage | Coach behavior | Opponent |
|---|---|---|
| **Beginner / Возвращение** | Full explanation on request, severe-threat warnings, legal-move preview, unlimited practice undo | Gentle opponent; intentionally low complexity |
| **Novice / Основы** | Opening purpose, tactics prompts and post-move explanations | Basic opponent with clear plans |
| **Intermediate / Средний** | Warn primarily before critical blunders, explain strategic alternatives after a move | More consistent positional play |
| **Advanced / Выше среднего** | Limited warnings for genuinely decisive danger; analysis mainly post-game | Deeper tactics and opening repertoire |
| **Expert / Эксперт** | User moves unassisted by default; detailed post-game analysis | Strong chess engine |
| **Master / Grandmaster challenge** | Training/analysis tools available on request, no move hints by default | Maximum available engine strength, **not** a claim of certified FIDE GM skill |

The player can switch between **Coached**, **Practice** and **Rating** sessions. Rating games must not allow live assistance if the score is meant to reflect independent strength. No coaching penalty in learning games.

## Opening study, tactics and legends

- First learn **opening principles** (center, development, king safety, tempi, avoiding premature queen attacks), then recognize named openings using a maintained opening-position library, with exact move-sequence validation.
- Interactive opening explorer: White initiative and plausible Black counterplay, choices and likely plans for both players, not a memorization-only database.
- Explore famous historical ideas **through verified, appropriately sourced master games** (e.g. Mikhail Tal's sacrifices and initiative, classical positional play, modern dynamic defense), with original educational commentary and clickable variations. Do not invent historical quotations or misattribute game moves.
- Each lesson is connected to a playable board position. Never make reading a separate long book mandatory.
- Future feature: spaced repetition of the user's *own* recurring mistakes, generated from actual recorded games and validated legal FEN positions.

## Ratings and progression: avoid fake Elo

Separate **two signals**:

1. **Internal playing-strength rating:** adjusts upward/downward after serious unassisted games; initially provisional with high uncertainty. Must be explicitly labeled **local estimated bot-match rating, not official FIDE/Elo, not comparable to online player ratings without calibration**.
2. **Adventure reputation / achievements:** cumulative records for completing lessons, mastering tactics, reviewing games and beating opponents at each tier; **never purchasable**.

An 0/10 streak should not permanently punish learning. A user can always go back to beginner lessons, and coaching practice should not distort their independent rating.

## Honest engine design (proposal, not integrated)

A chess engine such as **Stockfish** may evaluate positions and power configurable-strength opponents, with a legal-rules library and a separate educational explanation layer. **Engine score is not the explanation**: a proposed move must be justified in actual chess terms and confirmed legal. Reject hallucinated "mate" assertions with engine validation.

Tool options **already exposed in the conversation environment**, suitable for research or interactive exploration (not our custom game's source):
- **Chessy:** playable conversation chess with an AI.
- **Chess Position Analyzer:** interactive position setup/analysis from FEN.
- **Smart Chess — Train & Learn to Win:** Stockfish-backed board and workshop/lesson mode.
These integrations do not mean our own game has an embedded engine or that their proprietary implementations may be copied.

Respect the actual engine/library licenses and offline bundling rights if implementation is later authorized.

## Product UX and potential future scope

- Chessboard should dominate the screen, with elegant classic wood/stone choices and readable legal/attack highlights.
- Compact right-side **Coach**: What happened? Why is this move strong? Alternative? Threat? Recommended practice.
- Begin in Russian; possible full RU/EN/AZ UI to align with game portfolio, but translation is not part of the current idea-only task.
- Save personal preferences and progress locally first. No login, books, paywalls, ads or mandatory timing in initial plan.
- Later: opening explorer, endgame challenges, game replays, personal statistics, puzzles adapted to mistakes, styled opponent personalities and optional human-vs-human.
- **Ethics of difficulty:** bots should differ via constrained search/strength or explainable styles, not by secretly changing chess rules; “grandmaster” is an aspirational difficulty label, not a performance guarantee.

## Proposed first milestone, only when development is requested

A standalone browser chessboard with correct rules, one weak AI, **untimed** play, per-move optional coach, beginner walkthrough, explanations for concrete mistakes, automatic save and a simple personal learning profile. Then evaluate UX/learning with actual manual play before expanding to advanced engines.

## QA gates before any release claim

- Every rule, legal move, check, mate, draw, en passant, castling and promotion validated on known FEN/perft/reference positions.
- Opponent cannot make illegal moves; hints are tied to actual legal moves and observed engine variations.
- Opening names mapped to verified positions; not invented.
- Coaching versus rating game separation enforced; no fake FIDE/Elo labels.
- Save/restore preserves legal game history and position.
- Time-free mode has no hidden countdown; mobile and desktop interaction have no drag/drop blockers.
- Tests and actual playable app **not yet created**.

**Next action:** keep as backlog. Do not start implementation, engine downloads or expensive research until the owner chooses to activate the chess project.

[All four game projects](../../../README.md)
