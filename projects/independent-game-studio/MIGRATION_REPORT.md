# Independent Game Studio — migration and QA report

**Source cutoff:** 2026-11-21 16:57 Asia/Baku. **Baseline main:** `5bc3496152e2dd49db2cb60e2e0216926cbd9d91` (committed 15:59:49 Baku). **Migration branch:** `chore/independent-game-studio-reconcile-20261121`. Owner-approved PR #11 merged into `main` at `deb017e3401077fea568db0fe5baa795a72bc422`.

## Discovery and provenance

- Inspected all repository paths on `main`, 13 other branches, game PRs #5–#10, available source/QA docs, existing CI evidence, project Library files, and Drive filename search for Kingdoms v1.1. There are no GitHub Releases or tags on the inspected repository.
- Full prior ChatGPT chat transcripts are not exposed to this Work session. The provided task text, available recent conversation context and actual attached/Library artifacts were used; no claim is made that every old chat was opened.
- The [version inventory](VERSION_INVENTORY.json) records 21 version-labelled HTML artifacts with available SHA-256, provenance and GitHub import/change dates where known. Git commit dates do not establish original creation dates. Other source trees, QA and research remain in game directories.
- Protected non-game projects `cba-examinations-platform`, `risk-reporting-sql-workspace`, `secret-santa-2026` have no changes. No gameplay logic intentionally changed, no force push, deployment, production database write or Git history rewrite.

## Reconciliation and conflicts

| Finding | Evidence | Resolution / remaining gate |
| --- | --- | --- |
| Caribbean v1.1 was called the latest in `main` | `main` v1.1 HTML; separately supplied [v1.2 HTML](games/caribbean-merchant/releases/CaribbeanMerchant_v1.2.html), Library ID `libfile_bb53bec3a7a081918c6e4949f5638718`, source created 2026-11-20 16:01 Baku, 506,270 bytes, SHA-256 `e70f0c6a91177dd630a81e695adc2475f81e4a23152e7b381e8528a77efd4b1e` | Latest identified artifact v1.2 is preserved. No independent v1.2 gameplay report/source split found, so v1.1 remains current documented release; v1.2 gameplay acceptance open. |
| Kingdoms v1.1 lived only on a development branch | `game/kingdoms-of-ember-v1.1-20261120` HEAD `ba3a6adcece3951a2ee406f9360be21636f4832e`, built HTML SHA-256 `7fb760eafdc23c5ce21eb80fb1fea529822e25bc66b3d6f90fc586aaeb33887e` | Exact branch source, HTML and reported QA copied. Historical 41/41 + 12/12 remain historical; current release acceptance open. |
| Kingdoms v1.0 source ZIP marked inaccessible in old v1.1 QA | Library `libfile_191a2751ebf081919874aa71b0e465b7` | Original ZIP and HTML copied; ZIP integrity PASS, original ZIP HTML equals separately supplied v1.0 HTML byte-for-byte, SHA-256 `6623a83bfece70ae4958a12946ffcfd7fa0d21ffe3a5a92b555620a65c94b1c0`. This resolves the access claim, not v1.1 browser testing. |
| Kingdoms v1.1 QA mentions a source ZIP with scripts/screenshots | v1.1 branch docs refer to `KingdomsOfEmber_v1.1_sources.zip`; absent in inspected GitHub branch, Library title search and both Drive filename searches | **BLOCKED** for archival completeness of that particular ZIP; actual v1.1 HTML and modular source are available. No invented ZIP. |
| Chess described historically as an idea | `main` source and docs, PR #7 merged, main CI run #407 3/3 | B9/v0.9 is real development. Original [v0.8.0 42-file CI ZIP](games/chess-odyssey/releases/ChessOdyssey_v0.8.0_Stockfish_Preview.zip) recovered from artifact #14705809423; ZIP integrity and SHA-256 `3bac88d0d34bcf41fdaedb4b63e482398e6f850c5ba183f2d15bf0e07fcb3395` confirmed. HTML within ZIP equals deterministic rebuild SHA-256 `3290026e0a139a25ed3ed7efc325bddf941adc62019e09891912b91`. No v0.9 release or real Neon cloud PvP. |
| Lord of Ultima v0.1 might be mistaken for a game | `singleplayer-v0.1-spec.md`, source/research, roadmaps; no runtime file | Status DESIGN ONLY. Historical branch's additional two design docs incorporated. |

