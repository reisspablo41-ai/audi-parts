-- =============================================================================
-- Blog posts.
--
-- Run this in the Supabase SQL editor before using /admin/blog. Like
-- migration-orders.sql, it is written with IF NOT EXISTS so it is safe to
-- re-run, and it does not touch any table that already exists.
--
-- WHY THE COLUMNS ARE SHAPED THIS WAY
--   The point of the blog is search traffic, so the SEO fields are first-class
--   rather than derived at render time:
--
--   slug             the URL. Immutable once published — changing it orphans
--                    every inbound link and ranking the post has earned.
--   meta_title       what Google shows in results. Separate from `title`
--   meta_description because a good headline and a good search snippet are
--                    rarely the same sentence, and the snippet has a length
--                    budget the headline does not.
--   excerpt          the listing teaser and the og:description fallback.
--   related_skus     the reason this table earns its keep. Every post links
--                    to real product pages, which is what turns an article
--                    into internal link equity instead of a dead end.
--   status           drafts are invisible to the public reader AND to the
--                    sitemap. Publishing is the single switch.
--   published_at     drives ordering, the sitemap's lastmod, and the
--                    article:published_time tag.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS blog_posts (
  id               BIGSERIAL   PRIMARY KEY,
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  excerpt          TEXT,
  -- Markdown. Rendered by components/Markdown.tsx, which supports headings,
  -- paragraphs, lists, links, bold/italic, blockquotes and code.
  body             TEXT        NOT NULL DEFAULT '',
  cover_image_url  TEXT,
  author_name      TEXT        NOT NULL DEFAULT 'AudiParts Direct',
  status           TEXT        NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','published')),
  meta_title       TEXT,
  meta_description TEXT,
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  -- SKUs of parts this post should link to. Not a foreign key: a post must
  -- survive a part being delisted rather than blocking the delete.
  related_skus     TEXT[]      NOT NULL DEFAULT '{}',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status    ON blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published_at DESC);

-- Reads go through the service-role key in the server components, same as the
-- rest of the site. RLS on with no policy keeps the anon key out entirely.
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

COMMIT;


-- =============================================================================
-- VERIFY
--   SELECT slug, status, published_at FROM blog_posts ORDER BY published_at DESC;
--
-- A published post needs published_at set; /admin/blog does that for you when
-- you switch a draft to published. To publish by hand:
--   UPDATE blog_posts SET status='published', published_at=NOW() WHERE slug='...';
-- =============================================================================
