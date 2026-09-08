-- =============================================================================
-- REVIEWS
--
-- The reviews table from supabase-schema.sql was never applied to the live
-- database, so /admin/reviews, the product-page review section and ReviewForm
-- all had nothing behind them. This migration brings the table up on its own,
-- without re-running the whole schema.
--
-- Safe to re-run: every object is created IF NOT EXISTS or replaced outright.
--
-- Two deliberate departures from supabase-schema.sql, both because the columns
-- they referenced do not exist on this database yet:
--   * customer_id / order_id are created WITHOUT foreign keys. The customers
--     and orders tables are not present; the columns are kept so the schema
--     lines up once migration-orders.sql lands.
--   * is_approved defaults to TRUE, matching submitReview() in
--     app/actions/reviews.ts, which auto-approves. Flip it back to FALSE when
--     you want moderation before publication.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS reviews (
  id          BIGSERIAL   PRIMARY KEY,
  sku         TEXT        NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  customer_id UUID,
  order_id    BIGINT,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  author_name TEXT        NOT NULL,
  is_verified BOOLEAN     NOT NULL DEFAULT FALSE,   -- verified purchase
  is_approved BOOLEAN     NOT NULL DEFAULT TRUE,    -- moderation flag
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_sku      ON reviews (sku);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews (customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews (is_approved);

-- One review per author per part. Without this, a double-submitted form or a
-- re-run of the seed silently duplicates a review under the same name.
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_sku_author
  ON reviews (sku, author_name);

-- -----------------------------------------------------------------------
-- parts.rating / parts.review_count are denormalised rollups. Keep them in
-- step with the reviews table rather than writing them by hand -- the store
-- reads them on every card and listing.
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION refresh_part_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE parts
  SET
    rating       = (SELECT COALESCE(ROUND(AVG(rating), 2), 0)
                      FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE),
    review_count = (SELECT COUNT(*)
                      FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE)
  WHERE sku = COALESCE(NEW.sku, OLD.sku);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS reviews_after_change ON reviews;
CREATE TRIGGER reviews_after_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_part_rating();

-- -----------------------------------------------------------------------
-- RLS. Anonymous visitors may post and may read approved reviews only; the
-- service role (admin moderation) bypasses RLS entirely.
-- -----------------------------------------------------------------------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews"
  ON reviews FOR SELECT
  USING (is_approved = TRUE);

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

COMMIT;


-- =============================================================================
-- VERIFY
-- =============================================================================
-- SELECT count(*) FROM reviews;
--
-- Rollups must agree with the table -- must return no rows:
-- SELECT p.sku, p.rating, p.review_count, r.n, r.avg
--   FROM parts p
--   LEFT JOIN (SELECT sku, count(*) n, ROUND(AVG(rating),2) avg
--                FROM reviews WHERE is_approved GROUP BY sku) r ON r.sku = p.sku
--  WHERE p.review_count <> COALESCE(r.n, 0);
