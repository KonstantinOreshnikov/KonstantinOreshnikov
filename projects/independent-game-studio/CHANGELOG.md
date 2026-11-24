# Studio development history

## 2026-11-25 — Chess Odyssey v1.1 web and official Windows/Stockfish v1.1.0 archive

- [Production v1.1](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [official v1.1.0 Release](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0) · [ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.1.0/ChessOdyssey_v1.1.0_Stockfish_Preview.zip) · SHA-256 `869cea06cf40d37ac0173a3be8842aa9679fa33d2a074288e49b6d0a169de111` ([CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45481263004)). Web v1.1 code PR #24 merged, ZIP pipeline PR #25 merged; v1.0.0 archive preserved.
- [Independent public browser smoke](https://agent.tinyfish.ai/runs/15d1010a-114f-4b00-a17c-9e026086704e) verified language, board, 33 lessons, 300 games, zoom and invite prompts. Real second-account production acceptance, cross-device and physical UAT still open; no account/progress/security-policy changes in package completion.


## 2026-11-24 — Chess Odyssey public v1.0.0 release

- [Play live](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Windows / Stockfish package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329/artifacts/14857182056) · [release notes](games/chess-odyssey/docs/RELEASE_V1_0_0.md).
- 33 Academy lessons, 300 historical games (31 annotated / 269 sourced), responsive RU/EN/AZ and Stockfish.
- [3/3 source QA PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329) · [public browser smoke PASS](https://agent.tinyfish.ai/runs/ad1e13fb-00f5-4e26-a235-cd9013ae371d); owner accepted deferring live multi-device cloud, PvP outsider security and independent human/device reviews.
- Caribbean Merchant, Kingdoms of Ember and Lord of Ultima remain unchanged.

## 2026-11-23 — Chess Odyssey v0.9.0 source/QA publication

- [PR #18](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18) merged into `main` at `a81c5132e6bf0570744720551e857ec2f5f432c9` (P0/P1/P2 UX and Game Review).
- [Chess CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080), Studio smoke PASS; [post-merge main CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111); [46-file development preview](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974) SHA256 `64a75e7fe2d95adf66207207882adae1c146817d4aefe6f58bc4679d29877bf1`.
- v0.8.0 archived in Git; v1.0 deployment and real authenticated Neon multiplayer remain OPEN. Other three games unchanged.


- **2026-11-21:** Repository inventory and migration branch created from `main` at `5bc3496`. Four separate game sections consolidated; actual source and QA histories retained. See [migration report](MIGRATION_REPORT.md).
- **2026-11-21:** Chess B9/v0.9 source had already merged to main through PR #7; main CI #407 3/3 success produced playable v0.8.0 ZIP. Real authenticated PvP remains open. [Original changelog](games/chess-odyssey/CHANGELOG.md).
- **2026-11-20:** Caribbean v1.2 standalone HTML delivered in project chat; identified from Library, separate QA not found. Main had published v1.1 with historic v0.1–v1.0 preserved. [History](games/caribbean-merchant/history/milestones.md).
- **2026-11-20:** Kingdoms v1.1 candidate built on dedicated branch, with historic 41/41 checks and 12/12 simulated matches. Original v1.0 HTML/ZIP preserved. [Changelog](games/kingdoms-of-ember/docs/CHANGELOG.md).
- **2026-11-19:** Lord of Ultima-inspired work consists of research, single-player v0.1 specification and roadmap; no build. [Documents](games/lord-of-ultima/README.md).

Dates above identify source events; they do not imply new execution of old QA in this migration.
