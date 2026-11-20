# Kingdoms of Ember — independent tactical browser game

**Portfolio pointer** · updated 20 November 2026.

Fantasy turn-based strategy inspired by *Ancient Empires II* (2005). The original game's title, character art, maps and copyrighted game assets are not our distributable property.

## Current verified repository state

- **v1.1 source and HTML are present** on [dedicated development branch `game/kingdoms-of-ember-v1.1-20261120`](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/game/kingdoms-of-ember-v1.1-20261120/projects/kingdoms-of-ember).
- Exact standalone HTML distribution is located there at [`dist/KingdomsOfEmber_v1.1.html`](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/tree/game/kingdoms-of-ember-v1.1-20261120/projects/kingdoms-of-ember/dist/KingdomsOfEmber_v1.1.html).
- The branch includes `src/game.js`, CSS, HTML template, deterministic build script, CHANGELOG, design notes and QA report.
- Branch QA report **claims** 41/41 automatic PASS and 12/12 completed AI-vs-AI simulations, but marks `file://` smoke/persistent offline storage E2E **BLOCKED** and mobile/cross-browser E2E **NOT TESTED**. This inventory did **not** rerun the tests.
- The earlier **v1.0** standalone game was delivered in a chat as an HTML file, with sources ZIP. The v1.1 branch is currently **not merged into main**; this pointer is not a release announcement.
- [Original historical-mechanics research and planned test strategy](../retro-strategy-revival/ancient-empires-ii/README.md) is maintained separately as research. **Do not treat old "not implemented" status there as superseding real v1.1 branch evidence.**

## Separation

This game is **not** Caribbean Merchant or Lord of Ultima. Its game engine, maps, QA, balance and release versions are independent. Avoid mixing the new chess idea into its development.

[Game Studio index](../game-studio/README.md)
