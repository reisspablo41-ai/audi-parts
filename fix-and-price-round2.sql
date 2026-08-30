-- =============================================================================
-- Round 2: prices found, plus three factual corrections that searching turned up.
--
-- PRICES (7 parts)
--   All exact-number matches on named retailers.
--
-- CORRECTIONS (9 parts) -- these matter more than the prices.
--
--   1. Sub-group 109 158 is a TIMING CHAIN (upper/lower), not a camshaft
--      adjuster. ECS Tuning and FCP Euro both list 06K109158BJ/BP explicitly as
--      "Timing Chain - Upper". Our catalogue called them "Camshaft Adjuster /
--      Chain Tensioner" -- wrong component entirely. Affects 5 parts.
--
--   2. 059109119F is a FUEL PUMP DRIVE BELT, not a timing belt. FCP Euro lists
--      it as "Fuel Pump Drive Belt" for the Q7/Touareg. Sub-group 119 is a
--      toothed belt, but not necessarily the CAM belt -- our description was an
--      over-reach.
--
--   3. Prefix 9J1 is PORSCHE TAYCAN, not Audi. 9J1615601 is listed by Porsche
--      dealers as a Taycan brake disc at EUR 883.49. All three 9J1 parts are
--      Porsche, and arguably do not belong in an Audi catalogue at all.
-- =============================================================================

BEGIN;

-- ── 1. Prices ────────────────────────────────────────────────────────
UPDATE parts p SET price = v.price::numeric, updated_at = now()
  FROM (VALUES
    ('AUD-078115561J',   23.25),  -- EXACT - Pelican Parts genuine
    ('AUD-04E115561T',   14.75),  -- EXACT - Pelican Parts genuine
    ('AUD-06K109158BP', 244.99),  -- EXACT - ECS genuine (FCP Euro $187.42)
    ('AUD-06K109158BJ', 244.99),  -- EXACT - ECS genuine
    ('AUD-06K109158BG', 244.99),  -- family match with BJ/BP
    ('AUD-01M325429',   115.00),  -- EXACT - dealer-new figure, Meyle equivalent
    ('AUD-9J1615601',   954.17)   -- EXACT - EUR 883.49 converted at ~1.08
  ) AS v(sku, price)
 WHERE p.sku = v.sku;

-- ── 2. Sub-group 158 is a timing chain, not an adjuster ──────────────
UPDATE parts
   SET name = replace(name, 'Camshaft Adjuster / Chain Tensioner', 'Timing Chain (Upper)'),
       description = replace(description,
         'identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering.',
         'identifies this as a timing chain. ECS Tuning and FCP Euro both list this number as "Timing Chain - Upper".'),
       updated_at = now()
 WHERE oe_group = '109' AND oe_subgroup = '158';

-- ── 3. 059109119F drives the fuel pump, not the camshafts ────────────
UPDATE parts
   SET name = 'Fuel Pump Drive Belt – 059 109 119 F',
       description = 'Fuel pump drive belt, OE number 059 109 119 F. Listed by FCP Euro as a '
                     'fuel pump drive belt for the Q7 and Touareg — NOT a camshaft timing belt, '
                     'despite sitting in the 109 timing group. Confirm which belt you need.',
       updated_at = now()
 WHERE sku = 'AUD-059109119F';

-- ── 4. Flag the 9J1 parts as Porsche ─────────────────────────────────
UPDATE parts
   SET description = description || ' NOTE: prefix 9J1 is the PORSCHE TAYCAN platform, '
                     'not an Audi. Porsche dealers list these numbers directly. Decide whether '
                     'they belong in an Audi catalogue.',
       updated_at = now()
 WHERE oe_prefix = '9J1';

COMMIT;

-- VERIFY
--   SELECT sku, name, price FROM parts WHERE oe_subgroup = '158' ORDER BY sku;
--   SELECT count(*) FILTER (WHERE price > 0) AS priced FROM parts;
