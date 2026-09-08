#!/usr/bin/env node
/**
 * Generate seed-reviews.sql -- reviews for every part in the catalogue.
 *
 *   node scripts/build-reviews.mjs            # writes seed-reviews.sql
 *   node scripts/build-reviews.mjs --stats    # also prints a distribution report
 *
 * WHY A GENERATOR AND NOT A HAND-WRITTEN .sql
 * 260 parts across 22 categories need a few hundred reviews. Written by hand
 * they drift into the same four sentences reskinned; generated from
 * category-specific vocabulary they stay distinct AND stay about the part --
 * a brake rotor review talks about bedding in and judder, an ignition coil
 * review talks about misfires and cylinder numbers.
 *
 * UNIQUENESS is enforced, not hoped for:
 *   - every review body is globally unique (checked against a Set, redrawn on
 *     collision, and asserted before the file is written)
 *   - every (sku, author_name) pair is unique, matching the unique index in
 *     migration-reviews.sql so a re-run cannot duplicate
 *   - no part carries the same title twice
 *
 * DETERMINISTIC: the PRNG is seeded from the SKU, so re-running produces a
 * byte-identical file. Regenerating does not churn the catalogue.
 *
 * Prose matches the rating: a 2-star body complains, a 5-star body does not.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const STATS = process.argv.includes('--stats')
const OUT = 'seed-reviews.sql'

// -- env ---------------------------------------------------------------
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPBASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// -- deterministic PRNG ------------------------------------------------
function hash32(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)]

/** Draw `n` distinct members of `arr`. */
function pickN(rnd, arr, n) {
  const pool = [...arr]
  const out = []
  while (out.length < n && pool.length) out.push(...pool.splice(Math.floor(rnd() * pool.length), 1))
  return out
}

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// -- people ------------------------------------------------------------
const FIRST = [
  'Marcus', 'Daniel', 'Stefan', 'Priya', 'Thomas', 'Elena', 'Jonas', 'Aisha', 'Rebecca', 'Kwame',
  'Lukas', 'Hannah', 'Diego', 'Mei', 'Anders', 'Yusuf', 'Claire', 'Viktor', 'Nadia', 'Owen',
  'Sofia', 'Rajesh', 'Greta', 'Malik', 'Ingrid', 'Tobias', 'Chidi', 'Laura', 'Emre', 'Simone',
  'Patrick', 'Amara', 'Niall', 'Ines', 'Bastian', 'Yara', 'Callum', 'Freya', 'Hugo', 'Zara',
  'Martin', 'Lena', 'Oscar', 'Rania', 'Felix', 'Nora', 'Adrian', 'Talia', 'Sven', 'Camille',
]
const LAST = [
  'Whitfield', 'Okonkwo', 'Brandt', 'Nair', 'Lindqvist', 'Moreau', 'Halvorsen', 'Rahman', 'Castellanos', 'Novak',
  'Ferreira', 'Bergmann', 'Adeyemi', 'Kowalski', 'Duarte', 'Hoffmann', 'Petrov', 'Silva', 'Vance', 'Ibrahim',
  'Larsen', 'Mensah', 'Rossi', 'Fitzgerald', 'Weiss', 'Almeida', 'Novotny', 'Kaur', 'Bauer', 'Sorensen',
  'Marchetti', 'Osei', 'Vogel', 'Delgado', 'Krause', 'Bianchi', 'Haugen', 'Tran', 'Ellery', 'Zimmer',
]

const AUDI = [
  'A3 8V', 'A3 8P', 'A4 B7', 'A4 B8', 'A4 B8.5', 'A4 B9', 'A5 8T', 'A5 F5', 'A6 C6', 'A6 C7',
  'A6 C8', 'A7 4G', 'A8 D4', 'Q3 8U', 'Q5 8R', 'Q5 FY', 'Q7 4L', 'Q7 4M', 'TT 8J', 'TT 8S',
  'S4 B8', 'S3 8V', 'RS4 B7', 'Q8 4M', 'A1 8X',
]
const ENGINES = ['2.0 TFSI', '1.8 TFSI', '2.0 TDI', '3.0 TDI V6', '3.0 TFSI V6', '1.4 TFSI', '2.5 TFSI']

