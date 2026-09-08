#!/usr/bin/env node
/**
 * Derive part_fitment for the whole catalogue from OE part-number prefixes.
 *
 * Replaces the seed-fitment.sql route. That file is a single 3,900-row INSERT;
 * pasting it into the SQL editor left only 431 rows / 29 SKUs behind, so 231 of
 * 260 parts had no fitment at all and the model/year filter returned almost
 * nothing. Writing through the REST API instead is batched, idempotent, and
 * reports what it did.
 *
 * Two kinds of prefix:
 *   CHASSIS      8W0 -> A4 B9. The part fits that generation, every year of it.
 *   ENGINE_FIT   06L -> EA888 Gen3, which powers the A3 8V, A4 B9, A5 F5,
 *                Q5 FY and TT 8S, so the part fits all five.
 *
 * Fitment is asserted at GENERATION level from the part number. It is not
 * engine-code verified — every row is written is_verified = false.
 *
 *   node scripts/build-fitment.mjs           # confident mappings only
 *   node scripts/build-fitment.mjs --broad   # + category fallback for the
 *                                            #   platform-unknown tail
 *   node scripts/build-fitment.mjs --dry     # report, write nothing
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const BROAD = process.argv.includes('--broad')
const DRY   = process.argv.includes('--dry')

// ── prefix tables ────────────────────────────────────────────────────────────
const CHASSIS = {
  '8L0':['a3','8L'], '8P0':['a3','8P'], '1K0':['a3','8P'], '1J0':['a3','8L'],
  '8V0':['a3','8V'], '8V4':['a3','8V'], '8V5':['a3','8V'], '5Q0':['a3','8V'],
  '8Y0':['a3','8Y'], '8Y5':['a3','8Y'], '5WA':['a3','8Y'], '2Q0':['a1','GB'],
  '8E0':['a4','B7'], '8H0':['a4','B7'],
  '8K0':['a4','B8'], '8K5':['a4','B8'], '8K9':['a4','B8'],
  '8W0':['a4','B9'], '8W2':['a4','B9'], '8W5':['a4','B9'], '8W9':['a4','B9'],
  '8W6':['a5','F5'], '8W7':['a5','F5'], '8W8':['a5','F5'],
  '8T0':['a5','8T'], '8F0':['a5','8F'], '8B3':['a5','8B'], '8B5':['a5','8B'],
  '4B0':['a6','C5'], '4F0':['a6','C6'], '4G0':['a6','C7'], '4G5':['a6','C7'],
  '4K0':['a6','C8'], '4K5':['a6','C8'], '4KE':['a6','C8'],
  '4G8':['a7','C7'], '4K8':['a7','C8'],
  '4E0':['a8','D3'], '4H0':['a8','D4'], '4N0':['a8','D5'],
  '8U0':['q3','8U'], '83H':['q3','F3'], '85E':['q3','F3'], '85F':['q3','F3'], '85H':['q3','F3'],
  '8R0':['q5','8R'], '80A':['q5','FY'], '80F':['q5','FY'],
  '4L0':['q7','4L'], '4M0':['q7','4M'], '4M6':['q7','4M'],
  '4M8':['q8','4M'], '4MN':['q8','4M'],
  '420':['r8','42'], '4S0':['r8','4S'], '4S8':['r8','4S'],
  '8J8':['tt','8J'], '8S0':['tt','8S'],
  '89A':['q4-etron','89'], '89E':['q4-etron','89'], '1EA':['q4-etron','89'],
  '6R0':['vw-polo','6R'], '6N0':['vw-polo','6N'], '6Q0':['vw-polo','9N'],
  '7L0':['vw-touareg','7L'], '7B0':['vw-touareg','7L'],
  '9J1':['taycan','J1'],
  '4J3':['etron-gt','J1'],       // researched — see note above
  '95C':['macan','95C'],         // researched — see note above
  '8MA':['a5','8B'],             // inferred — see note above
}

const ENGINE_FIT = {
  '06A':[['a3','8L'],['a4','B7'],['tt','8J']],
  '06B':[['a4','B7'],['a6','C5'],['tt','8J']],
  '058':[['a4','B7'],['a6','C5'],['tt','8J']],
  '06D':[['a3','8P'],['a4','B7']],
  '06J':[['a3','8P'],['a4','B8'],['a5','8T'],['q5','8R'],['tt','8J']],
  '06K':[['a3','8V'],['a4','B9'],['a5','F5'],['q5','FY'],['tt','8S']],
  '06L':[['a3','8V'],['a4','B9'],['a5','F5'],['q5','FY'],['tt','8S']],
  '06M':[['a3','8Y'],['a4','B9'],['a5','F5'],['q5','FY']],
  '04E':[['a1','GB'],['a3','8V'],['a3','8Y']],
  '06C':[['a4','B7'],['a6','C5'],['a8','D3']],
  '06E':[['a4','B8'],['a5','8T'],['a6','C6'],['a6','C7'],['a7','C7'],['a8','D4'],['q5','8R'],['q7','4L']],
  '06H':[['a4','B8'],['a5','8T'],['q5','8R']],
  '078':[['a4','B7'],['a6','C5']],
  '079':[['a6','C6'],['a8','D3'],['q7','4L'],['r8','42']],
  '077':[['a8','D3'],['r8','42']],
  '07L':[['r8','42'],['s8','D3']],
  '07K':[['tt','8S'],['a3','8V']],
  '07C':[['a8','D3'],['a8','D4']],
  '07P':[['a8','D4']],
  '059':[['a4','B8'],['a6','C6'],['a6','C7'],['a8','D4'],['q7','4L']],
  '03N':[['a3','8V'],['a4','B9'],['q5','FY']],
  '03H':[['q7','4L'],['vw-touareg','7L']],
  '021':[['q7','4L']], '022':[['q7','4L']],
  '032':[['a3','8L']], '056':[['a6','C5']], '057':[['a6','C5']],
  '071':[['a4','B9']], '06N':[['a3','8L'],['tt','8J']],
  '06Q':[['a3','8P'],['a4','B7']],
  '01M':[['a3','8L'],['a4','B7']],
  '0B5':[['a4','B8'],['a5','8T'],['a6','C7'],['a7','C7'],['q5','8R']],
  // 4.0 TFSI V8 timing chains — RS6 C8, RS7 C8, S8 D5, SQ8 4M.
  '0P2':[['a6','C8'],['a7','C8'],['a8','D5'],['q8','4M']],
  // ZF 6-speed automatic filter, Q7 V6.
  '0AT':[['q7','4L']],
}

/**
 * Prefixes that are not in the tables above, resolved by looking the actual
 * part numbers up in OE catalogues (see PREFIX-RESEARCH.md for the sources):
 *
 *   4J3  e-tron GT      — 4J3 601 025 L/M/AC/AN listed as "2022-2024 Audi
 *                         e-tron GT" by four independent OE retailers.
 *   95C  Macan Electric — Porsche's 95C is the EV Macan (2024+); 95B is the
 *                         combustion car. Confirmed on Porsche OE listings.
 *   0P2  4.0 TFSI V8    — 0P2 109 229 J / 0P2 109 450 F are the timing chains
 *                         for the RS6 C8, RS7 C8, S8 D5 and SQ8, 2020-2025.
 *   0AT  ZF 6-speed     — 0AT 325 429 is the ZF automatic filter for the
 *                         Q7 V6 (ECS Tuning / Febi 176671).
 *   8MA  A5 B10         — INFERRED, not confirmed. 8M is the type code of the
 *                         2024+ A5 that replaced the A4; the modern "<type>A"
 *                         suffix pattern matches 80A (Q5 FY) and 4KE (A6 C8).
 *                         Ten parts, all chassis items for one platform.
 *   4P0  unidentified   — one alloy wheel. Listed by OE retailers, but none
 *                         name the model. Falls through to the range-wide
 *                         fallback below and is flagged in `notes`.
 */

