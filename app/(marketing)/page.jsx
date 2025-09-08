// app/(marketing)/page.jsx
import LandingClient from "./LandingClient";

export const metadata = {
  title: "My Learn - AI EdTech",
  description: "AI powered learning for students, parents, teachers, and corporations",
};

export default function Page({ searchParams }) {
  const initial = searchParams?.audience || "students";
  return <LandingClient initial={initial} />;
}
