# Port Royale 2 (2004): original mechanics and adaptation plan

Date: 2026-11-19. Scope: reference research for **Caribbean Merchant**, an independent fan-inspired strategy game. The original is proprietary: this work references game mechanics, not game assets/code.

## Sources and evidence grades

- **S1 — PRIMARY, PC**: Ascaron, *Port Royale 2 English Manual*, available via Steam, https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/12470/manuals/pr2_manual_english.pdf?t=1759997382 . Primary authority **for PC version only**, not for Elkware Java version.
- **S2 — HISTORIC MOBILE REVIEW**: *Страна игр*, #1 (178), 2005, Port Royale 2 (Elkware) mobile review, https://www.nzdr.ru/data/media/biblio/j/si/2005/Страна%20игр%202005%2001(178).pdf . Archival secondary. Describes mobile 60 towns, roaming pirates, quests and mobile screenshots.
- **S3 — HISTORIC MOBILE REVIEW**: Pocket Gamer, John Thomson, 14 Oct 2005, https://www.pocketgamer.com/port-royale-2/review/ . Secondary; confirms trade, governors, quests, battles, taverns, large navigable map, save.
- **S4 — ARCHIVE, MOBILE**: java2phone, https://java2phone.ru/eng/383 . Reproduced game description and key controls, including the auto-sale by business manager (`5`), course and speed selection in turn-based battles, 8 products / 12 ships. The live page has encoding problems; content corroborated by search index. Lower confidence than manual; high relevance to user's remembered Java experience.
- **S5 — ARCHIVE, MOBILE**: PHONEKY, https://mobile.phoneky.com/games/?id=j4j137046 and https://mobile.phoneky.com/games/?id=j4j60039 . Descriptions confirm 8 goods, 12 ships, 60 towns, turn-based naval battles; game review describes chain shot, grapeshot, boarding/capture; user-uploaded content, not publisher specifications.
- **S6 — HISTORIC PC REVIEW**: GameSpot (Brett Todd), 5 Oct 2004, https://www.gamespot.com/reviews/port-royale-2-review/1900-6109556/ . Secondary PC; confirms 19 products, 5 per town, competitor traders, shortages, storms/plagues and political missions.
- **S7 — PUBLISHER DISTRIBUTION**: Steam Port Royale 2, https://store.steampowered.com/app/12470/Port_Royale_2/ . Published PC feature description and manual link.
- **S8 — HISTORIC PRESS ANNOUNCEMENT**: Golem, 11 Nov 2003, https://www.golem.de/0311/28434.html . Confirms separate Elkware / Ascaron mobile conversion.

## Confirmed original mechanics

### Java/mobile original (Elkware; S2/S3/S4/S5)
- World: 60 cities / Caribbean navigation and trade; 8 tradable goods; 12 types of ships.
- Trading and production at cities; mobile-specific archive explicitly describes a **manager auto-selling goods produced in player-owned factories**.
- Combat: turn-based naval battles; direction and speed are controlled per turn. Cannonballs damage hull, chain shot affects sails and maneuverability, grapeshot hits crew; boarding can yield loot and captured ship.
- Governors and local missions; interaction with NPCs in taverns; trade/progression and roaming pirates.
- Caveat: a complete official Elkware Java game manual has not been obtained. Do **not** attribute undocumented PC features to mobile game as fact.

### PC original (Ascaron; S1 main authority)
- 60 towns; 4 colonial powers; types: 48 colonial towns, 8 governor towns, 4 viceroy seats (manual §6.1–6.3 / printed p.24).
- **Warehouse**: all player production is deposited here; can construct extra warehouses; automatic buying to a target stock ceiling with a maximum price; automatic selling with a **minimum sale price** and a **reserved quantity** (§7.1 / pp.27–28). Selling everything indiscriminately can flood town market.
- **Production**: each town specializes in 5 product categories, with multiple enterprises possible in the city, and some require raw materials to run. If input goods absent, factories stop (§10, pp.47–49). Important: original PC does **not** permit 10 distinct products in *every* ordinary town.
- **Trading screen**: town stock, convoy cargo, warehouse goods and scarcity markers. Transaction price adjusts with traded quantity and local supply; shortage purchases can damage faction reputation (§9 / pp.43–45).
- **Competitors**: autonomous traders build enterprises and move goods between towns (§6.6, p.26).
- **Governors/viceroys**: missions, licenses, letters of marque; representative NPCs; each nation has reputation (friendly/neutral/unpopular/hostile). Relationships affect prices/port access (§7.5, §12, §13).
- **Rank**: progression through assets, restrictions on number of convoys/building permits; separate from per-nation reputation (§13.2, p.63).
- **City development**: school raises quality of life; hospital improves quality of life and decreases plague risk; housing supports workforce; own town/palace exists but is granted after viceroy-related political progress (§6.7, §10, pp.26,46–47).
- **Pirates**: active pirate convoys, hideouts, named pirate leaders and bounties collected from governors; pirate bases expand after raids, and can be discovered/destroyed (§12.6, pp.61–62).
- **Gameplay extras**: treasure maps assembled from message-in-a-bottle fragments; floating loot; loans via treasurer; national wars; random economic shocks; balance sheet with costs and forecast (§5, §7, §12).

