'use client'

import React, { useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  ListChecks,
  Play,
  Sparkles,
  TrendingUp,
  Brain,
  BarChart3,
  User,
  Shield,
  Lock,
  BellRing,
  Link2,
  Trash2,
} from 'lucide-react'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

// Simple cx utility
const cx = (...cls) => cls.filter(Boolean).join(' ')

// Theme tokens for the Students persona
const tone = {
  bg50: 'bg-rose-50',
  text600: 'text-rose-600',
  bg600: 'bg-rose-600',
  hoverBg500: 'hover:bg-rose-500',
  border200: 'border-rose-200',
}

// Mock dashboard data - replace with your real sources
const progressSeries = [
  { d: 'Mon', sessions: 2, minutes: 40 },
  { d: 'Tue', sessions: 3, minutes: 55 },
  { d: 'Wed', sessions: 1, minutes: 25 },
  { d: 'Thu', sessions: 2, minutes: 45 },
  { d: 'Fri', sessions: 2, minutes: 35 },
  { d: 'Sat', sessions: 4, minutes: 85 },
  { d: 'Sun', sessions: 3, minutes: 60 },
]

const masterySeries = [
  { topic: 'Algebra', pct: 82 },
  { topic: 'Geometry', pct: 64 },
  { topic: 'Calculus', pct: 48 },
  { topic: 'Statistics', pct: 57 },
  { topic: 'Logic', pct: 72 },
]

const dueSoon = [
  { id: 't1', title: 'Quiz - Linear Equations', due: 'Today 5:00 PM', course: 'Math 101' },
  { id: 't2', title: 'Essay outline - Cognitive Biases', due: 'Tomorrow 10:00 AM', course: 'Psychology' },
  { id: 't3', title: 'Flashcards - Key Theorems', due: 'Fri', course: 'Math 101' },
]

const todayPlan = [
  'Watch 1 lesson - Intro to Limits',
  'Do 15 practice questions - Algebra',
  'Review flashcards - 2 decks',
]

