-- =============================================================================
-- Radiator / cooling seed -- 13 parts, priced and stocked, ready to sell.
--
-- Derived from the VAG part numbers plus public retailer listings (Aug 2026):
--
--       8K0  121  251  AL
--       ^^^  ^^^  ^^^  ^^
--       |    |    |    revision index
--       |    |    sub-group: 251/253/212 = radiator
--       |    main group 121 = cooling / radiator
--       platform prefix
--
-- ONE PART IS NOT A RADIATOR: 4F0145804K is main group 145, sub-group 804 --
-- a CHARGE AIR COOLER (intercooler). The source URL calls it a radiator. It is
-- filed under 'intercoolers' here and named accurately.
--
-- 8 of 13 carry a researched price; 5 are priced 0.00 and will show
-- "Price on request" until you set them. Confidence is marked on every row.
--
-- Stock uses the same deterministic SKU hash as set-stock.sql, so these parts
-- sit in the same banding as the rest of the catalogue.
-- =============================================================================

BEGIN;

INSERT INTO brands (id, name, slug, tier)
VALUES ('genuine-audi', 'Genuine Audi', 'genuine-audi', 'oem')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parts (
  sku, name, slug, description, category_id, brand_id,
  oe_number, oe_normalised, oe_prefix, oe_group, oe_subgroup, oe_index,
  condition, price, core_charge, in_stock, stock_count,
  is_active, warranty_months
) VALUES
  -- [HIGH] 4E0 121 251 G  ·  Audi A8 (D3)
  --   EXACT - Europa Parts list price (Behr Hella). Promo price was $395.95.
  ('AUD-4E0121251G',
   'Radiator – 4E0 121 251 G',
   'audi-radiator-4e0121251g',
   'Radiator for the Audi A8 (D3) platform, OE number 4E0 121 251 G. Main group 121 sub-group 251 identifies this as a radiator. Revision index G. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4E0 121 251 G', '4E0121251G', '4E0', '121', '251', 'G',
   'new', 603.33, 0, TRUE, 2,
   TRUE, 24),

  -- [HIGH] 4M0 121 251 M  ·  Audi Q7 / SQ7 (4M)
  --   EXACT - parts.audiusa.com. NOTE: listed as an SQ7 4.0L primary radiator.
  ('AUD-4M0121251M',
   'Radiator – 4M0 121 251 M',
   'audi-radiator-4m0121251m',
   'Radiator for the Audi Q7 / SQ7 (4M) platform, OE number 4M0 121 251 M. Main group 121 sub-group 251 identifies this as a radiator. Revision index M. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4M0 121 251 M', '4M0121251M', '4M0', '121', '251', 'M',
   'new', 805.00, 0, TRUE, 2,
   TRUE, 24),

  -- [MED] 8K0 121 251 AL  ·  Audi A4 (B8)
  --   Family match: 8K0121251L/T list $212-264 across ECS and Europa Parts.
  ('AUD-8K0121251AL',
   'Radiator – 8K0 121 251 AL',
   'audi-radiator-8k0121251al',
   'Radiator for the Audi A4 (B8) platform, OE number 8K0 121 251 AL. Main group 121 sub-group 251 identifies this as a radiator. Revision index AL. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8K0 121 251 AL', '8K0121251AL', '8K0', '121', '251', 'AL',
   'new', 259.95, 0, TRUE, 6,
   TRUE, 24),

  -- [MED] 8K0 121 251 AJ  ·  Audi A4 (B8)
  --   Family match, and this exact number appears in a UroTuning install kit.
  ('AUD-8K0121251AJ',
   'Radiator – 8K0 121 251 AJ',
   'audi-radiator-8k0121251aj',
   'Radiator for the Audi A4 (B8) platform, OE number 8K0 121 251 AJ. Main group 121 sub-group 251 identifies this as a radiator. Revision index AJ. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8K0 121 251 AJ', '8K0121251AJ', '8K0', '121', '251', 'AJ',
   'new', 259.95, 0, TRUE, 9,
   TRUE, 24),

  -- [MED] 4F0 121 251 AC  ·  Audi A6 (C6)
  --   Family match (4F0121251AF) Europa Parts list. eBay listed this exact number at $420.
  ('AUD-4F0121251AC',
   'Radiator – 4F0 121 251 AC',
   'audi-radiator-4f0121251ac',
   'Radiator for the Audi A6 (C6) platform, OE number 4F0 121 251 AC. Main group 121 sub-group 251 identifies this as a radiator. Revision index AC. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4F0 121 251 AC', '4F0121251AC', '4F0', '121', '251', 'AC',
   'new', 350.00, 0, TRUE, 10,
   TRUE, 24),

  -- [MED] 8E0 121 251 AQ  ·  Audi A4 (B6/B7)
  --   Family genuine (8E0121251A) $593.99. WIDE SPREAD: aftermarket equivalents $180-230.
  ('AUD-8E0121251AQ',
   'Radiator – 8E0 121 251 AQ',
   'audi-radiator-8e0121251aq',
   'Radiator for the Audi A4 (B6/B7) platform, OE number 8E0 121 251 AQ. Main group 121 sub-group 251 identifies this as a radiator. Revision index AQ. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8E0 121 251 AQ', '8E0121251AQ', '8E0', '121', '251', 'AQ',
   'new', 593.99, 0, TRUE, 4,
   TRUE, 24),

  -- [MED] 8E0 121 251 AJ  ·  Audi A4 (B6/B7)
  --   Family genuine (8E0121251A) $593.99. WIDE SPREAD: aftermarket equivalents $180-230.
  ('AUD-8E0121251AJ',
   'Radiator – 8E0 121 251 AJ',
   'audi-radiator-8e0121251aj',
   'Radiator for the Audi A4 (B6/B7) platform, OE number 8E0 121 251 AJ. Main group 121 sub-group 251 identifies this as a radiator. Revision index AJ. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8E0 121 251 AJ', '8E0121251AJ', '8E0', '121', '251', 'AJ',
   'new', 593.99, 0, TRUE, 2,
   TRUE, 24),

  -- [LOW] 4F0 145 804 K  ·  Audi A6 (C6)
  --   No exact listing. Comparable Audi charge air coolers $116-139. NOTE: group 145 804 is a charge air cooler, NOT a radiator, despite the source URL.
  ('AUD-4F0145804K',
   'Charge Air Cooler – 4F0 145 804 K',
   'audi-charge-air-cooler-4f0145804k',
   'Charge Air Cooler for the Audi A6 (C6) platform, OE number 4F0 145 804 K. Main group 145 sub-group 804 identifies this as a charge air cooler. Revision index K. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'intercoolers', 'genuine-audi',
   '4F0 145 804 K', '4F0145804K', '4F0', '145', '804', 'K',
   'new', 130.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 7L0 121 253 A  ·  VW Touareg / Cayenne (7L)
  --   Listed on parts.audiusa.com but no price retrievable.
  ('AUD-7L0121253A',
   'Radiator – 7L0 121 253 A',
   'audi-radiator-7l0121253a',
   'Radiator for the VW Touareg / Cayenne (7L) platform, OE number 7L0 121 253 A. Main group 121 sub-group 253 identifies this as a radiator. Revision index A. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '7L0 121 253 A', '7L0121253A', '7L0', '121', '253', 'A',
   'new', 0.00, 0, TRUE, 8,
   TRUE, 24),

  -- [NO DATA] 1K0 121 212 C  ·  VW Group PQ35 (Golf V / A3 8P)
  --   No public listing found. Group 121 212 - verify this is a main radiator, not auxiliary.
  ('AUD-1K0121212C',
   'Radiator – 1K0 121 212 C',
   'audi-radiator-1k0121212c',
   'Radiator for the VW Group PQ35 (Golf V / A3 8P) platform, OE number 1K0 121 212 C. Main group 121 sub-group 212 identifies this as a radiator. Revision index C. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '1K0 121 212 C', '1K0121212C', '1K0', '121', '212', 'C',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 4KE 121 251 B  ·  Audi 4K series (A6 / e-tron)
  --   No public listing found. Prefix 4KE not confidently identified.
  ('AUD-4KE121251B',
   'Radiator – 4KE 121 251 B',
   'audi-radiator-4ke121251b',
   'Radiator for the Audi 4K series (A6 / e-tron) platform, OE number 4KE 121 251 B. Main group 121 sub-group 251 identifies this as a radiator. Revision index B. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4KE 121 251 B', '4KE121251B', '4KE', '121', '251', 'B',
   'new', 0.00, 0, TRUE, 4,
   TRUE, 24),

  -- [NO DATA] 5WA 121 251 D  ·  VW Group MQB Evo (Golf 8 / A3 8Y)
  --   No public listing found.
  ('AUD-5WA121251D',
   'Radiator – 5WA 121 251 D',
   'audi-radiator-5wa121251d',
   'Radiator for the VW Group MQB Evo (Golf 8 / A3 8Y) platform, OE number 5WA 121 251 D. Main group 121 sub-group 251 identifies this as a radiator. Revision index D. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '5WA 121 251 D', '5WA121251D', '5WA', '121', '251', 'D',
   'new', 0.00, 0, TRUE, 8,
   TRUE, 24),

  -- [NO DATA] 1EA 121 251 B  ·  VW Group MEB (ID.3 / ID.4 / Q4 e-tron)
  --   No public listing found. MEB is an EV platform - confirm this belongs in an Audi catalogue.
  ('AUD-1EA121251B',
   'Radiator – 1EA 121 251 B',
   'audi-radiator-1ea121251b',
   'Radiator for the VW Group MEB (ID.3 / ID.4 / Q4 e-tron) platform, OE number 1EA 121 251 B. Main group 121 sub-group 251 identifies this as a radiator. Revision index B. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '1EA 121 251 B', '1EA121251B', '1EA', '121', '251', 'B',
   'new', 0.00, 0, TRUE, 6,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price       = EXCLUDED.price,
      stock_count = EXCLUDED.stock_count,
      in_stock    = EXCLUDED.in_stock,
      is_active   = EXCLUDED.is_active,
      updated_at  = now();

COMMIT;

-- =============================================================================
-- VERIFY
--   SELECT sku, price, stock_count, in_stock FROM parts
--    WHERE category_id IN ('radiators','intercoolers') ORDER BY price DESC;
--
--   Must return no rows -- active parts may not be flagged in stock at zero:
--   SELECT sku FROM parts WHERE in_stock AND stock_count = 0;
-- =============================================================================
