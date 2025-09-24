'use client'

import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react'
import {
  Shield, Trash2, CheckCircle2, RefreshCw, Mail, Phone, KeyRound, Smartphone, Lock, AlertTriangle, Plus, X
} from 'lucide-react'

// ---- Reusable section wrapper (no add controls in header) ----
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

// ---- Lightweight Overlay (mock add screens) ----
function Overlay({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-neutral-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

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
  // Keep focus stable only while an input is focused (for future inline edits)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)
  const [focused, setFocused] = useState(null)

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

  // Add flow state (purely mock screens)
  const [addFlow, setAddFlow] = useState(null) // { kind: 'email'|'phone'|'totp'|'push' }

  // Load existing (kept as-is)
  async function load() {
    setErr(''); setLoading(true)
    try {
      const r = await fetch('/api/proxy/myaccount/methods/getMethods', { cache: 'no-store' })
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

  // Groupings
  const emails = useMemo(() => methods.filter(m => m.type === 'email'), [methods])
  const phones = useMemo(() => methods.filter(m => m.type === 'phone'), [methods])
  const totps  = useMemo(() => methods.filter(m => m.type === 'totp'), [methods])
  const pushes = useMemo(() => methods.filter(m => m.type === 'push-notification'), [methods])
  const pwds   = useMemo(() => methods.filter(m => m.type === 'password'), [methods])

  const mapType = (t) => (t === 'email' ? 'email' : t === 'phone' ? 'phone'
    : t === 'totp' ? 'totp' : t === 'push-notification' ? 'push' : 'other')

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

  // ---------------- Delete (kept as-is) --------------------------------------
  function openConfirm(id) {
    setConfirmMap(s => ({ ...s, [id]: { open: true, needsForce: false, busy: false, error: '' } }))
  }
  function closeConfirm(id) {
    setConfirmMap(s => ({ ...s, [id]: { open: false, needsForce: false, busy: false, error: '' } }))
  }

  async function doDelete(id, { force = false } = {}) {
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

  // ---------------- Row -------------------------------------------------------
  const MethodRow = ({ m }) => {
    const confirm = confirmMap[m.id] || { open: false, needsForce: false, busy: false, error: '' }
    const usageStr = (Array.isArray(m.usage) && m.usage.length ? m.usage.join(', ') : 'secondary')

    return (
      <div className="rounded-xl border border-neutral-200">
        {/* Row */}
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

        {/* Delete confirm */}
        {confirm.open && (
          <div className="border-t border-neutral-100 p-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <div className="text-xs text-amber-900">
                  <div className="font-medium">Are you sure?</div>
                  <div className="mt-0.5">
                    Removing this authentication method could make it harder to sign in, especially if it is your only factor.
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

  // ---------------- Add mock screens (console only) ---------------------------
  const AddEmailScreen = () => {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState('prepare')
    return (
      <Overlay title={step === 'prepare' ? 'Add email' : 'Verify email'} onClose={() => setAddFlow(null)}>
        {step === 'prepare' ? (
          <div className="space-y-4">
            <div className="text-sm text-neutral-700">Enter your email. We will send a 6 digit code.</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addEmail:sendCode', { email }); setStep('verify') }}>Send code</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => setAddFlow(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-neutral-700">Enter the code sent to {email || 'your email'}.</div>
            <input inputMode="numeric" pattern="[0-9]*" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} className="h-10 w-40 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200 tracking-widest" />
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addEmail:verify', { email, code }); setMethods(prev => [...prev, { id: 'email|'+Math.random().toString(36).slice(2), type:'email', email, created_at:new Date().toISOString(), confirmed:true, usage:['secondary'] }]); setAddFlow(null) }}>Verify</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => console.log('mock:addEmail:resend', { email })}>Resend</button>
            </div>
          </div>
        )}
      </Overlay>
    )
  }

  const AddPhoneScreen = () => {
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState('prepare')
    return (
      <Overlay title={step === 'prepare' ? 'Add phone' : 'Verify phone'} onClose={() => setAddFlow(null)}>
        {step === 'prepare' ? (
          <div className="space-y-4">
            <div className="text-sm text-neutral-700">Enter your number. We will text a 6 digit code.</div>
            <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addPhone:sendCode', { phone }); setStep('verify') }}>Send code</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => setAddFlow(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-neutral-700">Enter the code sent to {phone || 'your phone'}.</div>
            <input inputMode="numeric" pattern="[0-9]*" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} className="h-10 w-40 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200 tracking-widest" />
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addPhone:verify', { phone, code }); setMethods(prev => [...prev, { id: 'phone|'+Math.random().toString(36).slice(2), type:'phone', phone_number:phone, created_at:new Date().toISOString(), confirmed:true, usage:['secondary'] }]); setAddFlow(null) }}>Verify</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => console.log('mock:addPhone:resend', { phone })}>Resend</button>
            </div>
          </div>
        )}
      </Overlay>
    )
  }

  const AddTotpScreen = () => {
    const [secret] = useState(randBase32(20))
    const [code, setCode] = useState('')
    const [step, setStep] = useState('prepare')
    return (
      <Overlay title={step === 'prepare' ? 'Set up authenticator app' : 'Verify authenticator'} onClose={() => setAddFlow(null)}>
        {step === 'prepare' ? (
          <div className="space-y-4 text-sm">
            <div>Scan or enter this secret in your app.</div>
            <div className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[11px] font-mono w-fit">{secret}</div>
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addTotp:readyToVerify', { secret }); setStep('verify') }}>I scanned it</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => console.log('mock:addTotp:showQr', { secret })}>Show QR</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>Enter the current 6 digit code from your app.</div>
            <input inputMode="numeric" pattern="[0-9]*" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} className="h-10 w-40 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200 tracking-widest" />
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addTotp:verify', { secret, code }); setMethods(prev => [...prev, { id: 'totp|'+Math.random().toString(36).slice(2), type:'totp', created_at:new Date().toISOString(), confirmed:true, usage:['secondary'] }]); setAddFlow(null) }}>Verify</button>
            </div>
          </div>
        )}
      </Overlay>
    )
  }

  const AddPushScreen = () => {
    const [pairCode, setPairCode] = useState(randPair())
    const [step, setStep] = useState('prepare')
    return (
      <Overlay title={step === 'prepare' ? 'Pair push device' : 'Confirm pairing'} onClose={() => setAddFlow(null)}>
        {step === 'prepare' ? (
          <div className="space-y-4 text-sm">
            <div>Open the app on your device and enter this code to begin pairing.</div>
            <div className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[11px] font-mono w-fit">{pairCode}</div>
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addPush:startPairing', { pairCode }); setStep('verify') }}>Start pairing</button>
              <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50" onClick={() => { const next = randPair(); setPairCode(next); console.log('mock:addPush:newCode', { pairCode: next }) }}>New code</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>Approve the pairing on your device, then confirm here.</div>
            <div className="flex gap-2">
              <button className={cx('rounded-lg px-3 py-2 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)} onClick={() => { console.log('mock:addPush:markPaired', { pairCode }); setMethods(prev => [...prev, { id: 'push|'+Math.random().toString(36).slice(2), type:'push-notification', created_at:new Date().toISOString(), confirmed:true, usage:['secondary'] }]); setAddFlow(null) }}>Mark as paired</button>
            </div>
          </div>
        )}
      </Overlay>
    )
  }

  // Helpers for mocks
  function randBase32(n=16){
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    return Array.from({length:n},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join('')
  }
  function randPair(){
    const n = Math.floor(100+Math.random()*900)
    return `${randBase32(3)}-${n}`
  }

  // ---------------------------- Render ---------------------------------------
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
        {emails.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
            No email methods.
          </div>
        ) : emails.map(m => <MethodRow key={m.id} m={m} />)}
        {/* Add action in-body, not in header */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setAddFlow({ kind: 'email' })}
            className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)}
          >
            <Plus className="h-3.5 w-3.5" /> Add email
          </button>
        </div>
      </Section>

      {/* Phone */}
      <Section title="Phone" count={phones.length}>
        {phones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No phone methods.</div>
        ) : phones.map(m => <MethodRow key={m.id} m={m} />)}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setAddFlow({ kind: 'phone' })}
            className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)}
          >
            <Plus className="h-3.5 w-3.5" /> Add phone
          </button>
        </div>
      </Section>

      {/* TOTP */}
      <Section title="TOTP" count={totps.length}>
        {totps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No authenticator app methods.</div>
        ) : totps.map(m => <MethodRow key={m.id} m={m} />)}
        <div className="pt-2">
          <button type="button" onClick={() => setAddFlow({ kind: 'totp' })} className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)}>
            <Plus className="h-3.5 w-3.5" /> Set up authenticator
          </button>
        </div>
      </Section>

      {/* Push */}
      <Section title="Push" count={pushes.length}>
        {pushes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No push devices.</div>
        ) : pushes.map(m => <MethodRow key={m.id} m={m} />)}
        <div className="pt-2">
          <button type="button" onClick={() => setAddFlow({ kind: 'push' })} className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white', tone.bg600, tone.hoverBg500)}>
            <Plus className="h-3.5 w-3.5" /> Pair device
          </button>
        </div>
      </Section>

      {/* Password (view only) */}
      <div className="opacity-70">
        <div className="text-xs text-neutral-500 px-1">Password (view only)</div>
        <div className="mt-2">
          {pwds.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">No password method found.</div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
              {pwds.map(m => <MethodRow key={m.id} m={m} />)}
            </div>
          )}
        </div>
      </div>

      {/* Render mock overlays */}
      {addFlow?.kind === 'email' && <AddEmailScreen />}
      {addFlow?.kind === 'phone' && <AddPhoneScreen />}
      {addFlow?.kind === 'totp' && <AddTotpScreen />}
      {addFlow?.kind === 'push' && <AddPushScreen />}
    </div>
  )
}
