// lib/theme.js
export const cx = (...cls) => cls.filter(Boolean).join(" ");

export const tones = {
  rose: {
    bg50: "bg-rose-50",
    text600: "text-rose-600",
    bg600: "bg-rose-600",
    hoverBg500: "hover:bg-rose-500",
    border200: "border-rose-200",
    bullet500: "bg-rose-500",
  },
  emerald: {
    bg50: "bg-emerald-50",
    text600: "text-emerald-600",
    bg600: "bg-emerald-600",
    hoverBg500: "hover:bg-emerald-500",
    border200: "border-emerald-200",
    bullet500: "bg-emerald-500",
  },
  indigo: {
    bg50: "bg-indigo-50",
    text600: "text-indigo-600",
    bg600: "bg-indigo-600",
    hoverBg500: "hover:bg-indigo-500",
    border200: "border-indigo-200",
    bullet500: "bg-indigo-500",
  },
  amber: {
    bg50: "bg-amber-50",
    text600: "text-amber-600",
    bg600: "bg-amber-600",
    hoverBg500: "hover:bg-amber-500",
    border200: "border-amber-200",
    bullet500: "bg-amber-500",
  },
};

export const topGradients = {
  rose: "bg-gradient-to-r from-rose-200 via-fuchsia-200 to-sky-200",
  emerald: "bg-gradient-to-r from-emerald-200 via-teal-200 to-sky-200",
  indigo: "bg-gradient-to-r from-indigo-200 via-violet-200 to-sky-200",
  amber: "bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200",
};

export const toneAlpha = {
  rose: "rgba(244,63,94,0.12)",
  emerald: "rgba(16,185,129,0.12)",
  indigo: "rgba(79,70,229,0.12)",
  amber: "rgba(245,158,11,0.12)",
};
