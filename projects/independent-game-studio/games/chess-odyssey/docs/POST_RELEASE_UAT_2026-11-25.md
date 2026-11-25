# Chess Odyssey v1.1 — production UAT failures and hotfix handoff

Date: 2026-11-25 (Asia/Baku). Baseline main: `52cad55826967e437214a96004d981c18bd2248b`. Published web v1.1 and official v1.1.0 archive remain available. Overall production acceptance is **FAIL / hotfix required**; historical build/CI PASS remains valid only for its tested scope.

| ID | Priority | Observed failure | Status |
|---|---|---|---|
| BUG-01 | P1 | Time-control selections and another unidentified dialog remain untranslated in EN/AZ | FAIL |
| BUG-02 | P0 | Real two-player match stalls after 1–2 moves | FAIL |
| BUG-03 | P0 | Refresh loses active game/room context | FAIL |
| BUG-04 | P0 | Slow synchronization between players | FAIL |

## Source findings
- `index.html`: hardcoded PvP time presets; local time presets also lack complete locale keys.
- `pvp/pvp-ui.js`: translations omit select options; raw errors may leak; duplicate copy key overwrites caption. Polling interval 6500 ms; refresh calls lack single-flight guard; active game ID is only in memory and no automatic restoration after reload.
- `cloud/cloud-client.js`: no explicit fetch timeout; repeated session retrieval and generic HTTP 409 progress-conflict mapping require review for PvP. These gaps do not establish the exact root cause of the reported stall.

## Repair and acceptance
1. P0: reproduce using two real authenticated browser sessions; trace request timing, token lifecycle, game version, PGN/FEN and backend responses. Fix state recovery, single-flight sync, bounded timeouts/retries, stale-response rejection and version conflict handling while retaining server-authoritative move validation and authorization.
2. P0: proposed acceptance target: at least 40 half-moves, both directions, correct clocks, both clients refresh/reconnect, network interruption, background/foreground, idempotency and outsider denial. Measure latency; proposed p95 <= 2s on normal network, subject to implementation validation. No lost game context or player progress.
3. P1: inventory every static/dynamic UI string in RU/EN/AZ: options, dialogs, settings, alerts, errors, lessons, Masters, analysis, progress, auth/OTP, accessibility, clocks and online states. Ensure complete translations and immediate locale rerender, preserving chess notation and proper names. Test all screens and dialogs across three languages.
4. Regression: local/AI modes, accounts, saved progress, Windows/archive build, physical and cross-device UAT. Keep original release and archive as historical evidence.

Notion [QA-260](https://app.notion.com/p/422bdc101cdb81469610c8ee59254132): OPEN/FAIL. [Localization QA](https://app.notion.com/p/423bdc101cdb819e92e0db9d2c3cca6e): OPEN/FAIL. GitHub Issues disabled (410); this handoff is the technical backlog. Proposed hotfix v1.1.1, not yet implemented or released. No runtime, security policy, data or production changes in this triage.
