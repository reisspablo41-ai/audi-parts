-- =============================================================================
-- Brake disc pricing -- the 13 rows in brake-rotors left at 0.00.
--
-- Researched September 2026. Same convention as the radiator and body files:
-- the LIST / MSRP figure from a named retailer, promos recorded in the comment.
-- Every disc in this catalogue is sold SINGLY ("order two per axle" is in each
-- product description), and every figure below is per rotor, not per pair --
-- checked explicitly, because several retailers quote these as a pair.
--
-- Rows left at 0.00 are SKIPPED, so this file is safe to edit and re-run.
--
--   8 of 13 priced. brake-rotors goes from 11/24 priced to 19/24.
--   Of the 10 unpriced FRONT discs, 6 are now priced.
--
-- READ THE TWO CALLOUTS UNDER THE COMMIT BEFORE RUNNING. Two of these rotors
-- are carbon-ceramic and cost more than most of the rest of the catalogue put
-- together, and five part numbers cannot be found at any retailer at all.
--
-- Confidence: [HIGH] MSRP found for this exact number. [MED] taken from an
-- adjacent revision of the same number. [LOW] nearest sibling, verify.
-- =============================================================================

BEGIN;

UPDATE parts p
   SET price       = v.price::numeric,
       is_active   = TRUE,
       updated_at  = now()
  FROM (VALUES

    -- ── front discs ─────────────────────────────────
    ('AUD-6R0615301D',     115.99),  -- [HIGH] Front Brake Disc – 6R0 615 301 D  ·  Polo / A1, 288mm
    --       EXACT - FCP Euro $115.99 (genuine VW). Audi Fremont $106.11.
    --       Zimmermann equivalent sits just under at ~$100.
    ('AUD-7B0615301B',     222.25),  -- [LOW]  Front Brake Disc – 7B0 615 301 B  ·  7B platform
    --       NOT this exact number. 7B0-615-301-F, the adjacent revision, is
    --       $222.25 MSRP on OEM Parts Online. Revisions in this family are
    --       usually the same disc with a different coating, so the figure
    --       should be close -- but confirm the -B before trading on it.
    ('AUD-9J1615301A',     661.07),  -- [HIGH] Front Brake Disc – 9J1 615 301 A  ·  e-tron GT, 360x36
    --       EXACT - $661.07. Fits e-tron GT, S e-tron GT, RS e-tron GT
    --       Performance and the Porsche Taycan (shared J1 platform).
    ('AUD-8V0615301R',     975.39),  -- [HIGH] Front Brake Disc – 8V0 615 301 R  ·  RS3 / TT RS, 370x34
    --       EXACT - MSRP $975.39, explicitly "Priced Each" on ECS. Retailer
    --       sale prices run $710-$811. NOTE: this is an RS3/TT RS part, not a
    --       standard A3 disc -- do not let it get tagged to the base A3.
    ('AUD-9J1615302D',    3617.23),  -- [HIGH] Front Brake Disc – 9J1 615 302 D  ·  e-tron GT front RIGHT
    --       EXACT - MSRP $3,617.23. See CALLOUT 1: this is a ceramic disc.
    ('AUD-4K0615301AE',   7786.40),  -- [HIGH] Front Brake Disc – 4K0 615 301 AE  ·  RS5, 400x38, LEFT
    --       EXACT - MSRP $7,786.40. See CALLOUT 1: carbon-ceramic (PCCB-class).

    -- ── rear discs (same category, priced while in here) ──
    ('AUD-4E0615601L',     154.90),  -- [MED]  Rear Brake Disc – 4E0 615 601 L  ·  A8 / S8 D3, 310mm
    --       4E0-615-601-K, the adjacent revision, is $154.90 MSRP. eBay
    --       listings for the -L itself run $80-$337, which brackets it.
    ('AUD-95C615601',      101.73),  -- [LOW]  Rear Brake Disc – 95C 615 601  ·  Macan
    --       PartsGeek Zimmermann 95B-615-601-G $101.73. See CALLOUT 2 -- the
    --       95C prefix itself looks wrong.

    -- ── not priced: no retailer lists these at all ────
    ('AUD-8MA615301',        0.00),  -- [--] Front Brake Disc – 8MA 615 301
    ('AUD-8MA615301A',       0.00),  -- [--] Front Brake Disc – 8MA 615 301 A
    ('AUD-8MA615302',        0.00),  -- [--] Front Brake Disc – 8MA 615 302
    ('AUD-8MA615302A',       0.00),  -- [--] Front Brake Disc – 8MA 615 302 A
    ('AUD-8MA615601',        0.00)  -- [--] Rear Brake Disc – 8MA 615 601
    --       All five: see CALLOUT 2. Nothing found at any retailer, on any
    --       spelling. Left on "Price on request" deliberately.

  ) AS v(sku, price)
 WHERE p.sku = v.sku
   AND v.price::numeric > 0;   -- rows at 0.00 are ignored

COMMIT;


-- =============================================================================
-- CALLOUT 1 -- TWO OF THESE ARE CARBON-CERAMIC, AND THE PRICES ARE REAL
--
--   4K0615301AE   $7,786.40   RS5, 400x38, front left
--   9J1615302D    $3,617.23   e-tron GT, front right
--
--   Both are ceramic-composite discs, and the MSRPs are correct -- a Taycan
--   PCCB front rotor lists at $5,700, so these sit in the right band. Together
--   they will be the two most expensive line items on the whole storefront,
--   and a $7,786 brake disc next to a $110 one looks like a data error even
--   though it is not.
--
--   Both are also single-side parts (one says LEFT, the other RIGHT), so the
--   usual "order two per axle" line in the description is wrong for them.
--
--   If you would rather not list them: change their price back to 0.00 and
--   they return to "Price on request", which is arguably the right treatment
--   for a part at that value anyway.
--
-- CALLOUT 2 -- SIX PART NUMBERS THAT MAY NOT BE REAL
--
--   8MA615301 / 8MA615301A / 8MA615302 / 8MA615302A / 8MA615601
--     "8MA" returns nothing at any retailer, on any spelling, and it is not a
--     VAG platform prefix I can place. Five separate searches found no listing
--     and no cross-reference. Either these are very new numbers not yet in any
--     catalogue, or they are wrong. Worth checking against your source before
--     you try to sell them -- pricing was not attempted.
--
--   95C615601
--     Macan rear discs are 95B, not 95C. Every retailer lists 95B-615-601-G /
--     -J and nothing under 95C. The $101.73 above is the 95B part. Verify the
--     number before trading on it.
--
-- VERIFY
--   SELECT sku, name, price FROM parts WHERE category_id='brake-rotors' ORDER BY price;
--   SELECT count(*) FILTER (WHERE price > 0) AS priced,
--          count(*) FILTER (WHERE price = 0) AS on_request
--     FROM parts WHERE category_id = 'brake-rotors';   -- expect 19 / 5
-- =============================================================================
