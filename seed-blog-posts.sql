-- =============================================================================
-- Six guides and technical articles for the blog.
--
-- PREREQUISITE: run migration-blog.sql first, or this fails with
-- "relation blog_posts does not exist".
--
-- Safe to re-run: each row upserts on slug, so editing an article here and
-- re-running updates it in place rather than creating a duplicate. Note that
-- re-running OVERWRITES edits made in /admin/blog for these six slugs.
--
-- WHY THESE SIX
--   Every article is built on something in the catalogue rather than generic
--   filler, because the SEO value is in the internal links: each post ends
--   with real product cards via related_skus, and links to live category and
--   product pages inline. All 22 SKUs referenced were checked against the
--   parts table before this file was written.
--
--   They also lead with the questions that actually cost people money — how
--   to read a part number, why a year and model is not enough, and the
--   sub-group traps that cause returns. That is what earns links and what
--   people search for.
--
-- A NOTE ON PRICES
--   The bodies avoid quoting figures wherever possible, and describe bands
--   rather than exact numbers where a price is unavoidable. Prices move; an
--   article that hard-codes them dates badly and starts contradicting the
--   product pages it links to.
--
-- Bodies are Markdown, rendered by components/Markdown.tsx. Dollar-quoted
-- ($md$…$md$) so apostrophes need no escaping.
-- =============================================================================

BEGIN;

INSERT INTO blog_posts
  (slug, title, excerpt, body, author_name, status, meta_title, meta_description,
   tags, related_skus, published_at, updated_at)
VALUES

-- ── 1 ────────────────────────────────────────────────────────────────
(
  'how-to-read-an-audi-oe-part-number',
  'How to read an Audi OE part number',
  'Every Audi part number tells you the platform, the system, the component and the revision. Learn to read one and you can check fitment yourself in about ten seconds.',
  $md$Every genuine Audi part carries an eleven-character number that is not random. It is a structured code, and once you can read it you can tell what a part is, roughly what it fits, and whether the one you are looking at is the same component as the one you need.

Take a real example from our catalogue:

```
8K0  121  251  AL
^^^  ^^^  ^^^  ^^
 |    |    |    revision index
 |    |    sub-group: the specific component
 |    main group: the system
 platform prefix
```

# The four parts

## Platform prefix

The first three characters identify the platform the part was first released for. `8K0` is the B8 A4. `8W0` is the B9 A4 and A5. `4M0` is the second-generation Q7. `4E0` is the D3 A8.

A `0` in the third position usually means the part is common across the whole platform. A digit there — `8K5`, `8W7` — often narrows it to a body style, such as an Avant or a Cabriolet.

Be careful with the assumption that the prefix equals your car. Volkswagen Group shares heavily, so a part first released on one platform is routinely fitted to another. The prefix tells you where the number *originated*, not the complete list of what it fits.

## Main group

The middle three digits are the system. A few you will meet constantly:

- `121` — cooling: radiators, fans, coolant pipes
- `129` / `133` — air intake and air filters
- `115` — lubrication: oil filters, housings, pumps
- `109` — timing: chains, belts, tensioners
- `615` — brakes: discs, shields
- `809` — body side structure
- `905` — ignition: coils, plugs, modules
- `601` — wheels

## Sub-group

The third block is the specific component within that system, and it is where most costly mistakes happen. Inside main group `121`, for instance:

- `251` and `253` are the **main** radiator
- `212` is an **auxiliary** radiator

Those are not interchangeable, and we have written about that particular trap separately in [radiator or auxiliary radiator?](/blog/audi-radiator-vs-auxiliary-radiator).

## Revision index

The trailing letters — `AL`, `B`, `AQ` — are the revision. Audi supersedes parts over a model's life to fix a problem, change a supplier or simplify manufacture. A later index is usually the improved part and usually supersedes the earlier one.

Usually. Not always. Some index changes mark a genuine functional difference — a different core thickness, a different mounting, a different connector — and in those cases the two are not interchangeable at all. Never assume a nearby index will fit because the first nine characters match.

# Where this actually helps

Reading the number is quickest when you are comparing a listing against the part you removed. If the first nine characters match and only the index differs, you are at least in the right family and it is worth asking. If a sub-group differs, stop — you are looking at a different component regardless of how similar the photos look.

> The number on the old part is the single most reliable thing you have. It beats the year, the model, and anything a generic parts lookup tells you.

# What the number cannot tell you

It cannot tell you which engine variant you have, and on most platforms that matters. A B8 A4 with the 1.8 TFSI and one with the 3.2 FSI V6 take different cooling packs. The number identifies the part; it does not identify your car.

That is why we ask for the engine code as well as the year and model, and why the fitment data on each product page is keyed to a chassis generation rather than just a model year. There is more on that in [chassis codes and engine codes](/blog/audi-chassis-codes-and-engine-codes).

If you have the number from the old part and you are still unsure, send it to us with your VIN. Reading these is most of what we do.$md$,
  'AudiParts Direct',
  'published',
  'How to Read an Audi OE Part Number',
  'Audi part numbers encode the platform, system, component and revision. A practical guide to reading one so you can check fitment yourself.',
  ARRAY['Part numbers','Fitment guide'],
  ARRAY['AUD-8K0121251AL','AUD-4M0121251M','AUD-06H905110P'],
  NOW() - INTERVAL '34 days', NOW()
),

