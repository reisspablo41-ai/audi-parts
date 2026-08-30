-- =============================================================================
-- Wheels seed -- 20 parts. No repeats.
--
-- GROUPS
--   601 025  alloy wheel, standard fitment      (17 parts)
--   071 493 / 071 497  GENUINE ACCESSORIES wheel (2 parts) - dealer-fit option,
--            not standard equipment
--   ZAW 601 002  accessory felt pads for wheel storage totes (1 part)
--
-- PRICING. Wheels, unlike body panels, ARE priced publicly - but only for the
-- 8W0601025 family. Observed:
--     8W0601025DH  19"  $1,261.44   parts.audiusa.com
--     8W0601025AN  19"  $1,452.00   parts.audiusa.com
--     8W0601025FT  20"  $1,715.99   ECS Tuning
-- Anchor taken as $1,350.00 (mid of the 19" pair). Everything else is
-- MODELLED from it with a visible platform factor:
--
--     A3 / Q3 ................ 0.75
--     A4 / A5 / A6 / A7 ...... 1.00   (the anchor sits here)
--     Q7 / Q8 / e-tron ....... 1.15
--     R8 ..................... 1.45
--     accessory-line wheels .. 1.10
--
-- CAVEAT ON THE R8 WHEELS: the only figures found were USED ($495 front /
-- $650 rear, and a pre-owned 420601025AF at $340). New genuine will be well
-- above that, so those three rows are modelled and marked LOW.
--
-- WHEEL DIAMETER IS NOT ENCODED IN THE PART NUMBER and drives price heavily
-- ($1,261 for 19" vs $1,716 for 20" in the same family). Recorded as an
-- attribute you should fill in - it is the single biggest price lever here.
-- =============================================================================

BEGIN;

INSERT INTO brands (id, name, slug, tier)
VALUES ('genuine-audi', 'Genuine Audi', 'genuine-audi', 'oem')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parts (
  sku, name, slug, description, category_id, brand_id,
  oe_number, oe_normalised, oe_prefix, oe_group, oe_subgroup, oe_index,
  condition, price, core_charge, in_stock, stock_count,
  is_oversized, is_active, warranty_months
) VALUES
  -- [MED] 8W0 601 025 JJ  ·  Audi A4 (B9) / A5
  --   Family match: 8W0601025DH $1,261.44 and AN $1,452.00 (19") on parts.audiusa.com; FT (20") $1,715.99 at ECS. Anchor for every other wheel below.
  ('AUD-8W0601025JJ',
   'Alloy Wheel – 8W0 601 025 JJ',
   'audi-alloy-wheel-8w0601025jj',
   'Alloy Wheel for Audi A4 (B9) / A5. OE number 8W0 601 025 JJ. Main group 601 sub-group 025. Revision index JJ. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8W0 601 025 JJ', '8W0601025JJ', '8W0', '601', '025', 'JJ',
   'new', 1350.00, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [MED] 8W0 601 025 K  ·  Audi A4 (B9) / A5
  --   Same 8W0601025 family as JJ. Diameter unknown for this revision - verify.
  ('AUD-8W0601025K',
   'Alloy Wheel – 8W0 601 025 K',
   'audi-alloy-wheel-8w0601025k',
   'Alloy Wheel for Audi A4 (B9) / A5. OE number 8W0 601 025 K. Main group 601 sub-group 025. Revision index K. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8W0 601 025 K', '8W0601025K', '8W0', '601', '025', 'K',
   'new', 1350.00, 0, TRUE, 7,
   TRUE, TRUE, 24),

  -- [DERIVED] 4K0 601 025 AD  ·  Audi A6 / A7 (C8)
  --   modelled: anchor $1,350.00 x platform 1.00
  ('AUD-4K0601025AD',
   'Alloy Wheel – 4K0 601 025 AD',
   'audi-alloy-wheel-4k0601025ad',
   'Alloy Wheel for Audi A6 / A7 (C8). OE number 4K0 601 025 AD. Main group 601 sub-group 025. Revision index AD. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4K0 601 025 AD', '4K0601025AD', '4K0', '601', '025', 'AD',
   'new', 1350.00, 0, TRUE, 7,
   TRUE, TRUE, 24),

  -- [DERIVED] 8T0 601 025 DB  ·  Audi A5 (8T)
  --   modelled: anchor $1,350.00 x platform 1.00
  ('AUD-8T0601025DB',
   'Alloy Wheel – 8T0 601 025 DB',
   'audi-alloy-wheel-8t0601025db',
   'Alloy Wheel for Audi A5 (8T). OE number 8T0 601 025 DB. Main group 601 sub-group 025. Revision index DB. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8T0 601 025 DB', '8T0601025DB', '8T0', '601', '025', 'DB',
   'new', 1350.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [DERIVED] 8V0 601 025 AN  ·  Audi A3 (8V)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-8V0601025AN',
   'Alloy Wheel – 8V0 601 025 AN',
   'audi-alloy-wheel-8v0601025an',
   'Alloy Wheel for Audi A3 (8V). OE number 8V0 601 025 AN. Main group 601 sub-group 025. Revision index AN. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8V0 601 025 AN', '8V0601025AN', '8V0', '601', '025', 'AN',
   'new', 1012.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [DERIVED] 83H 601 025 AD  ·  Audi Q3 (F3)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-83H601025AD',
   'Alloy Wheel – 83H 601 025 AD',
   'audi-alloy-wheel-83h601025ad',
   'Alloy Wheel for Audi Q3 (F3). OE number 83H 601 025 AD. Main group 601 sub-group 025. Revision index AD. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '83H 601 025 AD', '83H601025AD', '83H', '601', '025', 'AD',
   'new', 1012.50, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [DERIVED] 85E 601 025 BA  ·  Audi Q3 (F3)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-85E601025BA',
   'Alloy Wheel – 85E 601 025 BA',
   'audi-alloy-wheel-85e601025ba',
   'Alloy Wheel for Audi Q3 (F3). OE number 85E 601 025 BA. Main group 601 sub-group 025. Revision index BA. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '85E 601 025 BA', '85E601025BA', '85E', '601', '025', 'BA',
   'new', 1012.50, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [DERIVED] 85H 601 025  ·  Audi Q3 Sportback (F3)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-85H601025',
   'Alloy Wheel – 85H 601 025',
   'audi-alloy-wheel-85h601025',
   'Alloy Wheel for Audi Q3 Sportback (F3). OE number 85H 601 025. Main group 601 sub-group 025. Revision index base. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '85H 601 025', '85H601025', '85H', '601', '025', NULL,
   'new', 1012.50, 0, TRUE, 8,
   TRUE, TRUE, 24),

  -- [DERIVED] 89A 601 025 AT  ·  Audi Q4 e-tron (89)
  --   EV platform - decide whether it belongs in this catalogue.
  ('AUD-89A601025AT',
   'Alloy Wheel – 89A 601 025 AT',
   'audi-alloy-wheel-89a601025at',
   'Alloy Wheel for Audi Q4 e-tron (89). OE number 89A 601 025 AT. Main group 601 sub-group 025. Revision index AT. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '89A 601 025 AT', '89A601025AT', '89A', '601', '025', 'AT',
   'new', 1552.50, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [LOW] 4S0 601 025 BR  ·  Audi R8 (Type 4S)
  --   Only observed figures were USED: $495 front / $650 rear (19"). New genuine will be materially higher - this is modelled, not observed.
  ('AUD-4S0601025BR',
   'Alloy Wheel – 4S0 601 025 BR',
   'audi-alloy-wheel-4s0601025br',
   'Alloy Wheel for Audi R8 (Type 4S). OE number 4S0 601 025 BR. Main group 601 sub-group 025. Revision index BR. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4S0 601 025 BR', '4S0601025BR', '4S0', '601', '025', 'BR',
   'new', 1957.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [LOW] 4S0 601 025 BL  ·  Audi R8 (Type 4S)
  --   Same caveat as BR - used-market figures only.
  ('AUD-4S0601025BL',
   'Alloy Wheel – 4S0 601 025 BL',
   'audi-alloy-wheel-4s0601025bl',
   'Alloy Wheel for Audi R8 (Type 4S). OE number 4S0 601 025 BL. Main group 601 sub-group 025. Revision index BL. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4S0 601 025 BL', '4S0601025BL', '4S0', '601', '025', 'BL',
   'new', 1957.50, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [LOW] 420 601 025 AD  ·  Audi R8 (Type 42)
  --   Only observed figure was a pre-owned 420601025AF at $340. Modelled, not observed.
  ('AUD-420601025AD',
   'Alloy Wheel – 420 601 025 AD',
   'audi-alloy-wheel-420601025ad',
   'Alloy Wheel for Audi R8 (Type 42). OE number 420 601 025 AD. Main group 601 sub-group 025. Revision index AD. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '420 601 025 AD', '420601025AD', '420', '601', '025', 'AD',
   'new', 1957.50, 0, TRUE, 8,
   TRUE, TRUE, 24),

  -- [LOW] 8MA 601 025 A  ·  UNIDENTIFIED (8MA)
  --   Prefix 8MA unresolved after four search rounds. BUT it now appears as both brake discs and wheels in this catalogue - two unrelated families sharing a prefix strongly suggests a REAL platform code we cannot name, not a supplier number. Priced at the mid factor.
  ('AUD-8MA601025A',
   'Alloy Wheel – 8MA 601 025 A',
   'audi-alloy-wheel-8ma601025a',
   'Alloy Wheel for UNIDENTIFIED (8MA). OE number 8MA 601 025 A. Main group 601 sub-group 025. Revision index A. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8MA 601 025 A', '8MA601025A', '8MA', '601', '025', 'A',
   'new', 1350.00, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [LOW] 8MA 601 025 H  ·  UNIDENTIFIED (8MA)
  --   See 8MA601025A.
  ('AUD-8MA601025H',
   'Alloy Wheel – 8MA 601 025 H',
   'audi-alloy-wheel-8ma601025h',
   'Alloy Wheel for UNIDENTIFIED (8MA). OE number 8MA 601 025 H. Main group 601 sub-group 025. Revision index H. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8MA 601 025 H', '8MA601025H', '8MA', '601', '025', 'H',
   'new', 1350.00, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [LOW] 4J3 601 025 CK  ·  UNIDENTIFIED (4J3)
  --   Prefix 4J3 unresolved.
  ('AUD-4J3601025CK',
   'Alloy Wheel – 4J3 601 025 CK',
   'audi-alloy-wheel-4j3601025ck',
   'Alloy Wheel for UNIDENTIFIED (4J3). OE number 4J3 601 025 CK. Main group 601 sub-group 025. Revision index CK. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4J3 601 025 CK', '4J3601025CK', '4J3', '601', '025', 'CK',
   'new', 1350.00, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [LOW] 4J3 601 025 DC  ·  UNIDENTIFIED (4J3)
  --   Prefix 4J3 unresolved.
  ('AUD-4J3601025DC',
   'Alloy Wheel – 4J3 601 025 DC',
   'audi-alloy-wheel-4j3601025dc',
   'Alloy Wheel for UNIDENTIFIED (4J3). OE number 4J3 601 025 DC. Main group 601 sub-group 025. Revision index DC. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4J3 601 025 DC', '4J3601025DC', '4J3', '601', '025', 'DC',
   'new', 1350.00, 0, TRUE, 8,
   TRUE, TRUE, 24),

  -- [LOW] 4P0 601 025 J  ·  UNIDENTIFIED (4P0)
  --   Prefix 4P0 unresolved.
  ('AUD-4P0601025J',
   'Alloy Wheel – 4P0 601 025 J',
   'audi-alloy-wheel-4p0601025j',
   'Alloy Wheel for UNIDENTIFIED (4P0). OE number 4P0 601 025 J. Main group 601 sub-group 025. Revision index J. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4P0 601 025 J', '4P0601025J', '4P0', '601', '025', 'J',
   'new', 1350.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [DERIVED] 4M8 071 493 AAX1  ·  Audi Q8 (4M8)
  --   Group 071 is the Genuine Accessories line, not standard fitment - a dealer-accessory wheel.
  ('AUD-4M8071493AAX1',
   'Accessory Alloy Wheel – 4M8 071 493 AAX1',
   'audi-accessory-alloy-wheel-4m8071493aax1',
   'Accessory Alloy Wheel for Audi Q8 (4M8). OE number 4M8 071 493 AAX1. Main group 071 sub-group 493. Revision index AAX1. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4M8 071 493 AAX1', '4M8071493AAX1', '4M8', '071', '493', 'AAX1',
   'new', 1552.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [DERIVED] 4K0 071 497 8Z8  ·  Audi A6 / A7 (C8)
  --   Group 071, Genuine Accessories line.
  ('AUD-4K00714978Z8',
   'Accessory Alloy Wheel – 4K0 071 497 8Z8',
   'audi-accessory-alloy-wheel-4k00714978z8',
   'Accessory Alloy Wheel for Audi A6 / A7 (C8). OE number 4K0 071 497 8Z8. Main group 071 sub-group 497. Revision index 8Z8. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4K0 071 497 8Z8', '4K00714978Z8', '4K0', '071', '497', '8Z8',
   'new', 1485.00, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [INDEP] ZAW 601 002  ·  Genuine Accessories (all models)
  --   ZAW is the Genuine Accessories line - a universal accessory, not a platform part. Felt protection pads for wheel/tyre storage totes. Independent figure.
  ('AUD-ZAW601002',
   'Wheel Tote Felt Pads – ZAW 601 002',
   'audi-wheel-tote-felt-pads-zaw601002',
   'Wheel Tote Felt Pads for Genuine Accessories (all models). OE number ZAW 601 002. Main group 601 sub-group 002. Revision index base. Universal accessory, not tied to a platform.',
   'wheel-accessories', 'genuine-audi',
   'ZAW 601 002', 'ZAW601002', 'ZAW', '601', '002', NULL,
   'new', 24.95, 0, TRUE, 34,
   FALSE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_oversized = EXCLUDED.is_oversized,
      is_active = EXCLUDED.is_active, updated_at = now();

-- Diameter is the biggest price lever on a wheel and is NOT in the part number.
INSERT INTO attribute_definitions (id, category_id, label, unit, data_type, is_filterable, sort_order)
VALUES ('wheel-diameter', 'alloy-wheels', 'Diameter', 'in', 'number', TRUE, 1)
ON CONFLICT (id) DO NOTHING;

COMMIT;
