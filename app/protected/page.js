'use client'
import React, { useState } from 'react'
import {
  LayoutDashboard,
  BadgeCheck,
  FileBadge,
  ShieldCheck,
  AlertTriangle,
  Bell,
  CalendarClock,
  Upload,
  PlayCircle,
  CheckCircle2,
  Clock,
  Users,
  Settings,
  Search,
  LineChart as LineChartIcon,
  BarChart3,
  LogOut
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

// Utility to concat classes
const cx = (...cls) => cls.filter(Boolean).join(' ')

// Streamward brand tokens
const brand = {
  text600: 'text-orange-600',
  bg600: 'bg-orange-600',
  hoverBg500: 'hover:bg-orange-500',
  bg50: 'bg-orange-50',
  border200: 'border-orange-200',
}

export default function StreamwardDashboard() {
  const [range, setRange] = useState('30d')
  const [location, setLocation] = useState('All')
  const [dept, setDept] = useState('All')
  const [acctOpen, setAcctOpen] = useState(false)
  const year = new Date().getFullYear()

  // Sample chart data
  const trend = [
    { name: 'Jan', compliant: 72, overdue: 18 },
    { name: 'Feb', compliant: 75, overdue: 17 },
    { name: 'Mar', compliant: 78, overdue: 14 },
    { name: 'Apr', compliant: 80, overdue: 13 },
    { name: 'May', compliant: 83, overdue: 12 },
    { name: 'Jun', compliant: 86, overdue: 10 },
  ]

  const team = [
    { team: 'Field Ops', people: 124, compliant: 88, expiring: 9 },
    { team: 'Engineering', people: 86, compliant: 92, expiring: 4 },
    { team: 'Facilities', people: 42, compliant: 81, expiring: 7 },
    { team: 'Customer Success', people: 63, compliant: 95, expiring: 2 },
  ]

  const myCerts = [
    { name: 'Plumbing License - CA', status: 'Active', expires: '2026-03-10' },
    { name: 'OSHA 30', status: 'Active', expires: '2027-09-01' },
    { name: 'Backflow Prevention', status: 'Expiring soon', expires: '2025-11-15' },
  ]

  const assigned = [
    { title: 'PMP Exam Prep - Module 3', progress: 45, due: 'Jun 28' },
    { title: 'Code Update: NEC 2023', progress: 10, due: 'Jul 12' },
    { title: 'Safety Refresher', progress: 90, due: 'Jun 21' },
  ]

  const expiringSoon = [
    { name: 'Confined Space Training', person: 'Jordan Lee', due: '7 days' },
    { name: 'First Aid / CPR', person: 'Sam Patel', due: '10 days' },
    { name: 'Backflow Tester', person: 'Riley Kim', due: '14 days' },
  ]

  const kpis = [
    { label: 'Overall compliance', value: '88%', icon: ShieldCheck },
    { label: 'Expiring this month', value: '23', icon: CalendarClock },
    { label: 'Overdue items', value: '11', icon: AlertTriangle },
    { label: 'New certificates', value: '57', icon: BadgeCheck },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Shell */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-neutral-200 bg-white md:block">
          <div className="flex items-center gap-2 px-4 py-4">
            <img src="/streamward.png" alt="Streamward" className="h-7 w-auto" />
          </div>
          <nav className="px-2 py-2 text-sm">
            <a className={cx('group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-neutral-800 hover:bg-neutral-50', 'bg-neutral-50')} href="#">
              <LayoutDashboard className={cx('h-4 w-4', brand.text600)} /> Dashboard
            </a>
            <a className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50" href="#">
              <FileBadge className="h-4 w-4" /> Certifications
            </a>
            <a className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50" href="#">
              <PlayCircle className="h-4 w-4" /> Training
            </a>
            <a className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50" href="#">
              <Users className="h-4 w-4" /> Teams
            </a>
            <a className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50" href="#">
              <LineChartIcon className="h-4 w-4" /> Reports
            </a>
            <a className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50" href="#">
              <Settings className="h-4 w-4" /> Settings
            </a>
          </nav>
          <div className="mt-auto px-4 py-4 text-xs text-neutral-500">© {year} Streamward</div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
              <form className="hidden flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 md:flex">
                <Search className={cx('h-4 w-4 shrink-0', brand.text600)} />
                <input placeholder="Search people, credentials, or courses" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
              </form>
              <div className="flex items-center gap-2">
                <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                </button>
                <div className="relative">
                <button onClick={() => setAcctOpen(o => !o)} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm">
                  <img src="https://i.pravatar.cc/40?img=8" alt="avatar" className="h-6 w-6 rounded-full" />
                  <span className="hidden sm:inline">Account</span>
                </button>
                {acctOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-1 text-sm shadow-lg">
                    <a href="/account" className="block rounded-lg px-3 py-2 hover:bg-neutral-50">Profile</a>
                    <a href="/settings" className="block rounded-lg px-3 py-2 hover:bg-neutral-50">Settings</a>
                    <hr className="my-1 border-neutral-200" />
                    <a href="/auth/logout" className="flex items-center justify-between rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">Logout <LogOut className="h-4 w-4" /></a>
                  </div>
                )}
              </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-6">
            {/* Filters */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">Location</div>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm">
                  <option>All</option>
                  <option>California</option>
                  <option>Texas</option>
                  <option>New York</option>
                  <option>Florida</option>
                </select>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">Department</div>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm">
                  <option>All</option>
                  <option>Field Ops</option>
                  <option>Engineering</option>
                  <option>Facilities</option>
                  <option>Customer Success</option>
                </select>
              </div>
              {kpis.map((k, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">{k.label}</div>
                    <k.icon className={cx('h-4 w-4', brand.text600)} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{k.value}</div>
                </div>
              ))}
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Compliance trend</h3>
                  <div className="inline-flex items-center gap-2 text-xs text-neutral-500"><LineChartIcon className={cx('h-4 w-4', brand.text600)} /> last {range}</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="compliant" stroke="#EA580C" fillOpacity={1} fill="url(#c1)" />
                      <Line type="monotone" dataKey="overdue" stroke="#94a3b8" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Departments</h3>
                  <BarChart3 className={cx('h-4 w-4', brand.text600)} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={team} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="team" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="compliant" fill="#EA580C" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Two column stack */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* My certifications */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
                <h3 className="text-base font-semibold">My certifications</h3>
                <ul className="mt-4 divide-y divide-neutral-100">
                  {myCerts.map((c, i) => (
                    <li key={i} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-neutral-500">Expires {c.expires}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs', c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> {c.status}
                        </span>
                        <button className={cx('rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50')}>View</button>
                        <button className={cx('inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-white', brand.bg600, brand.hoverBg500)}>
                          <Upload className="h-4 w-4" /> Upload proof
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assigned training */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="text-base font-semibold">Assigned training</h3>
                <ul className="mt-4 space-y-4">
                  {assigned.map((a, i) => (
                    <li key={i} className="rounded-xl border border-neutral-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-xs text-neutral-500">Due {a.due}</div>
                        </div>
                        <button className={cx('inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-white', brand.bg600, brand.hoverBg500)}>
                          <PlayCircle className="h-4 w-4" /> Continue
                        </button>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${a.progress}%` }} />
                      </div>
                      <div className="mt-1 text-right text-xs text-neutral-500">{a.progress}%</div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Expiring soon and team table */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="text-base font-semibold">Expiring soon</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {expiringSoon.map((e, i) => (
                    <li key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                      <div>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-xs text-neutral-500">{e.person}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700"><Clock className="h-3.5 w-3.5" /> {e.due}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
                <h3 className="text-base font-semibold">Team overview</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs text-neutral-500">
                      <tr>
                        <th className="px-3 py-2">Team</th>
                        <th className="px-3 py-2">People</th>
                        <th className="px-3 py-2">Compliant</th>
                        <th className="px-3 py-2">Expiring</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {team.map((t, i) => (
                        <tr key={i}>
                          <td className="px-3 py-3 font-medium">{t.team}</td>
                          <td className="px-3 py-3">{t.people}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-28 rounded-full bg-neutral-200">
                                <div className="h-2 rounded-full bg-orange-500" style={{ width: `${t.compliant}%` }} />
                              </div>
                              <span className="text-xs text-neutral-600">{t.compliant}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">{t.expiring}</td>
                          <td className="px-3 py-3">
                            <button className={cx('rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50')}>View team</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
