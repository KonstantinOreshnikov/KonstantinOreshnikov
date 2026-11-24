# Chess Odyssey v1.0 — Header UX and broken friend invitation (2026-11-24)

## Implementation checkpoint — 2026-11-24 (current)

- **Combined P0/P1/P2 implementation completed on isolated feature branch** `feature/chess-odyssey-v1-1-pvp-header-zoom-20261124`, commit `fcbb5c2182bfa8d09ef21a62c54711b242e36a80`, [draft PR #24](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/24). Original v1.0 `main` and public Pages unchanged, no release approval requested at this checkpoint.
- **Full source CI: 3/3 PASS** at [run #45413190812](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45413190812): Offline rules/app smoke, complete Chromium browser regression, Windows launcher/Stockfish. Explicit [focused mock Chromium acceptance 12/12 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45413189622). [13/13 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45414940864) QA-only continuation also checked 130% reading zoom at 320px: board dimensions unchanged/no overflow; runtime file SHAs matched the main feature branch.
- **Features:** stable fixed-width RU/EN/AZ language select, header Login/Account dialog reusing original cloud form without duplicate auth state, A−/A+ reading-text zoom 90–130% localStorage persistence and reset; P0 invitation links auto-open Play a Friend and show acceptance/login, no redundant confirm dialog, server 503 error translated, creator waiting/automatic start, original cloud-session-ready event dispatched after successful activation. All packaging allowlists updated.
- **Live backend P0 blocker remains OPEN:** existing Neon project `wild-hall-05832800`, default branch `br-still-credit-b9voxawu` serves public v1.0.0; Function `chesscloud` #4 only lists `CHESS_ALLOWED_ORIGINS`, with **no `CHESS_RPC_SECRET`**, which the checked-in PvP source requires. The exact deployed 503 response using real JWT is still unverified. A separate nonproduction QA database clone `br-muddy-truth-b96hxtdg` exists; its Function remains deployment #4 with no secret. Isolated secret configuration failed: unsupported `gen_random_bytes` in SQL followed by a safety-blocked connector operation. No successful configuration write/deploy occurred; do not claim real 2-user Neon PvP, invite creation or outsider authorization E2E PASS.
- **Protected data:** read-only verification of the working public branch found one account progress row, **33/33** Academy lessons, revision **38** at this checkpoint; no production DB writes, no production Function deployment, and no user reset from this work. To close P0, an authorized operator must securely provision the synchronized Function RPC secret and DB `api_gate` hash on the isolated test branch using a permitted mechanism, then run real 2-player + outsider JWT/OTP tests. Request explicit release approval **only after the real server gate passes**, per current owner instruction.
- Historical investigation and design below are retained verbatim as provenance; their statement **"NO runtime change in this work package"** now refers to the *earlier analysis checkpoint*, not the implemented feature branch.

---

**Status:** User-reported defect confirmed as an unresolved real-user scenario; diagnosis is grounded in live metadata and current source. **NO runtime change or deploy in this work package.** The production `main` release stays at v1.0.0.

## User feedback

1. Move sign-in entry to the header beside the language selector. Retain the entire existing account panel in `My Progress` as an alternative entry point; avoid duplicate independent authentication/session implementations.
2. Add accessible `A− / A+` **text-only zoom** to improve reading Academy text, Masters descriptions, explanations, errors and other meaningful instructions. Never resize chessboards, squares, pieces, engine indicators, clocks or the game-play surface.
3. Prevent the language selector/header from shifting when switching RU/EN/AZ; selected option strings and translated labels vary in width.
4. **P0 user-observed failure:** both the owner and a colleague could not successfully use `Invite a friend`. The workflow is currently non-discoverable.

## Current code and live evidence

- Current `main` `index.html`: top right contains only `#global-language` and `.version`; login and OTP controls exist only in `#cloud-account` deep in the Progress tab. The header `.top-actions` uses flexible wrapping; `.global-language` has `min-width:124px`, not an invariant fixed width.
- `pvp/pvp-ui.js`: the sender chooses color/time and clicks `#pvp-create`, which POSTs `/api/pvp/invite`. On success a 43-character random invitation token is shown inside a share URL with `#invite=...`; sender manually copies/shares it. Recipient's startup only prefills `#pvp-invite-token` from the fragment. **It does not select the PvP tab, show an obvious accept prompt, or accept automatically.** User must log in, manually open the PvP tab and press `#pvp-accept`. Polling for game updates is 6.5 seconds.
- In `functions/chesscloud/index.mjs`, the PvP handler returns `503 {"error":"PVP_NOT_CONFIGURED"}` if `CHESS_RPC_SECRET` is absent or shorter than 40 characters. This is distinct from the `/health` endpoint and ordinary account login/progress.
- **Live Neon read-only, 2026-11-24:** project `wild-hall-05832800`, branch `br-still-credit-b9voxawu`, Function `chesscloud` deployment **#4**, configured `environment` names list contains only `CHESS_ALLOWED_ORIGINS`; **`CHESS_RPC_SECRET` is not listed**. Auth and Data API are active. SQL metadata confirms `chess_odyssey.create_invite` and `accept_invite` exist; actual table counts: **0 invitations, 0 games**. Public `/health` returns `{"status":"staging","api":"chess-cloud","auth":"mandatory"}`. Function logs filtered for `PVP_NOT_CONFIGURED` returned no lines. **Likely missing secret is a material configuration blocker**; however the exact response of the **deployed** Function #4 under a genuine JWT has **not** been captured, and deployed source equivalence to GitHub `main` is **not proven**. Keep failure classification `QA_CONFLICT / LIVE_E2E_BLOCKED`, not fabricated verified-503 PASS.
- Both participants report failure; investigate the actual response/status and which UI action failed before claiming a single root cause. Do not touch or reset the existing real user's 33/33 progress.

## Intended friend invitation workflow

1. Both players create independent verified email/OTP accounts and sign in; Account status is clear in the header.
2. Player A opens **Play a friend**, chooses time control and color, clicks **Create invite**, then **Copy link** or **Share**. Entering the other player's internal user ID is *not required* for a shareable invitation; hide it under advanced options.
3. Player B opens the link (the 43-character private token remains in the URL fragment), is routed to **Play a friend**, and sees an obvious invitation card with **Accept and start**. If signed out, B is prompted to log in and then returns to the pending invitation. Acceptance is always an explicit user action.
4. Once B accepts, both views load the server-authoritative same game: sides, clocks, legal moves, turn sequence, reconnect and status refresh. Creator's waiting view visibly transitions to `Game started` without guessing or manually hunting for the game.
5. Expired/reused/self invitations, invalid tokens, wrong account, absent session and backend configuration errors produce distinct, translated, actionable status messages; invite tokens must not be printed in logs or analytics.

## Implementation design (do not apply before a scoped task)

**P0 PvP:**
- Compare deployed Function #4 source/actual response (with a controlled test JWT) to GitHub current handler. Audit the presence (not values) of the RPC secret in Function config and DB's expected secret fingerprint; safely provision on authorized staging only if needed, avoiding logs containing the secret.
- Make authenticated 2-player invitation/acceptance/live game and outsider-negative E2E gate. Check 503/401/403/409, retry, expiry and game reconnection. Never claim PASS from synthetic tests.
- Change UI to link-driven flow and auto-open PvP tab from `#invite`, preserve explicit Accept, simplified invite control, clear waiting/accepted/expired states. Do not use `toUserId` as a default user-facing input.

**P1 Header:**
- Stable header group: fixed-width RU/EN/AZ selector, Login/account button, A− and A+ controls, responsive from desktop to 320px with no collisions. Keep version label in its own row on narrow widths.
- Top Login opens accessible modal/drawer with the *existing single* auth controls and identical Neon session/state. Lower `My Progress` account panel remains a full alternative. Signed-in state displays account indicator/menu and logout.
- No changes to existing auth policy, credential handling, OTP or DB.

**P2 Text zoom:**
- User-facing reading text only (Academy instructions, coaching, Masters descriptions, labels/status where practical); configurable 90%, 100% (default), 110%, 120%, 130%, with A−, A+ and reset to 100%.
- Store preference under versioned device-local `localStorage`, apply before first visible render when possible. Do **not** change `:root` font-size, `transform:scale()`, browser zoom, `.board`, `.square`, `.piece`, PvP/master board, clock/canvas/engine geometry; avoid duplicate/transformed game controls.
- Test all three locales at 320, 390, 720, 1280px, persistent reload and keyboard/screen reader; compare game-board bounding rectangles before/after zoom and assert unchanged dimensions; no horizontal overflow.

## Acceptance gates

- **A1 header:** Login usable from all tabs; modal opens/closes via keyboard; existing lower controls still work and show the same session; no duplicate IDs; sign-in/sign-out updates both views.
- **A2 language:** Header layout stable across RU/EN/AZ while language changes (same selector rectangle); no overlap with Login or zoom controls.
- **A3 text:** A−/A+ adjust readable copy, persist after reload; board and pieces stay pixel-identical in size.
- **V1 invite:** Two real authenticated users create/share/open/accept a single-use token; both can make legal moves and reconnect. A third unrelated user cannot join/read the game.
- **V2 defects:** If backend is unconfigured, show a clear localized error rather than misleading success; negative/expired/used tokens fail safely. Capture response code without logging secrets.
- **G1 release:** Run existing all-jobs source CI and live staging E2E; only then consider promoting code to `main` with appropriate release authority. Update [existing post-release QA register](POST_RELEASE_QA_V1_0_0.md) when testing actually occurs.
