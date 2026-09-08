-- =============================================================================
-- Orders + order items.
--
-- WHY A SEPARATE FILE
--   supabase-schema.sql defines these tables, but it cannot be re-run against
--   this database: its statements are plain CREATE TABLE with no IF NOT EXISTS,
--   so it fails on `parts` (which already exists) long before it reaches the
--   orders section. This file carries just the two tables that are missing.
--
-- WHAT IT UNBLOCKS
--   * /admin/orders, which currently renders an explanatory empty state.
--   * Checkout. app/actions/checkout.ts inserts into `orders` and then
--     `order_items`; with neither table present the insert throws and the
--     customer is shown "Failed to process checkout". Orders are being lost
--     today — this is the fix.
--
-- ONE DELIBERATE DIFFERENCE FROM supabase-schema.sql
--   The schema declares customer_id, shipping_address_id and billing_address_id
--   as foreign keys to `customers` and `addresses`. Neither of those tables
--   exists here either, and checkout does not populate any of the three — it
--   records guest_email and writes the address into `notes` as free text.
--   The columns are kept so the schema still lines up, but the REFERENCES are
--   omitted; adding them for tables that do not exist would make this file fail
--   the same way supabase-schema.sql does. Re-add them with the ALTER TABLE
--   statements at the bottom once customers/addresses are created.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS orders (
  id                  BIGSERIAL       PRIMARY KEY,
  order_number        TEXT            NOT NULL UNIQUE,  -- e.g. 'ORD-2026-00123'
  customer_id         UUID,                             -- FK deferred, see header
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
  shipping_address_id BIGINT,                           -- FK deferred, see header
  billing_address_id  BIGINT,                           -- FK deferred, see header
  notes               TEXT,
  placed_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer  ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON orders (placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number    ON orders (order_number);

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGSERIAL       PRIMARY KEY,
  order_id      BIGINT          NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  sku           TEXT            NOT NULL REFERENCES parts (sku),
  quantity      SMALLINT        NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10,2)   NOT NULL,
  total_price   NUMERIC(10,2)   NOT NULL,
  part_snapshot JSONB,                    -- name/number at purchase time
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sku   ON order_items (sku);

-- Both tables are reached only through the service-role key (the admin pages
-- and the checkout server action), never from the browser. Enabling RLS with
-- no policy keeps the anon key locked out; the service role bypasses it.
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

COMMIT;


-- =============================================================================
-- VERIFY
--   SELECT count(*) FROM orders;        -- 0 on a fresh install
--   \d orders
--
-- LATER, once customers and addresses exist, restore the three foreign keys:
--   ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey
--     FOREIGN KEY (customer_id) REFERENCES customers (id);
--   ALTER TABLE orders ADD CONSTRAINT orders_shipping_address_id_fkey
--     FOREIGN KEY (shipping_address_id) REFERENCES addresses (id);
--   ALTER TABLE orders ADD CONSTRAINT orders_billing_address_id_fkey
--     FOREIGN KEY (billing_address_id) REFERENCES addresses (id);
-- =============================================================================
