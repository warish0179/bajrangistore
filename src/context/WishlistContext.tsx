"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { useCart } from "./CartContext";

export interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: { url: string }[];
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToCart: (product: WishlistProduct) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.items.map((i: any) => i.product) || []);
        }
      } else {
        const local = localStorage.getItem("nexmart_local_wishlist");
        if (local) {
          setWishlist(JSON.parse(local));
        } else {
          setWishlist([]);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("nexmart_local_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user, isLoading]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: WishlistProduct) => {
    const exists = isInWishlist(product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Removed from Wishlist`, "info");
      if (user) {
        try {
          await fetch(`/api/wishlist/${product.id}`, { method: "DELETE" });
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved to Wishlist! ❤️`, "success");
      if (user) {
        try {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    showToast("Removed from Wishlist", "info");
    if (user) {
      try {
        await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const moveToCart = async (product: WishlistProduct) => {
    await addToCart(product);
    await removeFromWishlist(product.id);
    showToast(`Moved "${product.title}" to cart!`, "success");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
