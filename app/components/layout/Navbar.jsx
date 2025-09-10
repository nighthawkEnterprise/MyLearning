"use client";
import React from "react";
import { useAudience } from "@/components/audience/AudienceProvider";
import { cx } from "@/lib/theme";

export default function Navbar({ tone }) {
  const { audience, setAudience } = useAudience();
  const tabs = [
    { id: "Workforce", label: "Workforce" },
    { id: "Stem", label: "Stem" },
    { id: "Compliance", label: "Compliance" },
    { id: "Certifications", label: "Certifications" },
  ];

  return (
    <header className="relative z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <a className="flex items-center gap-2">
          <svg className={cx("h-7 w-7", tone.text600)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 15c4-7 14-7 18 0"/><path d="M5 12c3-5 11-5 14 0"/><path d="M7 9c2-3 8-3 10 0"/>
          </svg>
          <span className="font-semibold tracking-tight text-xl">
            <span className={tone.text600}>My</span> Learn
          </span>
        </a>
        <div className="hidden items-center gap-6 text-sm md:flex">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setAudience(t.id)}
              className={audience === t.id ? cx("font-semibold", tone.text600) : "text-neutral-700 hover:text-neutral-900"}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <a className="text-sm text-neutral-700 hover:text-neutral-900">Login</a>
          <a className={cx("inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm", tone.bg600, tone.hoverBg500)}>
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}
