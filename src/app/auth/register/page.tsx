"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock, Store, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    const success = await register({
      name,
      email,
      password,
      role,
      storeName: role === "SELLER" ? storeName : undefined,
    });

    setIsSubmitting(false);
    if (success) {
      if (role === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your NexMart Account</h1>
        <p className="text-xs text-slate-500">
          Join India's premier hyper-store for genuine electronics, lifestyle & express delivery
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
        {/* Role toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === "CUSTOMER" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole("SELLER")}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === "SELLER" ? "bg-amber-600 text-white shadow-xs" : "hover:text-slate-900"
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Seller Merchant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-xl focus:outline-brand-600 text-xs"
            />
          </div>

          {role === "SELLER" && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store / Brand Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Prime Tech Solutions"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-xl focus:outline-brand-600 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-xl focus:outline-brand-600 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs text-white ${
              role === "SELLER"
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                : "bg-brand-600 hover:bg-brand-700 shadow-brand-500/20"
            }`}
          >
            {isSubmitting
              ? "Creating..."
              : role === "SELLER"
              ? "Register as Verified Seller"
              : "Create Customer Account"}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
