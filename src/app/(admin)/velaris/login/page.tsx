import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function signIn(formData: FormData) {
  'use server'

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/velaris/login?error=invalid_credentials')
  }

  redirect('/velaris')
}

export default async function VelarisLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101713] text-[#f8ede0]">
      <div className="admin-drift absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#43544b]/30 blur-3xl" />
      <div className="admin-drift absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-[#876f53]/20 blur-3xl [animation-delay:-5s]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] overflow-hidden opacity-20 lg:block">
        <Image
          src="/dummy_pics/villa-features-1024x690.jpg"
          alt=""
          fill
          priority
          sizes="38vw"
          className="object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101713] via-[#101713]/60 to-transparent" />
        <div className="absolute inset-0 bg-[#43544b]/30 mix-blend-multiply" />
      </div>
      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_0.85fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex xl:p-16">
          <div className="admin-rise flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70" aria-label="Return to The Velaris Residences website">
              <Image src="/dummy_pics/Frame.svg" alt="" width={42} height={76} className="h-12 w-auto brightness-0 invert" />
              <div>
                <p className="font-serif text-xl tracking-[0.12em]">THE VELARIS</p>
                <p className="mt-1 font-sans text-[0.5rem] tracking-[0.35em] text-[#f8ede0]/50">RESIDENCES</p>
              </div>
            </Link>
            <Link href="/" className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#f8ede0]/45 transition-colors hover:text-[#f8ede0]">
              Visit website <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="admin-rise max-w-lg pb-8 [animation-delay:180ms]">
            <p className="mb-6 font-sans text-[0.65rem] uppercase tracking-[0.32em] text-[#f8ede0]/45">Team access</p>
            <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.03em] text-[#f8ede0] xl:text-7xl">
              The work behind the address.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#f8ede0]/60">
              A considered workspace for the people who shape every Velaris detail.
            </p>
          </div>
          <p className="admin-fade font-sans text-xs text-[#f8ede0]/35 [animation-delay:700ms]">BRIDGETOWNE · QUEZON CITY</p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <form action={signIn} className="admin-rise w-full max-w-md rounded-[2rem] border border-[#f8ede0]/10 bg-[#f8ede0]/[0.06] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-9 lg:hidden">
              <Link href="/" className="font-serif text-xl tracking-[0.12em] transition-opacity hover:opacity-70">THE VELARIS</Link>
              <p className="mt-1 font-sans text-[0.5rem] tracking-[0.35em] text-[#f8ede0]/45">RESIDENCES</p>
            </div>
            <div className="admin-rise [animation-delay:120ms]">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-[#f8ede0]/45">Team access</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em]">Enter the workspace</h2>
              <p className="mt-3 text-sm leading-6 text-[#f8ede0]/55">Sign in with your authorized Velaris account.</p>
            </div>
            {params.error && (
              <p role="alert" className="mt-6 rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-200">
                We couldn’t sign you in. Check your details and try again.
              </p>
            )}
            <div className="admin-rise mt-8 space-y-5 [animation-delay:240ms]">
              <label className="block space-y-2 font-sans text-xs uppercase tracking-[0.16em] text-[#f8ede0]/55">
                <span>Email address</span>
                <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="w-full rounded-xl border border-[#f8ede0]/15 bg-[#101713]/70 px-4 py-3.5 text-base normal-case tracking-normal text-[#f8ede0] outline-none placeholder:text-[#f8ede0]/25 focus:border-[#f8ede0]/55 focus:ring-2 focus:ring-[#f8ede0]/10" />
              </label>
              <label className="block space-y-2 font-sans text-xs uppercase tracking-[0.16em] text-[#f8ede0]/55">
                <span>Password</span>
                <input name="password" type="password" required autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-xl border border-[#f8ede0]/15 bg-[#101713]/70 px-4 py-3.5 text-base normal-case tracking-normal text-[#f8ede0] outline-none placeholder:text-[#f8ede0]/25 focus:border-[#f8ede0]/55 focus:ring-2 focus:ring-[#f8ede0]/10" />
              </label>
            </div>
            <button type="submit" className="admin-rise mt-8 flex w-full items-center justify-center rounded-xl bg-[#f8ede0] px-4 py-3.5 font-sans text-sm font-semibold text-[#101713] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#f8ede0] focus:ring-offset-2 focus:ring-offset-[#101713] [animation-delay:360ms]">
              Continue to dashboard
              <span aria-hidden="true" className="ml-3 text-base">→</span>
            </button>
            <p className="mt-7 text-center font-sans text-xs leading-5 text-[#f8ede0]/35">
              Access is restricted to authorized team members.
            </p>
            <p className="mt-4 text-center font-sans text-xs text-[#f8ede0]/40">
              Need access?{' '}
              <a href="mailto:residences@thevelarisresidences.com" className="text-[#f8ede0]/70 underline decoration-[#f8ede0]/25 underline-offset-4 transition hover:text-[#f8ede0]">
                Contact the team
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