-- ── 2 ────────────────────────────────────────────────────────────────
(
  'audi-radiator-vs-auxiliary-radiator',
  'Radiator or auxiliary radiator? Sub-groups 251, 253 and 212',
  'Retailers list all three as "radiator". They are different components with different jobs, and ordering the wrong one is one of the most common returns we see.',
  $md$Search for an Audi radiator and you will get three different components back, all labelled "radiator", often on the same page. The part numbers tell you which is which, and the difference is not cosmetic.

# The three sub-groups

Within main group `121` — cooling — the sub-group is the component:

- **`251` and `253` — the main radiator.** The large core behind the grille that the engine coolant circuits through. This is what people mean when they say radiator.
- **`212` — an auxiliary radiator.** A smaller, secondary core. Fitted where the main radiator alone cannot shed enough heat, or where a separate circuit needs its own cooling.

There is a fourth component that gets mislabelled constantly. **Main group `145`, sub-group `804`, is a charge air cooler** — an intercooler. It cools intake air, not coolant. It is not a radiator in any sense, yet source listings routinely file it as one. Our [charge air cooler for the C6 A6](/product/AUD-4F0145804K) is catalogued as what it actually is.

# Why the wrong one gets ordered

Three reasons, in the order we see them:

1. **The listing says "radiator" for all of them.** Auxiliary radiators are usually described identically to main ones.
2. **The car has more than one.** Larger and higher-output cars often carry a main radiator plus one or two auxiliaries. Pulling a part number off a diagram without checking which core you are looking at is easy to do.
3. **The old part is already out.** Once the front end is stripped, a small core and a large core both just look like "the radiator that was in there".

# How to tell before you order

Read the sub-group. It is three digits and it is unambiguous:

```
4M0 121 251 M   ->  251  ->  main radiator
4E0 121 212 B   ->  212  ->  auxiliary radiator
4F0 145 804 K   ->  145 804  ->  charge air cooler
```

If you are working from the old part, the number is cast or printed on the end tank or the frame. If you are working from a diagram, check the callout position against the car rather than the description.

> If your cooling problem is the engine running hot under sustained load, it is very often the main radiator. If it is a specific circuit — transmission, or a secondary loop on a W12 or a high-output V8 — the auxiliary is the more likely culprit.

# Which cars carry auxiliaries

Broadly: the more power and the more thermal load, the more cores. The D3 A8 in W12 form is a well-known example, and the [4E0 121 212 B](/product/AUD-4E0121212B) is its auxiliary. Mid-range platforms such as the PQ35 cars also carry one on some engine variants — the [1K0 121 212 C](/product/AUD-1K0121212C) is that part.

Note that an auxiliary radiator is often *not* cheaper than a main one. A low-volume auxiliary for a W12 can cost more than a mainstream main radiator, because volume drives price more than size does.

# Before you buy

- Confirm the sub-group on the number, not the description.
- Confirm which core you are replacing if the car has more than one.
- Confirm the engine variant. Cooling packs differ between engines on the same platform more than almost any other system.

Our full range is under [radiators and cooling](/category/radiators). If you have the number off the old core and want it checked before you commit, send it over — this is exactly the sort of thing worth thirty seconds of a technician's time.$md$,
  'AudiParts Direct',
  'published',
  'Audi Radiator vs Auxiliary Radiator: 251, 253 and 212',
  'Sub-group 251 is the main radiator, 212 is auxiliary, and 145 804 is an intercooler. How to tell them apart before you order the wrong one.',
  ARRAY['Cooling','Fitment guide'],
  ARRAY['AUD-4M0121251M','AUD-4E0121212B','AUD-1K0121212C','AUD-4F0145804K'],
  NOW() - INTERVAL '27 days', NOW()
),