/**
 * VAG standard-parts numbers. N-, WHT- and ZAW- are the shared hardware and
 * accessory ranges — the same nut is fitted to an A1 and a Q7 — so these map
 * to the whole Audi range rather than to one platform.
 */
const isUniversalHardware = (p) =>
  /^(N\d|WHT|ZAW)/.test((p.oe_number ?? '').replace(/\s/g, ''))

const gkey = (model, code) => `${model}-${code.toLowerCase()}`

// ── env / client ─────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPBASE_SECRET_KEY)

/** PostgREST caps a response at 1000 rows; page until short. */
async function all(table, select) {
  const out = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).range(from, from + 999)
    if (error) throw new Error(`${table}: ${error.message}`)
    out.push(...data)
    if (data.length < 1000) return out
  }
}

// ── new vehicle lines ────────────────────────────────────────────────────────
// The 4J3 and 95C parts belong to two cars the hierarchy has never had rows
// for, so the generations and their per-year vehicles are created here before
// fitment is derived. Both use engine_id 'unspecified' — they are EVs.
const NEW_MODELS = [
  { id: 'etron-gt', make_id: 'audi',    name: 'Audi e-tron GT',        slug: 'etron-gt', sort_order: 18 },
  { id: 'macan',    make_id: 'porsche', name: 'Porsche Macan Electric', slug: 'macan',   sort_order: 19 },
]
const NEW_GENERATIONS = [
  { id: 'etron-gt-j1', model_id: 'etron-gt', code: 'J1',  name: 'Audi e-tron GT J1',         year_start: 2021, year_end: 2026 },
  { id: 'macan-95c',   model_id: 'macan',    code: '95C', name: 'Porsche Macan Electric 95C', year_start: 2024, year_end: 2026 },
]

