# Chess Odyssey — Academy & Arena

**Current build:** v0.2.1 B2 development preview; NOT production-ready.  
**Branch:** game/chess-odyssey-v0.1 (separate from all other games).  
**Scope:** chess training directly on the board, no timer or paid features.

## Play

**Fastest:** download dist/ChessOdyssey_v0.2.1_PREVIEW.html and open it in a modern desktop/mobile browser. The single HTML contains all source scripts and styles and does not require an internet connection. Keep older v0.1.1/v0.2.0 previews as rollback versions.

**For development:** open index.html from this directory; it requires styles.css, vendor/chess.js, coach-engine.js and app.js alongside it.

- Choose Beginner or Novice weak AI, White or Black, and click a piece then a highlighted legal square.
- Hint now shows up to **three legal SAN candidate moves**, the strategic idea and a **legal immediate opponent reply**.
- Concrete immediate captures and major short-horizon score drops appear as context-aware feedback. They do not mean an objectively forced material loss.
- Select Academy to solve three interactive mini-lessons, including a verified mate in one. Return to the parked practice session afterwards.
- Open **Review moves** to revisit up to three notable student moves. The review opens automatically at the end of a practice game.
- All review notes are stored locally with PGN. Undo removes superseded notes and reverses terminal game statistics; local saves survive reload.
- RU / EN / AZ UI and coaching, board flip, touch/mouse controls; no clock, login, paywall, advertisement, online rating or network telemetry.

## Implementation map

| File | Responsibility |
| --- | --- |
| index.html / styles.css | Responsive game surface and compact contextual teaching |
| vendor/chess.js | Chess legality, FEN/PGN, check, mate, draw and special rules |
| app.js | Practice game, gentle AI, interactive lessons, UI, translation, storage, statistics |
| coach-engine.js | Deterministic two-ply legal candidates/replies, immediate threats, shallow grading |
| tests/chess-smoke.cjs | Chess legality and app smoke |
| tests/coach-engine.cjs | Legal SAN branches, mate, threats, non-mutation and grades |
| tests/dom-smoke.cjs / tests/postgame-smoke.cjs | Synthetic UI state and real-rule endgame/review |
| tests/browser.cjs | Actual Chromium interactions and standalone distribution |
| docs/COACH_B2_DESIGN.md | Coach math, meaning, limits, testing contract |
| docs/ROADMAP.md / docs/QA_LOG.md | Blocks, evidence, issues and release blockers |
| docs/ORIGINAL_CONCEPT_2026-11-20.md | Original concept preserved |
| AGENTS.md / docs/DEVELOPMENT_PROTOCOL.md | Unlazy QA, Reuse First, Humanizer, Translation QA and opt-in Grill Me |

## Third-party and accuracy limits

Rules: original jhlywa/chess.js v0.10.3, BSD-2-Clause with retained copyright. Upstream source: https://github.com/jhlywa/chess.js/blob/v0.10.3/chess.js. Git blob SHA: 120494d6ace6c522cc71aa4f0a764938b196f94c.

The gentle chess opponent (one or two plies) and Coach B2 (candidate + one reply) are independent simple heuristics, **not Stockfish**, deep engine analysis, official Elo or verified grandmaster performance. Candidate evaluations are provisional. Future Stockfish work requires GPLv3 source compliance and strength benchmarking.

## Verified development QA

- GitHub Actions #56: rules 12/12, B2 coach 8/8, synthetic DOM 9/9, real Chromium 18/18 PASS.
- GitHub Actions #60: adds five postgame tests PASS while retaining the above gates.
- B2.1 locale and storage-integrity patch: see latest executed run and failure history in docs/QA_LOG.md.
- Production **v1.0 BLOCKED**: requires stronger engine, complete Academy, source-backed master games, rating/reputation separation, broader full-game/UI/promotion QA, independent RU/EN/AZ review and release gates.

Run development tests from this directory with Node 22: node tests/chess-smoke.cjs; node tests/coach-engine.cjs; node tests/postgame-smoke.cjs; node tests/dom-smoke.cjs. Browser tests need Playwright 1.57 and compatible Chromium.

**No merge to main. No production deployment.**
