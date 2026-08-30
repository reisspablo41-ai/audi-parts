-- =============================================================================
-- Body panel seed -- 14 quarter and side panels. No repeats.
--
-- SIDE IS DECODED FROM THE SUB-GROUP (standard VAG convention):
--   odd  = LEFT    403, 837, 051     (3 parts)
--   even = RIGHT   404, 838, 052    (11 parts)
-- Recorded as a filterable attribute, because ordering the wrong side of a
-- $3,000 panel is an expensive mistake.
--
-- TWO PLATFORM CORRECTIONS FROM RESEARCH:
--   8W6 = A5/S5 COUPE       (not A4 Avant, as the 8W prefix would suggest)
--   8W7 = A5/S5 CABRIOLET   (not A4)
-- The 8W family covers A4 AND A5; the fourth character is the body variant.
--
-- PRICING IS ALMOST ABSENT, AND THAT IS THE REAL FINDING. Body panels are
-- dealer-quote items: 1 of 14 has a public price. parts.audiusa.com also applies
-- a $325 fixed freight rate to panels, so these carry is_oversized = TRUE, which
-- your shipping policy already treats as heavy freight.
--
-- STOCK: fixed 1-3 band, not the usual price-derived one. Nobody stocks twelve
-- quarter panels.
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
  -- [HIGH] 8W6 809 838  ·  RIGHT  ·  Audi A5 / S5 Coupe (F5)
  --   EXACT - parts.audiusa.com dealer price $3,447.73. NOTE: this is the A5/S5 COUPE, not an A4 Avant - 8W6 is the coupe body code.
  ('AUD-8W6809838',
   'Quarter Panel Right – 8W6 809 838',
   'audi-quarter-panel-right-8w6809838',
   'Quarter Panel, right-hand side, for the Audi A5 / S5 Coupe (F5) platform. OE number 8W6 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8W6 809 838', '8W6809838', '8W6', '809', '838', NULL,
   'new', 3447.73, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [NO DATA] 8W7 809 838  ·  RIGHT  ·  Audi A5 / S5 Cabriolet (F5)
  --   Stocked by getAudiParts and Audi Parts Store; price is dealer-quote only. NOTE: 8W7 is the CABRIOLET body code, not an A4.
  ('AUD-8W7809838',
   'Quarter Panel Right – 8W7 809 838',
   'audi-quarter-panel-right-8w7809838',
   'Quarter Panel, right-hand side, for the Audi A5 / S5 Cabriolet (F5) platform. OE number 8W7 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8W7 809 838', '8W7809838', '8W7', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [NO DATA] 8W7 809 403  ·  LEFT  ·  Audi A5 / S5 Cabriolet (F5)
  --   Dealer-quote only.
  ('AUD-8W7809403',
   'Body Side Panel Left – 8W7 809 403',
   'audi-body-side-panel-left-8w7809403',
   'Body Side Panel, left-hand side, for the Audi A5 / S5 Cabriolet (F5) platform. OE number 8W7 809 403. Sub-group 403 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8W7 809 403', '8W7809403', '8W7', '809', '403', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [NO DATA] 8W7 809 404  ·  RIGHT  ·  Audi A5 / S5 Cabriolet (F5)
  --   Dealer-quote only.
  ('AUD-8W7809404',
   'Body Side Panel Right – 8W7 809 404',
   'audi-body-side-panel-right-8w7809404',
   'Body Side Panel, right-hand side, for the Audi A5 / S5 Cabriolet (F5) platform. OE number 8W7 809 404. Sub-group 404 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8W7 809 404', '8W7809404', '8W7', '809', '404', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [NO DATA] 8W8 809 838  ·  RIGHT  ·  Audi A5 Sportback (F5) — unconfirmed
  --   Listed at genuineaudiparts.com 2018-2025. Body code 8W8 not confirmed; likely Sportback.
  ('AUD-8W8809838',
   'Quarter Panel Right – 8W8 809 838',
   'audi-quarter-panel-right-8w8809838',
   'Quarter Panel, right-hand side, for the Audi A5 Sportback (F5) — unconfirmed platform. OE number 8W8 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8W8 809 838', '8W8809838', '8W8', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [NO DATA] 8T0 809 838 A  ·  RIGHT  ·  Audi A5 (8T, 2008-2016)
  --   Base number 8T0809838 confirmed on parts.audiusa.com for the 2009 A5 Coupe. No price.
  ('AUD-8T0809838A',
   'Quarter Panel Right – 8T0 809 838 A',
   'audi-quarter-panel-right-8t0809838a',
   'Quarter Panel, right-hand side, for the Audi A5 (8T, 2008-2016) platform. OE number 8T0 809 838 A. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index A. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8T0 809 838 A', '8T0809838A', '8T0', '809', '838', 'A',
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [NO DATA] 8Y5 809 838  ·  RIGHT  ·  Audi A3 Sportback (8Y)
  --   Dealer-quote only.
  ('AUD-8Y5809838',
   'Quarter Panel Right – 8Y5 809 838',
   'audi-quarter-panel-right-8y5809838',
   'Quarter Panel, right-hand side, for the Audi A3 Sportback (8Y) platform. OE number 8Y5 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8Y5 809 838', '8Y5809838', '8Y5', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [NO DATA] 8B5 809 837  ·  LEFT  ·  Audi A5 (8B, 2025+) — unconfirmed
  --   Prefix 8B5 not confirmed. May be the 2025+ A5 that replaced the A4.
  ('AUD-8B5809837',
   'Quarter Panel Left – 8B5 809 837',
   'audi-quarter-panel-left-8b5809837',
   'Quarter Panel, left-hand side, for the Audi A5 (8B, 2025+) — unconfirmed platform. OE number 8B5 809 837. Sub-group 837 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8B5 809 837', '8B5809837', '8B5', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [NO DATA] 4K5 809 051  ·  LEFT  ·  Audi A6 Avant (C8)
  --   Dealer-quote only.
  ('AUD-4K5809051',
   'Side Panel Section Left – 4K5 809 051',
   'audi-side-panel-section-left-4k5809051',
   'Side Panel Section, left-hand side, for the Audi A6 Avant (C8) platform. OE number 4K5 809 051. Sub-group 051 is odd, denoting the LEFT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '4K5 809 051', '4K5809051', '4K5', '809', '051', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [NO DATA] 4G5 809 838  ·  RIGHT  ·  Audi A6 Avant (C7)
  --   Listed at audipartsstore.com 2012-2018. No price surfaced.
  ('AUD-4G5809838',
   'Quarter Panel Right – 4G5 809 838',
   'audi-quarter-panel-right-4g5809838',
   'Quarter Panel, right-hand side, for the Audi A6 Avant (C7) platform. OE number 4G5 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '4G5 809 838', '4G5809838', '4G5', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [NO DATA] 4G8 809 838  ·  RIGHT  ·  Audi A7 (C7)
  --   Dealer-quote only.
  ('AUD-4G8809838',
   'Quarter Panel Right – 4G8 809 838',
   'audi-quarter-panel-right-4g8809838',
   'Quarter Panel, right-hand side, for the Audi A7 (C7) platform. OE number 4G8 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '4G8 809 838', '4G8809838', '4G8', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [NO DATA] 85F 809 838  ·  RIGHT  ·  Audi Q3 Sportback (F3)
  --   Dealer-quote only.
  ('AUD-85F809838',
   'Quarter Panel Right – 85F 809 838',
   'audi-quarter-panel-right-85f809838',
   'Quarter Panel, right-hand side, for the Audi Q3 Sportback (F3) platform. OE number 85F 809 838. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index base. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '85F 809 838', '85F809838', '85F', '809', '838', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- [NO DATA] 8U0 809 838 A  ·  RIGHT  ·  Audi Q3 (8U)
  --   Dealer-quote only.
  ('AUD-8U0809838A',
   'Quarter Panel Right – 8U0 809 838 A',
   'audi-quarter-panel-right-8u0809838a',
   'Quarter Panel, right-hand side, for the Audi Q3 (8U) platform. OE number 8U0 809 838 A. Sub-group 838 is even, denoting the RIGHT side under the standard VAG convention. Revision index A. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '8U0 809 838 A', '8U0809838A', '8U0', '809', '838', 'A',
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- [NO DATA] 80A 809 052 STL  ·  RIGHT  ·  Audi Q5 (FY)
  --   Suffix STL is non-standard - likely "Stahl" (steel) denoting the material variant. Verify.
  ('AUD-80A809052STL',
   'Side Panel Section Right – 80A 809 052 STL',
   'audi-side-panel-section-right-80a809052stl',
   'Side Panel Section, right-hand side, for the Audi Q5 (FY) platform. OE number 80A 809 052 STL. Sub-group 052 is even, denoting the RIGHT side under the standard VAG convention. Revision index STL. Panels ship as oversized freight and are supplied in primer — paint and preparation are not included. Confirm the body variant (saloon, Avant, coupe, cabriolet, Sportback) before ordering; panels are not interchangeable between them.',
   'quarter-panels', 'genuine-audi',
   '80A 809 052 STL', '80A809052STL', '80A', '809', '052', 'STL',
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_oversized = EXCLUDED.is_oversized,
      is_active = EXCLUDED.is_active, updated_at = now();

-- Side is the single most return-inducing attribute on a body panel.
INSERT INTO attribute_definitions (id, category_id, label, unit, data_type, is_filterable, sort_order)
VALUES ('body-side', 'quarter-panels', 'Side', NULL, 'enum', TRUE, 1)
ON CONFLICT (id) DO NOTHING;
UPDATE attribute_definitions SET enum_values = ARRAY['left','right'] WHERE id = 'body-side';

INSERT INTO part_attributes (sku, attribute_id, value_text) VALUES
  ('AUD-8W6809838', 'body-side', 'right'),
  ('AUD-8W7809838', 'body-side', 'right'),
  ('AUD-8W7809403', 'body-side', 'left'),
  ('AUD-8W7809404', 'body-side', 'right'),
  ('AUD-8W8809838', 'body-side', 'right'),
  ('AUD-8T0809838A', 'body-side', 'right'),
  ('AUD-8Y5809838', 'body-side', 'right'),
  ('AUD-8B5809837', 'body-side', 'left'),
  ('AUD-4K5809051', 'body-side', 'left'),
  ('AUD-4G5809838', 'body-side', 'right'),
  ('AUD-4G8809838', 'body-side', 'right'),
  ('AUD-85F809838', 'body-side', 'right'),
  ('AUD-8U0809838A', 'body-side', 'right'),
  ('AUD-80A809052STL', 'body-side', 'right')
ON CONFLICT (sku, attribute_id) DO NOTHING;

COMMIT;