async function ensureVehicleLines() {
  for (const [table, rows] of [['models', NEW_MODELS], ['generations', NEW_GENERATIONS]]) {
    const { error } = await db.from(table).upsert(rows, { onConflict: 'id' })
    if (error) throw new Error(`${table}: ${error.message}`)
  }
  const v = NEW_GENERATIONS.flatMap((g) =>
    Array.from({ length: g.year_end - g.year_start + 1 }, (_, i) => ({
      id: `${g.id}-${g.year_start + i}`,
      generation_id: g.id,
      engine_id: 'unspecified',
      year: g.year_start + i,
    })),
  )
  const { error } = await db.from('vehicles').upsert(v, { onConflict: 'id' })
  if (error) throw new Error(`vehicles: ${error.message}`)
  return v.length
}

// ── build ────────────────────────────────────────────────────────────────────
if (!DRY) console.log(`ensured ${await ensureVehicleLines()} vehicles on 2 new generations`)

const parts    = await all('parts', 'sku,name,oe_number,oe_prefix,category_id')
const vehicles = await all('vehicles', 'id,generation_id')
const models   = await all('models', 'id,make_id')

const vehiclesByGen = {}
for (const v of vehicles) (vehiclesByGen[v.generation_id] ??= []).push(v.id)

const audiModels = new Set(models.filter((m) => m.make_id === 'audi').map((m) => m.id))
const audiGens = Object.keys(vehiclesByGen).filter((g) =>
  [...audiModels].some((m) => g === m || g.startsWith(`${m}-`)),
)

const rows = new Map()   // `${sku}|${vehicleId}` -> row
const add = (sku, gens, notes) => {
  for (const g of gens)
    for (const vid of vehiclesByGen[g] ?? [])
      rows.set(`${sku}|${vid}`, { sku, vehicle_id: vid, is_verified: false, notes })
}

const stats = { chassis: 0, engine: 0, hardware: 0, fallback: 0, unmapped: [] }

for (const p of parts) {
  const pre = p.oe_prefix
  if (pre && CHASSIS[pre]) {
    add(p.sku, [gkey(...CHASSIS[pre])], null)
    stats.chassis++
  } else if (pre && ENGINE_FIT[pre]) {
    add(p.sku, ENGINE_FIT[pre].map((k) => gkey(...k)), null)
    stats.engine++
  } else if (isUniversalHardware(p)) {
    add(p.sku, audiGens, 'VAG standard part — fits across the range.')
    stats.hardware++
  } else if (BROAD) {
    add(p.sku, audiGens, 'Platform not identified from the part number; listed range-wide. Verify against ETKA before sale.')
    stats.fallback++
  } else {
    stats.unmapped.push(`${pre ?? '—'} ${p.oe_number}  ${p.name}`)
  }
}

const desired = [...rows.values()]
console.log(`parts ${parts.length}  ·  chassis ${stats.chassis}  engine ${stats.engine}  ` +
            `hardware ${stats.hardware}  fallback ${stats.fallback}  unmapped ${stats.unmapped.length}`)
console.log(`fitment rows to hold: ${desired.length} across ${new Set(desired.map(r => r.vehicle_id)).size} vehicles`)
if (stats.unmapped.length) console.log('\nunmapped:\n  ' + stats.unmapped.join('\n  '))

if (DRY) { console.log('\n--dry: nothing written.'); process.exit(0) }

// ── write ────────────────────────────────────────────────────────────────────
// Insert only pairs that are missing, so re-running is a no-op and the 431
// rows already there are left alone.
const existing = new Set((await all('part_fitment', 'sku,vehicle_id')).map((r) => `${r.sku}|${r.vehicle_id}`))
const missing = desired.filter((r) => !existing.has(`${r.sku}|${r.vehicle_id}`))
console.log(`\nalready present ${existing.size}  ·  inserting ${missing.length}`)

for (let i = 0; i < missing.length; i += 500) {
  const batch = missing.slice(i, i + 500)
  const { error } = await db.from('part_fitment').insert(batch)
  if (error) { console.error(`batch ${i}: ${error.message}`); process.exit(1) }
  process.stdout.write(`\r  inserted ${Math.min(i + 500, missing.length)}/${missing.length}`)
}

const final = await all('part_fitment', 'sku,vehicle_id')
console.log(`\n\npart_fitment now ${final.length} rows covering ` +
            `${new Set(final.map((r) => r.sku)).size}/${parts.length} parts`)
