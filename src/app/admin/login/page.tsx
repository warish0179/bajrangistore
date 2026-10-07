"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("admin@bajrangistore.com");
  const [password, setPassword] = useState("admin123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Admin authentication failed", "error");
        return;
      }
      if (data.user.role !== "ADMIN") {
        showToast("Access Denied: Administrative authorization required", "error");
        return;
      }
      showToast(`Welcome Founder / Admin: ${data.user.name}!`, "success");
      window.location.href = "/admin";
    } catch {
      showToast("Network error during admin sign in", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">BajrangiStore Master Controller</h2>
        <p className="text-xs text-slate-400">
          Authorized administrative access & platform governor portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/80 text-xs text-purple-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Pre-filled credentials: <strong>Warish Raj (Master Admin)</strong></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Administrative Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Master Controller"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300">
              ← Return to BajrangiStore Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
