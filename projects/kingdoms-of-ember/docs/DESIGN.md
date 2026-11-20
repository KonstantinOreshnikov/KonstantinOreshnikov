# Kingdoms of Ember — Game Design and Technical Authority

## Scope
Self-contained standalone HTML/JS/CSS. Desktop-first. 16×12 canvas tile battlefield; four campaign/skirmish seeds; human versus deterministic AI; types include swordsman, spearman, archer, rider, mage, catapult, engineer, golem, wisp, wyvern, commander. Capturing towns/castles modifies owned income; recruitment can occur once per clear owned castle per phase. Terrain affects movement and damage; units grow via XP.

## Invariants
- Every unit has unique id and occupies an available cell; allied units may be traversed but never overlap on destination.
- Actions require side ownership and unused action state; an enemy can retaliate in weapon range even after acting, if it survives the attack.
- Gold always pays for recruitment; commander is not recruitable; phase income granted at most once per transition.
- Capture and rewards may not duplicate.
- Preserve v1 `localStorage` key and `v:1` JSON save contract; reject inconsistent imports.
- No network requests or external runtime dependencies.

## Research / copyright provenance
Historical inspiration: [GameSpot 8 Jun 2005](https://www.gamespot.com/reviews/ancient-empires-ii-review/1900-6127192/) and [Pocket Gamer Ancient Empires II](https://www.pocketgamer.com/ancient-empires-2/review/).

Comparative codebases examined, **not imported**:
- [AncientTree/project_aeii](https://github.com/AncientTree/project_aeii)
- [TAbdiukov/Ancient-Empires-Modern-Web](https://github.com/TAbdiukov/Ancient-Empires-Modern-Web)
- [ancient-empires/Android-web-backup](https://github.com/ancient-empires/Android-web-backup)
- [ProjectD8/Ancient-Empires-II-RM](https://github.com/ProjectD8/Ancient-Empires-II-RM)

Original game assets/music/maps are not licensed for copying by the mere existence of fan repositories. This original implementation contains none.

## Next game-design iteration
P1: campaign objective diversity and scripted non-binary win conditions; balancing army purchases and initiative. P2: more detailed original pixel-art-style terrains and animated units; better viewport/recruitment ergonomics; larger statistically diverse AI match corpus; keyboard and mobile accessibility.
