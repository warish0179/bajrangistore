"use client";

import React from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Zap, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/format";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    brand: string;
    basePrice: number;
    salePrice: number;
    discountPercent: number;
    rating: number;
    reviewCount: number;
    stock: number;
    isDealOfTheDay?: boolean;
    isFlashDeal?: boolean;
    images: { url: string }[];
    variants?: any[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
  const hoverImage = product.images?.[1]?.url || primaryImage;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, product.variants?.[0] || null, 1);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist({
      id: product.id,
      title: product.title,
      slug: product.slug,
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      discountPercent: product.discountPercent,
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: product.stock,
      images: product.images,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Badges & Wishlist Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isFlashDeal && (
            <span className="pointer-events-auto bg-rose-600 text-white font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-rose-600/30">
              <Zap className="w-3 h-3 fill-white" /> FLASH DEAL
            </span>
          )}
          {product.isDealOfTheDay && !product.isFlashDeal && (
            <span className="pointer-events-auto bg-amber-500 text-white font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full shadow-md shadow-amber-500/30">
              DEAL OF THE DAY
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="pointer-events-auto bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={handleToggleWishlist}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            isFavorited
              ? "bg-rose-50 text-rose-500 shadow-rose-200"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Product Image Clickable Link */}
      <Link href={`/products/${product.slug}`} className="block relative pt-[100%] bg-slate-50 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes("photo-1505740420928")) {
              target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
            }
          }}
        />
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-1">
            {product.brand}
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-brand-600 transition-colors leading-snug mb-2"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-bold border border-emerald-200">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-bold text-amber-600 ml-auto">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="text-base font-extrabold text-slate-900">
              {formatCurrency(product.salePrice)}
            </div>
            {product.basePrice > product.salePrice && (
              <div className="text-[11px] text-slate-400 mrp-strike">
                {formatCurrency(product.basePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white p-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center group/btn"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
