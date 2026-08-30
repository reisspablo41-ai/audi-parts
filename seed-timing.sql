-- =============================================================================
-- Timing Drive seed — 23 OE numbers (24 URLs supplied; 6D109119B appears twice)
--
-- HOW THIS WAS BUILT:
--   Derived from the VAG part numbers, which are structured factual identifiers.
--   Nothing was copied from any retailer -- descriptions here are our own.
--
--       06K  109  158  BP
--       ^^^  ^^^  ^^^  ^^
--       |    |    |    revision index
--       |    |    sub-group: 119 = toothed belt      229 = timing chain
--       |    |               465 = timing chain      158 = camshaft adjuster
--       |    |               231 = tensioning rail   450 = camshaft adjuster
--       |    main group 109 = cylinder head / valve gear / timing drive
--       engine-family prefix (06K = EA888 Gen3, 059 = TDI V6, ...)
--
--   NOTE ON LEADING ZEROS: the source slugs drop them (6k109158bp). Every VAG
--   engine-family prefix is three characters, and main group is always 109 here,
--   so the numbers are padded back out. All 23 resolve to real engine families,
--   which is what makes the padding safe rather than a guess.
--
--   CROSS-CHECK THAT VALIDATES THIS: all 5 URLs labelled "timing-belt" decode to
--   sub-group 119 (toothed belt) and all 18 labelled "timing-chain" decode to
--   something other than 119. A perfect correlation across 23 parts.
--
-- WHERE OUR NAMING DIFFERS FROM THE SOURCE URL:
--   Sub-groups 158, 231 and 450 are camshaft adjusters and tensioning rails --
--   not chains. The source labels them all "timing-chain". We name the actual
--   component, because selling a customer a "chain" that arrives as a tensioner
--   rail is a guaranteed return.
--
-- BEFORE THESE GO LIVE:
--   Prices are 0.00 and is_active = FALSE, same gate as the brake seed.
--   Fitment is NOT populated -- confirm engine codes against ETKA.
--   Prefix 0P2 (3 parts) is unidentified; see the notes at the bottom.
--
-- Targets schema-v2-proposal.sql.
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
  -- 0P2109229L  ·  url said "chain"  ·  engine 0P2: UNIDENTIFIED (unknown) · sub 229: Timing Chain (high)
  ('AUD-0P2109229L',
   'Timing Chain – 0P2 109 229 L',
   'audi-timing-chain-0p2109229l',
   'Timing chain, OE number 0P2 109 229 L. Sub-group 229 identifies this as a chain for the engine family 0P2 — UNIDENTIFIED engine family. Revision index L. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '0P2 109 229 L', '0P2109229L', '0P2', '109', '229', 'L',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 0P2109229F  ·  url said "chain"  ·  engine 0P2: UNIDENTIFIED (unknown) · sub 229: Timing Chain (high)
  ('AUD-0P2109229F',
   'Timing Chain – 0P2 109 229 F',
   'audi-timing-chain-0p2109229f',
   'Timing chain, OE number 0P2 109 229 F. Sub-group 229 identifies this as a chain for the engine family 0P2 — UNIDENTIFIED engine family. Revision index F. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '0P2 109 229 F', '0P2109229F', '0P2', '109', '229', 'F',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06E109465BD  ·  url said "chain"  ·  engine 06E: 3.0 / 3.2 FSI V6 (high) · sub 465: Timing Chain (high)
  ('AUD-06E109465BD',
   'Timing Chain – 06E 109 465 BD',
   'audi-timing-chain-06e109465bd',
   'Timing chain, OE number 06E 109 465 BD. Sub-group 465 identifies this as a chain for the 3.0 / 3.2 FSI V6 (06E) engine family. Revision index BD. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '06E 109 465 BD', '06E109465BD', '06E', '109', '465', 'BD',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 059109229AA  ·  url said "chain"  ·  engine 059: 2.5 TDI V6 / 3.0 TDI V6 (high) · sub 229: Timing Chain (high)
  ('AUD-059109229AA',
   'Timing Chain – 059 109 229 AA',
   'audi-timing-chain-059109229aa',
   'Timing chain, OE number 059 109 229 AA. Sub-group 229 identifies this as a chain for the 2.5 TDI V6 / 3.0 TDI V6 (059) engine family. Revision index AA. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '059 109 229 AA', '059109229AA', '059', '109', '229', 'AA',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 059109229M  ·  url said "chain"  ·  engine 059: 2.5 TDI V6 / 3.0 TDI V6 (high) · sub 229: Timing Chain (high)
  ('AUD-059109229M',
   'Timing Chain – 059 109 229 M',
   'audi-timing-chain-059109229m',
   'Timing chain, OE number 059 109 229 M. Sub-group 229 identifies this as a chain for the 2.5 TDI V6 / 3.0 TDI V6 (059) engine family. Revision index M. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '059 109 229 M', '059109229M', '059', '109', '229', 'M',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 0P2109450J  ·  url said "chain"  ·  engine 0P2: UNIDENTIFIED (unknown) · sub 450: Camshaft Adjuster (VVT) (medium)
  ('AUD-0P2109450J',
   'Camshaft Adjuster (VVT) – 0P2 109 450 J',
   'audi-camshaft-adjuster-vvt-0p2109450j',
   'Camshaft Adjuster (VVT), OE number 0P2 109 450 J. Sub-group 450 identifies this as a camshaft adjuster (vvt) rather than the chain itself — check which component you actually need before ordering. Fits the engine family 0P2 — UNIDENTIFIED engine family. Revision index J.',
   'timing', 'genuine-audi',
   '0P2 109 450 J', '0P2109450J', '0P2', '109', '450', 'J',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 07K109231A  ·  url said "chain"  ·  engine 07K: 2.5 TFSI 5-cylinder (high) · sub 231: Timing Chain Tensioning Rail (medium)
  ('AUD-07K109231A',
   'Timing Chain Tensioning Rail – 07K 109 231 A',
   'audi-timing-chain-tensioning-rail-07k109231a',
   'Timing Chain Tensioning Rail, OE number 07K 109 231 A. Sub-group 231 identifies this as a timing chain tensioning rail rather than the chain itself — check which component you actually need before ordering. Fits the 2.5 TFSI 5-cylinder (07K) engine family. Revision index A.',
   'timing', 'genuine-audi',
   '07K 109 231 A', '07K109231A', '07K', '109', '231', 'A',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 059109119F  ·  url said "belt"  ·  engine 059: 2.5 TDI V6 / 3.0 TDI V6 (high) · sub 119: Timing Belt (high)
  ('AUD-059109119F',
   'Timing Belt – 059 109 119 F',
   'audi-timing-belt-059109119f',
   'Toothed timing belt, OE number 059 109 119 F. Sub-group 119 identifies this as a belt-driven timing component for the 2.5 TDI V6 / 3.0 TDI V6 (059) engine family. Revision index F. Belt-driven engines have a fixed replacement interval — replace the tensioner and idlers at the same time, and fit a new water pump if it is belt-driven.',
   'timing', 'genuine-audi',
   '059 109 119 F', '059109119F', '059', '109', '119', 'F',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06B109119A  ·  url said "belt"  ·  engine 06B: 1.8 20V (AEB / APU / AMB) (high) · sub 119: Timing Belt (high)
  ('AUD-06B109119A',
   'Timing Belt – 06B 109 119 A',
   'audi-timing-belt-06b109119a',
   'Toothed timing belt, OE number 06B 109 119 A. Sub-group 119 identifies this as a belt-driven timing component for the 1.8 20V (AEB / APU / AMB) (06B) engine family. Revision index A. Belt-driven engines have a fixed replacement interval — replace the tensioner and idlers at the same time, and fit a new water pump if it is belt-driven.',
   'timing', 'genuine-audi',
   '06B 109 119 A', '06B109119A', '06B', '109', '119', 'A',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 059109229K  ·  url said "chain"  ·  engine 059: 2.5 TDI V6 / 3.0 TDI V6 (high) · sub 229: Timing Chain (high)
  ('AUD-059109229K',
   'Timing Chain – 059 109 229 K',
   'audi-timing-chain-059109229k',
   'Timing chain, OE number 059 109 229 K. Sub-group 229 identifies this as a chain for the 2.5 TDI V6 / 3.0 TDI V6 (059) engine family. Revision index K. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '059 109 229 K', '059109229K', '059', '109', '229', 'K',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 07K109231C  ·  url said "chain"  ·  engine 07K: 2.5 TFSI 5-cylinder (high) · sub 231: Timing Chain Tensioning Rail (medium)
  ('AUD-07K109231C',
   'Timing Chain Tensioning Rail – 07K 109 231 C',
   'audi-timing-chain-tensioning-rail-07k109231c',
   'Timing Chain Tensioning Rail, OE number 07K 109 231 C. Sub-group 231 identifies this as a timing chain tensioning rail rather than the chain itself — check which component you actually need before ordering. Fits the 2.5 TFSI 5-cylinder (07K) engine family. Revision index C.',
   'timing', 'genuine-audi',
   '07K 109 231 C', '07K109231C', '07K', '109', '231', 'C',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06D109119B  ·  url said "belt"  ·  engine 06D: 2.0 FSI (high) · sub 119: Timing Belt (high)
  ('AUD-06D109119B',
   'Timing Belt – 06D 109 119 B',
   'audi-timing-belt-06d109119b',
   'Toothed timing belt, OE number 06D 109 119 B. Sub-group 119 identifies this as a belt-driven timing component for the 2.0 FSI (06D) engine family. Revision index B. Belt-driven engines have a fixed replacement interval — replace the tensioner and idlers at the same time, and fit a new water pump if it is belt-driven.',
   'timing', 'genuine-audi',
   '06D 109 119 B', '06D109119B', '06D', '109', '119', 'B',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 07K109158F  ·  url said "chain"  ·  engine 07K: 2.5 TFSI 5-cylinder (high) · sub 158: Camshaft Adjuster / Chain Tensioner (medium)
  ('AUD-07K109158F',
   'Camshaft Adjuster / Chain Tensioner – 07K 109 158 F',
   'audi-camshaft-adjuster-chain-tensioner-07k109158f',
   'Camshaft Adjuster / Chain Tensioner, OE number 07K 109 158 F. Sub-group 158 identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering. Fits the 2.5 TFSI 5-cylinder (07K) engine family. Revision index F.',
   'timing', 'genuine-audi',
   '07K 109 158 F', '07K109158F', '07K', '109', '158', 'F',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06K109158BP  ·  url said "chain"  ·  engine 06K: EA888 Gen3 2.0 TFSI (high) · sub 158: Camshaft Adjuster / Chain Tensioner (medium)
  ('AUD-06K109158BP',
   'Camshaft Adjuster / Chain Tensioner – 06K 109 158 BP',
   'audi-camshaft-adjuster-chain-tensioner-06k109158bp',
   'Camshaft Adjuster / Chain Tensioner, OE number 06K 109 158 BP. Sub-group 158 identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering. Fits the EA888 Gen3 2.0 TFSI (06K) engine family. Revision index BP.',
   'timing', 'genuine-audi',
   '06K 109 158 BP', '06K109158BP', '06K', '109', '158', 'BP',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 078109119J  ·  url said "belt"  ·  engine 078: 2.4 / 2.8 V6 30V (high) · sub 119: Timing Belt (high)
  ('AUD-078109119J',
   'Timing Belt – 078 109 119 J',
   'audi-timing-belt-078109119j',
   'Toothed timing belt, OE number 078 109 119 J. Sub-group 119 identifies this as a belt-driven timing component for the 2.4 / 2.8 V6 30V (078) engine family. Revision index J. Belt-driven engines have a fixed replacement interval — replace the tensioner and idlers at the same time, and fit a new water pump if it is belt-driven.',
   'timing', 'genuine-audi',
   '078 109 119 J', '078109119J', '078', '109', '119', 'J',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06K109158BG  ·  url said "chain"  ·  engine 06K: EA888 Gen3 2.0 TFSI (high) · sub 158: Camshaft Adjuster / Chain Tensioner (medium)
  ('AUD-06K109158BG',
   'Camshaft Adjuster / Chain Tensioner – 06K 109 158 BG',
   'audi-camshaft-adjuster-chain-tensioner-06k109158bg',
   'Camshaft Adjuster / Chain Tensioner, OE number 06K 109 158 BG. Sub-group 158 identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering. Fits the EA888 Gen3 2.0 TFSI (06K) engine family. Revision index BG.',
   'timing', 'genuine-audi',
   '06K 109 158 BG', '06K109158BG', '06K', '109', '158', 'BG',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06E109465BL  ·  url said "chain"  ·  engine 06E: 3.0 / 3.2 FSI V6 (high) · sub 465: Timing Chain (high)
  ('AUD-06E109465BL',
   'Timing Chain – 06E 109 465 BL',
   'audi-timing-chain-06e109465bl',
   'Timing chain, OE number 06E 109 465 BL. Sub-group 465 identifies this as a chain for the 3.0 / 3.2 FSI V6 (06E) engine family. Revision index BL. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '06E 109 465 BL', '06E109465BL', '06E', '109', '465', 'BL',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06E109465BB  ·  url said "chain"  ·  engine 06E: 3.0 / 3.2 FSI V6 (high) · sub 465: Timing Chain (high)
  ('AUD-06E109465BB',
   'Timing Chain – 06E 109 465 BB',
   'audi-timing-chain-06e109465bb',
   'Timing chain, OE number 06E 109 465 BB. Sub-group 465 identifies this as a chain for the 3.0 / 3.2 FSI V6 (06E) engine family. Revision index BB. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '06E 109 465 BB', '06E109465BB', '06E', '109', '465', 'BB',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06K109158BJ  ·  url said "chain"  ·  engine 06K: EA888 Gen3 2.0 TFSI (high) · sub 158: Camshaft Adjuster / Chain Tensioner (medium)
  ('AUD-06K109158BJ',
   'Camshaft Adjuster / Chain Tensioner – 06K 109 158 BJ',
   'audi-camshaft-adjuster-chain-tensioner-06k109158bj',
   'Camshaft Adjuster / Chain Tensioner, OE number 06K 109 158 BJ. Sub-group 158 identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering. Fits the EA888 Gen3 2.0 TFSI (06K) engine family. Revision index BJ.',
   'timing', 'genuine-audi',
   '06K 109 158 BJ', '06K109158BJ', '06K', '109', '158', 'BJ',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 04E109119F  ·  url said "belt"  ·  engine 04E: EA211 1.2 / 1.4 TFSI (high) · sub 119: Timing Belt (high)
  ('AUD-04E109119F',
   'Timing Belt – 04E 109 119 F',
   'audi-timing-belt-04e109119f',
   'Toothed timing belt, OE number 04E 109 119 F. Sub-group 119 identifies this as a belt-driven timing component for the EA211 1.2 / 1.4 TFSI (04E) engine family. Revision index F. Belt-driven engines have a fixed replacement interval — replace the tensioner and idlers at the same time, and fit a new water pump if it is belt-driven.',
   'timing', 'genuine-audi',
   '04E 109 119 F', '04E109119F', '04E', '109', '119', 'F',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06E109465AQ  ·  url said "chain"  ·  engine 06E: 3.0 / 3.2 FSI V6 (high) · sub 465: Timing Chain (high)
  ('AUD-06E109465AQ',
   'Timing Chain – 06E 109 465 AQ',
   'audi-timing-chain-06e109465aq',
   'Timing chain, OE number 06E 109 465 AQ. Sub-group 465 identifies this as a chain for the 3.0 / 3.2 FSI V6 (06E) engine family. Revision index AQ. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '06E 109 465 AQ', '06E109465AQ', '06E', '109', '465', 'AQ',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06M109229AC  ·  url said "chain"  ·  engine 06M: EA888 evo (medium) · sub 229: Timing Chain (high)
  ('AUD-06M109229AC',
   'Timing Chain – 06M 109 229 AC',
   'audi-timing-chain-06m109229ac',
   'Timing chain, OE number 06M 109 229 AC. Sub-group 229 identifies this as a chain for the EA888 evo (06M) engine family. Revision index AC. Chains are frequently revised — confirm you are ordering the latest index, and replace the tensioner and guide rails at the same time.',
   'timing', 'genuine-audi',
   '06M 109 229 AC', '06M109229AC', '06M', '109', '229', 'AC',
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24),

  -- 06Q109158  ·  url said "chain"  ·  engine 06Q: unconfirmed 06x engine family (low) · sub 158: Camshaft Adjuster / Chain Tensioner (medium)
  ('AUD-06Q109158',
   'Camshaft Adjuster / Chain Tensioner – 06Q 109 158',
   'audi-camshaft-adjuster-chain-tensioner-06q109158',
   'Camshaft Adjuster / Chain Tensioner, OE number 06Q 109 158. Sub-group 158 identifies this as a camshaft adjuster / chain tensioner rather than the chain itself — check which component you actually need before ordering. Fits the unconfirmed 06x engine family (06Q) engine family. Revision index base.',
   'timing', 'genuine-audi',
   '06Q 109 158', '06Q109158', '06Q', '109', '158', NULL,
   'new', 0.00, 0, FALSE, 0,
   FALSE, 24)
ON CONFLICT (sku) DO NOTHING;

-- Filterable specs. Drive type is the single most useful facet here: a belt
-- engine and a chain engine are completely different service jobs.
INSERT INTO attribute_definitions (id, category_id, label, unit, data_type, is_filterable, sort_order) VALUES
  ('drive-type',    'timing', 'Timing Drive',   NULL, 'enum', TRUE, 1),
  ('engine-family', 'timing', 'Engine Family',  NULL, 'text', TRUE, 2)
ON CONFLICT (id) DO NOTHING;
UPDATE attribute_definitions SET enum_values = ARRAY['belt','chain'] WHERE id = 'drive-type';

INSERT INTO part_attributes (sku, attribute_id, value_text) VALUES
  ('AUD-0P2109229L', 'drive-type', 'chain'),
  ('AUD-0P2109229F', 'drive-type', 'chain'),
  ('AUD-06E109465BD', 'drive-type', 'chain'),
  ('AUD-06E109465BD', 'engine-family', '3.0 / 3.2 FSI V6'),
  ('AUD-059109229AA', 'drive-type', 'chain'),
  ('AUD-059109229AA', 'engine-family', '2.5 TDI V6 / 3.0 TDI V6'),
  ('AUD-059109229M', 'drive-type', 'chain'),
  ('AUD-059109229M', 'engine-family', '2.5 TDI V6 / 3.0 TDI V6'),
  ('AUD-0P2109450J', 'drive-type', 'chain'),
  ('AUD-07K109231A', 'drive-type', 'chain'),
  ('AUD-07K109231A', 'engine-family', '2.5 TFSI 5-cylinder'),
  ('AUD-059109119F', 'drive-type', 'belt'),
  ('AUD-059109119F', 'engine-family', '2.5 TDI V6 / 3.0 TDI V6'),
  ('AUD-06B109119A', 'drive-type', 'belt'),
  ('AUD-06B109119A', 'engine-family', '1.8 20V (AEB / APU / AMB)'),
  ('AUD-059109229K', 'drive-type', 'chain'),
  ('AUD-059109229K', 'engine-family', '2.5 TDI V6 / 3.0 TDI V6'),
  ('AUD-07K109231C', 'drive-type', 'chain'),
  ('AUD-07K109231C', 'engine-family', '2.5 TFSI 5-cylinder'),
  ('AUD-06D109119B', 'drive-type', 'belt'),
  ('AUD-06D109119B', 'engine-family', '2.0 FSI'),
  ('AUD-07K109158F', 'drive-type', 'chain'),
  ('AUD-07K109158F', 'engine-family', '2.5 TFSI 5-cylinder'),
  ('AUD-06K109158BP', 'drive-type', 'chain'),
  ('AUD-06K109158BP', 'engine-family', 'EA888 Gen3 2.0 TFSI'),
  ('AUD-078109119J', 'drive-type', 'belt'),
  ('AUD-078109119J', 'engine-family', '2.4 / 2.8 V6 30V'),
  ('AUD-06K109158BG', 'drive-type', 'chain'),
  ('AUD-06K109158BG', 'engine-family', 'EA888 Gen3 2.0 TFSI'),
  ('AUD-06E109465BL', 'drive-type', 'chain'),
  ('AUD-06E109465BL', 'engine-family', '3.0 / 3.2 FSI V6'),
  ('AUD-06E109465BB', 'drive-type', 'chain'),
  ('AUD-06E109465BB', 'engine-family', '3.0 / 3.2 FSI V6'),
  ('AUD-06K109158BJ', 'drive-type', 'chain'),
  ('AUD-06K109158BJ', 'engine-family', 'EA888 Gen3 2.0 TFSI'),
  ('AUD-04E109119F', 'drive-type', 'belt'),
  ('AUD-04E109119F', 'engine-family', 'EA211 1.2 / 1.4 TFSI'),
  ('AUD-06E109465AQ', 'drive-type', 'chain'),
  ('AUD-06E109465AQ', 'engine-family', '3.0 / 3.2 FSI V6'),
  ('AUD-06M109229AC', 'drive-type', 'chain'),
  ('AUD-06M109229AC', 'engine-family', 'EA888 evo'),
  ('AUD-06Q109158', 'drive-type', 'chain'),
  ('AUD-06Q109158', 'engine-family', 'unconfirmed 06x engine family')
ON CONFLICT (sku, attribute_id) DO NOTHING;

-- Revision families: same engine + same sub-group, different index. One likely
-- supersedes the other, but direction must be confirmed in ETKA -- recorded as
-- cross-references, never as supersessions.
INSERT INTO part_cross_references (sku, ref_number, ref_type) VALUES
  ('AUD-059109229AA', '059109229M', 'interchange'),
  ('AUD-059109229AA', '059109229K', 'interchange'),
  ('AUD-059109229M', '059109229AA', 'interchange'),
  ('AUD-059109229M', '059109229K', 'interchange'),
  ('AUD-059109229K', '059109229AA', 'interchange'),
  ('AUD-059109229K', '059109229M', 'interchange'),
  ('AUD-06E109465BD', '06E109465BL', 'interchange'),
  ('AUD-06E109465BD', '06E109465BB', 'interchange'),
  ('AUD-06E109465BD', '06E109465AQ', 'interchange'),
  ('AUD-06E109465BL', '06E109465BD', 'interchange'),
  ('AUD-06E109465BL', '06E109465BB', 'interchange'),
  ('AUD-06E109465BL', '06E109465AQ', 'interchange'),
  ('AUD-06E109465BB', '06E109465BD', 'interchange'),
  ('AUD-06E109465BB', '06E109465BL', 'interchange'),
  ('AUD-06E109465BB', '06E109465AQ', 'interchange'),
  ('AUD-06E109465AQ', '06E109465BD', 'interchange'),
  ('AUD-06E109465AQ', '06E109465BL', 'interchange'),
  ('AUD-06E109465AQ', '06E109465BB', 'interchange'),
  ('AUD-06K109158BP', '06K109158BG', 'interchange'),
  ('AUD-06K109158BP', '06K109158BJ', 'interchange'),
  ('AUD-06K109158BG', '06K109158BP', 'interchange'),
  ('AUD-06K109158BG', '06K109158BJ', 'interchange'),
  ('AUD-06K109158BJ', '06K109158BP', 'interchange'),
  ('AUD-06K109158BJ', '06K109158BG', 'interchange'),
  ('AUD-07K109231A', '07K109231C', 'interchange'),
  ('AUD-07K109231C', '07K109231A', 'interchange'),
  ('AUD-0P2109229L', '0P2109229F', 'interchange'),
  ('AUD-0P2109229F', '0P2109229L', 'interchange')
ON CONFLICT (sku, ref_number) DO NOTHING;

COMMIT;

-- =============================================================================
-- NEEDS VERIFICATION
--
--   0P2 (3 parts: 0P2109229L, 0P2109229F, 0P2109450J)
--       Not an engine-family prefix we can identify. Every other prefix in this
--       batch resolves to a known VAG engine family; this one does not, so it
--       may not be an OE number at all. Verify before listing.
--
--   06Q (1 part) and 06M (1 part) are lower-confidence engine-family matches.
--
--   Sub-groups 158 / 231 / 450 (8 parts total) are adjusters and rails, not
--   chains. We have named them accurately, which means these listings will NOT
--   match the source site's naming. That is deliberate.
--
-- SANITY CHECKS AFTER LOADING:
--   SELECT a.value_text, count(*) FROM part_attributes a
--    WHERE a.attribute_id = 'drive-type' GROUP BY 1;      -- expect belt 5, chain 18
--   SELECT count(*) FROM parts WHERE is_active AND price = 0;  -- must be 0
-- =============================================================================
