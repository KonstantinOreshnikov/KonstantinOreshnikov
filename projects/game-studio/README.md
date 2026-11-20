# Independent Game Studio — Four Distinct Projects

**Portfolio inventory verified 20 November 2026.** Each entry belongs to a separate workstream. Historical game titles are inspiration/reference, **not** official sequels, licensed remakes or shared source modules.

> **RU:** Четыре разных игровых направления. Нельзя смешивать исходники, релизы, сюжет, баланс, QA и дорожные карты. Этот каталог — точка навигации; статусы должны подтверждаться содержимым соответствующей GitHub-ветки.

| Project | Inspired by | Current evidence and location | Current status |
|---|---|---|---|
| [Caribbean Merchant](../caribbean-merchant/README.md) | Port Royale 2 Mobile / Caribbean trade strategy | [Main-branch game v1.0](../caribbean-merchant/play/CaribbeanMerchant_v1.0.html), source tree, six earlier snapshots and QA | **Published playable v1.0**; subsequent fixes have [separate development branch](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/fix/caribbean-contracts-bulk-autosale-20261119) (its contents have not been release-audited here) |
| [Kingdoms of Ember](../kingdoms-of-ember/README.md) | Ancient Empires II (2005) tactical games | [Independent v1.1 development branch](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/game/kingdoms-of-ember-v1.1-20261120/projects/kingdoms-of-ember) with HTML, source and QA notes | **v1.1 build exists on branch, NOT merged or tagged released**. Branch README reports 41/41 checks and 12/12 simulated matches, with blocked true file:// browser launch and persistent storage E2E; these are *reported* QA results, not a new independent rerun |
| [Lord of Ultima-inspired strategy](../retro-strategy-revival/lord-of-ultima/README.md) | Lord of Ultima (2010–2014) | Prior research: [economy and visual study](../retro-strategy-revival/lord-of-ultima/original-vs-successors.md), [solo campaign spec](../retro-strategy-revival/lord-of-ultima/singleplayer-v0.1-spec.md), [AI alliances/continents roadmap](../retro-strategy-revival/lord-of-ultima/expansion-roadmap.md) | **Design / research only**; no playable build |
| [Chess Odyssey — Academy & Arena](../chess-odyssey/README.md) | Classical chess, instructional opening/tactics/endgame study | New approved-for-documentation concept, lesson/game-mode design, competence ladder and provisional rating approach | **Idea only**; no code, game, rating engine or QA |

## Product organization

- **Separate dev conversations, versions and source branches** for each title, even while a public portfolio groups case studies under one existing repository.
- Gameplay releases stay with their own owners/workstreams. The portfolio index is **navigation**, not a shared game engine or a claim that every concept is playable.
- All game IP/art must be independently authored or clearly licensed. **Avoid** copying third-party proprietary games, trademarks, levels, dialogue, soundtracks and source without authorization.
- All finished artifacts need a tested downloadable distribution, a precise QA and limitations report, and provenance. Do not convert proposed features into "PASS" checkboxes.
- **No changes** to confidential CBA, banking, or other unrelated projects. Portfolio documentation is sanitized.
- These four entries do **not** imply four independent GitHub repositories. They are four separate project directories/case studies and some ongoing development branches in the current public portfolio repo.

## Current portfolio synchronization gap

As verified on 20 Nov 2026, **main** had the playable Caribbean Merchant and earlier research of Lord of Ultima. The newer Kingdoms of Ember v1.1 exists on branch `game/kingdoms-of-ember-v1.1-20261120`; more recent Lord of Ultima and chess documentation is in the open docs PR **#5**, not yet in main.

**Do not silently overwrite main** or claim the documentation is visible on the public default-branch portfolio until reviewed and merged.

[Back to portfolio](../README.md)
