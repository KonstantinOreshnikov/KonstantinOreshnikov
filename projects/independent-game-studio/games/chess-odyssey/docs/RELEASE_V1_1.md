# Chess Odyssey v1.1 — public web release

**Published:** 2026-11-25 (Asia/Baku) · [Play online](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [PR #24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/24) · [merge commit](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/commit/83c89f35cb05da2c057ee182ab6285f4e5c5a652).

## Changes

- Online friend invite link, sign-in prompt for recipient, acceptance and match transition.
- Header Login / Account beside RU/EN/AZ language selection, reusing the existing authentication form.
- A− / 100% / A+ reading text zoom, persisted locally; chessboard dimensions are unchanged.
- Existing accounts, OTP policy, RLS and saved progress preserved.

## Verification

- [Final release-head CI 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45475469995): offline, real Chromium UI and Windows launcher/Stockfish smoke.
- [Main GitHub Pages deployment 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45478092288). Public browser readback showed `v1.1 · RELEASED`, header Login and text zoom controls, rendered board and no loading error ([live inspection](https://agent.tinyfish.ai/runs/9958a8fb-5f3a-44b7-89c0-00a3f748a4df)).
- Production Neon Function #6 and `api_gate` SHA-256 match. Health 200, invalid or absent JWT 401, disallowed Origin 403 and allowed preflight 204. Owner login and invitation creation succeeded; saved 33/33 progress persisted, revision 39 at pre-merge checkpoint.
- Isolated real three-JWT Neon PvP invite, accept, turns, idempotency and outsider denial PASS ([Actions evidence](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45454226087)).

## Accepted open checks

Only one real production account was available. Acceptance by a second real player, both turns and outsider denial on **production** remain **NOT VERIFIED**; owner expressly approved v1.1 release with this check open. Physical mobile/desktop devices and cross-device progress conflict also require human testing. Do not treat isolated JWT or synthetic browser results as production two-user PASS.

The official [Chess Odyssey v1.1.0 GitHub Release](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/tag/chess-odyssey-v1.1.0) includes the [permanent Windows/Stockfish ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/releases/download/chess-odyssey-v1.1.0/ChessOdyssey_v1.1.0_Stockfish_Preview.zip), 2,038,545 bytes, SHA-256 `869cea06cf40d37ac0173a3be8842aa9679fa33d2a074288e49b6d0a169de111`, verified by [build/publish workflow](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45481263004). The v1.0.0 tag and archive remain historical and unchanged. This standalone package is not a substitute for the production HTTPS cloud backend.

## Rollback

Revert PR #24 in `main` and redeploy the previous Pages source if the frontend regresses. Preserve database accounts and progress. If backend secret/hash consistency fails, repair both matching values together through authorized Neon admin workflow without disclosing the secret.
