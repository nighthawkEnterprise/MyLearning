import React from "react";

export default function Logos() {
  return (
    <section aria-label="Trusted by" className="relative z-10 border-t border-neutral-200/60 bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <p className="mb-6 text-center text-sm text-neutral-500">Trusted by institutions and enterprises</p>
        <div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-md bg-neutral-200" />
          ))}
        </div>
      </div>
    </section>
  );
}
