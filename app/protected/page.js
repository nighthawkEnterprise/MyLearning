// app/(app)/student/page.jsx
import { redirect } from "next/navigation";
import { auth0 } from "../../lib/auth0"; // adjust if your alias is different

// Simple helpers for the Students tone
const tone = {
  bg50: "bg-rose-50",
  text600: "text-rose-600",
  bg600: "bg-rose-600",
  hoverBg500: "hover:bg-rose-500",
  border200: "border-rose-200",
};
const topGradient =
  "bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200";

export const metadata = {
  title: "My Learn - Student Home",
};

function ProgressBar({ value }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-neutral-200">
      <div
        className={`h-2.5 rounded-full ${tone.bg600}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className={`text-2xl font-semibold ${tone.text600}`}>{value}</div>
      <div className="mt-1 text-neutral-800">{label}</div>
      {sub ? <div className="mt-1 text-sm text-neutral-500">{sub}</div> : null}
    </div>
  );
}

export default async function StudentHome() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login?returnTo=/student");

  const user = session.user || {};
  const displayName =
    user.name || user.given_name || user.nickname || user.email || "Student";

  // Example data - replace with your real queries
  const courses = [
    {
      id: "ml101",
      title: "Algebra Refresh",
      pct: 62,
      thumb: "/images/course-algebra.jpg",
    },
    {
      id: "ai201",
      title: "Intro to AI",
      pct: 35,
      thumb: "/images/course-ai.jpg",
    },
    {
      id: "ds110",
      title: "Data Skills Bootcamp",
      pct: 80,
      thumb: "/images/course-data.jpg",
    },
  ];

  const tasks = [
    { id: 1, title: "Quiz 3 - Algebra", due: "Today", course: "Algebra Refresh" },
    { id: 2, title: "Project: Classifier mini app", due: "Fri", course: "Intro to AI" },
    { id: 3, title: "Practice set - Probability", due: "Mon", course: "Data Skills" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top gradient accent - Students theme */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
        <div className={`mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl ${topGradient}`} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-neutral-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="/" className="flex items-center gap-2">
            <svg
              className={`h-7 w-7 ${tone.text600}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 15c4-7 14-7 18 0" />
              <path d="M5 12c3-5 11-5 14 0" />
              <path d="M7 9c2-3 8-3 10 0" />
            </svg>
            <span className="font-semibold tracking-tight text-xl">
              <span className={tone.text600}>My</span> Learn
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="/student" className={`font-semibold ${tone.text600}`}>Home</a>
            <a href="/student/courses" className="text-neutral-700 hover:text-neutral-900">My Courses</a>
            <a href="/student/progress" className="text-neutral-700 hover:text-neutral-900">Progress</a>
            <a href="/student/settings" className="text-neutral-700 hover:text-neutral-900">Settings</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/auth/logout"
              className={`hidden rounded-xl px-3 py-1.5 text-sm font-medium text-white md:inline-flex ${tone.bg600} ${tone.hoverBg500}`}
            >
              Log out
            </a>
            <img
              src={user.picture || "/images/avatar-student.png"}
              alt={displayName}
              className="h-9 w-9 rounded-full border border-neutral-200 object-cover"
            />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Welcome + quick actions */}
        <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${tone.bg50} ${tone.text600} ${tone.border200}`}>
                Students
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Welcome back, {displayName}
              </h1>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Pick up where you left off. Your plan adapts as you learn.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/student/courses"
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white ${tone.bg600} ${tone.hoverBg500}`}
                >
                  Continue learning
                </a>
                <a
                  href="/student/goals"
                  className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Set a weekly goal
                </a>
                <a
                  href="/student/quiz"
                  className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Quick practice
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
              <Stat label="Weekly streak" value="4 days" sub="Keep it going" />
              <Stat label="Study time" value="2h 15m" sub="This week" />
              <Stat label="Completion" value="62%" sub="Overall progress" />
            </div>
          </div>
        </section>

        {/* Continue learning */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <h2 className="mb-4 text-lg font-semibold">Continue learning</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="aspect-[16/9] w-full bg-neutral-200">
                  {c.thumb ? (
                    <img src={c.thumb} alt={c.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="text-neutral-800">{c.title}</div>
                  <div className="mt-3">
                    <ProgressBar value={c.pct} />
                    <div className="mt-1 text-xs text-neutral-500">{c.pct}% complete</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <a
                      href={`/student/courses/${c.id}`}
                      className={`inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium text-white ${tone.bg600} ${tone.hoverBg500}`}
                    >
                      Resume
                    </a>
                    <a href={`/student/courses/${c.id}/outline`} className="text-sm text-neutral-700 hover:text-neutral-900">
                      Outline
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-3 text-base font-semibold">Upcoming</div>
              <ul className="divide-y divide-neutral-200 text-sm">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="font-medium text-neutral-800">{t.title}</div>
                      <div className="text-neutral-500">{t.course}</div>
                    </div>
                    <div className={`rounded-full px-2.5 py-1 text-xs ${tone.bg50} ${tone.text600} border ${tone.border200}`}>
                      {t.due}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-3 text-base font-semibold">Recommendations</div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span>Linear equations - practice set</span>
                  <a href="/student/quiz?set=algebra-linear" className={`rounded-xl px-2.5 py-1 text-xs text-white ${tone.bg600} ${tone.hoverBg500}`}>
                    Start
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>Intro to Python - mini lesson</span>
                  <a href="/student/lesson/python-intro" className={`rounded-xl px-2.5 py-1 text-xs text-white ${tone.bg600} ${tone.hoverBg500}`}>
                    Open
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>Study plan - adjust goals</span>
                  <a href="/student/goals" className="rounded-xl px-2.5 py-1 text-xs border border-neutral-200">
                    Edit
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <h2 className="mb-4 text-lg font-semibold">Badges</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["Focus Starter", "Practice Streak 3", "Algebra Basics", "First Project"].map(
              (b, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone.bg50}`}>
                    <svg
                      className={`h-5 w-5 ${tone.text600}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                    </svg>
                  </div>
                  <div className="text-sm">{b}</div>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} My Learn. All rights reserved.</p>
          <a href="/auth/logout" className="hover:text-neutral-700">Log out</a>
        </div>
      </footer>
    </div>
  );
}
