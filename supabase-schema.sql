-- =============================================================================
-- Audi Parts Sales – Supabase Database Schema
-- =============================================================================
-- Run this in the Supabase SQL Editor to create all tables.
-- Supabase automatically creates a "public" schema and enables Row Level
-- Security (RLS). Enable RLS policies after seeding data as required.
-- =============================================================================

-- -----------------------------------------------------------------------
-- 1. VEHICLES
--    Canonical list of Audi year/model/engine combinations.
-- -----------------------------------------------------------------------
CREATE TABLE vehicles (
  id            TEXT        PRIMARY KEY,  -- e.g. 'a4-2018-20-ea888'
  year          SMALLINT    NOT NULL CHECK (year BETWEEN 1960 AND 2100),
  make          TEXT        NOT NULL DEFAULT 'Audi',
  model         TEXT        NOT NULL,
  engine        TEXT        NOT NULL,
  engine_code   TEXT,                     -- e.g. 'EA888'
  trim          TEXT,
  body_style    TEXT,                     -- e.g. 'Coupe', 'Sedan', 'Ute'
  region        TEXT,                     -- e.g. 'Global', 'JDM', 'USDM'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_model ON vehicles (model);
CREATE INDEX idx_vehicles_year  ON vehicles (year);

-- -----------------------------------------------------------------------
-- 2. CATEGORIES
--    Top-level part categories (Engine, Brakes, Suspension, etc.)
-- -----------------------------------------------------------------------
CREATE TABLE categories (
  id          TEXT    PRIMARY KEY,        -- slug e.g. 'engine'
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,                       -- emoji or icon identifier
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- 3. PARTS
--    Core parts catalogue. One row per unique SKU.
-- -----------------------------------------------------------------------
CREATE TABLE parts (
  sku               TEXT        PRIMARY KEY,
  name              TEXT        NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10,2) CHECK (compare_at_price >= 0),
  brand             TEXT        NOT NULL CHECK (brand IN ('Genuine OEM', 'Aftermarket')),
  category_id       TEXT        NOT NULL REFERENCES categories (id),
  part_number       TEXT        NOT NULL,
  oem_cross_ref     TEXT,                 -- comma-separated OEM part numbers
  weight_kg         NUMERIC(6,3),
  material          TEXT,
  in_stock          BOOLEAN     NOT NULL DEFAULT TRUE,
  stock_count       INTEGER     NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  rating            NUMERIC(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count      INTEGER     NOT NULL DEFAULT 0,
  tags              TEXT[],               -- array of search/filter tags
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parts_category  ON parts (category_id);
CREATE INDEX idx_parts_brand     ON parts (brand);
CREATE INDEX idx_parts_in_stock  ON parts (in_stock);
CREATE INDEX idx_parts_price     ON parts (price);
-- Full-text search index across name, description, and part_number
CREATE INDEX idx_parts_fts ON parts
  USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(part_number,'')));

-- -----------------------------------------------------------------------
-- 4. PART IMAGES
--    Multiple images per part, ordered by sort_order.
-- -----------------------------------------------------------------------
CREATE TABLE part_images (
  id          BIGSERIAL   PRIMARY KEY,
  sku         TEXT        NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  alt_text    TEXT,
  is_primary  BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_part_images_sku ON part_images (sku);

-- -----------------------------------------------------------------------
-- 5. PART FITMENT  (many-to-many: parts ↔ vehicles)
--    Records which vehicles a part is compatible with.
-- -----------------------------------------------------------------------
CREATE TABLE part_fitment (
  sku         TEXT    NOT NULL REFERENCES parts   (sku)        ON DELETE CASCADE,
  vehicle_id  TEXT    NOT NULL REFERENCES vehicles (id)        ON DELETE CASCADE,
  notes       TEXT,               -- e.g. 'Only for manual transmission variants'
  confirmed   BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (sku, vehicle_id)
);

CREATE INDEX idx_part_fitment_vehicle ON part_fitment (vehicle_id);
CREATE INDEX idx_part_fitment_sku     ON part_fitment (sku);

-- -----------------------------------------------------------------------
-- 6. RELATED PARTS  (self-referencing: "often replaced together")
-- -----------------------------------------------------------------------
CREATE TABLE related_parts (
  sku         TEXT    NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  related_sku TEXT    NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  relation    TEXT    NOT NULL DEFAULT 'often_together',  -- or 'accessory', 'upgrade'
  PRIMARY KEY (sku, related_sku)
);

-- -----------------------------------------------------------------------
-- 7. CUSTOMERS
--    Extends Supabase auth.users with profile data.
-- -----------------------------------------------------------------------
CREATE TABLE customers (
  id              UUID    PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT    NOT NULL UNIQUE,
  phone           TEXT,
  is_trade        BOOLEAN NOT NULL DEFAULT FALSE,
  trade_discount  NUMERIC(4,2) DEFAULT 0 CHECK (trade_discount BETWEEN 0 AND 100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- 8. GARAGE VEHICLES  (customer's saved vehicles)
-- -----------------------------------------------------------------------
CREATE TABLE garage_vehicles (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  vehicle_id  TEXT        NOT NULL REFERENCES vehicles  (id),
  nickname    TEXT,                   -- e.g. 'My Daily Driver'
  is_default  BOOLEAN     NOT NULL DEFAULT FALSE,
  vin         TEXT CHECK (length(vin) = 17 OR vin IS NULL),
  mileage_km  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_garage_customer ON garage_vehicles (customer_id);

-- -----------------------------------------------------------------------
-- 9. ADDRESSES
-- -----------------------------------------------------------------------
CREATE TABLE addresses (
  id            BIGSERIAL   PRIMARY KEY,
  customer_id   UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  type          TEXT        NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  company       TEXT,
  line1         TEXT        NOT NULL,
  line2         TEXT,
  city          TEXT        NOT NULL,
  state         TEXT,
  postal_code   TEXT        NOT NULL,
  country       TEXT        NOT NULL DEFAULT 'US',
  phone         TEXT,
  is_default    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer ON addresses (customer_id);

-- -----------------------------------------------------------------------
-- 10. CART ITEMS  (persisted server-side cart)
-- -----------------------------------------------------------------------
CREATE TABLE cart_items (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        REFERENCES customers (id) ON DELETE CASCADE,
  session_id  TEXT,                       -- for guest carts
  sku         TEXT        NOT NULL REFERENCES parts (sku),
  quantity    SMALLINT    NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL,     -- price at time of adding
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_owner CHECK (customer_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_cart_customer ON cart_items (customer_id);
CREATE INDEX idx_cart_session  ON cart_items (session_id);

-- -----------------------------------------------------------------------
-- 11. ORDERS
-- -----------------------------------------------------------------------
CREATE TABLE orders (
  id                  BIGSERIAL       PRIMARY KEY,
  order_number        TEXT            NOT NULL UNIQUE,  -- e.g. 'ORD-2026-00123'
  customer_id         UUID            REFERENCES customers (id),
  guest_email         TEXT,
  status              TEXT            NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','processing','shipped','delivered','cancelled','refunded')),
  subtotal            NUMERIC(10,2)   NOT NULL,
  shipping_cost       NUMERIC(10,2)   NOT NULL DEFAULT 0,
  tax                 NUMERIC(10,2)   NOT NULL DEFAULT 0,
  discount            NUMERIC(10,2)   NOT NULL DEFAULT 0,
  total               NUMERIC(10,2)   NOT NULL,
  currency            TEXT            NOT NULL DEFAULT 'USD',
  shipping_method     TEXT,
  tracking_number     TEXT,
  carrier             TEXT,
  shipping_address_id BIGINT          REFERENCES addresses (id),
  billing_address_id  BIGINT          REFERENCES addresses (id),
  notes               TEXT,
  placed_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer    ON orders (customer_id);
CREATE INDEX idx_orders_status      ON orders (status);
CREATE INDEX idx_orders_placed_at   ON orders (placed_at DESC);
CREATE INDEX idx_orders_number      ON orders (order_number);

-- -----------------------------------------------------------------------
-- 12. ORDER ITEMS
-- -----------------------------------------------------------------------
CREATE TABLE order_items (
  id            BIGSERIAL       PRIMARY KEY,
  order_id      BIGINT          NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  sku           TEXT            NOT NULL REFERENCES parts (sku),
  quantity      SMALLINT        NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10,2)   NOT NULL,
  total_price   NUMERIC(10,2)   NOT NULL,
  part_snapshot JSONB,                    -- snapshot of part name/number at purchase time
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_sku   ON order_items (sku);

-- -----------------------------------------------------------------------
-- 13. REVIEWS
-- -----------------------------------------------------------------------
CREATE TABLE reviews (
  id          BIGSERIAL   PRIMARY KEY,
  sku         TEXT        NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  customer_id UUID        REFERENCES customers (id) ON DELETE SET NULL,
  order_id    BIGINT      REFERENCES orders (id) ON DELETE SET NULL,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  author_name TEXT        NOT NULL,
  is_verified BOOLEAN     NOT NULL DEFAULT FALSE,   -- verified purchase
  is_approved BOOLEAN     NOT NULL DEFAULT FALSE,   -- moderation flag
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_sku        ON reviews (sku);
CREATE INDEX idx_reviews_customer   ON reviews (customer_id);
CREATE INDEX idx_reviews_approved   ON reviews (is_approved);

-- -----------------------------------------------------------------------
-- 14. TESTIMONIALS
--    Curated customer quotes displayed on the homepage and marketing pages.
--    Separate from product reviews — these are hand-picked / moderated entries.
-- -----------------------------------------------------------------------
CREATE TABLE testimonials (
  id              BIGSERIAL   PRIMARY KEY,
  author_name     TEXT        NOT NULL,
  author_location TEXT,                       -- e.g. 'Atlanta, GA'
  vehicle         TEXT        NOT NULL,       -- e.g. '2018 Audi A4 B9 2.0 TFSI'
  rating          SMALLINT    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote           TEXT        NOT NULL,
  part_bought     TEXT,                       -- free-text summary of purchased item
  sku             TEXT        REFERENCES parts (sku) ON DELETE SET NULL,
  avatar_initials TEXT,                       -- e.g. 'MT'
  avatar_color    TEXT        DEFAULT '#EB0A1E',
  is_featured     BOOLEAN     NOT NULL DEFAULT FALSE,  -- show on homepage carousel
  is_approved     BOOLEAN     NOT NULL DEFAULT FALSE,  -- moderation gate
  display_order   SMALLINT    NOT NULL DEFAULT 0,
  published_at    DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured  ON testimonials (is_featured, is_approved, display_order);
CREATE INDEX idx_testimonials_sku       ON testimonials (sku);

-- RLS: public can read approved testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = TRUE);

-- Seed: matches lib/data.ts testimonials array
INSERT INTO testimonials (author_name, author_location, vehicle, rating, quote, part_bought, avatar_initials, avatar_color, is_featured, is_approved, display_order, published_at) VALUES
  ('Marcus T.',  'Atlanta, GA',    '2018 Audi A4 B9 2.0 TFSI',  5, 'I chased the right water pump module for my B9 for weeks. Every other site sent the pre-revision housing or couldn''t confirm which one my engine code took. Audi Parts Sales listed the exact revised part number and it landed next day.', 'Water Pump & Thermostat Module – EA888', 'MT', '#a6192e', TRUE, TRUE, 1, '2026-03-01'),
  ('Priya S.',   'Melbourne, AU',  '2020 Audi A4 B9 2.0 TDI',   5, 'Ordered the front pad and disc set for my B9. The fitment checker confirmed the 320 mm variant in seconds — that detail alone saved me a return. Parts arrived in genuine Audi packaging, exactly as described.',                       'Front Brake Pad + Disc Set – A4 B9',     'PS', '#2e353d', TRUE, TRUE, 2, '2026-02-01'),
  ('Ryan O.',    'Nairobi, KE',    '2022 Audi Q7 4M 3.0 TDI',   5, 'Sourcing a genuine front air strut for a Q7 4M locally is close to impossible — everything on offer is a pattern copy. I ordered the OEM unit here and it shipped internationally in six days, no damage.',                          'Front Air Suspension Strut – Q7 4M',     'RO', '#4a545f', TRUE, TRUE, 3, '2026-01-01'),
  ('Claire W.',  'Houston, TX',    '2019 Audi A3 2.0 TFSI',     5, 'The PCV valve for my A3 was exactly right. I was nervous ordering online because the wrong revision just brings the lean code straight back, but the fitment database matched it to my VIN and support replied in under two hours.',   'PCV Valve / Oil Separator – 2.0 TFSI',   'CW', '#7e1223', TRUE, TRUE, 4, '2026-03-10'),
  ('James P.',   'Toronto, CA',    '2021 Audi Q5 2.0 TFSI',     5, 'The remanufactured 180 A alternator saved me well over $200 against the dealer price, and it came with a two-year warranty. The listing was honest about exactly what it was, and three months in it is running flawlessly.',        'Alternator 180A – 2.0 TFSI',             'JP', '#98a2ad', TRUE, TRUE, 5, '2025-12-01'),
  ('Aiko N.',    'Osaka, JP',      '2018 Audi TT 2.5 TFSI',     5, 'Found the genuine coil pack set that I could not get at a sensible price anywhere in Japan. Shipped in five business days. Unmistakably genuine — the casting and the Audi part stamp match the ones I pulled out.',                'Ignition Coil Pack – TFSI (Set of 4)',   'AN', '#1c2127', TRUE, TRUE, 6, '2026-02-15');

-- -----------------------------------------------------------------------
-- 15. WISHLISTS
-- -----------------------------------------------------------------------
CREATE TABLE wishlists (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  sku         TEXT        NOT NULL REFERENCES parts (sku),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, sku)
);

CREATE INDEX idx_wishlists_customer ON wishlists (customer_id);

-- -----------------------------------------------------------------------
-- 15. NEWSLETTER SUBSCRIBERS
-- -----------------------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id          BIGSERIAL   PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  customer_id UUID        REFERENCES customers (id) ON DELETE SET NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  source      TEXT        DEFAULT 'footer_form',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------
-- TRIGGERS – auto-update "updated_at" columns
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER parts_updated_at    BEFORE UPDATE ON parts     FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER orders_updated_at   BEFORE UPDATE ON orders    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -----------------------------------------------------------------------
-- FUNCTION – recalculate part rating after review insert/update/delete
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION refresh_part_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE parts
  SET
    rating       = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE),
    review_count = (SELECT COUNT(*)                 FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE)
  WHERE sku = COALESCE(NEW.sku, OLD.sku);
  RETURN NULL;
END;
$$;

CREATE TRIGGER reviews_after_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_part_rating();

-- -----------------------------------------------------------------------
-- ROW LEVEL SECURITY – enable and add basic policies
-- -----------------------------------------------------------------------
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage_vehicles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists         ENABLE ROW LEVEL SECURITY;

-- Customers can only access their own data
CREATE POLICY "customers_self"
  ON customers FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "garage_self"
  ON garage_vehicles FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "addresses_self"
  ON addresses FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "cart_self"
  ON cart_items FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "orders_self"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "order_items_self"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "wishlists_self"
  ON wishlists FOR ALL
  USING (auth.uid() = customer_id);

-- Public read access for catalogue tables (no auth required)
CREATE POLICY "public_read_parts"       ON parts       FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_categories"  ON categories  FOR SELECT USING (TRUE);
CREATE POLICY "public_read_vehicles"    ON vehicles    FOR SELECT USING (TRUE);
CREATE POLICY "public_read_images"      ON part_images FOR SELECT USING (TRUE);
CREATE POLICY "public_read_fitment"     ON part_fitment FOR SELECT USING (TRUE);
CREATE POLICY "public_read_related"     ON related_parts FOR SELECT USING (TRUE);
CREATE POLICY "public_read_reviews"     ON reviews     FOR SELECT USING (is_approved = TRUE);

-- -----------------------------------------------------------------------
-- SAMPLE SEED DATA (matches lib/data.ts mock data)
-- -----------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
  ('engine',       'Engine',         'engine',       'Timing chain kits, water pumps, PCV valves, oil separators, and internal engine components.',        '⚙️', 1),
  ('transmission', 'Transmission',   'transmission', 'S tronic and multitronic components, clutch kits, quattro driveline, and mechatronic units.',        '🔧', 2),
  ('suspension',   'Suspension',     'suspension',   'Adaptive dampers, air springs, control arms, tie rods, and bushings.',                               '🛞', 3),
  ('brakes',       'Brakes',         'brakes',       'Brake pads, vented discs, calipers, wear sensors, and electronic parking brake motors.',             '🔴', 4),
  ('electrical',   'Electrical',     'electrical',   'Alternators, ignition coils, MAF and NOx sensors, control modules, and wiring looms.',               '⚡', 5),
  ('body',         'Body & Exterior','body',         'Bumpers, Singleframe grilles, mirrors, LED headlamp units, and exterior trim.',                      '🚗', 6),
  ('cooling',      'Cooling',        'cooling',      'Radiators, thermostat housings, intercoolers, coolant hoses, and electric fans.',                    '❄️', 7),
  ('fuel',         'Fuel System',    'fuel',         'High-pressure fuel pumps, injectors, filters, and fuel rails for TFSI and TDI engines.',             '⛽', 8);

INSERT INTO vehicles (id, year, make, model, engine, engine_code) VALUES
  ('a4-2018-20-ea888',  2018, 'Audi', 'A4', '2.0 TFSI (EA888 Gen3)', 'EA888'),
  ('a4-2020-20d-ea288', 2020, 'Audi', 'A4', '2.0 TDI (EA288)',       'EA288'),
  ('a4-2012-20-cdnc',   2012, 'Audi', 'A4', '2.0 TFSI (CDNC)',       'CDNC'),
  ('a3-2019-20',        2019, 'Audi', 'A3', '2.0 TFSI (EA888 Gen3)', 'EA888'),
  ('a6-2020-30t',       2020, 'Audi', 'A6', '3.0 TFSI V6 (EA839)',   'EA839'),
  ('q5-2021-20',        2021, 'Audi', 'Q5', '2.0 TFSI (EA888 Gen3)', 'EA888'),
  ('q7-2022-30d',       2022, 'Audi', 'Q7', '3.0 TDI V6 (CRCA)',     'CRCA'),
  ('tt-2018-25t',       2018, 'Audi', 'TT', '2.5 TFSI 5-Cyl (DAZA)', 'DAZA'),
  ('r8-2017-52',        2017, 'Audi', 'R8', '5.2 FSI V10 (CTPA)',    'CTPA');

INSERT INTO parts (sku, name, description, price, compare_at_price, brand, category_id, part_number, oem_cross_ref, weight_kg, material, in_stock, stock_count) VALUES
  ('AUD-WP-EA888-OEM',      'Water Pump & Thermostat Module – 2.0 TFSI EA888', 'Genuine Audi water pump with integrated thermostat housing, revised seal.', 189.95, 249.00, 'Genuine OEM', 'engine',     '06L 121 111 I',  '06L 121 111 H, 06L 121 111 G',  1.4, 'Reinforced composite housing, aluminium impeller', TRUE,  23),
  ('AUD-TCK-EA888-OEM',     'Timing Chain Kit – 2.0 TFSI EA888 Gen3',          'Chain, revised hydraulic tensioner, guide rails, and hardware.',            328.00, 415.00, 'Genuine OEM', 'engine',     '06K 109 158 AB', '06K 109 158 P, 06H 109 467 AE', 1.1, 'Hardened steel chain, composite guides',           TRUE,   8),
  ('AUD-PCV-EA888-OEM',     'PCV Valve / Oil Separator – 2.0 TFSI',            'Crankcase ventilation valve with integrated oil separator.',                 96.50, NULL,   'Genuine OEM', 'engine',     '06H 103 495 AE', '06H 103 495 AC, 06H 103 495 T', 0.5, 'Glass-filled nylon, silicone diaphragm',           TRUE,  15),
  ('AUD-BP-B9-FRONT-OEM',   'Front Brake Pad Set – A4 B9 2016–2024',           'Low-dust ceramic-organic pads for the 320 mm front disc.',                  118.90, NULL,   'Genuine OEM', 'brakes',     '8W0 698 151 AG', '8W0 698 151 R, 8W0 698 151 AF', 2.9, 'Ceramic-organic compound',                         TRUE,  42),
  ('AUD-DISC-B9-FRONT-OEM', 'Front Brake Disc – A4 B9 320 mm Vented',          'OEM-spec vented front disc, corrosion-coated hub face. Sold each.',          142.00, 179.00, 'Genuine OEM', 'brakes',     '8W0 615 301 F',  NULL,                            9.2, 'Grey cast iron, corrosion-protected',              TRUE,  19),
  ('AUD-STRUT-Q7-FRONT',    'Front Air Suspension Strut – Q7 4M',              'Complete adaptive air strut: bellows, damper, and top mount.',               689.00, NULL,   'Genuine OEM', 'suspension', '4M0 616 039 AR', NULL,                            9.8, 'Reinforced rubber bellows, aluminium body',        FALSE,  0),
  ('AUD-ALT-EA888-AFT',     'Alternator 180A – 2.0 TFSI (Aftermarket)',        'Remanufactured 180 A alternator, new bearings and regulator.',               289.00, 520.00, 'Aftermarket', 'electrical', '06L 903 026 S-RM','06L 903 026 S, 06L 903 026 F', 6.1, 'Copper windings, aluminium housing',               TRUE,   6),
  ('AUD-COIL-EA888-OEM',    'Ignition Coil Pack – TFSI (Set of 4)',            'Latest-revision genuine coils, supplied as a matched set of four.',          168.00, NULL,   'Genuine OEM', 'electrical', '06L 905 110 K',  '06L 905 110 J, 06H 905 110 R',  0.8, 'Epoxy-encapsulated windings',                      TRUE,  54),
  ('AUD-THERM-EA888-OEM',   'Thermostat Housing – 2.0 TFSI / 1.8 TFSI',        'Thermostat and housing with integrated coolant temperature sensor.',          84.50, NULL,   'Genuine OEM', 'cooling',    '06H 121 026 CQ', NULL,                            0.6, 'Composite housing, brass insert',                  TRUE,  54);

INSERT INTO part_fitment (sku, vehicle_id) VALUES
  ('AUD-WP-EA888-OEM',      'a4-2018-20-ea888'),
  ('AUD-TCK-EA888-OEM',     'a4-2018-20-ea888'),
  ('AUD-TCK-EA888-OEM',     'a4-2012-20-cdnc'),
  ('AUD-PCV-EA888-OEM',     'a4-2018-20-ea888'),
  ('AUD-PCV-EA888-OEM',     'a3-2019-20'),
  ('AUD-PCV-EA888-OEM',     'q5-2021-20'),
  ('AUD-BP-B9-FRONT-OEM',   'a4-2018-20-ea888'),
  ('AUD-BP-B9-FRONT-OEM',   'a4-2020-20d-ea288'),
  ('AUD-DISC-B9-FRONT-OEM', 'a4-2018-20-ea888'),
  ('AUD-DISC-B9-FRONT-OEM', 'a4-2020-20d-ea288'),
  ('AUD-STRUT-Q7-FRONT',    'q7-2022-30d'),
  ('AUD-ALT-EA888-AFT',     'a4-2018-20-ea888'),
  ('AUD-ALT-EA888-AFT',     'q5-2021-20'),
  ('AUD-COIL-EA888-OEM',    'a4-2018-20-ea888'),
  ('AUD-COIL-EA888-OEM',    'a3-2019-20'),
  ('AUD-COIL-EA888-OEM',    'q5-2021-20'),
  ('AUD-COIL-EA888-OEM',    'tt-2018-25t'),
  ('AUD-THERM-EA888-OEM',   'a4-2018-20-ea888'),
  ('AUD-THERM-EA888-OEM',   'a4-2012-20-cdnc'),
  ('AUD-THERM-EA888-OEM',   'a3-2019-20');

INSERT INTO related_parts (sku, related_sku, relation) VALUES
  ('AUD-WP-EA888-OEM',      'AUD-TCK-EA888-OEM',      'often_together'),
  ('AUD-WP-EA888-OEM',      'AUD-THERM-EA888-OEM',    'often_together'),
  ('AUD-TCK-EA888-OEM',     'AUD-WP-EA888-OEM',       'often_together'),
  ('AUD-TCK-EA888-OEM',     'AUD-PCV-EA888-OEM',      'often_together'),
  ('AUD-PCV-EA888-OEM',     'AUD-TCK-EA888-OEM',      'often_together'),
  ('AUD-BP-B9-FRONT-OEM',   'AUD-DISC-B9-FRONT-OEM',  'often_together'),
  ('AUD-DISC-B9-FRONT-OEM', 'AUD-BP-B9-FRONT-OEM',    'often_together'),
  ('AUD-ALT-EA888-AFT',     'AUD-COIL-EA888-OEM',     'often_together');