// -- vocabulary, by part family ----------------------------------------
// Each family supplies four independent slots. A body draws several of them,
// so the combinatorial space per family runs to tens of thousands.
const FAMILIES = {
  brakes: {
    match: ['brake-rotors', 'brake-pads'],
    titles: {
      good: ['Judder gone completely', 'Straight, true and quiet', 'Better than the dealer discs', 'Bedded in perfectly', 'Pedal feel transformed', 'Exactly the right spec', 'No more steering shudder', 'Solid replacement discs'],
      mixed: ['Fine once bedded, noisy first week', 'Good discs, awkward delivery', 'Works, but check your part number', 'Decent for the money'],
      bad: ['Warped inside 3000 miles', 'Wrong offset for my car', 'Surface rust out of the box'],
    },
    install: [
      'swapped them on the driveway with basic tools in about two hours a side',
      'carrier bolts came off without a fight and the new discs dropped straight on',
      'took my time bedding them in over 200 miles as the instructions ask',
      'an independent specialist fitted them and commented on how clean the castings were',
      'needed a wind-back tool for the rear calipers but otherwise a straightforward job',
      'the hub face cleaned up first, then these went on with no shimming needed',
    ],
    quality: [
      'runout measured well within spec on the dial gauge',
      'the vane casting is noticeably tidier than the budget set I pulled off',
      'the protective coating on the hat means no unsightly rust ring after a wash',
      'weight and vane count match the originals exactly',
      'machining on the friction face is even all the way round',
      'thickness came in bang on the OE figure when I measured it',
    ],
    outcome: [
      'the steering wheel shimmy under braking from motorway speed has completely gone',
      'stopping distance feels shorter and the pedal is firm rather than spongy',
      'no squeal at all, even cold on a damp morning',
      'eight months and several thousand miles later they are still dead smooth',
      'braking is quiet and progressive where before it grabbed',
      'no vibration through the pedal even on a long downhill run',
    ],
    complaint: [
      'they developed a pulsing through the pedal well before they should have',
      'one disc had visible corrosion on the friction surface when I opened the box',
      'they never fully stopped squealing no matter how carefully I bedded them',
    ],
  },

  ignition: {
    match: ['ignition-coils'],
    titles: {
      good: ['Misfire cleared instantly', 'Idle is smooth again', 'Cured my P0303', 'No more limp mode', 'Straight fix for a rough idle', 'Exactly like the originals', 'Engine light off first drive'],
      mixed: ['Fixed it, but buy the full set', 'Good coil, slow shipping', 'Works fine, boots are stiff'],
      bad: ['Failed after two months', 'Boot split on installation'],
    },
    install: [
      'coil pack out, new one in, ten minutes with a T30 and the engine cover off',
      'I replaced all four at once rather than chase them one at a time',
      'I cleared the fault codes afterwards and they have not come back',
      'a smear of dielectric grease went on the boot before it was seated',
      'I swapped it on the roadside when the car dropped a cylinder on the way home',
    ],
    quality: [
      'identical moulding and connector to the failed original I took out',
      'the boot is proper thick silicone, not the thin rubber the cheap ones use',
      'the part number on the body matches the OE reference exactly',
      'the spring contact is firm and seated with a definite click',
    ],
    outcome: [
      'the rough idle and flashing engine light disappeared immediately',
      'it pulls cleanly through the rev range again with no stumble under load',
      'fuel economy went back to normal within a tank',
      'cold starts are smooth instead of shaking the whole car',
      'no stored codes after a month of daily driving',
    ],
    complaint: [
      'it started misfiring on the same cylinder again after about eight weeks',
      'the boot tore as I seated it, which suggests the rubber compound is not right',
    ],
  },

  timing: {
    match: ['timing'],
    titles: {
      good: ['Correct kit, no surprises', 'Quiet engine again', 'Rattle on start-up gone', 'Everything lined up', 'Peace of mind on an interference engine', 'Complete and correct'],
      mixed: ['Good part, order the water pump too', 'Right belt, sparse instructions', 'Fine, but not a DIY job'],
      bad: ['Missing a tensioner bolt', 'Chain stretched sooner than expected'],
    },
    install: [
      'I booked it in with a specialist rather than risk an interference engine on the driveway',
      'locking tools on, marks aligned, and it timed up exactly where it should',
      'I did the water pump and rollers at the same time since the front was already off',
      'torqued the tensioner to spec and rotated it twice by hand before starting',
      'a weekend job with the right locking kit and a service manual open next to me',
    ],
    quality: [
      'the tooth profile and belt width are indistinguishable from the part that came off',
      'the chain has proper hardened links rather than the soft pins on cheap copies',
      'the date stamp was recent, which matters for rubber that has been sitting on a shelf',
      'everything in the box matched the parts diagram with nothing missing',
    ],
    outcome: [
      'the top-end rattle on cold start has completely gone',
      'the engine is noticeably quieter at idle than it has been for a year',
      'timing has held perfectly through 12,000 miles since fitting',
      'no more chain slap on start-up, which was what prompted the job',
    ],
    complaint: [
      'one of the tensioner bolts was missing from the kit and held the job up a day',
      'it developed a light rattle again far sooner than a timing job should need redoing',
    ],
  },

  cooling: {
    match: ['radiators', 'intercoolers'],
    titles: {
      good: ['Temps back to normal', 'Perfect fit, no modification', 'Solved my overheating', 'Better core than the original', 'Holds pressure beautifully', 'Straight swap'],
      mixed: ['Good rad, mounting tabs tight', 'Works well, packaging was thin', 'Fits, but budget a new fan shroud'],
      bad: ['Seeped from the end tank', 'Fins bent in transit'],
    },
    install: [
      'front end off, old one out, this one in over a long Saturday',
      'all the mounting points and hose stubs lined up without any persuasion',
      'I flushed the system properly and refilled with the correct G13 before bleeding',
      'I bled it through the proper procedure and it has held level ever since',
      'the transmission cooler lines threaded straight in with no adapters',
    ],
    quality: [
      'the core is thicker than the unit it replaced and the fin density is noticeably higher',
      'the end tanks are properly crimped with clean seams all the way round',
      'the plastic feels substantial rather than the brittle stuff that cracks at the neck',
      'I pressure tested it to 1.4 bar before fitting and it held without a drop',
    ],
    outcome: [
      'the gauge sits dead centre now even in traffic on a hot day',
      'no more creeping temperature when towing',
      'the coolant level has not moved in four months',
      'intake temps dropped noticeably on a long motorway pull',
    ],
    complaint: [
      'a weep appeared at the end tank seam after a few heat cycles',
      'several fins arrived flattened because the box had almost no internal padding',
    ],
  },

  suspension: {
    match: ['shocks-struts', 'coil-springs', 'bump-stops'],
    titles: {
      good: ['Ride is composed again', 'Night and day difference', 'Crashing over potholes has stopped', 'Correct damping rate', 'Car feels new again', 'Well damped, not harsh'],
      mixed: ['Good dampers, buy the top mounts too', 'Firmer than standard, took adjusting to', 'Fine, but get an alignment after'],
      bad: ['Leaked within a month', 'Sat noticeably lower than the other side'],
    },
    install: [
      'spring compressors out and the strut rebuilt on the bench in an afternoon',
      'I fitted both sides together as you should, then had it aligned the same week',
      'top mounts and bearings went on at the same time while it was apart',
      'I torqued everything at ride height rather than with the suspension hanging',
      'the garage did the pair and the alignment came back within spec straight away',
    ],
    quality: [
      'damping is progressive when you compress it by hand, not dead at the top of the stroke',
      'the rod is properly finished with no machining marks and the seal is clean',
      'the paint and plating look like they will survive a few winters of salt',
      'the weight matches the original almost exactly, which the cheap ones never do',
    ],
    outcome: [
      'the car no longer floats over crests and settles in one movement',
      'sharp expansion joints no longer send a bang through the cabin',
      'body roll through roundabouts is properly controlled again',
      'the clonk over speed bumps that started this job has completely gone',
      'it tracks straight on the motorway instead of wandering',
    ],
    complaint: [
      'one unit was visibly weeping oil down the body within a few weeks',
      'the car sat about 15mm lower on one side, which suggests a spring rate problem',
    ],
  },

  filters: {
    match: ['oil-filters', 'air-filters', 'cabin-filters', 'transmission-filters'],
    titles: {
      good: ['Correct fit, sealed properly', 'Genuine quality for less', 'Right filter every time', 'Good pleat count', 'Exactly what the service needed', 'No leaks, no fuss'],
      mixed: ['Fine filter, seal was dry', 'Good value, thin gasket', 'Does the job, packaging poor'],
      bad: ['Seal did not seat', 'Wrong housing diameter'],
    },
    install: [
      'it dropped straight into the housing and the cap torqued to spec first go',
      'I changed it with the oil at the same service interval',
      'two minutes behind the glovebox once I had the tabs released',
      'I pre-oiled the seal before fitting and there has not been a drop since',
      'the old one practically fell apart coming out; this went in cleanly',
    ],
    quality: [
      'the pleat count is visibly higher than the supermarket filter I had been using',
      'the media feels dense and the end caps are properly bonded rather than glued on thin',
      'the rubber seal is supple and sat in its groove without coaxing',
      'dimensions matched the outgoing filter to the millimetre',
    ],
    outcome: [
      'oil pressure comes up as quickly on a cold start as it always has',
      'no leaks at all after several hundred miles',
      'the musty smell from the vents has completely gone',
      'throttle response feels crisper than it did on the clogged original',
      'shifts are smoother now the transmission has clean fluid and a fresh filter',
    ],
    complaint: [
      'the gasket was dry and flat out of the packet and would not seat cleanly',
      'the outer diameter was a couple of millimetres off and it would not sit square in the housing',
    ],
  },

  wheels: {
    match: ['alloy-wheels', 'wheel-accessories'],
    titles: {
      good: ['Finish is flawless', 'Balanced with almost no weight', 'Transformed the look', 'Correct offset, no rubbing', 'Straight and true', 'Better than I expected'],
      mixed: ['Lovely wheel, needs spigot rings', 'Good finish, one had a mark', 'Right size, check your bolt length'],
      bad: ['Buckled on a mild pothole', 'Finish lifted in one winter'],
    },
    install: [
      'they bolted straight on with the factory bolts and centred perfectly on the hub',
      'I had them balanced when the tyres went on and they took almost no weight',
      'torqued to 120Nm in a star pattern and rechecked after 50 miles',
      'they needed spigot rings for a proper hub-centric fit, which are worth buying alongside',
    ],
    quality: [
      'the casting is clean with no flashing around the spokes or the bolt seats',
      'the lacquer is even and deep, with no orange peel anywhere on the face',
      'the machined face has a consistent finish under direct light',
      'weight per corner is genuinely lower than the wheels I took off',
    ],
    outcome: [
      'no vibration at any speed, right up to motorway limits',
      'they have been through a winter of salt without a mark on the finish',
      'it clears the front calipers with room to spare',
      'the car sits exactly right with no arch rub on full lock',
    ],
    complaint: [
      'one wheel picked up a buckle from a pothole that should not have troubled it',
      'the lacquer started lifting at the rim edge after a single winter',
    ],
  },

  body: {
    match: ['quarter-panels', 'exterior-trim', 'bumpers', 'front-bumpers', 'body-brackets'],
    titles: {
      good: ['Panel gaps came out perfect', 'Bodyshop was impressed', 'Saved a fortune on the repair', 'Contours match exactly', 'Primed and ready to paint', 'Lined up first time'],
      mixed: ['Good panel, needed minor adjustment', 'Fits well, arrived slightly marked', 'Right part, allow for prep time'],
      bad: ['Creased in transit', 'Mounting tab snapped off'],
    },
    install: [
      'the bodyshop test-fitted it before paint and needed almost no adjustment',
      'it clipped into the factory mounting points without drilling anything',
      'I prepped and painted it in the car colour and it went on in a morning',
      'I lined it up against the door shut and the gap fell straight in',
    ],
    quality: [
      'the steel gauge feels the same as the original panel we cut out',
      'the swage lines and body contours follow the original exactly',
      'it came properly primed rather than in bare metal that would flash rust',
      'all the mounting tabs and clip locations are present and in the right place',
    ],
    outcome: [
      'the panel gaps are even down both sides and you cannot tell it was repaired',
      'it has been on a year now with no sign of corrosion at the seams',
      'the paint match came out perfectly with no ripple in the reflection',
      'the finished repair cost a fraction of a dealer panel',
    ],
    complaint: [
      'it arrived with a crease along one edge because the packaging was inadequate',
      'one of the mounting tabs sheared as soon as it was put under any tension',
    ],
  },

  fasteners: {
    match: ['fasteners'],
    titles: {
      good: ['Correct thread, correct grade', 'Exactly the right hardware', 'Saved a trip to the dealer', 'Proper OE spec', 'Right first time'],
      mixed: ['Right bolts, count was short', 'Good hardware, slow to arrive'],
      bad: ['Thread pitch was wrong'],
    },
    install: [
      'they threaded in cleanly by hand before I put a socket anywhere near them',
      'torqued to the manual figure with no sign of stretch',
      'I replaced the whole set rather than reuse stretch bolts, as you should',
    ],
    quality: [
      'the head marking and plating match the originals exactly',
      'thread pitch and length are spot on against the old hardware',
      'proper grade steel rather than the soft plated stuff that rounds off',
    ],
    outcome: [
      'everything torqued down evenly with nothing binding',
      'no corrosion on them after a winter of road salt',
      'it came in cheaper than the dealer wanted for the same specification',
    ],
    complaint: ['the pack was two bolts short of the quantity listed'],
  },

  audio: {
    match: ['speakers'],
    titles: {
      good: ['Clarity is a big step up', 'Direct fit, no adapters', 'Bass without the rattle', 'Worth doing'],
      mixed: ['Good sound, fiddly fitting', 'Better than stock, not audiophile'],
      bad: ['One arrived with a torn surround'],
    },
    install: [
      'door card off, four screws, and the connector plugged straight in',
      'they dropped into the factory location without any adapter rings',
      'I added a bit of sound deadening behind them while the door was open',
    ],
    quality: [
      'the cone and surround feel far more substantial than the paper originals',
      'the magnet is significantly larger than the factory unit',
      'the terminals are proper spade connectors that match the factory loom',
    ],
    outcome: [
      'vocals are clear at volume where the originals used to distort',
      'the door card buzz at higher volume has gone completely',
      'noticeably more detail without having to touch the head unit settings',
    ],
    complaint: ['one of the pair had a small tear in the surround out of the box'],
  },
}

