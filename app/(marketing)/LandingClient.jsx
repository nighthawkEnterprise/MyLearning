"use client";
import React from "react";
import { AudienceProvider, useAudience } from "@/components/audience/AudienceProvider";
import Navbar from "@/components/layout/Navbar";
import GradientTop from "@/components/layout/GradientTop";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Solutions from "@/components/landing/Solutions";
import Features from "@/components/landing/Features";
import Logos from "@/components/landing/Logos";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import CtaBanner from "@/components/landing/CtaBanner";
import { tones, topGradients, toneAlpha, cx } from "@/lib/theme";
import { variants } from "@/lib/content";

function PageBody() {
  const { audience } = useAudience();
  const v = variants[audience];
  const tone = tones[v.tone];
  const grad = topGradients[v.tone];
  const alpha = toneAlpha[v.tone];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <GradientTop className={grad} />
      <Navbar tone={tone} />
      <main className="relative z-10">
        <Hero tone={tone} variant={v} alpha={alpha} audience={audience} />
        <Solutions tone={tone} variant={v} alpha={alpha} audience={audience} />
        <Features tone={tone} variant={v} />
        <Logos />
        <Testimonials tone={tone} />
        <Pricing tone={tone} variant={v} audience={audience} />
        <Faq tone={tone} />
        <CtaBanner tone={tone} />
      </main>
      <Footer />
    </div>
  );
}

export default function LandingClient({ initial = "students" }) {
  return (
    <AudienceProvider initial={initial}>
      <PageBody />
    </AudienceProvider>
  );
}
