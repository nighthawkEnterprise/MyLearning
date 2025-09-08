import React from "react";

export default function Faq() {
  const items = [
    { q: "Can I import existing content?", a: "Yes. Upload files or link sources and the builder converts them." },
    { q: "Is my data secure?", a: "We use encryption in transit and at rest with role based access." },
    { q: "Do you offer education discounts?", a: "Yes. Discounts for accredited institutions and nonprofits." },
  ];
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {items.map((item, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer list-none p-5 font-medium text-neutral-900 group-open:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200">+</span>
                  </div>
                </summary>
                <div className="px-5 pb-5 text-neutral-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
