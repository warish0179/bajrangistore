"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import {
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  RefreshCw,
  Search as SearchIcon,
  Flame,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter state
  const search = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialBrand = searchParams.get("brand") || "all";
  const initialMinPrice = searchParams.get("minPrice") || "0";
  const initialMaxPrice = searchParams.get("maxPrice") || "250000";
  const initialMinRating = searchParams.get("minRating") || "0";
  const initialInStock = searchParams.get("inStock") === "true";
  const initialIsDeal = searchParams.get("isDeal") === "true";
  const initialSort = searchParams.get("sort") || "featured";
  const initialPage = searchParams.get("page") || "1";

  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [isDealOnly, setIsDealOnly] = useState(initialIsDeal);
  const [sortOrder, setSortOrder] = useState(initialSort);

  // Load categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch products when filters or search change
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCat !== "all") params.set("category", selectedCat);
      if (selectedBrand !== "all") params.set("brand", selectedBrand);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (minRating !== "0") params.set("minRating", minRating);
      if (inStockOnly) params.set("inStock", "true");
      if (isDealOnly) params.set("isDeal", "true");
      if (sortOrder) params.set("sort", sortOrder);
      params.set("page", initialPage);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
        setBrands(data.availableBrands || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCat !== "all") params.set("category", selectedCat);
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (maxPrice !== "250000") params.set("maxPrice", maxPrice);
    if (minRating !== "0") params.set("minRating", minRating);
    if (inStockOnly) params.set("inStock", "true");
    if (isDealOnly) params.set("isDeal", "true");
    if (sortOrder !== "featured") params.set("sort", sortOrder);
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
    setIsFilterDrawerOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCat("all");
    setSelectedBrand("all");
    setMaxPrice("250000");
    setMinRating("0");
    setInStockOnly(false);
    setIsDealOnly(false);
    setSortOrder("featured");
    router.push("/products");
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">
              {search ? `Search: "${search}"` : selectedCat !== "all" ? `Category: ${selectedCat}` : "All Products"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {search ? `Results for "${search}"` : "Explore Catalog"}
            <span className="text-xs font-normal text-slate-500">
              ({pagination.total} items found)
            </span>
          </h1>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              Sort by:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-brand-600 shadow-xs cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Customer Rating</option>
              <option value="discount_desc">Biggest Discount %</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="flex gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filter Catalog
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-brand-600">
                <input
                  type="radio"
                  name="desktop_cat"
                  checked={selectedCat === "all"}
                  onChange={() => setSelectedCat("all")}
                  className="accent-brand-600"
                />
                All Categories
              </label>
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer font-medium hover:text-brand-600"
                >
                  <input
                    type="radio"
                    name="desktop_cat"
                    checked={selectedCat === cat.slug}
                    onChange={() => setSelectedCat(cat.slug)}
                    className="accent-brand-600"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-xs font-bold text-brand-600">
                {formatCurrency(parseInt(maxPrice))}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="250000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          {/* Customer Rating */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-brand-600"
                >
                  <input
                    type="radio"
                    name="desktop_rating"
                    checked={minRating === r.toString()}
                    onChange={() => setMinRating(r.toString())}
                    className="accent-brand-600"
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{r}★ & above</span>
                  </div>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="desktop_rating"
                  checked={minRating === "0"}
                  onChange={() => setMinRating("0")}
                  className="accent-brand-600"
                />
                <span>All Ratings</span>
              </label>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-brand-600"
              />
              In-Stock Only
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-700">
              <input
                type="checkbox"
                checked={isDealOnly}
                onChange={(e) => setIsDealOnly(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Deals & Offers Only
              </span>
            </label>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Cards Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-200 h-80 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find anything matching your exact filter criteria. Try resetting filters or searching with different keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filters</h3>
              <button onClick={() => setIsFilterDrawerOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Category</h4>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full border rounded-xl p-2 text-xs"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Max Price:</span>
                <span>{formatCurrency(parseInt(maxPrice))}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-brand-600"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In-Stock Only
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDealOnly}
                  onChange={(e) => setIsDealOnly(e.target.checked)}
                />
                Deals Only
              </label>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsFilterDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
