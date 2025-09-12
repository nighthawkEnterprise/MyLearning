'use client'
import React, { useState } from 'react'
import {
  Search,
  FileBadge,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  Clock,
  Building2,
  GraduationCap,
  Wrench,
  Bolt,
  Stethoscope,
  HardHat,
  Server,
  ArrowRight,
  Users,
  Globe
} from 'lucide-react'

// Utility to concat classes
const cx = (...cls) => cls.filter(Boolean).join(' ')

// Streamward brand tokens
const brand = {
  text600: 'text-orange-600',
  text700: 'text-orange-700',
  bg600: 'bg-orange-600',
  hoverBg500: 'hover:bg-orange-500',
  bg50: 'bg-orange-50',
  border200: 'border-orange-200',
  topGrad: 'bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200',
}

export default function StreamwardComplianceLanding() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('')

  const onSearch = (e) => {
    if (e) e.preventDefault()
    if (!query && !state) return
    // Replace with your router push
    console.log('Search certifications', { query, state })
  }

  const year = new Date().getFullYear()

  const popular = [
    {
      title: 'Plumbing License',
      icon: Wrench,
      bullets: ['Journeyman and Master prep', 'Hands on modules', 'Exam readiness checks'],
      href: '#',
    },
    {
      title: 'PMP Certification',
      icon: ClipboardList,
      bullets: ['PMI aligned curriculum', 'Scenario practice', '35 contact hours'],
      href: '#',
    },
    {
      title: 'Electrical License',
      icon: Bolt,
      bullets: ['NEC focused lessons', 'Safety and code updates', 'Practice exams'],
      href: '#',
    },
    {
      title: 'Healthcare CEU',
      icon: Stethoscope,
      bullets: ['CE tracking', 'HIPAA modules', 'Role based content'],
      href: '#',
    },
    {
      title: 'Construction Safety',
      icon: HardHat,
      bullets: ['OSHA 10 and 30', 'Incident reporting', 'Jobsite toolbox talks'],
      href: '#',
    },
    {
      title: 'IT and Cybersecurity',
      icon: Server,
      bullets: ['Security awareness', 'SOC2 mapped', 'Phishing simulations'],
      href: '#',
    },
  ]

  const features = [
    { title: 'Verified identity', icon: ShieldCheck, desc: 'ID and face match so each credential is trusted.' },
    { title: 'Automated reminders', icon: Clock, desc: 'Renewals and expirations tracked with alerts.' },
    { title: 'Course library', icon: GraduationCap, desc: 'Industry content that meets local rules.' },
    { title: 'Evidence wallet', icon: FileBadge, desc: 'Store cards, CEUs, and proof in one place.' },
    { title: 'Team dashboards', icon: Users, desc: 'Manager views with exportable reports.' },
    { title: 'HRIS and SSO', icon: Building2, desc: 'Okta, Workday, and more for simple rollout.' },
  ]

  const steps = [
    { step: '1', title: 'Pick a track', desc: 'Choose a license or certification for your role and location.' },
    { step: '2', title: 'Train and practice', desc: 'Complete short modules and practice exams that adapt to you.' },
    { step: '3', title: 'Verify and schedule', desc: 'Identity check, paperwork, and exam scheduling in one flow.' },
    { step: '4', title: 'Earn and share', desc: 'Get a digital certificate and share it with employers instantly.' },
  ]

  return (
    <div className={cx('min-h-screen bg-neutral-50 text-neutral-900 selection:bg-orange-200/60')}>
      {/* Top gradient accent */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className={cx('mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl', brand.topGrad)} />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <img
              src="/streamward.png"
              alt="Streamward"
              className="inline-block h-7 w-auto align-middle sm:h-8"
            />
          </a>

          <ul className="hidden items-center gap-6 text-sm text-neutral-700 md:flex">
            <li><a href="#catalog" className="hover:text-neutral-900">Catalog</a></li>
            <li><a href="#how" className="hover:text-neutral-900">How it works</a></li>
            <li><a href="#features" className="hover:text-neutral-900">Features</a></li>
            <li><a href="#customers" className="hover:text-neutral-900">Customers</a></li>
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/auth/login?returnTo=/protected" className="text-sm text-neutral-700 hover:text-neutral-900">Login</a>
            <a href="#get-started" className={cx('inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm transition', brand.bg600, brand.hoverBg500)}>
              Get started
            </a>
          </div>

          <button aria-label="Open menu" className="md:hidden inline-flex items-center justify-center rounded-xl border border-neutral-200 p-2.5 text-neutral-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-2 md:gap-12 md:px-6 md:pt-12">
          <div>
            <div className={cx('mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border', brand.border200, brand.text600, brand.bg50)}>
              Workforce certifications made simple
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Stay compliant and job ready
            </h1>
            <p className="mt-4 max-w-xl text-neutral-600 md:text-lg">
              Streamward helps teams and workers earn and maintain credentials across trades and professions. From plumbing licenses to PMP we guide you end to end.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#catalog" className={cx('inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition', brand.bg600, brand.hoverBg500)}>
                Browse certifications <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#demo" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                Request a demo
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                No credit card required
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                Cancel anytime
              </li>
            </ul>
          </div>

          {/* Search card */}
          <div className="relative">
            <div className="relative rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold">Find certification requirements</h2>
              <p className="mt-1 text-sm text-neutral-600">Search by name and filter by state to see training and exam steps.</p>

              <form onSubmit={onSearch} className="mt-4 space-y-3">
                <label htmlFor="q" className="sr-only">Certification</label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2">
                  <Search className={cx('h-5 w-5 shrink-0', brand.text600)} />
                  <input
                    id="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try Plumbing, PMP, OSHA 30..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-neutral-200 bg-white p-2">
                    <label htmlFor="state" className="block text-xs text-neutral-500">State</label>
                    <select id="state" value={state} onChange={(e) => setState(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none">
                      <option value="">All states</option>
                      <option>California</option>
                      <option>Florida</option>
                      <option>New York</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className={cx('inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white', brand.bg600, brand.hoverBg500)}
                  >
                    Search
                  </button>
                </div>

                {/* Quick chips */}
                <div className="pt-1 text-xs text-neutral-500">Popular:
                  <button type="button" className={cx('ml-2 rounded-full border px-2.5 py-1', brand.border200)} onClick={() => setQuery('PMP')}>
                    PMP
                  </button>
                  <button type="button" className={cx('ml-2 rounded-full border px-2.5 py-1', brand.border200)} onClick={() => setQuery('Plumbing')}>Plumbing</button>
                  <button type="button" className={cx('ml-2 rounded-full border px-2.5 py-1', brand.border200)} onClick={() => setQuery('OSHA 30')}>OSHA 30</button>
                </div>
              </form>

              {/* Small proof card */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
                <div className={cx('flex h-10 w-10 items-center justify-center rounded-xl bg-current bg-opacity-10', brand.text600)}>
                  <FileBadge className={cx('h-5 w-5', brand.text600)} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Example</div>
                  <div className="font-semibold">Digital certificate ready to share</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by
        <section aria-label="Trusted by" className="relative z-10 border-t border-neutral-200/60 bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
            <p className="mb-6 text-center text-sm text-neutral-500">Trusted by training providers and employers</p>
            <div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-28 rounded-md bg-neutral-200" />
              ))}
            </div>
          </div>
        </section> */}

        {/* Catalog */}
        <section id="catalog" className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className={cx('mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border', brand.border200, brand.text600, brand.bg50)}>Popular tracks</div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Certifications for modern work</h2>
              <p className="mt-3 text-neutral-600">Pick a path and complete training that meets local compliance.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {popular.map((p, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className={cx('mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl', brand.bg50)}>
                    <p.icon className={cx('h-5 w-5', brand.text600)} />
                  </div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className={cx('h-1.5 w-1.5 rounded-full', 'bg-orange-500')} /> {b}
                      </li>
                    ))}
                  </ul>
                  <a href={p.href} className={cx('mt-5 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white', brand.bg600, brand.hoverBg500)}>Explore</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative z-10 bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How Streamward works</h2>
                <p className="mt-3 text-neutral-600">Everything from training to proof inside one platform.</p>
                <a href="#features" className={cx('mt-6 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white', brand.bg600, brand.hoverBg500)}>See features</a>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {steps.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <div className={cx('mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl', brand.bg50)}>
                      <span className={cx('text-sm font-semibold', brand.text700)}>{s.step}</span>
                    </div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-neutral-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className={cx('mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl', brand.bg50)}>
                    <f.icon className={cx('h-5 w-5', brand.text600)} />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-600">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Integrations banner */}
            <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className={cx('flex h-10 w-10 items-center justify-center rounded-xl bg-current bg-opacity-10', brand.text600)}>
                    <Globe className={cx('h-5 w-5', brand.text600)} />
                  </div>
                  <div>
                    <div className="text-base font-semibold">Works with your stack</div>
                    <div className="text-xs text-neutral-500">Okta SSO, HRIS sync, and CSV exports for audits</div>
                  </div>
                </div>
                <a href="#demo" className={cx('inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white', brand.bg600, brand.hoverBg500)}>View integrations</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section id="get-started" className="relative z-10 pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-12">
              <div className={cx('absolute -right-20 -top-16 h-64 w-64 rounded-full blur-2xl bg-current bg-opacity-10', brand.text600)} />
              <h3 className="text-2xl font-semibold md:text-3xl">Ready to simplify compliance</h3>
              <p className="mt-2 max-w-2xl text-neutral-600">Launch Streamward across your workforce or enroll as an individual and keep every credential current.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="/auth/login?returnTo=/dashboard" className={cx('inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-white', brand.bg600, brand.hoverBg500)}>Get started</a>
                <a href="#demo" className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Contact sales</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500 md:flex-row md:px-6">
          <p>© {year} Streamward. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            <li><a href="#" className="hover:text-neutral-700">Privacy</a></li>
            <li><a href="#" className="hover:text-neutral-700">Terms</a></li>
            <li><a href="#" className="hover:text-neutral-700">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
