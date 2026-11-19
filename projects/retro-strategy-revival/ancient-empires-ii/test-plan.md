# Ancient Empires II-inspired — Test Strategy and Evidence Gates

**Status:** planned tests, none executed against our game. Screenshots and files from third-party projects are research, not test evidence.

## Gameplay correctness

| Test class | Minimum checks |
|---|---|
| Map/terrain | seed reproducibility; adjacent blocking; movement costs; no unit on impossible terrain |
| Reachability | Dijkstra/BFS weighted movement; diagonal/corner rules explicit; unit-specific passability |
| Combat | predicted min/max damages reflect actual engine; counterattack, shields, modifiers, HP ≤ cap |
| Captures | ownership transfer once; no double gold; prevent both owners of same castle |
| Recruitment | enough gold, vacant exit tile, allowed building; charged exactly once |
| XP / achievements | award once; no duplicate bonus on reload |
| AI fairness | same gold, fog, legal actions and stats; no hidden instant recruitment |
| State | no negative resources, no two units one tile, no orphan players/cities |
| Persistence | JSON import/export, corrupted/old save, recoverable errors |
| UX | readable selected ranges and enemy threat, opponent move summary, clear end-turn button |
| Localization | RU/EN/AZ strings, no collisions at desktop and narrow viewport |
| Completion | victory and defeat recognized, restart and continue controls behave as documented |

## QA method

- Fixed map + seeded random map tests.
- Unit tests for rules first (movement/attack/capture/income).
- Model-based test for per-turn invariants and replay equivalence.
- Playwright/Chromium browser smoke and screenshot inspection; manual player sessions after automated tests.
- Record reference version/commit/hash, seed, starting state, action list, ledger before/after, expected and actual results, screenshot on fail and retest.
- A green scripted suite does not establish genuine nostalgia, accessibility, long-term balance or performance on the user's PC.

## Failure examples to prevent

- Area-of-effect overlay shows tiles impossible to reach.
- Hover damage “90% kill” but actual engine applies different formula.
- AI gets to spawn a free castle unit without spending gold.
- Castle captured and income awarded twice during a save replay.
- Bot ends turn while still having a legal beneficial move.
- A scripted tutorial is passable only by one lucky random seed.
- A mission completes without meeting its end condition.

## Progress status

**Code:** none. **QA executed:** 0. **Product acceptance:** pending first actual build. **Next implementation task:** original-art visual demo + pure tactics engine, if authorized.

[Prototype spec](prototype-v0.1.md) · [Source audit](mechanics-and-code-audit.md)
