"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Headphones,
  Activity,
  Layers,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Headphones,
  Activity,
};

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  image?: string | null;
  _count?: { products: number };
}

export function CategoryStrip({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover thousands of handpicked top-rated products
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat) => {
          const IconComponent = (cat.icon && ICON_MAP[cat.icon]) || Layers;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm mb-2.5">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-colors" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1">
                {cat.name}
              </span>
              {cat._count?.products !== undefined && (
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {cat._count.products} Products
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
