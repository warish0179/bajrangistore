"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function DeliveryLoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("delivery@bajrangistore.com");
  const [password, setPassword] = useState("delivery123");
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
        showToast(data.error || "Rider sign in failed", "error");
        return;
      }
      showToast(`Welcome back, ${data.user.name}!`, "success");
      window.location.href = "/delivery";
    } catch {
      showToast("Network error during rider sign in", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">BajrangiStore Delivery Partner App</h2>
        <p className="text-xs text-slate-400">
          Hyper-express doorstep courier & delivery fleet application
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pre-filled with active fleet rider: <strong>Ramesh Kumar</strong></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Rider Registered Mobile / Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Security PIN / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Verifying Rider..." : "Open Delivery Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <p>
              Want to join our delivery fleet?{" "}
              <Link href="/delivery/register" className="font-bold text-emerald-400 hover:underline">
                Register as Delivery Partner
              </Link>
            </p>
            <p>
              <Link href="/" className="text-slate-500 hover:text-slate-300">
                ← Return to BajrangiStore Storefront
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
