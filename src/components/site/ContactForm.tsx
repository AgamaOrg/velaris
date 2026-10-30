'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'

type Fields = {
  name: string
  email: string
  phone: string
  interest: string
  message: string
  consent: boolean
}

const initial: Fields = {
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
  consent: false,
}

export function ContactForm({
  locale,
  interests,
}: {
  locale: Locale
  interests: string[]
}) {
  const [fields, setFields] = useState<Fields>(initial)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const copy =
    locale === 'fil'
      ? {
          kicker: 'Pribadong pagtingin',
          title: 'Sabihin sa amin ang tungkol sa inyong paghahanap.',
          name: 'Pangalan',
          email: 'Email',
          phone: 'Telepono',
          interest: 'Uri ng tirahan',
          message: 'May nais ka bang idagdag?',
          consent:
            'Pumapayag akong makipag-ugnayan ang RHK Land tungkol sa aking tanong.',
          submit: 'Humiling ng pagtingin',
          required: 'Kailangan ang pangalan, email, at pahintulot.',
          thanks: 'Salamat.',
          thanksBody:
            'Makikipag-ugnayan sa inyo ang aming private client team sa loob ng isang araw ng trabaho upang kumpirmahin ang pagtingin.',
          again: 'Magpadala ng isa pang tanong',
          select: 'Pumili ng tirahan',
        }
      : {
          kicker: 'Private viewing',
          title: 'Tell us about the residence you are looking for.',
          name: 'Name',
          email: 'Email',
          phone: 'Telephone',
          interest: 'Residence of interest',
          message: 'Anything you would like us to know',
          consent:
            'I agree to be contacted by RHK Land about this enquiry.',
          submit: 'Request a private viewing',
          required: 'Name, email, and consent are required.',
          thanks: 'Thank you.',
          thanksBody:
            'A member of our private client team will contact you within one business day to confirm your viewing.',
          again: 'Send another enquiry',
          select: 'Select a residence',
        }

  const update = (key: keyof Fields, value: string | boolean) => {
    setFields((current) => ({ ...current, [key]: value }))
    if (error) setError('')
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!fields.name.trim() || !fields.email.trim() || !fields.consent) {
      setError(copy.required)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div
        className="border border-ink/15 bg-cream-deep p-8 md:p-12"
        aria-live="polite"
      >
        <p className="kicker mb-5 text-taupe">{copy.kicker}</p>
        <p className="display display-md">{copy.thanks}</p>
        <p className="body-editorial mt-5 max-w-md text-muted">
          {copy.thanksBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setFields(initial)
            setSent(false)
          }}
          className="btn btn-outline mt-8"
        >
          {copy.again}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-7" noValidate>
      <div>
        <p className="kicker mb-4 text-taupe">{copy.kicker}</p>
        <h2 className="display display-md text-balance">{copy.title}</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">{copy.name} *</span>
          <input
            className="field"
            value={fields.name}
            onChange={(event) => update('name', event.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className="block">
          <span className="field-label">{copy.email} *</span>
          <input
            className="field"
            type="email"
            value={fields.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="block">
          <span className="field-label">{copy.phone}</span>
          <input
            className="field"
            type="tel"
            value={fields.phone}
            onChange={(event) => update('phone', event.target.value)}
            autoComplete="tel"
          />
        </label>
        <label className="block">
          <span className="field-label">{copy.interest}</span>
          <select
            className="field"
            value={fields.interest}
            onChange={(event) => update('interest', event.target.value)}
          >
            <option value="">{copy.select}</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="field-label">{copy.message}</span>
        <textarea
          className="field min-h-28 resize-y"
          value={fields.message}
          onChange={(event) => update('message', event.target.value)}
          rows={4}
        />
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={fields.consent}
          onChange={(event) => update('consent', event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-sage"
          required
        />
        <span className="font-sans text-xs leading-relaxed text-muted">
          {copy.consent} *
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="border-l-2 border-taupe pl-3 font-sans text-xs text-taupe"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-ink w-full sm:w-auto">
        {copy.submit}
      </button>
    </form>
  )
}
