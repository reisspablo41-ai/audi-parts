#!/usr/bin/env node
/**
 * Check that Resend is configured well enough to deliver admin mail.
 *
 *   node scripts/check-email.mjs           # config + key + domain checks only
 *   node scripts/check-email.mjs --send    # also sends a real test email
 *
 * The contact form, newsletter signup and checkout all notify ADMIN_EMAIL via
 * Resend. Three things have to line up or mail silently fails: the API key has
 * to be valid, ADMIN_EMAIL has to be a real inbox, and the DOMAIN of
 * FROM_EMAIL has to be verified in Resend. The last one is the usual culprit —
 * a send from an unverified domain is rejected by the API, and the server
 * actions swallow that in a try/catch, so the site just reports a generic
 * failure with nothing in the UI to say why.
 */

import { readFileSync } from 'node:fs'

const SEND = process.argv.includes('--send')

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

const KEY = env.RESEND_API_KEY
const ADMIN = env.ADMIN_EMAIL
const FROM = env.FROM_EMAIL

let failed = false
const ok = (m) => console.log(`  ok    ${m}`)
const bad = (m) => {
  failed = true
  console.log(`  FAIL  ${m}`)
}
const warn = (m) => console.log(`  warn  ${m}`)

console.log('\nResend configuration\n')

if (!KEY) bad('RESEND_API_KEY is empty in .env — paste your key from https://resend.com/api-keys')
else if (!KEY.startsWith('re_')) warn(`RESEND_API_KEY does not start with "re_" (got "${KEY.slice(0, 4)}…")`)
else ok(`RESEND_API_KEY present (${KEY.slice(0, 6)}…)`)

if (!ADMIN) bad('ADMIN_EMAIL is not set — admin notifications have nowhere to go')
else ok(`ADMIN_EMAIL  ${ADMIN}`)

if (!FROM) bad('FROM_EMAIL is not set')
else ok(`FROM_EMAIL   ${FROM}`)

if (!KEY || !ADMIN || !FROM) {
  console.log('\nFix the above, then re-run.\n')
  process.exit(1)
}

const auth = { Authorization: `Bearer ${KEY}` }

// ── key validity + domain verification ───────────────────────────────
console.log('\nResend account\n')

const res = await fetch('https://api.resend.com/domains', { headers: auth })

if (res.status === 401 || res.status === 403) {
  bad(`API key rejected (HTTP ${res.status}). Check the key is current and not revoked.`)
  process.exit(1)
}
if (!res.ok) {
  bad(`Could not reach the Resend API (HTTP ${res.status}): ${(await res.text()).slice(0, 200)}`)
  process.exit(1)
}

ok('API key accepted')

const domains = (await res.json()).data ?? []
const fromDomain = FROM.split('@')[1]?.toLowerCase()
const match = domains.find((d) => d.name?.toLowerCase() === fromDomain)

if (domains.length === 0) {
  bad(`No domains registered in Resend. Add and verify "${fromDomain}" at https://resend.com/domains`)
} else if (!match) {
  bad(
    `FROM_EMAIL uses "${fromDomain}", which is not in this Resend account. ` +
      `Registered: ${domains.map((d) => `${d.name} (${d.status})`).join(', ')}`,
  )
} else if (match.status !== 'verified') {
  bad(`Domain "${fromDomain}" is registered but status is "${match.status}" — finish DNS verification.`)
} else {
  ok(`Sending domain "${fromDomain}" is verified`)
}

// ── optional live send ───────────────────────────────────────────────
if (SEND && !failed) {
  console.log('\nTest send\n')
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: ADMIN,
      subject: 'Resend test — AudiParts admin forwarding',
      text:
        'If you are reading this, contact-form enquiries, newsletter signups and ' +
        'order notifications will reach this inbox.\n\n' +
        `from: ${FROM}\nto:   ${ADMIN}\nsent: ${new Date().toISOString()}\n`,
    }),
  })
  const body = await r.json().catch(() => ({}))
  if (r.ok) ok(`sent to ${ADMIN} (id ${body.id}) — check the inbox, and spam`)
  else bad(`send rejected (HTTP ${r.status}): ${body.message ?? JSON.stringify(body).slice(0, 200)}`)
} else if (!SEND) {
  console.log('\nRe-run with --send to deliver a real test email.')
}

console.log(failed ? '\nNot ready.\n' : '\nReady.\n')
process.exit(failed ? 1 : 0)
