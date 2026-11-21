# Independent Game Studio — Four Distinct Projects

**Chess Odyssey status updated and cross-checked 21 November 2026** (other game milestones preserved). Each entry belongs to a separate workstream. Historical game titles are inspiration/reference, **not** official sequels, licensed remakes or shared source modules.

> **RU:** Четыре разных игровых направления. Нельзя смешивать исходники, релизы, сюжет, баланс, QA и дорожные карты. Этот каталог — точка навигации; статусы должны подтверждаться содержимым соответствующей GitHub-ветки.

| Project | Inspired by | Current evidence and location | Current status |
|---|---|---|---|
| [Caribbean Merchant](../caribbean-merchant/README.md) | Port Royale 2 Mobile / Caribbean trade strategy | [Main-branch v1.1](../caribbean-merchant/play/CaribbeanMerchant_v1.1.html) · [v1.0 preserved](../caribbean-merchant/play/CaribbeanMerchant_v1.0.html) · [v1.1 QA](../caribbean-merchant/testing/v1.1-contracts-autosale.md) | **Latest standalone v1.1**: refreshed contracts, priority orders, global auto-sale, clearer palace unlock; documented synthetic QA PASS, native file-open E2E NOT TESTED |
| [Kingdoms of Ember](../kingdoms-of-ember/README.md) | Ancient Empires II (2005) tactical games | [Independent v1.1 development branch](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/game/kingdoms-of-ember-v1.1-20261120/projects/kingdoms-of-ember) with HTML, source and QA notes | **v1.1 build exists on branch, NOT merged or tagged released**. Branch README reports 41/41 checks and 12/12 simulated matches, with blocked true file:// browser launch and persistent storage E2E; these are *reported* QA results, not a new independent rerun |
| [Lord of Ultima-inspired strategy](../retro-strategy-revival/lord-of-ultima/README.md) | Lord of Ultima (2010–2014) | Prior research: [economy and visual study](../retro-strategy-revival/lord-of-ultima/original-vs-successors.md), [solo campaign spec](../retro-strategy-revival/lord-of-ultima/singleplayer-v0.1-spec.md), [AI alliances/continents roadmap](../retro-strategy-revival/lord-of-ultima/expansion-roadmap.md) | **Design / research only**; no playable build |
| [Chess Odyssey — Academy & Arena](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/blob/game/chess-odyssey-v0.1/projects/chess-odyssey/README.md) | Chess education, Stockfish AI, friend-vs-friend strategy | [Current B9/v0.9 status](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/blob/game/chess-odyssey-v0.1/projects/chess-odyssey/docs/CURRENT_STATUS.md), [CI #403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027), [Draft source PR #7](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/7) | **v0.9 Development**, last playable v0.8.0; 33 Academy lessons, 31 history games, six bot levels, clocks. Local synthetic PvP PASS, Neon Postgres/Better Auth staging configured; **real cloud PvP and public v1.0 NOT done** |

## Product organization

- **Separate dev conversations, versions and source branches** for each title, even while a public portfolio groups case studies under one existing repository.
- Gameplay releases stay with their own owners/workstreams. The portfolio index is **navigation**, not a shared game engine or a claim that every concept is playable.
- All game IP/art must be independently authored or clearly licensed. **Avoid** copying third-party proprietary games, trademarks, levels, dialogue, soundtracks and source without authorization.
- All finished artifacts need a tested downloadable distribution, a precise QA and limitations report, and provenance. Do not convert proposed features into "PASS" checkboxes.
- **No changes** to confidential CBA, banking, or other unrelated projects. Portfolio documentation is sanitized.
- These four entries do **not** imply four independent GitHub repositories. They are four separate project directories/case studies and some ongoing development branches in the current public portfolio repo.

## Current releases and scope boundaries

**As of 21 November 2026:** Caribbean Merchant **v1.1** is the latest released standalone on main; historical v1.0 retained. Kingdoms of Ember v1.1 remains on its own development branch. Lord of Ultima-inspired is research-only. **Chess Odyssey has advanced from initial idea to B9/v0.9 Development** in branch `game/chess-odyssey-v0.1` — full game local, with 33 Academy topics/31 historical games/Stockfish and clocks; synthetic PvP E2E and Neon staging Auth present, true authenticated cloud PvP and publication still OPEN. PR #5 was merged; chess [PR #7](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/7) is **DRAFT**, not merged.

**Publication safety:** this portfolio update only describes the true development branch; it does not place the Chess Odyssey playable source or multiplayer server on main, claim v0.9 ZIP released or authorize hosting. Main updates still require separate PR approval/merge.

[Back to portfolio](../README.md)
