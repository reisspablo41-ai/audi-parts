-- =============================================================================
-- AudiParts Direct – Product Gallery Assignment
--
-- Attaches a multi-image gallery to individual parts. Image URLs below are
-- placeholders following the /parts/<platform>/<oe-part-number>.jpg convention;
-- swap them for your own hosted asset URLs before running against production.
-- Re-runnable: existing images for these SKUs are cleared first.
-- =============================================================================

BEGIN;

-- CLEANUP: clear existing images for these SKUs so the gallery order is deterministic.
DELETE FROM part_images WHERE sku IN (
  'AUD-WP-EA888-OEM',
  'AUD-TCK-EA888-OEM',
  'AUD-BP-B9-FRONT-OEM',
  'AUD-DISC-B9-FRONT-OEM',
  'AUD-ALT-EA888-AFT'
);

-- 1. Water Pump & Thermostat Module – 2.0 TFSI EA888
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('AUD-WP-EA888-OEM', '/parts/ea888/06L-121-111-I-main.jpg',      'Water Pump & Thermostat Module – main view',        TRUE,  0),
('AUD-WP-EA888-OEM', '/parts/ea888/06L-121-111-I-housing.jpg',   'Water Pump & Thermostat Module – housing detail',   FALSE, 1),
('AUD-WP-EA888-OEM', '/parts/ea888/06L-121-111-I-impeller.jpg',  'Water Pump & Thermostat Module – impeller detail',  FALSE, 2);

-- 2. Timing Chain Kit – 2.0 TFSI EA888 Gen3
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('AUD-TCK-EA888-OEM', '/parts/ea888/06K-109-158-AB-main.jpg',      'Timing Chain Kit – complete kit',            TRUE,  0),
('AUD-TCK-EA888-OEM', '/parts/ea888/06K-109-158-AB-tensioner.jpg', 'Timing Chain Kit – revised tensioner',       FALSE, 1),
('AUD-TCK-EA888-OEM', '/parts/ea888/06K-109-158-AB-guides.jpg',    'Timing Chain Kit – guide rails',             FALSE, 2);

-- 3. Front Brake Pad Set – A4 B9
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('AUD-BP-B9-FRONT-OEM', '/parts/a4-b9/8W0-698-151-AG-main.jpg',   'Front Brake Pad Set – full set',              TRUE,  0),
('AUD-BP-B9-FRONT-OEM', '/parts/a4-b9/8W0-698-151-AG-sensor.jpg', 'Front Brake Pad Set – wear sensor cut-out',   FALSE, 1);

-- 4. Front Brake Disc – A4 B9 320 mm Vented
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('AUD-DISC-B9-FRONT-OEM', '/parts/a4-b9/8W0-615-301-F-main.jpg', 'Front Brake Disc – face view',        TRUE,  0),
('AUD-DISC-B9-FRONT-OEM', '/parts/a4-b9/8W0-615-301-F-vane.jpg', 'Front Brake Disc – vane detail',      FALSE, 1);

-- 5. Alternator 180A – 2.0 TFSI (Aftermarket)
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('AUD-ALT-EA888-AFT', '/parts/ea888/06L-903-026-S-main.jpg',   'Alternator 180A – main view',          TRUE,  0),
('AUD-ALT-EA888-AFT', '/parts/ea888/06L-903-026-S-pulley.jpg', 'Alternator 180A – clutch pulley',      FALSE, 1);

COMMIT;
