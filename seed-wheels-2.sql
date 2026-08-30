-- =============================================================================
-- Wheels seed, batch 2 -- 13 parts. No repeats, none already in the catalogue.
--
-- Same model as seed-wheels.sql: anchor $1,350.00 (the observed 19"
-- 8W0601025 family average) x platform factor.
--   A3 / Q3 0.75 · A4-A7 1.00 · Q7 / Q8 / e-tron 1.15 · R8 1.45 · accessory 1.10
--
-- 4 of 13 are group 071 GENUINE ACCESSORIES wheels - dealer-fit options rather
-- than standard equipment.
--
-- TWO OBSERVED FIGURES WERE REJECTED, deliberately:
--   420601025AF  seen pre-owned at $340 (scratched). A used figure is not a
--                basis for pricing a new part.
--   8Y0601025    UK listings GBP 900-3,200, but those are SETS OF FOUR and the
--                anchor is per-wheel. Not comparable.
--
-- DIAMETER still unrecorded and still the biggest price lever (19" $1,261 vs
-- 20" $1,716 within one family). Fill in wheel-diameter when you know it.
--
-- ON 8MA: it now spans brake discs, wheels AND accessory wheels here - three
-- unrelated component families. That is strong evidence of a real platform code
-- we cannot name, rather than a bad number.
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
  -- [DERIVED] 89A 601 025 AE  ·  Audi Q4 e-tron (89)
  --   modelled: anchor $1,350.00 x platform 1.15
  ('AUD-89A601025AE',
   'Alloy Wheel – 89A 601 025 AE',
   'audi-alloy-wheel-89a601025ae',
   'Alloy Wheel for Audi Q4 e-tron (89). OE number 89A 601 025 AE. Main group 601 sub-group 025. Revision index AE. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '89A 601 025 AE', '89A601025AE', '89A', '601', '025', 'AE',
   'new', 1552.50, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [DERIVED] 89A 601 025 AK  ·  Audi Q4 e-tron (89)
  --   modelled: anchor $1,350.00 x platform 1.15
  ('AUD-89A601025AK',
   'Alloy Wheel – 89A 601 025 AK',
   'audi-alloy-wheel-89a601025ak',
   'Alloy Wheel for Audi Q4 e-tron (89). OE number 89A 601 025 AK. Main group 601 sub-group 025. Revision index AK. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '89A 601 025 AK', '89A601025AK', '89A', '601', '025', 'AK',
   'new', 1552.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [LOW] 4S0 601 025 BK  ·  Audi R8 (Type 4S)
  --   R8 wheels: only used-market figures found ($495 front / $650 rear). Modelled.
  ('AUD-4S0601025BK',
   'Alloy Wheel – 4S0 601 025 BK',
   'audi-alloy-wheel-4s0601025bk',
   'Alloy Wheel for Audi R8 (Type 4S). OE number 4S0 601 025 BK. Main group 601 sub-group 025. Revision index BK. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4S0 601 025 BK', '4S0601025BK', '4S0', '601', '025', 'BK',
   'new', 1957.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [LOW] 420 601 025 AF  ·  Audi R8 (Type 42)
  --   This EXACT number was seen pre-owned at $340 (scratched). That is a used figure and NOT a basis for a new-part price - the modelled figure is used instead. Worth a dealer quote.
  ('AUD-420601025AF',
   'Alloy Wheel – 420 601 025 AF',
   'audi-alloy-wheel-420601025af',
   'Alloy Wheel for Audi R8 (Type 42). OE number 420 601 025 AF. Main group 601 sub-group 025. Revision index AF. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '420 601 025 AF', '420601025AF', '420', '601', '025', 'AF',
   'new', 1957.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [DERIVED] 83H 601 025 E  ·  Audi Q3 (F3)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-83H601025E',
   'Alloy Wheel – 83H 601 025 E',
   'audi-alloy-wheel-83h601025e',
   'Alloy Wheel for Audi Q3 (F3). OE number 83H 601 025 E. Main group 601 sub-group 025. Revision index E. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '83H 601 025 E', '83H601025E', '83H', '601', '025', 'E',
   'new', 1012.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [DERIVED] 85E 601 025 AT  ·  Audi Q3 (F3)
  --   modelled: anchor $1,350.00 x platform 0.75
  ('AUD-85E601025AT',
   'Alloy Wheel – 85E 601 025 AT',
   'audi-alloy-wheel-85e601025at',
   'Alloy Wheel for Audi Q3 (F3). OE number 85E 601 025 AT. Main group 601 sub-group 025. Revision index AT. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '85E 601 025 AT', '85E601025AT', '85E', '601', '025', 'AT',
   'new', 1012.50, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [LOW] 8Y0 601 025 F  ·  Audi A3 (8Y)
  --   UK listings for this family run GBP 900-3,200 but appear to be SETS OF FOUR, not each - not comparable to the US per-wheel anchor, so not used.
  ('AUD-8Y0601025F',
   'Alloy Wheel – 8Y0 601 025 F',
   'audi-alloy-wheel-8y0601025f',
   'Alloy Wheel for Audi A3 (8Y). OE number 8Y0 601 025 F. Main group 601 sub-group 025. Revision index F. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8Y0 601 025 F', '8Y0601025F', '8Y0', '601', '025', 'F',
   'new', 1012.50, 0, TRUE, 5,
   TRUE, TRUE, 24),

  -- [LOW] 8B3 601 025 M  ·  Audi A5 (8B, 2025+) - unconfirmed
  --   Prefix 8B3 unresolved. Also appeared as an air filter (8B3133844B) in this catalogue.
  ('AUD-8B3601025M',
   'Alloy Wheel – 8B3 601 025 M',
   'audi-alloy-wheel-8b3601025m',
   'Alloy Wheel for Audi A5 (8B, 2025+) - unconfirmed. OE number 8B3 601 025 M. Main group 601 sub-group 025. Revision index M. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8B3 601 025 M', '8B3601025M', '8B3', '601', '025', 'M',
   'new', 1350.00, 0, TRUE, 8,
   TRUE, TRUE, 24),

  -- [DERIVED] 4K8 601 025 AR  ·  Audi A7 (C8) - unconfirmed
  --   Prefix 4K8 read as the A7 C8 Sportback, sibling to the confirmed 4K0 A6.
  ('AUD-4K8601025AR',
   'Alloy Wheel – 4K8 601 025 AR',
   'audi-alloy-wheel-4k8601025ar',
   'Alloy Wheel for Audi A7 (C8) - unconfirmed. OE number 4K8 601 025 AR. Main group 601 sub-group 025. Revision index AR. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '4K8 601 025 AR', '4K8601025AR', '4K8', '601', '025', 'AR',
   'new', 1350.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [LOW] 8MA 601 025 E  ·  UNIDENTIFIED (8MA)
  --   8MA now spans brake discs, wheels AND accessory wheels in this catalogue - three unrelated families. Almost certainly a real platform code we cannot name.
  ('AUD-8MA601025E',
   'Alloy Wheel – 8MA 601 025 E',
   'audi-alloy-wheel-8ma601025e',
   'Alloy Wheel for UNIDENTIFIED (8MA). OE number 8MA 601 025 E. Main group 601 sub-group 025. Revision index E. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering.',
   'alloy-wheels', 'genuine-audi',
   '8MA 601 025 E', '8MA601025E', '8MA', '601', '025', 'E',
   'new', 1350.00, 0, TRUE, 6,
   TRUE, TRUE, 24),

  -- [DERIVED] 8W0 071 497 8Z8  ·  Audi A4 (B9) / A5
  --   Group 071 is the Genuine Accessories line - a dealer-fit option, not standard equipment.
  ('AUD-8W00714978Z8',
   'Accessory Alloy Wheel – 8W0 071 497 8Z8',
   'audi-accessory-alloy-wheel-8w00714978z8',
   'Accessory Alloy Wheel for Audi A4 (B9) / A5. OE number 8W0 071 497 8Z8. Main group 071 sub-group 497. Revision index 8Z8. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering. Group 071 is the Genuine Accessories line — a dealer-fit option, not standard equipment.',
   'alloy-wheels', 'genuine-audi',
   '8W0 071 497 8Z8', '8W00714978Z8', '8W0', '071', '497', '8Z8',
   'new', 1485.00, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [LOW] 8MA 071 498 8Z8  ·  UNIDENTIFIED (8MA)
  --   Group 071 accessory wheel on the unresolved 8MA platform.
  ('AUD-8MA0714988Z8',
   'Accessory Alloy Wheel – 8MA 071 498 8Z8',
   'audi-accessory-alloy-wheel-8ma0714988z8',
   'Accessory Alloy Wheel for UNIDENTIFIED (8MA). OE number 8MA 071 498 8Z8. Main group 071 sub-group 498. Revision index 8Z8. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering. Group 071 is the Genuine Accessories line — a dealer-fit option, not standard equipment.',
   'alloy-wheels', 'genuine-audi',
   '8MA 071 498 8Z8', '8MA0714988Z8', '8MA', '071', '498', '8Z8',
   'new', 1485.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [DERIVED] 4MN 071 491 A17Q  ·  Audi Q8 (4MN) - unconfirmed
  --   Prefix 4MN read as a Q8 variant, sibling to 4M8. Group 071 accessories line.
  ('AUD-4MN071491A17Q',
   'Accessory Alloy Wheel – 4MN 071 491 A17Q',
   'audi-accessory-alloy-wheel-4mn071491a17q',
   'Accessory Alloy Wheel for Audi Q8 (4MN) - unconfirmed. OE number 4MN 071 491 A17Q. Main group 071 sub-group 491. Revision index A17Q. Priced and sold individually — order four for a full set. Diameter, width and offset are NOT encoded in the part number and vary within a family; confirm the specification before ordering. Group 071 is the Genuine Accessories line — a dealer-fit option, not standard equipment.',
   'alloy-wheels', 'genuine-audi',
   '4MN 071 491 A17Q', '4MN071491A17Q', '4MN', '071', '491', 'A17Q',
   'new', 1552.50, 0, TRUE, 4,
   TRUE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_active = EXCLUDED.is_active,
      updated_at = now();

COMMIT;
