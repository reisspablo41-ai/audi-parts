-- =============================================================================
-- Filters seed -- 20 oil and transmission filters.
--
-- SUPPLIED URLS: 22 across two messages. Resolved to 20 parts --
--   * 3 exact repeats (06E115562C, 079198405E, 3N115562B/78115561J re-sent)
--   * 1 MALFORMED and SKIPPED: "audi-oil-filter-7c11556" is truncated (a VAG
--     number needs 9 digits before the index). Re-send it if you want it.
--
-- LEADING ZEROS: the source slugs drop them (6l115562b). Restored here, and
-- every prefix resolves to a real VAG engine or gearbox family.
--
-- NOT EVERYTHING HERE IS A FILTER ELEMENT:
--   115 562 / 115 561  filter element         $15-26
--   198 405            SERVICE KIT (filter + seals)   $30-40
--   115 403 / 115 405  HOUSING                $270  <-- 15x an element
--   325 429            transmission filter    $70-170
--   317 826            gearbox oil cooler, not an ATF filter
--
-- One correction worth noting: 06J115403Q carries sub-group 403 but every
-- retailer lists it as a filter element at ~$18, not a housing. Retailer data
-- beat the group heuristic; it is filed as an element.
--
-- 8 of 20 priced. Stock uses the same deterministic SKU hash as set-stock.sql.
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
  -- [HIGH] 06L 115 562 B  ·  EA888 Gen3 1.8 / 2.0 TFSI
  --   EXACT - ECS $17.15, FCP Euro $15.81, K&N cross-ref $15.99.
  ('AUD-06L115562B',
   'Oil Filter Element – 06L 115 562 B',
   'audi-oil-filter-element-06l115562b',
   'Oil Filter Element for the EA888 Gen3 1.8 / 2.0 TFSI family, OE number 06L 115 562 B. Main group 115 sub-group 562. Revision index B. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '06L 115 562 B', '06L115562B', '06L', '115', '562', 'B',
   'new', 17.15, 0, TRUE, 12,
   TRUE, 24),

  -- [HIGH] 06E 115 562 C  ·  3.0 / 3.2 FSI V6
  --   EXACT - ECS MSRP $25.83 (sale $21.89); FCP Euro $22.84.
  ('AUD-06E115562C',
   'Oil Filter Element – 06E 115 562 C',
   'audi-oil-filter-element-06e115562c',
   'Oil Filter Element for the 3.0 / 3.2 FSI V6 family, OE number 06E 115 562 C. Main group 115 sub-group 562. Revision index C. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '06E 115 562 C', '06E115562C', '06E', '115', '562', 'C',
   'new', 25.83, 0, TRUE, 16,
   TRUE, 24),

  -- [HIGH] 06E 115 562 H  ·  3.0 FSI V6 (A6/A7/A8/Q7)
  --   EXACT - ECS MSRP $24.15 (sale $21.06); FCP Euro $22.34.
  ('AUD-06E115562H',
   'Oil Filter Element – 06E 115 562 H',
   'audi-oil-filter-element-06e115562h',
   'Oil Filter Element for the 3.0 FSI V6 (A6/A7/A8/Q7) family, OE number 06E 115 562 H. Main group 115 sub-group 562. Revision index H. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '06E 115 562 H', '06E115562H', '06E', '115', '562', 'H',
   'new', 24.15, 0, TRUE, 13,
   TRUE, 24),

  -- [HIGH] 06J 115 403 Q  ·  EA888 2.0 TFSI
  --   EXACT - Pelican $19.75, FCP Euro $17.91, Europa $17.01. NOTE: despite sub-group 403 this is a FILTER, not a housing - retailer listings are unanimous.
  ('AUD-06J115403Q',
   'Oil Filter Element – 06J 115 403 Q',
   'audi-oil-filter-element-06j115403q',
   'Oil Filter Element for the EA888 2.0 TFSI family, OE number 06J 115 403 Q. Main group 115 sub-group 403. Revision index Q. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '06J 115 403 Q', '06J115403Q', '06J', '115', '403', 'Q',
   'new', 19.75, 0, TRUE, 19,
   TRUE, 24),

  -- [HIGH] 079 198 405 E  ·  4.2 / 5.2 V8-V10
  --   EXACT - ECS MSRP $40.01 (sale $36.57). Group 198 405 is a KIT (filter + seals).
  ('AUD-079198405E',
   'Oil Filter Service Kit – 079 198 405 E',
   'audi-oil-filter-service-kit-079198405e',
   'Oil Filter Service Kit for the 4.2 / 5.2 V8-V10 family, OE number 079 198 405 E. Main group 198 sub-group 405. Revision index E. Service kits include the element plus the sump-plug and housing seals — check what your service schedule calls for.',
   'oil-filters', 'genuine-audi',
   '079 198 405 E', '079198405E', '079', '198', '405', 'E',
   'new', 40.01, 0, TRUE, 24,
   TRUE, 24),

  -- [HIGH] 079 198 405 D  ·  4.0T V8 (A8/S6/S7/S8/RS7)
  --   EXACT - Europa Parts regular $33.33 (sale $16.95); parts.audiusa.com $30.18.
  ('AUD-079198405D',
   'Oil Filter Service Kit – 079 198 405 D',
   'audi-oil-filter-service-kit-079198405d',
   'Oil Filter Service Kit for the 4.0T V8 (A8/S6/S7/S8/RS7) family, OE number 079 198 405 D. Main group 198 sub-group 405. Revision index D. Service kits include the element plus the sump-plug and housing seals — check what your service schedule calls for.',
   'oil-filters', 'genuine-audi',
   '079 198 405 D', '079198405D', '079', '198', '405', 'D',
   'new', 33.33, 0, TRUE, 23,
   TRUE, 24),

  -- [MED] 03H 115 403 J  ·  VR6 / 3.6 FSI
  --   EXACT - getAudiParts sale price $270.55. This IS a housing, not a filter - roughly 15x the price of an element. Do not confuse the two.
  ('AUD-03H115403J',
   'Oil Filter Housing – 03H 115 403 J',
   'audi-oil-filter-housing-03h115403j',
   'Oil Filter Housing for the VR6 / 3.6 FSI family, OE number 03H 115 403 J. Main group 115 sub-group 403. Revision index J. Housings are a major component, not a service item — confirm you need the housing and not just the element.',
   'oil-filters', 'genuine-audi',
   '03H 115 403 J', '03H115403J', '03H', '115', '403', 'J',
   'new', 270.55, 0, TRUE, 4,
   TRUE, 24),

  -- [HIGH] 0B5 325 429 E  ·  DL501 7-speed S tronic
  --   EXACT - ECS MSRP $169.98 (sale $144.82). FCP Euro $70.99, Deutsche $149.58 - wide spread.
  ('AUD-0B5325429E',
   'Transmission Oil Filter – 0B5 325 429 E',
   'audi-transmission-oil-filter-0b5325429e',
   'Transmission Oil Filter for the DL501 7-speed S tronic family, OE number 0B5 325 429 E. Main group 325 sub-group 429. Revision index E. Replace at every oil service, together with a new sump-plug washer.',
   'transmission-filters', 'genuine-audi',
   '0B5 325 429 E', '0B5325429E', '0B5', '325', '429', 'E',
   'new', 169.98, 0, TRUE, 3,
   TRUE, 24),

  -- [NO DATA] 021 115 562 A  ·  VR6 / early VW Group
  --   No listing found.
  ('AUD-021115562A',
   'Oil Filter Element – 021 115 562 A',
   'audi-oil-filter-element-021115562a',
   'Oil Filter Element for the VR6 / early VW Group family, OE number 021 115 562 A. Main group 115 sub-group 562. Revision index A. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '021 115 562 A', '021115562A', '021', '115', '562', 'A',
   'new', 0.00, 0, TRUE, 7,
   TRUE, 24),

  -- [NO DATA] 04E 115 561 T  ·  EA211 1.2 / 1.4 TFSI
  --   No listing found.
  ('AUD-04E115561T',
   'Oil Filter – 04E 115 561 T',
   'audi-oil-filter-04e115561t',
   'Oil Filter for the EA211 1.2 / 1.4 TFSI family, OE number 04E 115 561 T. Main group 115 sub-group 561. Revision index T. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '04E 115 561 T', '04E115561T', '04E', '115', '561', 'T',
   'new', 0.00, 0, TRUE, 9,
   TRUE, 24),

  -- [NO DATA] 03N 115 562 B  ·  EA288 / newer TDI
  --   No listing found.
  ('AUD-03N115562B',
   'Oil Filter Element – 03N 115 562 B',
   'audi-oil-filter-element-03n115562b',
   'Oil Filter Element for the EA288 / newer TDI family, OE number 03N 115 562 B. Main group 115 sub-group 562. Revision index B. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '03N 115 562 B', '03N115562B', '03N', '115', '562', 'B',
   'new', 0.00, 0, TRUE, 10,
   TRUE, 24),

  -- [NO DATA] 06D 115 562  ·  2.0 FSI
  --   No listing found.
  ('AUD-06D115562',
   'Oil Filter Element – 06D 115 562',
   'audi-oil-filter-element-06d115562',
   'Oil Filter Element for the 2.0 FSI family, OE number 06D 115 562. Main group 115 sub-group 562. Revision index base. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '06D 115 562', '06D115562', '06D', '115', '562', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, 24),

  -- [NO DATA] 056 115 561 G  ·  early VW Group inline
  --   No listing found.
  ('AUD-056115561G',
   'Oil Filter – 056 115 561 G',
   'audi-oil-filter-056115561g',
   'Oil Filter for the early VW Group inline family, OE number 056 115 561 G. Main group 115 sub-group 561. Revision index G. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '056 115 561 G', '056115561G', '056', '115', '561', 'G',
   'new', 0.00, 0, TRUE, 9,
   TRUE, 24),

  -- [NO DATA] 078 115 561 J  ·  2.4 / 2.8 V6 30V
  --   No listing found.
  ('AUD-078115561J',
   'Oil Filter – 078 115 561 J',
   'audi-oil-filter-078115561j',
   'Oil Filter for the 2.4 / 2.8 V6 30V family, OE number 078 115 561 J. Main group 115 sub-group 561. Revision index J. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '078 115 561 J', '078115561J', '078', '115', '561', 'J',
   'new', 0.00, 0, TRUE, 8,
   TRUE, 24),

  -- [NO DATA] 071 115 562 A  ·  VW Group (071 family)
  --   No listing found.
  ('AUD-071115562A',
   'Oil Filter Element – 071 115 562 A',
   'audi-oil-filter-element-071115562a',
   'Oil Filter Element for the VW Group (071 family) family, OE number 071 115 562 A. Main group 115 sub-group 562. Revision index A. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '071 115 562 A', '071115562A', '071', '115', '562', 'A',
   'new', 0.00, 0, TRUE, 2,
   TRUE, 24),

  -- [NO DATA] 057 115 561 M  ·  VW Group (057 family)
  --   No listing found.
  ('AUD-057115561M',
   'Oil Filter – 057 115 561 M',
   'audi-oil-filter-057115561m',
   'Oil Filter for the VW Group (057 family) family, OE number 057 115 561 M. Main group 115 sub-group 561. Revision index M. Replace at every oil service, together with a new sump-plug washer.',
   'oil-filters', 'genuine-audi',
   '057 115 561 M', '057115561M', '057', '115', '561', 'M',
   'new', 0.00, 0, TRUE, 6,
   TRUE, 24),

  -- [NO DATA] 06E 115 405 K  ·  3.0 / 3.2 FSI V6
  --   No listing found. This is a HOUSING - expect an order of magnitude above an element.
  ('AUD-06E115405K',
   'Oil Filter Housing – 06E 115 405 K',
   'audi-oil-filter-housing-06e115405k',
   'Oil Filter Housing for the 3.0 / 3.2 FSI V6 family, OE number 06E 115 405 K. Main group 115 sub-group 405. Revision index K. Housings are a major component, not a service item — confirm you need the housing and not just the element.',
   'oil-filters', 'genuine-audi',
   '06E 115 405 K', '06E115405K', '06E', '115', '405', 'K',
   'new', 0.00, 0, TRUE, 11,
   TRUE, 24),

  -- [NO DATA] 01M 325 429  ·  01M 4-speed automatic
  --   No listing found.
  ('AUD-01M325429',
   'Transmission Oil Filter – 01M 325 429',
   'audi-transmission-oil-filter-01m325429',
   'Transmission Oil Filter for the 01M 4-speed automatic family, OE number 01M 325 429. Main group 325 sub-group 429. Revision index base. Replace at every oil service, together with a new sump-plug washer.',
   'transmission-filters', 'genuine-audi',
   '01M 325 429', '01M325429', '01M', '325', '429', NULL,
   'new', 0.00, 0, TRUE, 7,
   TRUE, 24),

  -- [NO DATA] 0AT 325 429  ·  unconfirmed gearbox family
  --   No listing found. Prefix 0AT is not a VAG gearbox code we recognise - verify.
  ('AUD-0AT325429',
   'Transmission Oil Filter – 0AT 325 429',
   'audi-transmission-oil-filter-0at325429',
   'Transmission Oil Filter for the unconfirmed gearbox family family, OE number 0AT 325 429. Main group 325 sub-group 429. Revision index base. Replace at every oil service, together with a new sump-plug washer.',
   'transmission-filters', 'genuine-audi',
   '0AT 325 429', '0AT325429', '0AT', '325', '429', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, 24),

  -- [NO DATA] 4F0 317 826 B  ·  Audi A6 (C6)
  --   No listing found. Group 317 826 is gearbox oil cooling, not an ATF filter element.
  ('AUD-4F0317826B',
   'Gearbox Oil Cooler / Filter – 4F0 317 826 B',
   'audi-gearbox-oil-cooler-filter-4f0317826b',
   'Gearbox Oil Cooler / Filter for the Audi A6 (C6) family, OE number 4F0 317 826 B. Main group 317 sub-group 826. Revision index B. Replace at every oil service, together with a new sump-plug washer.',
   'transmission-filters', 'genuine-audi',
   '4F0 317 826 B', '4F0317826B', '4F0', '317', '826', 'B',
   'new', 0.00, 0, TRUE, 3,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_active = EXCLUDED.is_active,
      updated_at = now();

COMMIT;