## Design principles agreed for Caribbean Merchant

1. **Keep one controllable ship**; do not add convoy micromanagement or requiring escort fleets.
2. **Permit all 10 existing goods in any of 15 towns** as a convenience-oriented deviation, but add economics to prevent infinite passive profit.
3. Maintain one HTML file, offline, RU/EN/AZ, English-only download filename and accessible interface, PC-first, existing saves compatible.
4. Favor original mechanics over invented generic features, while documenting differences explicitly.

## Concrete priority backlog

### v0.7 — must deliver before visual extras
1. Multi-product industry per town: migrate legacy single `estate` into a per-good ledger; allow up to 10 different goods in each city, not forced to manage multiple ships.
2. Manager autosales per product per city: 0/25/50/75/100% of daily output, plus retained-reserve quantity and minimum acceptable sale price (original-inspired). Default 75% for **new** production, unchanged legacy stocks protected. Selling constrained by actual local demand to prevent unlimited revenue.
3. Warehouse capacity per product: 150 → 200 (2,500) → 250 (3,500) → 300 (4,000); total 10,000 credits per fully upgraded product. Batch expansion button with exact total cost, insufficient-funds refusal.
4. Trade screen integrated with own storage: columns or row details for on-board, city market, **own stored**, accessible pickup; load quantity capped by free cargo slots and own stock. Clearly distinguish public city stock from own stock.
5. Contracts: accept is atomic. Count matching goods already on board; withdraw from own local stock first; purchase remainder at local quoted buy price only if stock, money and hold suffice. If not, do not accept / charge; show exact shortfall. At destination, prominently offer 1-click claim and cargo transfer. An accepted contract must never imply cargo is already loaded if it is not.
6. Optional small profit/production summary with daily production, autosales, stock, gross and net income; no automatic loan or fleet complexity.
7. Full, runtime-verified RU/EN/AZ localization of generated market, storage and combat messages.

### v0.8 — strong original gameplay additions
1. Trading rival firms (background simulation, no management overhead), commodity supply/demand impacts, and gradual market saturation.
2. City projects: housing, school, hospital, trade guild, town defenses; give gameplay bonuses inspired by original. Do not implement PC royal palace as a generic purchasable house; make it a late-game distinct ambition.
3. Government and nation reputation (4 nations), shortage relief deliveries, governor missions, letters of marque. Preserve existing rank and achievements.
4. Pirate hideouts, named pirate chiefs, bounty contracts, discovery and destruction. This creates more interesting manual combat; automatically generated route attackers remain as optional quick mode.
5. Optional contracts/tasks in taverns and floating treasure/map fragments.

### v0.9 / later (optional)
- Richer turn-based battle: directional movement/turn speed, sails/hull/crew as separate damage channels, weapon range and AI personality; mobile-original-inspired. Keep accessible auto-battle.
- A separate capital-city / viceroy campaign storyline that can finish without controlling multiple ships.

## Mandatory QA for implementation

- Existing `version:1` saved games migrate deterministically. No loss of gold, held cargo, ship, upgrades, enterprises, contracts, unlocked achievements, or progress.
- Per-tick resource conservation: production = stored change + auto sold + shipped + documented losses (up to warehouse cap); autosale stops below min price; unsold goods retained up to cap. No phantom cash.
- Bulk operations atomic and never overspend; max 300 per product enforced. No duplicate rewards or duplicate construction.
- Contracts: cargo on board vs own warehouse vs market; no funds / no room / no stock cases; expiry; 1-click claim; account balance reconciliation.
- Trading offers recalc after price/stock changes; autosales update city market supply; no trivial perpetual money-printing exploit from internal circular trades.
- Complete interaction and screenshot QA at common desktop and Android widths; RU/EN/AZ tabs, tooltips, newly generated messages; no overlaps and no JS pageerrors.
- Produce a standalone English-named HTML (e.g., `CaribbeanMerchant_v0.7.html`), source ZIP and an explicit QA report; **do not claim verified until browser tests pass**.

## Source authority / caution

For **PC original mechanic** use S1; for **Java original** use S2/S3/S4/S5 only, with confidence notes. Player-requested enhancements are original designs and **must not be presented as historical game features**. Current local game source is authority for its actual behavior, not these review articles. Do not silently invent a buyout/hostile takeover mechanic from competitors: the official manual confirms independent rival traders, but a corporate acquisition mechanic was not verified.