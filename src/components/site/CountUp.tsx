'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type Parts = {
  prefix: string
  target: number
  suffix: string
  pad: number
}

function parse(value: string): Parts | null {
  const match = value.match(/^(\D*?)(\d[\d,]*)(\D*)$/)
  if (!match) return null

  const [, prefix, raw, suffix] = match
  const digits = raw.replace(/,/g, '')

  return {
    prefix,
    target: Number(digits),
    suffix,
    pad: digits.startsWith('0') ? digits.length : 0,
  }
}

function format(parts: Parts, value: number): string {
  const rounded = Math.round(value).toString()
  const padded = parts.pad ? rounded.padStart(parts.pad, '0') : rounded
  return `${parts.prefix}${padded}${parts.suffix}`
}

export function CountUp({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const node = ref.current
    const parts = parse(value)
    if (!node || !parts) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let frame = 0
    let started = false

    const run = () => {
      const duration = 1600
      const start = performance.now()

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setDisplay(format(parts, parts.target * eased))

        if (progress < 1) frame = window.requestAnimationFrame(tick)
      }

      frame = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue
          started = true
          setDisplay(format(parts, 0))
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={value}>
      {display}
    </span>
  )
}
