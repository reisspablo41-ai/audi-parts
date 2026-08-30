#!/usr/bin/env node
/**
 * Apply pricing.csv to the parts table.
 *
 *   node scripts/apply-pricing.mjs            # dry run — shows what would change
 *   node scripts/apply-pricing.mjs --apply    # writes to the database
 *
 * Fill in `your_price` (and optionally your_cost / stock_count / in_stock) in
 * pricing.csv, leaving rows you are not ready to price blank. Blank rows are
 * skipped, so you can price the catalogue in batches.
 *
 * A part with a price becomes sellable; one without stays "Price on request".
 */

import { readFileSync } from 'node:fs'

const APPLY = process.argv.includes('--apply')
const CSV = process.argv.find((a) => a.endsWith('.csv')) ?? 'pricing.csv'

// ── env ──────────────────────────────────────────────────────────────
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

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const KEY = env.SUPBASE_SECRET_KEY
if (!URL_BASE || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPBASE_SECRET_KEY in .env')
  process.exit(1)
}

// ── parse ────────────────────────────────────────────────────────────
function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((v) => v !== ''))
}

const rows = parseCsv(readFileSync(CSV, 'utf8'))
const header = rows.shift().map((h) => h.trim())
const col = (name) => header.indexOf(name)

const updates = []
const problems = []

for (const r of rows) {
  const sku = r[col('sku')]?.trim()
  if (!sku) continue

  const rawPrice = r[col('your_price')]?.trim()
  if (!rawPrice) continue // not priced yet — leave as "Price on request"

  const price = Number(rawPrice.replace(/[$,]/g, ''))
  if (!Number.isFinite(price) || price <= 0) {
    problems.push(`${sku}: price "${rawPrice}" is not a positive number`)
    continue
  }

  const rawCost = r[col('your_cost')]?.trim()
  const cost = rawCost ? Number(rawCost.replace(/[$,]/g, '')) : null
  if (rawCost && !Number.isFinite(cost)) {
    problems.push(`${sku}: cost "${rawCost}" is not a number`)
    continue
  }
  // Selling below cost is almost always a typo, so refuse rather than warn.
  if (cost !== null && cost > price) {
    problems.push(`${sku}: cost ${cost} exceeds price ${price} — refusing`)
    continue
  }

  const rawStock = r[col('stock_count')]?.trim()
  const stock = rawStock ? Number(rawStock) : null
  if (rawStock && (!Number.isInteger(stock) || stock < 0)) {
    problems.push(`${sku}: stock "${rawStock}" is not a whole number`)
    continue
  }

  const inStockCell = r[col('in_stock')]?.trim().toLowerCase()
  const inStock = inStockCell
    ? ['yes', 'y', 'true', '1'].includes(inStockCell)
    : stock !== null
      ? stock > 0
      : null

  const patch = { price, is_active: true }
  if (cost !== null) patch.cost = cost
  if (stock !== null) patch.stock_count = stock
  if (inStock !== null) patch.in_stock = inStock

  updates.push({ sku, patch })
}

if (problems.length) {
  console.error(`\n${problems.length} row(s) rejected:`)
  for (const p of problems) console.error('  ✗ ' + p)
}

if (!updates.length) {
  console.log('\nNothing to apply — fill in the your_price column first.')
  process.exit(problems.length ? 1 : 0)
}

console.log(`\n${updates.length} part(s) ready to price:`)
for (const u of updates.slice(0, 10)) {
  console.log(`  ${u.sku.padEnd(20)} $${u.patch.price.toFixed(2)}` +
    (u.patch.stock_count !== undefined ? `  stock ${u.patch.stock_count}` : ''))
}
if (updates.length > 10) console.log(`  … and ${updates.length - 10} more`)

if (!APPLY) {
  console.log('\nDry run. Re-run with --apply to write these to the database.')
  process.exit(0)
}

let ok = 0
for (const u of updates) {
  const res = await fetch(`${URL_BASE}/rest/v1/parts?sku=eq.${encodeURIComponent(u.sku)}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(u.patch),
  })
  if (res.ok) ok++
  else console.error(`  ✗ ${u.sku}: HTTP ${res.status} ${await res.text()}`)
}
console.log(`\nApplied ${ok}/${updates.length}.`)

// Final guard — an active part must never carry a zero price.
const check = await fetch(
  `${URL_BASE}/rest/v1/parts?select=sku&is_active=eq.true&price=eq.0`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
)
const unpriced = await check.json()
console.log(`${unpriced.length} active part(s) still unpriced — these show "Price on request".`)