export default function StudentsDashboardHome() {
  const [checked, setChecked] = useState({})
  const [tab, setTab] = useState('overview')

  // Settings state
  const [profileName, setProfileName] = useState('Alex Student')
  const [profileEmail, setProfileEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('')
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyPush, setNotifyPush] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [gdConnected, setGdConnected] = useState(false)
  const [saveBanner, setSaveBanner] = useState(false)

  const handleSave = (e) => {
    e?.preventDefault?.()
    setSaveBanner(true)
    setTimeout(() => setSaveBanner(false), 2000)
  }

  const pctComplete = 62
  const streakDays = 9

  const nextItem = useMemo(() => dueSoon[0], [])

  return (
    <div className={cx('min-h-screen bg-neutral-50 text-neutral-900', 'selection:bg-rose-200/60')}>
      {/* Top gradient accent */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className={cx('mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl', 'bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200')} />
      </div>

      {/* Page container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
              <img src="/avatar-student.png" alt="Your avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Welcome back</h1>
              <p className="text-sm text-neutral-500">Here is your snapshot for today</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"><Bell className="h-4 w-4" />Alerts</button>
            <button className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white shadow-sm transition', tone.bg600, tone.hoverBg500)}>
              <Sparkles className="h-4 w-4" />Start Focus Session
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="grid w-full grid-cols-4 sm:max-w-lg">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'practice', label: 'Practice' },
              { id: 'settings', label: 'Settings' },
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

          {/* Overview Tab */}
          {tab === 'overview' && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Primary column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Continue learning */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold"><BookOpen className={cx('h-4 w-4', tone.text600)} /> Continue course</div>
                    <p className="mt-1 text-sm text-neutral-500">Math 101 - Foundations of Calculus</p>
                  </div>
                  <div className="p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Overall progress</span>
                          <span className="font-medium">{pctComplete}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                          <div className="h-full rounded-full bg-rose-600" style={{ width: pctComplete + '%' }} />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                          <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}>Module 3 - Limits</span>
                          <span className="text-neutral-500">Next up - One sided limits</span>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                        <button className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"><Play className="h-4 w-4" />Resume</button>
                        <button className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)}>
                          <Sparkles className="h-4 w-4" />AI Tutor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="border-b border-neutral-100 p-5">
                      <div className="text-base font-semibold">Study minutes - last 7 days</div>
                      <p className="mt-1 text-sm text-neutral-500">Your streak is looking good</p>
                    </div>
                    <div className="p-5">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={progressSeries} margin={{ left: 8, right: 8 }}>
                            <defs>
                              <linearGradient id="minGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#e11d48" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="d" tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{ opacity: 0.15 }} />
                            <Area dataKey="minutes" type="monotone" stroke="#e11d48" fill="url(#minGrad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="border-b border-neutral-100 p-5">
                      <div className="text-base font-semibold">Mastery by topic</div>
                      <p className="mt-1 text-sm text-neutral-500">Focus on lower mastery first</p>
                    </div>
                    <div className="p-5">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={masterySeries}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="topic" tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{ opacity: 0.15 }} />
                            <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                              {masterySeries.map((_, i) => (
                                <Cell key={`c-${i}`} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side column */}
              <div className="space-y-6">
                {/* Streak and next due */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="border-b border-neutral-100 p-5">
                      <div className="flex items-center gap-2 text-base font-semibold"><Flame className={cx('h-4 w-4', tone.text600)} /> Streak</div>
                      <p className="mt-1 text-sm text-neutral-500">Keep the chain going</p>
                    </div>
                    <div className="p-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-semibold">{streakDays} days</div>
                          <p className="mt-1 text-sm text-neutral-500">Best - 12 days</p>
                        </div>
                        <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white', tone.bg600)}>+15 XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="border-b border-neutral-100 p-5">
                      <div className="flex items-center gap-2 text-base font-semibold"><Clock className={cx('h-4 w-4', tone.text600)} /> Next due</div>
                      <p className="mt-1 text-sm text-neutral-500">Do this first</p>
                    </div>
                    <div className="p-5">
                      <div className="space-y-1">
                        <div className="font-medium">{nextItem.title}</div>
                        <div className="text-sm text-neutral-500">{nextItem.course} - {nextItem.due}</div>
                        <div className="mt-3 flex gap-2">
                          <button className={cx('rounded-xl px-3 py-1.5 text-sm text-white', tone.bg600, tone.hoverBg500)}>Open</button>
                          <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50">Snooze</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today plan */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold"><ListChecks className={cx('h-4 w-4', tone.text600)} /> Today plan</div>
                    <p className="mt-1 text-sm text-neutral-500">Auto created by AI</p>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {todayPlan.map((task, i) => (
                        <li key={i} className="flex items-start justify-between gap-3">
                          <label className="flex cursor-pointer items-start gap-3 text-sm">
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
                              onChange={(e) => setChecked((s) => ({ ...s, [String(i)]: e.target.checked }))}
                              checked={Boolean(checked[String(i)])}
                            />
                            <span className={cx(Boolean(checked[String(i)]) && 'line-through text-neutral-400')}>{task}</span>
                          </label>
                          {Boolean(checked[String(i)]) ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : null}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50">Shuffle</button>
                      <button className={cx('rounded-xl px-3 py-1.5 text-sm text-white', tone.bg600, tone.hoverBg500)}>Regenerate</button>
                    </div>
                  </div>
                </div>

                {/* Quick practice */}
                <div className="rounded-2xl border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 p-5">
                    <div className="flex items-center gap-2 text-base font-semibold"><Brain className={cx('h-4 w-4', tone.text600)} /> AI tutor</div>
                    <p className="mt-1 text-sm text-neutral-500">Ask anything or practice with quick prompts</p>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <input className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-rose-200" placeholder="Ask the tutor..." />
                      <button className={cx('h-10 rounded-xl px-4 text-sm text-white', tone.bg600, tone.hoverBg500)}>Send</button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {['Explain limits', 'Generate 5 practice problems', 'Review my steps', 'Create flashcards'].map((t) => (
                        <button key={t} className={cx('rounded-xl border px-2.5 py-1 font-medium', tone.bg50, tone.text600, tone.border200, 'border')}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {tab === 'assignments' && (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 p-5">
                <div className="flex items-center gap-2 text-base font-semibold"><Calendar className={cx('h-4 w-4', tone.text600)} /> Upcoming work</div>
                <p className="mt-1 text-sm text-neutral-500">Deadlines for the next 7 days</p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {dueSoon.map((d) => (
                    <div key={d.id} className="rounded-xl border border-neutral-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">{d.title}</div>
                          <div className="text-sm text-neutral-500">{d.course} - {d.due}</div>
                        </div>
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Practice Tab */}
          {tab === 'practice' && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { t: 'Adaptive quiz', d: 'Auto adjusts based on accuracy', icon: <BarChart3 className="h-4 w-4" /> },
                { t: 'Flashcards', d: 'Spaced repetition built in', icon: <GraduationCap className="h-4 w-4" /> },
                { t: 'Step by step', d: 'Show your work and get hints', icon: <TrendingUp className="h-4 w-4" /> },
              ].map((x, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-neutral-200 bg-white">
                  <div className="p-5 pb-2">
                    <div className="flex items-center gap-2 text-base font-semibold">{x.icon} {x.t}</div>
                    <p className="mt-1 text-sm text-neutral-500">{x.d}</p>
                  </div>
                  <div className="mt-auto p-5 pt-2">
                    <button className={cx('w-full rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)}>Start</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="mt-6 space-y-6">
              {saveBanner && (
                <div className={cx('rounded-xl border p-3 text-sm', tone.bg50, tone.border200, 'border', tone.text600)}>
                  Settings saved
                </div>
              )}

              {/* Profile */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold"><User className={cx('h-4 w-4', tone.text600)} /> Profile</div>
                  <p className="mt-1 text-sm text-neutral-500">Update your basic information</p>
                </div>
                <form className="p-5" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-neutral-600">Full name</label>
                      <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Email</label>
                      <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="submit" className={cx('rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)}>Save changes</button>
                    <button type="button" className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50" onClick={() => { setProfileName('Alex Student'); setProfileEmail('alex@example.com') }}>Reset</button>
                  </div>
                </form>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold"><Shield className={cx('h-4 w-4', tone.text600)} /> Security</div>
                  <p className="mt-1 text-sm text-neutral-500">Password and multi factor</p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-neutral-600">New password</label>
                      <div className="mt-1 flex gap-2">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" placeholder="Enter a strong password" />
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50" onClick={() => setPassword('')}>Clear</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Multi factor authentication</label>
                      <div className="mt-1 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3">
                        <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" /> Authenticator app</div>
                        <button
                          className={cx('h-6 w-11 rounded-full transition', mfaEnabled ? 'bg-rose-600' : 'bg-neutral-300')}
                          onClick={() => setMfaEnabled((v) => !v)}
                        >
                          <span className={cx('block h-6 w-6 rounded-full bg-white transition', mfaEnabled ? 'translate-x-5' : 'translate-x-0')} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button onClick={handleSave} className={cx('rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)}>Update security</button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold"><BellRing className={cx('h-4 w-4', tone.text600)} /> Notifications</div>
                  <p className="mt-1 text-sm text-neutral-500">Choose how you want to be notified</p>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { id: 'email', label: 'Email alerts for deadlines', state: notifyEmail, set: setNotifyEmail },
                    { id: 'push', label: 'Push reminders on mobile', state: notifyPush, set: setNotifyPush },
                    { id: 'weekly', label: 'Weekly progress summary', state: weeklySummary, set: setWeeklySummary },
                  ].map((n) => (
                    <div key={n.id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3">
                      <div className="flex items-center gap-2 text-sm"><BellRing className="h-4 w-4" /> {n.label}</div>
                      <button
                        className={cx('h-6 w-11 rounded-full transition', n.state ? 'bg-rose-600' : 'bg-neutral-300')}
                        onClick={() => n.set((v) => !v)}
                      >
                        <span className={cx('block h-6 w-6 rounded-full bg-white transition', n.state ? 'translate-x-5' : 'translate-x-0')} />
                      </button>
                    </div>
                  ))}
                  <div>
                    <button onClick={handleSave} className={cx('mt-2 rounded-xl px-4 py-2 text-sm text-white', tone.bg600, tone.hoverBg500)}>Save preferences</button>
                  </div>
                </div>
              </div>

              {/* Connected apps */}
              <div className="rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold"><Link2 className={cx('h-4 w-4', tone.text600)} /> Connected apps</div>
                  <p className="mt-1 text-sm text-neutral-500">Manage integrations</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-sm">
                      <div className="font-medium">Google Drive</div>
                      <div className="text-neutral-500">Import resources and export notes</div>
                    </div>
                    {gdConnected ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-emerald-600">Connected</span>
                        <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setGdConnected(false)}>Disconnect</button>
                      </div>
                    ) : (
                      <button className={cx('rounded-xl px-3 py-1.5 text-sm text-white', tone.bg600, tone.hoverBg500)} onClick={() => setGdConnected(true)}>Connect</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-200 bg-white">
                <div className="border-b border-red-100 p-5">
                  <div className="flex items-center gap-2 text-base font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Danger zone</div>
                  <p className="mt-1 text-sm text-red-600/80">Export data or delete your account</p>
                </div>
                <div className="p-5 flex flex-wrap items-center gap-3">
                  <button className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Export data</button>
                  <button className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Delete account</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer mini */}
        <div className="mt-10 flex items-center justify-between border-t border-neutral-200/70 pt-6 text-sm text-neutral-500">
          <p>Need help - open the tutor or visit Help Center</p>
          <div className="flex items-center gap-3">
            <button className="text-neutral-500 hover:text-neutral-700">Privacy</button>
            <button className="text-neutral-500 hover:text-neutral-700">Terms</button>
          </div>
        </div>
      </div>
    </div>
  )
}
