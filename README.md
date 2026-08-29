# AudiParts Direct

An e-commerce storefront and admin panel for genuine OEM and vetted aftermarket
**Audi** spare parts, with fitment guaranteed by year, model, and engine code.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4,
Supabase, Resend, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key>
SUPBASE_SECRET_KEY=<service-role key>   # server-side, bypasses RLS
RESEND_API_KEY=<resend key>

# Optional — both default to the audipartsdirect.com brand domain.
# FROM_EMAIL's domain must be verified in Resend before mail will send.
ADMIN_EMAIL=support@audipartsdirect.com
FROM_EMAIL=orders@audipartsdirect.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@audipartsdirect.com
```

## Database

Run the SQL files in the Supabase SQL editor, in order:

1. `supabase-schema.sql` — tables, RLS policies, and the base Audi catalogue seed
2. `audi-electrical-parts.sql` — A4 B9 (2016–2024) electrical parts and fitment
3. `assign-product-images.sql` — multi-image galleries for selected SKUs
4. `update-reviews-rls.sql` — review submission policy

## Design system

The palette is **"Anthracite & Titanium"** — deep anthracite structure, brushed
titanium metallics, and a single deep Audi red (`#a6192e`) reserved for
precision accents and calls to action. Tokens live in `app/globals.css` and are
exposed to Tailwind as `audi-anthracite`, `audi-graphite`, `audi-slate`,
`audi-steel`, `audi-titanium`, `audi-silver`, `audi-fog`, `audi-mist`,
`audi-red`, and `audi-success`.

Shared helpers in the same file:

- `.technical` — tabular monospace for part numbers, SKUs, and engine codes
- `.eyebrow` — small all-caps section label
- `.brushed-dark` / `.blueprint-grid` — the metallic and technical-grid surfaces

## Motion

Animation is centralised in `components/motion/`, which wraps Framer Motion in a
small vocabulary: `Reveal`, `Stagger` / `StaggerItem`, `HoverLift`, and
`CountUp`, all sharing one expo-out easing curve. `MotionProvider` sits in the
root layout with `reducedMotion="user"`, so every animation honours the
visitor's OS-level reduced-motion preference automatically.

## Project structure

```
app/(store)     storefront routes
app/admin       admin panel (products, categories, reviews)
app/api         admin REST handlers and search
components/     shared UI, motion primitives, email templates
lib/            data access, Supabase clients, brand constants, types
```

## Trademarks

AudiParts Direct is an independent parts retailer and is not affiliated with,
authorised by, or endorsed by AUDI AG. Audi®, quattro®, TFSI®, and TDI® are
registered trademarks of AUDI AG. OEM part numbers are cited for compatibility
reference only.
# audi-parts
