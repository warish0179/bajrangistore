import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Layers, ArrowLeft } from "lucide-react";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Normalized slug mapping so any variant (/category/electronics, /category/fashion, etc.) seamlessly resolves
  const slugAliases: Record<string, string> = {
    "electronics": "electronics-audio",
    "electronics-gadgets": "electronics-audio",
    "gadgets": "electronics-audio",
    "audio": "electronics-audio",
    "audio-sound": "electronics-audio",
    "audio-acoustics": "electronics-audio",
    "fashion": "fashion-apparel",
    "fashion-clothing": "fashion-apparel",
    "clothing": "fashion-apparel",
    "apparel": "fashion-apparel",
    "home": "home-kitchen",
    "home-living": "home-kitchen",
    "home-appliances": "home-kitchen",
    "kitchen": "home-kitchen",
    "beauty": "beauty-grooming",
    "skincare": "beauty-grooming",
    "beauty-skincare": "beauty-grooming",
    "grocery": "grocery-gourmet",
    "gourmet": "grocery-gourmet",
    "sports": "sports-fitness",
    "fitness": "sports-fitness",
    "toys": "toys-kids",
    "kids": "toys-kids",
    "mobiles": "mobiles-tablets",
    "tablets": "mobiles-tablets",
    "laptops": "laptops-computers",
    "computers": "laptops-computers",
    "shoes": "footwear",
  };

  const targetSlug = slugAliases[slug.toLowerCase()] || slug;

  let category = await prisma.category.findUnique({
    where: { slug: targetSlug },
    include: {
      children: true,
      products: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
      },
    },
  });

  // Fallback: search by partial slug if not found
  if (!category) {
    category = await prisma.category.findFirst({
      where: {
        slug: { contains: slug.toLowerCase() },
      },
      include: {
        children: true,
        products: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            variants: true,
          },
        },
      },
    });
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-xl space-y-2 z-10 relative">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-white font-semibold transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{category.name}</h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-slate-300">{category.description}</p>
          )}
          <span className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
            {category.products.length} Products Available
          </span>
        </div>
      </div>

      {/* Subcategory Pills (if any) */}
      {category.children.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {category.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors shrink-0 shadow-2xs"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {category.products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products in this category yet</h3>
          <p className="text-xs text-slate-500 mt-1">Check back soon as new inventory arrives daily.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
