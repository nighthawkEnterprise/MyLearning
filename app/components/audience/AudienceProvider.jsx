"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AudienceCtx = createContext(null);

export function AudienceProvider({ initial = "students", children }) {
  const [audience, setAudience] = useState(initial);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("audience");
    if (saved) setAudience(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("audience", audience);
  }, [audience]);

  const value = useMemo(() => ({ audience, setAudience }), [audience]);
  return <AudienceCtx.Provider value={value}>{children}</AudienceCtx.Provider>;
}

export function useAudience() {
  const ctx = useContext(AudienceCtx);
  if (!ctx) throw new Error("useAudience must be used within AudienceProvider");
  return ctx;
}
