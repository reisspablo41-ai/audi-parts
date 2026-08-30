-- =============================================================================
-- Suspension seed -- 20 shock absorbers and struts.
--
-- 25 URLs were supplied; 5 were repeats (4M0513035AA, 85E413031BF, 8K0413031BA,
-- 8W6413031B, 8W6413031G each appeared twice). 20 unique parts remain.
--
-- COMPONENT DECODED FROM THE PART NUMBER, NOT THE URL:
--   413 029/030/031 = FRONT shock absorber      (16 parts)
--   513 032/035     = REAR shock absorber       (2 parts)
--   412 019         = complete FRONT STRUT assembly, not a bare damper
--   616 039         = AIR suspension strut - a different component entirely,
--                     and an order of magnitude more expensive
--
-- PRICING IS THIN HERE. Only 5 of 20 carry a price, and only one of those is
-- better than LOW confidence. Shock absorber pricing is largely hidden behind
-- vehicle selectors on the retailers that stock it, so public search returns
-- shipping costs and used-part listings rather than new-part prices. The other
-- 15 are 0.00 and show "Price on request".
--
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
  -- [MED] 80A 616 039 L  ·  Audi Q5 / SQ5 (FY)
  --   EXACT number on parts.audiusa.com. Family 80A616039K lists $1680.00 at Europa Parts (sale $1270.95); Aerosus EUR 849. NOTE: group 616 039 is an AIR suspension strut, not a conventional damper.
  ('AUD-80A616039L',
   'Front Air Suspension Strut – 80A 616 039 L',
   'audi-front-air-suspension-strut-80a616039l',
   'Front Air Suspension Strut for the Audi Q5 / SQ5 (FY) platform, OE number 80A 616 039 L. Main group 616 sub-group 039 identifies this as a front front air suspension strut. Revision index L. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '80A 616 039 L', '80A616039L', '80A', '616', '039', 'L',
   'new', 1680.00, 0, TRUE, 3,
   TRUE, 24),

  -- [LOW] 8W6 413 031 A  ·  Audi A4 Avant (B9)
  --   No exact listing. Genuine B9 front damper 8W0413029M seen at ~$908; Aerosus aftermarket $279. Wide spread - verify.
  ('AUD-8W6413031A',
   'Front Shock Absorber – 8W6 413 031 A',
   'audi-front-shock-absorber-8w6413031a',
   'Front Shock Absorber for the Audi A4 Avant (B9) platform, OE number 8W6 413 031 A. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index A. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8W6 413 031 A', '8W6413031A', '8W6', '413', '031', 'A',
   'new', 850.00, 0, TRUE, 4,
   TRUE, 24),

  -- [LOW] 8W6 413 031 B  ·  Audi A4 Avant (B9)
  --   Priced off the B9 front damper family. Verify.
  ('AUD-8W6413031B',
   'Front Shock Absorber – 8W6 413 031 B',
   'audi-front-shock-absorber-8w6413031b',
   'Front Shock Absorber for the Audi A4 Avant (B9) platform, OE number 8W6 413 031 B. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index B. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8W6 413 031 B', '8W6413031B', '8W6', '413', '031', 'B',
   'new', 850.00, 0, TRUE, 4,
   TRUE, 24),

  -- [LOW] 8W6 413 031 G  ·  Audi A4 Avant (B9)
  --   Priced off the B9 front damper family. Verify.
  ('AUD-8W6413031G',
   'Front Shock Absorber – 8W6 413 031 G',
   'audi-front-shock-absorber-8w6413031g',
   'Front Shock Absorber for the Audi A4 Avant (B9) platform, OE number 8W6 413 031 G. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index G. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8W6 413 031 G', '8W6413031G', '8W6', '413', '031', 'G',
   'new', 850.00, 0, TRUE, 4,
   TRUE, 24),

  -- [LOW] 8W9 413 029 C  ·  Audi A4 allroad (B9)
  --   Priced off the B9 front damper family. Verify.
  ('AUD-8W9413029C',
   'Front Shock Absorber – 8W9 413 029 C',
   'audi-front-shock-absorber-8w9413029c',
   'Front Shock Absorber for the Audi A4 allroad (B9) platform, OE number 8W9 413 029 C. Main group 413 sub-group 029 identifies this as a front front shock absorber. Revision index C. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8W9 413 029 C', '8W9413029C', '8W9', '413', '029', 'C',
   'new', 850.00, 0, TRUE, 3,
   TRUE, 24),

  -- [NO DATA] 8W0 412 019 C  ·  Audi A4 (B9)
  --   Group 412 019 is a COMPLETE STRUT ASSEMBLY, not a bare damper. No listing found.
  ('AUD-8W0412019C',
   'Front Suspension Strut – 8W0 412 019 C',
   'audi-front-suspension-strut-8w0412019c',
   'Front Suspension Strut for the Audi A4 (B9) platform, OE number 8W0 412 019 C. Main group 412 sub-group 019 identifies this as a front front suspension strut. Revision index C. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8W0 412 019 C', '8W0412019C', '8W0', '412', '019', 'C',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 8K0 413 029 N  ·  Audi A4 (B8)
  --   Only datapoint was a USED part at ~GBP 558 - not a basis for a new-part price.
  ('AUD-8K0413029N',
   'Front Shock Absorber – 8K0 413 029 N',
   'audi-front-shock-absorber-8k0413029n',
   'Front Shock Absorber for the Audi A4 (B8) platform, OE number 8K0 413 029 N. Main group 413 sub-group 029 identifies this as a front front shock absorber. Revision index N. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8K0 413 029 N', '8K0413029N', '8K0', '413', '029', 'N',
   'new', 0.00, 0, TRUE, 5,
   TRUE, 24),

  -- [NO DATA] 8K0 413 030 N  ·  Audi A4 (B8)
  --   Only datapoint was a USED part - not a basis for a new-part price.
  ('AUD-8K0413030N',
   'Front Shock Absorber – 8K0 413 030 N',
   'audi-front-shock-absorber-8k0413030n',
   'Front Shock Absorber for the Audi A4 (B8) platform, OE number 8K0 413 030 N. Main group 413 sub-group 030 identifies this as a front front shock absorber. Revision index N. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8K0 413 030 N', '8K0413030N', '8K0', '413', '030', 'N',
   'new', 0.00, 0, TRUE, 4,
   TRUE, 24),

  -- [NO DATA] 8K0 413 031 BA  ·  Audi A4 (B8)
  --   FCP Euro stocks this exact number but no price was retrievable.
  ('AUD-8K0413031BA',
   'Front Shock Absorber – 8K0 413 031 BA',
   'audi-front-shock-absorber-8k0413031ba',
   'Front Shock Absorber for the Audi A4 (B8) platform, OE number 8K0 413 031 BA. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index BA. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8K0 413 031 BA', '8K0413031BA', '8K0', '413', '031', 'BA',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 8V0 413 031 AB  ·  Audi A3 (8V)
  --   No listing found.
  ('AUD-8V0413031AB',
   'Front Shock Absorber – 8V0 413 031 AB',
   'audi-front-shock-absorber-8v0413031ab',
   'Front Shock Absorber for the Audi A3 (8V) platform, OE number 8V0 413 031 AB. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index AB. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8V0 413 031 AB', '8V0413031AB', '8V0', '413', '031', 'AB',
   'new', 0.00, 0, TRUE, 5,
   TRUE, 24),

  -- [NO DATA] 8V0 413 031 AC  ·  Audi A3 (8V)
  --   No listing found.
  ('AUD-8V0413031AC',
   'Front Shock Absorber – 8V0 413 031 AC',
   'audi-front-shock-absorber-8v0413031ac',
   'Front Shock Absorber for the Audi A3 (8V) platform, OE number 8V0 413 031 AC. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index AC. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8V0 413 031 AC', '8V0413031AC', '8V0', '413', '031', 'AC',
   'new', 0.00, 0, TRUE, 8,
   TRUE, 24),

  -- [NO DATA] 5Q0 413 031 ES  ·  VW Group MQB (Golf 7 / A3 8V)
  --   No listing found for this revision.
  ('AUD-5Q0413031ES',
   'Front Shock Absorber – 5Q0 413 031 ES',
   'audi-front-shock-absorber-5q0413031es',
   'Front Shock Absorber for the VW Group MQB (Golf 7 / A3 8V) platform, OE number 5Q0 413 031 ES. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index ES. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '5Q0 413 031 ES', '5Q0413031ES', '5Q0', '413', '031', 'ES',
   'new', 0.00, 0, TRUE, 9,
   TRUE, 24),

  -- [NO DATA] 4M6 413 029 E  ·  Audi Q7 (4M)
  --   No listing found.
  ('AUD-4M6413029E',
   'Front Shock Absorber – 4M6 413 029 E',
   'audi-front-shock-absorber-4m6413029e',
   'Front Shock Absorber for the Audi Q7 (4M) platform, OE number 4M6 413 029 E. Main group 413 sub-group 029 identifies this as a front front shock absorber. Revision index E. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4M6 413 029 E', '4M6413029E', '4M6', '413', '029', 'E',
   'new', 0.00, 0, TRUE, 7,
   TRUE, 24),

  -- [NO DATA] 4K0 413 029 H  ·  Audi A6 / A7 (C8)
  --   No listing found.
  ('AUD-4K0413029H',
   'Front Shock Absorber – 4K0 413 029 H',
   'audi-front-shock-absorber-4k0413029h',
   'Front Shock Absorber for the Audi A6 / A7 (C8) platform, OE number 4K0 413 029 H. Main group 413 sub-group 029 identifies this as a front front shock absorber. Revision index H. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4K0 413 029 H', '4K0413029H', '4K0', '413', '029', 'H',
   'new', 0.00, 0, TRUE, 11,
   TRUE, 24),

  -- [NO DATA] 4K0 413 031 AG  ·  Audi A6 / A7 (C8)
  --   No listing found.
  ('AUD-4K0413031AG',
   'Front Shock Absorber – 4K0 413 031 AG',
   'audi-front-shock-absorber-4k0413031ag',
   'Front Shock Absorber for the Audi A6 / A7 (C8) platform, OE number 4K0 413 031 AG. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index AG. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4K0 413 031 AG', '4K0413031AG', '4K0', '413', '031', 'AG',
   'new', 0.00, 0, TRUE, 11,
   TRUE, 24),

  -- [NO DATA] 4F0 413 031 AM  ·  Audi A6 (C6)
  --   No listing found.
  ('AUD-4F0413031AM',
   'Front Shock Absorber – 4F0 413 031 AM',
   'audi-front-shock-absorber-4f0413031am',
   'Front Shock Absorber for the Audi A6 (C6) platform, OE number 4F0 413 031 AM. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index AM. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4F0 413 031 AM', '4F0413031AM', '4F0', '413', '031', 'AM',
   'new', 0.00, 0, TRUE, 10,
   TRUE, 24),

  -- [NO DATA] 4F0 513 032 AE  ·  Audi A6 (C6)
  --   Group 513 = REAR axle. No listing found.
  ('AUD-4F0513032AE',
   'Rear Shock Absorber – 4F0 513 032 AE',
   'audi-rear-shock-absorber-4f0513032ae',
   'Rear Shock Absorber for the Audi A6 (C6) platform, OE number 4F0 513 032 AE. Main group 513 sub-group 032 identifies this as a rear rear shock absorber. Revision index AE. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4F0 513 032 AE', '4F0513032AE', '4F0', '513', '032', 'AE',
   'new', 0.00, 0, TRUE, 8,
   TRUE, 24),

  -- [NO DATA] 4M0 513 035 AA  ·  Audi Q7 (4M)
  --   Group 513 = REAR axle. No listing found.
  ('AUD-4M0513035AA',
   'Rear Shock Absorber – 4M0 513 035 AA',
   'audi-rear-shock-absorber-4m0513035aa',
   'Rear Shock Absorber for the Audi Q7 (4M) platform, OE number 4M0 513 035 AA. Main group 513 sub-group 035 identifies this as a rear rear shock absorber. Revision index AA. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '4M0 513 035 AA', '4M0513035AA', '4M0', '513', '035', 'AA',
   'new', 0.00, 0, TRUE, 9,
   TRUE, 24),

  -- [NO DATA] 8F0 413 031 P  ·  Audi A5 Cabriolet (8F)
  --   No listing found. Prefix 8F identified with medium confidence only.
  ('AUD-8F0413031P',
   'Front Shock Absorber – 8F0 413 031 P',
   'audi-front-shock-absorber-8f0413031p',
   'Front Shock Absorber for the Audi A5 Cabriolet (8F) platform, OE number 8F0 413 031 P. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index P. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '8F0 413 031 P', '8F0413031P', '8F0', '413', '031', 'P',
   'new', 0.00, 0, TRUE, 6,
   TRUE, 24),

  -- [NO DATA] 85E 413 031 BF  ·  Audi Q3 (F3)
  --   No listing found. Prefix 85E identified with medium confidence only.
  ('AUD-85E413031BF',
   'Front Shock Absorber – 85E 413 031 BF',
   'audi-front-shock-absorber-85e413031bf',
   'Front Shock Absorber for the Audi Q3 (F3) platform, OE number 85E 413 031 BF. Main group 413 sub-group 031 identifies this as a front front shock absorber. Revision index BF. Dampers should be replaced in axle pairs — order two. Confirm whether your car has standard, sport, or adaptive damping before ordering, as they are not interchangeable.',
   'suspension', 'genuine-audi',
   '85E 413 031 BF', '85E413031BF', '85E', '413', '031', 'BF',
   'new', 0.00, 0, TRUE, 11,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price       = EXCLUDED.price,
      stock_count = EXCLUDED.stock_count,
      in_stock    = EXCLUDED.in_stock,
      is_active   = EXCLUDED.is_active,
      updated_at  = now();

COMMIT;

-- VERIFY
--   SELECT oe_group, oe_subgroup, count(*), max(price) FROM parts
--    WHERE category_id = 'suspension' GROUP BY 1,2 ORDER BY 1,2;