-- ── 3 ────────────────────────────────────────────────────────────────
(
  'audi-chassis-codes-and-engine-codes',
  'Why your year and model are not enough',
  'A 2016 A4 can be one of two completely different cars. Chassis generation and engine code are what actually determine fitment — here is how to find both.',
  $md$"2016 Audi A4" is not enough information to sell you a part, and any shop that says otherwise is guessing.

The reason is that Audi changes generation mid-calendar-year. A 2016 A4 might be a late B8.5 or an early B9. They share a badge and a model year, and almost nothing else that matters for parts.

# Chassis generation

The generation — the chassis code — is the real unit of fitment. For the A4:

- **B5** — 1995 to 2001
- **B6** — 2001 to 2004
- **B7** — 2005 to 2008
- **B8 / B8.5** — 2008 to 2015
- **B9** — 2016 onward

Other lines run their own ladders: the A3 goes 8L, 8P, 8V, 8Y; the A6 runs C5 through C8; the Q5 goes 8R then 80A. A crossover year is always a coin flip, and the years above overlap on purpose because the changeover is not clean.

You can read the generation straight off a part number you already have — the platform prefix encodes it. `8K0` is B8, `8W0` is B9. That is covered in [how to read an Audi OE part number](/blog/how-to-read-an-audi-oe-part-number).

# Engine code

Within one generation, the engine determines a surprising amount. Cooling packs, brake disc diameters, timing components, intake plumbing and mounts all vary between engine variants on an otherwise identical car.

The engine code is a three or four character code — `CABB`, `EA888`, `CDNC`, `CRTD`. It is not the displacement. Two 2.0 TFSI engines from different years can be different engines with different service parts.

# Where to find both

**The VIN is the definitive answer.** It encodes the model year and plant, and any dealer can resolve it to the exact build.

**The service sticker or data plate** carries the engine code directly. Look in the spare wheel well, on the boot lid, or in the service book. On many cars there is a plate with a two- or three-letter engine code printed alongside the paint code.

**The engine block itself** is stamped with the code, though reaching it usually means removing a cover.

**An old part number** is the shortcut most people overlook. If you still have the part you are replacing, its number resolves fitment faster than any lookup.

# What this means when you shop

On our site, the vehicle selector filters on generation and year rather than model year alone, because that is what the fitment data supports. Picking your car narrows the catalogue to parts we have confirmed against that chassis.

> Two honest caveats. First, fitment coverage is still being built out — a part with no fitment data will not appear under a vehicle filter even if it does fit. Second, the engine selector helps us label your garage, but the fitment data itself is keyed to generation and year, not engine, so it will not narrow results further.

If a vehicle filter returns fewer parts than you expect, browse the [full catalogue](/shop) or the relevant category and check the part number yourself using the guide above.

# The short version

- Model year alone is ambiguous at every generation changeover.
- Chassis code is the real unit of fitment.
- Engine code decides variant-level differences within a generation.
- The number on the old part beats all of the above for speed and accuracy.

Send us a VIN and a part number and we will confirm it before you spend anything.$md$,
  'AudiParts Direct',
  'published',
  'Audi Fitment: Chassis Codes and Engine Codes Explained',
  'A 2016 A4 could be a B8.5 or a B9. Why chassis generation and engine code determine fitment, and where to find both on your car.',
  ARRAY['Fitment guide'],
  ARRAY['AUD-8K0121251AL','AUD-8W0121251AA','AUD-8E0121251AJ'],
  NOW() - INTERVAL '20 days', NOW()
),

