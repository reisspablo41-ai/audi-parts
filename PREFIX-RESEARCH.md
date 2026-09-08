# OE prefix research — the 19 parts the prefix tables did not cover

`scripts/build-fitment.mjs` derives fitment from each part's OE number prefix.
Its two tables (chassis prefixes, engine-family prefixes) covered 241 of the
260 parts. These are the sources used to resolve the remaining 19.

| Prefix | Parts | Resolved to | Confidence | Evidence |
|---|---|---|---|---|
| `4J3` | 2 alloy wheels | **Audi e-tron GT**, 2021–2026 | Confirmed | `4J3 601 025 L / M / AC / AN` listed as "2022-2024 Audi e-tron GT" by four independent OE retailers (Audi Parts Store, AudiUSAParts, GenuineAudiParts, getAudiparts). |
| `0P2` | 2 timing chains, 1 cam adjuster | **4.0 TFSI V8** — RS6 C8, RS7 C8, S8 D5, SQ8 4M, 2020–2025 | Confirmed | `0P2 109 229 J` and `0P2 109 450 F` listed with those applications on OEM Parts Online and AudiUSAParts. |
| `0AT` | 1 transmission filter | **Q7 (V6, ZF 6-speed auto)** | Confirmed | `0AT 325 429` sold by ECS Tuning as the Q7 V6 6-speed automatic filter; cross-referenced as Febi 176671 / ZF. |
| `95C` | 1 rear brake disc | **Porsche Macan Electric**, 2024–2026 | Confirmed | Porsche's `95C` is the EV Macan (`95B` is the combustion car) — Porsche OE listings, e.g. console panel `95C 862 841 J`. |
| `8MA` | 10 (wheels, brake discs, bump stop) | **Audi A5 B10**, 2024–2026 | **Inferred** | `8MA 615 601` exists in OE catalogues but no retailer names the model. `8M` is the type code of the 2024+ A5 that replaced the A4, and the `<type>A` suffix matches the modern pattern (`80A` = Q5 FY, `4KE` = A6 C8). All ten are chassis parts for one recent platform, which is consistent. Not confirmed. |
| `4P0` | 1 alloy wheel | *unidentified* | **None** | `4P0 601 025 J` / `4P0 601 025 F` are listed by OE retailers and ECS Tuning, but none state the model. Listed range-wide by the `--broad` fallback and flagged in `part_fitment.notes`. |

## Two vehicle lines were added

`4J3` and `95C` pointed at cars the hierarchy had no rows for, so
`build-fitment.mjs` creates them before deriving fitment:

- `etron-gt` / `etron-gt-j1` — Audi e-tron GT J1, 2021–2026 (6 vehicles)
- `macan` / `macan-95c` — Porsche Macan Electric 95C, 2024–2026 (3 vehicles)

## Caveat

Fitment is asserted at **generation** level from the part number. It is not
engine-code verified, so every row is written `is_verified = false`. The `8MA`
and `4P0` rows are the weakest and carry an explanatory `notes` value. Confirm
against ETKA before relying on any of this for a sale.

## Why the SQL route failed

`seed-fitment.sql` is a single ~3,900-row `INSERT`. Run through the Supabase SQL
editor it left only 431 rows covering 29 of 260 parts behind, so the model/year
filter returned almost nothing. `scripts/build-fitment.mjs` supersedes it: it
writes through the REST API in batches of 500, inserts only pairs that are
missing (so re-running is a no-op), and reports coverage at the end.

    node scripts/build-fitment.mjs --dry     # report, write nothing
    node scripts/build-fitment.mjs --broad   # + range-wide fallback for 4P0

## The 1000-row cap it exposed

Filling `part_fitment` from 431 to 7,064 rows pushed it past PostgREST's
per-response cap of 1000 rows. PostgREST truncates silently — no error — so two
unpaginated selects in `lib/services/store-service.ts` started losing data:

- `getFitmentOptions()` saw only the first 1000 fitment rows, so most
  generations looked like they had no parts and **every model except the A1 and
  A3 was dropped from the homepage picker**.
- `getStoreParts()`'s model branch built its SKU list from a truncated page, so
  a popular model would silently omit parts from the results.

Both now go through an `allRows()` helper that pages until short. Any future
`select()` over a table that can exceed 1000 rows needs the same treatment.
