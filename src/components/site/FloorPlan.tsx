import { cn } from '@/lib/cn'

type FloorPlanProps = {
  variant: 'a' | 'b' | 'c'
  className?: string
  compact?: boolean
  label?: string
}

export function FloorPlan({ variant, className, compact, label }: FloorPlanProps) {
  return (
    <svg
      viewBox="0 0 420 320"
      role="img"
      aria-label={label ?? 'Indicative floor plan'}
      className={cn('h-auto w-full', className)}
      fill="none"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {variant === 'a' ? (
          <>
            <rect x="20" y="20" width="380" height="280" />
            <path d="M20 62h380M250 62v198M250 180h150M150 200v100M20 200h130" />
            <path d="M20 62h380" strokeDasharray="2 5" opacity="0.5" />
            <path d="M20 62h380" opacity="0" />
            <path d="M72 62v-0M40 62v-0" />
            <rect x="20" y="20" width="380" height="42" fill="currentColor" opacity="0.06" stroke="none" />
            <path d="M260 62v0M250 90h12M250 250h12M150 230v12M60 200v12" />
          </>
        ) : null}

        {variant === 'b' ? (
          <>
            <rect x="20" y="20" width="380" height="280" />
            <path d="M140 20v180M300 20v240M140 180h160M300 160h100M20 260h380" />
            <rect x="20" y="260" width="380" height="40" fill="currentColor" opacity="0.06" stroke="none" />
            <path d="M140 110h12M140 210h12M300 110h12M300 200h12" />
          </>
        ) : null}

        {variant === 'c' ? (
          <>
            <rect x="20" y="20" width="380" height="280" />
            <path d="M220 20v280M320 20v280M220 180h100M320 220h80" />
            <rect x="320" y="20" width="80" height="280" fill="currentColor" opacity="0.06" stroke="none" />
            <path d="M230 180h0M320 120h12M220 130h12M120 180h12M220 250h12" />
            <path d="M340 60c8 6 12 16 12 26M356 54c10 8 16 20 16 32" opacity="0.55" />
          </>
        ) : null}

        <path d="M20 20h380v280H20z" strokeWidth="1.8" />
      </g>

      {compact ? null : (
        <g
          fill="currentColor"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="7"
          letterSpacing="1.6"
          opacity="0.62"
        >
          {variant === 'a' ? (
            <>
              <text x="108" y="134">LIVING</text>
              <text x="304" y="122">BEDROOM</text>
              <text x="304" y="224">BATH</text>
              <text x="60" y="252">KITCHEN</text>
              <text x="168" y="252">ENTRY</text>
              <text x="186" y="45">BALCONY</text>
            </>
          ) : null}
          {variant === 'b' ? (
            <>
              <text x="160" y="150">LIVING</text>
              <text x="46" y="112">BEDROOM</text>
              <text x="46" y="224">BEDROOM</text>
              <text x="330" y="100">KITCHEN</text>
              <text x="338" y="216">BATH</text>
              <text x="186" y="285">BALCONY</text>
            </>
          ) : null}
          {variant === 'c' ? (
            <>
              <text x="76" y="112">LIVING</text>
              <text x="76" y="242">BEDROOM</text>
              <text x="238" y="96">DINING</text>
              <text x="232" y="206">BATH</text>
              <text x="238" y="262">ENTRY</text>
              <text x="336" y="164">GARDEN</text>
            </>
          ) : null}
        </g>
      )}
    </svg>
  )
}
