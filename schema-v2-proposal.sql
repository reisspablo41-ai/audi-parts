-- =============================================================================
-- Audi Parts Sales — Catalogue Schema v2 (PROPOSAL)
--
-- Supersedes the flat structure in supabase-schema.sql. Run against an EMPTY
-- schema; this is not an in-place migration (see the notes at the bottom).
--
-- What changes and why:
--   1. Categories become a tree      — Brakes > Brake Pads, matching how the
--                                      catalogue is actually browsed.
--   2. Vehicles become a hierarchy   — make > model > generation > vehicle,
--                                      so "A4 B9" is a first-class thing.
--   3. Part numbers are decomposed   — VAG numbers are composite (420 698 451 D)
--                                      and supersession bumps the last index.
--   4. Supersessions are modelled    — the single most common OEM parts problem:
--                                      "that number was replaced three times".
--   5. Specs move to typed attributes — a brake disc has a diameter, a wheel has
--                                      a bolt pattern; neither fits fixed columns.
--   6. Fitment gains qualifiers      — "fits B9 A4 *with 320mm front discs*" is
--                                      the difference between a sale and a return.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TAXONOMY — self-referencing so depth can change without a migration
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id          TEXT        PRIMARY KEY,             -- 'brakes', 'brake-pads'
  parent_id   TEXT        REFERENCES categories (id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,                                -- CategoryIcon key
  image_url   TEXT,                                -- for the "Popular Parts" tiles
  sort_order  INT         NOT NULL DEFAULT 0,
  is_featured BOOLEAN     NOT NULL DEFAULT FALSE,  -- surfaces in "Popular Parts"
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT no_self_parent CHECK (id <> parent_id)
);

