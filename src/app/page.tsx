import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FlashDeals } from "@/components/home/FlashDeals";
import { DealOfTheDay } from "@/components/home/DealOfTheDay";
import { ProductCard } from "@/components/products/ProductCard";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Headphones, BadgePercent } from "lucide-react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [banners, categories, flashProducts, dealOfTheDay, featuredProducts, trendingProducts] =
    await Promise.all([
      prisma.banner.findMany({
        where: { active: true, type: "HERO" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isFlashDeal: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
        take: 4,
      }),
      prisma.product.findFirst({
        where: { isDealOfTheDay: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
      }),
      prisma.product.findMany({
        where: { isFeatured: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
        take: 8,
      }),
      prisma.product.findMany({
        orderBy: { reviewCount: "desc" },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
        take: 8,
      }),
    ]);

  return (
    <div className="space-y-10">
      {/* 1. Hero Carousel */}
      <HeroSlider slides={banners} />

      {/* 2. Visual Categories Strip */}
      <CategoryStrip categories={categories} />

      {/* 3. Limited Time Flash Deals with Live Countdown */}
      <FlashDeals products={flashProducts} />

      {/* 4. Deal of the Day Spotlight */}
      {dealOfTheDay && <DealOfTheDay product={dealOfTheDay} />}

      {/* 5. Featured Products Grid */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
              <span className="bg-brand-100 text-brand-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                HANDPICKED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Engineered for excellence, certified by BajrangiStore quality assurance
            </p>
          </div>
          <Link
            href="/products?sort=rating_desc"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Promotional Mid-Page Banner */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
            BajrangiStore Elite Membership
          </span>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Unlock Same-Day Free Shipping & 5% Cashback on All Orders
          </h3>
          <p className="text-xs md:text-sm text-indigo-200">
            Join millions of smart shoppers saving over ₹12,000 yearly with exclusive early access to flash drops.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link
            href="/products?isDeal=true"
            className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Join Free for 30 Days &rarr;
          </Link>
        </div>
      </div>

      {/* 7. Trending & Top Rated Products */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Trending Bestsellers
              </h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                HOT RIGHT NOW
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Top reviewed products loved by verified customers across India
            </p>
          </div>
          <Link
            href="/products?sort=discount_desc"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            See Top Deals <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Recently Viewed Section */}
      <RecentlyViewedSection />

      {/* 9. Value Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-t border-slate-200">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">HyperFast Delivery</h4>
            <p className="text-[11px] text-slate-500">Free shipping on orders above ₹499</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Certified Authentic</h4>
            <p className="text-[11px] text-slate-500">100% genuine brand warranty</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <BadgePercent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Best Price Guarantee</h4>
            <p className="text-[11px] text-slate-500">Daily bank offers & instant discounts</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">24x7 Customer Care</h4>
            <p className="text-[11px] text-slate-500">Instant AI and human concierge</p>
          </div>
        </div>
      </section>
    </div>
  );
}
