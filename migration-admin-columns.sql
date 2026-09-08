-- =============================================================================
-- Restore the columns the admin panel manages.
--
-- The v2 schema dropped several fields the admin UI reads and writes. Effect:
--   * OEM cross-reference rendered blank and could not be saved
--   * material and tags silently lost
--   * SAVING A PRODUCT FAILED OUTRIGHT — the insert named columns that do not
--     exist, so every create/update returned an error
--
-- part_cross_references stays as the structured table for supersession work.
-- oem_cross_ref is the denormalised free-text field the admin form edits, which
-- is a different job: "what else is this called", not "what replaced what".
-- =============================================================================

ALTER TABLE parts ADD COLUMN IF NOT EXISTS oem_cross_ref TEXT;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS material      TEXT;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS tags          TEXT[];

-- Backfill cross-references from the structured table so existing parts show
-- something in the admin field rather than a blank box.
UPDATE parts p
   SET oem_cross_ref = x.refs
  FROM (
    SELECT sku, string_agg(ref_number, ', ' ORDER BY ref_number) AS refs
      FROM part_cross_references
     GROUP BY sku
  ) AS x
 WHERE p.sku = x.sku
   AND (p.oem_cross_ref IS NULL OR p.oem_cross_ref = '');

-- VERIFY
--   SELECT count(*) FILTER (WHERE oem_cross_ref IS NOT NULL) AS with_xref FROM parts;
