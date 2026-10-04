"use client";

import React from "react";
import Link from "next/link";
import { Star, Shield, Truck, Zap, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";

export function DealOfTheDay({ product }: { product: any }) {
  const { addToCart } = useCart();
  if (!product) return null;

  const highlights = product.highlights ? JSON.parse(product.highlights) : [];
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900";

  return (
    <div className="w-full my-12 bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Product Media Column */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative pt-[85%] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 group">
            <span className="absolute top-4 left-4 z-10 bg-amber-500 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-md">
              ★ DEAL OF THE DAY
            </span>
            <span className="absolute top-4 right-4 z-10 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm">
              SAVE {product.discountPercent}%
            </span>
            <img
              src={primaryImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Product Details Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1.5">
            {product.brand} EXCLUSIVE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
            {product.title}
          </h2>

          {/* Ratings */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-sm font-bold border border-emerald-200">
              <span>{product.rating}</span>
              <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-500">
              Verified Ratings ({product.reviewCount} customer reviews)
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
            {product.description}
          </p>

          {/* Key highlights bullets */}
          {highlights.length > 0 && (
            <div className="mb-6 space-y-1.5">
              {highlights.slice(0, 3).map((h: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price & Action Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatCurrency(product.salePrice)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="mrp-strike">{formatCurrency(product.basePrice)}</span>
                <span className="text-emerald-600 font-bold">
                  You Save {formatCurrency(product.basePrice - product.salePrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart(product, product.variants?.[0] || null, 1)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-5 py-3.5 rounded-xl transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
