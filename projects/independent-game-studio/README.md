# Independent Game Studio

Independent, AI-assisted game projects by Konstantin Oreshnikov. This directory is the single navigation point for all game materials in this portfolio. Every game has independent design, code, release history and QA. The historical games that inspired these projects are references, not claimed licenses or shared source modules.

| Game | What it is | Verified status |
| --- | --- | --- |
| [Caribbean Merchant](games/caribbean-merchant/README.md) | Offline Caribbean trading and strategy; inspired by a remembered Port Royale mobile experience | Latest real HTML v1.2; current documented v1.1 release, v1.2 QA pending |
| [Kingdoms of Ember](games/kingdoms-of-ember/README.md) | Independent 16×12 fantasy turn-based tactics inspired by Ancient Empires II | v1.1 development candidate; original v1.0 preserved; offline launch QA open |
| [Lord of Ultima-inspired strategy](games/lord-of-ultima/README.md) | Calm solo economy, city, army and continental strategy | Research/specification only; no build |
| [Chess Odyssey — Academy & Arena](games/chess-odyssey/README.md) | Public multilingual chess game, Academy, historic games, Stockfish | **v1.1 WEB RELEASED** — [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Download](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.0.0/ChessOdyssey_v1.0.0_Stockfish_Preview.zip) · [Release QA](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329); accepted cloud/PvP live QA gaps |

## Chess Odyssey — public v1.1 web release (2026-11-25)

[Play Chess Odyssey v1.1](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Release notes](games/chess-odyssey/docs/RELEASE_V1_1.md) · [CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45475469995) · [Pages deployment](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45478092288). Login/Account and text zoom are published; owner authentication, invitation and 33/33 progress verified. Real second-player production match and physical-device checks remain open by explicit owner decision. The v1.0.0 Windows package below remains an older artifact.

## Historical Chess Odyssey v1.0.0 release (2026-11-24)

[Official versioned GitHub Release](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.0.0) · Permanent verified Windows ZIP with SHA-256 `f115a80859502a0c9c5610813a1d513a17c7b3314559f6a273002367b85193a4`.

[Play Chess Odyssey](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Windows package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.0.0/ChessOdyssey_v1.0.0_Stockfish_Preview.zip) · [Release notes](games/chess-odyssey/docs/RELEASE_V1_0_0.md).

33 Academy lessons, 300 historical full-score games (31 annotated, 269 sourced records), responsive mobile chess, RU/EN/AZ and Stockfish. The owner approved immediate public release with actual two-device cloud/PvP outsider-security QA expressly deferred; those checks remain **OPEN**. No other game project was changed for this release.

## Historical Chess Odyssey source checkpoint (2026-11-23)

[PR #18](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18) merged v0.9.0 P0–P2 source into `main`. [Chess CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080) (27/27 new Node + 16/16 real Chrome) and Studio smoke PASS; [post-merge main CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111); [46-file game ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974) expires 2026-12-23, while source/build scripts remain on GitHub. Human devices, trilingual editorial and real Neon E2E still OPEN. Production v1.0 has not been deployed.

## Nostalgic game concepts (ideas only)

[**Browse 10 future game ideas →**](IDEAS_BACKLOG.md) — Iron Bastion, Worms, Dr. Mario, Mega Bomberman, Lode Runner, Block Breaker Deluxe 2, Asphalt: Urban GT, Tower Bloxx, a **Townsmen 1–5 best-of** and a separate **City Builder + SimCity** hybrid. These are concepts inspired by 1990s/2000s console and Java-mobile classics; **no source code, release, or active development is implied**. The four active game projects and QA statuses above are unchanged.

Each game README has a **How the project changed** section with linked milestone evidence: [Caribbean Merchant](games/caribbean-merchant/README.md#how-the-project-changed) · [Kingdoms of Ember](games/kingdoms-of-ember/README.md#how-the-project-changed) · [Chess Odyssey](games/chess-odyssey/README.md#how-the-project-changed) · [Lord of Ultima-inspired strategy](games/lord-of-ultima/README.md#how-the-project-changed). The latter is a research/design history because there is no game build yet.

**Before starting work in a new chat:** read [GAME_REGISTRY.md](GAME_REGISTRY.md), the selected game's `STATUS.md`, its technical authority and QA. Check current branch HEAD and actual artifact. Log discrepancies rather than guessing the latest version. On a significant release update registry and status together, verify file and hash, then read back. GitHub does not automatically synchronize chat context.

[Migration provenance and conflicts](MIGRATION_REPORT.md) · [History](CHANGELOG.md) · [Machine-readable registry](games.json).
