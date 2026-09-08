-- =============================================================================
-- SEED: Audi lighting -- headlights, tail lights and fog lights (27 parts)
--
-- Source: mistlampen.nl product listings (scraped 2026-09-08).
-- Factual data only -- OE numbers, prices, weights, packaging dimensions.
-- Product copy is written here rather than copied from the source.
--
-- PRICES ARE CONVERTED. The source quotes EUR; every price in `parts` is a USD
-- figure (see lib/currency.ts). Rate applied: 1 EUR = 1.08 USD.
-- To re-rate, change EUR_USD in scripts/build-lighting.mjs and regenerate.
--
-- Order of sections matters -- each depends on the one before:
--   1. brands, the A1 8X and A2 8Z generations, and their vehicle rows
--   2. the 27 parts
--   3. 148 part_fitment rows tying them to specific vehicle years
--
-- Safe to re-run: parts upsert on sku, everything else is ON CONFLICT DO NOTHING.
--
-- TO REMOVE THIS SEED:
--   DELETE FROM parts WHERE sku IN (SELECT sku FROM parts WHERE category_id IN
--     ('headlights','tail-lights','fog-lights'));   -- fitment cascades
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. PREREQUISITES
-- ---------------------------------------------------------------------------
-- These are replacement parts, not genuine Audi, and `brands` held only the
-- single 'genuine-audi' row. getStoreParts treats anything that is not
-- 'genuine-audi' as aftermarket, so both rows below list as aftermarket.
INSERT INTO brands (id, name, slug, tier, is_active) VALUES
  ('aftermarket-oe', 'OE-Quality Replacement', 'oe-quality-replacement', 'aftermarket', TRUE),
  ('valeo',          'Valeo',                  'valeo',                  'oe-supplier', TRUE)
ON CONFLICT (id) DO NOTHING;

