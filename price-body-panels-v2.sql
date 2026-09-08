-- =============================================================================
-- Body-panel repricing -- replaces price-body-derived.sql.
--
-- WHY THIS EXISTS
--   price-body-derived.sql modelled all 47 body parts from ONE observed price
--   ($3,447.73, the 8W6809838 A5 Coupe quarter panel) times a component factor
--   times a platform factor. Two things went wrong with that:
--
--   1. IT COLLAPSED. Every full quarter panel on a "1.00 platform" landed on
--      the identical number, so ELEVEN parts across six different cars all
--      showed $3,447.73 and six more all showed $4,309.66. On the storefront
--      that reads as broken data, not as pricing.
--
--   2. IT WAS WRONG IN BOTH DIRECTIONS. Now that real MSRPs have been pulled
--      for six of these part numbers, the single-anchor model was 49% HIGH on
--      the B8 A5 ($3,447.73 modelled vs $2,320.65 real) and 25% LOW on the B9
--      A5 Sportback ($3,447.73 modelled vs $4,294.98 real).
--
-- WHAT CHANGED
--   * Six part numbers now carry their OBSERVED MSRP.               [HIGH]
--   * Four more carry it via their left/right twin -- Audi lists a
--     panel and its mirror at one figure.                           [HIGH]
--   * The rest are re-derived PER PLATFORM from the nearest observed
--     anchor rather than from one global anchor.                    [MED/LOW]
--
--   Distinct prices across these 41 parts go from 16 to 21, and the worst
--   cluster drops from 11 identical rows to 5. The clusters that remain are
--   real: a left and a right panel for the same car do cost the same, and a
--   platform's panels are listed together.
--
-- WHAT DID NOT CHANGE: the order of magnitude. Genuine Audi quarter panels
--   really are $2,300-$4,300 -- the observed MSRPs confirm it. If these look
--   too expensive to sell, the fix is stocking aftermarket panels, not
--   discounting the genuine ones.
--
-- Confidence: [HIGH] MSRP observed for this exact number (or its L/R twin).
-- [MED] derived, or carried from a same-platform observation.
-- [LOW] derived from an anchor carried across platforms -- verify before trading.
--
-- Sources observed September 2026 on parts.audiusa.com and its dealer mirrors,
-- getAudiparts, OEM Parts Online and CARiD. Each row cites its own.
-- =============================================================================

BEGIN;

