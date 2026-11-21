# Nostalgic game ideas — future concepts

**Status:** IDEA BACKLOG / CONCEPT ONLY · 2026-11-21. These are **10 potential games**, not active projects, release commitments, or evidence that playable builds or source code exist. The four existing projects and their verified versions remain listed in [GAME_REGISTRY.md](GAME_REGISTRY.md).

## Vision

Create original, self-contained 2D HTML5 games inspired by the NES/Dendy, Sega Mega Drive, Game Boy, and Java/J2ME mobile games of the 1990s and 2000s. Preserve the familiar atmosphere, straightforward controls, and pixel-art/retro aesthetic while improving usability, game depth, and completeness. The references inform **gameplay mechanics and feel**, not the reuse of copyrighted code, graphics, music, characters, or trademarks.

## Candidates (10)

| # | Working concept | Inspiration | Proposed gameplay and features |
| --- | --- | --- | --- |
| 01 | **Iron Bastion** | Battle City (NES) | A compact browser tank arcade: defend a base, break walls, use different tank types and power-ups, survive enemy waves, and explore different game modes. |
| 02 | **Worms-inspired artillery** (name TBD) | Worms; an unidentified 2000s mobile edition | Two teams of worms take turns firing weapons with projectile physics. Destructible terrain, falling into water, health points, and varied explosives. **The precise mobile edition remembered by the owner has not been identified.** |
| 03 | **Dr. Mario-inspired puzzle** (name TBD) | Dr. Mario (NES) | Falling two-color capsules, virus-clearing color matches, increasing difficulty, and quick replayable rounds, with original characters and artwork. |
| 04 | **Bomberman-inspired arena** (name TBD) | Mega Bomberman (Sega) | Bomb placement, breakable obstacles, chain explosions, maze arenas, power-ups, local multiplayer, and AI opponents. |
| 05 | **Lode Runner-inspired puzzle platformer** (name TBD) | Lode Runner (NES) | Ladders, collectible gold, pursuing enemies, temporary holes dug into the ground, puzzle-oriented levels, and a possible future level editor. |
| 06 | **Block Breaker Deluxe 2-inspired** (name TBD) | **Block Breaker Deluxe 2** (J2ME, catalog #110) | A brick-breaker arcade with a paddle and ball, varied block behaviors, power-ups, effects, and level progression. **This replaces** the earlier Block Breaker Deluxe (#97) candidate; it is **not a separate idea and not an Arkanoid hybrid**. |
| 07 | **Asphalt: Urban GT-inspired racing** (name TBD) | Asphalt: Urban GT (J2ME) | Fast-paced retro racing with different cars and tracks, nitro boosts, upgrades, and a career mode. Browser-based 2D or pseudo-3D; full 3D is not a requirement. |
| 08 | **Tower Bloxx-inspired builder** (name TBD) | Tower Bloxx (J2ME) | Drop and stack swaying tower floors with precise timing. Reward alignment, track high scores, and grow a city through a building mini-game. |
| 09 | **Townsmen — best of five** (name TBD) | Townsmen 1–5 (Java) | **Owner-approved concept:** one original, feature-rich medieval economic strategy combining the strongest compatible mechanics from the first five games: settlement development, occupations and needs, production chains, trade, growth, expeditions, and events. **One coherent game, not five separate remakes.** |
| 10 | **Modern City Builder + SimCity hybrid** (name TBD) | City Builder as a reference; SimCity (including possible Metropolis/Societies influences) | **Owner-approved concept:** build and plan a modern city using City Builder-style construction as the foundation, enriched with SimCity-style budgeting and taxes, residential/commercial/industrial zones, a transition from polluting to cleaner industry, employment, pollution, citizen satisfaction and complaints, public services (schools, hospitals, police, fire departments, parks, etc.), and land acquisition/expansion. **The exact city-building game the owner originally played remains unverified.** |

**Decision boundaries:** Items 09 and 10 are **two distinct concepts for now**. A future design decision may keep a medieval and a modern city builder separate or selectively reuse compatible mechanics; do not silently merge them. Items 01–08 are games the owner expressed interest in, **not authorized implementation tasks**. Except for Iron Bastion, all project names are placeholders; third-party names are references only, not intended release branding.

## Proposed development approach (subject to separate authorization)

1. **Compare source mechanics.** Review the relevant retro games, identify their strongest features, and select mechanics that support a coherent gameplay loop without redundant or conflicting systems.
2. **Build a focused vertical slice.** Use HTML5 Canvas/JavaScript, with TypeScript or Phaser only if justified. Implement one complete playable loop with PC keyboard and mobile controls before expanding into maps, scenarios, and modes.
3. **Combine nostalgia with polish.** Create original retro-inspired graphics and sound rather than copying source-game assets. Prioritize responsive feedback, accessible menus, balanced difficulty, and a compelling reason to keep playing.
4. **Prefer offline play and reliable saves.** Support browser play on desktop and Android, persistent progress, and ideally save export/import. Single-player games should not depend on a mandatory online server.
5. **Verify each playable milestone.** Test rules, AI, win/loss conditions, save/reload, mobile controls, performance, browser smoke/E2E scenarios, and regressions. Never label a concept **playable** or **released** without actual verification.

## Status and navigation

- This document contains **no playable builds, implementation branches, delivery schedules, or authorization to begin development**.
- The four established games remain independent: [Game Registry](GAME_REGISTRY.md) · [Studio README](README.md).
- Before implementation, approve the chosen concept's scope and original title, then create a separate game directory with source, STATUS, QA evidence, and version history. This document is an **idea backlog**, not a release-status authority.
