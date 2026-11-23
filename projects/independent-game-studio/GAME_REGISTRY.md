# Game registry — current status (Chess Odyssey updated 2026-11-23)

Historical 2026-11-21 migration cutoff main was: `5bc3496152e2dd49db2cb60e2e0216926cbd9d91` (15:59:49 Baku). No repository tags or GitHub Releases were found. [Machine-readable details](games.json).

| Game ID | Latest identified artifact | Current documented release | Source / QA / next gate |
| --- | --- | --- | --- |
| `caribbean-merchant` | [v1.2 HTML](games/caribbean-merchant/releases/CaribbeanMerchant_v1.2.html) · SHA-256 `e70f0c6a91177dd630a81e695adc2475f81e4a23152e7b381e8528a77efd4b1e` | [v1.1](games/caribbean-merchant/play/CaribbeanMerchant_v1.1.html) | v1.2 embedded source; browser/game QA pending. [Status](games/caribbean-merchant/STATUS.md) |
| `kingdoms-of-ember` | [v1.1 HTML](games/kingdoms-of-ember/dist/KingdomsOfEmber_v1.1.html) · SHA-256 `7fb760eafdc23c5ce21eb80fb1fea529822e25bc66b3d6f90fc586aaeb33887e` | None tagged; original [v1.0](games/kingdoms-of-ember/history/v1.0/KingdomsOfEmber_v1.0.html) preserved | v1.1 source [in repo](games/kingdoms-of-ember/src/); original branch `game/kingdoms-of-ember-v1.1-20261120`; offline E2E open. [Status](games/kingdoms-of-ember/STATUS.md) |
| `lord-of-ultima` | None: v0.1 is a specification | None | Research and design. [Status](games/lord-of-ultima/STATUS.md) |
| `chess-odyssey` | [v0.9.0 development ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974) (46 files; SHA-256 `64a75e7fe2d95adf66207207882adae1c146817d4aefe6f58bc4679d29877bf1`), original [v0.8.0 archive](games/chess-odyssey/releases/ChessOdyssey_v0.8.0_Stockfish_Preview.zip) preserved | **v0.9.0 QA-PASS development candidate on `main`**, [PR #18 merged](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18); v1.0 NOT released | [Chess QA 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080) + Studio smoke 1/1 PASS; [post-merge main CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111); human RU/EN/AZ, physical device, 10×10 visual QA and genuine Neon Auth/PvP E2E OPEN. [Status](games/chess-odyssey/STATUS.md) |

## 2026-11-23 Chess source publication

P0–P2 source [merged to GitHub `main`](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18) at `a81c5132e6bf0570744720551e857ec2f5f432c9`. Development preview v0.9.0 is downloadable from the verified `main` CI (expires 2026-12-23), while the immutable v0.8.0 ZIP remains in Git. The code/build scripts are retained in `main`; there has been no v1.0 production deployment. Neon authenticated PvP is still unverified.

## New chat handoff and update contract

1. Read live `games.json`, this registry and target game's `STATUS.md`; inspect relevant branch, artifact and QA. Do not infer a release from a chat reply or version string.
2. Before a change record baseline commit, actual source SHA and conflicts; preserve old builds and test evidence.
3. After a change update `games.json`, this registry, game README/STATUS and changelog together; rerun relevant QA, verify checksums and GitHub read-back.
4. When claims disagree, record the conflict in `MIGRATION_REPORT.md` or game QA, state which source is verified, and keep the superseded evidence.
5. Distinguish latest verified artifact, current release, development candidate, history, specification and BLOCKED/NOT TESTED. No automatic sync across chats.