UPDATE parts p
   SET price      = v.price::numeric,
       updated_at = now()
  FROM (VALUES
    ('AUD-420810439A',     92.83),  -- [LOW] Bracket Left – 420 810 439 A  was $193.07
    --       DERIVED - small bracket 0.04 x anchor $2,320.65 (R8 42 - no figure published;
    --       carried from B8)
    ('AUD-4G5809838',   3286.86),  -- [HIGH] Quarter Panel Right – 4G5 809 838  was $4,309.66
    --       OBSERVED - parts.audiusa $3,286.86
    ('AUD-4G8809837',   3286.86),  -- [MED] Quarter Panel Left – 4G8 809 837  was $4,309.66
    --       DERIVED - full quarter panel 1.00 x anchor $3,286.86 (A7 C7 - shares the C7
    --       body)
    ('AUD-4G8809838',   3286.86),  -- [MED] Quarter Panel Right – 4G8 809 838  was $4,309.66
    --       DERIVED - full quarter panel 1.00 x anchor $3,286.86 (A7 C7 - shares the C7
    --       body)
    ('AUD-4K5809051',   1643.43),  -- [LOW] Side Panel Section Left – 4K5 809 051  was $2,154.83
    --       DERIVED - side panel section 0.50 x anchor $3,286.86 (A6 C8 - carried from C7)
    ('AUD-4K5809052',   1643.43),  -- [LOW] Side Panel Section Right – 4K5 809 052  was $2,154.83
    --       DERIVED - side panel section 0.50 x anchor $3,286.86 (A6 C8 - carried from C7)
    ('AUD-4M8809054',   1643.43),  -- [LOW] Side Panel Section Right – 4M8 809 054  was $2,154.83
    --       DERIVED - side panel section 0.50 x anchor $3,286.86 (Q8 - carried from C7)
    ('AUD-4N0809041L',   5153.98),  -- [LOW] Body Side Panel Left – 4N0 809 041 L  was $5,792.19
    --       DERIVED - full body side panel, largest assembly 1.20 x anchor $4,294.98 (A8 D5
    --       - no figure published; carried from the largest observed anchor)
    ('AUD-80A809052STL',   1501.62),  -- [MED] Side Panel Section Right – 80A 809 052 STL  was $2,154.83
    --       DERIVED - side panel section 0.50 x anchor $3,003.24 (Q5 80A - CARiD $3,003.24)
    ('AUD-80A809649ASTL',    660.71),  -- [MED] Panel Extension Left – 80A 809 649 ASTL  was $948.13
    --       DERIVED - panel extension 0.22 x anchor $3,003.24 (Q5 80A - CARiD $3,003.24)
    ('AUD-80A810569A',    120.13),  -- [MED] Bracket Left – 80A 810 569 A  was $172.39
    --       DERIVED - small bracket 0.04 x anchor $3,003.24 (Q5 80A - CARiD $3,003.24)
    ('AUD-80F809051STL',   1501.62),  -- [MED] Side Panel Section Left – 80F 809 051 STL  was $2,154.83
    --       DERIVED - side panel section 0.50 x anchor $3,003.24 (Q5 Sportback 80F - CARiD
    --       $3,003.24)
    ('AUD-85F809838',   2659.98),  -- [MED] Quarter Panel Right – 85F 809 838  was $2,068.64
    --       DERIVED - full quarter panel 1.00 x anchor $2,659.98 (A3/Q2 85F - carried from
    --       the 8V A3)
    ('AUD-89A809249',    657.37),  -- [LOW] Panel Reinforcement Left – 89A 809 249  was $861.93
    --       DERIVED - panel reinforcement 0.20 x anchor $3,286.86 (A6 C8 Avant - carried
    --       from C7)
    ('AUD-89A810422A',    986.06),  -- [LOW] Panel Extension Right – 89A 810 422 A  was $1,292.90
    --       DERIVED - panel extension (rear) 0.30 x anchor $3,286.86 (A6 C8 Avant - carried
    --       from C7)
    ('AUD-89E809837A',   3286.86),  -- [LOW] Quarter Panel Left – 89E 809 837 A  was $4,309.66
    --       DERIVED - full quarter panel 1.00 x anchor $3,286.86 (A6 C8 / e-tron GT -
    --       carried from C7)
    ('AUD-89E809838A',   3286.86),  -- [LOW] Quarter Panel Right – 89E 809 838 A  was $4,309.66
    --       DERIVED - full quarter panel 1.00 x anchor $3,286.86 (A6 C8 / e-tron GT -
    --       carried from C7)
    ('AUD-8B5809837',   2320.65),  -- [LOW] Quarter Panel Left – 8B5 809 837  was $3,447.73
    --       DERIVED - full quarter panel 1.00 x anchor $2,320.65 (B6/B7 A4 - carried from
    --       B8, older platform)
    ('AUD-8F0809840B',   1160.33),  -- [MED] Side Panel Section Right – 8F0 809 840 B  was $2,413.41
    --       DERIVED - side panel section 0.50 x anchor $2,320.65 (A5 B8 Cabriolet - B8)
    ('AUD-8J8809844',   1160.33),  -- [LOW] Side Panel Section Right – 8J8 809 844  was $1,034.32
    --       DERIVED - side panel section 0.50 x anchor $2,320.65 (TT 8J - no figure
    --       published; carried from B8)
    ('AUD-8K5809838',   2320.65),  -- [MED] Quarter Panel Right – 8K5 809 838  was $3,447.73
    --       DERIVED - full quarter panel 1.00 x anchor $2,320.65 (A4 B8 - shares the B8 body
    --       with the observed 8T0)
    ('AUD-8K9809837AA',   2320.65),  -- [MED] Quarter Panel Left – 8K9 809 837 AA  was $3,447.73
    --       DERIVED - full quarter panel 1.00 x anchor $2,320.65 (A4 B8 Avant - B8)
    ('AUD-8R0809837',   3003.24),  -- [MED] Quarter Panel Left – 8R0 809 837  was $4,309.66
    --       DERIVED - full quarter panel 1.00 x anchor $3,003.24 (Q5 8R - CARiD
    --       80A809837BSTL $3,003.24)
    ('AUD-8R0814339',    750.81),  -- [MED] Floor Reinforcement Left – 8R0 814 339  was $1,077.42
    --       DERIVED - floor reinforcement 0.25 x anchor $3,003.24 (Q5 8R - CARiD
    --       80A809837BSTL $3,003.24)
    ('AUD-8T0809405B',    812.23),  -- [MED] Wheel Housing / Side Panel Left – 8T0 809 405 B  was $1,206.71
    --       DERIVED - wheel housing / inner panel 0.35 x anchor $2,320.65 (A5 B8 - observed
    --       on 8T0809837)
    ('AUD-8T0809837',   2320.65),  -- [HIGH] Quarter Panel Left – 8T0 809 837  was $3,447.73
    --       OBSERVED - parts.audiusa MSRP $2,320.65 (sale $2,204.62)
    ('AUD-8T0809838A',   2320.65),  -- [HIGH] Quarter Panel Right – 8T0 809 838 A  was $3,447.73
    --       PAIR - Audi lists the L/R pair at one figure. Twin 8T0809837: parts.audiusa MSRP
    --       $2,320.65 (sale $2,204.62)
    ('AUD-8U0809838A',   2666.66),  -- [MED] Quarter Panel Right – 8U0 809 838 A  was $2,068.64
    --       DERIVED - full quarter panel 1.00 x anchor $2,666.66 (Q3 8U - parts.audiusa
    --       lists a 2021 Q3 quarter panel at $2,666.66)
    ('AUD-8V4809837A',   2659.98),  -- [MED] Quarter Panel Left – 8V4 809 837 A  was $2,068.64
    --       DERIVED - full quarter panel 1.00 x anchor $2,659.98 (A3 8V - observed on
    --       8V5809838)
    ('AUD-8V5809837',   2659.98),  -- [HIGH] Quarter Panel Left – 8V5 809 837  was $2,068.64
    --       PAIR - Audi lists the L/R pair at one figure. Twin 8V5809838: parts.audiusa MSRP
    --       $2,659.98 (2018 A3; $2,533.31 for 2016)
    ('AUD-8V5809838',   2659.98),  -- [HIGH] Quarter Panel Right – 8V5 809 838  was $2,068.64
    --       OBSERVED - parts.audiusa MSRP $2,659.98 (2018 A3; $2,533.31 for 2016)
    ('AUD-8W6809837',   3447.73),  -- [HIGH] Quarter Panel Left – 8W6 809 837  was $3,447.73
    --       PAIR - Audi lists the L/R pair at one figure. Twin 8W6809838: parts.audiusa
    --       $3,447.73 - the original seed anchor
    ('AUD-8W6809838',   3447.73),  -- [HIGH] Quarter Panel Right – 8W6 809 838  was $3,447.73
    --       OBSERVED - parts.audiusa $3,447.73 - the original seed anchor
    ('AUD-8W7809403',   3308.60),  -- [MED] Body Side Panel Left – 8W7 809 403  was $3,792.50
    --       DERIVED - body side panel 1.10 x anchor $3,007.82 (A5 B9 Cabriolet - observed)
    ('AUD-8W7809404',   3308.60),  -- [MED] Body Side Panel Right – 8W7 809 404  was $3,792.50
    --       DERIVED - body side panel 1.10 x anchor $3,007.82 (A5 B9 Cabriolet - observed)
    ('AUD-8W7809838',   3007.82),  -- [HIGH] Quarter Panel Right – 8W7 809 838  was $3,447.73
    --       OBSERVED - Audi Virginia Beach / getAudiparts MSRP $3,007.82 (sale $2,111.49)
    ('AUD-8W8809306',    859.00),  -- [MED] Panel Reinforcement Right – 8W8 809 306  was $689.55
    --       DERIVED - panel reinforcement 0.20 x anchor $4,294.98 (A5 B9 Sportback -
    --       observed)
    ('AUD-8W8809837',   4294.98),  -- [HIGH] Quarter Panel Left – 8W8 809 837  was $3,447.73
    --       PAIR - Audi lists the L/R pair at one figure. Twin 8W8809838: parts.audiusa /
    --       OEM Parts Online MSRP $4,294.98 (sale $3,040.85-$3,298.55)
    ('AUD-8W8809838',   4294.98),  -- [HIGH] Quarter Panel Right – 8W8 809 838  was $3,447.73
    --       OBSERVED - parts.audiusa / OEM Parts Online MSRP $4,294.98 (sale
    --       $3,040.85-$3,298.55)
    ('AUD-8W9809838D',   4294.98),  -- [MED] Quarter Panel Right – 8W9 809 838 D  was $3,447.73
    --       DERIVED - full quarter panel 1.00 x anchor $4,294.98 (RS5 B9 Sportback - carried
    --       from 8W8)
    ('AUD-8Y5809838',   2659.98)  -- [MED] Quarter Panel Right – 8Y5 809 838  was $2,068.64
    --       DERIVED - full quarter panel 1.00 x anchor $2,659.98 (A3 8Y - carried from the
    --       8V A3)
  ) AS v(sku, price)
 WHERE p.sku = v.sku
   AND v.price::numeric > 0;   -- rows at 0.00 are ignored