const FAMILY_FOR = {}
for (const [name, fam] of Object.entries(FAMILIES)) for (const slug of fam.match) FAMILY_FOR[slug] = name

// Openers name the car, so reviews read as written by an owner.
const OPENERS = [
  (ctx) => `Fitted to my ${ctx.year} ${ctx.model}`,
  (ctx) => `Went on my ${ctx.model} ${ctx.engine} at ${ctx.miles}k miles`,
  (ctx) => `Bought for a ${ctx.year} ${ctx.model}`,
  (ctx) => `Ordered this for my ${ctx.model} after the original gave up at ${ctx.miles}k`,
  (ctx) => `Replacement for my ${ctx.year} ${ctx.model} ${ctx.engine}`,
  (ctx) => `My ${ctx.model} needed this doing at ${ctx.miles}k miles`,
  (ctx) => `Second one of these I have bought, this time for the ${ctx.model}`,
  (ctx) => `Cross-referenced the OE number against my ${ctx.year} ${ctx.model} before ordering`,
]

const CLOSERS_GOOD = [
  'Would order again without hesitation.',
  'No complaints at all.',
  'Happy to recommend it.',
  'Exactly what I needed.',
  'Good value against the dealer price.',
  'Delivery was quick too.',
  'Will be back for the other side.',
  'Cannot fault it.',
]
const CLOSERS_MIXED = [
  'Worth buying, just go in with your eyes open.',
  'Fine for the money, with that one caveat.',
  'Would still buy it again.',
  'Good part, minor niggles.',
]
const CLOSERS_BAD = [
  'Disappointing for the price.',
  'Would not order the same one again.',
  'Expected better given the cost.',
]

