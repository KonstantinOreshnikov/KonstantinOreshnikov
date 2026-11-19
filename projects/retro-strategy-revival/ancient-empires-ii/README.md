# Ancient Empires II-inspired — Next Game Research & Foundation

**Status:** FIRST NEXT-GAME PRIORITY · RESEARCH & SPECIFICATION ONLY · 19 Nov 2026  
**Implementation:** NOT STARTED · **No code or visual assets copied** · **No game build or browser QA claimed**.

Inspired by the player's warm memories of **Ancient Empires II (Macrospace/Glu Java/mobile, 2005)**. After Caribbean Merchant v1.0, this is the first proposed playable follow-up. The goal is an **independently authored, attractive, offline PC browser fantasy-tactics game**, then optionally Android later — not a literal redistribution of Java-era copyrighted code, maps, characters or sprites.

## Navigation

1. [Original game mechanics & code-source audit](mechanics-and-code-audit.md)
2. [First browser prototype v0.1 — scope and UX](prototype-v0.1.md)
3. [Gameplay QA & acceptance](test-plan.md)
4. [Side-by-side retro project decision](../README.md)
5. [Separate deferred Lord of Ultima research](../lord-of-ultima/README.md)

## Gameplay essentials to preserve

A turn-based, tile-based battlefield with a small understandable army, terrain-dependent range and movement, an economy based on **controlling buildings that earn gold**, producing new units from occupied castles, and tactical tradeoffs between pursuing enemies or capturing income sources.

The **2005 GameSpot review** explicitly praises the meaningful AI, capture economy, highlighted move/attack squares, veterans and the eight-mission campaign. [Original contemporary review](https://www.gamespot.com/reviews/ancient-empires-ii-review/1900-6127192/).

## Proposed direction

- One human vs one AI, single battle map, original visuals and no server.
- An **original tactical rule engine** with deterministic, inspectable turns, written separately from rendering.
- Classic pixel-art-inspired, colorful readable landscape; exact historic graphics are **references**, not copying permissions.
- Show move/attack range and predicted damage/risk, enemy threat zones, accessible gold and recruitment.
- Full save/export/restore and quick reset; RU/EN/AZ support.
- Three teaching scenarios and one small 1v1 skirmish; expand toward a campaign only after the core is fun and verified.
- No pay-to-win, ads, mandatory login, network-dependent play or paid automation.

**Recommendation:** take **historical gameplay rules as research**, implement an independent engine and original artwork. Do not fork a GPL repository merely to rename it: if GPL code is ever actually used, comply with GPL-3.0 and audit included asset rights separately.

[Prototype specification](prototype-v0.1.md) · [Original evidence](mechanics-and-code-audit.md)
