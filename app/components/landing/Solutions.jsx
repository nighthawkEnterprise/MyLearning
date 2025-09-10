import React from "react";
import { cx } from "@/lib/theme";
import { media } from "@/lib/content";

export default function Solutions({ tone, variant, alpha, audience }) {
  return (
    <section id="solutions" className="relative z-10 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className={cx("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border", tone.border200, tone.text600, tone.bg50)}>Solutions</div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Solutions for Every Learning Need</h2>
          <p className="mt-3 text-neutral-600">Tailored content for {audience.charAt(0).toUpperCase() + audience.slice(1)}.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {variant.solutions.map((card, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-neutral-200">
                {media.solutions[audience] && media.solutions[audience][i] ? (
                  <img src={media.solutions[audience][i]} alt={`${audience} ${card.title}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: `radial-gradient(120% 100% at 0% 0%, ${alpha}, transparent 60%)` }} />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{card.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {card.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className={cx("i h-1.5 w-1.5 rounded-full", tone.bullet500)}></span> {p}
                    </li>
                  ))}
                </ul>
                <a className={cx("mt-5 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>{card.cta}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