// -- fetch catalogue ---------------------------------------------------
async function fetchAll(path) {
  const h = { apikey: KEY, Authorization: `Bearer ${KEY}` }
  const r = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: h })
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${await r.text()}`)
  return r.json()
}

const categories = await fetchAll('categories?select=id,slug&limit=500')
const catSlug = Object.fromEntries(categories.map((c) => [c.id, c.slug]))
const parts = await fetchAll(
  'parts?select=sku,name,category_id,price,is_active&is_active=eq.true&limit=1000',
)
parts.sort((a, b) => a.sku.localeCompare(b.sku))

// -- generate ----------------------------------------------------------
const seenBodies = new Set()
const rows = []
const skipped = []

const DAY = 86400000
const END = Date.parse('2026-08-20T00:00:00Z')
const SPAN_DAYS = 540

for (const part of parts) {
  const slug = catSlug[part.category_id]
  const famName = FAMILY_FOR[slug]
  if (!famName) {
    skipped.push(`${part.sku} (${slug ?? 'no category'})`)
    continue
  }
  const fam = FAMILIES[famName]
  const rnd = mulberry32(hash32(part.sku))

  // How many reviews this part carries. Unpriced parts are not really on sale
  // yet, so they stay quiet; priced parts get a realistic long tail.
  const roll = rnd()
  let n
  if (part.price > 0) {
    n = roll < 0.14 ? 0 : roll < 0.42 ? 1 : roll < 0.7 ? 2 : roll < 0.88 ? 3 : roll < 0.96 ? 4 : 5
  } else {
    n = roll < 0.72 ? 0 : 1
  }
  if (n === 0) continue

  const authorsUsed = new Set()
  const titlesUsed = new Set()

  for (let i = 0; i < n; i++) {
    // Rating distribution: honest but healthy. Not every part is five stars.
    const rr = rnd()
    const rating = rr < 0.5 ? 5 : rr < 0.79 ? 4 : rr < 0.92 ? 3 : rr < 0.975 ? 2 : 1
    const tier = rating >= 4 ? 'good' : rating === 3 ? 'mixed' : 'bad'

    const ctx = {
      model: pick(rnd, AUDI),
      engine: pick(rnd, ENGINES),
      year: 2006 + Math.floor(rnd() * 19),
      miles: 40 + Math.floor(rnd() * 130),
    }

    // Author: unique within this part, matching the unique index.
    let author = ''
    for (let a = 0; a < 60; a++) {
      const candidate = `${pick(rnd, FIRST)} ${pick(rnd, LAST)}`
      if (!authorsUsed.has(candidate)) {
        author = candidate
        break
      }
    }
    if (!author) break
    authorsUsed.add(author)

    // Title: unique within this part.
    let title = ''
    for (let t = 0; t < 40; t++) {
      const candidate = pick(rnd, fam.titles[tier])
      if (!titlesUsed.has(candidate)) {
        title = candidate
        break
      }
    }
    if (!title) title = `${pick(rnd, fam.titles[tier])} (${ctx.model})`
    titlesUsed.add(title)

    // Body: unique globally. Redraw on collision, and skip rather than emit a
    // duplicate if the family's vocabulary is genuinely exhausted.
    let body = ''
    for (let attempt = 0; attempt < 80; attempt++) {
      const sentences = [pick(rnd, OPENERS)(ctx) + '.']

      if (tier === 'bad') {
        sentences.push(capitalise(pick(rnd, fam.complaint)) + '.')
        if (rnd() < 0.5) sentences.push(capitalise(pick(rnd, fam.install)) + '.')
        sentences.push(pick(rnd, CLOSERS_BAD))
      } else if (tier === 'mixed') {
        sentences.push(capitalise(pick(rnd, fam.install)) + '.')
        sentences.push(
          rnd() < 0.6
            ? capitalise(pick(rnd, fam.complaint)) + '.'
            : capitalise(pick(rnd, fam.quality)) + '.',
        )
        sentences.push(`That said, ${pick(rnd, fam.outcome)}.`)
        sentences.push(pick(rnd, CLOSERS_MIXED))
      } else {
        const [a, b] = pickN(rnd, [pick(rnd, fam.install), pick(rnd, fam.quality)], 2)
        sentences.push(capitalise(a) + '.')
        sentences.push(capitalise(b) + '.')
        sentences.push(`Result is ${pick(rnd, fam.outcome)}.`)
        if (rnd() < 0.65) sentences.push(pick(rnd, CLOSERS_GOOD))
      }

      const candidate = sentences.join(' ').replace(/\s+/g, ' ').trim()
      if (!seenBodies.has(candidate)) {
        body = candidate
        break
      }
    }
    if (!body) break
    seenBodies.add(body)

    const created = new Date(END - Math.floor(rnd() * SPAN_DAYS) * DAY - Math.floor(rnd() * DAY))

    rows.push({
      sku: part.sku,
      rating,
      title,
      body,
      author_name: author,
      // Most reviewers bought here; a minority are unverified.
      is_verified: rnd() < 0.72,
      created_at: created.toISOString(),
    })
  }
}

// -- assert uniqueness before writing ----------------------------------
const bodies = new Set(rows.map((r) => r.body))
if (bodies.size !== rows.length) throw new Error(`duplicate bodies: ${rows.length - bodies.size}`)

const pairs = new Set(rows.map((r) => `${r.sku} ${r.author_name}`))
if (pairs.size !== rows.length) throw new Error(`duplicate (sku, author): ${rows.length - pairs.size}`)

// -- emit SQL ----------------------------------------------------------
const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const covered = new Set(rows.map((r) => r.sku)).size

const header = `-- =============================================================================
-- SEED: product reviews  (${rows.length} rows across ${covered} parts)
--
-- GENERATED FILE -- do not hand-edit. Regenerate with:
--   node scripts/build-reviews.mjs
-- The generator is deterministic (PRNG seeded per SKU), so regenerating
-- reproduces this same file rather than churning the data.
--
-- Requires migration-reviews.sql to have been applied first.
--
-- Every body in this file is unique, every (sku, author_name) pair is unique,
-- and no part carries the same title twice. Prose matches the star rating --
-- the low-rated bodies actually complain.
--
-- Re-running is safe: ON CONFLICT (sku, author_name) DO NOTHING relies on the
-- unique index from the migration, so a second run inserts nothing.
--
-- parts.rating and parts.review_count are maintained by the
-- reviews_after_change trigger and are deliberately NOT written here.
--
-- TO REMOVE THIS SEED ENTIRELY (the rollups follow automatically):
--   DELETE FROM reviews WHERE customer_id IS NULL AND order_id IS NULL;
-- =============================================================================

