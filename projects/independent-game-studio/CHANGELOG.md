# Studio development history

## 2026-11-26 — Genesis of Worlds multi-world design

Owner requested selectable worlds and difficulty. [Specification](games/genesis-of-worlds/docs/WORLD_SELECTION_AND_DIFFICULTY.md) defines eight planned worlds, five inherent difficulty tiers, independent player modes and separate local saves. Documentation only; verified Mars runtime unchanged.

## 2026-11-26 — Genesis of Worlds verified local technical candidate

[Offline package QA 2/2](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048); [MOLA candidate](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092733115) and [procedural fallback](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092374018). Actual measured grid and portable saves verified; checksums and exact source in [QA evidence](games/genesis-of-worlds/docs/P0_OFFLINE_QA.md). Owner local PC/physical/independent UAT open. No release/deployment or other game changes.

## 2026-11-26 — Genesis of Worlds local-only delivery and P0 delta

Owner confirmed personal offline ZIP/HTML, no servers/accounts/DB/cloud or hosted game. Historical 12/12 engine + 9/9 Chromium [PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902). Added portable JSON saves and measured MOLA build pipeline; new package QA pending. No other game changed.

## 2026-11-26 — Genesis of Worlds Mars v0.1 prototype

Owner-authorized isolated development prototype: five coupled parameters, procedural globe, controls, presets, time and local saves; three original procedural README illustrations. 12/12 maker simulation assertions in JS isolate; browser/independent QA and actual terrain ingestion open. No release/deploy. Other games unchanged.

## 2026-11-25 — v1.1.3 Practice HUD (owner feedback)

**Current web version: v1.1.3 — deployed production UAT candidate (25 November 2026).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733). Practice HUD parity with PvP: side clocks, turn, captured pieces, last move, replay-aware information and thinner arrows. Real production UAT, latency and independent human/device acceptance remain open. Latest permanent prerelease v1.1.1; latest non-prerelease tagged package v1.1.0. v1.1.3 ZIP is a verified temporary CI artifact. No server, database or security-policy change.

- Runtime source `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92` ([PR #31](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/31)); owner authorized production website update and detailed documentation.
- [Focused CI 45670474986](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986): 24/24 mocked-transport PvP/header E2E PASS; includes real Stockfish analysis, two-browser recovery, grouped captures and targeted localization. This does not prove real Neon production PvP acceptance.
- [Full CI 45670473640](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473640): 3/3 PASS: Offline, Chromium and Windows launcher/WASM. Practice UX 19/19 (including HUD history/flip/captures/reload and 1440/1280/390/320 layout), clocks 12/12, actual Stockfish 11/11, mocked PvP 24/24. [PR Pages package](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473790) and [studio smoke](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670473820) PASS. PR deploy skipped as expected.
- [Verified temporary v1.1.3 ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45670474986/artifacts/15049262390): 152 files, 2,063,096 bytes, SHA-256 `406a0650327912f24b5fbd332e4de097ce07078e387072a442d912eb9a26bcf6`; outer CI archive SHA-256 `7c33e12a3cde5c2ddb1feebe1474982d6b6f3c33cd673e609c2d9bfa8ae5a262`. Artifact expires 2026-12-25 18:02:02 UTC. No permanent v1.1.3 archive claimed.
- Production deployment: [Pages run 45673333733](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45673333733) 3/3 PASS, merge `adf7132d79f60066e2cd528cbe446ff22e94abad`, zero file delta from tested `54bbf41a0c509c88dfa75b9dad8deeec22f6fb92`. Independent direct browser readback not recorded; real user acceptance remains OPEN.

| ID | Owner feedback / requirement | Implementation and scope | Verification |
| --- | --- | --- | --- |
| UX-113-01 | Practice clocks and player information above board use space inefficiently | Desktop left HUD; compact above board on smaller screens, orientation-aware White/Black order; same canonical clock state | Chromium UX 19/19 and clock 12/12 PASS; physical PC/mobile UAT open |
| UX-113-02 | Need clear turn and move information as in PvP | Absolute side to move, active-color arrow, latest SAN with correct side, existing from/to highlight; no active turn at finished position | Practice HUD case 12 PASS; live owner visual acceptance open |
| UX-113-03 | Show captured figures by original color with ×N | Counts derived from verbose history, cut at replay cursor; no material-count guesses; untimed games and lessons retain HUD | Grouped pawn/queen and history cursor fixture PASS; special capture/promotion coverage not exhaustive |
| UX-113-04 | Make review and replay easier | Board and controls share column, thinner arrows, capture/turn reflect viewed position. Clock remains actual live/final time, never fabricated historical snapshots | Replay invariance and clock regression PASS; visual arrow acceptance open |
| UX-113-05 | RU/EN/AZ and mobile consistency | New labels, piece tooltips/aria, active turn, clock captions, wrap chips; compact layout | 3-language turn labels and 1440/1280/390/320 viewport checks PASS; independent semantic review open |

## 2026-11-25 — Genesis of Worlds concept registration

- Fifth independent project: original offline-first planetary terraforming strategy inspired by classic TerraGenesis. [Concept](games/genesis-of-worlds/README.md) · [Design](games/genesis-of-worlds/docs/GAME_DESIGN.md) · [Research register](games/genesis-of-worlds/docs/RESEARCH.md) · [Status](games/genesis-of-worlds/STATUS.md). Documentation only; no runtime, assets, build, test execution, release or deployment. Existing four game baselines and ten backlog concepts preserved.

## 2026-11-25 — Chess Odyssey v1.1.2 deployed for real UAT

**Historical v1.1.2 production deployment checkpoint (25 November 2026; superseded).** [Play](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #28](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/28) · [Focused QA 24/24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812948) · [Full regression 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45624812883) · [Production Pages 3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45627594965). Real v1.1.2 two-player UAT, measured production latency and full human/device acceptance remain open. Latest permanent package is [v1.1.1 prerelease](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.1); latest non-prerelease tagged package is [v1.1.0](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0). v1.1.2 ZIP is a verified temporary CI artifact, not a permanent GitHub Release.

[Development history and feedback/fix register](games/chess-odyssey/docs/DEVELOPMENT_HISTORY.md) · [release notes](games/chess-odyssey/docs/RELEASE_V1_1_2.md). v1.1.1 published as permanent prerelease at `eb535fd863f3450a160454cc7d386c178db55445` and partial real UAT informed v1.1.2. Earlier release records below are historical.

## 2026-11-25 — v1.1.1 pre-publication hotfix checkpoint (historical)

- Production v1.1 defects: stalls after 1–2 moves, slow sync, lost room on refresh, incomplete locale labels. Candidate adds 1.2s polling, serialized refresh, version guards, account-bound restoration, bounded requests, idempotent replay, clock rendering and RU/EN/AZ fixes.
- Tested source `c42e1c16b379405c1029b9088c4648176f13f11f`: [full CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653763), [focused QA PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790) including 19/19 PvP/header and 9/9 cloud UI, 26/26 mock cloud API; 40 half-moves; exact candidate ZIP 152 files, 2,047,853 bytes, SHA-256 `96a6035446ccd3053cf3a954120a43d3c1a9bd96188db81d030873c843662cac`. [Artifact](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790/artifacts/14997604931).
- Production real users, full language acceptance and physical-device UAT remain open; no merge, deployment, DB writes or security-policy change. Existing v1.1.0 official release preserved.

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
