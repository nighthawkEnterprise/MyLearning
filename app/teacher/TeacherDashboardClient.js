'use client'
import React, { useMemo, useState } from 'react'
import {
  Bell, Calendar, CheckCircle2, AlertTriangle, Users, FileText,
  BarChart3, Sparkles, LogOut, GraduationCap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'

// Optional: reuse your existing settings UI
import SettingsPanel from '../components/SettingsPanel/SettingsPanel'

// util + theme (indigo palette for faculty)
const cx = (...cls) => cls.filter(Boolean).join(' ')
const tone = {
  bg50: 'bg-indigo-50',
  text600: 'text-indigo-600',
  bg600: 'bg-indigo-600',
  hoverBg500: 'hover:bg-indigo-500',
  border200: 'border-indigo-200',
}

// ---- mock data (replace with real data later) ----
const classes = [
  { id: 'c1', name: 'Algebra I', section: 'Period 2', learners: 28, avgMastery: 72, activeToday: 19 },
  { id: 'c2', name: 'Geometry', section: 'Period 4', learners: 31, avgMastery: 66, activeToday: 22 },
  { id: 'c3', name: 'Statistics', section: 'Period 6', learners: 27, avgMastery: 74, activeToday: 17 },
]

const engagement7d = [
  { d: 'Mon', minutes: 210 }, { d: 'Tue', minutes: 245 }, { d: 'Wed', minutes: 180 },
  { d: 'Thu', minutes: 260 }, { d: 'Fri', minutes: 200 }, { d: 'Sat', minutes: 90 }, { d: 'Sun', minutes: 110 },
]

const masteryByUnit = [
  { unit: 'Linear Eq.', pct: 78 },
  { unit: 'Inequalities', pct: 70 },
  { unit: 'Systems', pct: 64 },
  { unit: 'Functions', pct: 81 },
  { unit: 'Polynomials', pct: 59 },
]

const gradingQueue = [
  { id: 'g1', student: 'M. Chen', assessment: 'Quiz: Systems of Eq.', submitted: '5m ago' },
  { id: 'g2', student: 'A. Singh', assessment: 'HW: Functions 2.3', submitted: '18m ago' },
  { id: 'g3', student: 'R. Garcia', assessment: 'Exit Ticket 7', submitted: '44m ago' },
]

const upcoming = [
  { id: 'u1', title: 'Unit 3 Quiz (Algebra I)', due: 'Tomorrow 8:00 AM' },
  { id: 'u2', title: 'HW 5 (Geometry)', due: 'Thu 11:59 PM' },
  { id: 'u3', title: 'Project Milestone (Stats)', due: 'Mon' },
]

const atRisk = [
  { id: 'r1', name: 'D. Patel', course: 'Geometry', risk: 82, reason: 'Low practice + missed HW' },
  { id: 'r2', name: 'S. Nguyen', course: 'Algebra I', risk: 75, reason: 'Mastery < 60% last 2 units' },
  { id: 'r3', name: 'J. Thompson', course: 'Statistics', risk: 69, reason: 'Attendance + low minutes' },
]

// simple palette for the bar cells
const barColors = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']

export default function TeacherDashboardClient({ initialTokens = { access: '', refresh: '' } }) {
  const [tab, setTab] = useState('overview')

  // ----- tokens from cookies (injected by server wrapper) -----
  const [tokens, setTokens] = useState(initialTokens)
  const [reveal, setReveal] = useState({ access: false, refresh: false })
  const mask = (t) => (!t ? 'N/A' : t.length <= 24 ? t : `${t.slice(0, 12)}…${t.slice(-8)}`)
  const copy = async (value) => { try { if (value) await navigator.clipboard.writeText(value) } catch {} }
  const refreshFromCookies = () => { if (typeof window !== 'undefined') window.location.reload() }

  // ---- LOGOUT (absolute returnTo) ----
  const handleLogout = () => {
    if (typeof window === 'undefined') return
    const base = process.env.NEXT_PUBLIC_APP_BASE_URL || window.location.origin
    window.location.href = `/auth/logout?returnTo=${encodeURIComponent(base + '/')}`
  }

  // ---- API route runner (same debug tool) ----
  const [apiPath, setApiPath] = useState('/api/proxy/myaccount')
  const [apiMethod, setApiMethod] = useState('GET')
  const [apiBody, setApiBody] = useState('')
  const [apiLoading, setApiLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)
  const [apiResp, setApiResp] = useState(null)
  const [apiErr, setApiErr] = useState('')

  const presets = [
    { label: 'GET /api/proxy/myaccount', path: '/api/proxy/myaccount', method: 'GET', body: '' },
    { label: 'GET /api/proxy/myaccount/factors', path: '/api/proxy/myaccount/factors', method: 'GET', body: '' },
    { label: 'GET /api/proxy/myaccount/methods', path: '/api/proxy/myaccount/methods', method: 'GET', body: '' },
  ]

  async function runApi() {
    try {
      setApiLoading(true); setApiErr(''); setApiResp(null); setApiStatus(null)
      const opts = { method: apiMethod, headers: {} }
      if (apiMethod !== 'GET' && apiBody.trim()) { opts.headers['Content-Type'] = 'application/json'; opts.body = apiBody }
      const r = await fetch(apiPath, opts)
      setApiStatus(r.status)
      const ct = r.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await r.json() : await r.text()
      setApiResp(data)
    } catch (e) {
      setApiErr(String(e?.message || e))
    } finally { setApiLoading(false) }
  }

  return (
    <div className={cx('min-h-screen bg-neutral-50 text-neutral-900', 'selection:bg-indigo-200/60')}>
      {/* Top gradient accent */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className={cx('mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl', 'bg-gradient-to-r from-indigo-200 via-violet-200 to-sky-200')} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Welcome, Teacher</h1>
              <p className="text-sm text-neutral-500">Your classes at a glance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50">
              <Bell className="h-4 w-4" />
              Alerts
            </button>
            <button className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white shadow-sm transition', tone.bg600, tone.hoverBg500)}>
              <Sparkles className="h-4 w-4" />
              Quick Actions
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="grid w-full grid-cols-6 sm:max-w-3xl">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'classes', label: 'Classes' },
              { id: 'assessments', label: 'Assessments' },
              { id: 'students', label: 'Students' },
              { id: 'settings', label: 'Settings' },
              { id: 'api', label: 'API routes' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  'border px-3 py-2 text-sm first:rounded-l-xl last:rounded-r-xl',
                  tab === t.id ? cx('bg-white font-semibold', tone.text600, tone.border200) : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-50',
                  'border-neutral-200'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Primary column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Classes snapshot */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <Users className={cx('h-4 w-4', tone.text600)} /> Your classes
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Enrollment, mastery, and activity today</p>
                  </div>
                  <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {classes.map((c) => (
                      <div key={c.id} className="rounded-xl border border-neutral-200 p-4">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-neutral-500">{c.section}</div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Learners</span>
                          <span className="font-semibold">{c.learners}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Avg mastery</span>
                          <span className="font-semibold">{c.avgMastery}%</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Active today</span>
                          <span className="font-semibold">{c.activeToday}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Open gradebook</button>
                          <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)}>Assign</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement chart */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="text-base font-semibold">Engagement minutes (7 days)</div>
                    <p className="mt-1 text-sm text-neutral-500">Across all your classes</p>
                  </div>
                  <div className="p-5">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={engagement7d} margin={{ left: 8, right: 8 }}>
                          <defs>
                            <linearGradient id="engGrad" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="d" tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ opacity: 0.15 }} />
                          <Area dataKey="minutes" type="monotone" stroke="#4f46e5" fill="url(#engGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Mastery by unit */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="text-base font-semibold">Average mastery by unit</div>
                    <p className="mt-1 text-sm text-neutral-500">Focus support on lower bars first</p>
                  </div>
                  <div className="p-5">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={masteryByUnit}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="unit" tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ opacity: 0.15 }} />
                          <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                            {masteryByUnit.map((_, i) => (
                              <Cell key={i} fill={barColors[i % barColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side column */}
              <div className="space-y-6">
                {/* Grading queue */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <FileText className={cx('h-4 w-4', tone.text600)} /> Grading queue
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Newest submissions first</p>
                  </div>
                  <div className="p-5 space-y-3">
                    {gradingQueue.map((g) => (
                      <div key={g.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                        <div>
                          <div className="font-medium">{g.student}</div>
                          <div className="text-xs text-neutral-500">{g.assessment}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-neutral-500">{g.submitted}</div>
                          <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)}>Open</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className={cx('h-4 w-4', tone.text600)} /> Upcoming deadlines
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Across all classes</p>
                  </div>
                  <div className="p-5 space-y-3">
                    {upcoming.map((u) => (
                      <div key={u.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                        <div>
                          <div className="font-medium">{u.title}</div>
                          <div className="text-xs text-neutral-500">{u.due}</div>
                        </div>
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Edit</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* At risk */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <AlertTriangle className={cx('h-4 w-4', tone.text600)} /> At-risk students
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Signals to review today</p>
                  </div>
                  <div className="p-5 space-y-3">
                    {atRisk.map((s) => (
                      <div key={s.id} className="rounded-xl border border-neutral-200 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{s.name} • <span className="text-neutral-500">{s.course}</span></div>
                          <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-medium text-white', s.risk >= 75 ? 'bg-rose-600' : 'bg-amber-500')}>
                            {s.risk}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">{s.reason}</div>
                        <div className="mt-2 flex gap-2">
                          <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Message</button>
                          <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)}>Create plan</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLASSES */}
          {tab === 'classes' && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {classes.map((c) => (
                <div key={c.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold">{c.name}</div>
                      <div className="text-xs text-neutral-500">{c.section}</div>
                    </div>
                    <div className={cx('inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}>
                      {c.learners} learners
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-neutral-200 p-3">
                      <div className="text-neutral-500">Avg mastery</div>
                      <div className="text-lg font-semibold">{c.avgMastery}%</div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 p-3">
                      <div className="text-neutral-500">Active today</div>
                      <div className="text-lg font-semibold">{c.activeToday}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50">Open</button>
                    <button className={cx('rounded-xl px-3 py-1.5 text-sm text-white', tone.bg600, tone.hoverBg500)}>Create quiz</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ASSESSMENTS */}
          {tab === 'assessments' && (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <BarChart3 className={cx('h-4 w-4', tone.text600)} /> Recent assessments
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">Quick links to grade or reassign</p>
                </div>
                <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {['Unit 2 Quiz – Algebra I', 'HW 4 – Geometry', 'Exit Ticket – Stats', 'Practice Set – Functions'].map((t, i) => (
                    <div key={i} className="rounded-xl border border-neutral-200 p-4">
                      <div className="font-medium">{t}</div>
                      <div className="mt-2 flex gap-2">
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Grade</button>
                        <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)}>Reassign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <GraduationCap className={cx('h-4 w-4', tone.text600)} /> Create new assessment
                </div>
                <p className="mt-1 text-sm text-neutral-500">Standards-aligned and auto-graded options</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['AI quiz builder', 'Question bank', 'Rubric task', 'Exit ticket'].map((x) => (
                    <button key={x} className={cx('rounded-xl border px-3 py-1.5 text-sm', tone.bg50, tone.text600, tone.border200, 'border')}>{x}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {tab === 'students' && (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Users className={cx('h-4 w-4', tone.text600)} /> Student highlights
                </div>
                <p className="mt-1 text-sm text-neutral-500">Top needs & recent improvements</p>
              </div>
              <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {atRisk.slice(0, 4).map((s) => (
                  <div key={s.id} className="rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.name} • <span className="text-neutral-500">{s.course}</span></div>
                      <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-medium text-white', s.risk >= 75 ? 'bg-rose-600' : 'bg-amber-500')}>{s.risk}</span>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{s.reason}</div>
                    <div className="mt-2 flex gap-2">
                      <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">See details</button>
                      <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)}>Support plan</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && <SettingsPanel tone={tone} cx={cx} />}

          {/* API ROUTES (same debug panel + cookie tokens) */}
          {tab === 'api' && (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="text-base font-semibold">Tokens (from cookies)</div>
                  <p className="mt-1 text-sm text-neutral-500">
                    Read on the server via <code>next/headers</code> and passed to this client. No external Auth0 calls.
                  </p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 text-xs text-neutral-500">Access token</div>
                        <div className="break-all text-sm">{reveal.access ? (tokens.access || 'N/A') : mask(tokens.access)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50" onClick={() => setReveal(s => ({ ...s, access: !s.access }))}>
                          {reveal.access ? 'Hide' : 'Reveal'}
                        </button>
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50" onClick={() => copy(tokens.access)}>Copy</button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 text-xs text-neutral-500">Refresh token</div>
                        <div className="break-all text-sm">{reveal.refresh ? (tokens.refresh || 'N/A') : mask(tokens.refresh)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50" onClick={() => setReveal(s => ({ ...s, refresh: !s.refresh }))}>
                          {reveal.refresh ? 'Hide' : 'Reveal'}
                        </button>
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50" onClick={() => copy(tokens.refresh)}>Copy</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className={cx('rounded-xl px-3 py-1.5 text-xs text-white', tone.bg600, tone.hoverBg500)} onClick={refreshFromCookies}>
                      Refresh from cookies
                    </button>
                    <span className="text-xs text-neutral-500">If tokens rotated, click to re-read cookies.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="text-base font-semibold">Call internal API routes</div>
                  <p className="mt-1 text-sm text-neutral-500">Useful for debugging proxy endpoints.</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {presets.map((p) => (
                      <button key={p.label} className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50"
                        onClick={() => { setApiPath(p.path); setApiMethod(p.method); setApiBody(p.body) }}>
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_1fr]">
                    <select className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm"
                      value={apiMethod} onChange={(e) => setApiMethod(e.target.value)}>
                      {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                      value={apiPath} onChange={(e) => setApiPath(e.target.value)} placeholder="/api/proxy/myaccount" />
                  </div>

                  {apiMethod !== 'GET' && (
                    <textarea className="min-h-[120px] w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                      value={apiBody} onChange={(e) => setApiBody(e.target.value)} placeholder='{"example":"payload"}' />
                  )}

                  <div className="flex items-center gap-2">
                    <button onClick={runApi} className={cx('rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)} disabled={apiLoading}>
                      {apiLoading ? 'Running…' : 'Run'}
                    </button>
                    <div className="text-xs text-neutral-600">Status: {apiStatus ?? 'N/A'}</div>
                    {apiErr && <div className="text-xs text-red-600">Error: {apiErr}</div>}
                  </div>

                  <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-neutral-50 p-3 text-xs">
                    {apiResp ? (typeof apiResp === 'string' ? apiResp : JSON.stringify(apiResp, null, 2)) : 'No response yet'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between border-t border-neutral-200/70 pt-6 text-sm text-neutral-500">
          <p>Need help? Visit Help Center</p>
          <div className="flex items-center gap-3">
            <button className="text-neutral-500 hover:text-neutral-700">Privacy</button>
            <button className="text-neutral-500 hover:text-neutral-700">Terms</button>
          </div>
        </div>
      </div>
    </div>
  )
}
