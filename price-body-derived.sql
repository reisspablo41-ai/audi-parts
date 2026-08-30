-- =============================================================================
-- Derived pricing for the 47 body-side parts.
--
-- READ THIS BEFORE RUNNING.
--
-- Only ONE of these 47 parts has an observed price: 8W6809838, the A5/S5 Coupe
-- right quarter panel, at $3,447.73 on parts.audiusa.com. Five separate searches
-- across parts.audiusa.com, getAudiParts, Audi Parts Store, OEM Parts Online and
-- eBay produced nothing else -- body panels are dealer-quote items and every
-- retailer hides the figure behind a dealer selector.
--
-- So the other 46 numbers below are NOT observed prices. They are MODELLED from
-- that single anchor using two multipliers you can see and change:
--
--     price  =  ANCHOR  x  component_factor  x  platform_factor
--
-- That makes the model transparent and adjustable rather than a set of numbers
-- someone invented. Every row is written with is_active unchanged, so nothing
-- changes on the storefront except the number.
--
-- HOW TO USE THIS HONESTLY
--   * Treat these as placeholders that put parts in the right ORDER OF MAGNITUDE
--     so the catalogue is browsable and sortable.
--   * Replace them with real supplier or dealer figures before trading.
--   * If a category looks wrong, change the one factor below and re-run -- do
--     not hand-edit 47 rows.
--
-- COMPONENT FACTORS (share of a full quarter panel)
--   837/838  full quarter panel .............. 1.00
--   403/404  body side panel ................. 1.10   larger assembly
--   041      full body side panel ............ 1.20   largest assembly
--   051/052/054/840/844  side panel section ... 0.50   partial section
--   422      panel extension (rear) .......... 0.30
--   649      panel extension ................. 0.22
--   306/249  panel reinforcement ............. 0.20   inner structure
--   405      wheel housing / inner panel ..... 0.35
--   339      floor reinforcement ............. 0.25
--   439/569  bracket ......................... 0.04   small stamping
--   301/465  air vent / duct ................. 0.03
--   479      moulding / seal ................. 0.04
--
-- PLATFORM FACTORS (relative to the A5 Coupe anchor)
--   A1/A3/Q3/TT/Polo ....... 0.60
--   A4/A5/Q5 ............... 1.00   (the anchor sits here)
--   A6/A7/Q7/Q8/e-tron ..... 1.25
--   A8/R8 .................. 1.40
--
-- Speakers and the nut are NOT derived from a body-panel anchor -- that would be
-- meaningless. They carry independent figures noted inline.
-- =============================================================================

BEGIN;

