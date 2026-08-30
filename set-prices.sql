-- =============================================================================
-- Master pricing script -- every part in the catalogue (124 rows).
--
-- Supersedes the earlier 48-row version. Regenerated from the live database, so
-- prices already set are pre-filled and round-trip safely.
--
-- HOW TO USE
--   Edit the number in any row. Rows left at 0.00 are SKIPPED, so you can price
--   in batches and re-run this file as often as you like.
--   Columns: sku, price, cost, stock
--
-- STATE AT GENERATION: 55 of 124 priced.
-- Three prices researched this session are pre-filled below and are NOT yet in
-- the database -- running this file applies them:
--   5Q0129620B $39.99, 4N0129620C $65.00, 4N0129620B $65.00
--
-- Confidence markers: [HIGH] exact part number on a named retailer.
-- [MED] family match. [LOW] derived from a sibling revision. [--] not priced.
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

    -- ── air-filters ─────────────────────────────────
    ('AUD-04E129620',     0.00, NULL, NULL),  -- [--]   Engine Air Filter – 04E 129 620
    --       no listing found
    ('AUD-1K0129620G',    37.32, NULL, NULL),  -- [set]  Engine Air Filter – 1K0 129 620 G
    ('AUD-1K0129620L',    37.32, NULL, NULL),  -- [set]  Engine Air Filter – 1K0 129 620 L
    ('AUD-4N0129620C',    65.00, NULL, NULL),  -- [HIGH] Engine Air Filter – 4N0 129 620 C
    --       EXACT - Europa Parts regular $65.00 (sale $54.95).
    ('AUD-4N0129620B',    65.00, NULL, NULL),  -- [MED] Engine Air Filter – 4N0 129 620 B
    --       Family match with revision C. Verify.
    ('AUD-5Q0129620B',    39.99, NULL, NULL),  -- [HIGH] Engine Air Filter – 5Q0 129 620 B
    --       EXACT - ECS MSRP $39.99; Europa $39.33; Blauparts $37.98.
    ('AUD-8B3133844B',     0.00, NULL, NULL),  -- [--]   Engine Air Filter – 8B3 133 844 B
    --       prefix 8B3 unconfirmed - verify the number itself
    ('AUD-8R0133843D',    44.15, NULL, NULL),  -- [set]  Engine Air Filter – 8R0 133 843 D
    ('AUD-8W0133843E',    27.00, NULL, NULL),  -- [set]  Engine Air Filter – 8W0 133 843 E
    ('AUD-8W0133843C',    43.49, NULL, NULL),  -- [set]  Engine Air Filter – 8W0 133 843 C
    ('AUD-8W0133843D',    43.49, NULL, NULL),  -- [set]  Engine Air Filter – 8W0 133 843 D

    -- ── brake-pads ──────────────────────────────────
    ('AUD-420698451D',   140.00, NULL, NULL),  -- [set]  Brake Pad Set – 420 698 451 D

    -- ── brake-rotors ────────────────────────────────
    ('AUD-1J0615301M',   291.99, NULL, NULL),  -- [set]  Front Brake Disc – 1J0 615 301 M
    ('AUD-1J0615301P',   291.99, NULL, NULL),  -- [set]  Front Brake Disc – 1J0 615 301 P
    ('AUD-1K0615301AR',   110.00, NULL, NULL),  -- [set]  Front Brake Disc – 1K0 615 301 AR
    ('AUD-2Q0615601H',    55.00, NULL, NULL),  -- [set]  Rear Brake Disc – 2Q0 615 601 H
    ('AUD-4E0615601L',     0.00, NULL, NULL),  -- [--]   Rear Brake Disc – 4E0 615 601 L
    ('AUD-4F0615301E',   210.77, NULL, NULL),  -- [set]  Front Brake Disc – 4F0 615 301 E
    ('AUD-4G8615601E',  1166.15, NULL, NULL),  -- [set]  Rear Brake Disc – 4G8 615 601 E
    ('AUD-4K0615301AE',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 4K0 615 301 AE
    ('AUD-4M0615301AP',   453.83, NULL, NULL),  -- [set]  Front Brake Disc – 4M0 615 301 AP
    ('AUD-6R0615301D',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 6R0 615 301 D
    ('AUD-7B0615301B',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 7B0 615 301 B
    ('AUD-80A615601C',   111.99, NULL, NULL),  -- [set]  Rear Brake Disc – 80A 615 601 C
    ('AUD-8E0615601M',   113.68, NULL, NULL),  -- [set]  Rear Brake Disc – 8E0 615 601 M
    ('AUD-8MA615301A',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 8MA 615 301 A
    ('AUD-8MA615301',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 8MA 615 301
    ('AUD-8MA615302A',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 8MA 615 302 A
    ('AUD-8MA615302',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 8MA 615 302
    ('AUD-8MA615601',     0.00, NULL, NULL),  -- [--]   Rear Brake Disc – 8MA 615 601
    ('AUD-8R0615301G',   198.44, NULL, NULL),  -- [set]  Front Brake Disc – 8R0 615 301 G
    ('AUD-8V0615301R',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 8V0 615 301 R
    ('AUD-95C615601',     0.00, NULL, NULL),  -- [--]   Rear Brake Disc – 95C 615 601
    ('AUD-9J1615301A',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 9J1 615 301 A
    ('AUD-9J1615302D',     0.00, NULL, NULL),  -- [--]   Front Brake Disc – 9J1 615 302 D
    ('AUD-9J1615601',     0.00, NULL, NULL),  -- [--]   Rear Brake Disc – 9J1 615 601

    -- ── cabin-filters ───────────────────────────────
    ('AUD-1EA819669',     0.00, NULL, NULL),  -- [--]   Cabin Air Filter – 1EA 819 669
    --       cabin filter, MEB platform - no listing found

    -- ── intercoolers ────────────────────────────────
    ('AUD-4F0145804K',   130.00, NULL, NULL),  -- [set]  Charge Air Cooler – 4F0 145 804 K
    ('AUD-4K0145804M',     0.00, NULL, NULL),  -- [--]   Charge Air Cooler – 4K0 145 804 M

    -- ── oil-filters ─────────────────────────────────
    ('AUD-021115562A',     0.00, NULL, NULL),  -- [--]   Oil Filter Element – 021 115 562 A
    ('AUD-03H115403J',   270.55, NULL, NULL),  -- [set]  Oil Filter Housing – 03H 115 403 J
    ('AUD-03N115562B',     0.00, NULL, NULL),  -- [--]   Oil Filter Element – 03N 115 562 B
    ('AUD-04E115561T',     0.00, NULL, NULL),  -- [--]   Oil Filter – 04E 115 561 T
    ('AUD-056115561G',     0.00, NULL, NULL),  -- [--]   Oil Filter – 056 115 561 G
    ('AUD-057115561M',     0.00, NULL, NULL),  -- [--]   Oil Filter – 057 115 561 M
    ('AUD-06D115562',     0.00, NULL, NULL),  -- [--]   Oil Filter Element – 06D 115 562
    ('AUD-06E115405K',     0.00, NULL, NULL),  -- [--]   Oil Filter Housing – 06E 115 405 K
    ('AUD-06E115562C',    25.83, NULL, NULL),  -- [set]  Oil Filter Element – 06E 115 562 C
    ('AUD-06E115562H',    24.15, NULL, NULL),  -- [set]  Oil Filter Element – 06E 115 562 H
    ('AUD-06J115403Q',    19.75, NULL, NULL),  -- [set]  Oil Filter Element – 06J 115 403 Q
    ('AUD-06L115562B',    17.15, NULL, NULL),  -- [set]  Oil Filter Element – 06L 115 562 B
    ('AUD-071115562A',     0.00, NULL, NULL),  -- [--]   Oil Filter Element – 071 115 562 A
    ('AUD-078115561J',     0.00, NULL, NULL),  -- [--]   Oil Filter – 078 115 561 J
    ('AUD-079198405E',    40.01, NULL, NULL),  -- [set]  Oil Filter Service Kit – 079 198 405 E
    ('AUD-079198405D',    33.33, NULL, NULL),  -- [set]  Oil Filter Service Kit – 079 198 405 D

    -- ── radiators ───────────────────────────────────
    ('AUD-1EA121251B',     0.00, NULL, NULL),  -- [--]   Radiator – 1EA 121 251 B
    ('AUD-1K0121212C',     0.00, NULL, NULL),  -- [--]   Radiator – 1K0 121 212 C
    ('AUD-1K0121251AK',   316.99, NULL, NULL),  -- [set]  Radiator – 1K0 121 251 AK
    ('AUD-1K0121251CJ',   316.99, NULL, NULL),  -- [set]  Radiator – 1K0 121 251 CJ
    ('AUD-4E0121212B',     0.00, NULL, NULL),  -- [--]   Auxiliary Radiator – 4E0 121 212 B
    ('AUD-4E0121251G',   603.33, NULL, NULL),  -- [set]  Radiator – 4E0 121 251 G
    ('AUD-4F0121251AC',   350.00, NULL, NULL),  -- [set]  Radiator – 4F0 121 251 AC
    ('AUD-4F0121251AF',   350.00, NULL, NULL),  -- [set]  Radiator – 4F0 121 251 AF
    ('AUD-4H0121251B',     0.00, NULL, NULL),  -- [--]   Radiator – 4H0 121 251 B
    ('AUD-4K0121251P',   240.00, NULL, NULL),  -- [set]  Radiator – 4K0 121 251 P
    ('AUD-4KE121251B',     0.00, NULL, NULL),  -- [--]   Radiator – 4KE 121 251 B
    ('AUD-4M0121251M',   805.00, NULL, NULL),  -- [set]  Radiator – 4M0 121 251 M
    ('AUD-4S0121212A',     0.00, NULL, NULL),  -- [--]   Auxiliary Radiator – 4S0 121 212 A
    ('AUD-5Q0121251GR',     0.00, NULL, NULL),  -- [--]   Radiator – 5Q0 121 251 GR
    ('AUD-5WA121251D',     0.00, NULL, NULL),  -- [--]   Radiator – 5WA 121 251 D
    ('AUD-7L0121253A',     0.00, NULL, NULL),  -- [--]   Radiator – 7L0 121 253 A
    ('AUD-8E0121251AQ',   593.99, NULL, NULL),  -- [set]  Radiator – 8E0 121 251 AQ
    ('AUD-8E0121251AJ',   593.99, NULL, NULL),  -- [set]  Radiator – 8E0 121 251 AJ
    ('AUD-8K0121251AL',   259.95, NULL, NULL),  -- [set]  Radiator – 8K0 121 251 AL
    ('AUD-8K0121251AJ',   259.95, NULL, NULL),  -- [set]  Radiator – 8K0 121 251 AJ
    ('AUD-8K0121251L',   259.95, NULL, NULL),  -- [set]  Radiator – 8K0 121 251 L
    ('AUD-8W0121251AA',   553.49, NULL, NULL),  -- [set]  Radiator – 8W0 121 251 AA

    -- ── suspension ──────────────────────────────────
    ('AUD-4F0413031AM',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 4F0 413 031 AM
    ('AUD-4F0513032AE',     0.00, NULL, NULL),  -- [--]   Rear Shock Absorber – 4F0 513 032 AE
    ('AUD-4K0413029H',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 4K0 413 029 H
    ('AUD-4K0413031AG',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 4K0 413 031 AG
    ('AUD-4M0513035AA',     0.00, NULL, NULL),  -- [--]   Rear Shock Absorber – 4M0 513 035 AA
    ('AUD-4M6413029E',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 4M6 413 029 E
    ('AUD-5Q0413031ES',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 5Q0 413 031 ES
    ('AUD-80A616039L',  1680.00, NULL, NULL),  -- [set]  Front Air Suspension Strut – 80A 616 039
    ('AUD-85E413031BF',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 85E 413 031 BF
    ('AUD-8F0413031P',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8F0 413 031 P
    ('AUD-8K0413029N',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8K0 413 029 N
    ('AUD-8K0413030N',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8K0 413 030 N
    ('AUD-8K0413031BA',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8K0 413 031 BA
    ('AUD-8V0413031AB',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8V0 413 031 AB
    ('AUD-8V0413031AC',     0.00, NULL, NULL),  -- [--]   Front Shock Absorber – 8V0 413 031 AC
    ('AUD-8W0412019C',     0.00, NULL, NULL),  -- [--]   Front Suspension Strut – 8W0 412 019 C
    ('AUD-8W6413031A',   850.00, NULL, NULL),  -- [set]  Front Shock Absorber – 8W6 413 031 A
    ('AUD-8W6413031G',   850.00, NULL, NULL),  -- [set]  Front Shock Absorber – 8W6 413 031 G
    ('AUD-8W6413031B',   850.00, NULL, NULL),  -- [set]  Front Shock Absorber – 8W6 413 031 B
    ('AUD-8W9413029C',   850.00, NULL, NULL),  -- [set]  Front Shock Absorber – 8W9 413 029 C

    -- ── timing ──────────────────────────────────────
    ('AUD-04E109119F',   196.00, NULL, NULL),  -- [set]  Timing Belt – 04E 109 119 F
    ('AUD-059109119F',     0.00, NULL, NULL),  -- [--]   Timing Belt – 059 109 119 F
    ('AUD-059109229K',   325.00, NULL, NULL),  -- [set]  Timing Chain – 059 109 229 K
    ('AUD-059109229M',   325.00, NULL, NULL),  -- [set]  Timing Chain – 059 109 229 M
    ('AUD-059109229AA',   325.00, NULL, NULL),  -- [set]  Timing Chain – 059 109 229 AA
    ('AUD-06B109119A',   104.11, NULL, NULL),  -- [set]  Timing Belt – 06B 109 119 A
    ('AUD-06D109119B',   112.93, NULL, NULL),  -- [set]  Timing Belt – 06D 109 119 B
    ('AUD-06E109465BL',   280.00, NULL, NULL),  -- [set]  Timing Chain – 06E 109 465 BL
    ('AUD-06E109465AQ',   280.00, NULL, NULL),  -- [set]  Timing Chain – 06E 109 465 AQ
    ('AUD-06E109465BB',   280.00, NULL, NULL),  -- [set]  Timing Chain – 06E 109 465 BB
    ('AUD-06E109465BD',   280.00, NULL, NULL),  -- [set]  Timing Chain – 06E 109 465 BD
    ('AUD-06K109158BG',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster / Chain Tensioner – 06
    ('AUD-06K109158BP',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster / Chain Tensioner – 06
    ('AUD-06K109158BJ',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster / Chain Tensioner – 06
    ('AUD-06M109229AC',     0.00, NULL, NULL),  -- [--]   Timing Chain – 06M 109 229 AC
    ('AUD-06Q109158',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster / Chain Tensioner – 06
    ('AUD-078109119J',    54.95, NULL, NULL),  -- [set]  Timing Belt – 078 109 119 J
    ('AUD-07K109158F',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster / Chain Tensioner – 07
    ('AUD-07K109231A',     0.00, NULL, NULL),  -- [--]   Timing Chain Tensioning Rail – 07K 109 2
    ('AUD-07K109231C',     0.00, NULL, NULL),  -- [--]   Timing Chain Tensioning Rail – 07K 109 2
    ('AUD-0P2109229L',     0.00, NULL, NULL),  -- [--]   Timing Chain – 0P2 109 229 L
    ('AUD-0P2109229F',     0.00, NULL, NULL),  -- [--]   Timing Chain – 0P2 109 229 F
    ('AUD-0P2109450J',     0.00, NULL, NULL),  -- [--]   Camshaft Adjuster (VVT) – 0P2 109 450 J

    -- ── transmission-filters ────────────────────────
    ('AUD-01M325429',     0.00, NULL, NULL),  -- [--]   Transmission Oil Filter – 01M 325 429
    ('AUD-0AT325429',     0.00, NULL, NULL),  -- [--]   Transmission Oil Filter – 0AT 325 429
    ('AUD-0B5325429E',   169.98, NULL, NULL),  -- [set]  Transmission Oil Filter – 0B5 325 429 E
    ('AUD-4F0317826B',     0.00, NULL, NULL)  -- [--]   Gearbox Oil Cooler / Filter – 4F0 317 82

  ) AS v(sku, price, cost, stock)
 WHERE p.sku = v.sku
   AND v.price::numeric > 0;   -- rows at 0.00 are ignored

COMMIT;


-- =============================================================================
-- VERIFY
--   SELECT count(*) FILTER (WHERE price > 0) AS priced,
--          count(*) FILTER (WHERE price = 0) AS on_request FROM parts;
--   SELECT sku, cost, price FROM parts WHERE cost IS NOT NULL AND price < cost;
--
-- DERIVE FROM COST INSTEAD (the better way round -- guarantees your margin):
--   UPDATE parts p
--      SET price = ROUND(p.cost * CASE b.tier
--                                   WHEN 'oem'         THEN 1.35
--                                   WHEN 'oe-supplier' THEN 1.55
--                                   WHEN 'aftermarket' THEN 1.75
--                                   ELSE 1.50 END, 2),
--          is_active = TRUE
--     FROM brands b
--    WHERE b.id = p.brand_id AND p.cost IS NOT NULL AND p.cost > 0;
-- =============================================================================
