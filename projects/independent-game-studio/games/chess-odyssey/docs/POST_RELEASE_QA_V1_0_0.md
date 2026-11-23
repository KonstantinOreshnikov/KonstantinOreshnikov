# Chess Odyssey v1.0.0 — Post-release QA register

**Public release:** 2026-11-24 · [Play live](https://konstantinoreshnikov.github.io/KonstantinOreshnikov/chess-odyssey/) · [Main merge PR #20](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/20) · [Production Pages #45261953720 (3/3 PASS)](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45261953720).

**Owner decision:** ship v1.0.0 immediately with the below acceptance checks explicitly deferred. A shipped product is **not** proof these risk gates passed. GitHub Issues are disabled in this repository, so this versioned QA register is the canonical tracker until an issue tracker is enabled.

## Outstanding gates

| Gate | Scope | Status | Required evidence |
| --- | --- | --- | --- |
| A1 | Two separate real email OTP accounts plus outsider; valid JWT and re-auth | OPEN | Auth/API observations with no OTP/token/PII in logs |
| A2 | OTP invalid/expired/reused; forged token/issuer; logout and session expiry | OPEN | 401/403 denials, proof of exact issuer and verified subject |
| P1 | Fresh registered progress starts 0/33; no legacy local migration | MOCK PASS; LIVE OPEN | Readback for isolated test account |
| P2 | Actual A-to-B cross-device autosave/reload | OPEN | Revision + server record readback |
| P3 | Parallel CAS update; 409 on stale revision; recovery | OPEN | Race/rollback evidence |
| P4 | Third-party progress isolation, RLS and direct API negative tests | OPEN | Denied SELECT/UPDATE without cross-user data leakage |
| V1 | PvP invites, A/B legal turns and outsider denial | MOCK PASS; LIVE OPEN | Two genuine JWT actors + third outsider |
| V2 | Move idempotency, clocks, reload, draw/resign/rematch | MOCK PASS; LIVE OPEN | Actual backend E2E |
| U1 | Android and PC, 10×10 board/piece visual sweep, keyboard/accessibility | OPEN | Device- and viewport-specific screenshots/results |
| L1 | Independent RU/EN/AZ pedagogical text review | OPEN | QA checklist and corrected delta |
| O1 | Backup/restore, rollback proof, dedicated production Neon isolation | OPEN | Verified procedure, live deployment identifiers |

## Protected user baseline

At the authorization checkpoint the real user had a saved **33/33 Academy** result in Neon, progress revision **36**, one registered account and one server progress row. These are aggregate confirmation only; do not store identifiers, OTP, passwords, or tokens here.

No test may overwrite or reset the registered account. Test accounts and records belong only in expressly authorized staging scope. Deleting records or changing authentication/security policy requires separate precise authorization.

## Release evidence

- [v1.0 source QA — 3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45250410329).
- [Main Pages production — 3/3 PASS after transient artifact metadata retry](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45261953720).
- [Independent public v1.0 game smoke PASS](https://agent.tinyfish.ai/runs/ad1e13fb-00f5-4e26-a235-cd9013ae371d).
- [Release notes](RELEASE_V1_0_0.md) and [technical current state](CURRENT_STATUS.md).

## QA update discipline

For each actual test record the source SHA, release deployment, environment and Function deployment number, exact observed outcome, expected outcome, PASS/FAIL/BLOCKED, and safe evidence link. Only mark PASS after executing the claimed live scenario; do not infer from the static UI.
