-- =============================================================================
-- Bumper seed -- 24 parts. 28 URLs supplied; 4 exact repeats removed
-- (8Y0807065KGRU, 8Y0807183B, 1K0511353N, 8MA512131B).
--
-- "BUMPER" MEANS FOUR DIFFERENT THINGS IN THIS BATCH. Only 9 of 24 are actual
-- bumper parts:
--   807  bumpers ................. 9 parts  -> Bumpers
--   412 / 511 / 512  SUSPENSION .. 4 parts  -> Bump Stops (a "bumper" in the
--                                              suspension sense: a rubber stop)
--   955  washer / wiper system ... 3 parts  -> Body Trim
--   882  SEATS ................... 1 part   -> Body Trim
--   823  BONNET / HOOD ........... 1 part   -> Body Trim
--   809 / 805 / N- / WHT- hardware 6 parts  -> Clips & Fasteners
--
-- GRU SUFFIX = "Grundierung", German for primer. Five parts here are supplied
-- PRIMED, NOT PAINTED. That is a material customer expectation — a $887 bumper
-- cover arriving in grey primer generates a complaint if the listing did not
-- say so. It is stated in every affected part name and description.
--
-- PRICING. Two observations:
--     8Y0807065EGRU   MSRP $1,231.66, dealer $886.80  (family match)
--     1K0412303B      $29.70-36.58 across three retailers (exact)
-- The rest are modelled from typical trade levels for the component type and
-- marked DERIVED.
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
  -- [MED] 8Y0 807 065 KGRU  ·  front-bumpers  ·  Audi A3 (8Y)
  --   Family match: 8Y0807065EGRU MSRP $1,231.66, dealer price $886.80. Suffix GRU = "Grundierung" — supplied PRIMED, not painted. Paint is extra.
  ('AUD-8Y0807065KGRU',
   'Front Bumper Cover (Primed) – 8Y0 807 065 KGRU',
   'audi-front-bumper-cover-primed-8y0807065kgru',
   'Front Bumper Cover (Primed) for Audi A3 (8Y). OE number 8Y0 807 065 KGRU. Main group 807 sub-group 065. Revision index KGRU. Family match: 8Y0807065EGRU MSRP $1,231.66, dealer price $886.80. Suffix GRU = "Grundierung" — supplied PRIMED, not painted. Paint is extra.  Supplied PRIMED (GRU) — paint and preparation are not included.',
   'front-bumpers', 'genuine-audi',
   '8Y0 807 065 KGRU', '8Y0807065KGRU', '8Y0', '807', '065', 'KGRU',
   'new', 886.80, 0, TRUE, 4,
   TRUE, TRUE, 24),

  -- [HIGH] 1K0 412 303 B  ·  bump-stops  ·  VW Group PQ35 (Golf V / A3 8P)
  --   EXACT - eEuroparts $29.70, FCP Euro $36.58, also stocked by ECS. Priced each.
  ('AUD-1K0412303B',
   'Front Strut Bump Stop – 1K0 412 303 B',
   'audi-front-strut-bump-stop-1k0412303b',
   'Front Strut Bump Stop for VW Group PQ35 (Golf V / A3 8P). OE number 1K0 412 303 B. Main group 412 sub-group 303. Revision index B. EXACT - eEuroparts $29.70, FCP Euro $36.58, also stocked by ECS. Priced each.',
   'bump-stops', 'genuine-audi',
   '1K0 412 303 B', '1K0412303B', '1K0', '412', '303', 'B',
   'new', 32.00, 0, TRUE, 30,
   FALSE, TRUE, 24),

  -- [MED] 1K0 412 303 M  ·  bump-stops  ·  VW Group PQ35 (Golf V / A3 8P)
  --   Sibling revision of 1K0412303B. Family runs $29-47 across variants.
  ('AUD-1K0412303M',
   'Front Strut Bump Stop – 1K0 412 303 M',
   'audi-front-strut-bump-stop-1k0412303m',
   'Front Strut Bump Stop for VW Group PQ35 (Golf V / A3 8P). OE number 1K0 412 303 M. Main group 412 sub-group 303. Revision index M. Sibling revision of 1K0412303B. Family runs $29-47 across variants.',
   'bump-stops', 'genuine-audi',
   '1K0 412 303 M', '1K0412303M', '1K0', '412', '303', 'M',
   'new', 32.00, 0, TRUE, 27,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y0 807 319 C  ·  bumpers  ·  Audi A3 (8Y)
  --   Structural rail. Odd sub-group = left.
  ('AUD-8Y0807319C',
   'Bumper Support Rail Left – 8Y0 807 319 C',
   'audi-bumper-support-rail-left-8y0807319c',
   'Bumper Support Rail Left for Audi A3 (8Y). OE number 8Y0 807 319 C. Main group 807 sub-group 319. Revision index C. Structural rail. Odd sub-group = left.',
   'bumpers', 'genuine-audi',
   '8Y0 807 319 C', '8Y0807319C', '8Y0', '807', '319', 'C',
   'new', 180.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [DERIVED] 8Y0 807 320 C  ·  bumpers  ·  Audi A3 (8Y)
  --   Structural rail. Even sub-group = right.
  ('AUD-8Y0807320C',
   'Bumper Support Rail Right – 8Y0 807 320 C',
   'audi-bumper-support-rail-right-8y0807320c',
   'Bumper Support Rail Right for Audi A3 (8Y). OE number 8Y0 807 320 C. Main group 807 sub-group 320. Revision index C. Structural rail. Even sub-group = right.',
   'bumpers', 'genuine-audi',
   '8Y0 807 320 C', '8Y0807320C', '8Y0', '807', '320', 'C',
   'new', 180.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [DERIVED] 8Y0 807 550 H  ·  bumpers  ·  Audi A3 (8Y)
  --   Energy-absorbing foam behind the cover.
  ('AUD-8Y0807550H',
   'Impact Bar Insulator – 8Y0 807 550 H',
   'audi-impact-bar-insulator-8y0807550h',
   'Impact Bar Insulator for Audi A3 (8Y). OE number 8Y0 807 550 H. Main group 807 sub-group 550. Revision index H. Energy-absorbing foam behind the cover.',
   'bumpers', 'genuine-audi',
   '8Y0 807 550 H', '8Y0807550H', '8Y0', '807', '550', 'H',
   'new', 95.00, 0, TRUE, 2,
   FALSE, TRUE, 24),

  -- [DERIVED] 4S8 807 649 FGRU  ·  bumpers  ·  Audi R8 (Type 4S)
  --   GRU = primed, not painted.
  ('AUD-4S8807649FGRU',
   'Bumper Cover Trim (Primed) – 4S8 807 649 FGRU',
   'audi-bumper-cover-trim-primed-4s8807649fgru',
   'Bumper Cover Trim (Primed) for Audi R8 (Type 4S). OE number 4S8 807 649 FGRU. Main group 807 sub-group 649. Revision index FGRU. GRU = primed, not painted.  Supplied PRIMED (GRU) — paint and preparation are not included.',
   'bumpers', 'genuine-audi',
   '4S8 807 649 FGRU', '4S8807649FGRU', '4S8', '807', '649', 'FGRU',
   'new', 220.00, 0, TRUE, 2,
   TRUE, TRUE, 24),

  -- [DERIVED] 8Y5 807 739  ·  bumpers  ·  Audi A3 Saloon (8Y)
  --   modelled from typical trade level for this component type
  ('AUD-8Y5807739',
   'Bumper Cover Catch Left – 8Y5 807 739',
   'audi-bumper-cover-catch-left-8y5807739',
   'Bumper Cover Catch Left for Audi A3 Saloon (8Y). OE number 8Y5 807 739. Main group 807 sub-group 739.',
   'bumpers', 'genuine-audi',
   '8Y5 807 739', '8Y5807739', '8Y5', '807', '739', NULL,
   'new', 25.00, 0, TRUE, 5,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y5 807 740  ·  bumpers  ·  Audi A3 Saloon (8Y)
  --   modelled from typical trade level for this component type
  ('AUD-8Y5807740',
   'Bumper Cover Catch Right – 8Y5 807 740',
   'audi-bumper-cover-catch-right-8y5807740',
   'Bumper Cover Catch Right for Audi A3 Saloon (8Y). OE number 8Y5 807 740. Main group 807 sub-group 740.',
   'bumpers', 'genuine-audi',
   '8Y5 807 740', '8Y5807740', '8Y5', '807', '740', NULL,
   'new', 25.00, 0, TRUE, 4,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y0 807 183 B  ·  bumpers  ·  Audi A3 (8Y)
  --   modelled from typical trade level for this component type
  ('AUD-8Y0807183B',
   'Bumper Guide – 8Y0 807 183 B',
   'audi-bumper-guide-8y0807183b',
   'Bumper Guide for Audi A3 (8Y). OE number 8Y0 807 183 B. Main group 807 sub-group 183. Revision index B.',
   'bumpers', 'genuine-audi',
   '8Y0 807 183 B', '8Y0807183B', '8Y0', '807', '183', 'B',
   'new', 22.00, 0, TRUE, 4,
   FALSE, TRUE, 24),

  -- [DERIVED] 8V5 807 329 A  ·  bumpers  ·  Audi A3 Saloon (8V)
  --   modelled from typical trade level for this component type
  ('AUD-8V5807329A',
   'Bumper Bracket – 8V5 807 329 A',
   'audi-bumper-bracket-8v5807329a',
   'Bumper Bracket for Audi A3 Saloon (8V). OE number 8V5 807 329 A. Main group 807 sub-group 329. Revision index A.',
   'bumpers', 'genuine-audi',
   '8V5 807 329 A', '8V5807329A', '8V5', '807', '329', 'A',
   'new', 35.00, 0, TRUE, 4,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y0 955 159  ·  body-trim  ·  Audi A3 (8Y)
  --   Main group 955 is the WASHER/WIPER system, not bumpers — the source URL calls it a bumper cover bracket, but it belongs to the washer assembly mounted behind the bumper.
  ('AUD-8Y0955159',
   'Washer System Bracket – 8Y0 955 159',
   'audi-washer-system-bracket-8y0955159',
   'Washer System Bracket for Audi A3 (8Y). OE number 8Y0 955 159. Main group 955 sub-group 159. Main group 955 is the WASHER/WIPER system, not bumpers — the source URL calls it a bumper cover bracket, but it belongs to the washer assembly mounted behind the bumper.',
   'body-trim', 'genuine-audi',
   '8Y0 955 159', '8Y0955159', '8Y0', '955', '159', NULL,
   'new', 35.00, 0, TRUE, 11,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y0 955 275 CGRU  ·  body-trim  ·  Audi A3 (8Y)
  --   Group 955, washer system. GRU = primed — must be painted to body colour.
  ('AUD-8Y0955275CGRU',
   'Headlight Washer Nozzle Cap (Primed) – 8Y0 955 275 CGRU',
   'audi-headlight-washer-nozzle-cap-primed-8y0955275cgru',
   'Headlight Washer Nozzle Cap (Primed) for Audi A3 (8Y). OE number 8Y0 955 275 CGRU. Main group 955 sub-group 275. Revision index CGRU. Group 955, washer system. GRU = primed — must be painted to body colour.  Supplied PRIMED (GRU) — paint and preparation are not included.',
   'body-trim', 'genuine-audi',
   '8Y0 955 275 CGRU', '8Y0955275CGRU', '8Y0', '955', '275', 'CGRU',
   'new', 28.00, 0, TRUE, 19,
   FALSE, TRUE, 24),

  -- [DERIVED] 8Y0 955 276 CGRU  ·  body-trim  ·  Audi A3 (8Y)
  --   Group 955, washer system. GRU = primed.
  ('AUD-8Y0955276CGRU',
   'Headlight Washer Nozzle Cap (Primed) – 8Y0 955 276 CGRU',
   'audi-headlight-washer-nozzle-cap-primed-8y0955276cgru',
   'Headlight Washer Nozzle Cap (Primed) for Audi A3 (8Y). OE number 8Y0 955 276 CGRU. Main group 955 sub-group 276. Revision index CGRU. Group 955, washer system. GRU = primed.  Supplied PRIMED (GRU) — paint and preparation are not included.',
   'body-trim', 'genuine-audi',
   '8Y0 955 276 CGRU', '8Y0955276CGRU', '8Y0', '955', '276', 'CGRU',
   'new', 28.00, 0, TRUE, 17,
   FALSE, TRUE, 24),

  -- [DERIVED] 1K0 511 353 N  ·  bump-stops  ·  VW Group PQ35 (Golf V / A3 8P)
  --   Main group 511 is REAR SUSPENSION, not bumpers.
  ('AUD-1K0511353N',
   'Rear Bump Stop – 1K0 511 353 N',
   'audi-rear-bump-stop-1k0511353n',
   'Rear Bump Stop for VW Group PQ35 (Golf V / A3 8P). OE number 1K0 511 353 N. Main group 511 sub-group 353. Revision index N. Main group 511 is REAR SUSPENSION, not bumpers.',
   'bump-stops', 'genuine-audi',
   '1K0 511 353 N', '1K0511353N', '1K0', '511', '353', 'N',
   'new', 28.00, 0, TRUE, 30,
   FALSE, TRUE, 24),

  -- [DERIVED] 8MA 512 131 B  ·  bump-stops  ·  UNIDENTIFIED (8MA)
  --   Main group 512 is REAR SUSPENSION. 8MA appears yet again — now a fourth component family.
  ('AUD-8MA512131B',
   'Rear Bump Stop – 8MA 512 131 B',
   'audi-rear-bump-stop-8ma512131b',
   'Rear Bump Stop for UNIDENTIFIED (8MA). OE number 8MA 512 131 B. Main group 512 sub-group 131. Revision index B. Main group 512 is REAR SUSPENSION. 8MA appears yet again — now a fourth component family.',
   'bump-stops', 'genuine-audi',
   '8MA 512 131 B', '8MA512131B', '8MA', '512', '131', 'B',
   'new', 28.00, 0, TRUE, 8,
   FALSE, TRUE, 24),

  -- [DERIVED] 6Q0 882 331  ·  body-trim  ·  VW Group (6Q0)
  --   Main group 882 is SEATS. Not a bumper at all despite the URL.
  ('AUD-6Q0882331',
   'Seat Stop / Buffer – 6Q0 882 331',
   'audi-seat-stop-buffer-6q0882331',
   'Seat Stop / Buffer for VW Group (6Q0). OE number 6Q0 882 331. Main group 882 sub-group 331. Main group 882 is SEATS. Not a bumper at all despite the URL.',
   'body-trim', 'genuine-audi',
   '6Q0 882 331', '6Q0882331', '6Q0', '882', '331', NULL,
   'new', 12.00, 0, TRUE, 27,
   FALSE, TRUE, 24),

  -- [DERIVED] 4S0 823 481  ·  body-trim  ·  Audi R8 (Type 4S)
  --   Main group 823 is the BONNET/HOOD. A rubber buffer, not a bumper.
  ('AUD-4S0823481',
   'Bonnet Buffer – 4S0 823 481',
   'audi-bonnet-buffer-4s0823481',
   'Bonnet Buffer for Audi R8 (Type 4S). OE number 4S0 823 481. Main group 823 sub-group 481. Main group 823 is the BONNET/HOOD. A rubber buffer, not a bumper.',
   'body-trim', 'genuine-audi',
   '4S0 823 481', '4S0823481', '4S0', '823', '481', NULL,
   'new', 14.00, 0, TRUE, 8,
   FALSE, TRUE, 24),

  -- [DERIVED] 6N0 809 966 A  ·  fasteners  ·  VW Group (6N0)
  --   Group 809, body side hardware.
  ('AUD-6N0809966A',
   'Bumper Cover Nut – 6N0 809 966 A',
   'audi-bumper-cover-nut-6n0809966a',
   'Bumper Cover Nut for VW Group (6N0). OE number 6N0 809 966 A. Main group 809 sub-group 966. Revision index A. Group 809, body side hardware.',
   'fasteners', 'genuine-audi',
   '6N0 809 966 A', '6N0809966A', '6N0', '809', '966', 'A',
   'new', 2.60, 0, TRUE, 59,
   FALSE, TRUE, 24),

  -- [DERIVED] 8K0 805 399 A  ·  fasteners  ·  Audi A4 (B8)
  --   Group 805, body front hardware.
  ('AUD-8K0805399A',
   'Bumper Support Rail Bolt – 8K0 805 399 A',
   'audi-bumper-support-rail-bolt-8k0805399a',
   'Bumper Support Rail Bolt for Audi A4 (B8). OE number 8K0 805 399 A. Main group 805 sub-group 399. Revision index A. Group 805, body front hardware.',
   'fasteners', 'genuine-audi',
   '8K0 805 399 A', '8K0805399A', '8K0', '805', '399', 'A',
   'new', 3.20, 0, TRUE, 91,
   FALSE, TRUE, 24),

  -- [DERIVED] WHT006099  ·  fasteners  ·  VW Group standard hardware
  --   WHT-number standard fastener.
  ('AUD-WHT006099',
   'Bumper Cover Nut – WHT006099',
   'audi-bumper-cover-nut-wht006099',
   'Bumper Cover Nut for VW Group standard hardware. OE number WHT006099. WHT-number standard fastener.',
   'fasteners', 'genuine-audi',
   'WHT006099', 'WHT006099', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 87,
   FALSE, TRUE, 24),

  -- [DERIVED] N10596201  ·  fasteners  ·  VW Group standard hardware
  --   N-number standard fastener.
  ('AUD-N10596201',
   'Support Rail Nut – N10596201',
   'audi-support-rail-nut-n10596201',
   'Support Rail Nut for VW Group standard hardware. OE number N10596201. N-number standard fastener.',
   'fasteners', 'genuine-audi',
   'N10596201', 'N10596201', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 114,
   FALSE, TRUE, 24),

  -- [DERIVED] N90905903  ·  fasteners  ·  VW Group standard hardware
  --   N-number standard fastener.
  ('AUD-N90905903',
   'Support Rail Bolt – N90905903',
   'audi-support-rail-bolt-n90905903',
   'Support Rail Bolt for VW Group standard hardware. OE number N90905903. N-number standard fastener.',
   'fasteners', 'genuine-audi',
   'N90905903', 'N90905903', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 42,
   FALSE, TRUE, 24),

  -- [DERIVED] N10621301  ·  fasteners  ·  VW Group standard hardware
  --   N-number standard fastener.
  ('AUD-N10621301',
   'Bumper Guide Nut – N10621301',
   'audi-bumper-guide-nut-n10621301',
   'Bumper Guide Nut for VW Group standard hardware. OE number N10621301. N-number standard fastener.',
   'fasteners', 'genuine-audi',
   'N10621301', 'N10621301', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 100,
   FALSE, TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_oversized = EXCLUDED.is_oversized,
      is_active = EXCLUDED.is_active, updated_at = now();

COMMIT;
