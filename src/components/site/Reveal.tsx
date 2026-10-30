'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type RevealVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'clip'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', `reveal--${variant}`, shown && 'is-shown', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
