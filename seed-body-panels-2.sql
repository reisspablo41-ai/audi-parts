-- =============================================================================
-- Body panel seed, batch 2 -- 18 new panels (two messages combined).
--
-- OMITTED as already in the catalogue from seed-body-panels.sql:
--   4G5809838, 8W8809838
--
-- NO PRICES. Zero of 18 have a public price, consistent with batch 1 (1 of 14).
-- Body panels are dealer-quote items: every retailer that stocks them requires
-- you to select a dealer before showing a figure. All load at 0.00 and show
-- "Price on request" -- for this category that is arguably the correct customer
-- experience anyway.
--
-- SIDE from the sub-group: odd = LEFT (11 parts), even = RIGHT (7 parts).
-- This batch is mostly LEFT panels, pairing with the mostly-RIGHT batch 1.
--
-- PLATFORM CORRECTIONS FROM RESEARCH:
--   8V5 = A3/S3 SALOON  (parts.audiusa.com lists it as SEDAN, not Sportback)
--   8K5 = listed as A4 SEDAN, though 8K5 is normally the Avant code -- flagged
--
-- TWO ARE NOT QUARTER PANELS, despite every source URL saying so:
--   8T0809405B   sub-group 405 = wheel housing / inner structural panel
--   4N0809041L   sub-group 041 = full body side panel, a larger assembly
--
-- All carry is_oversized = TRUE and a fixed 1-3 stock band.
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
  -- [MEDIUM] 8V5 809 838  ·  RIGHT  ·  Audi A3 / S3 Saloon (8V)
  --   parts.audiusa.com lists this as SEDAN for A3/S3 - 8V5 is the saloon body code, not the Sportback.
  ('AUD-8V5809838',
   'Quarter Panel Right – 8V5 809 838',
   'audi-quarter-panel-right-8v5809838',
   'Quarter Panel, right-hand side, for the Audi A3 / S3 Saloon (8V) platform. OE number 8V5 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8V5 809 838', '8V5809838', '8V5', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [MEDIUM] 8V5 809 837  ·  LEFT  ·  Audi A3 / S3 Saloon (8V)
  --   Left-hand pair to 8V5809838. Same saloon body code.
  ('AUD-8V5809837',
   'Quarter Panel Left – 8V5 809 837',
   'audi-quarter-panel-left-8v5809837',
   'Quarter Panel, left-hand side, for the Audi A3 / S3 Saloon (8V) platform. OE number 8V5 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8V5 809 837', '8V5809837', '8V5', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [LOW] 8V4 809 837 A  ·  LEFT  ·  Audi A3 Sportback (8V) - unconfirmed
  --   Body code 8V4 inferred as Sportback once 8V5 was confirmed as the saloon. Verify.
  ('AUD-8V4809837A',
   'Quarter Panel Left – 8V4 809 837 A',
   'audi-quarter-panel-left-8v4809837a',
   'Quarter Panel, left-hand side, for the Audi A3 Sportback (8V) - unconfirmed platform. OE number 8V4 809 837 A. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index A. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8V4 809 837 A', '8V4809837A', '8V4', '809', '837', 'A',
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [MEDIUM] 8K5 809 838  ·  RIGHT  ·  Audi A4 (B8) - listed as Sedan
  --   parts.audiusa.com lists this as SEDAN, though 8K5 is normally the Avant body code. Confirm the variant.
  ('AUD-8K5809838',
   'Quarter Panel Right – 8K5 809 838',
   'audi-quarter-panel-right-8k5809838',
   'Quarter Panel, right-hand side, for the Audi A4 (B8) - listed as Sedan platform. OE number 8K5 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8K5 809 838', '8K5809838', '8K5', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [HIGH] 8K9 809 837 AA  ·  LEFT  ·  Audi A4 Avant (B8)
  --   8K9 is the Avant body code. Pairs with the 8K5 saloon panel above - different variants, not interchangeable.
  ('AUD-8K9809837AA',
   'Quarter Panel Left – 8K9 809 837 AA',
   'audi-quarter-panel-left-8k9809837aa',
   'Quarter Panel, left-hand side, for the Audi A4 Avant (B8) platform. OE number 8K9 809 837 AA. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index AA. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8K9 809 837 AA', '8K9809837AA', '8K9', '809', '837', 'AA',
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [HIGH] 8W9 809 838 D  ·  RIGHT  ·  Audi A4 allroad (B9)
  --   No price published.
  ('AUD-8W9809838D',
   'Quarter Panel Right – 8W9 809 838 D',
   'audi-quarter-panel-right-8w9809838d',
   'Quarter Panel, right-hand side, for the Audi A4 allroad (B9) platform. OE number 8W9 809 838 D. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index D. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8W9 809 838 D', '8W9809838D', '8W9', '809', '838', 'D',
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [HIGH] 8W6 809 837  ·  LEFT  ·  Audi A5 / S5 Coupe (F5)
  --   Left-hand pair to 8W6809838, already in the catalogue at $3,447.73. Expect a similar figure.
  ('AUD-8W6809837',
   'Quarter Panel Left – 8W6 809 837',
   'audi-quarter-panel-left-8w6809837',
   'Quarter Panel, left-hand side, for the Audi A5 / S5 Coupe (F5) platform. OE number 8W6 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8W6 809 837', '8W6809837', '8W6', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [MEDIUM] 8W8 809 837  ·  LEFT  ·  Audi A5 Sportback (F5) - unconfirmed
  --   Left-hand pair to 8W8809838, already in the catalogue.
  ('AUD-8W8809837',
   'Quarter Panel Left – 8W8 809 837',
   'audi-quarter-panel-left-8w8809837',
   'Quarter Panel, left-hand side, for the Audi A5 Sportback (F5) - unconfirmed platform. OE number 8W8 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8W8 809 837', '8W8809837', '8W8', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [HIGH] 8T0 809 837  ·  LEFT  ·  Audi A5 (8T)
  --   Left-hand pair to 8T0809838A, already in the catalogue.
  ('AUD-8T0809837',
   'Quarter Panel Left – 8T0 809 837',
   'audi-quarter-panel-left-8t0809837',
   'Quarter Panel, left-hand side, for the Audi A5 (8T) platform. OE number 8T0 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8T0 809 837', '8T0809837', '8T0', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [HIGH] 8T0 809 405 B  ·  LEFT  ·  Audi A5 (8T)
  --   Sub-group 405 is a wheel housing / inner side panel, NOT a quarter panel. Structural repair section.
  ('AUD-8T0809405B',
   'Wheel Housing / Side Panel Left – 8T0 809 405 B',
   'audi-wheel-housing-side-panel-left-8t0809405b',
   'Wheel Housing / Side Panel, left-hand side, for the Audi A5 (8T) platform. OE number 8T0 809 405 B. Sub-group 405 is odd, denoting the LEFT side under the standard VAG convention. Revision index B. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8T0 809 405 B', '8T0809405B', '8T0', '809', '405', 'B',
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [MEDIUM] 8F0 809 840 B  ·  RIGHT  ·  Audi A5 Cabriolet (8F)
  --   Sub-group 840 is a side panel section rather than a full quarter panel.
  ('AUD-8F0809840B',
   'Side Panel Section Right – 8F0 809 840 B',
   'audi-side-panel-section-right-8f0809840b',
   'Side Panel Section, right-hand side, for the Audi A5 Cabriolet (8F) platform. OE number 8F0 809 840 B. Sub-group 840 is even, denoting the RIGHT side under the standard VAG convention. Revision index B. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '8F0 809 840 B', '8F0809840B', '8F0', '809', '840', 'B',
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [HIGH] 4G8 809 837  ·  LEFT  ·  Audi A7 (C7)
  --   Left-hand pair to 4G8809838, already in the catalogue.
  ('AUD-4G8809837',
   'Quarter Panel Left – 4G8 809 837',
   'audi-quarter-panel-left-4g8809837',
   'Quarter Panel, left-hand side, for the Audi A7 (C7) platform. OE number 4G8 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '4G8 809 837', '4G8809837', '4G8', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [HIGH] 4N0 809 041 L  ·  LEFT  ·  Audi A8 (D5)
  --   Sub-group 041 is a full body side panel - a larger assembly than a quarter panel.
  ('AUD-4N0809041L',
   'Body Side Panel Left – 4N0 809 041 L',
   'audi-body-side-panel-left-4n0809041l',
   'Body Side Panel, left-hand side, for the Audi A8 (D5) platform. OE number 4N0 809 041 L. Sub-group 041 is odd, denoting the LEFT side under the standard VAG convention. Revision index L. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '4N0 809 041 L', '4N0809041L', '4N0', '809', '041', 'L',
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [HIGH] 4K5 809 052  ·  RIGHT  ·  Audi A6 Avant (C8)
  --   Right-hand pair to 4K5809051, already in the catalogue.
  ('AUD-4K5809052',
   'Side Panel Section Right – 4K5 809 052',
   'audi-side-panel-section-right-4k5809052',
   'Side Panel Section, right-hand side, for the Audi A6 Avant (C8) platform. OE number 4K5 809 052. Sub-group 052 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '4K5 809 052', '4K5809052', '4K5', '809', '052', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [MEDIUM] 4M8 809 054  ·  RIGHT  ·  Audi Q8 (4M8)
  --   Prefix 4M8 read as Q8. Verify.
  ('AUD-4M8809054',
   'Side Panel Section Right – 4M8 809 054',
   'audi-side-panel-section-right-4m8809054',
   'Side Panel Section, right-hand side, for the Audi Q8 (4M8) platform. OE number 4M8 809 054. Sub-group 054 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '4M8 809 054', '4M8809054', '4M8', '809', '054', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [MEDIUM] 80F 809 051 STL  ·  LEFT  ·  Audi Q5 Sportback (80F)
  --   Suffix STL is non-standard, likely "Stahl" (steel) denoting the material variant - same as 80A809052STL already in the catalogue. 80F read as the Q5 Sportback.
  ('AUD-80F809051STL',
   'Side Panel Section Left – 80F 809 051 STL',
   'audi-side-panel-section-left-80f809051stl',
   'Side Panel Section, left-hand side, for the Audi Q5 Sportback (80F) platform. OE number 80F 809 051 STL. Sub-group 051 is odd, denoting the LEFT side under the standard VAG convention. Revision index STL. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '80F 809 051 STL', '80F809051STL', '80F', '809', '051', 'STL',
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [MEDIUM] 89E 809 837 A  ·  LEFT  ·  Audi Q4 e-tron (89)
  --   Prefix 89E read as Q4 e-tron. EV platform - decide whether it belongs in this catalogue.
  ('AUD-89E809837A',
   'Quarter Panel Left – 89E 809 837 A',
   'audi-quarter-panel-left-89e809837a',
   'Quarter Panel, left-hand side, for the Audi Q4 e-tron (89) platform. OE number 89E 809 837 A. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index A. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '89E 809 837 A', '89E809837A', '89E', '809', '837', 'A',
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [MEDIUM] 89E 809 838 A  ·  RIGHT  ·  Audi Q4 e-tron (89)
  --   Prefix 89E read as Q4 e-tron. EV platform - decide whether it belongs in this catalogue.
  ('AUD-89E809838A',
   'Quarter Panel Right – 89E 809 838 A',
   'audi-quarter-panel-right-89e809838a',
   'Quarter Panel, right-hand side, for the Audi Q4 e-tron (89) platform. OE number 89E 809 838 A. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index A. Supplied in primer and shipped as oversized freight; paint and preparation are not included. Confirm the body variant before ordering - panels do not interchange between saloon, Avant, Sportback, coupe and cabriolet.',
   'quarter-panels', 'genuine-audi',
   '89E 809 838 A', '89E809838A', '89E', '809', '838', 'A',
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_oversized = EXCLUDED.is_oversized,
      is_active = EXCLUDED.is_active, updated_at = now();

INSERT INTO part_attributes (sku, attribute_id, value_text) VALUES
  ('AUD-8V5809838', 'body-side', 'right'),
  ('AUD-8V5809837', 'body-side', 'left'),
  ('AUD-8V4809837A', 'body-side', 'left'),
  ('AUD-8K5809838', 'body-side', 'right'),
  ('AUD-8K9809837AA', 'body-side', 'left'),
  ('AUD-8W9809838D', 'body-side', 'right'),
  ('AUD-8W6809837', 'body-side', 'left'),
  ('AUD-8W8809837', 'body-side', 'left'),
  ('AUD-8T0809837', 'body-side', 'left'),
  ('AUD-8T0809405B', 'body-side', 'left'),
  ('AUD-8F0809840B', 'body-side', 'right'),
  ('AUD-4G8809837', 'body-side', 'left'),
  ('AUD-4N0809041L', 'body-side', 'left'),
  ('AUD-4K5809052', 'body-side', 'right'),
  ('AUD-4M8809054', 'body-side', 'right'),
  ('AUD-80F809051STL', 'body-side', 'left'),
  ('AUD-89E809837A', 'body-side', 'left'),
  ('AUD-89E809838A', 'body-side', 'right')
ON CONFLICT (sku, attribute_id) DO NOTHING;

COMMIT;
