# Chess Odyssey — verified studio status, 2026-11-23

## Current verified Chess Odyssey checkpoint — 2026-11-23

- **Newest code on `main`:** P0–P2 via [merged PR #18](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/18), merge commit `a81c5132e6bf0570744720551e857ec2f5f432c9`. Global RU/EN/AZ UI, non-destructive SAN replay, 10 board themes and 10 piece appearances, wide/fullscreen view, depth-aware Stockfish postgame analysis with arrows, per-side denominators and legend.
- **Downloadable v0.9.0 DEVELOPMENT preview:** [46-file ZIP (GitHub Actions artifact)](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111/artifacts/14796195974). Internal ZIP SHA-256 `64a75e7fe2d95adf66207207882adae1c146817d4aefe6f58bc4679d29877bf1`, outer archive SHA-256 `c0283f72b4a7c820ccad17fc1f9f4bbc54b423d13ef7c4404a718e129fe17a92`; archive expires **2026-12-23**. GitHub `main` retains the versioned source and reproducible build scripts, but not the v0.9.0 binary ZIP.
- **Executable evidence:** [Post-merge `main` CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111); [P0–P2 Chess QA 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45125453080) (27/27 new Node UX, 16/16 new real Chromium UX, Windows Stockfish/WASM and historical regressions); studio smoke 1/1 PASS. [Post-merge `main` CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45126130111) on the merged source.
- **Historical rollback:** `releases/ChessOdyssey_v0.8.0_Stockfish_Preview.zip` is preserved in the Git repository (original 42-file ZIP, SHA-256 `3bac88d0d34bcf41fdaedb4b63e482398e6f850c5ba183f2d15bf0e07fcb3395`).
- **NOT production-ready:** real Neon authenticated two-person PvP and persistent authorized game API, owner Android/PC UAT, human RU/EN/AZ educational QA and all 100 visual theme/piece combinations remain OPEN. No production deploy or Neon DB changes.

## Security and acceptance boundary

- Existing B9 `pvp/dev-server.cjs` is a localhost-only synthetic fixture with spoofable `X-Demo-User`, not a trusted online service. Neon Better Auth staging is provisioned but no genuine two-user cloud PvP E2E was validated.
- The v0.9.0 preview is available through GitHub Actions while retained. To reproduce it later: use `scripts/build-standalone.cjs` and `scripts/package-preview.py` from current main; the tested pipeline is `.github/workflows/chess-odyssey-ci.yml`.
- Read [Game README](README.md), [technical status](docs/CURRENT_STATUS.md), [QA ledger](docs/QA_LOG.md), [Roadmap](docs/ROADMAP.md), [Studio registry](../../GAME_REGISTRY.md). Do not confuse source merge with deployment.
