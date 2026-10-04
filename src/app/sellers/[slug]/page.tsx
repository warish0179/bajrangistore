import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Store, Star, ShieldCheck, CheckCircle2, Package, Phone, Mail } from "lucide-react";

export default async function SellerStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const seller = await prisma.sellerProfile.findUnique({
    where: { storeSlug: slug },
    include: {
      user: { select: { email: true, name: true } },
      products: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Store Banner & Brand Header */}
      <div className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-md">
        {/* Banner image */}
        <div className="h-44 sm:h-60 w-full relative bg-slate-900">
          <img
            src={seller.banner || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200"}
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Profile Info */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <img
              src={seller.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200"}
              alt={seller.storeName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-white shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {seller.storeName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED MERCHANT
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">{seller.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{seller.rating} / 5.0 Rating</span>
                </div>
                <span>•</span>
                <span>{seller.totalSales}+ Items Sold</span>
                {seller.gstNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-[11px]">GSTIN: {seller.gstNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> 100% Genuine Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Catalog of Store Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" /> Products from {seller.storeName}
            <span className="text-xs font-normal text-slate-500">
              ({seller.products.length} products listed)
            </span>
          </h2>
        </div>

        {seller.products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-500">
            No products currently listed in this store.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {seller.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
