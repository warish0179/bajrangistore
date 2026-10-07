"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER";
  avatar?: string | null;
  storeSlug?: string | null;
  walletBalance?: number;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string; storeName?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER") => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password = "password123"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Login failed", "error");
        return false;
      }
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, "success");
      return true;
    } catch {
      showToast("Network error during login", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    storeName?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Registration failed", "error");
        return false;
      }
      setUser(data.user);
      showToast("Account created successfully! Welcome to BajrangiStore.", "success");
      return true;
    } catch {
      showToast("Network error during registration", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      showToast("Logged out successfully", "info");
      window.location.href = "/";
    } catch {
      setUser(null);
    }
  };

  const switchRole = async (targetRole: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER") => {
    try {
      const res = await fetch("/api/auth/switch-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        showToast(`Switched active profile to: ${data.user.name} (${targetRole})`, "success");
        if (targetRole === "ADMIN") {
          router.push("/admin");
        } else if (targetRole === "SELLER") {
          router.push("/seller");
        } else if (targetRole === "DELIVERY_WORKER") {
          router.push("/delivery");
        } else {
          router.push("/account");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUser: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
