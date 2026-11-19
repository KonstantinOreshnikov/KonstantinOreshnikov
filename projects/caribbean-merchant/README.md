# Caribbean Merchant
### From a childhood mobile-game memory to a playable Caribbean strategy

**Independent fan-inspired project · Playable offline release v1.0 · RU / EN / AZ**

> I remembered a mid-2000s mobile game: trading between Caribbean ports, dodging pirates, growing a business and fighting tactical sea battles. Years later, I set out to rebuild that *feeling*, one remembered feature and one playtest at a time — without copying the original game.

**[Download the playable v1.0 HTML](play/CaribbeanMerchant_v1.0.html)** · [How to run](play/README.md) · [Follow the development diary](history/README.md)

![Caribbean sea-floor relief and islands — physical map artwork used by the game](src/assets/physical_map.webp)

*Physical terrain used in the game (NOAA ETOPO / Basemap processing). The live browser game overlays ports, piracy zones and routes on this geography.*

## The story

The initial reference was **Port Royale 2 Mobile (Elkware / Java era, mid-2000s)**. The project began with fragments of personal recollection — ports, trading, pirates and ship combat — not an original JAR, source archive or extracted artwork.

We turned those recollections into a small working browser prototype. I tested it as a player, reported practical friction and adjusted the requirements: the unreadable first map, hidden cargo and cash during scrolling, repetitive factory collection, slow contracts and a lack of meaningful late-game goals. The browser game evolved through **seven preserved build milestones** and many design, feedback and QA cycles.

**My role:** concept originator, product owner, gameplay critic and hands-on user tester; feature prioritization and acceptance feedback. **AI-assisted implementation:** ChatGPT helped research mechanics, write and iterate code, prepare documentation and execute scripted browser checks. This is an honest solo-owner/AI-assisted workflow, not an invented studio team.

## Playable result

| Area | Implemented in v1.0 |
|---|---|
| World | 15 Caribbean ports, 4 colonial nations, physical relief map |
| Trade | 10 goods, changing stock/price, quantity-aware bulk transactions |
| Management | Up to 10 factories per city, auto-sale, reserves, price floors, upgrades to 300 units per product |
| Player experience | Sticky treasury/cargo HUD, contextual market actions, one-click contracts |
| Naval game | One controllable ship, ship upgrades, manual turn-based fights and auto-resolve |
| Progression | 16 ranks, 82 achievements, 3 victory paths, city buildings |
| Exploration | Pirate zones, named hideouts, treasure fragments and simplified diplomacy |
| Localization | Russian, English, Azerbaijani with instant switching |
| Save | Local browser storage plus JSON export/import |

The game is **self-contained HTML**. Download it and open it locally. No installation, account, server or gameplay connection is required.

## Explore the case study

| Discipline | What we learned | Evidence and decisions |
|---|---|---|
| **Product & narrative** | Recovering a remembered gameplay loop and scoping it deliberately | [History](history/README.md) · [Feedback → changes](history/feedback-loop.md) |
| **Game design** | Trade, progression, combat, passive economy, game balance | [Game design](game-design/README.md) |
| **UI/UX & visual design** | An unreadable schematic map replaced with geographical relief; compact market UX | [Visual design](ux-ui/README.md) |
| **Web engineering** | Offline vanilla JS, embedded assets, event-driven UI | [Architecture](web-development/README.md) |
| **Data & economics** | Port–good grain, stock reconciliation, safe save migration | [Data model](data-economy/README.md) |
| **Web & game testing** | Browser scenarios, manual playtesting, negative tests, regression gates | [Testing](testing/README.md) |
| **Original research** | Separate Java and PC source claims; protect IP and credit map data | [Research](research/README.md) |
| **Decisions & roadmap** | User-centered constraints and unfinished ideas | [Decisions](project-management/decisions.md) · [Roadmap](project-management/roadmap.md) |

## How the project changed

```mermaid
flowchart LR
 M[Remembered mobile game] --> P[v0.1 playable prototype]
 P --> L[v0.2–0.3 localization and piracy]
 L --> C[v0.4 geographic map redesign]
 C --> U[v0.5 usable commerce]
 U --> G[v0.6 career and achievements]
 G --> R[v1.0 automated economy and richer world]
 R --> T[Ongoing real-player testing]
 T -.feedback.-> R
```

[**Browse every preserved HTML milestone**](history/releases/README.md) (historical builds are not recommended over v1.0).

## Links to the wider portfolio

- [Quality Engineering Lab](https://github.com/KonstantinOreshnikov/web-testing-page-object) — reusable E2E/QA learning.
- [Web Testing with Python](https://github.com/KonstantinOreshnikov/web-testing-python) — browser UI and test design.
- [Git Collaboration Guide](https://github.com/KonstantinOreshnikov/git-instruction-workshop) — change control and review.
- [Python Learning Lab](https://github.com/KonstantinOreshnikov/python-lessons-geekbrains) — analysis and validation.
- [Project showcase](../README.md) — other independent projects.

## What this project is *not*

Not an official Port Royale product, a decompiled/remastered copy, a replacement for the original, or evidence of a full production studio. The original brand belongs to its respective owners. The code, UI and gameplay are independently created; no proprietary original game code or artwork is included. **Public visibility is not an open-source license grant.** See [Attribution and distribution](research/attribution.md).

**Verification boundary:** archived QA reports state 26 passing *local scripted browser scenarios* for v1.0. They do **not** prove a long campaign, real Windows file-open smoke test, native Android app, formal security audit or mathematical game balance.

---

**RU · История проекта:** небольшая самостоятельная игра, воссозданная по воспоминаниям о мобильной стратегии середины 2000-х. Работа шла через личные игровые тесты, переделку карты, UX-правки, экономику, морские бои и достижения. Это авторский эксперимент с AI-assisted разработкой, а не копия исходного продукта.