-- The A1 8X (2010-2018) was absent entirely: `generations` held only a1-gb
-- (2018+), so nineteen of these parts had no generation to attach to.
-- The A2 was absent as a model.
INSERT INTO models (id, make_id, name, slug, sort_order) VALUES
  ('a2', 'audi', 'Audi A2', 'a2', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO generations (id, model_id, code, name, year_start, year_end) VALUES
  ('a1-8x', 'a1', '8X', 'Audi A1 8X', 2010, 2018),
  ('a2-8z', 'a2', '8Z', 'Audi A2 8Z', 1999, 2005)
ON CONFLICT (id) DO NOTHING;

-- One vehicle row per generation-year, matching the existing id convention
-- (<generation>-<year>) and engine_id 'unspecified' as every other row uses.
INSERT INTO vehicles (id, generation_id, engine_id, year, market) VALUES
  ('a1-8x-2010', 'a1-8x', 'unspecified', 2010, 'US'),
  ('a1-8x-2011', 'a1-8x', 'unspecified', 2011, 'US'),
  ('a1-8x-2012', 'a1-8x', 'unspecified', 2012, 'US'),
  ('a1-8x-2013', 'a1-8x', 'unspecified', 2013, 'US'),
  ('a1-8x-2014', 'a1-8x', 'unspecified', 2014, 'US'),
  ('a1-8x-2015', 'a1-8x', 'unspecified', 2015, 'US'),
  ('a1-8x-2016', 'a1-8x', 'unspecified', 2016, 'US'),
  ('a1-8x-2017', 'a1-8x', 'unspecified', 2017, 'US'),
  ('a1-8x-2018', 'a1-8x', 'unspecified', 2018, 'US'),
  ('a2-8z-1999', 'a2-8z', 'unspecified', 1999, 'US'),
  ('a2-8z-2000', 'a2-8z', 'unspecified', 2000, 'US'),
  ('a2-8z-2001', 'a2-8z', 'unspecified', 2001, 'US'),
  ('a2-8z-2002', 'a2-8z', 'unspecified', 2002, 'US'),
  ('a2-8z-2003', 'a2-8z', 'unspecified', 2003, 'US'),
  ('a2-8z-2004', 'a2-8z', 'unspecified', 2004, 'US'),
  ('a2-8z-2005', 'a2-8z', 'unspecified', 2005, 'US')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. PARTS
-- ---------------------------------------------------------------------------
INSERT INTO parts (
  sku, name, slug, description, category_id, brand_id,
  oe_number, oe_normalised, oe_prefix, oe_group, oe_subgroup, oe_index,
  oem_cross_ref, condition, price, weight_kg, length_cm, width_cm, height_cm,
  is_oversized, stock_count, in_stock, warranty_months, is_active, tags
) VALUES
  -- https://www.mistlampen.nl/en/audi-a1-2010-2014-h7-h1-headlight-left
  ('AUD-8X0941003', 'Headlight Left – 8X0 941 003', 'audi-headlight-left-8x0941003', 'Left-hand headlight for the Audi A1 8X, 2010–2014 — H7/H1 halogen with indicator and electric levelling motor, black frame. Replacement unit cross-referenced to OE number 8X0 941 003. Sold individually.', 'headlights', 'aftermarket-oe',
   '8X0 941 003', '8X0941003', '8X0', '941', '003', NULL,
   NULL, 'new', 186.79, 3.553, 33, 23, 60,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-2010-2014-h7-h1-headlight-right
  ('AUD-8X0941004C', 'Headlight Right – 8X0 941 004 C', 'audi-headlight-right-8x0941004c', 'Right-hand headlight for the Audi A1 8X, 2010–2014 — H7/H1 halogen with indicator and electric levelling motor, black frame. Replacement unit cross-referenced to OE number 8X0 941 004 C. Sold individually.', 'headlights', 'aftermarket-oe',
   '8X0 941 004 C', '8X0941004C', '8X0', '941', '004', 'C',
   NULL, 'new', 186.79, 3.553, 33, 23, 60,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','right']),
  -- https://www.mistlampen.nl/en/audi-rear-light-left-without-electrical-part-0301931
  ('AUD-8X0945093D', 'Rear Light Left – 8X0 945 093 D', 'audi-rear-light-left-8x0945093d', 'Left-hand rear light for the Audi A1 8X, 2010–2014 — halogen, outer body-mounted lens, supplied without bulb holder. Replacement unit cross-referenced to OE number 8X0 945 093 D (also supersedes 8X0 945 093). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8X0 945 093 D', '8X0945093D', '8X0', '945', '093', 'D',
   '8X0 945 093', 'new', 74.33, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','left']),
  -- https://www.mistlampen.nl/en/audi-rear-light-left-without-electrical-part-led-0301935
  ('AUD-8X0945093E', 'Rear Light (LED) Left – 8X0 945 093 E', 'audi-rear-light-led-left-8x0945093e', 'Left-hand rear light for the Audi A1 8X, 2010–2014 — LED, outer body-mounted lens, supplied without bulb holder. Replacement unit cross-referenced to OE number 8X0 945 093 E (also supersedes 8X0 945 093 B). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8X0 945 093 E', '8X0945093E', '8X0', '945', '093', 'E',
   '8X0 945 093 B', 'new', 174.33, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','left']),
  -- https://www.mistlampen.nl/en/audi-right-tail-light-without-electrical-part-0301932
  ('AUD-8X0945094D', 'Rear Light Right – 8X0 945 094 D', 'audi-rear-light-right-8x0945094d', 'Right-hand rear light for the Audi A1 8X, 2010–2014 — halogen, outer body-mounted lens, supplied without bulb holder. Replacement unit cross-referenced to OE number 8X0 945 094 D (also supersedes 8X0 945 094). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8X0 945 094 D', '8X0945094D', '8X0', '945', '094', 'D',
   '8X0 945 094', 'new', 74.33, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','right']),
  -- https://www.mistlampen.nl/en/audi-tail-light-right-without-electrical-part-led-0301936
  ('AUD-8X0945094E', 'Rear Light (LED) Right – 8X0 945 094 E', 'audi-rear-light-led-right-8x0945094e', 'Right-hand rear light for the Audi A1 8X, 2010–2014 — LED, outer body-mounted lens, supplied without bulb holder. Replacement unit cross-referenced to OE number 8X0 945 094 E (also supersedes 8X0 945 094 B, 8X0 945 094 A). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8X0 945 094 E', '8X0945094E', '8X0', '945', '094', 'E',
   '8X0 945 094 B, 8X0 945 094 A', 'new', 174.33, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-2010-2014-xenon-headlight-left
  ('AUD-8X0941043', 'Xenon Headlight Left – 8X0 941 043', 'audi-xenon-headlight-left-8x0941043', 'Left-hand xenon headlight for the Audi A1 8X, 2010–2014 — D3S xenon with white indicator lens and levelling motor; ballast, bulb and control module not included. Replacement unit cross-referenced to OE number 8X0 941 043 (also supersedes 8X0 941 029 J, 8X0 941 029 M). Sold individually.', 'headlights', 'aftermarket-oe',
   '8X0 941 043', '8X0941043', '8X0', '941', '043', NULL,
   '8X0 941 029 J, 8X0 941 029 M', 'new', 292.63, 4.159, 33, 24, 61,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-2010-2014-xenon-headlight-right
  ('AUD-8X0941044', 'Xenon Headlight Right – 8X0 941 044', 'audi-xenon-headlight-right-8x0941044', 'Right-hand xenon headlight for the Audi A1 8X, 2010–2014 — D3S xenon with white indicator lens and levelling motor; ballast, bulb and control module not included. Replacement unit cross-referenced to OE number 8X0 941 044 (also supersedes 8X0 941 030 M, 8X0 941 030 J). Sold individually.', 'headlights', 'aftermarket-oe',
   '8X0 941 044', '8X0941044', '8X0', '941', '044', NULL,
   '8X0 941 030 M, 8X0 941 030 J', 'new', 292.63, 4.159, 33, 24, 61,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-2014-2019-fog-light-left-not-s-line
  ('AUD-8XA941699B', 'Fog Light Left – 8XA 941 699 B', 'audi-fog-light-left-8xa941699b', 'Left-hand fog light for the Audi A1 8X, 2014–2018 — H8, for vehicles without S-Line trim. Replacement unit cross-referenced to OE number 8XA 941 699 B (also supersedes 8XA 941 699). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8XA 941 699 B', '8XA941699B', '8XA', '941', '699', 'B',
   '8XA 941 699', 'new', 39.91, 0.63, 17, 15, 33,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-2014-2019-fog-light-right-not-s-line
  ('AUD-8XA941700D', 'Fog Light Right – 8XA 941 700 D', 'audi-fog-light-right-8xa941700d', 'Right-hand fog light for the Audi A1 8X, 2014–2018 — H8, for vehicles without S-Line trim. Replacement unit cross-referenced to OE number 8XA 941 700 D (also supersedes 8XA 941 700 B, 8XA 941 700). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8XA 941 700 D', '8XA941700D', '8XA', '941', '700', 'D',
   '8XA 941 700 B, 8XA 941 700', 'new', 39.91, 0.63, 17, 15, 33,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-2014-2019-s-line-fog-light-right
  ('AUD-8XA941700C', 'Fog Light (S-Line) Right – 8XA 941 700 C', 'audi-fog-light-s-line-right-8xa941700c', 'Right-hand fog light for the Audi A1 8X, 2014–2018 — S-Line bumper fitment, H8 bulb not included. Replacement unit cross-referenced to OE number 8XA 941 700 C (also supersedes 8XA 941 700 A). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8XA 941 700 C', '8XA941700C', '8XA', '941', '700', 'C',
   '8XA 941 700 A', 'new', 55.03, 0.65, 17, 15, 33,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-2014-2019-s-line-fog-light-left
  ('AUD-8XA941699C', 'Fog Light (S-Line) Left – 8XA 941 699 C', 'audi-fog-light-s-line-left-8xa941699c', 'Left-hand fog light for the Audi A1 8X, 2014–2018 — S-Line bumper fitment, H8 bulb not included. Replacement unit cross-referenced to OE number 8XA 941 699 C (also supersedes 8XA 941 699 A). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8XA 941 699 C', '8XA941699C', '8XA', '941', '699', 'C',
   '8XA 941 699 A', 'new', 55.03, 0.65, 17, 15, 33,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-2015-2018-headlight-left
  ('AUD-8XA941003F', 'Headlight Left – 8XA 941 003 F', 'audi-headlight-left-8xa941003f', 'Left-hand headlight for the Audi A1 8X, 2015–2018 — facelift 8XA headlight. Replacement unit cross-referenced to OE number 8XA 941 003 F. Sold individually.', 'headlights', 'aftermarket-oe',
   '8XA 941 003 F', '8XA941003F', '8XA', '941', '003', 'F',
   NULL, 'new', 259.15, 0.389, 36, 25, 61,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-2015-2018-headlight-right
  ('AUD-8XA941004F', 'Headlight Right – 8XA 941 004 F', 'audi-headlight-right-8xa941004f', 'Right-hand headlight for the Audi A1 8X, 2015–2018 — facelift 8XA headlight. Replacement unit cross-referenced to OE number 8XA 941 004 F. Sold individually.', 'headlights', 'aftermarket-oe',
   '8XA 941 004 F', '8XA941004F', '8XA', '941', '004', 'F',
   NULL, 'new', 259.15, 0.389, 36, 25, 61,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-2019-headlight-valeo-left
  ('AUD-82A941003', 'Headlight (Valeo) Left – 82A 941 003', 'audi-headlight-valeo-left-82a941003', 'Left-hand headlight for the Audi A1 GB, 2019–2026 — Valeo unit for the GB-generation A1. Replacement unit cross-referenced to OE number 82A 941 003. Sold individually.', 'headlights', 'valeo',
   '82A 941 003', '82A941003', '82A', '941', '003', NULL,
   NULL, 'new', 250.51, 3.839, 40, 31, 79,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','left']),
  -- https://www.mistlampen.nl/en/audi-a2-fog-light-left
  ('AUD-8Z0941699', 'Fog Light Left – 8Z0 941 699', 'audi-fog-light-left-8z0941699', 'Left-hand fog light for the Audi A2 8Z, 1999–2005 — H7. Replacement unit cross-referenced to OE number 8Z0 941 699. Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8Z0 941 699', '8Z0941699', '8Z0', '941', '699', NULL,
   NULL, 'new', 58.27, 0.37, 14, 12, 15,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','left']),
  -- https://www.mistlampen.nl/en/audi-a2-fog-light-right
  ('AUD-8Z0941700', 'Fog Light Right – 8Z0 941 700', 'audi-fog-light-right-8z0941700', 'Right-hand fog light for the Audi A2 8Z, 1999–2005 — H7. Replacement unit cross-referenced to OE number 8Z0 941 700. Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8Z0 941 700', '8Z0941700', '8Z0', '941', '700', NULL,
   NULL, 'new', 58.27, 0.37, 14, 12, 15,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a1-fog-light-left
  ('AUD-8T0941699E', 'Fog Light Left – 8T0 941 699 E', 'audi-fog-light-left-8t0941699e', 'Left-hand fog light for the Audi A1 8X, 2010–2018 — round fog lamp; the 8T0 941 699 casting is shared across several Audi platforms. Replacement unit cross-referenced to OE number 8T0 941 699 E (also supersedes 8T0 941 699). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8T0 941 699 E', '8T0941699E', '8T0', '941', '699', 'E',
   '8T0 941 699', 'new', 46.39, 0.376, 14, 13, 14,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','left']),
  -- https://www.mistlampen.nl/en/audi-a1-fog-light-right
  ('AUD-8T0941700E', 'Fog Light Right – 8T0 941 700 E', 'audi-fog-light-right-8t0941700e', 'Right-hand fog light for the Audi A1 8X, 2010–2018 — round fog lamp; the 8T0 941 700 casting is shared across several Audi platforms. Replacement unit cross-referenced to OE number 8T0 941 700 E (also supersedes 8T0 941 700). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8T0 941 700 E', '8T0941700E', '8T0', '941', '700', 'E',
   '8T0 941 700', 'new', 28.03, 0.39, 14, 13, 14,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-inner-rear-light-glass-left-5d-0334937
  ('AUD-8P4945093D', 'Rear Light Lens (Inner) Left – 8P4 945 093 D', 'audi-rear-light-lens-inner-left-8p4945093d', 'Left-hand rear light lens for the Audi A3 8P, 2008–2012 — inner tailgate-mounted lens for the 5-door Sportback. Replacement unit cross-referenced to OE number 8P4 945 093 D. Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8P4 945 093 D', '8P4945093D', '8P4', '945', '093', 'D',
   NULL, 'new', 44.54, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','left']),
  -- https://www.mistlampen.nl/en/audi-a3-2012-2016-3-5-drs-s-line-fog-light-right
  ('AUD-8V0941700D', 'Fog Light (S-Line) Right – 8V0 941 700 D', 'audi-fog-light-s-line-right-8v0941700d', 'Right-hand fog light for the Audi A3 8V, 2012–2016 — S-Line bumper, 3-door and 5-door. Replacement unit cross-referenced to OE number 8V0 941 700 D. Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8V0 941 700 D', '8V0941700D', '8V0', '941', '700', 'D',
   NULL, 'new', 46.39, 0.6, 17, 16, 30,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a3-2012-2016-fog-light-right
  ('AUD-8V0941700F', 'Fog Light Right – 8V0 941 700 F', 'audi-fog-light-right-8v0941700f', 'Right-hand fog light for the Audi A3 8V, 2012–2016 — standard bumper. Replacement unit cross-referenced to OE number 8V0 941 700 F (also supersedes 8V0 941 700 C, 8V0 941 700). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8V0 941 700 F', '8V0941700F', '8V0', '941', '700', 'F',
   '8V0 941 700 C, 8V0 941 700', 'new', 43.15, 0.625, 17, 15, 29,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a3-2012-2016-fog-light-left
  ('AUD-8V0941699F', 'Fog Light Left – 8V0 941 699 F', 'audi-fog-light-left-8v0941699f', 'Left-hand fog light for the Audi A3 8V, 2012–2016 — standard bumper. Replacement unit cross-referenced to OE number 8V0 941 699 F (also supersedes 8V0 941 699 C, 8V0 941 699). Sold individually.', 'fog-lights', 'aftermarket-oe',
   '8V0 941 699 F', '8V0941699F', '8V0', '941', '699', 'F',
   '8V0 941 699 C, 8V0 941 699', 'new', 43.15, 0.625, 17, 15, 29,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','fog-lights','left']),
  -- https://www.mistlampen.nl/en/audi-rear-light-left-5-d-outer-led-0336935
  ('AUD-8V4945095D', 'Rear Light (Outer, LED) Left – 8V4 945 095 D', 'audi-rear-light-outer-led-left-8v4945095d', 'Left-hand rear light for the Audi A3 8V, 2012–2016 — outer body-mounted LED lamp for the 5-door Sportback. Replacement unit cross-referenced to OE number 8V4 945 095 D (also supersedes 8V4 945 095 A). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8V4 945 095 D', '8V4945095D', '8V4', '945', '095', 'D',
   '8V4 945 095 A', 'new', 148.74, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','left']),
  -- https://www.mistlampen.nl/en/audi-right-rear-light-5-d-outer-led-0336936
  ('AUD-8V4945096D', 'Rear Light (Outer, LED) Right – 8V4 945 096 D', 'audi-rear-light-outer-led-right-8v4945096d', 'Right-hand rear light for the Audi A3 8V, 2012–2016 — outer body-mounted LED lamp for the 5-door Sportback. Replacement unit cross-referenced to OE number 8V4 945 096 D (also supersedes 8V4 945 096 A). Sold individually.', 'tail-lights', 'aftermarket-oe',
   '8V4 945 096 D', '8V4945096D', '8V4', '945', '096', 'D',
   '8V4 945 096 A', 'new', 148.74, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','tail-lights','right']),
  -- https://www.mistlampen.nl/en/audi-a3-sedan-2012-2016-xenon-led-headlight-left
  ('AUD-8V0941043M', 'Xenon/LED Headlight Left – 8V0 941 043 M', 'audi-xenon-led-headlight-left-8v0941043m', 'Left-hand xenon/led headlight for the Audi A3 8V, 2012–2016 — xenon with LED daytime running light, saloon. Replacement unit cross-referenced to OE number 8V0 941 043 M (also supersedes 8V0 941 043 C, 8V0 941 005 C). Sold individually.', 'headlights', 'aftermarket-oe',
   '8V0 941 043 M', '8V0941043M', '8V0', '941', '043', 'M',
   '8V0 941 043 C, 8V0 941 005 C', 'new', 339.07, 4.516, 38, 28, 62,
   TRUE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','left']),
  -- https://www.mistlampen.nl/en/audi-double-headlight-for-right-24-led-valeo-electric-adjustment-with-motor-black-0367964v
  ('AUD-8Y0941012', 'LED Headlight (Valeo) Right – 8Y0 941 012', 'audi-led-headlight-valeo-right-8y0941012', 'Right-hand led headlight for the Audi A3 8Y, 2020–2024 — Valeo LED unit with electric adjustment motor, black frame. Replacement unit cross-referenced to OE number 8Y0 941 012. Sold individually.', 'headlights', 'valeo',
   '8Y0 941 012', '8Y0941012', '8Y0', '941', '012', NULL,
   NULL, 'new', 631.03, NULL, NULL, NULL, NULL,
   FALSE, 4, TRUE, 24, TRUE, ARRAY['lighting','headlights','right'])
ON CONFLICT (sku) DO UPDATE SET
  name          = EXCLUDED.name,
  description   = EXCLUDED.description,
  category_id   = EXCLUDED.category_id,
  brand_id      = EXCLUDED.brand_id,
  oem_cross_ref = EXCLUDED.oem_cross_ref,
  price         = EXCLUDED.price,
  weight_kg     = EXCLUDED.weight_kg,
  length_cm     = EXCLUDED.length_cm,
  width_cm      = EXCLUDED.width_cm,
  height_cm     = EXCLUDED.height_cm,
  is_oversized  = EXCLUDED.is_oversized,
  is_active     = TRUE,
  updated_at    = now();

-- ---------------------------------------------------------------------------
-- 3. FITMENT  (148 rows)
--
-- One row per vehicle-year the lamp fits, which is what the shop's model+year
-- filter resolves against. This roughly doubles the catalogue's fitment
-- coverage on its own.
--
-- Cleared first rather than upserted: part_fitment is UNIQUE on
-- (sku, vehicle_id, position, qualifier), and qualifier is NULL for every row
-- here. Postgres treats NULLs as distinct in a unique index, so ON CONFLICT
-- could neither be named for this constraint nor actually dedupe. Deleting
-- this seed's own SKUs first is what makes a re-run idempotent -- and it
-- touches nothing outside the 27 parts above.
-- ---------------------------------------------------------------------------
DELETE FROM part_fitment WHERE sku IN (
  'AUD-8X0941003',
  'AUD-8X0941004C',
  'AUD-8X0945093D',
  'AUD-8X0945093E',
  'AUD-8X0945094D',
  'AUD-8X0945094E',
  'AUD-8X0941043',
  'AUD-8X0941044',
  'AUD-8XA941699B',
  'AUD-8XA941700D',
  'AUD-8XA941700C',
  'AUD-8XA941699C',
  'AUD-8XA941003F',
  'AUD-8XA941004F',
  'AUD-82A941003',
  'AUD-8Z0941699',
  'AUD-8Z0941700',
  'AUD-8T0941699E',
  'AUD-8T0941700E',
  'AUD-8P4945093D',
  'AUD-8V0941700D',
  'AUD-8V0941700F',
  'AUD-8V0941699F',
  'AUD-8V4945095D',
  'AUD-8V4945096D',
  'AUD-8V0941043M',
  'AUD-8Y0941012'
);

INSERT INTO part_fitment (sku, vehicle_id, position, quantity_required, is_verified) VALUES
  ('AUD-8X0941003', 'a1-8x-2010', 'left', 1, TRUE),
  ('AUD-8X0941003', 'a1-8x-2011', 'left', 1, TRUE),
  ('AUD-8X0941003', 'a1-8x-2012', 'left', 1, TRUE),
  ('AUD-8X0941003', 'a1-8x-2013', 'left', 1, TRUE),
  ('AUD-8X0941003', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8X0941004C', 'a1-8x-2010', 'right', 1, TRUE),
  ('AUD-8X0941004C', 'a1-8x-2011', 'right', 1, TRUE),
  ('AUD-8X0941004C', 'a1-8x-2012', 'right', 1, TRUE),
  ('AUD-8X0941004C', 'a1-8x-2013', 'right', 1, TRUE),
  ('AUD-8X0941004C', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8X0945093D', 'a1-8x-2010', 'left', 1, TRUE),
  ('AUD-8X0945093D', 'a1-8x-2011', 'left', 1, TRUE),
  ('AUD-8X0945093D', 'a1-8x-2012', 'left', 1, TRUE),
  ('AUD-8X0945093D', 'a1-8x-2013', 'left', 1, TRUE),
  ('AUD-8X0945093D', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8X0945093E', 'a1-8x-2010', 'left', 1, TRUE),
  ('AUD-8X0945093E', 'a1-8x-2011', 'left', 1, TRUE),
  ('AUD-8X0945093E', 'a1-8x-2012', 'left', 1, TRUE),
  ('AUD-8X0945093E', 'a1-8x-2013', 'left', 1, TRUE),
  ('AUD-8X0945093E', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8X0945094D', 'a1-8x-2010', 'right', 1, TRUE),
  ('AUD-8X0945094D', 'a1-8x-2011', 'right', 1, TRUE),
  ('AUD-8X0945094D', 'a1-8x-2012', 'right', 1, TRUE),
  ('AUD-8X0945094D', 'a1-8x-2013', 'right', 1, TRUE),
  ('AUD-8X0945094D', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8X0945094E', 'a1-8x-2010', 'right', 1, TRUE),
  ('AUD-8X0945094E', 'a1-8x-2011', 'right', 1, TRUE),
  ('AUD-8X0945094E', 'a1-8x-2012', 'right', 1, TRUE),
  ('AUD-8X0945094E', 'a1-8x-2013', 'right', 1, TRUE),
  ('AUD-8X0945094E', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8X0941043', 'a1-8x-2010', 'left', 1, TRUE),
  ('AUD-8X0941043', 'a1-8x-2011', 'left', 1, TRUE),
  ('AUD-8X0941043', 'a1-8x-2012', 'left', 1, TRUE),
  ('AUD-8X0941043', 'a1-8x-2013', 'left', 1, TRUE),
  ('AUD-8X0941043', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8X0941044', 'a1-8x-2010', 'right', 1, TRUE),
  ('AUD-8X0941044', 'a1-8x-2011', 'right', 1, TRUE),
  ('AUD-8X0941044', 'a1-8x-2012', 'right', 1, TRUE),
  ('AUD-8X0941044', 'a1-8x-2013', 'right', 1, TRUE),
  ('AUD-8X0941044', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8XA941699B', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8XA941699B', 'a1-8x-2015', 'left', 1, TRUE),
  ('AUD-8XA941699B', 'a1-8x-2016', 'left', 1, TRUE),
  ('AUD-8XA941699B', 'a1-8x-2017', 'left', 1, TRUE),
  ('AUD-8XA941699B', 'a1-8x-2018', 'left', 1, TRUE),
  ('AUD-8XA941700D', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8XA941700D', 'a1-8x-2015', 'right', 1, TRUE),
  ('AUD-8XA941700D', 'a1-8x-2016', 'right', 1, TRUE),
  ('AUD-8XA941700D', 'a1-8x-2017', 'right', 1, TRUE),
  ('AUD-8XA941700D', 'a1-8x-2018', 'right', 1, TRUE),
  ('AUD-8XA941700C', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8XA941700C', 'a1-8x-2015', 'right', 1, TRUE),
  ('AUD-8XA941700C', 'a1-8x-2016', 'right', 1, TRUE),
  ('AUD-8XA941700C', 'a1-8x-2017', 'right', 1, TRUE),
  ('AUD-8XA941700C', 'a1-8x-2018', 'right', 1, TRUE),
  ('AUD-8XA941699C', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8XA941699C', 'a1-8x-2015', 'left', 1, TRUE),
  ('AUD-8XA941699C', 'a1-8x-2016', 'left', 1, TRUE),
  ('AUD-8XA941699C', 'a1-8x-2017', 'left', 1, TRUE),
  ('AUD-8XA941699C', 'a1-8x-2018', 'left', 1, TRUE),
  ('AUD-8XA941003F', 'a1-8x-2015', 'left', 1, TRUE),
  ('AUD-8XA941003F', 'a1-8x-2016', 'left', 1, TRUE),
  ('AUD-8XA941003F', 'a1-8x-2017', 'left', 1, TRUE),
  ('AUD-8XA941003F', 'a1-8x-2018', 'left', 1, TRUE),
  ('AUD-8XA941004F', 'a1-8x-2015', 'right', 1, TRUE),
  ('AUD-8XA941004F', 'a1-8x-2016', 'right', 1, TRUE),
  ('AUD-8XA941004F', 'a1-8x-2017', 'right', 1, TRUE),
  ('AUD-8XA941004F', 'a1-8x-2018', 'right', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2019', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2020', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2021', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2022', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2023', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2024', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2025', 'left', 1, TRUE),
  ('AUD-82A941003', 'a1-gb-2026', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-1999', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2000', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2001', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2002', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2003', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2004', 'left', 1, TRUE),
  ('AUD-8Z0941699', 'a2-8z-2005', 'left', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-1999', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2000', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2001', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2002', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2003', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2004', 'right', 1, TRUE),
  ('AUD-8Z0941700', 'a2-8z-2005', 'right', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2010', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2011', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2012', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2013', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2014', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2015', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2016', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2017', 'left', 1, TRUE),
  ('AUD-8T0941699E', 'a1-8x-2018', 'left', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2010', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2011', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2012', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2013', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2014', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2015', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2016', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2017', 'right', 1, TRUE),
  ('AUD-8T0941700E', 'a1-8x-2018', 'right', 1, TRUE),
  ('AUD-8P4945093D', 'a3-8p-2008', 'left', 1, TRUE),
  ('AUD-8P4945093D', 'a3-8p-2009', 'left', 1, TRUE),
  ('AUD-8P4945093D', 'a3-8p-2010', 'left', 1, TRUE),
  ('AUD-8P4945093D', 'a3-8p-2011', 'left', 1, TRUE),
  ('AUD-8P4945093D', 'a3-8p-2012', 'left', 1, TRUE),
  ('AUD-8V0941700D', 'a3-8v-2012', 'right', 1, TRUE),
  ('AUD-8V0941700D', 'a3-8v-2013', 'right', 1, TRUE),
  ('AUD-8V0941700D', 'a3-8v-2014', 'right', 1, TRUE),
  ('AUD-8V0941700D', 'a3-8v-2015', 'right', 1, TRUE),
  ('AUD-8V0941700D', 'a3-8v-2016', 'right', 1, TRUE),
  ('AUD-8V0941700F', 'a3-8v-2012', 'right', 1, TRUE),
  ('AUD-8V0941700F', 'a3-8v-2013', 'right', 1, TRUE),
  ('AUD-8V0941700F', 'a3-8v-2014', 'right', 1, TRUE),
  ('AUD-8V0941700F', 'a3-8v-2015', 'right', 1, TRUE),
  ('AUD-8V0941700F', 'a3-8v-2016', 'right', 1, TRUE),
  ('AUD-8V0941699F', 'a3-8v-2012', 'left', 1, TRUE),
  ('AUD-8V0941699F', 'a3-8v-2013', 'left', 1, TRUE),
  ('AUD-8V0941699F', 'a3-8v-2014', 'left', 1, TRUE),
  ('AUD-8V0941699F', 'a3-8v-2015', 'left', 1, TRUE),
  ('AUD-8V0941699F', 'a3-8v-2016', 'left', 1, TRUE),
  ('AUD-8V4945095D', 'a3-8v-2012', 'left', 1, TRUE),
  ('AUD-8V4945095D', 'a3-8v-2013', 'left', 1, TRUE),
  ('AUD-8V4945095D', 'a3-8v-2014', 'left', 1, TRUE),
  ('AUD-8V4945095D', 'a3-8v-2015', 'left', 1, TRUE),
  ('AUD-8V4945095D', 'a3-8v-2016', 'left', 1, TRUE),
  ('AUD-8V4945096D', 'a3-8v-2012', 'right', 1, TRUE),
  ('AUD-8V4945096D', 'a3-8v-2013', 'right', 1, TRUE),
  ('AUD-8V4945096D', 'a3-8v-2014', 'right', 1, TRUE),
  ('AUD-8V4945096D', 'a3-8v-2015', 'right', 1, TRUE),
  ('AUD-8V4945096D', 'a3-8v-2016', 'right', 1, TRUE),
  ('AUD-8V0941043M', 'a3-8v-2012', 'left', 1, TRUE),
  ('AUD-8V0941043M', 'a3-8v-2013', 'left', 1, TRUE),
  ('AUD-8V0941043M', 'a3-8v-2014', 'left', 1, TRUE),
  ('AUD-8V0941043M', 'a3-8v-2015', 'left', 1, TRUE),
  ('AUD-8V0941043M', 'a3-8v-2016', 'left', 1, TRUE),
  ('AUD-8Y0941012', 'a3-8y-2020', 'right', 1, TRUE),
  ('AUD-8Y0941012', 'a3-8y-2021', 'right', 1, TRUE),
  ('AUD-8Y0941012', 'a3-8y-2022', 'right', 1, TRUE),
  ('AUD-8Y0941012', 'a3-8y-2023', 'right', 1, TRUE),
  ('AUD-8Y0941012', 'a3-8y-2024', 'right', 1, TRUE)
;

COMMIT;


-- =============================================================================
-- VERIFY
-- =============================================================================
-- SELECT category_id, count(*) FROM parts
--  WHERE category_id IN ('headlights','tail-lights','fog-lights')
--  GROUP BY 1;
--
-- Fitment reachable through the shop's model filter:
-- SELECT m.name, count(DISTINCT pf.sku) AS parts
--   FROM part_fitment pf
--   JOIN vehicles v    ON v.id = pf.vehicle_id
--   JOIN generations g ON g.id = v.generation_id
--   JOIN models m      ON m.id = g.model_id
--  GROUP BY m.name ORDER BY parts DESC;
--
-- Must return no rows -- every fitment row needs a real vehicle:
-- SELECT pf.sku, pf.vehicle_id FROM part_fitment pf
--   LEFT JOIN vehicles v ON v.id = pf.vehicle_id WHERE v.id IS NULL;
-- =============================================================================