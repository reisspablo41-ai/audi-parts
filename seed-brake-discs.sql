-- =============================================================================
-- Brake Disc / Pad seed — 25 OE numbers
--
-- HOW THIS WAS BUILT (read before running):
--   Every value below is derived from the VAG part number itself, which is a
--   structured, factual identifier:
--
--       8V0  615301  R
--       ^^^  ^^^^^^  ^
--       |    |       revision index
--       |    component group: 615301/615302 = front disc,
--       |                     615601        = rear disc,
--       |                     698451        = brake pad repair kit
--       platform / type prefix
--
--   No descriptions, images, prices or fitment tables were copied from any
--   retailer. Descriptions here are our own; positions are decoded from the
--   group code and are reliable.
--
-- WHAT YOU MUST DO BEFORE THESE GO LIVE:
--   1. PRICES ARE 0.00 AND is_active = FALSE. Nothing can be sold until you
--      set real pricing from your own supplier terms. This is deliberate --
--      it makes it impossible to accidentally ship a $0.00 rotor.
--   2. FITMENT IS NOT POPULATED. Confirm each number against ETKA and insert
--      part_fitment rows yourself. Inherited fitment data is how you end up
--      sending someone the wrong disc.
--   3. Three prefixes (95C, 9J1, 8MA) could not be identified with confidence
--      and are left NULL -- see the notes at the bottom.
--
-- Targets schema-v2-proposal.sql (needs oe_prefix/oe_group/position, which the
-- current flat schema has nowhere to put).
-- =============================================================================

BEGIN;

