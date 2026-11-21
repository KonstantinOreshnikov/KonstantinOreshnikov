# Independent Game Studio — Four Distinct Projects

**Portfolio statuses synchronized 21 November 2026 against live GitHub evidence.** Each entry belongs to a separate workstream. Historical game titles are inspiration/reference, **not** official sequels, licensed remakes or shared source modules.

> **RU:** Четыре разных игровых направления. Нельзя смешивать исходники, релизы, сюжет, баланс, QA и дорожные карты. Этот каталог — точка навигации; статусы должны подтверждаться содержимым соответствующей GitHub-ветки.

| Project | Inspired by | Current evidence and location | Current status |
|---|---|---|---|
| [Caribbean Merchant](../caribbean-merchant/README.md) | Port Royale 2 Mobile / Caribbean trade strategy | [Main-branch game v1.0](../caribbean-merchant/play/CaribbeanMerchant_v1.0.html), source tree, six earlier snapshots and QA | **Published playable v1.0**; subsequent fixes have [separate development branch](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/fix/caribbean-contracts-bulk-autosale-20261119) (its contents have not been release-audited here) |
| [Kingdoms of Ember](../kingdoms-of-ember/README.md) | Ancient Empires II (2005) tactical games | [Independent v1.1 development branch](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/game/kingdoms-of-ember-v1.1-20261120/projects/kingdoms-of-ember) with HTML, source and QA notes | **v1.1 build exists on branch, NOT merged or tagged released**. Branch README reports 41/41 checks and 12/12 simulated matches, with blocked true file:// browser launch and persistent storage E2E; these are *reported* QA results, not a new independent rerun |
| [Lord of Ultima-inspired strategy](../retro-strategy-revival/lord-of-ultima/README.md) | Lord of Ultima (2010–2014) | Prior research: [economy and visual study](../retro-strategy-revival/lord-of-ultima/original-vs-successors.md), [solo campaign spec](../retro-strategy-revival/lord-of-ultima/singleplayer-v0.1-spec.md), [AI alliances/continents roadmap](../retro-strategy-revival/lord-of-ultima/expansion-roadmap.md) | **Design / research only**; no playable build |
| [Chess Odyssey — Academy & Arena](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/blob/game/chess-odyssey-v0.1/projects/chess-odyssey/README.md) | Classical chess / instruction / Stockfish / small-group PvP | [Active Chess Odyssey v0.9 status](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/blob/game/chess-odyssey-v0.1/projects/chess-odyssey/docs/CURRENT_STATUS.md), [actual QA #403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027), [draft PR #7](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/7) | **B9 / v0.9 Development**, last playable **v0.8.0**. 33 RU/EN/AZ Academy lessons, 31 historical games, 6 AI levels, dual clocks; synthetic 2-player PvP PASS, Neon staging/Better Auth ON; **no live authenticated PvP or production release** |

## Product organization

- **Separate dev conversations, versions and source branches** for each title, even while a public portfolio groups case studies under one existing repository.
- Gameplay releases stay with their own owners/workstreams. The portfolio index is **navigation**, not a shared game engine or a claim that every concept is playable.
- All game IP/art must be independently authored or clearly licensed. **Avoid** copying third-party proprietary games, trademarks, levels, dialogue, soundtracks and source without authorization.
- All finished artifacts need a tested downloadable distribution, a precise QA and limitations report, and provenance. Do not convert proposed features into "PASS" checkboxes.
- **No changes** to confidential CBA, banking, or other unrelated projects. Portfolio documentation is sanitized.
- These four entries do **not** imply four independent GitHub repositories. They are four separate project directories/case studies and some ongoing development branches in the current public portfolio repo.

## Current portfolio synchronization gap

As verified on 21 Nov 2026, **PR #5 was merged into main**; the earlier note claiming it is still open was stale. **Chess Odyssey is no longer an idea**: active development branch `game/chess-odyssey-v0.1`, current B9/v0.9 Development, [PR #7](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/7) remains DRAFT and unmerged. The source and current documents are on that branch. Kingdoms of Ember v1.1 stays on its separate development branch.

**Publication caveat:** Documentation changes made on the chess development branch do **not** update the GitHub public default branch `main` until an explicitly owner-approved merge. Do not call a v0.9 development *phase* a shipped v0.9 release, and do not call locally simulated PvP authenticated Neon multiplayer.

[Back to portfolio](../README.md)
