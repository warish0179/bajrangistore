"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ViewedProduct {
  id: string;
  title: string;
  slug: string;
  salePrice: number;
  basePrice: number;
  discountPercent: number;
  rating: number;
  imageUrl: string;
}

interface RecentlyViewedContextType {
  recentProducts: ViewedProduct[];
  addRecentProduct: (product: ViewedProduct) => void;
  clearRecentProducts: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentProducts, setRecentProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexmart_recently_viewed");
      if (stored) {
        setRecentProducts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const addRecentProduct = (product: ViewedProduct) => {
    setRecentProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem("nexmart_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentProducts = () => {
    setRecentProducts([]);
    localStorage.removeItem("nexmart_recently_viewed");
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentProducts,
        addRecentProduct,
        clearRecentProducts,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
