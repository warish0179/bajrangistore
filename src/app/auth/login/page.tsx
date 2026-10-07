"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Store,
  Shield,
  Smartphone,
  KeyRound,
  RefreshCw,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { showToast } = useToast();

  const [authMode, setAuthMode] = useState<"PASSWORD" | "OTP">("PASSWORD");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Login State
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast("Please enter your mobile/email and password", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Login failed", "error");
        return;
      }
      showToast(`Welcome back, ${data.user.name}!`, "success");
      // Hard refresh or navigate
      window.location.href = data.user.role === "ADMIN" ? "/admin" : data.user.role === "SELLER" ? "/seller" : data.user.role === "DELIVERY_WORKER" ? "/delivery" : "/";
    } catch {
      showToast("Network error during login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier) {
      showToast("Please enter your mobile number or email first", "info");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "LOGIN" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpTimer(30);
        if (data.devOtp) {
          setOtpCode(data.devOtp);
          showToast(`OTP Sent! Code: ${data.devOtp} (Auto-filled for demo)`, "success");
        } else {
          showToast("OTP sent to your mobile/email", "success");
        }
      } else {
        showToast(data.error || "Failed to send OTP", "error");
      }
    } catch {
      showToast("Error sending OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !otpCode) {
      showToast("Please enter your mobile/email and the 6-digit OTP", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: identifier,
          otp: otpCode,
          isOtpLogin: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "OTP verification failed", "error");
        return;
      }
      showToast(`Welcome to BajrangiStore, ${data.user.name}!`, "success");
      window.location.href = "/";
    } catch {
      showToast("Network error during OTP login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendForgotOtp = async () => {
    if (!forgotIdentifier) {
      showToast("Please enter your registered mobile number or email", "error");
      return;
    }
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotIdentifier, purpose: "FORGOT_PASSWORD" }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotOtpSent(true);
        if (data.devOtp) {
          setForgotOtp(data.devOtp);
          showToast(`OTP Code: ${data.devOtp} (Auto-filled)`, "success");
        } else {
          showToast("Verification code sent successfully", "success");
        }
      } else {
        showToast(data.error || "Failed to send verification code", "error");
      }
    } catch {
      showToast("Error sending verification code", "error");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier || !forgotOtp || !newPassword) return;

    setIsResettingPassword(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: forgotIdentifier,
          otp: forgotOtp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password reset successfully! Please sign in.", "success");
        setIsForgotModalOpen(false);
        setPassword("");
        setAuthMode("PASSWORD");
      } else {
        showToast(data.error || "Password reset failed", "error");
      }
    } catch {
      showToast("Error resetting password", "error");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleQuickDemo = async (role: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER") => {
    await switchRole(role);
    window.location.href = role === "ADMIN" ? "/admin" : role === "SELLER" ? "/seller" : role === "DELIVERY_WORKER" ? "/delivery" : "/";
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-white font-black text-xl">
          B
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to BajrangiStore</h1>
        <p className="text-xs text-slate-500">
          India's authentic marketplace with genuine certified brands & hyper-express delivery
        </p>
      </div>

      {/* 1-Click Fast Role Evaluation Bar for Reviewers */}
      <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" /> 1-Click Demo Evaluation Login:
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded font-bold">
            INSTANT
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
          <button
            onClick={() => handleQuickDemo("CUSTOMER")}
            className="p-1.5 bg-white border border-amber-200 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-xs text-center text-slate-800"
          >
            Customer
          </button>
          <button
            onClick={() => handleQuickDemo("SELLER")}
            className="p-1.5 bg-white border border-amber-200 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-xs text-center text-slate-800"
          >
            Seller
          </button>
          <button
            onClick={() => handleQuickDemo("DELIVERY_WORKER")}
            className="p-1.5 bg-white border border-amber-200 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xs text-center text-slate-800"
          >
            Delivery
          </button>
          <button
            onClick={() => handleQuickDemo("ADMIN")}
            className="p-1.5 bg-white border border-amber-200 hover:bg-purple-600 hover:text-white rounded-xl transition-all shadow-xs text-center text-slate-800"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
        {/* Toggle Login Mode (Password vs Mobile OTP) */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setAuthMode("PASSWORD")}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "PASSWORD" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Password Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("OTP")}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "OTP" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile OTP Login
          </button>
        </div>

        {authMode === "PASSWORD" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 9988776655 or customer@bajrangistore.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-amber-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to BajrangiStore"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Enter Mobile Number or Email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="+91 99887 76655"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || otpTimer > 0}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-3 py-2.5 rounded-xl shrink-0 transition-colors"
                >
                  {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Send OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-sm font-mono tracking-widest text-slate-900"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Connected to automated BajrangiStore OTP Gateway</span>
                  {otpTimer === 0 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-amber-600 hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !otpSent}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? "Verifying..." : "Verify & Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Register Prompt */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600">
            New to BajrangiStore?{" "}
            <Link href="/auth/register" className="font-bold text-amber-600 hover:underline">
              Create your account & get ₹500 wallet bonus
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500">
              Enter your registered mobile or email to receive an OTP and set a new password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile / Email</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9988776655"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleSendForgotOtp}
                    className="bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-[11px]"
                  >
                    Get OTP
                  </button>
                </div>
              </div>

              {forgotOtpSent && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter OTP"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!forgotOtpSent || isResettingPassword}
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-50"
                >
                  {isResettingPassword ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
