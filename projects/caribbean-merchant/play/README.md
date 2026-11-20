# Play Caribbean Merchant

**Latest available version: [CaribbeanMerchant_v1.1.html](CaribbeanMerchant_v1.1.html)** (contract offer repair, priority orders, all-city auto-sale controls, clearer palace unlock)  
**Previous release: [CaribbeanMerchant_v1.0.html](CaribbeanMerchant_v1.0.html)** (unchanged) · [Project overview](../README.md)

1. Open the v1.1 HTML file link, click **Download raw file**, and save the file as `CaribbeanMerchant_v1.1.html`.
2. Open in Chrome or Edge (local browser).
3. In your previous build, **Export save** to JSON. In v1.1 use **Import save** to restore the same game. Use a backup, and do not select New Game.
4. On loading an old save, expired offer entries refresh immediately. Complete an accepted order by clicking **Complete contract** in the arrival port's dock panel.
5. In **Land → Industries**, use the empire-wide 0% / 75% / 100% auto-sale controls to set all existing factories in one action. Existing reserves and minimum prices remain.
6. The **Personal Palace** and **Designate capital** actions unlock at career title **Port Governor (11th)**: designate a capital first, then build the palace in that city.

**QA evidence:** [v1.1 test report](../testing/v1.1-contracts-autosale.md). The source and standalone build passed synthetic regression tests with the supplied day-1238 save. Native desktop/Android browser E2E is not yet certified.

Game progress uses browser local storage, and local file versions may be isolated by the browser. JSON export/import is the reliable migration path.
