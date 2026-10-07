"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, ShieldCheck, Flame, ArrowRight } from "lucide-react";

export function BrandSplashScreen() {
  const [stage, setStage] = useState<"hidden" | "emblem" | "emerge" | "tagline" | "fadeout">("hidden");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if splash has already been shown in this tab session
    const hasSeen = sessionStorage.getItem("bajrangi_splash_shown_v1");
    if (hasSeen) {
      return;
    }

    // Start Stage 1: Emblem appears
    setStage("emblem");

    // Progress bar ticker
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    // Stage 2 (800ms): Logo unfolds and "BajrangiStore" text emerges out of it
    const t1 = setTimeout(() => {
      setStage("emerge");
    }, 800);

    // Stage 3 (1800ms): Tagline and features reveal
    const t2 = setTimeout(() => {
      setStage("tagline");
    }, 1800);

    // Stage 4 (3000ms): Fade out
    const t3 = setTimeout(() => {
      setStage("fadeout");
    }, 3100);

    // Stage 5 (3600ms): Completely unmount and trigger pincode popup
    const t4 = setTimeout(() => {
      sessionStorage.setItem("bajrangi_splash_shown_v1", "true");
      setStage("hidden");
      window.dispatchEvent(new CustomEvent("bajrangi-splash-finished"));
    }, 3600);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("bajrangi_splash_shown_v1", "true");
    setStage("hidden");
    window.dispatchEvent(new CustomEvent("bajrangi-splash-finished"));
  };

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-radial-gradient overflow-hidden transition-all duration-700 select-none ${
        stage === "fadeout" ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(circle at center, #1e1302 0%, #0d0a06 45%, #050403 100%)",
      }}
    >
      {/* Ambient background pulsing aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-500/20 to-yellow-500/10 blur-[120px] animate-pulse pointer-events-none" />

      {/* Radiant particle rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-72 h-72 border border-amber-500/20 rounded-full animate-ping duration-1000" />
        <div className="absolute w-96 h-96 border border-orange-500/15 rounded-full" />
      </div>

      {/* Skip button in top right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 text-xs font-semibold text-amber-200/70 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Central Interactive Animation Container */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 max-w-lg z-10">
        {/* Step 1: The Core Emblem */}
        <div className="relative mb-6">
          {/* Glowing backplate halo */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 opacity-60 blur-xl animate-pulse" />

          {/* The Emblem Box */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-1 shadow-2xl shadow-orange-500/50 transition-all duration-700 flex items-center justify-center ${
              stage === "emblem"
                ? "scale-90 rotate-[-6deg]"
                : "scale-100 rotate-0 shadow-amber-500/60"
            }`}
          >
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-md flex items-center justify-center border border-amber-400/40 relative overflow-hidden">
              {/* Inner shimmer beam */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-shimmer" />

              <Flame className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-bounce duration-1000" />
            </div>
          </div>
        </div>

        {/* Step 2: "BajrangiStore" emerging out of the logo */}
        <div className="overflow-visible min-h-[60px] flex items-center justify-center">
          <div
            className={`transition-all duration-1000 transform ${
              stage === "emblem"
                ? "opacity-0 scale-50 translate-y-6"
                : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.5)]">
              BajrangiStore
            </h1>
          </div>
        </div>

        {/* Step 3: Tagline & Subtitles reveal */}
        <div
          className={`transition-all duration-700 mt-3 transform ${
            stage === "tagline" || stage === "fadeout"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bharat&apos;s Mega Marketplace</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            1,600+ Products • 4 Portals • Doorstep Delivery
          </p>
        </div>

        {/* Progress Bar & Loader */}
        <div className="w-48 sm:w-64 mt-8 flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-amber-500/20 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(245,158,11,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/60">
            {progress < 100 ? "Loading Marketplace..." : "Welcome!"}
          </span>
        </div>
      </div>
    </div>
  );
}
