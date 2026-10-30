'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type SunPathProps = {
  value: number
  labels: string[]
  label: string
  onChange: (value: number) => void
}

export function SunPath({ value, labels, label, onChange }: SunPathProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const max = Math.max(0, labels.length - 1)

  const clamp = (next: number) => Math.min(max, Math.max(0, next))

  const setFromX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    onChange(clamp(Math.round(ratio * max)))
  }

  const point = (index: number) => {
    const t = max === 0 ? 0 : index / max
    return {
      left: `${t * 100}%`,
      top: `${((34 - 28 * Math.sin(Math.PI * t)) / 40) * 100}%`,
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(clamp(value - 1))
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(clamp(value + 1))
    }
    if (event.key === 'Home') {
      event.preventDefault()
      onChange(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      onChange(max)
    }
  }

  return (
    <div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={labels[value]}
        onPointerDown={(event) => {
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromX(event.clientX)
        }}
        onPointerMove={(event) => {
          if (dragging) setFromX(event.clientX)
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={onKeyDown}
        className={cn(
          'sun-path relative h-16 touch-none select-none outline-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M0 34 C 24 0, 76 0, 100 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.25"
          />
        </svg>

        {labels.map((item, index) => (
          <span
            key={item}
            aria-hidden="true"
            className={cn(
              'absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors',
              index === value ? 'bg-ink/40' : 'bg-ink/20',
            )}
            style={point(index)}
          />
        ))}

        <span
          aria-hidden="true"
          className="sun-dot absolute -translate-x-1/2 -translate-y-1/2"
          style={point(value)}
        />
      </div>

      <div className="mt-2 flex justify-between gap-2">
        {labels.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(index)}
            aria-pressed={index === value}
            className={cn(
              'font-sans text-[0.5625rem] uppercase tracking-[0.16em] transition-colors',
              index === value ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
