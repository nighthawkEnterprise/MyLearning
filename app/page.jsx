'use client'
import React, { useState } from "react";
// import { auth0 } from '../lib/auth0';

// Utility to concat classes
const cx = (...cls) => cls.filter(Boolean).join(" ");
import Link from 'next/link';
// Theme tokens per audience
const tones = {
  rose: {
    bg50: "bg-rose-50",
    text600: "text-rose-600",
    bg600: "bg-rose-600",
    hoverBg500: "hover:bg-rose-500",
    border200: "border-rose-200",
    bullet500: "bg-rose-500",
  },
  indigo: {
    bg50: "bg-indigo-50",
    text600: "text-indigo-600",
    bg600: "bg-indigo-600",
    hoverBg500: "hover:bg-indigo-500",
    border200: "border-indigo-200",
    bullet500: "bg-indigo-500",
  },
};

// Static class maps so Tailwind picks them up
const topGradients = {
  rose: "bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200",
  indigo: "bg-gradient-to-r from-indigo-200 via-violet-200 to-sky-200",
};

// RGBA accents for radial overlays
const toneAlpha = {
  rose: "rgba(244,63,94,0.12)",
  indigo: "rgba(79,70,229,0.12)",
};

export default function AILearningLanding() {
  const [active, setActive] = useState("students");

  // Display names for UI
  const display = {
    students: "Students",
    teachers: "Teachers",
  };

  // Media map: put files under /public and keep these paths or change them here
  const media = {
    hero: {
      students: "/students.png", // you already have this
      teachers: "/hero-teachers.jpg", // add to public/ or change name
    },
    solutions: {
      students: [
        "/images/solutions-students-1.jpg",
        "/images/solutions-students-2.jpg",
        "/images/solutions-students-3.jpg",
      ],
      teachers: [
        "/images/solutions-teachers-1.jpg",
        "/images/solutions-teachers-2.jpg",
        "/images/solutions-teachers-3.jpg",
      ],
    },
  };

  const variants = {
    students: {
      tone: "rose",
      heroKicker: "AI powered learning platform",
      heroTitle: (
        <>Transform Learning with <span className="text-rose-600">AI Innovation</span></>
      ),
      heroDesc:
        "From individual learners to clubs and cohorts, My Learn delivers personalized study plans, AI tutoring, and progress tracking that adapts to each learner.",
      solutions: [
        {
          title: "Individual Learners",
          desc: "Smart plans, flashcards, and instant feedback to master any subject.",
          points: ["Smart study plans", "Practice with instant feedback", "Mobile first"],
          cta: "Start Learning",
        },
        {
          title: "Exam Prep",
          desc: "AI generated quizzes, spaced repetition, and streaks that keep momentum.",
          points: ["Adaptive quizzes", "Spaced repetition", "Goal tracking"],
          cta: "Build My Plan",
        },
        {
          title: "Clubs and Cohorts",
          desc: "Group projects, peer review, and shared resources to learn together.",
          points: ["Projects toolkit", "Peer review", "Shared notes"],
          cta: "Create a Cohort",
        },
      ],
      features: [
        { t: "AI Course Builder", d: "Generate outlines and lessons from goals or sources." },
        { t: "Adaptive Pathing", d: "Content adjusts to mastery and engagement." },
        { t: "Assessments", d: "Question banks and auto grading." },
        { t: "Collaboration", d: "Projects and peer review." },
        { t: "Analytics", d: "Progress and completion insights." },
        { t: "Integrations", d: "Sync with Google Drive and calendars." },
      ],
      pricing: {
        left: ["1 course, 50 learners", "AI tutor and quizzes", "Basic analytics"],
        mid: ["Unlimited courses", "Advanced analytics", "Integrations"],
        right: ["SSO", "Roles and permissions", "Priority support"],
      },
    },
    teachers: {
      tone: "indigo",
      heroKicker: "For Teachers",
      heroTitle: (
        <>Empower Classrooms with <span className="text-indigo-600">AI Tools</span></>
      ),
      heroDesc:
        "Automate assessments, generate lesson plans, and free time for real teaching.",
      solutions: [
        {
          title: "Lesson Planning",
          desc: "AI planning from standards and objectives.",
          points: ["Standards aligned", "Differentiation", "Materials export"],
          cta: "Plan a Unit",
        },
        {
          title: "Assessment Suite",
          desc: "Build banks, assign, and auto grade.",
          points: ["Question generator", "Rubrics", "Proctoring options"],
          cta: "Create Assessment",
        },
        {
          title: "Class Analytics",
          desc: "Spot at risk students and adjust groups.",
          points: ["Mastery heatmaps", "Grouping", "Parent communication"],
          cta: "Open Dashboard",
        },
      ],
      features: [
        { t: "Curriculum Aligner", d: "Maps to standards." },
        { t: "Rubrics", d: "Quick scoring with consistency." },
        { t: "Seating and Groups", d: "Data informed grouping." },
        { t: "Plagiarism Checks", d: "AI assisted originality." },
        { t: "LMS Integrations", d: "Google Classroom, Canvas, more." },
        { t: "Parent Comms", d: "Batch summaries and notes." },
      ],
      pricing: {
        left: ["1 class, 35 students", "Lesson planner", "Basic analytics"],
        mid: ["Unlimited classes", "Assessment suite", "LMS integrations"],
        right: ["District SSO", "SIS sync", "Admin controls"],
      },
    },
  };

  const v = variants[active];
  const tone = tones[v.tone];
  const grad = topGradients[v.tone];
  const alpha = toneAlpha[v.tone];

  return (
    <div className={cx("min-h-screen bg-neutral-50 text-neutral-900 selection:bg-rose-200/60")}> 
      {/* Top gradient accents */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className={cx("mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl", grad)} />
      </div>

      {/* Navbar */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <svg className={cx("h-7 w-7", tone.text600)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 15c4-7 14-7 18 0"/>
              <path d="M5 12c3-5 11-5 14 0"/>
              <path d="M7 9c2-3 8-3 10 0"/>
            </svg>
            <span className="font-semibold tracking-tight text-xl">
              <span className={tone.text600}>My</span> Learn
            </span>
          </a>

          {/* Audience tabs */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            {[
              { id: "students", label: "Students" },
              { id: "teachers", label: "Teachers" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cx(
                  "transition-colors",
                  active === tab.id ? cx("font-semibold", tone.text600) : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden items-center gap-3 md:flex">
            <a href="/auth/login?returnTo=/protected" className="text-sm text-neutral-700 hover:text-neutral-900">Login</a>
            <a href="#" className={cx("inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm transition", tone.bg600, tone.hoverBg500)}>
              Get Started
            </a>
          </div>

          {/* Mobile menu button placeholder */}
          <button className="md:hidden inline-flex items-center justify-center rounded-xl border border-neutral-200 p-2.5 text-neutral-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-2 md:gap-12 md:px-6 md:pt-12">
          {/* Left copy */}
          <div>
            <div className={cx("mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium", tone.border200, tone.text600, tone.bg50, "border")}>{v.heroKicker}</div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{v.heroTitle}</h1>
            <p className="mt-4 max-w-xl text-neutral-600 md:text-lg">{v.heroDesc}</p>

            {/* My Learn tagline */}
            <p className="mt-3 max-w-xl text-sm text-neutral-500">My Learn is an AI powered EdTech platform that serves everyone from individual learners to enterprises.</p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#" className={cx("inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition", tone.bg600, tone.hoverBg500)}>Start Free Trial</a>
              <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/></svg>
                Schedule Demo
              </a>
            </div>

            {/* Tiny benefits */}
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

          {/* Right visual */}
          <div className="relative">
            {/* Badge top-right */}
            <div className={cx("absolute -right-2 -top-3 z-20 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm border", tone.border200)}>
              <div className={cx("flex h-6 w-6 items-center justify-center rounded-full bg-current bg-opacity-10", tone.text600)}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
              </div>
              <span className="font-medium">2M+ Active Learners</span>
            </div>

            {/* Main image card */}
            <div className="relative rounded-3xl border border-neutral-200 bg-white p-2 shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200">
                {media.hero[active] ? (
                  <img src={media.hero[active]} alt={`${display[active]} hero`} className="h-full w-full object-cover" />
                ) : (
                  <div className="relative h-full w-full bg-gradient-to-br from-neutral-200 via-neutral-100 to-white">
                    <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-neutral-300/70" />
                    <div className="absolute bottom-0 left-0 right-0 h-2/3" style={{background: `radial-gradient(120% 100% at 20% 0%, ${alpha}, transparent 60%)`}} />
                    <div className="absolute bottom-6 left-6 h-40 w-64 rounded-xl bg-white/70 backdrop-blur" />
                  </div>
                )}
              </div>

              {/* Floating stat card */}
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

        {/* Solutions */}
        <section id="solutions" className="relative z-10 bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className={cx("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border", tone.border200, tone.text600, tone.bg50)}>Solutions</div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Solutions for Every Learning Need</h2>
              <p className="mt-3 text-neutral-600">Tailored content for {display[active]}.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {v.solutions.map((card, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-neutral-200">
                    {media.solutions[active] && media.solutions[active][i] ? (
                      <img src={media.solutions[active][i]} alt={`${display[active]} ${card.title}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" style={{background: `radial-gradient(120% 100% at 0% 0%, ${alpha}, transparent 60%)`}} />
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
                    <a href="#" className={cx("mt-5 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium", tone.bg600, tone.hoverBg500, "text-white")}>{card.cta}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Powerful Features</h2>
                <p className="mt-3 text-neutral-600">Everything you need to build, deliver, and measure learning experiences at scale.</p>
                <a href="#pricing" className={cx("mt-6 inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Explore Plans</a>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {v.features.map((f, i) => (
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

        {/* Logos */}
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

        {/* Testimonials */}
        <section className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
              {[
                { quote: "Completion rates jumped and instructors love the AI assistant.", author: "Dean of Online Programs" },
                { quote: "We rolled out global onboarding in weeks and cut content creation time in half.", author: "L&D Director" },
                { quote: "The analytics helped us identify at risk learners early.", author: "Student Success Lead" }
              ].map((t, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <svg className={cx("h-6 w-6", tone.text600)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h4v10H7zM13 7h4v10h-4z"/></svg>
                  <p className="mt-3 text-neutral-800">{t.quote}</p>
                  <p className="mt-3 text-sm text-neutral-500">{t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative z-10 bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className={cx("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border", tone.border200, tone.text600, tone.bg50)}>Pricing</div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Simple, transparent plans</h2>
              <p className="mt-3 text-neutral-600">Start free. Upgrade when you are ready. Cancel anytime.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Free */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Starter</h3>
                <p className="mt-1 text-sm text-neutral-600">Get moving quickly.</p>
                <div className="mt-4 text-3xl font-semibold">$0 <span className="text-base font-normal text-neutral-500">/mo</span></div>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {variants[active].pricing.left.map((x, i) => (<li key={i}>{x}</li>))}
                </ul>
                <a href="#" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Get Started</a>
              </div>

              {/* Pro */}
              <div className={cx("rounded-2xl bg-white p-6 shadow-md border-2", tones[v.tone].text600.replace("text-", "border-"))}>
                <div className={cx("mb-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", tone.text600, tone.bg50)}>Most popular</div>
                <h3 className="text-lg font-semibold">Pro</h3>
                <p className="mt-1 text-sm text-neutral-600">For growing programs.</p>
                <div className="mt-4 text-3xl font-semibold">$49 <span className="text-base font-normal text-neutral-500">/mo</span></div>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {variants[active].pricing.mid.map((x, i) => (<li key={i}>{x}</li>))}
                </ul>
                <a href="#" className={cx("mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Start Pro</a>
              </div>

              {/* Enterprise */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Enterprise</h3>
                <p className="mt-1 text-sm text-neutral-600">Advanced security and scale.</p>
                <div className="mt-4 text-3xl font-semibold">Custom</div>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {variants[active].pricing.right.map((x, i) => (<li key={i}>{x}</li>))}
                </ul>
                <a href="#" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Talk to Sales</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section id="about" className="relative z-10 pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm md:p-12">
              <div className={cx("absolute -right-20 -top-16 h-64 w-64 rounded-full blur-2xl bg-current bg-opacity-10", tone.text600)} />
              <h3 className="text-2xl font-semibold md:text-3xl">Ready to transform learning with AI</h3>
              <p className="mt-2 max-w-2xl text-neutral-600">Join millions of learners and hundreds of institutions already using My Learn to deliver engaging, effective education.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#" className={cx("inline-flex items-center rounded-xl px-5 py-3 text-sm font-medium text-white", tone.bg600, tone.hoverBg500)}>Get Started</a>
                <a href="#" className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50">Contact Sales</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer mini */}
      <footer className="relative z-10 border-t border-neutral-200/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} My Learn. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            <li><a href="#" className="hover:text-neutral-700">Privacy</a></li>
            <li><a href="#" className="hover:text-neutral-700">Terms</a></li>
            <li><a href="#" className="hover:text-neutral-700">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
