"use client";

import React from "react";
import Link from "next/link";
import { History, Trash2, Star } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatCurrency } from "@/lib/format";

export function RecentlyViewedSection() {
  const { recentProducts, clearRecentProducts } = useRecentlyViewed();

  if (!recentProducts || recentProducts.length === 0) return null;

  return (
    <section className="w-full my-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Recently Viewed Items
          </h3>
        </div>

        <button
          onClick={clearRecentProducts}
          className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {recentProducts.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="group flex flex-col p-2.5 rounded-xl border border-slate-100 hover:border-brand-300 hover:shadow-md transition-all bg-slate-50/50"
          >
            <div className="relative pt-[100%] rounded-lg overflow-hidden bg-white mb-2">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-600">
              {item.title}
            </div>
            <div className="flex items-center gap-1 my-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-slate-700">{item.rating}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-auto">
              {formatCurrency(item.salePrice)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