-- Dependency guard: parts.brand_id is NOT NULL with an FK to brands, so this
-- row must exist before any INSERT below. Harmless if the schema already
-- seeded it -- this file is runnable standalone and in any order.
INSERT INTO brands (id, name, slug, tier)
VALUES ('genuine-audi', 'Genuine Audi', 'genuine-audi', 'oem')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parts (
  sku, name, slug, description, category_id, brand_id,
  oe_number, oe_normalised, oe_prefix, oe_group, oe_subgroup, oe_index,
  condition, price, core_charge, in_stock, stock_count,
  is_active, warranty_months
) VALUES
  -- 2Q0615601H  ·  Brake Disc (rear)  ·  platform 2Q0: VW Group MQB-A0 (Polo AW / A1 GB)
  ('AUD-2Q0615601H',
   'Rear Brake Disc – 2Q0 615 601 H',
   'audi-brake-disc-2q0615601h',
   'Rear brake disc, OE number 2Q0 615 601 H. Component group 615601 identifies this as a rear disc. Revision index H. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '2Q0 615 601 H', '2Q0615601H', '2Q0', '615', '601', 'H',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 4G8615601E  ·  Brake Disc (rear)  ·  platform 4G8: Audi A7 / S7 (C7 Sportback)
  ('AUD-4G8615601E',
   'Rear Brake Disc – 4G8 615 601 E',
   'audi-brake-disc-4g8615601e',
   'Rear brake disc, OE number 4G8 615 601 E. Component group 615601 identifies this as a rear disc. Revision index E. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '4G8 615 601 E', '4G8615601E', '4G8', '615', '601', 'E',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 95C615601  ·  Brake Disc (rear)  ·  platform 95C: UNIDENTIFIED — verify before listing
  ('AUD-95C615601',
   'Rear Brake Disc – 95C 615 601',
   'audi-brake-disc-95c615601',
   'Rear brake disc, OE number 95C 615 601. Component group 615601 identifies this as a rear disc. Revision index base. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '95C 615 601', '95C615601', '95C', '615', '601', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 4F0615301E  ·  Brake Disc (front)  ·  platform 4F0: Audi A6 (C6)
  ('AUD-4F0615301E',
   'Front Brake Disc – 4F0 615 301 E',
   'audi-brake-disc-4f0615301e',
   'Front brake disc, OE number 4F0 615 301 E. Component group 615301 identifies this as a front disc. Revision index E. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '4F0 615 301 E', '4F0615301E', '4F0', '615', '301', 'E',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 4E0615601L  ·  Brake Disc (rear)  ·  platform 4E0: Audi A8 (D3)
  ('AUD-4E0615601L',
   'Rear Brake Disc – 4E0 615 601 L',
   'audi-brake-disc-4e0615601l',
   'Rear brake disc, OE number 4E0 615 601 L. Component group 615601 identifies this as a rear disc. Revision index L. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '4E0 615 601 L', '4E0615601L', '4E0', '615', '601', 'L',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8E0615601M  ·  Brake Disc (rear)  ·  platform 8E0: Audi A4 (B6 / B7)
  ('AUD-8E0615601M',
   'Rear Brake Disc – 8E0 615 601 M',
   'audi-brake-disc-8e0615601m',
   'Rear brake disc, OE number 8E0 615 601 M. Component group 615601 identifies this as a rear disc. Revision index M. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8E0 615 601 M', '8E0615601M', '8E0', '615', '601', 'M',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 80A615601C  ·  Brake Disc (rear)  ·  platform 80A: Audi Q5 (FY)
  ('AUD-80A615601C',
   'Rear Brake Disc – 80A 615 601 C',
   'audi-brake-disc-80a615601c',
   'Rear brake disc, OE number 80A 615 601 C. Component group 615601 identifies this as a rear disc. Revision index C. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '80A 615 601 C', '80A615601C', '80A', '615', '601', 'C',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 9J1615601  ·  Brake Disc (rear)  ·  platform 9J1: UNIDENTIFIED — verify before listing
  ('AUD-9J1615601',
   'Rear Brake Disc – 9J1 615 601',
   'audi-brake-disc-9j1615601',
   'Rear brake disc, OE number 9J1 615 601. Component group 615601 identifies this as a rear disc. Revision index base. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '9J1 615 601', '9J1615601', '9J1', '615', '601', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 4K0615301AE  ·  Brake Disc (front)  ·  platform 4K0: Audi A6 / A7 (C8)
  ('AUD-4K0615301AE',
   'Front Brake Disc – 4K0 615 301 AE',
   'audi-brake-disc-4k0615301ae',
   'Front brake disc, OE number 4K0 615 301 AE. Component group 615301 identifies this as a front disc. Revision index AE. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '4K0 615 301 AE', '4K0615301AE', '4K0', '615', '301', 'AE',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 9J1615302D  ·  Brake Disc (front)  ·  platform 9J1: UNIDENTIFIED — verify before listing
  ('AUD-9J1615302D',
   'Front Brake Disc – 9J1 615 302 D',
   'audi-brake-disc-9j1615302d',
   'Front brake disc, OE number 9J1 615 302 D. Component group 615302 identifies this as a front disc. Revision index D. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '9J1 615 302 D', '9J1615302D', '9J1', '615', '302', 'D',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 9J1615301A  ·  Brake Disc (front)  ·  platform 9J1: UNIDENTIFIED — verify before listing
  ('AUD-9J1615301A',
   'Front Brake Disc – 9J1 615 301 A',
   'audi-brake-disc-9j1615301a',
   'Front brake disc, OE number 9J1 615 301 A. Component group 615301 identifies this as a front disc. Revision index A. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '9J1 615 301 A', '9J1615301A', '9J1', '615', '301', 'A',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8R0615301G  ·  Brake Disc (front)  ·  platform 8R0: Audi Q5 (8R)
  ('AUD-8R0615301G',
   'Front Brake Disc – 8R0 615 301 G',
   'audi-brake-disc-8r0615301g',
   'Front brake disc, OE number 8R0 615 301 G. Component group 615301 identifies this as a front disc. Revision index G. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8R0 615 301 G', '8R0615301G', '8R0', '615', '301', 'G',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8V0615301R  ·  Brake Disc (front)  ·  platform 8V0: Audi A3 (8V)
  ('AUD-8V0615301R',
   'Front Brake Disc – 8V0 615 301 R',
   'audi-brake-disc-8v0615301r',
   'Front brake disc, OE number 8V0 615 301 R. Component group 615301 identifies this as a front disc. Revision index R. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8V0 615 301 R', '8V0615301R', '8V0', '615', '301', 'R',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 420698451D  ·  Brake Pad Set  ·  platform 420: Audi R8 (Type 42)
  ('AUD-420698451D',
   'Brake Pad Set – 420 698 451 D',
   'audi-brake-pad-set-420698451d',
   'Genuine-specification brake pad repair kit, OE number 420 698 451 D. Supplied as a complete axle set. Revision index D — check for a later revision before ordering, as pad compounds are frequently updated within the same number.',
   'brake-pads', 'genuine-audi',
   '420 698 451 D', '420698451D', '420', '698', '451', 'D',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 1J0615301M  ·  Brake Disc (front)  ·  platform 1J0: VW Group PQ34 (Golf IV / A3 8L era)
  ('AUD-1J0615301M',
   'Front Brake Disc – 1J0 615 301 M',
   'audi-brake-disc-1j0615301m',
   'Front brake disc, OE number 1J0 615 301 M. Component group 615301 identifies this as a front disc. Revision index M. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '1J0 615 301 M', '1J0615301M', '1J0', '615', '301', 'M',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 6R0615301D  ·  Brake Disc (front)  ·  platform 6R0: VW Polo (6R)
  ('AUD-6R0615301D',
   'Front Brake Disc – 6R0 615 301 D',
   'audi-brake-disc-6r0615301d',
   'Front brake disc, OE number 6R0 615 301 D. Component group 615301 identifies this as a front disc. Revision index D. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '6R0 615 301 D', '6R0615301D', '6R0', '615', '301', 'D',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8MA615302A  ·  Brake Disc (front)  ·  platform 8MA: UNIDENTIFIED — verify before listing
  ('AUD-8MA615302A',
   'Front Brake Disc – 8MA 615 302 A',
   'audi-brake-disc-8ma615302a',
   'Front brake disc, OE number 8MA 615 302 A. Component group 615302 identifies this as a front disc. Revision index A. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8MA 615 302 A', '8MA615302A', '8MA', '615', '302', 'A',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 7B0615301B  ·  Brake Disc (front)  ·  platform 7B0: VW Group (Transporter / Touareg era)
  ('AUD-7B0615301B',
   'Front Brake Disc – 7B0 615 301 B',
   'audi-brake-disc-7b0615301b',
   'Front brake disc, OE number 7B0 615 301 B. Component group 615301 identifies this as a front disc. Revision index B. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '7B0 615 301 B', '7B0615301B', '7B0', '615', '301', 'B',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8MA615301  ·  Brake Disc (front)  ·  platform 8MA: UNIDENTIFIED — verify before listing
  ('AUD-8MA615301',
   'Front Brake Disc – 8MA 615 301',
   'audi-brake-disc-8ma615301',
   'Front brake disc, OE number 8MA 615 301. Component group 615301 identifies this as a front disc. Revision index base. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8MA 615 301', '8MA615301', '8MA', '615', '301', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 1J0615301P  ·  Brake Disc (front)  ·  platform 1J0: VW Group PQ34 (Golf IV / A3 8L era)
  ('AUD-1J0615301P',
   'Front Brake Disc – 1J0 615 301 P',
   'audi-brake-disc-1j0615301p',
   'Front brake disc, OE number 1J0 615 301 P. Component group 615301 identifies this as a front disc. Revision index P. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '1J0 615 301 P', '1J0615301P', '1J0', '615', '301', 'P',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 1K0615301AR  ·  Brake Disc (front)  ·  platform 1K0: VW Group PQ35 (Golf V / A3 8P era)
  ('AUD-1K0615301AR',
   'Front Brake Disc – 1K0 615 301 AR',
   'audi-brake-disc-1k0615301ar',
   'Front brake disc, OE number 1K0 615 301 AR. Component group 615301 identifies this as a front disc. Revision index AR. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '1K0 615 301 AR', '1K0615301AR', '1K0', '615', '301', 'AR',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8MA615302  ·  Brake Disc (front)  ·  platform 8MA: UNIDENTIFIED — verify before listing
  ('AUD-8MA615302',
   'Front Brake Disc – 8MA 615 302',
   'audi-brake-disc-8ma615302',
   'Front brake disc, OE number 8MA 615 302. Component group 615302 identifies this as a front disc. Revision index base. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8MA 615 302', '8MA615302', '8MA', '615', '302', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8MA615301A  ·  Brake Disc (front)  ·  platform 8MA: UNIDENTIFIED — verify before listing
  ('AUD-8MA615301A',
   'Front Brake Disc – 8MA 615 301 A',
   'audi-brake-disc-8ma615301a',
   'Front brake disc, OE number 8MA 615 301 A. Component group 615301 identifies this as a front disc. Revision index A. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8MA 615 301 A', '8MA615301A', '8MA', '615', '301', 'A',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 8MA615601  ·  Brake Disc (rear)  ·  platform 8MA: UNIDENTIFIED — verify before listing
  ('AUD-8MA615601',
   'Rear Brake Disc – 8MA 615 601',
   'audi-brake-disc-8ma615601',
   'Rear brake disc, OE number 8MA 615 601. Component group 615601 identifies this as a rear disc. Revision index base. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '8MA 615 601', '8MA615601', '8MA', '615', '601', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 4M0615301AP  ·  Brake Disc (front)  ·  platform 4M0: Audi Q7 (4M)
  ('AUD-4M0615301AP',
   'Front Brake Disc – 4M0 615 301 AP',
   'audi-brake-disc-4m0615301ap',
   'Front brake disc, OE number 4M0 615 301 AP. Component group 615301 identifies this as a front disc. Revision index AP. Sold individually — order two per axle. Confirm disc diameter against your vehicle before ordering; a single platform commonly runs two or three different sizes.',
   'brake-rotors', 'genuine-audi',
   '4M0 615 301 AP', '4M0615301AP', '4M0', '615', '301', 'AP',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24)
ON CONFLICT (sku) DO NOTHING;

-- Position as a filterable spec, so the catalogue can facet on front/rear
-- before anyone has done the ETKA fitment work.
INSERT INTO attribute_definitions (id, category_id, label, unit, data_type, is_filterable, sort_order)
VALUES ('axle-position', 'brake-rotors', 'Axle Position', NULL, 'enum', TRUE, 0)
ON CONFLICT (id) DO NOTHING;
UPDATE attribute_definitions SET enum_values = ARRAY['front','rear'] WHERE id = 'axle-position';

INSERT INTO part_attributes (sku, attribute_id, value_text) VALUES
  ('AUD-2Q0615601H', 'axle-position', 'rear'),
  ('AUD-4G8615601E', 'axle-position', 'rear'),
  ('AUD-95C615601', 'axle-position', 'rear'),
  ('AUD-4F0615301E', 'axle-position', 'front'),
  ('AUD-4E0615601L', 'axle-position', 'rear'),
  ('AUD-8E0615601M', 'axle-position', 'rear'),
  ('AUD-80A615601C', 'axle-position', 'rear'),
  ('AUD-9J1615601', 'axle-position', 'rear'),
  ('AUD-4K0615301AE', 'axle-position', 'front'),
  ('AUD-9J1615302D', 'axle-position', 'front'),
  ('AUD-9J1615301A', 'axle-position', 'front'),
  ('AUD-8R0615301G', 'axle-position', 'front'),
  ('AUD-8V0615301R', 'axle-position', 'front'),
  ('AUD-1J0615301M', 'axle-position', 'front'),
  ('AUD-6R0615301D', 'axle-position', 'front'),
  ('AUD-8MA615302A', 'axle-position', 'front'),
  ('AUD-7B0615301B', 'axle-position', 'front'),
  ('AUD-8MA615301', 'axle-position', 'front'),
  ('AUD-1J0615301P', 'axle-position', 'front'),
  ('AUD-1K0615301AR', 'axle-position', 'front'),
  ('AUD-8MA615302', 'axle-position', 'front'),
  ('AUD-8MA615301A', 'axle-position', 'front'),
  ('AUD-8MA615601', 'axle-position', 'rear'),
  ('AUD-4M0615301AP', 'axle-position', 'front')
ON CONFLICT (sku, attribute_id) DO NOTHING;

-- Revision families. Where two numbers share a prefix and group but carry
-- different indices, one probably supersedes the other -- but direction must be
-- confirmed in ETKA, so these are recorded as cross-references, not as
-- supersessions. Promoting them is a deliberate act, not a guess.
INSERT INTO part_cross_references (sku, ref_number, ref_type) VALUES
  ('AUD-1J0615301M', '1J0615301P', 'interchange'),
  ('AUD-1J0615301P', '1J0615301M', 'interchange'),
  ('AUD-8MA615301', '8MA615301A', 'interchange'),
  ('AUD-8MA615301A', '8MA615301', 'interchange'),
  ('AUD-8MA615302A', '8MA615302', 'interchange'),
  ('AUD-8MA615302', '8MA615302A', 'interchange')
ON CONFLICT (sku, ref_number) DO NOTHING;

COMMIT;

-- =============================================================================
-- PREFIXES NEEDING VERIFICATION
--
--   95C  (1 part)  -- not a prefix we can identify with confidence. Possibly a
--                     Porsche-shared number; 95B is the Macan.
--   9J1  (3 parts) -- unidentified.
--   8MA  (5 parts) -- unidentified, and does not follow the usual VAG type-prefix
--                     shape. Worth checking whether these are OE numbers at all
--                     rather than a supplier's own catalogue codes.
--
-- ALSO WORTH KNOWING: five of these are VW-group platform numbers rather than
-- Audi-specific ones --
--   1J0 (x2) PQ34, 1K0 PQ35, 6R0 VW Polo, 2Q0 MQB-A0, 7B0 Transporter/Touareg.
-- They are legitimate VAG parts and some do fit Audis of the same era, but this
-- is not a clean Audi-only set. Decide whether they belong in an Audi catalogue.
--
-- SANITY CHECK AFTER LOADING:
--   SELECT oe_prefix, oe_group, count(*) FROM parts
--    WHERE sku LIKE 'AUD-%' GROUP BY 1,2 ORDER BY 1,2;
--   SELECT count(*) FROM parts WHERE price = 0 AND is_active;  -- must be 0
-- =============================================================================
