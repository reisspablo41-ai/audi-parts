-- =============================================================================
-- RENAME: AudiParts Direct -> Audi Parts Sales
--
-- The brand name lives in the code (lib/brand.ts, lib/site.ts and the page
-- copy), but six blog posts carry it as DATA in blog_posts.author_name, so
-- renaming the site alone would leave the old name showing on every article.
--
-- Safe to re-run: the WHERE clause matches only the old value.
-- =============================================================================

BEGIN;

UPDATE blog_posts
   SET author_name = 'Audi Parts Sales'
 WHERE author_name = 'AudiParts Direct';

COMMIT;

-- VERIFY -- expect zero rows
SELECT slug, author_name
  FROM blog_posts
 WHERE author_name = 'AudiParts Direct';
