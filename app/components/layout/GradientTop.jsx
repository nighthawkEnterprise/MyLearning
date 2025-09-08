import React from "react";
import { cx } from "@/lib/theme";

export default function GradientTop({ className }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 -top-32 z-0 blur-3xl">
      <div className={cx("mx-auto h-64 w-11/12 max-w-6xl opacity-60 rounded-3xl", className)} />
    </div>
  );
}