-- ── 4 ────────────────────────────────────────────────────────────────
(
  'audi-brake-disc-buying-guide',
  'Audi brake discs: why one costs a hundred and another costs thousands',
  'Discs are sold singly, sub-group tells you which axle, and the price range across the catalogue spans two orders of magnitude for a good reason.',
  $md$Brake discs generate more pricing confusion than any other part we sell, and most of it comes down to three things people do not expect.

# They are sold singly

Almost every genuine Audi disc is priced and supplied as one rotor. Retailers vary — some quote a pair, some quote each, and they do not always say which.

You need two per axle. Always replace them in pairs; a single new disc against a worn one gives you uneven braking and pulls under load.

Our listings are per disc, and every product description says so.

# The sub-group tells you the axle

Within main group `615`:

- **`301` and `302`** — front discs
- **`601`** — rear discs

That is worth checking on the number rather than trusting a listing title, because front and rear are frequently mixed up in source data. Where a number ends in `301` versus `302`, that usually distinguishes side or a specification variant rather than axle.

# The price range is real

This is the part that surprises people. In our own catalogue, front discs run from around a hundred dollars to several thousand — and both ends are correct.

**Standard cast iron.** The overwhelming majority. A [front disc for a PQ35-platform car](/product/AUD-1K0615301AR) sits at the affordable end and is an entirely ordinary service item.

**Large performance iron.** RS-model discs are physically much bigger — 370 mm and up, with thicker vanes — and are made in far lower volumes. The [370×34 mm front disc used on the 8V RS3](/product/AUD-8V0615301R) is several times the price of a standard disc, and that is the correct list price rather than an error.

**Carbon ceramic.** A different material entirely. Ceramic composite discs are made in tiny numbers and cost more than most complete brake jobs. Our [400×38 mm ceramic front disc](/product/AUD-4K0615301AE) is the most expensive single item in the catalogue, and that is genuinely what the part lists for.

> If your car left the factory with ceramic discs, an iron disc is not a substitute. The carriers, pads and hub geometry differ. Converting in either direction is a full brake system change, not a disc swap.

# How to tell what you have

Ceramic discs are usually identifiable by a distinctly different friction surface and, on most cars, by the calliper colour Audi used to signal the option. If you are unsure, the VIN will settle it — and it is worth settling before you order, given the difference.

For iron discs, measure the diameter and the thickness. Both matter, and both are stamped or cast into the disc on most Audi parts. Minimum thickness is also marked; a disc at or below it must be replaced rather than skimmed.

# Practical checklist

1. Confirm the axle from the sub-group, not the listing title.
2. Confirm diameter and thickness against the old disc.
3. Order two.
4. Replace pads at the same time — new discs against glazed pads waste both.
5. Bed them in properly before any hard stop.

The full range is under [brake discs and rotors](/category/brake-rotors). If the number on your old disc is legible, send it and we will match it exactly.$md$,
  'AudiParts Direct',
  'published',
  'Audi Brake Disc Buying Guide: Sizes, Axles and Price',
  'Audi discs are sold singly, sub-group 301/302 is front and 601 is rear, and prices span iron to carbon ceramic. What to check before ordering.',
  ARRAY['Brakes','Buying guide'],
  ARRAY['AUD-1K0615301AR','AUD-8V0615301R','AUD-4K0615301AE'],
  NOW() - INTERVAL '13 days', NOW()
),

