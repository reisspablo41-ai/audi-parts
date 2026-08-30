/**
 * Monoline SVG icons for the eight part categories.
 *
 * Replaces the emoji glyphs the catalogue previously rendered — emoji vary
 * wildly between platforms and read as informal next to the rest of the
 * brand. Categories still carry an `icon` emoji from the database, so
 * anything without a drawn icon falls back to it.
 */

const S = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const PATHS: Record<string, React.ReactNode> = {
  // Funnel with a cartridge body — filters
  filters: (
    <>
      <path {...S} d="M3.4 4.6h17.2l-6.5 7.6v6.4l-4.2 2.4v-8.8z" />
    </>
  ),
  // Spark plug — ignition
  ignition: (
    <>
      <path {...S} d="M10 2.8h4v4.4h-4zM10.6 7.2h2.8v5.2h-2.8zM11.2 12.4h1.6v3.4l-1.8 5.4" />
      <path {...S} d="M9.2 8.9h5.6M9.2 10.6h5.6" />
    </>
  ),
  // Turbine wheel — induction
  induction: (
    <>
      <circle cx="12" cy="12" r="3" {...S} />
      <path {...S} d="M12 9V4.2M15 12h4.8M12 15v4.8M9 12H4.2" />
      <path {...S} d="M14.1 9.9l3-3M14.1 14.1l3 3M9.9 14.1l-3 3M9.9 9.9l-3-3" />
    </>
  ),
  // Tyre with rim — wheels
  wheels: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <circle cx="12" cy="12" r="4.4" {...S} />
      <path {...S} d="M12 3.4v4.2M12 16.4v4.2M20.6 12h-4.2M7.6 12H3.4" />
    </>
  ),
  // Front bumper valance — bumpers
  bumpers: (
    <>
      <path {...S} d="M3 13.4c0-2 .9-3.6 2.2-3.6h13.6c1.3 0 2.2 1.6 2.2 3.6v2.4H3z" />
      <path {...S} d="M3 15.8v2.4M21 15.8v2.4M7.4 12.6h9.2" />
    </>
  ),
  // Headlamp with beam — lighting
  lighting: (
    <>
      <path {...S} d="M3.6 8.6h6.2a5 5 0 0 1 0 6.8H3.6a1 1 0 0 1-1-1V9.6a1 1 0 0 1 1-1z" />
      <path {...S} d="M14.6 9.4h2.8M14.6 12h4.2M14.6 14.6h2.8" />
    </>
  ),
  // Cog — engine
  engine: (
    <>
      <circle cx="12" cy="12" r="3.2" {...S} />
      <path
        {...S}
        d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
      />
    </>
  ),
  // Gear pair — transmission
  transmission: (
    <>
      <circle cx="8.5" cy="8.5" r="4.2" {...S} />
      <circle cx="16" cy="16" r="3.4" {...S} />
      <path {...S} d="M8.5 2.6v1.7M8.5 12.7v1.6M14.4 8.5h-1.7M4.3 8.5H2.6M16 11.4v1.2M16 19.4v1.2M20.4 16h-1.2M13.2 16H12" />
    </>
  ),
  // Coil spring + damper — suspension
  suspension: (
    <>
      <path {...S} d="M9 3h6M9 21h6" />
      <path {...S} d="M9 6h6l-6 2.6h6l-6 2.6h6l-6 2.6h6L9 16.4h6" />
    </>
  ),
  // Slotted disc — brakes
  brakes: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <circle cx="12" cy="12" r="3.1" {...S} />
      <path {...S} d="M12 3.4v2.3M12 18.3v2.3M20.6 12h-2.3M5.7 12H3.4" />
    </>
  ),
  // Bolt — electrical
  electrical: <path {...S} d="M13.4 2.6 5.2 13.4h5.6l-1.2 8 8.2-10.8h-5.6z" />,
  // Car silhouette — body
  body: (
    <>
      <path {...S} d="M3 14.6v3.1h2.2M21 14.6v3.1h-2.2M3 14.6l1.9-5a2 2 0 0 1 1.9-1.3h10.4a2 2 0 0 1 1.9 1.3l1.9 5" />
      <path {...S} d="M3 14.6h18" />
      <circle cx="7.2" cy="17.7" r="1.7" {...S} />
      <circle cx="16.8" cy="17.7" r="1.7" {...S} />
    </>
  ),
  // Thermometer + fins — cooling
  cooling: (
    <>
      <path {...S} d="M13.6 13.8V5.2a2 2 0 1 0-4 0v8.6a4 4 0 1 0 4 0z" />
      <path {...S} d="M17.4 7h3.2M17.4 11h3.2M17.4 15h3.2" />
    </>
  ),
  // Fuel pump — fuel
  fuel: (
    <>
      <path {...S} d="M4.4 20.4h9.4V5.2a1.6 1.6 0 0 0-1.6-1.6H6a1.6 1.6 0 0 0-1.6 1.6z" />
      <path {...S} d="M4.4 10.2h9.4M13.8 8.4h3.2a1.6 1.6 0 0 1 1.6 1.6v6.2a1.6 1.6 0 0 0 1.6 1.6" />
      <path {...S} d="M3 20.4h12.2" />
    </>
  ),
}

interface CategoryIconProps {
  categoryId: string
  className?: string
  /**
   * Icon key from the database `icon` column. In the v2 taxonomy this names an
   * icon ('electrical', 'engine') rather than holding an emoji, and it is the
   * preferred lookup: leaf categories like 'headlights' have no drawn icon of
   * their own but do inherit one from their parent via this field.
   */
  fallback?: string
}

/** Neutral mark for anything with no icon of its own — never raw text. */
const GENERIC = (
  <>
    <circle cx="12" cy="12" r="3.2" {...S} />
    <path {...S} d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3" />
  </>
)

export default function CategoryIcon({
  categoryId,
  className = 'w-6 h-6',
  fallback,
}: CategoryIconProps) {
  // Prefer the explicit icon key, then the category id, then the generic mark.
  // Rendering `fallback` as text was the old behaviour and produced labels like
  // "electricalHeadlights" once `icon` stopped holding emoji.
  const path =
    (fallback && PATHS[fallback]) ?? PATHS[categoryId] ?? GENERIC

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      {path}
    </svg>
  )
}