CREATE INDEX idx_categories_parent   ON categories (parent_id, sort_order);
CREATE INDEX idx_categories_featured ON categories (is_featured) WHERE is_featured;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. VEHICLES — a proper hierarchy, not one denormalised row per combination
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE makes (
  id   TEXT PRIMARY KEY,                           -- 'audi'
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE models (
  id       TEXT PRIMARY KEY,                       -- 'a4'
  make_id  TEXT NOT NULL REFERENCES makes (id) ON DELETE CASCADE,
  name     TEXT NOT NULL,                          -- 'A4'
  slug     TEXT NOT NULL UNIQUE,
  body_class TEXT,                                 -- 'saloon' | 'suv' | 'coupe'
  sort_order INT NOT NULL DEFAULT 0
);

-- The chassis generation — how Audi owners actually identify their car.
CREATE TABLE generations (
  id         TEXT PRIMARY KEY,                     -- 'a4-b9'
  model_id   TEXT NOT NULL REFERENCES models (id) ON DELETE CASCADE,
  code       TEXT NOT NULL,                        -- 'B9'
  name       TEXT,                                 -- 'B9 / B9.5'
  year_start INT  NOT NULL,
  year_end   INT,                                  -- NULL = still current
  platform   TEXT,                                 -- 'MLB Evo'

  CONSTRAINT sane_years CHECK (year_end IS NULL OR year_end >= year_start)
);

CREATE TABLE engines (
  id            TEXT PRIMARY KEY,                  -- 'ea888-gen3'
  code          TEXT NOT NULL,                     -- 'EA888' / 'CDNC' / 'DAZA'
  display_name  TEXT NOT NULL,                     -- '2.0 TFSI (EA888 Gen3)'
  displacement  NUMERIC(3,1),                      -- 2.0
  cylinders     INT,
  fuel_type     TEXT CHECK (fuel_type IN ('petrol','diesel','hybrid','electric')),
  aspiration    TEXT CHECK (aspiration IN ('naturally-aspirated','turbo','supercharged','n/a')),
  power_hp      INT
);

-- One row per orderable configuration. This is what fitment points at.
CREATE TABLE vehicles (
  id            TEXT PRIMARY KEY,                  -- 'a4-b9-2018-20tfsi-quattro'
  generation_id TEXT NOT NULL REFERENCES generations (id) ON DELETE CASCADE,
  engine_id     TEXT NOT NULL REFERENCES engines (id),
  year          INT  NOT NULL,
  trim          TEXT,                              -- 'S line' | 'Premium Plus'
  body_style    TEXT,                              -- 'saloon' | 'avant' | 'sportback'
  drivetrain    TEXT CHECK (drivetrain IN ('fwd','quattro','rwd')),
  transmission  TEXT,                              -- 'S tronic 7-spd' | 'manual 6-spd'
  market        TEXT DEFAULT 'US',                 -- specs differ by market

  UNIQUE (generation_id, year, engine_id, trim, body_style, drivetrain, transmission)
);

CREATE INDEX idx_vehicles_generation ON vehicles (generation_id, year);
CREATE INDEX idx_vehicles_engine     ON vehicles (engine_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. BRANDS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE brands (
  id        TEXT PRIMARY KEY,                      -- 'genuine-audi' | 'bosch'
  name      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  tier      TEXT NOT NULL CHECK (tier IN ('oem','oe-supplier','aftermarket','remanufactured')),
  logo_url  TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PARTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE parts (
  sku              TEXT        PRIMARY KEY,
  name             TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,    -- 'audi-brake-pads-420698451d'
  description      TEXT,
  category_id      TEXT        NOT NULL REFERENCES categories (id),
  brand_id         TEXT        NOT NULL REFERENCES brands (id),

  -- The OE number, stored whole AND decomposed. VAG numbers are composite:
  -- 420 698 451 D = type prefix / main group / subgroup / revision index.
  -- Decomposing lets you find "every revision of this part" and "every part
  -- in group 698 for the 420 platform" without string surgery in the app.
  oe_number        TEXT,                           -- '420 698 451 D'
  oe_normalised    TEXT,                           -- '420698451D' — for search
  oe_prefix        TEXT,                           -- '420'
  oe_group         TEXT,                           -- '698'
  oe_subgroup      TEXT,                           -- '451'
  oe_index         TEXT,                           -- 'D'

  condition        TEXT NOT NULL DEFAULT 'new'
                     CHECK (condition IN ('new','remanufactured','used','refurbished')),

  price            NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  cost             NUMERIC(10,2),                  -- margin reporting; never exposed
  -- Refundable deposit on alternators, calipers, turbos. Real money, and the
  -- flat schema had nowhere to put it.
  core_charge      NUMERIC(10,2) NOT NULL DEFAULT 0,

  in_stock         BOOLEAN NOT NULL DEFAULT TRUE,
  stock_count      INT     NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  restock_eta      DATE,
  lead_time_days   INT,                            -- for special-order lines

  weight_kg        NUMERIC(8,3),
  length_cm        NUMERIC(8,2),
  width_cm         NUMERIC(8,2),
  height_cm        NUMERIC(8,2),
  is_oversized     BOOLEAN NOT NULL DEFAULT FALSE, -- drives the freight surcharge

  rating           NUMERIC(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count     INT NOT NULL DEFAULT 0,

  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  is_discontinued  BOOLEAN NOT NULL DEFAULT FALSE,
  -- Drives the homepage "Featured parts" shelf. Without this the shelf just
  -- shows whatever was added most recently, which is not the same thing.
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  warranty_months  INT,

  search_text      TSVECTOR,                       -- maintained by trigger
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parts_category   ON parts (category_id) WHERE is_active;
CREATE INDEX idx_parts_brand      ON parts (brand_id);
CREATE INDEX idx_parts_oe         ON parts (oe_normalised);
CREATE INDEX idx_parts_oe_family  ON parts (oe_prefix, oe_group, oe_subgroup);
CREATE INDEX idx_parts_search     ON parts USING GIN (search_text);
CREATE INDEX idx_parts_price      ON parts (price) WHERE is_active;
CREATE INDEX idx_parts_featured   ON parts (is_featured) WHERE is_featured AND is_active;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. SUPERSESSION — the defining problem of an OEM parts catalogue
--    A customer arrives with a number off the old part. It may have been
--    replaced three times since. Resolve the chain, sell them the current one.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE part_supersessions (
  id             BIGSERIAL PRIMARY KEY,
  old_oe_number  TEXT NOT NULL,                    -- may not exist as a SKU
  new_sku        TEXT REFERENCES parts (sku) ON DELETE SET NULL,
  new_oe_number  TEXT NOT NULL,
  note           TEXT,                             -- 'revised seal, supersedes H'
  effective_date DATE,

  UNIQUE (old_oe_number, new_oe_number)
);

CREATE INDEX idx_supersession_old ON part_supersessions (old_oe_number);

-- Aftermarket equivalents and competitor numbers, for search coverage.
CREATE TABLE part_cross_references (
  id        BIGSERIAL PRIMARY KEY,
  sku       TEXT NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  ref_number TEXT NOT NULL,
  ref_brand  TEXT,
  ref_type   TEXT NOT NULL DEFAULT 'interchange'
               CHECK (ref_type IN ('oe','interchange','aftermarket','superseded')),

  UNIQUE (sku, ref_number)
);

CREATE INDEX idx_xref_number ON part_cross_references (ref_number);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ATTRIBUTES — typed specs, because a disc has a diameter and a wheel has
--    a bolt pattern, and neither belongs in a fixed column on `parts`
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE attribute_definitions (
  id          TEXT PRIMARY KEY,                    -- 'disc-diameter-mm'
  category_id TEXT REFERENCES categories (id) ON DELETE CASCADE, -- NULL = global
  label       TEXT NOT NULL,                       -- 'Disc Diameter'
  unit        TEXT,                                -- 'mm'
  data_type   TEXT NOT NULL DEFAULT 'text'
                CHECK (data_type IN ('text','number','boolean','enum')),
  enum_values TEXT[],
  is_filterable BOOLEAN NOT NULL DEFAULT FALSE,    -- show in sidebar facets
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE part_attributes (
  sku          TEXT NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  attribute_id TEXT NOT NULL REFERENCES attribute_definitions (id) ON DELETE CASCADE,
  value_text   TEXT,
  value_number NUMERIC(12,3),
  value_bool   BOOLEAN,

  PRIMARY KEY (sku, attribute_id)
);

CREATE INDEX idx_part_attr_lookup ON part_attributes (attribute_id, value_number);


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. FITMENT — with position and qualifier, the two fields that prevent returns
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE part_fitment (
  id         BIGSERIAL PRIMARY KEY,
  sku        TEXT NOT NULL REFERENCES parts (sku)    ON DELETE CASCADE,
  vehicle_id TEXT NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  position   TEXT,                                  -- 'front' | 'rear-left' | 'upper'
  -- The qualifier is what separates a correct sale from a return:
  -- 'with 320mm front discs', 'for vehicles with S line suspension',
  -- 'from VIN 8W0-J-000001'
  qualifier  TEXT,
  notes      TEXT,
  quantity_required INT NOT NULL DEFAULT 1,         -- 'you need 2 of these'
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,       -- checked against ETKA

  UNIQUE (sku, vehicle_id, position, qualifier)
);

CREATE INDEX idx_fitment_vehicle ON part_fitment (vehicle_id);
CREATE INDEX idx_fitment_sku     ON part_fitment (sku);


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RELATIONSHIPS — kits, alternatives, and "often replaced together"
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE part_relations (
  id          BIGSERIAL PRIMARY KEY,
  sku         TEXT NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  related_sku TEXT NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  relation    TEXT NOT NULL CHECK (relation IN (
                'often_together',   -- upsell
                'kit_component',    -- this kit contains that part
                'alternative',      -- aftermarket equivalent of an OEM line
                'required_with'     -- must be replaced at the same time
              )),
  quantity    INT NOT NULL DEFAULT 1,

  UNIQUE (sku, related_sku, relation),
  CONSTRAINT no_self_relation CHECK (sku <> related_sku)
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. IMAGES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE part_images (
  id         BIGSERIAL PRIMARY KEY,
  sku        TEXT NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt_text   TEXT,
  kind       TEXT NOT NULL DEFAULT 'photo'
               CHECK (kind IN ('photo','diagram','installed','packaging')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX idx_one_primary_image ON part_images (sku) WHERE is_primary;


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. SEED — taxonomy from the reference catalogue
--     Level 1 = sidebar category. Level 2 = part type (the "Popular Parts" tiles).
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO categories (id, parent_id, name, slug, icon, sort_order, is_featured) VALUES
  -- Brakes
  ('brakes',           NULL,      'Brakes',              'brakes',              'brakes',       1, FALSE),
  ('brake-pads',       'brakes',  'Brake Pads',          'brake-pads',          'brakes',       1, TRUE),
  ('brake-rotors',     'brakes',  'Brake Rotors',        'brake-rotors',        'brakes',       2, TRUE),
  ('brake-calipers',   'brakes',  'Brake Calipers',      'brake-calipers',      'brakes',       3, TRUE),
  ('brake-lines',      'brakes',  'Brake Lines & Hoses', 'brake-lines',         'brakes',       4, FALSE),
  ('wear-sensors',     'brakes',  'Pad Wear Sensors',    'brake-wear-sensors',  'electrical',   5, FALSE),
  ('parking-brake',    'brakes',  'Parking Brake',       'parking-brake',       'brakes',       6, FALSE),

  -- Engine
  ('engine',           NULL,      'Engine Parts',        'engine-parts',        'engine',       2, FALSE),
  ('timing',           'engine',  'Timing Chains & Belts','timing',             'engine',       1, FALSE),
  ('gaskets',          'engine',  'Gaskets & Seals',     'gaskets-seals',       'engine',       2, FALSE),
  ('water-pumps',      'engine',  'Water Pumps',         'water-pumps',         'cooling',      3, FALSE),
  ('oil-pumps',        'engine',  'Oil Pumps',           'oil-pumps',           'engine',       4, FALSE),
  ('pcv',              'engine',  'PCV & Breather',      'pcv-breather',        'engine',       5, FALSE),
  ('engine-mounts',    'engine',  'Engine Mounts',       'engine-mounts',       'engine',       6, FALSE),
  ('belts',            'engine',  'Belts & Pulleys',     'belts',               'engine',       7, TRUE),

  -- Cooling
  ('cooling',          NULL,      'Radiator & Cooling',  'radiator-cooling',    'cooling',      3, FALSE),
  ('radiators',        'cooling', 'Radiators',           'radiators',           'cooling',      1, FALSE),
  ('thermostats',      'cooling', 'Thermostats',         'thermostats',         'cooling',      2, FALSE),
  ('coolant-hoses',    'cooling', 'Coolant Hoses',       'coolant-hoses',       'cooling',      3, FALSE),
  ('expansion-tanks',  'cooling', 'Expansion Tanks',     'expansion-tanks',     'cooling',      4, FALSE),
  ('cooling-fans',     'cooling', 'Cooling Fans',        'cooling-fans',        'cooling',      5, FALSE),
  ('intercoolers',     'cooling', 'Intercoolers',        'intercoolers',        'cooling',      6, FALSE),

  -- Suspension
  ('suspension',       NULL,      'Shocks & Struts',     'shocks-struts',       'suspension',   4, FALSE),
  ('shock-absorbers',  'suspension','Shock Absorbers',   'shock-absorbers',     'suspension',   1, FALSE),
  ('strut-assemblies', 'suspension','Strut Assemblies',  'strut-assemblies',    'suspension',   2, TRUE),
  ('air-springs',      'suspension','Air Springs',       'air-springs',         'suspension',   3, FALSE),
  ('coil-springs',     'suspension','Coil Springs',      'coil-springs',        'suspension',   4, FALSE),
  ('control-arms',     'suspension','Control Arms',      'control-arms',        'suspension',   5, FALSE),
  ('bump-stops',       'suspension','Bump Stops & Bushings','bump-stops',        'suspension',   6, FALSE),

  -- Filters
  ('filters',          NULL,      'Filters',             'filters',             'filters',       5, FALSE),
  ('oil-filters',      'filters', 'Oil Filters',         'oil-filters',         'engine',       1, TRUE),
  ('air-filters',      'filters', 'Air Filters',         'air-filters',         'engine',       2, TRUE),
  ('cabin-filters',    'filters', 'Cabin Air Filters',   'cabin-filters',       'engine',       3, FALSE),
  ('fuel-filters',     'filters', 'Fuel Filters',        'fuel-filters',        'fuel',         4, FALSE),

  -- Ignition
  ('ignition',         NULL,      'Ignition',            'ignition',            'ignition',   6, FALSE),
  ('spark-plugs',      'ignition','Spark Plugs',         'spark-plugs',         'electrical',   1, TRUE),
  ('ignition-coils',   'ignition','Ignition Coils',      'ignition-coils',      'electrical',   2, FALSE),
  ('glow-plugs',       'ignition','Glow Plugs (TDI)',    'glow-plugs',          'electrical',   3, FALSE),

  -- Electrical
  ('electrical',       NULL,      'Electrical',          'electrical',          'electrical',   7, FALSE),
  ('alternators',      'electrical','Alternators',       'alternators',         'electrical',   1, TRUE),
  ('starters',         'electrical','Starters',          'starters',            'electrical',   2, FALSE),
  ('batteries',        'electrical','Batteries',         'batteries',           'electrical',   3, FALSE),
  ('sensors',          'electrical','Sensors',           'sensors',             'electrical',   4, FALSE),
  ('speakers',         'electrical','Speakers & Audio',  'speakers',            'electrical',   5, FALSE),

  -- Induction
  ('induction',        NULL,      'Induction Components','induction',           'induction',       8, FALSE),
  ('turbochargers',    'induction','Turbochargers',      'turbochargers',       'engine',       1, FALSE),
  ('intake-manifolds', 'induction','Intake Manifolds',   'intake-manifolds',    'engine',       2, FALSE),
  ('charge-pipes',     'induction','Charge Pipes',       'charge-pipes',        'engine',       3, FALSE),
  ('maf-sensors',      'induction','MAF Sensors',        'maf-sensors',         'electrical',   4, FALSE),

  -- Transmission & driveline. Absent from the reference site's sidebar, but a
  -- parts catalogue needs it -- gearbox filters, clutches and mechatronic units
  -- have nowhere else to live.
  ('transmission',      NULL,           'Transmission',        'transmission',        'transmission', 13, FALSE),
  ('transmission-filters','transmission','Transmission Filters','transmission-filters','transmission', 1, FALSE),
  ('clutch-kits',       'transmission', 'Clutch Kits',         'clutch-kits',         'transmission', 2, FALSE),
  ('mechatronic',       'transmission', 'Mechatronic Units',   'mechatronic',         'transmission', 3, FALSE),
  ('driveshafts',       'transmission', 'Driveshafts & quattro','driveshafts',        'transmission', 4, FALSE),

  -- Wheels
  ('wheels',           NULL,      'Wheels & Rims',       'wheels-rims',         'wheels',   9, FALSE),
  ('alloy-wheels',     'wheels',  'Alloy Wheels',        'alloy-wheels',        'suspension',   1, FALSE),
  ('wheel-bolts',      'wheels',  'Wheel Bolts & Locks', 'wheel-bolts',         'suspension',   2, FALSE),
  ('centre-caps',      'wheels',  'Centre Caps',         'centre-caps',         'body',         3, FALSE),
  ('tpms',             'wheels',  'TPMS Sensors',        'tpms-sensors',        'electrical',   4, FALSE),
  ('wheel-accessories','wheels',  'Wheel Accessories',   'wheel-accessories',   'wheels',       5, FALSE),

  -- Body
  ('body',             NULL,      'Body',                'body',                'body',        10, FALSE),
  ('fenders',          'body',    'Fenders',             'fenders',             'body',         1, FALSE),
  ('mirrors',          'body',    'Mirrors',             'mirrors',             'body',         2, FALSE),
  ('grilles',          'body',    'Singleframe Grilles', 'grilles',             'body',         3, FALSE),
  ('body-trim',        'body',    'Exterior Trim',       'exterior-trim',       'body',         4, FALSE),
  ('quarter-panels',   'body',    'Quarter & Side Panels','quarter-panels',     'body',         5, FALSE),
  ('body-brackets',    'body',    'Brackets & Reinforcements','body-brackets',   'body',         6, FALSE),
  ('fasteners',        'body',    'Clips & Fasteners',   'fasteners',           'body',         7, FALSE),

  -- Bumpers
  ('bumpers',          NULL,      'Bumpers',             'bumpers',             'bumpers',        11, FALSE),
  ('front-bumpers',    'bumpers', 'Front Bumpers',       'front-bumpers',       'body',         1, FALSE),
  ('rear-bumpers',     'bumpers', 'Rear Bumpers',        'rear-bumpers',        'body',         2, FALSE),
  ('bumper-brackets',  'bumpers', 'Brackets & Absorbers','bumper-brackets',     'body',         3, FALSE),
  ('park-sensors',     'bumpers', 'Parking Sensors',     'parking-sensors',     'electrical',   4, FALSE),

  -- Lighting
  ('lighting',         NULL,      'Lighting',            'lighting',            'lighting',  12, FALSE),
  ('headlights',       'lighting','Headlights',          'headlights',          'electrical',   1, FALSE),
  ('tail-lights',      'lighting','Tail Lights',         'tail-lights',         'electrical',   2, FALSE),
  ('fog-lights',       'lighting','Fog Lights',          'fog-lights',          'electrical',   3, FALSE),
  ('bulbs',            'lighting','Bulbs & LED Modules', 'bulbs',               'electrical',   4, FALSE);


-- Brands. Seeded here because `parts.brand_id` is NOT NULL with an FK --
-- without these rows, every parts INSERT fails on parts_brand_id_fkey.
INSERT INTO brands (id, name, slug, tier) VALUES
  ('genuine-audi',   'Genuine Audi',        'genuine-audi',   'oem'),
  ('vag-oe',         'VAG OE',              'vag-oe',         'oem'),
  ('ate',            'ATE',                 'ate',            'oe-supplier'),
  ('textar',         'Textar',              'textar',         'oe-supplier'),
  ('zimmermann',     'Otto Zimmermann',     'zimmermann',     'oe-supplier'),
  ('brembo',         'Brembo',              'brembo',         'oe-supplier'),
  ('bosch',          'Bosch',               'bosch',          'oe-supplier'),
  ('lemforder',      'Lemförder',           'lemfoerder',     'oe-supplier'),
  ('sachs',          'Sachs',               'sachs',          'oe-supplier'),
  ('mahle',          'Mahle',               'mahle',          'oe-supplier'),
  ('hella',          'Hella',               'hella',          'oe-supplier'),
  ('valeo',          'Valeo',               'valeo',          'oe-supplier'),
  ('meyle',          'Meyle',               'meyle',          'aftermarket'),
  ('febi',           'febi bilstein',       'febi',           'aftermarket'),
  ('reman-exchange', 'Remanufactured Exchange', 'reman-exchange', 'remanufactured')
ON CONFLICT (id) DO NOTHING;


-- Example attribute definitions, showing the pattern per part type.
INSERT INTO attribute_definitions (id, category_id, label, unit, data_type, is_filterable, sort_order) VALUES
  ('disc-diameter',  'brake-rotors', 'Disc Diameter',    'mm',  'number',  TRUE,  1),
  ('disc-type',      'brake-rotors', 'Disc Type',        NULL,  'enum',    TRUE,  2),
  ('pad-compound',   'brake-pads',   'Friction Compound',NULL,  'enum',    TRUE,  1),
  ('wear-sensor',    'brake-pads',   'Wear Sensor Included', NULL, 'boolean', TRUE, 2),
  ('bolt-pattern',   'alloy-wheels', 'Bolt Pattern',     NULL,  'text',    TRUE,  1),
  ('wheel-offset',   'alloy-wheels', 'Offset (ET)',      'mm',  'number',  TRUE,  2);

UPDATE attribute_definitions SET enum_values = ARRAY['vented','solid','drilled','slotted']
  WHERE id = 'disc-type';
UPDATE attribute_definitions SET enum_values = ARRAY['ceramic-organic','semi-metallic','low-metallic']
  WHERE id = 'pad-compound';
