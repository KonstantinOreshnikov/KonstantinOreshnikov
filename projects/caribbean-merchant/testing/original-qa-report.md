# Caribbean Merchant v1.0 — QA result

**Status: PASS for the 26 local automated browser scenarios listed below.** This is not a claim of 100% coverage or Windows-native validation.

## Environment
- Browser: system Chromium driven via Python Playwright.
- Navigation constraints: direct local HTTP and `file://` navigation were blocked in the sandbox. Tests called `page.set_content` on the exact standalone HTML and injected an isolated `localStorage` stub. This validates rendering, state evolution, event handlers, save serialization and layout; final double-click launch in the user's Windows browser remains untested.
- Responsive viewports: 1420×930 desktop and 410×880 mobile. Screenshots inspected: `QA_desktop.png`, `QA_factories.png`, `QA_mobile.png`.
- All game assets embedded in single HTML; code also distributed in modular form for development.

## Coverage summary
See `QA_REPORT.json` for the 26 exact PASS descriptions. They cover:

- Startup, 7 tabs and RU/EN/AZ switching, without JS `pageerror`.
- Legacy v0.6 save containing money, cargo, ship, enterprise, warehouse stock; load/migration and reread without duplicated rewards or stock inflation.
- Ten factories in a town, bulk atomic purchase, initial autosale 75%.
- Per-good warehouse capacities and purchase prices: 150→200→250→300; bulk upgrades and duplicate-upgrade guard.
- Autosale minimum price, stock reserve, revenue, storage cap and conservation.
- A visible personal warehouse balance and one-click onboard loading in trade.
- Volume-based bulk trading price elasticity, public stock and onboard quantity reconciliation.
- Atomic contract rejection for insufficient funds, hold and city-market stock.
- Contract purchase priority: existing onboard cargo → player warehouse → public market.
- Contract automatic claim at destination, and auto-refill of accepted legacy contracts.
- Single city project construction once, reputation rewards, competitors and stakeholder buyout.
- Named pirate hideout encounter, auto-battle and recovery, full page navigation.
- Narrow viewport runtime smoke and visual inspection.

## Explicit limits
- No exhaustive long campaign autoplay, no Windows `file://` smoke, no actual mobile APK, no network APIs, no load test at 150 factories over thousands of days.
- Existing legacy journal entries may remain in their originally recorded language.
- The geographic background uses independently distributed basemap data; see `MAP_SOURCES.md`.