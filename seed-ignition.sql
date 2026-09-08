-- =============================================================================
-- Ignition seed -- 32 parts. 36 URLs supplied; 3 exact repeats removed
-- (4E905110P, 6A905115D, 7C905715A), and one malformed entry dropped.
--
-- THREE ARE NOT IGNITION PARTS. The URLs say "coil", but main group 411/511 is
-- SUSPENSION -- these are road springs, not ignition coils:
--   1K0411105BT   front coil spring   -> Coil Springs
--   5Q0411105HT   front coil spring   -> Coil Springs
--   80A511115DF   rear coil spring    -> Coil Springs
-- The word "coil" is doing a lot of work in that source naming.
--
-- Two more are standard fasteners (N-numbers), not ignition components.
--
-- PRICING. Two exact observations, both "priced each":
--     06L905110K   ECS $95.99   FCP Euro $97.55
--     06H905110P   ECS $97.99   FCP Euro $93.98
-- Modern 110-series coils anchored at $97. Older 115/715/106-series coils are
-- modelled lower at $72 -- they are an earlier design and generally cheaper.
-- Boots, gaskets, brackets and bolts are modelled from typical trade levels;
-- none had a published price.
--
-- COILS ARE SOLD INDIVIDUALLY but should be replaced as a set. A single new coil
-- alongside three tired ones is the most common cause of a repeat misfire.
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
  -- [HIGH] 06L 905 110 K  ·  EA888 Gen3 1.8 / 2.0 TFSI
  --   EXACT - ECS $95.99, FCP Euro $97.55. Priced each. Anchor for the modern coils below.
  ('AUD-06L905110K',
   'Ignition Coil – 06L 905 110 K',
   'audi-ignition-coil-06l905110k',
   'Ignition Coil for EA888 Gen3 1.8 / 2.0 TFSI. OE number 06L 905 110 K. Main group 905 sub-group 110. Revision index K. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. EXACT - ECS $95.99, FCP Euro $97.55. Priced each. Anchor for the modern coils below.',
   'ignition-coils', 'genuine-audi',
   '06L 905 110 K', '06L905110K', '06L', '905', '110', 'K',
   'new', 95.99, 0, TRUE, 11,
   TRUE, 24),

  -- [HIGH] 06H 905 110 P  ·  2.0 TFSI / 3.0 TFSI
  --   EXACT - ECS $97.99, FCP Euro $93.98. Priced each.
  ('AUD-06H905110P',
   'Ignition Coil – 06H 905 110 P',
   'audi-ignition-coil-06h905110p',
   'Ignition Coil for 2.0 TFSI / 3.0 TFSI. OE number 06H 905 110 P. Main group 905 sub-group 110. Revision index P. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. EXACT - ECS $97.99, FCP Euro $93.98. Priced each.',
   'ignition-coils', 'genuine-audi',
   '06H 905 110 P', '06H905110P', '06H', '905', '110', 'P',
   'new', 97.99, 0, TRUE, 8,
   TRUE, 24),

  -- [MED] 06L 905 110 L  ·  EA888 Gen3 1.8 / 2.0 TFSI
  --   Sibling revision of 06L905110K.
  ('AUD-06L905110L',
   'Ignition Coil – 06L 905 110 L',
   'audi-ignition-coil-06l905110l',
   'Ignition Coil for EA888 Gen3 1.8 / 2.0 TFSI. OE number 06L 905 110 L. Main group 905 sub-group 110. Revision index L. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Sibling revision of 06L905110K.',
   'ignition-coils', 'genuine-audi',
   '06L 905 110 L', '06L905110L', '06L', '905', '110', 'L',
   'new', 97.00, 0, TRUE, 12,
   TRUE, 24),

  -- [MED] 06M 905 110 A  ·  EA888 evo
  --   Same coil generation as the anchors.
  ('AUD-06M905110A',
   'Ignition Coil – 06M 905 110 A',
   'audi-ignition-coil-06m905110a',
   'Ignition Coil for EA888 evo. OE number 06M 905 110 A. Main group 905 sub-group 110. Revision index A. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Same coil generation as the anchors.',
   'ignition-coils', 'genuine-audi',
   '06M 905 110 A', '06M905110A', '06M', '905', '110', 'A',
   'new', 97.00, 0, TRUE, 12,
   TRUE, 24),

  -- [MED] 079 905 110 R  ·  4.2 / 5.2 V8-V10
  --   Same coil generation.
  ('AUD-079905110R',
   'Ignition Coil – 079 905 110 R',
   'audi-ignition-coil-079905110r',
   'Ignition Coil for 4.2 / 5.2 V8-V10. OE number 079 905 110 R. Main group 905 sub-group 110. Revision index R. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Same coil generation.',
   'ignition-coils', 'genuine-audi',
   '079 905 110 R', '079905110R', '079', '905', '110', 'R',
   'new', 97.00, 0, TRUE, 15,
   TRUE, 24),

  -- [MED] 04E 905 110 P  ·  EA211 1.2 / 1.4 TFSI
  --   Same coil generation.
  ('AUD-04E905110P',
   'Ignition Coil – 04E 905 110 P',
   'audi-ignition-coil-04e905110p',
   'Ignition Coil for EA211 1.2 / 1.4 TFSI. OE number 04E 905 110 P. Main group 905 sub-group 110. Revision index P. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Same coil generation.',
   'ignition-coils', 'genuine-audi',
   '04E 905 110 P', '04E905110P', '04E', '905', '110', 'P',
   'new', 97.00, 0, TRUE, 6,
   TRUE, 24),

  -- [LOW] 06A 905 115 D  ·  1.8T 20V (06A)
  --   Older 115-series coil; typically below the modern 110 series.
  ('AUD-06A905115D',
   'Ignition Coil – 06A 905 115 D',
   'audi-ignition-coil-06a905115d',
   'Ignition Coil for 1.8T 20V (06A). OE number 06A 905 115 D. Main group 905 sub-group 115. Revision index D. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Older 115-series coil; typically below the modern 110 series.',
   'ignition-coils', 'genuine-audi',
   '06A 905 115 D', '06A905115D', '06A', '905', '115', 'D',
   'new', 72.00, 0, TRUE, 18,
   TRUE, 24),

  -- [LOW] 06C 905 115 M  ·  V6 / V8 (06C)
  --   Older 115-series coil.
  ('AUD-06C905115M',
   'Ignition Coil – 06C 905 115 M',
   'audi-ignition-coil-06c905115m',
   'Ignition Coil for V6 / V8 (06C). OE number 06C 905 115 M. Main group 905 sub-group 115. Revision index M. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Older 115-series coil.',
   'ignition-coils', 'genuine-audi',
   '06C 905 115 M', '06C905115M', '06C', '905', '115', 'M',
   'new', 72.00, 0, TRUE, 23,
   TRUE, 24),

  -- [LOW] 06E 905 115 G  ·  3.0 / 3.2 FSI V6
  --   Older 115-series coil.
  ('AUD-06E905115G',
   'Ignition Coil – 06E 905 115 G',
   'audi-ignition-coil-06e905115g',
   'Ignition Coil for 3.0 / 3.2 FSI V6. OE number 06E 905 115 G. Main group 905 sub-group 115. Revision index G. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Older 115-series coil.',
   'ignition-coils', 'genuine-audi',
   '06E 905 115 G', '06E905115G', '06E', '905', '115', 'G',
   'new', 72.00, 0, TRUE, 18,
   TRUE, 24),

  -- [LOW] 077 905 115 T  ·  4.2 V8 (077)
  --   Older 115-series coil.
  ('AUD-077905115T',
   'Ignition Coil – 077 905 115 T',
   'audi-ignition-coil-077905115t',
   'Ignition Coil for 4.2 V8 (077). OE number 077 905 115 T. Main group 905 sub-group 115. Revision index T. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Older 115-series coil.',
   'ignition-coils', 'genuine-audi',
   '077 905 115 T', '077905115T', '077', '905', '115', 'T',
   'new', 72.00, 0, TRUE, 7,
   TRUE, 24),

  -- [LOW] 07L 905 115 B  ·  5.2 V10 (07L)
  --   Older 115-series coil.
  ('AUD-07L905115B',
   'Ignition Coil – 07L 905 115 B',
   'audi-ignition-coil-07l905115b',
   'Ignition Coil for 5.2 V10 (07L). OE number 07L 905 115 B. Main group 905 sub-group 115. Revision index B. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. Older 115-series coil.',
   'ignition-coils', 'genuine-audi',
   '07L 905 115 B', '07L905115B', '07L', '905', '115', 'B',
   'new', 72.00, 0, TRUE, 6,
   TRUE, 24),

  -- [LOW] 022 905 715 D  ·  VR6 (022)
  --   715-series coil pack.
  ('AUD-022905715D',
   'Ignition Coil – 022 905 715 D',
   'audi-ignition-coil-022905715d',
   'Ignition Coil for VR6 (022). OE number 022 905 715 D. Main group 905 sub-group 715. Revision index D. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 715-series coil pack.',
   'ignition-coils', 'genuine-audi',
   '022 905 715 D', '022905715D', '022', '905', '715', 'D',
   'new', 72.00, 0, TRUE, 16,
   TRUE, 24),

  -- [LOW] 022 905 715 E  ·  VR6 (022)
  --   715-series coil pack.
  ('AUD-022905715E',
   'Ignition Coil – 022 905 715 E',
   'audi-ignition-coil-022905715e',
   'Ignition Coil for VR6 (022). OE number 022 905 715 E. Main group 905 sub-group 715. Revision index E. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 715-series coil pack.',
   'ignition-coils', 'genuine-audi',
   '022 905 715 E', '022905715E', '022', '905', '715', 'E',
   'new', 72.00, 0, TRUE, 7,
   TRUE, 24),

  -- [LOW] 07C 905 715 A  ·  W12 (07C)
  --   715-series coil pack.
  ('AUD-07C905715A',
   'Ignition Coil – 07C 905 715 A',
   'audi-ignition-coil-07c905715a',
   'Ignition Coil for W12 (07C). OE number 07C 905 715 A. Main group 905 sub-group 715. Revision index A. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 715-series coil pack.',
   'ignition-coils', 'genuine-audi',
   '07C 905 715 A', '07C905715A', '07C', '905', '715', 'A',
   'new', 72.00, 0, TRUE, 23,
   TRUE, 24),

  -- [LOW] 07K 905 715 G  ·  2.5 TFSI 5-cyl (07K)
  --   715-series coil pack.
  ('AUD-07K905715G',
   'Ignition Coil – 07K 905 715 G',
   'audi-ignition-coil-07k905715g',
   'Ignition Coil for 2.5 TFSI 5-cyl (07K). OE number 07K 905 715 G. Main group 905 sub-group 715. Revision index G. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 715-series coil pack.',
   'ignition-coils', 'genuine-audi',
   '07K 905 715 G', '07K905715G', '07K', '905', '715', 'G',
   'new', 72.00, 0, TRUE, 24,
   TRUE, 24),

  -- [LOW] 07P 905 715 A  ·  W12 (07P)
  --   715-series coil pack.
  ('AUD-07P905715A',
   'Ignition Coil – 07P 905 715 A',
   'audi-ignition-coil-07p905715a',
   'Ignition Coil for W12 (07P). OE number 07P 905 715 A. Main group 905 sub-group 715. Revision index A. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 715-series coil pack.',
   'ignition-coils', 'genuine-audi',
   '07P 905 715 A', '07P905715A', '07P', '905', '715', 'A',
   'new', 72.00, 0, TRUE, 7,
   TRUE, 24),

  -- [LOW] 032 905 106 F  ·  early 4-cyl (032)
  --   106-series coil, older design.
  ('AUD-032905106F',
   'Ignition Coil – 032 905 106 F',
   'audi-ignition-coil-032905106f',
   'Ignition Coil for early 4-cyl (032). OE number 032 905 106 F. Main group 905 sub-group 106. Revision index F. Replace coils as a full set — mixing a new coil with worn ones is the usual cause of a repeat misfire. 106-series coil, older design.',
   'ignition-coils', 'genuine-audi',
   '032 905 106 F', '032905106F', '032', '905', '106', 'F',
   'new', 72.00, 0, TRUE, 6,
   TRUE, 24),

  -- [LOW] 06H 905 199 C  ·  2.0 TFSI (A4)
  --   Confirmed on parts.audiusa.com (Eldor); no price published. Boots typically $12-25.
  ('AUD-06H905199C',
   'Ignition Coil Boot – 06H 905 199 C',
   'audi-ignition-coil-boot-06h905199c',
   'Ignition Coil Boot for 2.0 TFSI (A4). OE number 06H 905 199 C. Main group 905 sub-group 199. Revision index C. Replace boots whenever the coils are disturbed; they harden and crack with heat. Confirmed on parts.audiusa.com (Eldor); no price published. Boots typically $12-25.',
   'ignition-coils', 'genuine-audi',
   '06H 905 199 C', '06H905199C', '06H', '905', '199', 'C',
   'new', 18.00, 0, TRUE, 15,
   TRUE, 24),

  -- [LOW] 06K 905 199 A  ·  EA888 Gen3
  --   No price published.
  ('AUD-06K905199A',
   'Ignition Coil Boot – 06K 905 199 A',
   'audi-ignition-coil-boot-06k905199a',
   'Ignition Coil Boot for EA888 Gen3. OE number 06K 905 199 A. Main group 905 sub-group 199. Revision index A. Replace boots whenever the coils are disturbed; they harden and crack with heat. No price published.',
   'ignition-coils', 'genuine-audi',
   '06K 905 199 A', '06K905199A', '06K', '905', '199', 'A',
   'new', 18.00, 0, TRUE, 24,
   TRUE, 24),

  -- [LOW] 06L 905 199 B  ·  EA888 Gen3 (A3/A5/Q7/TT/S3)
  --   Widely stocked and confirmed on parts.audiusa.com across many models; no price published.
  ('AUD-06L905199B',
   'Ignition Coil Boot – 06L 905 199 B',
   'audi-ignition-coil-boot-06l905199b',
   'Ignition Coil Boot for EA888 Gen3 (A3/A5/Q7/TT/S3). OE number 06L 905 199 B. Main group 905 sub-group 199. Revision index B. Replace boots whenever the coils are disturbed; they harden and crack with heat. Widely stocked and confirmed on parts.audiusa.com across many models; no price published.',
   'ignition-coils', 'genuine-audi',
   '06L 905 199 B', '06L905199B', '06L', '905', '199', 'B',
   'new', 18.00, 0, TRUE, 12,
   TRUE, 24),

  -- [LOW] 06L 905 199 D  ·  EA888 Gen3
  --   No price published.
  ('AUD-06L905199D',
   'Ignition Coil Boot – 06L 905 199 D',
   'audi-ignition-coil-boot-06l905199d',
   'Ignition Coil Boot for EA888 Gen3. OE number 06L 905 199 D. Main group 905 sub-group 199. Revision index D. Replace boots whenever the coils are disturbed; they harden and crack with heat. No price published.',
   'ignition-coils', 'genuine-audi',
   '06L 905 199 D', '06L905199D', '06L', '905', '199', 'D',
   'new', 18.00, 0, TRUE, 24,
   TRUE, 24),

  -- [LOW] 06M 905 199  ·  EA888 evo
  --   No price published.
  ('AUD-06M905199',
   'Ignition Coil Boot – 06M 905 199',
   'audi-ignition-coil-boot-06m905199',
   'Ignition Coil Boot for EA888 evo. OE number 06M 905 199. Main group 905 sub-group 199. Replace boots whenever the coils are disturbed; they harden and crack with heat. No price published.',
   'ignition-coils', 'genuine-audi',
   '06M 905 199', '06M905199', '06M', '905', '199', NULL,
   'new', 18.00, 0, TRUE, 24,
   TRUE, 24),

  -- [LOW] 079 905 199 D  ·  4.2 / 5.2 V8-V10
  --   No price published.
  ('AUD-079905199D',
   'Ignition Coil Boot – 079 905 199 D',
   'audi-ignition-coil-boot-079905199d',
   'Ignition Coil Boot for 4.2 / 5.2 V8-V10. OE number 079 905 199 D. Main group 905 sub-group 199. Revision index D. Replace boots whenever the coils are disturbed; they harden and crack with heat. No price published.',
   'ignition-coils', 'genuine-audi',
   '079 905 199 D', '079905199D', '079', '905', '199', 'D',
   'new', 18.00, 0, TRUE, 16,
   TRUE, 24),

  -- [LOW] 079 905 199 F  ·  4.2 / 5.2 V8-V10
  --   No price published.
  ('AUD-079905199F',
   'Ignition Coil Boot – 079 905 199 F',
   'audi-ignition-coil-boot-079905199f',
   'Ignition Coil Boot for 4.2 / 5.2 V8-V10. OE number 079 905 199 F. Main group 905 sub-group 199. Revision index F. Replace boots whenever the coils are disturbed; they harden and crack with heat. No price published.',
   'ignition-coils', 'genuine-audi',
   '079 905 199 F', '079905199F', '079', '905', '199', 'F',
   'new', 18.00, 0, TRUE, 16,
   TRUE, 24),

  -- [LOW] 058 905 447 C  ·  1.8T 20V (058)
  --   Sub-group 447 is also a boot/connector.
  ('AUD-058905447C',
   'Ignition Coil Boot – 058 905 447 C',
   'audi-ignition-coil-boot-058905447c',
   'Ignition Coil Boot for 1.8T 20V (058). OE number 058 905 447 C. Main group 905 sub-group 447. Revision index C. Replace boots whenever the coils are disturbed; they harden and crack with heat. Sub-group 447 is also a boot/connector.',
   'ignition-coils', 'genuine-audi',
   '058 905 447 C', '058905447C', '058', '905', '447', 'C',
   'new', 18.00, 0, TRUE, 19,
   TRUE, 24),

  -- [LOW] 058 905 261 A  ·  1.8T 20V (058)
  --   Small sealing gasket. Modelled.
  ('AUD-058905261A',
   'Coil Mounting Gasket – 058 905 261 A',
   'audi-coil-mounting-gasket-058905261a',
   'Coil Mounting Gasket for 1.8T 20V (058). OE number 058 905 261 A. Main group 905 sub-group 261. Revision index A. Replace boots whenever the coils are disturbed; they harden and crack with heat. Small sealing gasket. Modelled.',
   'ignition-coils', 'genuine-audi',
   '058 905 261 A', '058905261A', '058', '905', '261', 'A',
   'new', 6.50, 0, TRUE, 7,
   TRUE, 24),

  -- [LOW] 077 905 390  ·  4.2 V8 (077)
  --   Mounting bracket. Modelled.
  ('AUD-077905390',
   'Coil Mounting Bracket – 077 905 390',
   'audi-coil-mounting-bracket-077905390',
   'Coil Mounting Bracket for 4.2 V8 (077). OE number 077 905 390. Main group 905 sub-group 390. Replace boots whenever the coils are disturbed; they harden and crack with heat. Mounting bracket. Modelled.',
   'ignition-coils', 'genuine-audi',
   '077 905 390', '077905390', '077', '905', '390', NULL,
   'new', 28.00, 0, TRUE, 7,
   TRUE, 24),

  -- [LOW] N10825101  ·  VW Group standard hardware
  --   N-number standard fastener.
  ('AUD-N10825101',
   'Ignition Coil Bolt – N10825101',
   'audi-ignition-coil-bolt-n10825101',
   'Ignition Coil Bolt for VW Group standard hardware. OE number N10825101. Replace boots whenever the coils are disturbed; they harden and crack with heat. N-number standard fastener.',
   'fasteners', 'genuine-audi',
   'N10825101', 'N10825101', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 77,
   TRUE, 24),

  -- [LOW] N91229201  ·  VW Group standard hardware
  --   N-number standard fastener.
  ('AUD-N91229201',
   'Ignition Coil Bolt – N91229201',
   'audi-ignition-coil-bolt-n91229201',
   'Ignition Coil Bolt for VW Group standard hardware. OE number N91229201. Replace boots whenever the coils are disturbed; they harden and crack with heat. N-number standard fastener.',
   'fasteners', 'genuine-audi',
   'N91229201', 'N91229201', NULL, NULL, NULL, NULL,
   'new', 2.40, 0, TRUE, 34,
   TRUE, 24),

  -- [LOW] 1K0 411 105 BT  ·  VW Group PQ35 (Golf V / A3 8P)
  --   Main group 411 is FRONT SUSPENSION, not ignition. A road spring. Modelled.
  ('AUD-1K0411105BT',
   'Front Coil Spring – 1K0 411 105 BT',
   'audi-front-coil-spring-1k0411105bt',
   'Front Coil Spring for VW Group PQ35 (Golf V / A3 8P). OE number 1K0 411 105 BT. Main group 411 sub-group 105. Revision index BT. Springs should be replaced in axle pairs. Main group 411 is FRONT SUSPENSION, not ignition. A road spring. Modelled.',
   'coil-springs', 'genuine-audi',
   '1K0 411 105 BT', '1K0411105BT', '1K0', '411', '105', 'BT',
   'new', 138.00, 0, TRUE, 10,
   TRUE, 24),

  -- [LOW] 5Q0 411 105 HT  ·  VW Group MQB (Golf 7 / A3 8V)
  --   Main group 411 is FRONT SUSPENSION. A road spring. Modelled.
  ('AUD-5Q0411105HT',
   'Front Coil Spring – 5Q0 411 105 HT',
   'audi-front-coil-spring-5q0411105ht',
   'Front Coil Spring for VW Group MQB (Golf 7 / A3 8V). OE number 5Q0 411 105 HT. Main group 411 sub-group 105. Revision index HT. Springs should be replaced in axle pairs. Main group 411 is FRONT SUSPENSION. A road spring. Modelled.',
   'coil-springs', 'genuine-audi',
   '5Q0 411 105 HT', '5Q0411105HT', '5Q0', '411', '105', 'HT',
   'new', 138.00, 0, TRUE, 10,
   TRUE, 24),

  -- [LOW] 80A 511 115 DF  ·  Audi Q5 (FY)
  --   Main group 511 is REAR SUSPENSION. A road spring. Modelled.
  ('AUD-80A511115DF',
   'Rear Coil Spring – 80A 511 115 DF',
   'audi-rear-coil-spring-80a511115df',
   'Rear Coil Spring for Audi Q5 (FY). OE number 80A 511 115 DF. Main group 511 sub-group 115. Revision index DF. Springs should be replaced in axle pairs. Main group 511 is REAR SUSPENSION. A road spring. Modelled.',
   'coil-springs', 'genuine-audi',
   '80A 511 115 DF', '80A511115DF', '80A', '511', '115', 'DF',
   'new', 148.00, 0, TRUE, 6,
   TRUE, 24)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price, stock_count = EXCLUDED.stock_count,
      in_stock = EXCLUDED.in_stock, is_active = EXCLUDED.is_active,
      updated_at = now();

COMMIT;
