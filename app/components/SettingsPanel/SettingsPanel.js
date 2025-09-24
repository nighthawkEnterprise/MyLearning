// app/components/SettingsPanel/SettingsPanel.jsx
'use client'

import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react'
import {
  Shield, Trash2, CheckCircle2, RefreshCw, Mail, Phone, KeyRound, Smartphone, Lock, AlertTriangle, Plus
} from 'lucide-react'

// ---- HOISTED so it doesn't remount every keystroke ----
const Section = React.memo(function Section({ title, count, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 p-5">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{title}</span>
          <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs">{count}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  )
})

export default function SettingsPanel({
  tone = {
    bg50: 'bg-rose-50',
    text600: 'text-rose-600',
    bg600: 'bg-rose-600',
    hoverBg500: 'hover:bg-rose-500',
    border200: 'border-rose-200',
  },
  cx = (...c) => c.filter(Boolean).join(' '),
}) {
  // Keep focus stable while an input is focused
  const emailRef = useRef(null)
  const phoneRef = useRef(null)
  const [focused, setFocused] = useState(null) // 'email' | 'phone' | null

  useLayoutEffect(() => {
    if (!focused) return
    const ref = focused === 'email' ? emailRef.current : focused === 'phone' ? phoneRef.current : null
    if (!ref) return
    if (document.activeElement !== ref) {
      try {
        const s = ref.selectionStart, e = ref.selectionEnd
        ref.focus({ preventScroll: true })
        if (s != null && e != null) ref.setSelectionRange(s, e)
      } catch {}
    }
  }, [focused])

  // Only guard anchors like <a href="#"> from jumping to top
  const stopHashAnchor = (e) => {
    const a = e.target?.closest?.('a[href="#"]')
    if (a) { e.preventDefault(); e.stopPropagation() }
  }

  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [confirmMap, setConfirmMap] = useState({})

  // Add UX state
  const [showAdd, setShowAdd] = useState({ email: false, phone: false, totp: false, push: false })
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [adding, setAdding] = useState({ email: false, phone: false, totp: false, push: false })

  const canAddEmail = emailInput.trim().length > 0 && !adding.email
  const canAddPhone = phoneInput.trim().length > 0 && !adding.phone

  const iconFor = (type) => {
    if (type === 'email') return <Mail className="h-4 w-4" />
    if (type === 'phone') return <Phone className="h-4 w-4" />
    if (type === 'totp') return <KeyRound className="h-4 w-4" />
    if (type === 'push-notification') return <Smartphone className="h-4 w-4" />
    if (type === 'password') return <Lock className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  const labelFor = (m) => {
    if (m.type === 'email' && m.email) return `Email • ${m.email}`
    if (m.type === 'phone' && (m.phone_number || m.phone)) return `Phone • ${m.phone_number || m.phone}`
    if (m.type === 'totp') return 'Authenticator app'
    if (m.type === 'push-notification') return 'Push device'
    if (m.type === 'password') return 'Password'
    return (m.type || 'Method')
  }

  const fmtDate = (s) => (s ? new Date(s).toLocaleString() : '')

  const normalize = (raw) => {
    const arr = Array.isArray(raw) ? raw
      : (raw?.data || raw?.methods || raw?.authentication_methods || [])
    return (arr || []).map((m) => ({
      id: m.id || `${m.type}|${m.sid || m.identifier || m.phone_number || m.email || Math.random().toString(36).slice(2)}`,
      type: m.type,
      email: m.email,
      phone_number: m.phone_number || m.phone,
      created_at: m.created_at || m.createdAt || m.updated_at || undefined,
      confirmed: (m.confirmed ?? m.verified ?? (m.status === 'verified' ? true : undefined)),
      usage: (Array.isArray(m.usage) && m.usage.length ? m.usage : (m.is_primary ? ['primary'] : ['secondary'])),
    }))
  }

  // Initial load (server)
  async function load() {
    setErr(''); setLoading(true)
    try {
      const r = await fetch('/api/proxy/myaccount/methods', { cache: 'no-store' })
      console.log("r:", r);
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const ct = r.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await r.json() : await r.text()
      setMethods(normalize(data))
    } catch (e) {
      setErr(`Could not load methods: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const emails = useMemo(() => methods.filter(m => m.type === 'email'), [methods])
  const phones = useMemo(() => methods.filter(m => m.type === 'phone'), [methods])
  const totps  = useMemo(() => methods.filter(m => m.type === 'totp'), [methods])
  const pushes = useMemo(() => methods.filter(m => m.type === 'push-notification'), [methods])
  const pwds   = useMemo(() => methods.filter(m => m.type === 'password'), [methods])

  // ----------------------------
  // Mock add flows (no API)
  // ----------------------------
  const mkId = (t) => `mock:${t}:${Math.random().toString(36).slice(2, 9)}`
  const nowIso = () => new Date().toISOString()

  async function mockAddEmail() {
    if (!canAddEmail) return
    setAdding(s => ({ ...s, email: true }))
    try {
      const newItem = {
        id: mkId('email'),
        type: 'email',
        email: emailInput.trim(),
        phone_number: undefined,
        created_at: nowIso(),
        confirmed: false,
        usage: ['secondary'],
      }
      setMethods(prev => [newItem, ...prev])
      setEmailInput('')
      setShowAdd(s => ({ ...s, email: false }))
    } finally {
      setAdding(s => ({ ...s, email: false }))
    }
  }

  async function mockAddPhone() {
    if (!canAddPhone) return
    setAdding(s => ({ ...s, phone: true }))
    try {
      const newItem = {
        id: mkId('phone'),
        type: 'phone',
        phone_number: phoneInput.trim(),
        created_at: nowIso(),
        confirmed: false,
        usage: ['secondary'],
      }
      setMethods(prev => [newItem, ...prev])
      setPhoneInput('')
      setShowAdd(s => ({ ...s, phone: false }))
    } finally {
      setAdding(s => ({ ...s, phone: false }))
    }
  }

  async function mockAddTotp() {
    setAdding(s => ({ ...s, totp: true }))
    try {
      const newItem = {
        id: mkId('totp'),
        type: 'totp',
        created_at: nowIso(),
        confirmed: false,
        usage: ['secondary'],
      }
      setMethods(prev => [newItem, ...prev])
      setShowAdd(s => ({ ...s, totp: false }))
    } finally {
      setAdding(s => ({ ...s, totp: false }))
    }
  }

  async function mockAddPush() {
    setAdding(s => ({ ...s, push: true }))
    try {
      const newItem = {
        id: mkId('push'),
        type: 'push-notification',
        created_at: nowIso(),
        confirmed: false,
        usage: ['secondary'],
      }
      setMethods(prev => [newItem, ...prev])
      setShowAdd(s => ({ ...s, push: false }))
    } finally {
      setAdding(s => ({ ...s, push: false }))
    }
  }

  // ----------------------------
  // Deletion flow (mock ids local; others via API)
  // ----------------------------
  function openConfirm(id) {
    setConfirmMap(s => ({ ...s, [id]: { open: true, needsForce: false, busy: false, error: '' } }))
  }
  function closeConfirm(id) {
    setConfirmMap(s => ({ ...s, [id]: { open: false, needsForce: false, busy: false, error: '' } }))
  }

  async function doDelete(id, { force = false } = {}) {
    // If it's a mock item, delete locally
    if (id?.startsWith('mock:')) {
      setMethods(prev => prev.filter(m => m.id !== id))
      closeConfirm(id)
      return
    }

    setConfirmMap(s => ({ ...s, [id]: { ...(s[id]||{}), busy: true, error: '' } }))
    try {
      const url = `/api/proxy/myaccount/methods/delete?id=${encodeURIComponent(id)}${force ? '&force=1' : ''}`
      const r = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' } })
      if (r.ok) {
        setMethods(prev => prev.filter(m => m.id !== id))
        closeConfirm(id)
        return
      }
      let body = {}
      const ct = r.headers.get('content-type') || ''
      if (ct.includes('application/json')) body = await r.json().catch(() => ({}))
      else body = { error_description: await r.text().catch(() => '') }
      const msg = (body?.error_description || body?.message || body?.error || `HTTP ${r.status}`).toString()
      const requiresForce = /force/i.test(msg) || r.status === 409 || r.status === 412
      setConfirmMap(s => ({
        ...s,
        [id]: { ...(s[id]||{}), busy: false, open: true, needsForce: requiresForce || (s[id]?.needsForce ?? false), error: msg }
      }))
    } catch (e) {
      setConfirmMap(s => ({
        ...s,
        [id]: { ...(s[id]||{}), busy: false, error: e?.message || String(e), open: true }
      }))
    }
  }

  // ----------------------------
  // Small UI bits
  // ----------------------------
  const MethodRow = ({ m }) => {
    const confirm = confirmMap[m.id] || { open: false, needsForce: false, busy: false, error: '' }
    const usageStr = (Array.isArray(m.usage) && m.usage.length ? m.usage.join(', ') : 'secondary')

    return (
      <div className="rounded-xl border border-neutral-200">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cx('inline-flex h-6 w-6 items-center justify-center rounded-lg', tone.bg50, tone.text600)}>
                {iconFor(m.type)}
              </span>
              <span className="font-medium">{labelFor(m)}</span>
              {m.type !== 'password' && (m.confirmed ? (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> verified
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                  unverified
                </span>
              ))}
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                {usageStr}
              </span>
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              {m.created_at ? `Created ${fmtDate(m.created_at)}` : 'Created date not available'}
            </div>
            <div className="mt-1 break-all text-[11px] text-neutral-400">ID: {m.id}</div>
          </div>

          <div className="flex items-center gap-2">
            {m.type !== 'password' && (
              <button
                type="button"
                onClick={() => openConfirm(m.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        </div>

        {confirm.open && (
          <div className="border-t border-neutral-100 p-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <div className="text-xs text-amber-900">
                  <div className="font-medium">Are you sure?</div>
                  <div className="mt-0.5">
                    Removing this authentication method could make it harder to sign in, especially if it’s your only factor.
                  </div>
                  {confirm.error && (
                    <div className="mt-2 rounded-lg border border-amber-200 bg-white/60 p-2 text-[11px] text-amber-800">
                      {confirm.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => doDelete(m.id, { force: false })}
                  disabled={confirm.busy}
                  className={cx('inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition', tone.bg600, tone.hoverBg500, confirm.busy && 'opacity-60 cursor-not-allowed')}
                >
                  {confirm.busy ? 'Deleting…' : 'Delete'}
                </button>
                {confirm.needsForce && (
                  <button
                    type="button"
                    onClick={() => doDelete(m.id, { force: true })}
                    disabled={confirm.busy}
                    className="inline-flex items-center rounded-lg border border-red-300 bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60"
                  >
                    Continue anyway
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => closeConfirm(m.id)}
                  className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="space-y-6" onClickCapture={stopHashAnchor} style={{ overflowAnchor: 'none' }}>
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-2">
            <Shield className={cx('h-5 w-5', tone.text600)} />
            <div className="text-base font-semibold">Authentication methods</div>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
        {err && (
          <div className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {err}
          </div>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
          Loading methods…
        </div>
      )}

      {/* Email */}
      <Section title="Email" count={emails.length}>
        {/* Add control under the heading */}
        {!showAdd.email ? (
          <button
            type="button"
            onClick={() => { setShowAdd(s => ({ ...s, email: true })); setTimeout(() => emailRef.current?.focus(), 0) }}
            className={cx('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}
          >
            <Plus className="h-3.5 w-3.5" /> Add email
          </button>
        ) : (
          <div className="rounded-xl border border-neutral-200 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={emailRef}
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused((f) => (f === 'email' ? null : f))}
                autoComplete="off"
                placeholder="name@example.com"
                className="h-9 w-56 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              />
              <button
                type="button"
                onClick={mockAddEmail}
                disabled={!canAddEmail}
                className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500, !canAddEmail && 'opacity-60 cursor-not-allowed')}
              >
                {adding.email ? 'Adding…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(s => ({ ...s, email: false })); setEmailInput('') }}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">We’ll send verification to this address.</div>
          </div>
        )}

        {emails.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No email methods.</div>
        ) : emails.map(m => <MethodRow key={m.id} m={m} />)}
      </Section>

      {/* Phone */}
      <Section title="Phone" count={phones.length}>
        {!showAdd.phone ? (
          <button
            type="button"
            onClick={() => { setShowAdd(s => ({ ...s, phone: true })); setTimeout(() => phoneRef.current?.focus(), 0) }}
            className={cx('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}
          >
            <Plus className="h-3.5 w-3.5" /> Add phone
          </button>
        ) : (
          <div className="rounded-xl border border-neutral-200 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused((f) => (f === 'phone' ? null : f))}
                autoComplete="off"
                placeholder="+1 555 123 4567"
                className="h-9 w-56 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              />
              <button
                type="button"
                onClick={mockAddPhone}
                disabled={!canAddPhone}
                className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500, !canAddPhone && 'opacity-60 cursor-not-allowed')}
              >
                {adding.phone ? 'Adding…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(s => ({ ...s, phone: false })); setPhoneInput('') }}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">We’ll text you to verify this number.</div>
          </div>
        )}

        {phones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No phone methods.</div>
        ) : phones.map(m => <MethodRow key={m.id} m={m} />)}
      </Section>

      {/* TOTP */}
      <Section title="TOTP" count={totps.length}>
        {!showAdd.totp ? (
          <button
            type="button"
            onClick={() => setShowAdd(s => ({ ...s, totp: true }))}
            className={cx('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}
          >
            <Plus className="h-3.5 w-3.5" /> Add authenticator app
          </button>
        ) : (
          <div className="rounded-xl border border-neutral-200 p-3 text-sm">
            <div className="text-neutral-700">Scan a QR in your authenticator app, then save.</div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={mockAddTotp}
                disabled={adding.totp}
                className={cx('inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500, adding.totp && 'opacity-60')}
              >
                {adding.totp ? 'Adding…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(s => ({ ...s, totp: false }))}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {totps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No authenticator app methods.</div>
        ) : totps.map(m => <MethodRow key={m.id} m={m} />)}
      </Section>

      {/* Push */}
      <Section title="Push" count={pushes.length}>
        {!showAdd.push ? (
          <button
            type="button"
            onClick={() => setShowAdd(s => ({ ...s, push: true }))}
            className={cx('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium', tone.bg50, tone.text600, tone.border200, 'border')}
          >
            <Plus className="h-3.5 w-3.5" /> Add push device
          </button>
        ) : (
          <div className="rounded-xl border border-neutral-200 p-3 text-sm">
            <div className="text-neutral-700">Approve sign-ins on a registered device.</div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={mockAddPush}
                disabled={adding.push}
                className={cx('inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500, adding.push && 'opacity-60')}
              >
                {adding.push ? 'Adding…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(s => ({ ...s, push: false }))}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {pushes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No push devices.</div>
        ) : pushes.map(m => <MethodRow key={m.id} m={m} />)}
      </Section>

      {/* Password (view only) */}
      <div className="opacity-70">
        <div className="px-1 text-xs text-neutral-500">Password (view only)</div>
        <div className="mt-2">
          {pwds.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">No password method found.</div>
          ) : (
            <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5">
              {pwds.map(m => <MethodRow key={m.id} m={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
