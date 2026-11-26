# Game registry — Chess Odyssey v1.1.3 production UAT candidate (2026-11-25)

**Current web version: v1.1.3 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733). Practice HUD parity with PvP: side clocks, turn, captured pieces, last move, replay-aware information and thinner arrows. Real production UAT, latency and independent human/device acceptance remain open. Latest permanent prerelease v1.1.1; latest non-prerelease tagged package v1.1.0. v1.1.3 ZIP is a verified temporary CI artifact. No server, database or security-policy change.

[Practice HUD feedback and QA](games/chess-odyssey/docs/PRACTICE_HUD_V1_1_3.md).

**Historical v1.1.2 production deployment checkpoint (25 November 2026; superseded).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #28](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/28) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965). Real v1.1.2 two-player UAT, measured production latency and full human/device acceptance remain open. Latest permanent package is [v1.1.1 prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1); latest non-prerelease tagged package is [v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0). v1.1.2 ZIP is a verified temporary CI artifact, not a permanent GitHub Release.

[Development history](games/chess-odyssey/docs/DEVELOPMENT_HISTORY.md). Older snapshots below are historical.

**Historical v1.1.1 pre-publication checkpoint (superseded 2026-11-25).** [PR #27](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/27) · [Full CI 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653763) · [Focused hotfix QA](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790) · [Verified candidate ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790/artifacts/14997604931). Published web v1.1 and permanent v1.1.0 archive remain unchanged. Real v1.1 two-account UAT reported stalls, slow synchronization and loss of room after F5; incomplete localization was also reported. The candidate fixes these paths and passes synthetic 40-ply PvP, both-browser F5, lost-response replay, clocks and tested RU/EN/AZ controls. Actual production acceptance and full human locale coverage remain open. No merge or deployment authorized yet.

Historical 2026-11-21 migration cutoff main was: `5bc3496152e2dd49db2cb60e2e0216926cbd9d91` (15:59:49 Baku). No repository tags or GitHub Releases were found. [Machine-readable details](games.json).

| Game ID | Latest identified artifact | Current documented release | Source / QA / next gate |
| --- | --- | --- | --- |
| `caribbean-merchant` | [v1.2 HTML](games/caribbean-merchant/releases/CaribbeanMerchant_v1.2.html) · SHA-256 `e70f0c6a91177dd630a81e695adc2475f81e4a23152e7b381e8528a77efd4b1e` | [v1.1](games/caribbean-merchant/play/CaribbeanMerchant_v1.1.html) | v1.2 embedded source; browser/game QA pending. [Status](games/caribbean-merchant/STATUS.md) |
| `kingdoms-of-ember` | [v1.1 HTML](games/kingdoms-of-ember/dist/KingdomsOfEmber_v1.1.html) · SHA-256 `7fb760eafdc23c5ce21eb80fb1fea529822e25bc66b3d6f90fc586aaeb33887e` | None tagged; original [v1.0](games/kingdoms-of-ember/history/v1.0/KingdomsOfEmber_v1.0.html) preserved | v1.1 source [in repo](games/kingdoms-of-ember/src/); original branch `game/kingdoms-of-ember-v1.1-20261120`; offline E2E open. [Status](games/kingdoms-of-ember/STATUS.md) |
| `lord-of-ultima` | None: v0.1 is a specification | None | Research and design. [Status](games/lord-of-ultima/STATUS.md) |
| `chess-odyssey` | [v1.1.3 web](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [verified temporary ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986/artifacts/15049262390) | **v1.1.3 production UAT candidate**; latest permanent prerelease v1.1.1, non-prerelease package v1.1.0 | [Focused 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986), [full 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640), [Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733). [History and open defects](games/chess-odyssey/docs/DEVELOPMENT_HISTORY.md) |
| `genesis-of-worlds` | [v0.1 offline prototype](games/genesis-of-worlds/play/MarsPrototype_v0.1.html) — development only | None | Baseline [21/21 CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902); portable ZIP/MOLA delta pending; independent acceptance open. [Status](games/genesis-of-worlds/STATUS.md) |

## 2026-11-25 Chess Odyssey v1.1.0 official packaged release

[Official v1.1.0 GitHub Release](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0) · [Windows/Stockfish ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.1.0/ChessOdyssey_v1.1.0_Stockfish_Preview.zip) · SHA-256 `869cea06cf40d37ac0173a3be8842aa9679fa33d2a074288e49b6d0a169de111` · [build + packaging QA](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45481263004) · [independent public v1.1 browser smoke](https://agent.tinyfish.ai/runs/15d1010a-114f-4b00-a17c-9e026086704e). 33 lessons, 300 games, language switch, text zoom and friend invitation UI verified anonymously; real two-player production accept/moves, physical devices and cross-device conflict testing remain **OPEN**.

## 2026-11-24 Chess Odyssey v1.0.0 release

[Official GitHub Release and version tag](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.0.0) · [permanent Windows package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.0.0/ChessOdyssey_v1.0.0_Stockfish_Preview.zip) · SHA-256 `f115a80859502a0c9c5610813a1d513a17c7b3314559f6a273002367b85193a4`.

Owner-authorized public v1.0.0 includes 33 lessons, 300 full historical games, and Stockfish. [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [release notes](games/chess-odyssey/docs/RELEASE_V1_0_0.md). Source CI 3/3 and public read-only smoke PASS; real cloud two-device and PvP negative-security verification remains OPEN. Historic v0.9 source checkpoints below are not the current release.

## Historical 2026-11-23 Chess source publication

P0–P2 source [merged to GitHub `main`](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18) at `a81c5132e6bf0570744720551e857ec2f5f432c9`. Development preview v0.9.0 is downloadable from the verified `main` CI (expires 2026-12-23), while the immutable v0.8.0 ZIP remains in Git. The code/build scripts are retained in `main`; there has been no v1.0 production deployment. Neon authenticated PvP is still unverified.

## New chat handoff and update contract

1. Read live `games.json`, this registry and target game's `STATUS.md`; inspect relevant branch, artifact and QA. Do not infer a release from a chat reply or version string.
2. Before a change record baseline commit, actual source SHA and conflicts; preserve old builds and test evidence.
3. After a change update `games.json`, this registry, game README/STATUS and changelog together; rerun relevant QA, verify checksums and GitHub read-back.
4. When claims disagree, record the conflict in `MIGRATION_REPORT.md` or game QA, state which source is verified, and keep the superseded evidence.
5. Distinguish latest verified artifact, current release, development candidate, history, specification and BLOCKED/NOT TESTED. No automatic sync across chats.
