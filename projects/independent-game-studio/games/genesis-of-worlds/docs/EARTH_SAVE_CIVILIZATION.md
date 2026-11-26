# Earth: Save Civilization — flagship scenario

**Difficulty: 5/5 — Extreme. Status: v0.5 initial implementation; automated acceptance pending, balance not certified.**

*On Mars, you create life. On Earth, you save it.*

The owner designated Earth as the game's signature feature on 2026-11-26. This is a fictional future ecological crisis, not a prediction. Unlike the other worlds, the starting population, biosphere, oceans, cities and infrastructure already exist. The player must prevent civilization's collapse while restoring a sustainable planet.

## Player-facing presentation

Feature this scenario prominently in the GitHub project heading/README and main menu; v0.5 selectable in development, not released.

| Locale | Title | Subtitle |
| --- | --- | --- |
| EN | Earth: Save Civilization | On Mars, you create life. On Earth, you save it. |
| RU | Земля: спасение цивилизации | На Марсе мы создаём жизнь, а на Земле — спасаем её. |
| AZ | Yer: sivilizasiyanı xilas et | Marsda həyat yaradırsan, Yerdə isə onu xilas edirsən. |

## Proposed gameplay

- Existing population and regional cities at risk; no empty-world colonization start.
- Coupled climate, atmospheric pollution, sea-level rise, biodiversity loss, food/water insecurity, energy shortages and economic stress.
- Regional adaptation, clean energy, ecosystem restoration, resilient infrastructure and migration/evacuation capacity.
- Meaningful trade-offs: emergency relief versus long-term investments, emissions reduction versus energy availability, coastal defense versus planned relocation.
- Restore sustainable climate and ecological health while retaining a viable population and functioning economy. Environmental score alone must never hide civilization collapse.
- Separate survival, recovery and long-term stability objectives; continue in sandbox after victory. Exact thresholds, starting values, events and difficulty multipliers are proposed and require playtesting.
- Relaxed / Normal / Expert player modes remain available independently of Earth's inherent Extreme rating.

## Technical scope

Reuse the shared data-driven world engine and offline campaign saves; extend existing systems for inherited settlements, population, regional hazards, economy and restoration. No server, account, database, monetization or network dependency. Preserve the verified Mars v0.1 candidate unchanged. Earth initial rescue scenario is implemented in v0.5. See [implementation notes](V0_5_IMPLEMENTATION.md). The full original design remains a future target; climate, pollution, flooding and regional heights are game abstractions.

## Visual direction and asset gate
Owner endorsed a cinematic orbital Earth visual contrasting ecological devastation with recovery. The exact chat reference image is not available as a verified file and its publication rights are unconfirmed. Do not republish an unlicensed third-party image or label a replacement as the approved original. Place the confirmed, license-cleared visual under the featured challenge heading in README; label it as concept art, not a screenshot. Pending asset acquisition.

## Implemented v0.5 slice
Three inherited regions; population 240, biomass 30, fictional crisis temperature 27 °C and hazard index 85. Relocate ten people at a cost; protect regions, choose policy, maintain supply. Collapse below 150 population locks time until restore/new game. Victory needs population at least 270, hazard ≤10, biomass ≥70, temperature 12–19 °C, protection level ≥2 in all regions and sustained resources, plus common objectives for 15 consecutive years. All three modes have deterministic viable model routes. Independent balance and visual acceptance pending. No release.

## QA checkpoint
Initial fresh deterministic victories 87/96/123 years (Beginner/Normal/Expert), all eight-world 24 paths also reproduced using the packaged model. Initial browser start/persistence, evacuation, collapse/restore and language checks passed. Corrected context labels verified locally across RU/EN/AZ; final CI delta pending. Extreme rating is provisional; elapsed simulated years alone do not establish difficulty. Full Earth map, richer pollution and regional model, independent gameplay QA still open.