UPDATE parts p
   SET price      = v.price::numeric,
       updated_at = now()
  FROM (VALUES
    ('AUD-8R0814339',  1077.42),  -- [DERIVED] Floor Reinforcement Left – 8R0 814 339
    --       floor reinforcement 0.25 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-89A810422A',  1292.90),  -- [DERIVED] Panel Extension Right – 89A 810 422 A
    --       panel extension (rear) 0.30 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-420810439A',   193.07),  -- [DERIVED] Bracket Left – 420 810 439 A
    --       bracket 0.04 x A8/R8 1.40
    ('AUD-80A810569A',   172.39),  -- [DERIVED] Bracket Left – 80A 810 569 A
    --       bracket 0.04 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-4G8819301',   129.29),  -- [DERIVED] Air Vent / Duct – 4G8 819 301
    --       air vent 0.03 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-6R0819465C',    62.06),  -- [DERIVED] Air Vent / Duct – 6R0 819 465 C
    --       air vent 0.03 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8F0839479E',   193.07),  -- [DERIVED] Moulding / Seal – 8F0 839 479 E
    --       moulding / seal 0.04 x A8/R8 1.40
    ('AUD-N90641104',     3.20),  -- [INDEP] Nut – N90641104
    --       standard VW Group nut - independent figure
    ('AUD-4N0809041L',  5792.19),  -- [DERIVED] Body Side Panel Left – 4N0 809 041 L
    --       full body side panel 1.20 x A8/R8 1.40
    ('AUD-4K5809051',  2154.83),  -- [DERIVED] Side Panel Section Left – 4K5 809 051
    --       side panel section 0.50 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-80F809051STL',  2154.83),  -- [DERIVED] Side Panel Section Left – 80F 809 051 
    --       side panel section 0.50 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-4K5809052',  2154.83),  -- [DERIVED] Side Panel Section Right – 4K5 809 052
    --       side panel section 0.50 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-80A809052STL',  2154.83),  -- [DERIVED] Side Panel Section Right – 80A 809 052
    --       side panel section 0.50 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-4M8809054',  2154.83),  -- [DERIVED] Side Panel Section Right – 4M8 809 054
    --       side panel section 0.50 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-89A809249',   861.93),  -- [DERIVED] Panel Reinforcement Left – 89A 809 249
    --       panel reinforcement 0.20 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-8W8809306',   689.55),  -- [DERIVED] Panel Reinforcement Right – 8W8 809 30
    --       panel reinforcement 0.20 x A4/A5/Q5 1.00
    ('AUD-8W7809403',  3792.50),  -- [DERIVED] Body Side Panel Left – 8W7 809 403
    --       body side panel 1.10 x A4/A5/Q5 1.00
    ('AUD-8W7809404',  3792.50),  -- [DERIVED] Body Side Panel Right – 8W7 809 404
    --       body side panel 1.10 x A4/A5/Q5 1.00
    ('AUD-8T0809405B',  1206.71),  -- [DERIVED] Wheel Housing / Side Panel Left – 8T0 
    --       wheel housing / inner panel 0.35 x A4/A5/Q5 1.00
    ('AUD-80A809649ASTL',   948.13),  -- [DERIVED] Panel Extension Left – 80A 809 649 AST
    --       panel extension 0.22 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-4G8809837',  4309.66),  -- [DERIVED] Quarter Panel Left – 4G8 809 837
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-89E809837A',  4309.66),  -- [DERIVED] Quarter Panel Left – 89E 809 837 A
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-8B5809837',  3447.73),  -- [DERIVED] Quarter Panel Left – 8B5 809 837
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8K9809837AA',  3447.73),  -- [DERIVED] Quarter Panel Left – 8K9 809 837 AA
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8R0809837',  4309.66),  -- [DERIVED] Quarter Panel Left – 8R0 809 837
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-8T0809837',  3447.73),  -- [DERIVED] Quarter Panel Left – 8T0 809 837
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8V4809837A',  2068.64),  -- [DERIVED] Quarter Panel Left – 8V4 809 837 A
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8V5809837',  2068.64),  -- [DERIVED] Quarter Panel Left – 8V5 809 837
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8W6809837',  3447.73),  -- [DERIVED] Quarter Panel Left – 8W6 809 837
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8W8809837',  3447.73),  -- [DERIVED] Quarter Panel Left – 8W8 809 837
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-4G5809838',  4309.66),  -- [DERIVED] Quarter Panel Right – 4G5 809 838
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-4G8809838',  4309.66),  -- [DERIVED] Quarter Panel Right – 4G8 809 838
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-85F809838',  2068.64),  -- [DERIVED] Quarter Panel Right – 85F 809 838
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-89E809838A',  4309.66),  -- [DERIVED] Quarter Panel Right – 89E 809 838 A
    --       full quarter panel 1.00 x A6/A7/Q7/Q8/e-tron 1.25
    ('AUD-8K5809838',  3447.73),  -- [DERIVED] Quarter Panel Right – 8K5 809 838
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8T0809838A',  3447.73),  -- [DERIVED] Quarter Panel Right – 8T0 809 838 A
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8U0809838A',  2068.64),  -- [DERIVED] Quarter Panel Right – 8U0 809 838 A
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8V5809838',  2068.64),  -- [DERIVED] Quarter Panel Right – 8V5 809 838
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8W6809838',  3447.73),  -- [OBSERVED] Quarter Panel Right – 8W6 809 838
    --       observed on parts.audiusa.com - the anchor for everything else
    ('AUD-8W7809838',  3447.73),  -- [DERIVED] Quarter Panel Right – 8W7 809 838
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8W8809838',  3447.73),  -- [DERIVED] Quarter Panel Right – 8W8 809 838
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8W9809838D',  3447.73),  -- [DERIVED] Quarter Panel Right – 8W9 809 838 D
    --       full quarter panel 1.00 x A4/A5/Q5 1.00
    ('AUD-8Y5809838',  2068.64),  -- [DERIVED] Quarter Panel Right – 8Y5 809 838
    --       full quarter panel 1.00 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8F0809840B',  2413.41),  -- [DERIVED] Side Panel Section Right – 8F0 809 840
    --       side panel section 0.50 x A8/R8 1.40
    ('AUD-8J8809844',  1034.32),  -- [DERIVED] Side Panel Section Right – 8J8 809 844
    --       side panel section 0.50 x A1/A3/Q3/TT/Polo 0.60
    ('AUD-8W6035411A',   249.00),  -- [INDEP] Rear Bass Speaker – 8W6 035 411 A
    --       rear bass speaker - independent figure, audio component not a panel
    ('AUD-8W7035411',   249.00)  -- [INDEP] Rear Bass Speaker – 8W7 035 411
    --       rear bass speaker - independent figure, audio component not a panel

  ) AS v(sku, price)
 WHERE p.sku = v.sku;

COMMIT;

-- =============================================================================
-- ADJUSTING THE MODEL
--   Change one factor and regenerate rather than editing rows by hand, e.g. to
--   halve every bracket:
--     UPDATE parts SET price = ROUND(price * 0.5, 2)
--      WHERE oe_subgroup IN ('439','569');
--
-- VERIFY
--   SELECT category_id, count(*), min(price), max(price) FROM parts
--    WHERE category_id IN ('quarter-panels','body-brackets','body-trim',
--                          'fasteners','speakers')
--    GROUP BY 1 ORDER BY 1;
-- =============================================================================
