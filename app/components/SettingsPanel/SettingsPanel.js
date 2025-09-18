'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Shield, Mail, Phone, KeyRound, Smartphone, Send, CheckCircle2, Trash2,
  Plus, QrCode, RotateCcw, Info, Lock
} from 'lucide-react'

// shared tone and helpers
const tone = { bg50:'bg-rose-50', text600:'text-rose-600', bg600:'bg-rose-600', hoverBg500:'hover:bg-rose-500', border200:'border-rose-200' }
const cx = (...c) => c.filter(Boolean).join(' ')

// random 6 digit code for mock challenges
const genCode = () => String(Math.floor(100000 + Math.random() * 900000))

// helpers to prevent bubbling and block Enter only where needed
const withStop = (fn) => (e) => { e?.preventDefault?.(); e?.stopPropagation?.(); fn?.(e) }
const stopEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation() } }

/* ===========================
   HOISTED PRESENTATIONAL BITS
   =========================== */

const Tag = ({ children, color = 'neutral' }) => {
  const map = { neutral:'bg-neutral-100 border-neutral-200 text-neutral-700', green:'bg-emerald-50 border-emerald-200 text-emerald-700', blue:'bg-sky-50 border-sky-200 text-sky-700' }
  return <span className={cx('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', map[color])}>{children}</span>
}

const Action = ({ children, onClick, danger, disabled }) => (
  <button
    type="button"
    onClick={withStop(onClick)}
    disabled={disabled}
    className={cx(
      'rounded-lg px-3 py-1.5 text-xs',
      disabled && 'opacity-60 cursor-not-allowed',
      danger ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50'
    )}>
    {children}
  </button>
)

const Primary = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={withStop(onClick)}
    disabled={disabled}
    className={cx('rounded-lg px-3 py-1.5 text-xs text-white shadow-sm transition', disabled ? 'opacity-60 cursor-not-allowed' : '', tone.bg600, tone.hoverBg500)}>
    {children}
  </button>
)

const HeaderCard = () => (
  <div className="rounded-2xl border border-neutral-200 bg-white">
    <div className="flex items-center justify-between gap-3 p-5">
      <div className="flex items-center gap-2">
        <Shield className={cx('h-5 w-5', tone.text600)} />
        <div className="text-base font-semibold">Authentication factors</div>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Info className="h-3.5 w-3.5" />
        Manage your authentication methods
      </div>
    </div>
  </div>
)

const Chip = ({ children }) => <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs">{children}</span>

const Section = ({ icon, title, count, enabledForTenant, children, addArea, isOpen, onToggle, addLabel = 'Add factor' }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white">
    <div className="flex items-center justify-between gap-3 border-b border-neutral-100 p-5">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-base font-semibold">{title}</div>
        <Chip>{count}</Chip>
        {!enabledForTenant && <Tag>disabled by tenant</Tag>}
      </div>
      <button
        type="button"
        onClick={() => enabledForTenant && onToggle()}
        disabled={!enabledForTenant}
        className={cx('inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs',
          'border-neutral-200 bg-white hover:bg-neutral-50',
          !enabledForTenant && 'opacity-60 cursor-not-allowed')}
        aria-expanded={isOpen}
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
    <div className="p-5 space-y-4">
      {children}
      {isOpen && enabledForTenant && addArea}
    </div>
  </div>
)