-- ── 5 ────────────────────────────────────────────────────────────────
(
  'audi-quarter-panel-repair-or-replace',
  'Quarter panels: what a genuine one costs, and when to repair instead',
  'A genuine Audi quarter panel is a welded structural stamping, priced accordingly. Here is what drives the cost and how to decide between replacing and repairing.',
  $md$People are routinely shocked by quarter panel pricing, assume the listing is wrong, and ask us to check it. It is almost never wrong.

A genuine Audi quarter panel typically lists in the low-to-mid four figures. That is the real dealer list price, and it holds across the range — from a compact saloon up to the large body side panels on an A8.

# Why they cost what they do

**It is structural, not a cover.** A quarter panel is not a bolt-on wing. It is a large stamped section welded into the body shell, wrapping the rear wheel arch and forming part of the car's structure. There is no quick way to make one.

**It is a single enormous pressing.** Tooling for a panel this size is expensive and the press time is significant. Volume is low, because most cars never need one.

**Shipping is not trivial.** These are oversized items that ship on a pallet or in a purpose-built crate. Most carriers price them accordingly.

**Left and right cost the same.** Sub-group `837` is left, `838` is right, and Audi lists the mirror pair at the same figure. If you see a large price difference between the two sides for the same car, something is wrong with the listing.

# What drives the variation

Within our own [quarter panels category](/category/quarter-panels), the spread tracks two things: how large the assembly is, and which platform it belongs to.

A [B9 A5 Sportback quarter panel](/product/AUD-8W8809838) sits above the equivalent [B9 A5 Coupe part](/product/AUD-8W6809838), because it is a bigger, more complex pressing. And a full [body side panel for a D5 A8](/product/AUD-4N0809041L) is the largest assembly of its kind we list — it spans considerably more of the car than a quarter panel does.

# When replacement is the right call

Replace when the damage is structural: a tear, a deep crease through a body line, corrosion that has perforated the metal, or crash damage that has moved the wheel arch.

Replace when the damage crosses a swage line. Straightening a panel back to a crisp factory feature line is very difficult, and a wavy body line is visible from across a car park.

# When repair is the right call

Repair when the metal is intact and the damage is shallow. A competent bodyshop can pull and fill a dent for a fraction of the panel cost, and on a car that is not going to concours it is the sensible answer.

Repair when the car's value does not support the panel. This is the honest conversation nobody wants: on an older car, one quarter panel plus paint plus the labour to cut out the old section and weld in the new one can exceed what the car is worth.

> Ask your bodyshop for both quotes before you order anything. Panel replacement is heavily labour-dominated — the part is often the smaller half of the bill once cutting, welding, sealing, priming and painting are counted.

# A third option worth knowing

Section repair panels — partial pressings covering just an arch or a lower section — exist for many platforms and cost far less than a full panel. They are not genuine Audi parts and they need a skilled hand to blend, but for corrosion in a single area they are frequently the right economic answer.

We sell genuine panels because that is what our fitment guarantee can stand behind. If a section repair is the better call for your car, a good bodyshop will tell you so, and we would rather you heard it before you spent four figures with us.

If you need a genuine panel, send the VIN. Body parts vary by body style far more than most systems, and this is not a part you want to order twice.$md$,
  'AudiParts Direct',
  'published',
  'Audi Quarter Panel Cost: Repair or Replace?',
  'Genuine Audi quarter panels list in the four figures because they are structural welded stampings. What drives the cost and when repair is smarter.',
  ARRAY['Body','Buying guide'],
  ARRAY['AUD-8W8809838','AUD-8W6809838','AUD-4N0809041L'],
  NOW() - INTERVAL '7 days', NOW()
),

