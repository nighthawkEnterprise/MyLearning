// lib/content.js
import React from "react";

export const media = {
  hero: {
    // File at <repo>/public/students.png
    students: "/students.png",
    parents: "/images/hero-parents.jpg",
    teachers: "/images/hero-teachers.jpg",
    corporations: "/images/hero-corporations.jpg",
  },
  solutions: {
    students: [
      "/images/solutions-students-1.jpg",
      "/images/solutions-students-2.jpg",
      "/images/solutions-students-3.jpg",
    ],
    parents: [
      "/images/solutions-parents-1.jpg",
      "/images/solutions-parents-2.jpg",
      "/images/solutions-parents-3.jpg",
    ],
    teachers: [
      "/images/solutions-teachers-1.jpg",
      "/images/solutions-teachers-2.jpg",
      "/images/solutions-teachers-3.jpg",
    ],
    corporations: [
      "/images/solutions-corp-1.jpg",
      "/images/solutions-corp-2.jpg",
      "/images/solutions-corp-3.jpg",
    ],
  },
};

export const variants = {
  students: {
    tone: "rose",
    heroKicker: "AI-powered learning platform",
    heroTitle: <>Transform Learning with <span className="text-rose-600">AI Innovation</span></>,
    heroDesc:
      "From individual students to clubs and cohorts, My Learn delivers personalized study plans, AI tutoring, and progress tracking that adapts to each learner.",
    solutions: [
      { title: "Individual Learners", desc: "Smart plans, flashcards, and instant feedback to master any subject.", points: ["Smart study plans", "Practice with instant feedback", "Mobile first"], cta: "Start Learning" },
      { title: "Exam Prep", desc: "AI generated quizzes, spaced repetition, and streaks that keep momentum.", points: ["Adaptive quizzes", "Spaced repetition", "Goal tracking"], cta: "Build My Plan" },
      { title: "Clubs & Cohorts", desc: "Group projects, peer review, and shared resources to learn together.", points: ["Projects toolkit", "Peer review", "Shared notes"], cta: "Create a Cohort" },
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
  parents: {
    tone: "emerald",
    heroKicker: "For Parents",
    heroTitle: <>Support Learning with <span className="text-emerald-600">Clear Insights</span></>,
    heroDesc: "Stay engaged with your student's progress. Weekly reports, goals, and safety controls in one place.",
    solutions: [
      { title: "Progress Tracking", desc: "Know what was learned and what needs attention.", points: ["Weekly summaries", "Strengths and gaps", "Attendance view"], cta: "View a Sample Report" },
      { title: "Guided Study Plans", desc: "Age-appropriate plans aligned to curriculum.", points: ["Standards aligned", "Parent tips", "Offline activities"], cta: "Build a Plan" },
      { title: "Family Portal", desc: "Multi-learner dashboards and notifications.", points: ["Multiple profiles", "Goals and rewards", "Privacy controls"], cta: "Set Up Family" },
    ],
    features: [
      { t: "Weekly Digest", d: "Email and in-app summaries." },
      { t: "Goals & Rewards", d: "Motivate with milestones." },
      { t: "Content Filters", d: "Age filtering and controls." },
      { t: "Shared Calendar", d: "Plan across devices." },
      { t: "Progress Alerts", d: "Get notified early." },
      { t: "School Sync", d: "Pull assignments from LMS." },
    ],
    pricing: {
      left: ["Up to 2 learners", "Weekly reports", "Parent tips"],
      mid: ["Unlimited learners", "Advanced insights", "School sync"],
      right: ["SSO", "Dedicated success", "Data exports"],
    },
  },
  teachers: {
    tone: "indigo",
    heroKicker: "For Teachers",
    heroTitle: <>Empower Classrooms with <span className="text-indigo-600">AI Tools</span></>,
    heroDesc: "Automate assessments, generate lesson plans, and free time for real teaching.",
    solutions: [
      { title: "Lesson Planning", desc: "AI planning from standards and objectives.", points: ["Standards aligned", "Differentiation", "Materials export"], cta: "Plan a Unit" },
      { title: "Assessment Suite", desc: "Build banks, assign, and auto grade.", points: ["Question generator", "Rubrics", "Proctoring options"], cta: "Create Assessment" },
      { title: "Class Analytics", desc: "Spot at-risk students and adjust groups.", points: ["Mastery heatmaps", "Grouping", "Parent communication"], cta: "Open Dashboard" },
    ],
    features: [
      { t: "Curriculum Aligner", d: "Maps to standards." },
      { t: "Rubrics", d: "Quick scoring with consistency." },
      { t: "Seating & Groups", d: "Data-informed grouping." },
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
  corporations: {
    tone: "amber",
    heroKicker: "For Corporations",
    heroTitle: <>Scale Skills with <span className="text-amber-600">AI Training</span></>,
    heroDesc: "Upskill teams with role-based paths, compliance training, and dashboards for managers.",
    solutions: [
      { title: "Onboarding", desc: "Role based paths that ramp hires faster.", points: ["Skills mapping", "Checkpoints", "Manager sign-off"], cta: "Design Onboarding" },
      { title: "Compliance", desc: "Automated reminders and attestations.", points: ["SCORM and xAPI", "Cert management", "Audit trails"], cta: "View Templates" },
      { title: "Upskilling", desc: "Career paths and assessments tied to impact.", points: ["Job frameworks", "Labs and projects", "Manager insights"], cta: "Create a Path" },
    ],
    features: [
      { t: "Skills Graph", d: "Map roles to skills and gaps." },
      { t: "Content Hub", d: "Import providers and internal docs." },
      { t: "Dashboards", d: "Team and exec views." },
      { t: "SSO & SCIM", d: "Enterprise-ready access." },
      { t: "APIs", d: "Automate assignments and reports." },
      { t: "Security", d: "Encryption and audit logs." },
    ],
    pricing: {
      left: ["Up to 50 employees", "Standard support", "Reports"],
      mid: ["Up to 500 employees", "Integrations", "Advanced analytics"],
      right: ["Unlimited", "SSO and SLA", "Dedicated manager"],
    },
  },
};
