-- =============================================================================
-- Set varied stock levels across the catalogue.
--
-- Stock is DERIVED, not random: the quantity is a deterministic hash of the SKU,
-- bounded by a band chosen from the part's price. Two consequences worth
-- knowing --
--
--   1. Re-running this file produces the SAME numbers every time. It will not
--      churn your inventory each time you execute it.
--   2. Levels are realistic rather than uniform: a $1,166 RS7 rotor does not
--      get 40 units, and a $55 timing belt does not get 2. Slow-moving,
--      high-value lines are stocked thin; consumables are stocked deep.
--
-- Bands:
--   over $400      1-4    high value, low turnover
--   $150-400       3-10   mid range
--   under $150     8-25   consumable / fast moving
--   unpriced       2-12   value unknown, moderate holding
--
-- in_stock is derived from the count, so nothing ends up flagged in stock with
-- zero units.
-- =============================================================================

BEGIN;

UPDATE parts
   SET stock_count = band_min + (
         -- Deterministic pseudo-random from the SKU: same input, same output.
         abs(('x' || substr(md5(sku), 1, 8))::bit(32)::int) % (band_max - band_min + 1)
       ),
       updated_at  = now()
  FROM (
    SELECT sku AS s,
           CASE WHEN price  = 0   THEN  2
                WHEN price >= 400 THEN  1
                WHEN price >= 150 THEN  3
                ELSE                    8
           END AS band_min,
           CASE WHEN price  = 0   THEN 12
                WHEN price >= 400 THEN  4
                WHEN price >= 150 THEN 10
                ELSE                   25
           END AS band_max
      FROM parts
  ) AS bands
 WHERE parts.sku = bands.s;

-- Availability follows the count, never set independently.
UPDATE parts SET in_stock = stock_count > 0;

COMMIT;


-- =============================================================================
-- ALTERNATIVE 1 -- increment existing stock (a goods-in delivery)
-- =============================================================================
-- Add a flat quantity to everything:
--   UPDATE parts SET stock_count = stock_count + 10;
--   UPDATE parts SET in_stock = stock_count > 0;
--
-- Add per-SKU quantities from a delivery note:
--   UPDATE parts p
--      SET stock_count = p.stock_count + v.qty
--     FROM (VALUES
--       ('AUD-078109119J', 12),
--       ('AUD-06B109119A',  6)
--     ) AS v(sku, qty)
--    WHERE p.sku = v.sku;
--   UPDATE parts SET in_stock = stock_count > 0;


-- =============================================================================
-- ALTERNATIVE 2 -- set explicit levels by hand
-- =============================================================================
--   UPDATE parts p
--      SET stock_count = v.qty,
--          in_stock    = v.qty > 0
--     FROM (VALUES
--       ('AUD-4G8615601E',  1),
--       ('AUD-078109119J', 24)
--     ) AS v(sku, qty)
--    WHERE p.sku = v.sku;


-- =============================================================================
-- VERIFY
-- =============================================================================
-- SELECT CASE WHEN price = 0 THEN 'unpriced'
--             WHEN price >= 400 THEN 'over $400'
--             WHEN price >= 150 THEN '$150-400'
--             ELSE 'under $150' END AS band,
--        count(*), min(stock_count), max(stock_count), ROUND(avg(stock_count),1)
--   FROM parts GROUP BY 1 ORDER BY 2 DESC;
--
-- Must return no rows -- in_stock must always agree with the count:
-- SELECT sku, stock_count, in_stock FROM parts WHERE in_stock <> (stock_count > 0);
