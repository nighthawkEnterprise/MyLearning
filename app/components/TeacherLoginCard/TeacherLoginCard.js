// app/components/TeacherLoginCard.js
'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function TeacherLoginCard({
  onSubmit,
  redirectTo = '/teacher',
  className = '',
  title = 'Faculty sign in',
}) {
  const router = useRouter()

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // steps: login | enroll-phone | verify-phone
  const [step, setStep] = useState('login')
  const [mfa, setMfa] = useState({
    token: '',
    phone: '',
    oobCode: '',
    bindingMethod: '',
    authenticatorId: '',
  })
  const [smsCode, setSmsCode] = useState('')

  async function persistSessionFrom(data) {
    const access_token  = data?.access_token || data?.accessToken || data?.token
    const refresh_token = data?.refresh_token || data?.refreshToken
    const expires_in    = data?.expires_in
    if (!access_token) return false
    await axios.post('/api/teacher/session', { access_token, refresh_token, expires_in }, {
      headers: { 'content-type': 'application/json' },
    })
    return true
  }

  async function finishSuccess(payload) {
    try {
      onSubmit?.(payload)
    } finally {
      if (redirectTo) {
        router.push(redirectTo)
        router.refresh()
      }
    }
  }

  // Submit checks mfa_requirements. If phone challenge is allowed, try to challenge using existing SMS authenticator.
  // If none exists, fall back to enroll.
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const { data } = await axios.post('/api/teacher/login', {
        username: form.username,
        password: form.password,
      })

      if (data?.access_token || data?.accessToken || data?.token) {
        await persistSessionFrom(data)
        await finishSuccess({ ok: true })
        return
      }

      if (data?.ok) {
        await finishSuccess({ ok: true })
        return
      }

      throw new Error('No tokens or ok:true returned from login endpoint')
    } catch (err) {
      const resData = err?.response?.data
      const code = resData?.error

      if (code === 'mfa_required' && resData?.mfa_token) {
        const mfaToken = resData.mfa_token
        setMfa(m => ({ ...m, token: mfaToken }))

        const challengeTypes = (resData?.mfa_requirements?.challenge || []).map(x => x?.type)
        const canChallengePhone = challengeTypes.includes('phone')

        if (canChallengePhone) {
          const smsAuth = await getActiveSmsAuthenticator(mfaToken)
          if (smsAuth?.id) {
            await startSmsChallengeExisting(mfaToken, smsAuth.id)
            return
          }
          setStep('enroll-phone')
          return
        }

        setStep('enroll-phone')
        return
      }

      setError(
        typeof resData === 'string'
          ? resData
          : resData?.error_description || resData?.error || err?.message || 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  async function getActiveSmsAuthenticator(mfaToken) {
    const resp = await axios.get('/api/teacher/mfa/authenticators', {
      headers: {
        authorization: `Bearer ${mfaToken}`,
        'content-type': 'application/json',
      },
    })
    const list = Array.isArray(resp.data) ? resp.data : []
    return list.find(
      a => a?.authenticator_type === 'oob' && a?.oob_channel === 'sms' && a?.active
    )
  }

  async function startSmsChallengeExisting(mfaToken, authenticatorId) {
    const ch = await axios.post('/api/teacher/mfa/challenge', {
      challenge_type: 'oob',
      authenticator_id: authenticatorId,
      mfa_token: mfaToken,
    })

    const oobCode = ch.data?.oob_code
    if (!oobCode) throw new Error('No oob_code from challenge')

    setMfa(s => ({
      ...s,
      authenticatorId,
      oobCode,
      bindingMethod: ch.data?.binding_method || 'prompt',
    }))
    setStep('verify-phone')
  }

  // Enroll via associate, which also sends the challenge and returns oob_code
  async function enrollPhone() {
    setError('')
    try {
      setLoading(true)
      if (!mfa.token) throw new Error('Missing mfa_token in state')
      if (!mfa.phone) throw new Error('Enter a phone number')

      const assoc = await axios.post('/api/teacher/mfa/associate', {
        mfa_token: mfa.token,
        authenticator_types: ['oob'],
        oob_channels: ['sms'],
        phone_number: mfa.phone,
      })

      const oobCode = assoc.data?.oob_code
      if (!oobCode) throw new Error('No oob_code from associate')

      setMfa(s => ({
        ...s,
        authenticatorId: '',
        oobCode,
        bindingMethod: assoc.data?.binding_method || 'prompt',
      }))
      setStep('verify-phone')
    } catch (err) {
      const resData = err?.response?.data
      setError(
        typeof resData === 'string'
          ? resData
          : resData?.error_description || resData?.error || err?.message || 'Could not enroll phone'
      )
    } finally {
      setLoading(false)
    }
  }

  async function verifyCode() {
    setError('')
    try {
      setLoading(true)
      if (!mfa.token) throw new Error('Missing mfa_token in state')
      if (!mfa.oobCode) throw new Error('Missing oob_code')
      if (!smsCode) throw new Error('Enter the code')

      const { data } = await axios.post('/api/teacher/mfa/verify-oob', {
        mfa_token: mfa.token,
        oob_code: mfa.oobCode,
        binding_code: smsCode,
      })

      if (data?.access_token || data?.accessToken || data?.token) {
        await persistSessionFrom(data)
        await finishSuccess({ ok: true })
      } else if (data?.ok) {
        await finishSuccess({ ok: true })
      } else {
        console.log('MFA verify response payload:', data)
        throw new Error('No access token returned after MFA verification')
      }

      setStep('login')
      setMfa({ token: '', phone: '', oobCode: '', bindingMethod: '', authenticatorId: '' })
      setSmsCode('')
      setForm({ username: '', password: '' })
    } catch (err) {
      const resData = err?.response?.data
      setError(
        typeof resData === 'string'
          ? resData
          : resData?.error_description || resData?.error || err?.message || 'Invalid or expired code'
      )
    } finally {
      setLoading(false)
    }
  }

  function Header() {
    return (
      <div className="mb-5 md:mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 4v6c0 5-3.8 9.7-9 10-5.2-.3-9-5-9-10V6l9-4z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Faculty
        </div>
        <h3 className="mt-2 text-xl md:text-2xl font-semibold text-indigo-700">
          {step === 'login' && title}
          {step === 'enroll-phone' && 'Enroll your phone'}
          {step === 'verify-phone' && 'Enter the code we sent'}
        </h3>
        <p className="mt-1 text-xs md:text-sm text-neutral-500">
          {step === 'login' && 'Sign in to access classes and assessments'}
          {step === 'enroll-phone' && 'Add a phone number to secure your account'}
          {step === 'verify-phone' && 'Type the 6 digit code from your text message'}
        </p>
      </div>
    )
  }

  function ErrorBanner() {
    if (!error) return null
    return (
      <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        {error}
      </div>
    )
  }

  function renderMfa() {
    if (step === 'enroll-phone') {
      return (
        <>
          <label className="mb-1 block text-sm font-medium text-neutral-800">Phone number</label>
          <input
            type="tel"
            placeholder="+1 555 123 4567"
            value={mfa.phone}
            onChange={(e) => setMfa(p => ({ ...p, phone: e.target.value }))}
            className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={enrollPhone}
              disabled={loading || !mfa.phone}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" className="opacity-20" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                </svg>
              )}
              Send code
            </button>
            <button
              type="button"
              onClick={() => setStep('login')}
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Back
            </button>
          </div>
        </>
      )
    }

    if (step === 'verify-phone') {
      return (
        <>
          <label className="mb-1 block text-sm font-medium text-neutral-800">6 digit code</label>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter code"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 tracking-widest"
          />
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={verifyCode}
              disabled={loading || !smsCode}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" className="opacity-20" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                </svg>
              )}
              Verify
            </button>
            <button
              type="button"
              onClick={() => (mfa.authenticatorId ? startSmsChallengeExisting(mfa.token, mfa.authenticatorId) : enrollPhone())}
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Resend code
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep('login')}
            className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            Use a different account
          </button>
        </>
      )
    }

    return null
  }

  return (
    <div className={['relative flex h-full w-full items-center justify-center bg-transparent', 'p-0', className].join(' ')}>
      <div className="flex w-[92%] md:w-[88%] lg:w-[85%] max-w-2xl min-h-[60%] items-stretch rounded-2xl bg-gradient-to-br from-indigo-300/60 via-indigo-200/50 to-transparent p-[1.5px] shadow-lg">
        <form onSubmit={handleSubmit} className="flex w-full flex-col rounded-2xl border border-white/60 bg-white/95 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <Header />
          <ErrorBanner />
          {step === 'login' ? (
            <>
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-800">Username</label>
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                  </svg>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="jdoe@school.edu"
                    className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 pl-9 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-800">Password</label>
                  <button type="button" onClick={() => setShowPw(s => !s)} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 pl-9 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" className="opacity-20" />
                    <path d="M21 12a9 9 0 0 1-9 9" />
                  </svg>
                )}
                <span>Sign in</span>
              </button>

              <div className="mt-3 flex items-center justify-between">
                <label className="inline-flex select-none items-center gap-2 text-xs text-neutral-600">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500" onChange={() => {}} />
                  Remember me
                </label>
                <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2">{renderMfa()}</div>
          )}
        </form>
      </div>
    </div>
  )
}
