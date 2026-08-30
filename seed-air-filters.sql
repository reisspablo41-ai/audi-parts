-- =============================================================================
-- Air filter seed -- 12 parts. No repeats in this batch.
--
-- COMPONENT DECODED FROM THE PART NUMBER:
--   129 620 / 133 843 / 133 844   engine intake air filter   (11 parts)
--   819 669                       CABIN / pollen filter      (1 part)
--
-- 1EA819669 is a CABIN filter, not an engine air filter, despite the source URL
-- calling it "audi-air-filter". It is filed under Cabin Air Filters. This is the
-- fifth batch running where the source naming and the part number disagree.
--
-- LEADING ZERO: 4e129620 -> 04E 129 620 (EA211). Every other prefix was already
-- three characters.
--
-- 6 of 12 priced. Stock uses the same deterministic SKU hash as set-stock.sql.
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
  -- [HIGH] 8W0 133 843 C  ·  Audi A4 (B9) / A5 / Q5 2.0T
  --   EXACT - parts.audiusa.com genuine $43.49. Hengst equivalent $40.00 at Europa Parts.
  ('AUD-8W0133843C',
   'Engine Air Filter – 8W0 133 843 C',
   'audi-engine-air-filter-8w0133843c',
   'Engine Air Filter for Audi A4 (B9) / A5 / Q5 2.0T, OE number 8W0 133 843 C. Main group 133 sub-group 843 identifies this as an engine intake filter. Revision index C. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '8W0 133 843 C', '8W0133843C', '8W0', '133', '843', 'C',
   'new', 43.49, 0, TRUE, 13,
   TRUE, 24),

  -- [HIGH] 1K0 129 620 L  ·  VW Group PQ35 (A3 8P / TT / Passat)
  --   EXACT - parts.audiusa.com genuine MSRP $37.32. ECS $26.99, Europa $24.25.
  ('AUD-1K0129620L',
   'Engine Air Filter – 1K0 129 620 L',
   'audi-engine-air-filter-1k0129620l',
   'Engine Air Filter for VW Group PQ35 (A3 8P / TT / Passat), OE number 1K0 129 620 L. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index L. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '1K0 129 620 L', '1K0129620L', '1K0', '129', '620', 'L',
   'new', 37.32, 0, TRUE, 12,
   TRUE, 24),

  -- [MED] 8W0 133 843 E  ·  Audi A4 (B9) 2.0T FWD (DBPA)
  --   EXACT number at Europa Parts (Hengst) $27.00 regular / $22.95 sale. No genuine-Audi price found for this revision, so this is an OE-supplier figure.
  ('AUD-8W0133843E',
   'Engine Air Filter – 8W0 133 843 E',
   'audi-engine-air-filter-8w0133843e',
   'Engine Air Filter for Audi A4 (B9) 2.0T FWD (DBPA), OE number 8W0 133 843 E. Main group 133 sub-group 843 identifies this as an engine intake filter. Revision index E. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '8W0 133 843 E', '8W0133843E', '8W0', '133', '843', 'E',
   'new', 27.00, 0, TRUE, 25,
   TRUE, 24),

  -- [MED] 8W0 133 843 D  ·  Audi A4 (B9) / A5 / Q5
  --   Priced off sibling revision C (genuine $43.49). Verify.
  ('AUD-8W0133843D',
   'Engine Air Filter – 8W0 133 843 D',
   'audi-engine-air-filter-8w0133843d',
   'Engine Air Filter for Audi A4 (B9) / A5 / Q5, OE number 8W0 133 843 D. Main group 133 sub-group 843 identifies this as an engine intake filter. Revision index D. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '8W0 133 843 D', '8W0133843D', '8W0', '133', '843', 'D',
   'new', 43.49, 0, TRUE, 24,
   TRUE, 24),

  -- [MED] 1K0 129 620 G  ·  VW Group PQ35 (A3 8P / TT / Passat)
  --   Priced off the 1K0129620 family (genuine MSRP $37.32). Verify.
  ('AUD-1K0129620G',
   'Engine Air Filter – 1K0 129 620 G',
   'audi-engine-air-filter-1k0129620g',
   'Engine Air Filter for VW Group PQ35 (A3 8P / TT / Passat), OE number 1K0 129 620 G. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index G. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '1K0 129 620 G', '1K0129620G', '1K0', '129', '620', 'G',
   'new', 37.32, 0, TRUE, 11,
   TRUE, 24),

  -- [MED] 8R0 133 843 D  ·  Audi Q5 (8R) / A4 / A5
  --   Family match: 8R0133843K genuine MSRP $44.15 at parts.audiusa.com. FCP Euro stocks this exact number (Hengst) but no price surfaced.
  ('AUD-8R0133843D',
   'Engine Air Filter – 8R0 133 843 D',
   'audi-engine-air-filter-8r0133843d',
   'Engine Air Filter for Audi Q5 (8R) / A4 / A5, OE number 8R0 133 843 D. Main group 133 sub-group 843 identifies this as an engine intake filter. Revision index D. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '8R0 133 843 D', '8R0133843D', '8R0', '133', '843', 'D',
   'new', 44.15, 0, TRUE, 17,
   TRUE, 24),

  -- [NO DATA] 4N0 129 620 B  ·  Audi A8 (D5)
  --   No listing found.
  ('AUD-4N0129620B',
   'Engine Air Filter – 4N0 129 620 B',
   'audi-engine-air-filter-4n0129620b',
   'Engine Air Filter for Audi A8 (D5), OE number 4N0 129 620 B. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index B. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '4N0 129 620 B', '4N0129620B', '4N0', '129', '620', 'B',
   'new', 0.00, 0, TRUE, 5,
   TRUE, 24),

  -- [NO DATA] 4N0 129 620 C  ·  Audi A8 (D5)
  --   No listing found.
  ('AUD-4N0129620C',
   'Engine Air Filter – 4N0 129 620 C',
   'audi-engine-air-filter-4n0129620c',
   'Engine Air Filter for Audi A8 (D5), OE number 4N0 129 620 C. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index C. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '4N0 129 620 C', '4N0129620C', '4N0', '129', '620', 'C',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 5Q0 129 620 B  ·  VW Group MQB (Golf 7 / A3 8V)
  --   No listing found for this revision.
  ('AUD-5Q0129620B',
   'Engine Air Filter – 5Q0 129 620 B',
   'audi-engine-air-filter-5q0129620b',
   'Engine Air Filter for VW Group MQB (Golf 7 / A3 8V), OE number 5Q0 129 620 B. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index B. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '5Q0 129 620 B', '5Q0129620B', '5Q0', '129', '620', 'B',
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24),

  -- [NO DATA] 04E 129 620  ·  EA211 1.2 / 1.4 TFSI
  --   No listing found. Source slug dropped the leading zero (4e129620).
  ('AUD-04E129620',
   'Engine Air Filter – 04E 129 620',
   'audi-engine-air-filter-04e129620',
   'Engine Air Filter for EA211 1.2 / 1.4 TFSI, OE number 04E 129 620. Main group 129 sub-group 620 identifies this as an engine intake filter. Revision index base. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '04E 129 620', '04E129620', '04E', '129', '620', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, 24),

  -- [NO DATA] 8B3 133 844 B  ·  Audi A5 (8B, 2025+) — UNCONFIRMED
  --   No listing found. Prefix 8B3 is not a platform we can confirm; it may be the 2025+ A5 that replaced the A4, or the number may be wrong. Verify before listing.
  ('AUD-8B3133844B',
   'Engine Air Filter – 8B3 133 844 B',
   'audi-engine-air-filter-8b3133844b',
   'Engine Air Filter for Audi A5 (8B, 2025+) — UNCONFIRMED, OE number 8B3 133 844 B. Main group 133 sub-group 844 identifies this as an engine intake filter. Revision index B. Replace at the interval in your service schedule — a restricted intake filter costs measurable power and fuel economy.',
   'air-filters', 'genuine-audi',
   '8B3 133 844 B', '8B3133844B', '8B3', '133', '844', 'B',
   'new', 0.00, 0, TRUE, 11,
   TRUE, 24),

  -- [NO DATA] 1EA 819 669  ·  VW Group MEB (ID.3 / ID.4 / Q4 e-tron)
  --   No listing found. NOTE: group 819 669 is a CABIN/pollen filter, not an engine intake filter, despite the source URL saying "air-filter". Filed under Cabin Air Filters. MEB is an EV platform - decide whether it belongs in an Audi catalogue.
  ('AUD-1EA819669',
   'Cabin Air Filter – 1EA 819 669',
   'audi-cabin-air-filter-1ea819669',
   'Cabin Air Filter for VW Group MEB (ID.3 / ID.4 / Q4 e-tron), OE number 1EA 819 669. Main group 819 sub-group 669 identifies this as a cabin/pollen filter. Revision index base. Cabin filters sit behind the glovebox or under the scuttle and should be replaced annually, or more often in dusty conditions.',
   'cabin-filters', 'genuine-audi',
   '1EA 819 669', '1EA819669', '1EA', '819', '669', NULL,
   'new', 0.00, 0, TRUE, 12,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_active = EXCLUDED.is_active,
      updated_at = now();

COMMIT;
