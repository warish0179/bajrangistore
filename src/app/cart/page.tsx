"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    totalCount,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    finalAmount,
    freeShippingThreshold,
    freeShippingRemaining,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    setIsApplyingCoupon(true);
    await applyCoupon(code);
    setIsApplyingCoupon(false);
    setCouponInput("");
  };

  const handleMoveToWishlist = async (item: any) => {
    await toggleWishlist({
      id: item.productId,
      title: item.product.title,
      slug: item.product.slug,
      basePrice: item.product.basePrice,
      salePrice: item.product.salePrice,
      discountPercent: 10,
      rating: 4.8,
      reviewCount: 120,
      stock: item.product.stock,
      images: item.product.images,
    });
    await removeFromCart(item.id);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-600 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our flash deals and discover premium electronics and fashion!
        </p>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Shopping Cart <span className="text-sm font-medium text-slate-500">({totalCount} items)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected products and apply coupons before checkout
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 hidden sm:inline-block"
        >
          &larr; Continue Shopping
        </Link>
      </div>

      {/* Free Delivery Threshold Tracker */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            {freeShippingRemaining > 0 ? (
              <>
                <div className="text-xs font-bold text-slate-800">
                  Add <span className="text-brand-600">{formatCurrency(freeShippingRemaining)}</span> more to qualify for <span className="text-emerald-600">FREE Delivery</span>!
                </div>
                <div className="text-[11px] text-slate-500">Fast pan-India dispatch with verified tracking</div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Congratulations! You have unlocked FREE Express Delivery!
                </div>
                <div className="text-[11px] text-slate-500">Applied automatically to your order</div>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const itemPrice = item.variant ? item.variant.salePrice : item.product.salePrice;
            const imgEntry: any = item.product.images?.[0];
            const primaryImg = typeof imgEntry === "string" ? imgEntry : imgEntry?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";

            return (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Product Media & Info */}
                <div className="flex gap-4 items-center">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0"
                  >
                    <img src={primaryImg} alt="" className="w-full h-full object-cover" />
                  </Link>

                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-brand-600 line-clamp-1"
                    >
                      {item.product.title}
                    </Link>

                    {item.variant && (
                      <div className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md inline-block font-semibold">
                        {item.variant.name}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-base font-black text-slate-900">
                        {formatCurrency(itemPrice)}
                      </span>
                      {item.product.basePrice > itemPrice && (
                        <span className="text-xs text-slate-400 mrp-strike">
                          {formatCurrency(item.product.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToWishlist(item)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Move to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupons Column (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coupon Code Applicator */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-600" /> Apply Promo Code
            </h3>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-emerald-800">
                    {appliedCoupon.code} APPLIED
                  </div>
                  <div className="text-[11px] text-emerald-600">
                    You saved {formatCurrency(discountAmount)}!
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon (e.g. NEX50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs uppercase font-mono focus:outline-brand-600"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  {isApplyingCoupon ? "..." : "Apply"}
                </button>
              </div>
            )}

            {/* Quick Coupons List */}
            <div className="pt-2 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400">Available Offers:</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleApplyCoupon("NEX50")}
                  className="px-2.5 py-1 rounded-lg border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 text-[10px] font-bold"
                >
                  NEX50 (50% OFF)
                </button>
                <button
                  onClick={() => handleApplyCoupon("SUPER1000")}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 text-[10px] font-bold"
                >
                  SUPER1000 (₹1000 OFF)
                </button>
                <button
                  onClick={() => handleApplyCoupon("FREESHIP")}
                  className="px-2.5 py-1 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 text-[10px] font-bold"
                >
                  FREESHIP (Free Delivery)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-800">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (GST 5%)</span>
                <span className="font-bold text-slate-800">{formatCurrency(taxAmount)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-slate-900">Total Payable</span>
              <span className="font-black text-2xl text-slate-900">{formatCurrency(finalAmount)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="text-[11px] text-emerald-600 bg-emerald-50 p-2 rounded-xl text-center font-bold">
                🎉 Total savings on this order: {formatCurrency(discountAmount)}
              </div>
            )}

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Safe & Secure Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
