-- =============================================================================
-- Storage bucket for product images.
--
-- Why uploads were failing: components/admin/ProductForm.tsx had
--     const BUCKET = 'bucket'
-- a placeholder that was never filled in. No bucket by that name exists, hence
-- "Bucket not found". The constant is now 'part-images' and this creates it.
--
-- Run in the Supabase SQL editor. Safe to re-run.
-- =============================================================================

-- ── 1. The bucket ────────────────────────────────────────────────────
--    public = true so product images render without signed URLs.
--    5 MB cap and an image-only mime allowlist, so a mis-drag cannot dump a
--    50 MB video or an executable into public storage.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'part-images',
  'part-images',
  TRUE,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/avif','image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ── 2. Policies ──────────────────────────────────────────────────────
--    Read: anyone. Product images are public by nature.
--    Write: the admin allowlist only — the same user id the admin panel and
--    the admin API check. Without this, any authenticated user could upload
--    into your public bucket.

DROP POLICY IF EXISTS "part_images_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "part_images_admin_insert"  ON storage.objects;
DROP POLICY IF EXISTS "part_images_admin_update"  ON storage.objects;
DROP POLICY IF EXISTS "part_images_admin_delete"  ON storage.objects;

CREATE POLICY "part_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'part-images');

CREATE POLICY "part_images_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'part-images'
    AND auth.uid() = '79da52b4-8552-46a5-8634-7da648267d6c'::uuid
  );

CREATE POLICY "part_images_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'part-images'
    AND auth.uid() = '79da52b4-8552-46a5-8634-7da648267d6c'::uuid
  );

CREATE POLICY "part_images_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'part-images'
    AND auth.uid() = '79da52b4-8552-46a5-8634-7da648267d6c'::uuid
  );


-- ── 3. Two buckets from the previous project are still here ──────────
--    'avatars' and 'cabin-images' predate this catalogue. Leaving them costs
--    nothing but they are worth reviewing. To remove one (deletes its files):
--      DELETE FROM storage.objects WHERE bucket_id = 'cabin-images';
--      DELETE FROM storage.buckets WHERE id = 'cabin-images';


-- VERIFY
--   SELECT id, public, file_size_limit FROM storage.buckets;
--   SELECT policyname FROM pg_policies
--    WHERE tablename = 'objects' AND policyname LIKE 'part_images%';