-- ── 6 ────────────────────────────────────────────────────────────────
(
  'audi-e-tron-vs-e-tron-gt-parts',
  'The e-tron trap: why the e-tron GT takes different parts',
  'Audi sells several unrelated cars with e-tron in the name. The GT shares its platform with a Porsche, not with the e-tron SUV, and the part numbers prove it.',
  $md$"e-tron" is a badge, not a platform, and that causes more misordering than almost anything else in the current range.

# Three different cars, three different platforms

- **e-tron / Q8 e-tron** — the large SUV. Part numbers commonly start `4KE`.
- **e-tron GT** — the low four-door. Part numbers commonly start `9J1`.
- **Q4 e-tron** — the compact SUV, built on VW Group's MEB platform. Numbers commonly start `1EA`.

These are not variations on a theme. The e-tron GT is built on the J1 platform, which it shares with the **Porsche Taycan** — not with the e-tron SUV that shares its name. Parts cross between the GT and the Taycan far more readily than between the GT and the e-tron.

The Q4 e-tron is on MEB, the same architecture underneath a range of Volkswagen Group electric cars, and shares very little with either of the others.

# What this looks like in practice

A radiator for the e-tron SUV is a `4KE` part — for instance the [4KE 121 251 B](/product/AUD-4KE121251B), which fits e-tron, Q8 e-tron and SQ8 e-tron. It does not fit an e-tron GT.

The GT's cooling and braking parts carry `9J1` numbers. Its [front brake disc](/product/AUD-9J1615301A) and [rear brake disc](/product/AUD-9J1615601) are both `9J1` parts, shared with the Taycan.

Order a `4KE` radiator for a GT and you will get a part that is genuinely for an Audi with "e-tron" on the boot, and genuinely will not fit your car.

# Why listings get this wrong

Search engines and parts catalogues match on text. "Audi e-tron radiator" matches all three cars, and many retailers do not disambiguate in the title. We have seen the SUV radiator listed as an e-tron GT part on more than one site.

> If you drive an e-tron GT, treat "e-tron" results as a red flag rather than a match. Check the prefix. `9J1` is your car; `4KE` is not.

# The ceramic caveat on GT brakes

The GT was offered with both iron and ceramic front discs, and the price difference is enormous — our [9J1 615 302 D](/product/AUD-9J1615302D) is a ceramic front disc and lists at several times the iron equivalent.

This is worth checking against your VIN before ordering. The two are not interchangeable: carriers, pads and hub geometry all differ.

# A quick reference

```
4KE  ->  e-tron / Q8 e-tron / SQ8 e-tron  (SUV)
9J1  ->  e-tron GT / RS e-tron GT         (shares with Porsche Taycan)
1EA  ->  Q4 e-tron                        (MEB platform)
```

Read the prefix on the number, not the name in the listing. If you have the old part, its number settles the question immediately — see [how to read an Audi OE part number](/blog/how-to-read-an-audi-oe-part-number).

Unsure which car you have parts-wise? Send us the VIN. On the electric range in particular, this is worth confirming before anything ships.$md$,
  'AudiParts Direct',
  'published',
  'Audi e-tron vs e-tron GT: Why the Parts Are Different',
  'The e-tron GT shares its J1 platform with the Porsche Taycan, not the e-tron SUV. How to read 4KE, 9J1 and 1EA prefixes and avoid ordering the wrong part.',
  ARRAY['EV','Fitment guide'],
  ARRAY['AUD-4KE121251B','AUD-9J1615301A','AUD-9J1615601','AUD-9J1615302D'],
  NOW() - INTERVAL '2 days', NOW()
)

ON CONFLICT (slug) DO UPDATE
  SET title            = EXCLUDED.title,
      excerpt          = EXCLUDED.excerpt,
      body             = EXCLUDED.body,
      author_name      = EXCLUDED.author_name,
      status           = EXCLUDED.status,
      meta_title       = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      tags             = EXCLUDED.tags,
      related_skus     = EXCLUDED.related_skus,
      -- published_at is NOT overwritten: the original publication date is what
      -- the sitemap and article:published_time report, and rewriting it on a
      -- re-run would tell crawlers every post was republished today.
      updated_at       = NOW();

COMMIT;


-- =============================================================================
-- VERIFY
--   SELECT slug, status, published_at::date, array_length(related_skus,1) AS skus
--     FROM blog_posts ORDER BY published_at DESC;
--
--   -- every related SKU should resolve to a live part; this should return 0 rows
--   SELECT b.slug, s AS missing_sku
--     FROM blog_posts b, unnest(b.related_skus) AS s
--    WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.sku = s AND p.is_active);
--
-- Then visit /blog. Posts are live immediately and enter /sitemap.xml on the
-- next revalidation (hourly), or straight away if you save any post in
-- /admin/blog, which revalidates the sitemap explicitly.
-- =============================================================================
