-- =============================================================================
-- Body accessories seed -- 15 parts spanning SIX main groups.
--
-- This batch is not what the URLs suggest. Every one is filed under
-- "quarter-panel-*" on the source site, but the part numbers say otherwise:
--
--   809  body side panel      5 parts   -> quarter-panels
--   810  body rear structure  3 parts   -> body-brackets
--   814  FLOOR structure      1 part    -> body-brackets
--   819  heating/ventilation  2 parts   -> body-trim   (air vents)
--   839  doors/mouldings      1 part    -> body-trim
--   035  AUDIO                2 parts   -> speakers    (rear bass speakers)
--   N-   standard hardware    1 part    -> fasteners   (a nut)
--
-- Only 5 of 15 are body side panels. Two are loudspeakers and one is a nut.
-- Three new categories were added to hold them: Brackets & Reinforcements,
-- Clips & Fasteners, and Speakers & Audio.
--
-- NO PRICES. None of the 15 have a public price. Consistent with both earlier
-- panel batches -- these are dealer-quote items.
--
-- STOCK by type: fasteners 25-80 (consumable), panels 1-3 (bulky freight),
-- everything else 2-12.
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
  -- 8J8 809 844  ·  quarter-panels  ·  RIGHT
  --   Sub-group 844 is a side panel section, not a full quarter panel.
  ('AUD-8J8809844',
   'Side Panel Section Right – 8J8 809 844',
   'audi-side-panel-section-right-8j8809844',
   'Side Panel Section, right-hand side, for Audi TT (8J). OE number 8J8 809 844. Main group 809 sub-group 844. Sub-group 844 is a side panel section, not a full quarter panel.',
   'quarter-panels', 'genuine-audi',
   '8J8 809 844', '8J8809844', '8J8', '809', '844', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- 8R0 809 837  ·  quarter-panels  ·  LEFT
  --   A genuine quarter panel. Left-hand side.
  ('AUD-8R0809837',
   'Quarter Panel Left – 8R0 809 837',
   'audi-quarter-panel-left-8r0809837',
   'Quarter Panel, left-hand side, for Audi Q5 (8R). OE number 8R0 809 837. Main group 809 sub-group 837. A genuine quarter panel. Left-hand side.',
   'quarter-panels', 'genuine-audi',
   '8R0 809 837', '8R0809837', '8R0', '809', '837', NULL,
   'new', 0.00, 0, TRUE, 3,
   TRUE, TRUE, 24),

  -- 8W8 809 306  ·  quarter-panels  ·  RIGHT
  --   Sub-group 306 is a reinforcement behind the outer panel, not the visible panel itself.
  ('AUD-8W8809306',
   'Panel Reinforcement Right – 8W8 809 306',
   'audi-panel-reinforcement-right-8w8809306',
   'Panel Reinforcement, right-hand side, for Audi A5 Sportback (F5). OE number 8W8 809 306. Main group 809 sub-group 306. Sub-group 306 is a reinforcement behind the outer panel, not the visible panel itself.',
   'quarter-panels', 'genuine-audi',
   '8W8 809 306', '8W8809306', '8W8', '809', '306', NULL,
   'new', 0.00, 0, TRUE, 1,
   TRUE, TRUE, 24),

  -- 80A 809 649 ASTL  ·  quarter-panels  ·  LEFT
  --   Sub-group 649 is a panel extension. Suffix STL again suggests "Stahl" (steel) - third part in the catalogue carrying it.
  ('AUD-80A809649ASTL',
   'Panel Extension Left – 80A 809 649 ASTL',
   'audi-panel-extension-left-80a809649astl',
   'Panel Extension, left-hand side, for Audi Q5 (FY). OE number 80A 809 649 ASTL. Main group 809 sub-group 649. Revision index ASTL. Sub-group 649 is a panel extension. Suffix STL again suggests "Stahl" (steel) - third part in the catalogue carrying it.',
   'quarter-panels', 'genuine-audi',
   '80A 809 649 ASTL', '80A809649ASTL', '80A', '809', '649', 'ASTL',
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- 89A 809 249  ·  quarter-panels  ·  LEFT
  --   Structural reinforcement. EV platform.
  ('AUD-89A809249',
   'Panel Reinforcement Left – 89A 809 249',
   'audi-panel-reinforcement-left-89a809249',
   'Panel Reinforcement, left-hand side, for Audi Q4 e-tron (89). OE number 89A 809 249. Main group 809 sub-group 249. Structural reinforcement. EV platform.',
   'quarter-panels', 'genuine-audi',
   '89A 809 249', '89A809249', '89A', '809', '249', NULL,
   'new', 0.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- 89A 810 422 A  ·  body-brackets  ·  RIGHT
  --   Main group 810 is body rear structure, a different group from the 809 panels.
  ('AUD-89A810422A',
   'Panel Extension Right – 89A 810 422 A',
   'audi-panel-extension-right-89a810422a',
   'Panel Extension, right-hand side, for Audi Q4 e-tron (89). OE number 89A 810 422 A. Main group 810 sub-group 422. Revision index A. Main group 810 is body rear structure, a different group from the 809 panels.',
   'body-brackets', 'genuine-audi',
   '89A 810 422 A', '89A810422A', '89A', '810', '422', 'A',
   'new', 0.00, 0, TRUE, 7,
   FALSE, TRUE, 24),

  -- 420 810 439 A  ·  body-brackets  ·  LEFT
  --   A mounting bracket, not a panel. R8 platform.
  ('AUD-420810439A',
   'Bracket Left – 420 810 439 A',
   'audi-bracket-left-420810439a',
   'Bracket, left-hand side, for Audi R8 (Type 42). OE number 420 810 439 A. Main group 810 sub-group 439. Revision index A. A mounting bracket, not a panel. R8 platform.',
   'body-brackets', 'genuine-audi',
   '420 810 439 A', '420810439A', '420', '810', '439', 'A',
   'new', 0.00, 0, TRUE, 8,
   FALSE, TRUE, 24),

  -- 80A 810 569 A  ·  body-brackets  ·  LEFT
  --   A mounting bracket.
  ('AUD-80A810569A',
   'Bracket Left – 80A 810 569 A',
   'audi-bracket-left-80a810569a',
   'Bracket, left-hand side, for Audi Q5 (FY). OE number 80A 810 569 A. Main group 810 sub-group 569. Revision index A. A mounting bracket.',
   'body-brackets', 'genuine-audi',
   '80A 810 569 A', '80A810569A', '80A', '810', '569', 'A',
   'new', 0.00, 0, TRUE, 4,
   FALSE, TRUE, 24),

  -- 8R0 814 339  ·  body-brackets  ·  LEFT
  --   Main group 814 is FLOOR structure - a floor reinforcement, not a side panel at all.
  ('AUD-8R0814339',
   'Floor Reinforcement Left – 8R0 814 339',
   'audi-floor-reinforcement-left-8r0814339',
   'Floor Reinforcement, left-hand side, for Audi Q5 (8R). OE number 8R0 814 339. Main group 814 sub-group 339. Main group 814 is FLOOR structure - a floor reinforcement, not a side panel at all.',
   'body-brackets', 'genuine-audi',
   '8R0 814 339', '8R0814339', '8R0', '814', '339', NULL,
   'new', 0.00, 0, TRUE, 8,
   FALSE, TRUE, 24),

  -- 4G8 819 301  ·  body-trim
  --   Main group 819 is heating and ventilation. An air vent, not body structure.
  ('AUD-4G8819301',
   'Air Vent / Duct – 4G8 819 301',
   'audi-air-vent-duct-4g8819301',
   'Air Vent / Duct for Audi A7 (C7). OE number 4G8 819 301. Main group 819 sub-group 301. Main group 819 is heating and ventilation. An air vent, not body structure.',
   'body-trim', 'genuine-audi',
   '4G8 819 301', '4G8819301', '4G8', '819', '301', NULL,
   'new', 0.00, 0, TRUE, 4,
   FALSE, TRUE, 24),

  -- 6R0 819 465 C  ·  body-trim
  --   Main group 819, ventilation. VW platform, not Audi-specific.
  ('AUD-6R0819465C',
   'Air Vent / Duct – 6R0 819 465 C',
   'audi-air-vent-duct-6r0819465c',
   'Air Vent / Duct for VW Polo (6R). OE number 6R0 819 465 C. Main group 819 sub-group 465. Revision index C. Main group 819, ventilation. VW platform, not Audi-specific.',
   'body-trim', 'genuine-audi',
   '6R0 819 465 C', '6R0819465C', '6R0', '819', '465', 'C',
   'new', 0.00, 0, TRUE, 11,
   FALSE, TRUE, 24),

  -- 8F0 839 479 E  ·  body-trim
  --   Main group 839 is doors and mouldings. A trim/seal item.
  ('AUD-8F0839479E',
   'Moulding / Seal – 8F0 839 479 E',
   'audi-moulding-seal-8f0839479e',
   'Moulding / Seal for Audi A5 Cabriolet (8F). OE number 8F0 839 479 E. Main group 839 sub-group 479. Revision index E. Main group 839 is doors and mouldings. A trim/seal item.',
   'body-trim', 'genuine-audi',
   '8F0 839 479 E', '8F0839479E', '8F0', '839', '479', 'E',
   'new', 0.00, 0, TRUE, 2,
   FALSE, TRUE, 24),

  -- 8W7 035 411  ·  speakers
  --   Main group 035 is AUDIO, not body. parts.audiusa.com lists this as a rear bass speaker. The A-suffix variant is the premium-audio version - confirm which system the car has.
  ('AUD-8W7035411',
   'Rear Bass Speaker – 8W7 035 411',
   'audi-rear-bass-speaker-8w7035411',
   'Rear Bass Speaker for Audi A5 Sportback / RS5 (F5). OE number 8W7 035 411. Main group 035 sub-group 411. Main group 035 is AUDIO, not body. parts.audiusa.com lists this as a rear bass speaker. The A-suffix variant is the premium-audio version - confirm which system the car has.',
   'speakers', 'genuine-audi',
   '8W7 035 411', '8W7035411', '8W7', '035', '411', NULL,
   'new', 0.00, 0, TRUE, 5,
   FALSE, TRUE, 24),

  -- 8W6 035 411 A  ·  speakers
  --   Main group 035, audio. Base 8W6035411 is listed as the rear bass speaker WITHOUT premium audio; this A revision likely differs. Confirm the audio system.
  ('AUD-8W6035411A',
   'Rear Bass Speaker – 8W6 035 411 A',
   'audi-rear-bass-speaker-8w6035411a',
   'Rear Bass Speaker for Audi A5 / S5 Coupe (F5). OE number 8W6 035 411 A. Main group 035 sub-group 411. Revision index A. Main group 035, audio. Base 8W6035411 is listed as the rear bass speaker WITHOUT premium audio; this A revision likely differs. Confirm the audio system.',
   'speakers', 'genuine-audi',
   '8W6 035 411 A', '8W6035411A', '8W6', '035', '411', 'A',
   'new', 0.00, 0, TRUE, 11,
   FALSE, TRUE, 24),

  -- N90641104  ·  fasteners
  --   An N-number is VW Group standard hardware, not a platform part - it fits across many models. No platform decode applies.
  ('AUD-N90641104',
   'Nut – N90641104',
   'audi-nut-n90641104',
   'Nut for VW Group standard hardware. OE number N90641104. An N-number is VW Group standard hardware, not a platform part - it fits across many models. No platform decode applies.',
   'fasteners', 'genuine-audi',
   'N90641104', 'N90641104', NULL, NULL, NULL, NULL,
   'new', 0.00, 0, TRUE, 58,
   FALSE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_oversized = EXCLUDED.is_oversized,
      is_active = EXCLUDED.is_active, updated_at = now();

-- Side, only where the sub-group actually encodes one.
INSERT INTO part_attributes (sku, attribute_id, value_text) VALUES
  ('AUD-8J8809844', 'body-side', 'right'),
  ('AUD-8R0809837', 'body-side', 'left'),
  ('AUD-8W8809306', 'body-side', 'right'),
  ('AUD-80A809649ASTL', 'body-side', 'left'),
  ('AUD-89A809249', 'body-side', 'left'),
  ('AUD-89A810422A', 'body-side', 'right'),
  ('AUD-420810439A', 'body-side', 'left'),
  ('AUD-80A810569A', 'body-side', 'left'),
  ('AUD-8R0814339', 'body-side', 'left')
ON CONFLICT (sku, attribute_id) DO NOTHING;

COMMIT;
