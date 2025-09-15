'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Shield, Mail, Phone, KeyRound, Smartphone, Send, CheckCircle2, Trash2,
  Plus, QrCode, RotateCcw, Info, Lock
} from 'lucide-react'

const tone = { bg50:'bg-rose-50', text600:'text-rose-600', bg600:'bg-rose-600', hoverBg500:'hover:bg-rose-500', border200:'border-rose-200' }
const cx = (...c) => c.filter(Boolean).join(' ')

export default function AuthFactorsPanel() {
  // user methods
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // tenant catalog
  const [catalog, setCatalog] = useState({ factors: [] })

  // accordions
  const [openAdd, setOpenAdd] = useState({ email:false, phone:false, totp:false, push:false, password:false })
  const [openManage, setOpenManage] = useState({})

  // add/verify local state (same as before) ...
  const [emailInput,setEmailInput] = useState(''); const [emailAddMsg,setEmailAddMsg] = useState(''); const [emailAddCode,setEmailAddCode] = useState(''); const [emailPendingId,setEmailPendingId] = useState('')
  const [phoneInput,setPhoneInput] = useState(''); const [phoneAddMsg,setPhoneAddMsg] = useState(''); const [phoneAddCode,setPhoneAddCode] = useState(''); const [phonePendingId,setPhonePendingId] = useState('')
  const [totpPending,setTotpPending] = useState(null); const [totpCode,setTotpCode] = useState('')
  const [pushPending,setPushPending] = useState(null); const [pushCode,setPushCode] = useState('')
  const [pwdCurrent,setPwdCurrent] = useState(''); const [pwdNew1,setPwdNew1] = useState(''); const [pwdNew2,setPwdNew2] = useState(''); const [pwdMsg,setPwdMsg] = useState('')
  const [verifyById, setVerifyById] = useState({})

  // --- fetch both endpoints
  async function load() {
    setErr(''); setLoading(true)
    try {
      const [mRes, cRes] = await Promise.all([
        fetch('/api/proxy/myaccount/methods', { cache: 'no-store' }),
        fetch('/api/proxy/myaccount/factors',  { cache: 'no-store' }),
      ])
      const mJson = await mRes.json()
      const cJson = await cRes.json()
      if (!mRes.ok) throw new Error(mJson?.error_description || mJson?.error || `HTTP ${mRes.status}`)
      if (!cRes.ok) throw new Error(cJson?.error_description || cJson?.error || `HTTP ${cRes.status}`)
      setMethods(Array.isArray(mJson?.authentication_methods) ? mJson.authentication_methods : [])
      setCatalog({ factors: Array.isArray(cJson?.factors) ? cJson.factors : [] })
    } catch (e) {
      setErr(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  // enabled types from tenant
  const enabled = useMemo(() => new Set((catalog.factors || []).map(f => f.type)), [catalog])

  // buckets & counts
  const emails = useMemo(() => methods.filter(m => m.type === 'email'), [methods])
  const phones = useMemo(() => methods.filter(m => m.type === 'phone'), [methods])
  const totps  = useMemo(() => methods.filter(m => m.type === 'totp'), [methods])
  const pushes = useMemo(() => methods.filter(m => m.type === 'push-notification'), [methods])
  const passwords = useMemo(() => methods.filter(m => m.type === 'password'), [methods])

  const fmtDate = s => (s ? new Date(s).toLocaleString() : '')
  const usageStr = m => (Array.isArray(m?.usage) && m.usage.length ? m.usage.join(', ') : 'secondary')

  // ---- API stubs (unchanged) ----
  async function apiAddEmail(email){ console.log('Add email', {email}); return { id:`email|${Date.now()}`, message:'Verification email sent' } }
  async function apiChallengeEmail(id){ console.log('Challenge email', {id}) }
  async function apiVerifyEmail(id,code){ console.log('Verify email', {id,code}) }
  async function apiAddPhone(phone){ console.log('Add phone', {phone}); return { id:`phone|${Date.now()}`, message:'SMS code sent' } }
  async function apiChallengePhone(id){ console.log('Challenge phone', {id}) }
  async function apiVerifyPhone(id,code){ console.log('Verify phone', {id,code}) }
  async function apiStartTotp(){ console.log('Start TOTP'); return { secret:'EXAMPLESECRETBASE32', otpauth_url:'otpauth://totp/App:user@example.com?secret=EXAMPLESECRETBASE32&issuer=App', session_id:`totp-${Date.now()}` } }
  async function apiConfirmTotp(sessionId,code){ console.log('Confirm TOTP', {sessionId,code}) }
  async function apiStartPush(){ console.log('Start push'); return { activation_code:'ABCD-1234', session_id:`push-${Date.now()}` } }
  async function apiConfirmPush(sessionId,code){ console.log('Confirm push', {sessionId,code}) }
  async function apiRemove(id){ console.log('Remove factor', {id}) }
  async function apiUpdatePassword(current_password,new_password){ console.log('Update password',{current_password,new_password}); return { ok:true, message:'Password updated' } }

  // flows (unchanged) ...
  async function onAddEmail(){ if(!emailInput) return; const r=await apiAddEmail(emailInput); setEmailPendingId(r.id); setEmailAddMsg(r.message||''); setEmailInput(''); await load() }
  async function onVerifyEmail(){ if(!emailPendingId||!emailAddCode) return; await apiVerifyEmail(emailPendingId,emailAddCode); setEmailAddCode(''); setEmailPendingId(''); await load() }
  async function onResendEmail(){ if(!emailPendingId) return; await apiChallengeEmail(emailPendingId); setEmailAddMsg('Verification sent again') }
  async function onAddPhone(){ if(!phoneInput) return; const r=await apiAddPhone(phoneInput); setPhonePendingId(r.id); setPhoneAddMsg(r.message||''); setPhoneInput(''); await load() }
  async function onVerifyPhone(){ if(!phonePendingId||!phoneAddCode) return; await apiVerifyPhone(phonePendingId,phoneAddCode); setPhoneAddCode(''); setPhonePendingId(''); await load() }
  async function onResendPhone(){ if(!phonePendingId) return; await apiChallengePhone(phonePendingId); setPhoneAddMsg('Code sent again') }
  async function onStartTotp(){ const p=await apiStartTotp(); setTotpPending(p) }
  async function onConfirmTotp(){ if(!totpPending||!totpCode) return; await apiConfirmTotp(totpPending.session_id,totpCode); setTotpCode(''); setTotpPending(null); await load() }
  async function onStartPush(){ const p=await apiStartPush(); setPushPending(p) }
  async function onConfirmPush(){ if(!pushPending) return; await apiConfirmPush(pushPending.session_id,pushCode||undefined); setPushCode(''); setPushPending(null); await load() }
  async function onUpdatePassword(){ setPwdMsg(''); if(!pwdNew1||!pwdNew2){ setPwdMsg('Enter the new password twice'); return } if(pwdNew1!==pwdNew2){ setPwdMsg('New passwords do not match'); return } const r=await apiUpdatePassword(pwdCurrent,pwdNew1); if(r?.ok){ setPwdMsg(r.message||'Password updated'); setPwdCurrent(''); setPwdNew1(''); setPwdNew2(''); await load(); setOpenAdd(s=>({...s,password:false})) } else { setPwdMsg(r?.message||'Update failed') } }
  async function onRemove(id){ const m=methods.find(x=>x.id===id); if(m?.type==='password') return; await apiRemove(id); setMethods(prev=>prev.filter(x=>x.id!==id)) }

  // UI atoms
  const Tag = ({ children, color = 'neutral' }) => {
    const map = { neutral:'bg-neutral-100 border-neutral-200 text-neutral-700', green:'bg-emerald-50 border-emerald-200 text-emerald-700', blue:'bg-sky-50 border-sky-200 text-sky-700' }
    return <span className={cx('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', map[color])}>{children}</span>
  }
  const Action = ({ children, onClick, danger, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled}
      className={cx(
        'rounded-lg px-3 py-1.5 text-xs',
        disabled && 'opacity-60 cursor-not-allowed',
        danger ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50'
      )}>
      {children}
    </button>
  )
  const Primary = ({ children, onClick, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled}
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
          Tenant enables: {Array.from(enabled).join(', ') || '—'}
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

  const ManageRow = ({ m }) => {
    const open = !!openManage[m.id]
    const verified = m.type === 'email' ? m.confirmed === true : m.type === 'phone' ? m.confirmed !== false : true
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
                  placeholder="Enter code"
                  className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                />
                <Primary onClick={() => (m.type === 'email'
                  ? apiVerifyEmail(m.id, verifyById[m.id] || '')
                  : apiVerifyPhone(m.id, verifyById[m.id] || '')
                )}>
                  Verify
                </Primary>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <HeaderCard />
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {loading && <div className="text-sm text-neutral-500">Loading...</div>}

      {/* Password */}
      <Section
        icon={<Lock className={cx('h-4 w-4', tone.text600)} />}
        title="Password"
        count={passwords.length}
        enabledForTenant={true /* password is always available */}
        isOpen={openAdd.password}
        onToggle={() => setOpenAdd(s => ({ ...s, password: !s.password }))}
        addLabel="Change password"
        addArea={(
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-sm font-medium">Update password</div>
            <p className="mt-1 text-xs text-neutral-600">Enter your current password, then a new one.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input type="password" value={pwdCurrent} onChange={e=>setPwdCurrent(e.target.value)} placeholder="Current password" className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <input type="password" value={pwdNew1}    onChange={e=>setPwdNew1(e.target.value)}    placeholder="New password"     className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <input type="password" value={pwdNew2}    onChange={e=>setPwdNew2(e.target.value)}    placeholder="Confirm new password" className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
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
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No password factor found. Use Change password to create/reset it.</div>
          : <div className="space-y-3">{passwords.map(m => <ManageRow key={m.id} m={m} />)}</div>
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
              <input type="email" value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="name@example.com" className="h-9 w-64 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <Primary onClick={onAddEmail}><Plus className="mr-1 inline h-3.5 w-3.5" />Add</Primary>
              <Action onClick={() => { setEmailInput(''); setEmailPendingId(''); setEmailAddCode(''); setEmailAddMsg(''); setOpenAdd(s=>({...s,email:false})) }}>Cancel</Action>
            </div>
            {emailPendingId && (
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                {emailAddMsg && <div className="mb-2 text-xs text-neutral-600">{emailAddMsg}</div>}
                <div className="flex flex-wrap items-center gap-2">
                  <Action onClick={onResendEmail}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Resend</Action>
                  <input value={emailAddCode} onChange={e=>setEmailAddCode(e.target.value)} placeholder="Enter code" className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onVerifyEmail}>Verify</Primary>
                </div>
              </div>
            )}
          </div>
        )}
      >
        {emails.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No email factors. Use Add factor to create one.</div>
          : <div className="space-y-3">{emails.map(m => <ManageRow key={m.id} m={m} />)}</div>
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
            <p className="mt-1 text-xs text-neutral-600">We will send an SMS code to verify.</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input type="tel" value={phoneInput} onChange={e=>setPhoneInput(e.target.value)} placeholder="+1 555 123 4567" className="h-9 w-64 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <Primary onClick={onAddPhone}><Plus className="mr-1 inline h-3.5 w-3.5" />Add</Primary>
              <Action onClick={() => { setPhoneInput(''); setPhonePendingId(''); setPhoneAddCode(''); setPhoneAddMsg(''); setOpenAdd(s=>({...s,phone:false})) }}>Cancel</Action>
            </div>
            {phonePendingId && (
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                {phoneAddMsg && <div className="mb-2 text-xs text-neutral-600">{phoneAddMsg}</div>}
                <div className="flex flex-wrap items-center gap-2">
                  <Action onClick={onResendPhone}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Resend</Action>
                  <input value={phoneAddCode} onChange={e=>setPhoneAddCode(e.target.value)} placeholder="Enter code" className="h-9 w-44 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                  <Primary onClick={onVerifyPhone}>Verify</Primary>
                </div>
              </div>
            )}
          </div>
        )}
      >
        {phones.length === 0
          ? <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">No phone factors. Use Add factor to create one.</div>
          : <div className="space-y-3">{phones.map(m => <ManageRow key={m.id} m={m} />)}</div>
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
                  <input value={totpCode} onChange={e=>setTotpCode(e.target.value)} placeholder="Enter 6 digit code" className="h-9 w-48 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
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
                  <input value={pushCode} onChange={e=>setPushCode(e.target.value)} placeholder="Optional confirmation code" className="h-9 w-64 rounded-lg border border-neutral-200 px-2 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
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