## Preservation and structure

- `main` baseline had **134 tracked files** in five legacy game-only roots. All **134/134** have a mapped file in this branch; **124** retained byte-for-byte and **10** documentation files were edited for status/navigation/paths. Source code and existing historical HTML/WASM assets retain exact bytes.
- The migration adds recovered v1.2 Caribbean HTML, original Kingdoms v1.0 HTML/ZIP, branch-only Kingdoms v1.1 sources/HTML/QA, original Chess v0.8.0 CI ZIP and HTML, retro branch-only design docs, registry, status and QA. The five legacy directories are absent from `main` after the merge; none of the original files was discarded. No nested Git repositories or submodules were created.
- GitHub Actions workflows must remain in `.github/workflows/` to execute; their game source/test paths were updated to the new studio tree. They are the only game-specific infrastructure files outside the studio directory. Branch links in historical docs are retained as evidence; living main navigation now uses studio paths.
- Existing historical source remains in normal Git history; research and older game HTML remain as files. [Registry](GAME_REGISTRY.md) plus `STATUS.md` files are the next-chat entrypoints.

## QA gates

| Gate | Status | Evidence / limit |
| --- | --- | --- |
| Authority and scope | PASS | Source cutoff, baseline commit, distinct release/candidate labels; non-game projects unchanged. |
| File preservation | PASS | 134/134 baseline files mapped, 124 exact and 10 documentation-only rewrites; ZIP integrity and source checksums confirmed. |
| Version inventory | PASS | 21 version-labelled HTML artifacts identified and hashed in `VERSION_INVENTORY.json`; unavailable v1.1 source ZIP separately BLOCKED. |
| Link and path navigation | PASS | Six broken relative links repaired; final Markdown local-link scan 0 broken. Both existing Chess workflows reference the migrated path; YAML parsed. |
| Build and static syntax | PASS | Kingdoms v1.1 reproducible build matches SHA-256; embedded Caribbean v1.2 and Kingdoms v1.1 JS pass `node --check`; Chess v0.8.0 rebuild matches original CI HTML. |
| Chess source regression | PASS | Fourteen existing Node test scripts passed locally. Migration-branch [CI #409](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44908111445) on commit `883358d1d36546a1a3ab8b6d285e828c493708d8`: 3/3 jobs success (Node/unit, real Chromium, Windows launcher + Stockfish). Historic #407 remains earlier evidence. |
| Browser migration regression | PASS on CI; BLOCKED locally | [Studio smoke CI #1](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44908111495) on commit `883358d1d36546a1a3ab8b6d285e828c493708d8`: **3/3** Caribbean v1.2, Kingdoms v1.1, Chess v0.8 HTML startup/UI/JS and storage reload. Local Chromium aborts with sandbox socket `Operation not permitted`; CI was the actual browser check. |
| Caribbean v1.2 gameplay acceptance / Kingdoms offline file launch | NOT TESTED | Initial browser smoke checks page startup/storage only. Full gameplay and direct `file://` save lifecycle need separate QA. |
| Checkpoint consistency | PASS | GitHub tree read-back SHA `7e770abe53f56abdf8a3bd809f01b7f75c189468` equals the local Git tree; 157 studio blobs, 0 old-path blobs. PR #11 merged at `deb017e3401077fea568db0fe5baa795a72bc422`; post-merge main read-back confirmed the same 157/0 counts. |
| Main merge | PASS | PR #11 merged with explicit owner authorization; main HEAD and canonical registry read-back PASS. |\n| Production deployment | NOT APPLICABLE | No game deployment was requested or performed. |

The unavailable original Kingdoms v1.1 source archive and game-specific release QA gates are explicitly tracked. Passing migration CI proves the repository move and smoke checks; it is not release certification of every game.
