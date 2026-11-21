# Data and economy model

This project models a small world economy entirely in browser state, without a SQL database.

| Entity | Grain | Key checks |
|---|---|---|
| City / market | One port | Valid port ID and coordinates |
| Commodity prices & public stocks | One **port × good** | Nonnegative stocks; price reacts to each unit transacted |
| Player factory | One **port × good** | At most one factory for each of 10 products per port |
| Own warehouse | One **port × good** | Separate from public town stock; cap 150→300 |
| Cargo | One active ship × good | Sum of goods ≤ ship capacity |
| Auto-sale rule | One owned factory | Output share, reserve stock, minimum price |
| Contract | One accepted mission | Quantity, origin, destination, deadline and reward |
| Achievement | One unique achievement ID | Reward claimed at most once |

## Conservation expectations

- Market purchase: player cash decreases; market stock decreases; onboard goods increase.
- Warehouse pickup: owned stock decreases; onboard cargo increases; cash unchanged.
- Auto-sale: owned output/stock decreases; market supply increases, cash increases **only on actual sale**.
- Contract delivery: cargo decreases; treasury and reputation increase **once**.
- Storage is capped and excess production is not silently converted to unlimited money.

Warehouse upgrades: **150 → 200 (2,500 cr.) → 250 (3,500 cr.) → 300 (4,000 cr.)**, per commodity. A fully upgraded per-good warehouse costs 10,000 cr.

Bulk market trades use changing prices as supply moves. This specifically addresses the unrealistic profit opportunity from multiplying one spot price by a very large volume.

[Testing scenarios](../testing/test-strategy.md) · [Game design](../game-design/README.md)
