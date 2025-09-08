import React from "react";
import { cx } from "@/lib/theme";
import { media } from "@/lib/content";

export default function Hero({ tone, variant, alpha, audience }) {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-2 md:gap-12 md:px-6 md:pt-12">
      <div>
        <div className={cx("mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border", tone.border200, tone.text600, tone.bg50)}>
          {variant.heroKicker}
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{variant.heroTitle}</h1>
        <p className="mt-4 max-w-xl text-neutral-600 md:text-lg">{variant.heroDesc}</p>
        <p className="mt-3 max-w-xl text-sm text-neutral-500">
          My Learn is an AI powered EdTech platform that serves everyone from individual students to entire university systems and corporate training departments.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className={cx("inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm", tone.bg600, tone.hoverBg500)}>Start Free Trial</a>
          <a className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/></svg>
            Schedule Demo
          </a>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg>
            </span>
            No credit card required
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg>
            </span>
            Cancel anytime
          </li>
        </ul>
      </div>

      <div className="relative">
        <div className={cx("absolute -right-2 -top-3 z-20 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm border", tone.border200)}>
          <div className={cx("flex h-6 w-6 items-center justify-center rounded-full bg-current bg-opacity-10", tone.text600)}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
          </div>
          <span className="font-medium">2M+ Active Learners</span>
        </div>

        <div className="relative rounded-3xl border border-neutral-200 bg-white p-2 shadow-lg">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200">
            {media.hero[audience] ? (
              <img src={media.hero[audience]} alt={`${audience} hero`} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-gradient-to-br from-neutral-200 via-neutral-100 to-white">
                <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-neutral-300/70" />
                <div className="absolute bottom-0 left-0 right-0 h-2/3" style={{ background: `radial-gradient(120% 100% at 20% 0%, ${alpha}, transparent 60%)` }} />
                <div className="absolute bottom-6 left-6 h-40 w-64 rounded-xl bg-white/70 backdrop-blur" />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-md">
            <div className={cx("h-10 w-10 rounded-xl bg-current bg-opacity-10", tone.text600)} />
            <div>
              <div className="text-xs text-neutral-500">Course Completion</div>
              <div className="text-base font-semibold">95%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
