'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { CircleMarker, Map as LeafletMap } from 'leaflet'
import type { Locale } from '@/lib/i18n'

const BRIDGETOWNE = { lat: 14.6068, lng: 121.0854 }

const copy = {
  en: {
    label: 'The Velaris — Bridgetowne',
    note: 'Bridgetowne Boulevard, Quezon City',
    directions: 'Get directions',
    aria: 'Map of Bridgetowne, Quezon City, showing the location of The Velaris',
  },
  fil: {
    label: 'The Velaris — Bridgetowne',
    note: 'Bridgetowne Boulevard, Quezon City',
    directions: 'Humingi ng direksyon',
    aria: 'Mapa ng Bridgetowne, Quezon City, na nagpapakita ng lokasyon ng The Velaris',
  },
} satisfies Record<Locale, Record<string, string>>

export function DistrictMap({ locale }: { locale: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const t = copy[locale]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    let map: LeafletMap | null = null
    let marker: CircleMarker | null = null

    import('leaflet').then(({ default: L }) => {
      if (cancelled || !el) return

      map = L.map(el, {
        center: [BRIDGETOWNE.lat, BRIDGETOWNE.lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(map)

      marker = L.circleMarker([BRIDGETOWNE.lat, BRIDGETOWNE.lng], {
        radius: 9,
        color: '#f8ede0',
        weight: 3,
        fillColor: '#14110e',
        fillOpacity: 1,
      }).addTo(map)

      marker
        .bindPopup(
          `<strong>${t.label}</strong><br/>${t.note}<br/><a href="https://www.openstreetmap.org/?mlat=${BRIDGETOWNE.lat}&mlon=${BRIDGETOWNE.lng}#map=16/${BRIDGETOWNE.lat}/${BRIDGETOWNE.lng}" target="_blank" rel="noreferrer">${t.directions}</a>`,
        )
        .openPopup()

      window.requestAnimationFrame(() => map?.invalidateSize())
    })

    return () => {
      cancelled = true
      marker?.remove()
      map?.remove()
      map = null
      marker = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={t.aria}
      className="district-map h-full w-full"
    />
  )
}
