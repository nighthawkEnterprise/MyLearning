import React from "react";
import { cx } from "@/lib/theme";

export default function Testimonials({ tone }) {
  const items = [
    { quote: "Completion rates jumped and instructors love the AI assistant.", author: "Dean of Online Programs" },
    { quote: "We rolled out global onboarding in weeks and cut content creation time in half.", author: "L&D Director" },
    { quote: "The analytics helped us identify at-risk learners early.", author: "Student Success Lead" },
  ];
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <svg className={cx("h-6 w-6", tone.text600)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h4v10H7zM13 7h4v10h-4z"/></svg>
              <p className="mt-3 text-neutral-800">{t.quote}</p>
              <p className="mt-3 text-sm text-neutral-500">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