BEGIN;

INSERT INTO reviews (sku, rating, title, body, author_name, is_verified, is_approved, created_at) VALUES
`

const values = rows
  .map(
    (r) =>
      `  (${q(r.sku)}, ${r.rating}, ${q(r.title)}, ${q(r.body)}, ${q(r.author_name)}, ${r.is_verified}, TRUE, ${q(r.created_at)})`,
  )
  .join(',\n')

const footer = `
ON CONFLICT (sku, author_name) DO NOTHING;

COMMIT;


-- =============================================================================
-- VERIFY
-- =============================================================================
-- SELECT count(*) AS reviews, count(DISTINCT sku) AS parts_covered FROM reviews;
--
-- Uniqueness -- both must return no rows:
-- SELECT body        FROM reviews GROUP BY body             HAVING count(*) > 1;
-- SELECT sku, author_name FROM reviews GROUP BY sku, author_name HAVING count(*) > 1;
--
-- Rollups the trigger maintains:
-- SELECT sku, rating, review_count FROM parts
--  WHERE review_count > 0 ORDER BY review_count DESC LIMIT 10;
-- =============================================================================
`

writeFileSync(OUT, header + values + footer)

console.log(`${OUT}: ${rows.length} reviews across ${covered} parts`)
console.log(`unique bodies: ${bodies.size}/${rows.length}`)
if (skipped.length) console.log(`skipped (no vocabulary for category): ${skipped.length}`)

if (STATS) {
  const dist = {}
  for (const r of rows) dist[r.rating] = (dist[r.rating] || 0) + 1
  console.log('\nrating distribution:')
  for (const s of [5, 4, 3, 2, 1]) {
    const n = dist[s] || 0
    const bar = '#'.repeat(Math.round((n / rows.length) * 50))
    console.log(`  ${s} star ${String(n).padStart(4)}  ${bar}`)
  }
  const avg = rows.reduce((a, r) => a + r.rating, 0) / rows.length
  console.log(`\naverage: ${avg.toFixed(2)}`)
  console.log(`verified: ${Math.round((rows.filter((r) => r.is_verified).length / rows.length) * 100)}%`)
  const lens = rows.map((r) => r.body.length)
  const avgLen = Math.round(lens.reduce((a, b) => a + b, 0) / lens.length)
  console.log(`body length: min ${Math.min(...lens)} / avg ${avgLen} / max ${Math.max(...lens)}`)
}
