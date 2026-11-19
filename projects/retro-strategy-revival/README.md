# Retro Strategy Revival — Two Game Candidates

**Status: RESEARCH ONLY · Not implemented · Not approved for build · Updated 19 Nov 2026**

This research note preserves two **owner-requested future game candidates** after the [Caribbean Merchant v1.0](../caribbean-merchant/README.md) project. The motivation is specific personal nostalgia for earlier games, not a generic clone factory.

> **RU:** Сохраняем на будущее две любимые стратегии: **Ancient Empires II (2005, Java phones)** и **Lord of Ultima (2010–2014, browser MMO)**. Исходники, референсы и риски проверены; разработка здесь **не начата**.

**Current next-game priority:** [Ancient Empires II — research, original-mechanics audit and browser v0.1 plan](ancient-empires-ii/README.md). No implementation has begun. Lord of Ultima remains a separately documented future single-player project with an approved convenience/anti-paywall design direction.

## 1. Ancient Empires II (J2ME, 2005)

Original: tactical turn-based fantasy strategy with tile maps, campaign missions, combat units and commanders. [Contemporary GameSpot review](https://www.gamespot.com/reviews/ancient-empires-ii-review/1900-6127192/).

### Existing public code and implementations

| Repository | What it contains | Reuse caution |
|---|---|---|
| [AncientTree/project_aeii](https://github.com/AncientTree/project_aeii) | Java / libGDX **Ancient Empires Reloaded**, desktop, Android and iOS modules; campaigns, editor, multiplayer claims | **GPL-3.0 code**; original assets may have separate rights despite README assertion |
| [ancient-empires/Android-web-backup](https://github.com/ancient-empires/Android-web-backup) | Preserved Android/Web game; README gives local `npm run AE2` browser setup | **GPL-3.0**, requires Node/http-server; playable build not independently executed in this research |
| [TAbdiukov/Ancient-Empires-Modern-Web](https://github.com/TAbdiukov/Ancient-Empires-Modern-Web) | Browser compatibility fixes, including IndexedDB instead of obsolete WebSQL | Technical starting point for modern web tests, **not tested here** |
| [ProjectD8/Ancient-Empires-II-RM](https://github.com/ProjectD8/Ancient-Empires-II-RM) | Java ME Revolution Mod, skirmish enhancements and a built-in map editor | Historical mod; verify its own code/asset license before reuse |

**Feasibility:** HIGH for a *new independent, browser-first tactical game*. Phase 1 should inventory original unit stats / terrain rules / mission structure, then prototype the battle grid and an AI player with original visual assets. Decide clean-room vs GPL-based development **before copying code**.

> **Deep-research addendum (19 November 2026):** [**Lord of Ultima — economy, Crown of the Gods comparison, visual references, earned automation and one-continent single-player design**](lord-of-ultima/README.md). This is **research and a proposed specification**, not implementation.

## 2. Lord of Ultima (EA Phenomic, 2010–2014)

Original: persistent browser MMORTS featuring precise city-layout bonuses, wood/stone/iron/food economies, building queues, trade, troops, dungeons, alliances, continent warfare and shrines. [Original EA announcement](https://news.ea.com/press-releases/press-releases-details/2010/EAs-Phenomic-Introduces-Strategy-Game-Lord-of-Ultima/default.aspx) · [Original screenshots](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/) · [Game guide archive](https://wiki.ultimacodex.com/wiki/Lord_of_Ultima). Original official servers closed on 12 May 2014.

### What source code was actually found?

| Lead | Evidence | Assessment |
|---|---|---|
| **Official EA original client/server code** | No authoritative public release verified in the searches reviewed | **NOT FOUND**; browser screenshots and client scripts are not equivalent to a full MMO backend |
| [FelixLeChat/LordOfUltima](https://github.com/FelixLeChat/LordOfUltima) | Public independent C# **WPF desktop** reconstruction; buildable project files and partial game elements | Incomplete: README says PvE combat, server economy, multiplayer, server saving not implemented; no repo license found and author warns art belongs to EA. **Study concepts only, do not copy code/assets.** |
| [XAOS-Interactive/LordOfUltima](https://github.com/XAOS-Interactive/LordOfUltima) | Appears to share the same WPF reconstruction files/README | Not independent evidence of an original game code leak |
| [Crown of the Gods](https://www.crownofthegods.com/) | Fan-inspired playable browser successor with separate visual art/lore | Existing alternative, not open-source base verified; can serve as comparative product reference |
| [Lord of Ultima: Revival](https://lordofultima.me/) | **New unofficial fan project** claiming a first playable world launched **21 Oct 2026**, historical gameplay rules and browser/phone access | **Live site assertions, not an independent gameplay QA**; no open-source code/license established, and no visual-accuracy audit yet |

### Priority requirements before building

- **Design fidelity comes first.** Owner disliked a previous attempted restoration (exact project and details **not established**). Create an annotated visual baseline from authentic 2010–2014 screens *before* coding: region view, city grid, build menu, icon density, resource panels, construction queue, palette and interaction flow.
- Build a **visual-only clickable prototype** of one city and the world map; get owner approval before backend implementation.
- Preserve the differentiated resource adjacency bonuses, city planning, queues, army composition, travel times, dungeon raids, diplomacy and alliance progression.
- A persistent multiplayer world is a **server-authoritative application**, unlike the single-file Caribbean Merchant game. It needs a relational database, background/clock processing, transactions, attack scheduling and safe authorization; state the actual architecture rather than pretending it works offline.
- Prototype single-player/local simulation first only if it preserves important LoU design decisions. **Do not claim it is a full MMO** until multiplayer/security/scale tests pass.

**Owner UX direction confirmed 19 Nov 2026:** free from-start placement advisor, adjacency forecast, goal-based upgrade plans, explainable city statistics, earned permanent automation, quiet offline single-player atmosphere; no pay-to-win or pressure to return daily. See [the detailed Smart Planning contract](lord-of-ultima/smart-planning-ux.md). **Exact disliked successor** is still uncertain; the owner's description suggests Crown of the Gods, not the unrelated JRPG Chrono Trigger.

**Feasibility:** MODERATE for a single-city prototype; HIGHER effort and uncertainty for a faithful persistent MMO. No original-source extraction, proprietary art republication, trademarked branding or unauthorized assets.

## Side-by-side decision

| Criterion | Ancient Empires II-inspired | Lord of Ultima-inspired |
|---|---|---|
| Gameplay type | Turn-based / discrete turns | Persistent online / real-time |
| Viable code references | Several inspectable open-source/fan projects | Incomplete desktop recreation; no official server code verified |
| Easiest safe MVP | One battle map + 2 armies + AI | One faithful city screen + simulated economy |
| Difficulty | Low–medium | High for full game |
| Top risk | Intellectual property; gameplay/AI balance | Design mismatch, backend complexity, intellectual property |
| Recommendation | **Develop first after design / source audit** | **Research and approve visual prototype before architecture work** |

## Research / acceptance gates

1. Verify source ownership, license and any third-party art at **file level** before code/assets transfer.
2. Review original screenshots and mechanics independently from fan reimplementations.
3. Create the visual reference specification; document where a new game intentionally differs.
4. Get the owner's explicit go-ahead before gameplay implementation.
5. Track iterative human feedback, browser QA and economic/combat invariants; keep evidence with source code.
6. Avoid reusing original trademarks, logos, copyrighted sprites or audio in a public independent product.

**Scope boundary:** Research only. Neither game has been recreated, downloaded for execution, licensed for redistribution, deployed or QA-certified by this note. Their placement here does not imply the portfolio author owns rights to the commercial games.
