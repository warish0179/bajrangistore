"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Store, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Login Tab
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpPhone, setOtpPhone] = useState("+91 99887 76655");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      router.push("/");
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode("8942");
    showToast("OTP sent: 8942 (Auto-filled for demo)", "info");
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    const success = await login("customer@nexmart.com", "customer123");
    setIsSubmitting(false);
    if (success) {
      router.push("/");
    }
  };

  const handleQuickDemoLogin = async (role: "CUSTOMER" | "SELLER" | "ADMIN") => {
    await switchRole(role);
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to NexMart</h1>
        <p className="text-xs text-slate-500">
          Access your personalized recommendations, orders & fast checkout
        </p>
      </div>

      {/* Demo 1-Click Role Logins Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-brand-50/50 p-4 rounded-3xl border border-brand-200/80 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-brand-700">
            <UserCheck className="w-4 h-4" /> 1-Click Demo Evaluation:
          </span>
          <span className="text-[10px] text-brand-600 font-semibold uppercase">Instant Switch</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemoLogin("CUSTOMER")}
            className="p-2.5 rounded-xl bg-white hover:bg-brand-600 hover:text-white border border-brand-200 text-slate-700 font-bold transition-all text-center flex flex-col items-center gap-1 shadow-2xs group"
          >
            <UserCheck className="w-4 h-4 text-brand-600 group-hover:text-white" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleQuickDemoLogin("SELLER")}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-600 hover:text-white border border-amber-200 text-slate-700 font-bold transition-all text-center flex flex-col items-center gap-1 shadow-2xs group"
          >
            <Store className="w-4 h-4 text-amber-600 group-hover:text-white" />
            <span>Seller</span>
          </button>

          <button
            onClick={() => handleQuickDemoLogin("ADMIN")}
            className="p-2.5 rounded-xl bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-slate-700 font-bold transition-all text-center flex flex-col items-center gap-1 shadow-2xs group"
          >
            <Shield className="w-4 h-4 text-purple-600 group-hover:text-white" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
        {/* Toggle Email vs OTP */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setIsOtpMode(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isOtpMode ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Password Login
          </button>
          <button
            onClick={() => setIsOtpMode(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isOtpMode ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Instant OTP Login
          </button>
        </div>

        {!isOtpMode ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="customer@nexmart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-brand-600 text-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-brand-600 font-semibold cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-brand-600 text-xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              {isSubmitting ? "Signing In..." : "Sign In to Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={otpPhone}
                onChange={(e) => setOtpPhone(e.target.value)}
                placeholder="+91 99887 76655"
                className="w-full px-3 py-2.5 border rounded-xl text-xs"
              />
            </div>

            {otpSent && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Enter 4-Digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="8942"
                  className="w-full px-3 py-2.5 border rounded-xl text-xs font-mono text-center tracking-widest text-lg font-bold"
                />
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md text-xs"
              >
                Send One-Time OTP
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-xs"
              >
                {isSubmitting ? "Verifying..." : "Verify & Sign In"}
              </button>
            )}
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          New to NexMart?{" "}
          <Link href="/auth/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
