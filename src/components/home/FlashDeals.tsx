"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export function FlashDeals({ products }: { products: any[] }) {
  // Live countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="w-full my-10 p-5 md:p-8 rounded-3xl bg-gradient-to-br from-rose-950/20 via-slate-900 to-indigo-950 text-white border border-rose-500/20 shadow-xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with live countdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Flash Deals
              </h2>
              <span className="bg-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full animate-pulse">
                LIMITED STOCK
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Grab extraordinary limited-time price drops before the timer runs out!
            </p>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <Clock className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-semibold text-slate-300">Ends in:</span>
          <div className="flex items-center gap-1 font-mono text-sm font-black text-rose-400">
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-rose-500/30">
              {pad(timeLeft.hours)}h
            </span>
            <span>:</span>
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-rose-500/30">
              {pad(timeLeft.minutes)}m
            </span>
            <span>:</span>
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-rose-500/30">
              {pad(timeLeft.seconds)}s
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            {/* Limited stock progress bar */}
            <div className="mt-2 bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Claimed:</span>
                <span className="font-bold text-amber-400">84%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full w-[84%] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all flash deals footer */}
      <div className="mt-6 text-center">
        <Link
          href="/products?isDeal=true"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all border border-white/10"
        >
          View All Lightning Deals <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
