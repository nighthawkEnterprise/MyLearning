import React from "react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-neutral-200/60 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500 md:flex-row md:px-6">
        <p>© {new Date().getFullYear()} My Learn. All rights reserved.</p>
        <ul className="flex items-center gap-6">
          <li><a className="hover:text-neutral-700">Privacy</a></li>
          <li><a className="hover:text-neutral-700">Terms</a></li>
          <li><a className="hover:text-neutral-700">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}
