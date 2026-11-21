# Test strategy — from web UI to game simulation

| Layer | Scenario / oracle | Status |
|---|---|---|
| UI / web | Startup, seven tabs, RU/EN/AZ, no JavaScript pageerrors | Local automated PASS |
| Commerce | Cargo, budget, market stock, per-unit price changes | Local automated PASS |
| Factories | Ten factories/city; autosale/reserve/price floor; cap | Local automated PASS |
| Bulk operations | All-or-nothing constructions and stock upgrades | Local automated PASS |
| Missions | Acceptance must buy/load enough goods or change nothing | Local automated PASS |
| Persistence | Legacy v0.6 state migration, export/import, idempotent awards | Local automated PASS |
| Sea adventure | Named pirate encounter, automatic combat resolution | Local automated PASS |
| Layout | Desktop and narrow screen screenshot review | Local inspected |
| Long-term balance | Thousands of days, saturation, dominance, soft-locks | **NOT VERIFIED** |
| Windows local file | Double-click `file://` open in user's actual browser | **NOT VERIFIED** |
| Native mobile | APK/iOS packaging, device performance | **NOT IMPLEMENTED** |

## What future game QA should inspect

1. **Exploit loops:** passive sale vs auto-buy arbitrage, unlimited rewards, repeatable buyouts.
2. **Soft locks:** no ship money, full cargo, deadline missed, bankrupt treasury.
3. **Volatility:** stock near zero/cap; changing market prices under 10+ factories.
4. **Progression:** 82 awards cannot pay out twice; all endings reachable by sensible play.
5. **Localization:** long Azerbaijani headings, numeric formats, previously stored journal entries.
6. **Reliability:** JSON import error paths, version changes, empty storage, browser reload.

[Evidence summary](evidence.md) · [Economy model](../data-economy/README.md)