function ManageRow({
  m,
  openManage, setOpenManage,
  usageStr, fmtDate,
  onRemove,
  apiChallengeEmail, apiChallengePhone,
  apiVerifyEmail, apiVerifyPhone,
  verifyById, setVerifyById,
  setErr,
}) {
  const open = !!openManage[m.id]
  const verified =
    m.type === 'email' ? m.confirmed === true :
    m.type === 'phone' ? m.confirmed !== false : true
  const removable = m.type !== 'password'

  return (
    <div className="rounded-xl border border-neutral-200">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {m.type === 'email' && (m.email || 'Email')}
              {m.type === 'phone' && (m.phone_number || 'Phone')}
              {m.type === 'totp' && 'Authenticator app'}
              {m.type === 'push-notification' && 'Push device'}
              {m.type === 'password' && 'Password'}
            </span>
            {m.type !== 'password' && (verified ? <Tag color="green"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />verified</Tag> : <Tag>unverified</Tag>)}
            <Tag color="blue">{usageStr(m)}</Tag>
          </div>
          <div className="mt-1 text-xs text-neutral-500">{m.created_at ? `Created ${fmtDate(m.created_at)}` : 'Created date not available'}</div>
          <div className="mt-1 text-xs text-neutral-500 break-all">ID: {m.id}</div>
        </div>
        <div className="flex items-center gap-2">
          {(m.type === 'email' || m.type === 'phone') && (
            <Action onClick={() => setOpenManage(s => ({ ...s, [m.id]: !open }))}>
              {open ? 'Hide' : 'Manage'}
            </Action>
          )}
          {removable && (
            <Action onClick={() => onRemove(m.id)} danger>
              <Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove
            </Action>
          )}
        </div>
      </div>
      {open && (m.type === 'email' || m.type === 'phone') && (
        <div className="border-t border-neutral-100 p-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <Action onClick={() => (m.type === 'email' ? apiChallengeEmail(m.id) : apiChallengePhone(m.id))}>
              <Send className="mr-1 inline h-3.5 w-3.5" /> Send code
            </Action>
            <div className="flex items-center gap-2">
              <input
                value={verifyById[m.id] || ''}
                onChange={e => setVerifyById(s => ({ ...s, [m.id]: e.target.value }))}
                onKeyDown={stopEnter}
                autoComplete="off"
                placeholder="Enter code"
                className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              />
              <Primary onClick={async () => {
                try {
                  if (m.type === 'email') {
                    await apiVerifyEmail(m.id, verifyById[m.id] || '')
                  } else {
                    await apiVerifyPhone(m.id, verifyById[m.id] || '')
                  }
                  setVerifyById(s => ({ ...s, [m.id]: '' }))
                  setOpenManage(s => ({ ...s, [m.id]: false }))
                } catch (e) {
                  setErr(String(e?.message || e))
                }
              }}>
                Verify
              </Primary>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===========================
   MAIN COMPONENT
   =========================== */

export default function AuthFactorsPanel() {
  // user methods
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // pending codes per id (can be a session id or a method id)
  const [pendingCodes, setPendingCodes] = useState({})
  // pending phone sessions map: session_id -> { phone }
  const [pendingPhoneSessions, setPendingPhoneSessions] = useState({})

  // tenant catalog
  const [catalog, setCatalog] = useState({ factors: [] })
  const [bootstrapped, setBootstrapped] = useState(false)

  // accordions
  const [openAdd, setOpenAdd] = useState({ email:false, phone:false, totp:false, push:false, password:false })
  const [openManage, setOpenManage] = useState({})

  // add and verify local state
  const [emailInput,setEmailInput] = useState(''); const [emailAddMsg,setEmailAddMsg] = useState(''); const [emailAddCode,setEmailAddCode] = useState(''); const [emailPendingId,setEmailPendingId] = useState('')
  const [phoneInput,setPhoneInput] = useState(''); const [phoneAddMsg,setPhoneAddMsg] = useState(''); const [phoneAddCode,setPhoneAddCode] = useState(''); const [phonePendingId,setPhonePendingId] = useState('')
  const [totpPending,setTotpPending] = useState(null); const [totpCode,setTotpCode] = useState('')
  const [pushPending,setPushPending] = useState(null); const [pushCode,setPushCode] = useState('')
  const [pwdCurrent,setPwdCurrent] = useState(''); const [pwdNew1,setPwdNew1] = useState(''); const [pwdNew2,setPwdNew2] = useState(''); const [pwdMsg,setPwdMsg] = useState('')
  const [verifyById, setVerifyById] = useState({})

  // normalize API payloads to the shape this UI expects
  function normalizeMethods(raw) {
    const arr = Array.isArray(raw) ? raw
      : (raw?.data || raw?.methods || raw?.authentication_methods || [])
    return (arr || []).map((m) => ({
      id: m.id || `${m.type}|${m.sid || m.identifier || m.phone_number || m.email || Math.random().toString(36).slice(2)}`,
      type: m.type,
      email: m.email,
      phone_number: m.phone_number || m.phone,
      created_at: m.created_at || m.createdAt || m.updated_at || undefined,
      usage: m.usage || (m.is_primary ? ['primary'] : ['secondary']),
      confirmed: (m.confirmed ?? m.verified ?? (m.status === 'verified' ? true : undefined)),
    }))
  }

  // bootstrap once from your Edge API route
  async function load() {
    if (bootstrapped) return
    setErr(''); setLoading(true)
    try {
      // fetch existing methods for the user (proxied with cookies)
      const r = await fetch('/api/proxy/myaccount/methods', { cache: 'no-store' })
      if (!r.ok) throw new Error(`Load methods failed: ${r.status}`)
      const ct = r.headers.get('content-type') || ''
      const raw = ct.includes('application/json') ? await r.json() : await r.text()
      const normalized = normalizeMethods(raw)
      setMethods(normalized)

      // enable all factor types for demo (adjust if you also proxy a tenant factor catalog)
      setCatalog({ factors: [
        { type: 'password' }, { type: 'email' }, { type: 'phone' }, { type: 'totp' }, { type: 'push-notification' },
      ]})

      setBootstrapped(true)
    } catch (e) {
      setErr(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, []) // no wrapper that captures events, so focus stays stable

  // enabled types from tenant
  const enabled = useMemo(() => new Set((catalog.factors || []).map(f => f.type)), [catalog])

  // buckets
  const emails = useMemo(() => methods.filter(m => m.type === 'email'), [methods])
  const phones = useMemo(() => methods.filter(m => m.type === 'phone'), [methods])
  const totps  = useMemo(() => methods.filter(m => m.type === 'totp'), [methods])
  const pushes = useMemo(() => methods.filter(m => m.type === 'push-notification'), [methods])
  const passwords = useMemo(() => methods.filter(m => m.type === 'password'), [methods])

  const fmtDate = s => (s ? new Date(s).toLocaleString() : '')
  const usageStr = m => (Array.isArray(m?.usage) && m.usage.length ? m.usage.join(', ') : 'secondary')

  // ---- Mock API functions that mutate local state ----

  async function apiAddEmail(email){
    const id = `email|${Date.now()}`
    const code = genCode()
    const now = new Date().toISOString()
    setMethods(prev => [{ id, type:'email', email, confirmed:false, usage:['secondary'], created_at: now }, ...prev])
    setPendingCodes(prev => ({ ...prev, [id]: code }))
    console.log('Mock email code', { id, email, code })
    return { id, message:'Verification email sent. Check console for the code.' }
  }
  async function apiChallengeEmail(id){
    const code = genCode()
    setPendingCodes(prev => ({ ...prev, [id]: code }))
    console.log('Mock email resend code', { id, code })
    return { ok:true }
  }
  async function apiVerifyEmail(id,code){
    const expected = pendingCodes[id]
    if (!expected) throw new Error('No pending verification for this email')
    if (String(code).trim() !== String(expected)) throw new Error('Invalid code')
    setMethods(prev => prev.map(m => m.id === id ? { ...m, confirmed:true } : m))
    setPendingCodes(prev => { const { [id]:_, ...rest } = prev; return rest })
    return { ok:true }
  }

  // PHONE: start with challenge, add factor only after verify
  async function apiAddPhone(phone){
    const session_id = `phone-session|${Date.now()}`
    const code = genCode()
    setPendingPhoneSessions(prev => ({ ...prev, [session_id]: { phone } }))
    setPendingCodes(prev => ({ ...prev, [session_id]: code }))
    console.log('Mock SMS code', { session_id, phone, code })
    return { session_id, message:'SMS code sent. Check console for the code.' }
  }
  async function apiChallengePhone(id){
    const code = genCode()
    setPendingCodes(prev => ({ ...prev, [id]: code }))
    const session = pendingPhoneSessions[id]
    const exists = methods.find(m => m.id === id)
    if (session) console.log('Mock SMS resend (pending session)', { id, phone: session.phone, code })
    else if (exists) console.log('Mock SMS resend (existing factor)', { id, phone: exists.phone_number, code })
    else console.log('Mock SMS resend', { id, code })
    return { ok:true }
  }
  async function apiVerifyPhone(id,code){
    const expected = pendingCodes[id]
    if (!expected) throw new Error('No pending verification for this phone')
    if (String(code).trim() !== String(expected)) throw new Error('Invalid code')

    const session = pendingPhoneSessions[id]
    if (session) {
      const now = new Date().toISOString()
      const newId = `phone|${Date.now()}`
      setMethods(prev => [{ id:newId, type:'phone', phone_number: session.phone, confirmed:true, usage:['secondary'], created_at: now }, ...prev])
      setPendingPhoneSessions(prev => { const { [id]:_, ...rest } = prev; return rest })
      setPendingCodes(prev => { const { [id]:_, ...rest } = prev; return rest })
      return { ok:true, created_id: newId }
    }
    setMethods(prev => prev.map(m => m.id === id ? { ...m, confirmed:true } : m))
    setPendingCodes(prev => { const { [id]:_, ...rest } = prev; return rest })
    return { ok:true }
  }

  async function apiStartTotp(){
    const secret = 'EXAMPLESECRETBASE32'
    const otpauth_url = 'otpauth://totp/App:user@example.com?secret=EXAMPLESECRETBASE32&issuer=App'
    const session_id = `totp-${Date.now()}`
    return { secret, otpauth_url, session_id }
  }
  async function apiConfirmTotp(sessionId,code){
    if (!code || String(code).length !== 6) throw new Error('Enter a 6 digit code')
    const now = new Date().toISOString()
    const id = `totp|${Date.now()}`
    setMethods(prev => [{ id, type:'totp', confirmed:true, usage:['secondary'], created_at: now }, ...prev])
    return { ok:true }
  }

  async function apiStartPush(){
    const activation_code = `${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.floor(1000+Math.random()*9000)}`
    const session_id = `push-${Date.now()}`
    return { activation_code, session_id }
  }
  async function apiConfirmPush(sessionId,code){
    const now = new Date().toISOString()
    const id = `push|${Date.now()}`
    setMethods(prev => [{ id, type:'push-notification', confirmed:true, usage:['secondary'], created_at: now }, ...prev])
    return { ok:true }
  }

  async function apiRemove(id){
    setMethods(prev => prev.filter(x => x.id !== id))
    setPendingCodes(prev => { const { [id]:_, ...rest } = prev; return rest })
    setPendingPhoneSessions(prev => { const { [id]:_, ...rest } = prev; return rest })
    return { ok:true }
  }

  async function apiUpdatePassword(current_password,new_password){
    if (!new_password) return { ok:false, message:'Enter a new password' }
    const now = new Date().toISOString()
    const exists = methods.find(m => m.type === 'password')
    if (exists) {
      setMethods(prev => prev.map(m => m.id === exists.id ? { ...m, updated_at: now } : m))
    } else {
      setMethods(prev => [{ id:'password|1', type:'password', created_at: now, usage:['primary'] }, ...prev])
    }
    return { ok:true, message:'Password updated' }
  }

  // flows
  const onAddEmail = withStop(async () => {
    if(!emailInput) return
    try {
      const r = await apiAddEmail(emailInput)
      setEmailPendingId(r.id)
      setEmailAddMsg(r.message||'')
      setEmailInput('')
    } catch (e) { setErr(String(e?.message || e)) }
  })
  const onVerifyEmail = withStop(async () => {
    if(!emailPendingId||!emailAddCode) return
    try { await apiVerifyEmail(emailPendingId,emailAddCode); setEmailAddCode(''); setEmailPendingId('') }
    catch (e) { setErr(String(e?.message || e)) }
  })
  const onResendEmail = withStop(async () => {
    if(!emailPendingId) return
    await apiChallengeEmail(emailPendingId); setEmailAddMsg('Verification sent again')
  })

  const onAddPhone = withStop(async () => {
    if(!phoneInput) return
    try {
      const r = await apiAddPhone(phoneInput)
      setPhonePendingId(r.session_id)
      setPhoneAddMsg(r.message||'')
      setPhoneInput('')
    } catch (e) { setErr(String(e?.message || e)) }
  })
  const onVerifyPhone = withStop(async () => {
    if(!phonePendingId||!phoneAddCode) return
    try {
      await apiVerifyPhone(phonePendingId,phoneAddCode)
      setPhoneAddCode(''); setPhonePendingId(''); setPhoneAddMsg('')
      setOpenAdd(s => ({ ...s, phone:false }))
    } catch (e) { setErr(String(e?.message || e)) }
  })
  const onResendPhone = withStop(async () => {
    if(!phonePendingId) return
    await apiChallengePhone(phonePendingId); setPhoneAddMsg('Code sent again')
  })

  const onStartTotp = withStop(async () => { const p = await apiStartTotp(); setTotpPending(p) })
  const onConfirmTotp = withStop(async () => {
    if(!totpPending||!totpCode) return
    try { await apiConfirmTotp(totpPending.session_id,totpCode); setTotpCode(''); setTotpPending(null) }
    catch (e) { setErr(String(e?.message || e)) }
  })

  const onStartPush = withStop(async () => { const p = await apiStartPush(); setPushPending(p) })
  const onConfirmPush = withStop(async () => {
    if(!pushPending) return
    try { await apiConfirmPush(pushPending.session_id,pushCode||undefined); setPushCode(''); setPushPending(null) }
    catch (e) { setErr(String(e?.message || e)) }
  })

  const onUpdatePassword = withStop(async () => {
    setPwdMsg('')
    if(!pwdNew1||!pwdNew2){ setPwdMsg('Enter the new password twice'); return }
    if(pwdNew1!==pwdNew2){ setPwdMsg('New passwords do not match'); return }
    const r = await apiUpdatePassword(pwdCurrent,pwdNew1)
    if(r?.ok){ setPwdMsg(r.message||'Password updated'); setPwdCurrent(''); setPwdNew1(''); setPwdNew2(''); setOpenAdd(s=>({...s,password:false})) }
    else { setPwdMsg(r?.message||'Update failed') }
  })

  async function onRemove(id){
    const m = methods.find(x => x.id === id)
    if(m?.type==='password') return
    await apiRemove(id)
  }

  const cancelPhoneFlow = () => {
    if (phonePendingId) {
      setPendingCodes(prev => { const { [phonePendingId]:_, ...rest } = prev; return rest })
      setPendingPhoneSessions(prev => { const { [phonePendingId]:_, ...rest } = prev; return rest })
    }
    setPhoneInput(''); setPhonePendingId(''); setPhoneAddCode(''); setPhoneAddMsg('')
    setOpenAdd(s=>({...s,phone:false}))
  }

  return (
    <div className="space-y-6">{/* no global guard wrapper */}
      <HeaderCard />
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {loading && <div className="text-sm text-neutral-500">Loading...</div>}

      {/* Password */}
      <Section
        icon={<Lock className={cx('h-4 w-4', tone.text600)} />}
        title="Password"
        count={passwords.length}
        enabledForTenant={true}
        isOpen={openAdd.password}
        onToggle={() => setOpenAdd(s => ({ ...s, password: !s.password }))}
        addLabel="Change password"
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-sm font-medium">Update password</div>
            <p className="mt-1 text-xs text-neutral-600">Enter your current password, then a new one.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input type="password" value={pwdCurrent} onChange={e=>setPwdCurrent(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="Current password" className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <input type="password" value={pwdNew1}    onChange={e=>setPwdNew1(e.target.value)}    onKeyDown={stopEnter} autoComplete="off" placeholder="New password"     className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <input type="password" value={pwdNew2}    onChange={e=>setPwdNew2(e.target.value)}    onKeyDown={stopEnter} autoComplete="off" placeholder="Confirm new password" className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
            </div>
            {pwdMsg && <div className="mt-2 text-xs text-neutral-600">{pwdMsg}</div>}
            <div className="mt-3 flex items-center gap-2">
              <Primary onClick={onUpdatePassword}>Save password</Primary>
              <Action onClick={() => { setPwdCurrent(''); setPwdNew1(''); setPwdNew2(''); setPwdMsg(''); setOpenAdd(s=>({...s,password:false})) }}>Cancel</Action>
            </div>
          </div>
        )}
      >
        {passwords.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No password factor found. Use Change password to create or reset it.</div>
          : <div className="space-y-3">{passwords.map(m => (
              <ManageRow
                key={m.id}
                m={m}
                openManage={openManage}
                setOpenManage={setOpenManage}
                usageStr={usageStr}
                fmtDate={fmtDate}
                onRemove={onRemove}
                apiChallengeEmail={apiChallengeEmail}
                apiChallengePhone={apiChallengePhone}
                apiVerifyEmail={apiVerifyEmail}
                apiVerifyPhone={apiVerifyPhone}
                verifyById={verifyById}
                setVerifyById={setVerifyById}
                setErr={setErr}
              />
            ))}</div>
        }
      </Section>

      {/* Email */}
      <Section
        icon={<Mail className={cx('h-4 w-4', tone.text600)} />}
        title="Email"
        count={emails.length}
        enabledForTenant={enabled.has('email')}
        isOpen={openAdd.email}
        onToggle={() => setOpenAdd(s => ({ ...s, email: !s.email }))}
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-sm font-medium">Add an email factor</div>
            <p className="mt-1 text-xs text-neutral-600">We will send a verification to the address.</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input type="email" value={emailInput} onChange={e=>setEmailInput(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="name@example.com" className="h-9 w-64 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <Primary onClick={onAddEmail}><Plus className="mr-1 inline h-3.5 w-3.5" />Add</Primary>
              <Action onClick={() => { setEmailInput(''); setEmailPendingId(''); setEmailAddCode(''); setEmailAddMsg(''); setOpenAdd(s=>({...s,email:false})) }}>Cancel</Action>
            </div>
            {emailPendingId && (
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                {emailAddMsg && <div className="mb-2 text-xs text-neutral-600">{emailAddMsg}</div>}
                <div className="flex flex-wrap items-center gap-2">
                  <Action onClick={() => { onResendEmail() }}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Resend</Action>
                  <input value={emailAddCode} onChange={e=>setEmailAddCode(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="Enter code" className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onVerifyEmail}>Verify</Primary>
                </div>
              </div>
            )}
          </div>
        )}
      >
        {emails.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No email factors. Use Add factor to create one.</div>
          : <div className="space-y-3">
              {emails.map(m => (
                <ManageRow
                  key={m.id}
                  m={m}
                  openManage={openManage}
                  setOpenManage={setOpenManage}
                  usageStr={usageStr}
                  fmtDate={fmtDate}
                  onRemove={onRemove}
                  apiChallengeEmail={apiChallengeEmail}
                  apiChallengePhone={apiChallengePhone}
                  apiVerifyEmail={apiVerifyEmail}
                  apiVerifyPhone={apiVerifyPhone}
                  verifyById={verifyById}
                  setVerifyById={setVerifyById}
                  setErr={setErr}
                />
              ))}
            </div>
        }
      </Section>

      {/* Phone */}
      <Section
        icon={<Phone className={cx('h-4 w-4', tone.text600)} />}
        title="Phone"
        count={phones.length}
        enabledForTenant={enabled.has('phone')}
        isOpen={openAdd.phone}
        onToggle={() => setOpenAdd(s => ({ ...s, phone: !s.phone }))}
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-sm font-medium">Add a phone factor</div>
            <p className="mt-1 text-xs text-neutral-600">We will send an SMS code to verify first. The factor is created only after you confirm.</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input type="tel" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="+1 555 123 4567" className="h-9 w-64 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <Primary onClick={onAddPhone}><Plus className="mr-1 inline h-3.5 w-3.5" />Send code</Primary>
              <Action onClick={cancelPhoneFlow}>Cancel</Action>
            </div>
            {phonePendingId && (
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                {phoneAddMsg && <div className="mb-2 text-xs text-neutral-600">{phoneAddMsg}</div>}
                <div className="flex flex-wrap items-center gap-2">
                  <Action onClick={onResendPhone}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Resend</Action>
                  <input value={phoneAddCode} onChange={e=>setPhoneAddCode(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="Enter code" className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onVerifyPhone}>Verify</Primary>
                </div>
              </div>
            )}
          </div>
        )}
      >
        {phones.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No phone factors. Use Add factor to create one.</div>
          : <div className="space-y-3">
              {phones.map(m => (
                <ManageRow
                  key={m.id}
                  m={m}
                  openManage={openManage}
                  setOpenManage={setOpenManage}
                  usageStr={usageStr}
                  fmtDate={fmtDate}
                  onRemove={onRemove}
                  apiChallengeEmail={apiChallengeEmail}
                  apiChallengePhone={apiChallengePhone}
                  apiVerifyEmail={apiVerifyEmail}
                  apiVerifyPhone={apiVerifyPhone}
                  verifyById={verifyById}
                  setVerifyById={setVerifyById}
                  setErr={setErr}
                />
              ))}
            </div>
        }
      </Section>

      {/* TOTP */}
      <Section
        icon={<KeyRound className={cx('h-4 w-4', tone.text600)} />}
        title="TOTP"
        count={totps.length}
        enabledForTenant={enabled.has('totp')}
        isOpen={openAdd.totp}
        onToggle={() => setOpenAdd(s => ({ ...s, totp: !s.totp }))}
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            {!totpPending ? (
              <>
                <div className="text-sm font-medium">Add a TOTP factor</div>
                <p className="mt-1 text-xs text-neutral-600">Use an authenticator app. Scan the QR or enter the secret, then enter a 6 digit code.</p>
                <div className="mt-2 flex items-center gap-2">
                  <Primary onClick={onStartTotp}><Plus className="mr-1 inline h-3.5 w-3.5" />Start</Primary>
                  <Action onClick={() => { setOpenAdd(s=>({...s, totp:false})); setTotpPending(null); setTotpCode('') }}>Cancel</Action>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm font-medium"><QrCode className="h-4 w-4" /> Finish TOTP setup</div>
                <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs break-words">
                  <div><span className="font-medium">Secret:</span> {totpPending.secret}</div>
                  <div className="mt-1"><span className="font-medium">otpauth URL:</span> {totpPending.otpauth_url}</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input value={totpCode} onChange={e=>setTotpCode(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="Enter 6 digit code" className="h-9 w-48 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onConfirmTotp}>Confirm</Primary>
                  <Action onClick={() => { setTotpPending(null); setTotpCode('') }}>Cancel</Action>
                </div>
              </>
            )}
          </div>
        )}
      >
        {totps.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No TOTP factors. Use Add factor to create one.</div>
          : <div className="space-y-3">{totps.map(m => (
              <div key={m.id} className="rounded-xl border border-neutral-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-medium">Authenticator app</span><Tag color="blue">{usageStr(m)}</Tag></div>
                    <div className="mt-1 text-xs text-neutral-500">{m.created_at ? `Created ${fmtDate(m.created_at)}` : 'Created date not available'}</div>
                    <div className="mt-1 text-xs text-neutral-500 break-all">ID: {m.id}</div>
                  </div>
                  <Action onClick={() => onRemove(m.id)} danger><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove</Action>
                </div>
              </div>
            ))}</div>
        }
      </Section>

      {/* Push */}
      <Section
        icon={<Smartphone className={cx('h-4 w-4', tone.text600)} />}
        title="Push"
        count={pushes.length}
        enabledForTenant={enabled.has('push-notification')}
        isOpen={openAdd.push}
        onToggle={() => setOpenAdd(s => ({ ...s, push: !s.push }))}
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            {!pushPending ? (
              <>
                <div className="text-sm font-medium">Add a push factor</div>
                <p className="mt-1 text-xs text-neutral-600">You will get an activation code to enter in the mobile app.</p>
                <div className="mt-2 flex items-center gap-2">
                  <Primary onClick={onStartPush}><Plus className="mr-1 inline h-3.5 w-3.5" />Start</Primary>
                  <Action onClick={() => { setOpenAdd(s=>({...s,push:false})); setPushPending(null); setPushCode('') }}>Cancel</Action>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium">Finish push setup</div>
                <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs">
                  <span className="font-medium">Activation code:</span> {pushPending.activation_code}
                </div>
                <p className="mt-2 text-xs text-neutral-600">Enter the code in your app. If your backend needs a confirmation code, enter it below.</p>
                <div className="mt-3 flex items-center gap-2">
                  <input value={pushCode} onChange={e=>setPushCode(e.target.value)} onKeyDown={stopEnter} autoComplete="off" placeholder="Optional confirmation code" className="h-9 w-64 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onConfirmPush}>Done</Primary>
                  <Action onClick={() => { setPushPending(null); setPushCode('') }}>Cancel</Action>
                </div>
              </>
            )}
          </div>
        )}
      >
        {pushes.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No push factors. Use Add factor to create one.</div>
          : <div className="space-y-3">{pushes.map(m => (
              <div key={m.id} className="rounded-xl border border-neutral-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-medium">Push device</span><Tag color="blue">{usageStr(m)}</Tag></div>
                    <div className="mt-1 text-xs text-neutral-500">{m.created_at ? `Created ${fmtDate(m.created_at)}` : 'Created date not available'}</div>
                    <div className="mt-1 text-xs text-neutral-500 break-all">ID: {m.id}</div>
                  </div>
                  <Action onClick={() => onRemove(m.id)} danger><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove</Action>
                </div>
              </div>
            ))}</div>
      }
      </Section>
    </div>
  )
}
