/**
 * The four-ring mark and the Audi Parts Sales wordmark.
 *
 * Drawn as a monoline SVG rather than an image so it stays crisp at every
 * size and inherits `currentColor` in both the light header and the dark
 * footer.
 */

export function RingsMark({ className = 'h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 108 32"
      fill="none"
      role="img"
      aria-label="Four rings"
      preserveAspectRatio="xMidYMid meet"
    >
      {[16, 40, 64, 88].map((cx) => (
        <circle
          key={cx}
          cx={cx}
          cy="16"
          r="13"
          stroke="currentColor"
          strokeWidth="3.25"
        />
      ))}
    </svg>
  )
}

interface WordmarkProps {
  /** `dark` inverts the wordmark for use on anthracite surfaces. */
  tone?: 'light' | 'dark'
  /** Compact drops "Sales" and shrinks the mark for narrow viewports. */
  compact?: boolean
  className?: string
}

export function Wordmark({ tone = 'light', compact = false, className = '' }: WordmarkProps) {
  const primary = tone === 'dark' ? 'text-white' : 'text-audi-anthracite'
  const secondary = tone === 'dark' ? 'text-audi-titanium' : 'text-audi-steel'

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <RingsMark className={`${compact ? 'h-3.5' : 'h-4'} ${primary} w-auto`} />
      <span className="flex items-baseline gap-1 leading-none">
        <span className={`font-bold tracking-tight ${primary} ${compact ? 'text-sm' : 'text-[15px]'}`}>
          Audi <span className="text-audi-red">Parts</span>
        </span>
        {!compact && (
          <span className={`eyebrow ${secondary} text-[9px]`}>Sales</span>
        )}
      </span>
    </span>
  )
}
