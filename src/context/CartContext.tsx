"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

export interface CartProduct {
  id: string;
  title: string;
  slug: string;
  salePrice: number;
  basePrice: number;
  images: { url: string }[];
  stock: number;
}

export interface CartVariant {
  id: string;
  name: string;
  salePrice: number;
  price: number;
  stock: number;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: CartProduct;
  variantId?: string | null;
  variant?: CartVariant | null;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  maxDiscount?: number | null;
  discountAmount: number;
}

interface CartContextType {
  cart: CartItemType[];
  isLoading: boolean;
  totalCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  finalAmount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  appliedCoupon: AppliedCoupon | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: any, variant?: any, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, qty: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_LIMIT = 499;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Fetch cart from backend or local storage
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          setCart(data.items || []);
        }
      } else {
        const local = localStorage.getItem("nexmart_local_cart");
        if (local) {
          setCart(JSON.parse(local));
        } else {
          setCart([]);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("nexmart_local_cart", JSON.stringify(cart));
    }
  }, [cart, user, isLoading]);

  const addToCart = async (product: any, variant?: any, quantity = 1) => {
    const itemPrice = variant ? variant.salePrice : product.salePrice;
    showToast(`Added "${product.title}" to cart!`, "success");

    if (user) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            variantId: variant?.id || null,
            quantity,
          }),
        });
        if (res.ok) {
          fetchCart();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local cart
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.productId === product.id && item.variantId === (variant?.id || null)
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        } else {
          const newItem: CartItemType = {
            id: "local-" + Math.random().toString(36).substring(2, 9),
            productId: product.id,
            product: {
              id: product.id,
              title: product.title,
              slug: product.slug,
              salePrice: product.salePrice,
              basePrice: product.basePrice,
              images: product.images || [{ url: "" }],
              stock: product.stock,
            },
            variantId: variant?.id || null,
            variant: variant || null,
            quantity,
          };
          return [...prev, newItem];
        }
      });
    }
  };

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (user) {
      try {
        await fetch(`/api/cart/${cartItemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty }),
        });
        fetchCart();
      } catch (err) {
        console.error(err);
      }
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    showToast("Item removed from cart", "info");
    if (user) {
      try {
        await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
        fetchCart();
      } catch (err) {
        console.error(err);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch("/api/cart", { method: "DELETE" });
        setCart([]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCart([]);
      localStorage.removeItem("nexmart_local_cart");
    }
    setAppliedCoupon(null);
  };

  // Calculations
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant ? item.variant.salePrice : item.product.salePrice;
    return acc + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === "PERCENT") {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : 70;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST estimate
  const finalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Invalid coupon code", "error");
        return { success: false, message: data.error };
      }

      setAppliedCoupon(data.coupon);
      showToast(`Coupon "${code.toUpperCase()}" applied successfully!`, "success");
      return { success: true, message: "Coupon applied" };
    } catch {
      showToast("Error applying coupon", "error");
      return { success: false, message: "Error" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        totalCount,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        finalAmount,
        freeShippingThreshold: FREE_SHIPPING_LIMIT,
        freeShippingRemaining,
        appliedCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
