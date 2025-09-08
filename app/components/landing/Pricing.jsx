import React from "react";
import { cx, tones } from "@/lib/theme";

export default function Pricing({ tone, variant, audience }) {
  const borderTone = tones[variant.tone].text600.replace("text-", "border-");
  return (
    <section id="pricing" className="relative z-10 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className={cx("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border", tone.border200, tone.text600, tone.bg50)}>Pricing</div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Simple, transparent plans</h2>
          <p className="mt-3 text-neutral-600">Start free. Upgrade when you are ready. Cancel anytime.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-1 text-sm text-neutral-600">Get moving quickly.</p>
            <div className="mt-4 text-3xl font-semibold">$0 <span className="text-base font-normal text-neutral-500">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {variant.pricing.left.map((x, i) => (<li key={i}>{x}</li>))}
            </ul>
            <a className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Get Started</a>
          </div>

          <div className={cx("rounded-2xl bg-white p-6 shadow-md border-2", borderTone)}>
            <div className={cx("mb-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", tone.text600, tone.bg50)}>Most popular</div>
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-1 text-sm text-neutral-600">For growing programs.</p>
            <div className="mt-4 text-3xl font-semibold">$49 <span className="text-base font-normal text-neutral-500">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {variant.pricing.mid.map((x, i) => (<li key={i}>{x}</li>))}
            </ul>
            <a className={cx("mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Start Pro</a>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <p className="mt-1 text-sm text-neutral-600">Advanced security and scale.</p>
            <div className="mt-4 text-3xl font-semibold">Custom</div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {variant.pricing.right.map((x, i) => (<li key={i}>{x}</li>))}
            </ul>
            <a className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Talk to Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
