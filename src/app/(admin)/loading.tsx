'use client'

import Image from 'next/image'

export default function AdminLoading() {
  return (
    <main className="admin-loading" aria-busy="true" aria-live="polite">
      <div className="admin-loading__content">
        <Image
          src="/dummy_pics/Frame.svg"
          alt=""
          width={58}
          height={104}
          priority
          className="admin-loading__mark brightness-0 invert"
        />
        <div className="admin-loading__wordmark">
          <p>THE VELARIS</p>
          <span>RESIDENCES</span>
        </div>
        <div className="admin-loading__line" />
        <p className="admin-loading__label">Preparing your workspace</p>
      </div>
    </main>
  )
}
