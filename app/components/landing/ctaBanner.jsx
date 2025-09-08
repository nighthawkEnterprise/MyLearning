import React from "react";
import { cx } from "@/lib/theme";

export default function CtaBanner({ tone }) {
  return (
    <section id="about" className="relative z-10 pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-12">
          <div className={cx("absolute -right-20 -top-16 h-64 w-64 rounded-full blur-2xl bg-current bg-opacity-10", tone.text600)} />
          <h3 className="text-2xl font-semibold md:text-3xl">Ready to transform learning with AI</h3>
          <p className="mt-2 max-w-2xl text-neutral-600">Join millions of learners and hundreds of institutions already using My Learn to deliver engaging, effective education.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a className={cx("inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Get Started</a>
            <a className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
