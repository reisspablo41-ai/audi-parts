-- =============================================================================
-- Radiator pricing -- the 9 rows seed-radiators.sql and seed-radiators-2.sql
-- left at 0.00 ("Price on request").
--
-- Researched September 2026. Convention follows the existing radiator seeds:
-- the LIST / MSRP price from a named retailer, not the promo price. Promo and
-- competing figures are recorded in the comment under each row so you can see
-- the spread and undercut deliberately rather than by accident.
--
-- Rows left at 0.00 are SKIPPED by the WHERE clause, so this file is safe to
-- edit and re-run. One row (4S0121212A) is deliberately still 0.00 -- see below.
--
-- Confidence: [HIGH] exact part number, list price on a dealer/OE retailer.
-- [MED] exact part number but sources disagree materially. [--] not priced.
--
--   8 of 9 priced. Radiators go from 13/22 priced to 21/22.
-- =============================================================================

BEGIN;

UPDATE parts p
   -- Casts matter: an untyped NULL in a VALUES list infers as text, and
   -- COALESCE(text, numeric) is a type error.
   SET price       = v.price::numeric,
       cost        = COALESCE(v.cost::numeric,  p.cost),
       stock_count = COALESCE(v.stock::integer, p.stock_count),
       in_stock    = COALESCE(v.stock::integer, p.stock_count) > 0,
       is_active   = TRUE,
       updated_at  = now()
  FROM (VALUES

    -- ── radiators: main (sub-group 251/253) ─────────
    ('AUD-4H0121251B',   541.67, NULL, NULL),  -- [HIGH] Radiator – 4H0 121 251 B  ·  A8 (D4)
    --       EXACT - Europa Parts (Behr Hella) list $541.67, promo $299.95.
    --       FCP Euro $574.99. Widest promo spread in this batch.
    ('AUD-7L0121253A',   473.13, NULL, NULL),  -- [HIGH] Radiator – 7L0 121 253 A  ·  Q7 (4L) / Touareg / Cayenne
    --       EXACT - parts.audiusa.com MSRP $473.13 (their price $378.50).
    --       parts.vw.com $401.67, FCP Euro $433.99.
    ('AUD-5Q0121251GR',  358.73, NULL, NULL),  -- [HIGH] Radiator – 5Q0 121 251 GR  ·  MQB (A3 8V / Golf 7 / Jetta)
    --       EXACT - parts.vw.com / parts.audiusa.com genuine $358.73.
    --       ECS MSRP $358.99. getAudiparts $271.21.
    ('AUD-1EA121251B',   358.30, NULL, NULL),  -- [HIGH] Radiator – 1EA 121 251 B  ·  MEB (ID.4 / Q4 e-tron)
    --       EXACT - parts.audiusa.com $358.30, ECS MSRP $358.99.
    ('AUD-4KE121251B',   358.34, NULL, NULL),  -- [HIGH] Radiator – 4KE 121 251 B  ·  e-tron / Q8 e-tron / SQ8 e-tron
    --       EXACT - OEM Vehicle Parts MSRP $358.34 (sale $257.46).
    --       FITMENT: retailers list this for e-tron / Q8 e-tron / SQ8 e-tron.
    --       It is NOT the e-tron GT radiator -- that is 9J1 121 251 A. The
    --       product description says "A6 / e-tron", which is fine, but do not
    --       let it get tagged to the e-tron GT.
    ('AUD-5WA121251D',   306.85, NULL, NULL),  -- [HIGH] Radiator – 5WA 121 251 D  ·  MQB Evo (A3 / Golf 8)
    --       EXACT - getAudiparts MSRP $306.85, ECS MSRP $306.99.
    --       AutohausAZ (Nissens) $216.99.

    -- ── radiators: auxiliary (sub-group 212) ────────
    ('AUD-4E0121212B',   455.00, NULL, NULL),  -- [MED]  Auxiliary Radiator – 4E0 121 212 B  ·  A8 (D3) W12
    --       parts.audiusa.com $455.00. ShopDAP lists $965.82 regular /
    --       $849.92 special for the same number -- a 2x spread. Taking the
    --       Audi dealer figure; verify before selling if margin matters.
    ('AUD-1K0121212C',   256.67, NULL, NULL),  -- [MED]  Auxiliary Radiator – 1K0 121 212 C  ·  PQ35 (Jetta / Passat)
    --       parts.vw.com genuine $256.67; ECS regular $208.55 (sale $158.52).
    --       Note this row is named "Radiator" in the DB but is sub-group 212,
    --       i.e. auxiliary -- worth renaming for consistency with the others.
    ('AUD-4S0121212A',     0.00, NULL, NULL)  -- [--]   Auxiliary Radiator – 4S0 121 212 A  ·  R8 (4S) rear left
    --       NOT PRICED ON PURPOSE. AutohausAZ shows it discontinued / not
    --       available to order; no dealer or OE retailer publishes a list
    --       price. The only figure online is a US$275.00 eBay genuine listing,
    --       which is a single seller's ask, not a market price. Leaving it at
    --       "Price on request" is the honest call for a discontinued R8 part.
    --       Set the 0.00 above to 275.00 if you want it sellable anyway.

  ) AS v(sku, price, cost, stock)
 WHERE p.sku = v.sku
   AND v.price::numeric > 0;   -- rows at 0.00 are ignored

COMMIT;


-- =============================================================================
-- VERIFY
--   SELECT sku, name, price FROM parts WHERE category_id = 'radiators' ORDER BY price;
--   SELECT count(*) FILTER (WHERE price > 0) AS priced,
--          count(*) FILTER (WHERE price = 0) AS on_request
--     FROM parts WHERE category_id = 'radiators';   -- expect 21 / 1
-- =============================================================================
