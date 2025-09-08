// app/components/Navbar.jsx
"use client";
import Link from "next/link";

export default function Navbar({ className = "" }) {
  return (
    <nav
      className={[
        "mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Global"
    >
      {/* Logo */}
      <Link href="#" className="flex items-center gap-2" aria-label="My Learning home">
        <svg
          className="h-7 w-7 text-rose-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 15c4-7 14-7 18 0" />
          <path d="M5 12c3-5 11-5 14 0" />
          <path d="M7 9c2-3 8-3 10 0" />
        </svg>
        <span className="text-xl font-semibold tracking-tight">
          <span className="text-rose-600">My</span> Learning
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden items-center gap-8 text-sm md:flex">
        <Link href="#solutions" className="text-neutral-700 hover:text-neutral-900">
          Solutions
        </Link>
        <Link href="#features" className="text-neutral-700 hover:text-neutral-900">
          Features
        </Link>
        <Link href="#pricing" className="text-neutral-700 hover:text-neutral-900">
          Pricing
        </Link>
        <Link href="#about" className="text-neutral-700 hover:text-neutral-900">
          About
        </Link>
      </div>

      {/* Right actions */}
      <div className="hidden items-center gap-3 md:flex">
        <Link href="#" className="text-sm text-neutral-700 hover:text-neutral-900">
          Login
        </Link>
        <Link
          href="#"
          className="inline-flex items-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-500"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile menu button placeholder */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 p-2.5 text-neutral-700 md:hidden"
        aria-label="Open menu"
        aria-expanded="false"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
}
