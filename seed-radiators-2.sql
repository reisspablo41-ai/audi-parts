-- =============================================================================
-- Radiator / cooling seed, batch 2 -- 11 parts, priced and stocked.
--
-- 12 URLs were supplied; 8E0121251AJ is OMITTED because it is already in the
-- catalogue from seed-radiators.sql. Adding it again would be a no-op at best.
--
-- TWO OF THESE ARE NOT MAIN RADIATORS, despite every source URL saying
-- "audi-radiator":
--   4K0145804M   group 145 804 = CHARGE AIR COOLER (intercooler)
--   4E0121212B   sub-group 212 = AUXILIARY radiator (W12 applications)
--   4S0121212A   sub-group 212 = AUXILIARY radiator
-- They are named and filed accordingly. Selling an auxiliary radiator to
-- someone who needs the main one is a guaranteed return.
--
-- 6 of 11 carry a researched price; 5 are 0.00 and show "Price on request".
-- Stock uses the same deterministic SKU hash as set-stock.sql.
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
  -- [HIGH] 4F0 121 251 AF  ·  Audi A6 (C6)
  --   EXACT - Europa Parts (Nissens) list $350.00, promo $218.95. Also on parts.audiusa.com.
  ('AUD-4F0121251AF',
   'Radiator – 4F0 121 251 AF',
   'audi-radiator-4f0121251af',
   'Radiator for the Audi A6 (C6) platform, OE number 4F0 121 251 AF. Main group 121 sub-group 251 identifies this as a radiator. Revision index AF. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4F0 121 251 AF', '4F0121251AF', '4F0', '121', '251', 'AF',
   'new', 350.00, 0, TRUE, 10,
   TRUE, 24),

  -- [HIGH] 8K0 121 251 L  ·  Audi A4 (B8) / A5 / Q5
  --   EXACT - Europa Parts list $340.00, promo $259.95. ECS lists $211.99.
  ('AUD-8K0121251L',
   'Radiator – 8K0 121 251 L',
   'audi-radiator-8k0121251l',
   'Radiator for the Audi A4 (B8) / A5 / Q5 platform, OE number 8K0 121 251 L. Main group 121 sub-group 251 identifies this as a radiator. Revision index L. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8K0 121 251 L', '8K0121251L', '8K0', '121', '251', 'L',
   'new', 259.95, 0, TRUE, 5,
   TRUE, 24),

  -- [MED] 8W0 121 251 AA  ·  Audi A4 (B9) / A5 / allroad
  --   Family match (8W0121251AK) genuine $553.49 at NGP. eBay K variant $308.83.
  ('AUD-8W0121251AA',
   'Radiator – 8W0 121 251 AA',
   'audi-radiator-8w0121251aa',
   'Radiator for the Audi A4 (B9) / A5 / allroad platform, OE number 8W0 121 251 AA. Main group 121 sub-group 251 identifies this as a radiator. Revision index AA. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '8W0 121 251 AA', '8W0121251AA', '8W0', '121', '251', 'AA',
   'new', 553.49, 0, TRUE, 1,
   TRUE, 24),

  -- [MED] 1K0 121 251 CJ  ·  VW Group PQ35 (Golf V / A3 8P / TT)
  --   Family genuine (1K0121251AB) $316.99 at ECS. Aftermarket EH variant $179.95.
  ('AUD-1K0121251CJ',
   'Radiator – 1K0 121 251 CJ',
   'audi-radiator-1k0121251cj',
   'Radiator for the VW Group PQ35 (Golf V / A3 8P / TT) platform, OE number 1K0 121 251 CJ. Main group 121 sub-group 251 identifies this as a radiator. Revision index CJ. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '1K0 121 251 CJ', '1K0121251CJ', '1K0', '121', '251', 'CJ',
   'new', 316.99, 0, TRUE, 9,
   TRUE, 24),

  -- [MED] 1K0 121 251 AK  ·  VW Group PQ35 (Golf V / A3 8P / TT)
  --   Family genuine (1K0121251AB) $316.99 at ECS. Aftermarket EH variant $179.95.
  ('AUD-1K0121251AK',
   'Radiator – 1K0 121 251 AK',
   'audi-radiator-1k0121251ak',
   'Radiator for the VW Group PQ35 (Golf V / A3 8P / TT) platform, OE number 1K0 121 251 AK. Main group 121 sub-group 251 identifies this as a radiator. Revision index AK. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '1K0 121 251 AK', '1K0121251AK', '1K0', '121', '251', 'AK',
   'new', 316.99, 0, TRUE, 9,
   TRUE, 24),

  -- [LOW] 4K0 121 251 P  ·  Audi A6 / A7 (C8)
  --   No exact listing. A6 radiators average $158-317 across sellers. Midpoint used.
  ('AUD-4K0121251P',
   'Radiator – 4K0 121 251 P',
   'audi-radiator-4k0121251p',
   'Radiator for the Audi A6 / A7 (C8) platform, OE number 4K0 121 251 P. Main group 121 sub-group 251 identifies this as a radiator. Revision index P. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4K0 121 251 P', '4K0121251P', '4K0', '121', '251', 'P',
   'new', 240.00, 0, TRUE, 3,
   TRUE, 24),

  -- [NO DATA] 4H0 121 251 B  ·  Audi A8 (D4)
  --   Stocked by ECS, FCP Euro and parts.audiusa.com but no price retrievable. Fits 4.0T/4.2/6.3.
  ('AUD-4H0121251B',
   'Radiator – 4H0 121 251 B',
   'audi-radiator-4h0121251b',
   'Radiator for the Audi A8 (D4) platform, OE number 4H0 121 251 B. Main group 121 sub-group 251 identifies this as a radiator. Revision index B. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4H0 121 251 B', '4H0121251B', '4H0', '121', '251', 'B',
   'new', 0.00, 0, TRUE, 6,
   TRUE, 24),

  -- [NO DATA] 5Q0 121 251 GR  ·  VW Group MQB (Golf 7 / A3 8V)
  --   No public listing found for this revision.
  ('AUD-5Q0121251GR',
   'Radiator – 5Q0 121 251 GR',
   'audi-radiator-5q0121251gr',
   'Radiator for the VW Group MQB (Golf 7 / A3 8V) platform, OE number 5Q0 121 251 GR. Main group 121 sub-group 251 identifies this as a radiator. Revision index GR. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '5Q0 121 251 GR', '5Q0121251GR', '5Q0', '121', '251', 'GR',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 4K0 145 804 M  ·  Audi A6 / A7 (C8)
  --   No public listing found. NOTE: group 145 804 is a charge air cooler, NOT a radiator, despite the source URL.
  ('AUD-4K0145804M',
   'Charge Air Cooler – 4K0 145 804 M',
   'audi-charge-air-cooler-4k0145804m',
   'Charge Air Cooler for the Audi A6 / A7 (C8) platform, OE number 4K0 145 804 M. Main group 145 sub-group 804 identifies this as a charge air cooler. Revision index M. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'intercoolers', 'genuine-audi',
   '4K0 145 804 M', '4K0145804M', '4K0', '145', '804', 'M',
   'new', 0.00, 0, TRUE, 9,
   TRUE, 24),

  -- [NO DATA] 4E0 121 212 B  ·  Audi A8 (D3)
  --   No price found. Sub-group 212 is an AUXILIARY radiator - listings associate this number with the W12. Not the main radiator.
  ('AUD-4E0121212B',
   'Auxiliary Radiator – 4E0 121 212 B',
   'audi-auxiliary-radiator-4e0121212b',
   'Auxiliary Radiator for the Audi A8 (D3) platform, OE number 4E0 121 212 B. Main group 121 sub-group 212 identifies this as an auxiliary radiator. Revision index B. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4E0 121 212 B', '4E0121212B', '4E0', '121', '212', 'B',
   'new', 0.00, 0, TRUE, 5,
   TRUE, 24),

  -- [NO DATA] 4S0 121 212 A  ·  Audi R8 (Type 4S)
  --   No public listing found. Sub-group 212 is an AUXILIARY radiator, not the main one.
  ('AUD-4S0121212A',
   'Auxiliary Radiator – 4S0 121 212 A',
   'audi-auxiliary-radiator-4s0121212a',
   'Auxiliary Radiator for the Audi R8 (Type 4S) platform, OE number 4S0 121 212 A. Main group 121 sub-group 212 identifies this as an auxiliary radiator. Revision index A. Cooling capacity and mounting differ between engine variants on the same platform — confirm against your engine code before ordering.',
   'radiators', 'genuine-audi',
   '4S0 121 212 A', '4S0121212A', '4S0', '121', '212', 'A',
   'new', 0.00, 0, TRUE, 3,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price       = EXCLUDED.price,
      stock_count = EXCLUDED.stock_count,
      in_stock    = EXCLUDED.in_stock,
      is_active   = EXCLUDED.is_active,
      updated_at  = now();

COMMIT;

-- VERIFY
--   SELECT sku, category_id, oe_subgroup, price, stock_count FROM parts
--    WHERE category_id IN ('radiators','intercoolers') ORDER BY oe_subgroup, price DESC;
