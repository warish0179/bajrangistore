"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, moveToCart, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500">
          Save your favorite products here so you can easily purchase them later or track price drops.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            My Saved Wishlist <span className="text-sm font-medium text-slate-500">({wishlist.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Items saved for future purchases with instant move-to-cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const imgUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="relative pt-[100%] bg-slate-50 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 bg-white/90 p-1.5 rounded-full text-slate-400 hover:text-rose-600 shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-brand-600 mb-1"
                  >
                    {product.title}
                  </Link>

                  <div className="flex items-center gap-1 my-1.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-bold text-slate-700">{product.rating}</span>
                  </div>

                  <div className="text-sm font-black text-slate-900 mt-1">
                    {formatCurrency(product.salePrice)}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3">
                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
