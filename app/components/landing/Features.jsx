import React from "react";
import { cx } from "@/lib/theme";

export default function Features({ tone, variant }) {
  return (
    <section id="features" className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Powerful Features</h2>
            <p className="mt-3 text-neutral-600">Everything you need to build, deliver, and measure learning experiences at scale.</p>
            <a href="#pricing" className={cx("mt-6 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Explore Plans</a>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {variant.features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className={cx("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl", tone.bg50)}>
                  <svg className={cx("h-5 w-5", tone.text600)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
                </div>
                <h3 className="text-base font-semibold">{f.t}</h3>
                <p className="mt-1.5 text-sm text-neutral-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
