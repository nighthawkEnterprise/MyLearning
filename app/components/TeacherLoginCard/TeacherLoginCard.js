'use client'
import React, { useState } from 'react';
import axios from 'axios';
export default function TeacherLoginCard({
  onSubmit,
  className = '',
  title = 'Faculty sign in',
}) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      setLoading(true);
      // Clear any local errors if you add error state
      const { data } = await axios.post(
        '/api/teacher/login',
        {
          username: form.username,
          password: form.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Optional callback for parent components
      onSubmit?.(data);
    } catch (err) {
      // You can surface this in the UI if desired
      console.error(err?.response?.data ?? err);
      // Example: setError(err?.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }



  return (
    <div
      className={[
        // match parent background
        'relative flex h-full w-full items-center justify-center bg-transparent',
        // no extra spacing that would reveal a different bg
        'p-0',
        className,
      ].join(' ')}
    >
      {/* card with subtle gradient border */}
      <div className="flex w-[92%] md:w-[88%] lg:w-[85%] max-w-2xl min-h-[60%] items-stretch rounded-2xl bg-gradient-to-br from-indigo-300/60 via-indigo-200/50 to-transparent p-[1.5px] shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col rounded-2xl border border-white/60 bg-white/95 p-6 md:p-8 shadow-xl backdrop-blur-md"
        >
          {/* header */}
          <div className="mb-5 md:mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l9 4v6c0 5-3.8 9.7-9 10-5.2-.3-9-5-9-10V6l9-4z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Faculty
            </div>
            <h3 className="mt-2 text-xl md:text-2xl font-semibold text-indigo-700">{title}</h3>
            <p className="mt-1 text-xs md:text-sm text-neutral-500">Sign in to access classes and assessments</p>
          </div>

          {/* username */}
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

          {/* password */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-neutral-800">Password</label>
              <button type="button" onClick={() => setShowPw((s) => !s)} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
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

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            // onClick={() => signIn}
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

          {/* helpers */}
          <div className="mt-3 flex items-center justify-between">
            <label className="inline-flex select-none items-center gap-2 text-xs text-neutral-600">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500" onChange={() => {}} />
              Remember me
            </label>
            <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