COMMIT;


-- =============================================================================
-- ONE ROW NEEDS A DECISION BEFORE YOU TRADE ON IT
--
--   4K5809051 / 4K5809052  "Side Panel Section" (A6 C8)
--   Priced here at $1,643.43 (0.50 x the C7 quarter-panel anchor).
--
--   But oemVWshop lists 4K5809051 as "Side panel, INNER" at EUR 308.73 ex-VAT
--   -- roughly $335. If that is the same part, this row is about 5x too high,
--   and the 0.50 "side panel section" factor is wrong for inner panels, which
--   are small unpainted stampings rather than half a quarter panel.
--
--   parts.audiusa files the same number under "Quarter Panel (Front, Rear,
--   Upper)", which is an OUTER description, so the two sources disagree about
--   what the part physically is. Resolve that before selling either figure.
--   The same doubt applies to 4M8809054, 80A809052STL and 80F809051STL.
--
-- VERIFY
--   SELECT sku, name, price FROM parts
--    WHERE category_id IN ('quarter-panels','body-brackets') ORDER BY price DESC;
--
--   -- how much clustering is left:
--   SELECT price, count(*) FROM parts
--    WHERE category_id IN ('quarter-panels','body-brackets')
--    GROUP BY price HAVING count(*) > 1 ORDER BY count(*) DESC;
-- =============================================================================
