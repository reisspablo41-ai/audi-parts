-- =============================================================================
-- Migration: add parts.is_featured, and activate the brake disc seed.
-- Safe to re-run.
-- =============================================================================

-- 1. The column the "Featured parts" shelf reads.
ALTER TABLE parts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_parts_featured ON parts (is_featured) WHERE is_featured AND is_active;


-- 2. WHY YOUR SHOP IS EMPTY
--    Every row from seed-brake-discs.sql loaded with is_active = FALSE and
--    price = 0.00 by design, so nothing unpriced could ever reach a customer.
--    That gate is doing its job -- it is also why the storefront shows nothing.
--
--    Set real prices FIRST, then activate. Example:

-- UPDATE parts SET price = 142.00, in_stock = TRUE, stock_count = 8
--  WHERE sku = 'AUD-8V0615301R';

--    Once priced, activate only the rows that actually have a price:

-- UPDATE parts
--    SET is_active = TRUE
--  WHERE price > 0
--    AND sku LIKE 'AUD-%';

--    And feature a handful on the homepage:

-- UPDATE parts SET is_featured = TRUE
--  WHERE sku IN ('AUD-8V0615301R','AUD-4M0615301AP','AUD-80A615601C','AUD-420698451D')
--    AND price > 0 AND is_active;


-- 3. Guard: nothing active may carry a zero price.
--    Run this after any bulk activation -- it must return zero rows.
-- SELECT sku, price FROM parts WHERE is_active AND price = 0;


-- 4. Distinct icons for the top-level categories. Six of them were sharing an
--    icon with another category, which reads as unfinished on the homepage grid.
UPDATE categories SET icon = 'filters'   WHERE id = 'filters';
UPDATE categories SET icon = 'ignition'  WHERE id = 'ignition';
UPDATE categories SET icon = 'induction' WHERE id = 'induction';
UPDATE categories SET icon = 'wheels'    WHERE id = 'wheels';
UPDATE categories SET icon = 'bumpers'   WHERE id = 'bumpers';
UPDATE categories SET icon = 'lighting'  WHERE id = 'lighting';
