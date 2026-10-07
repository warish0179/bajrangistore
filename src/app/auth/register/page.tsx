"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Smartphone,
  Calendar,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Store,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // OTP Verification state
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    const target = mobile || email;
    if (!target) {
      showToast("Please enter your mobile number or email address", "error");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: target, purpose: "REGISTER" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpTimer(30);
        if (data.devOtp) {
          setOtpCode(data.devOtp);
          showToast(`Verification code sent! Code: ${data.devOtp} (Auto-filled for demo)`, "success");
        } else {
          showToast(`Verification code sent to ${target}`, "success");
        }
      } else {
        showToast(data.error || "Failed to send verification code", "error");
      }
    } catch {
      showToast("Network error while sending OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast("Please complete all required fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please verify.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    if (!otpSent || !otpCode) {
      showToast("Please request and verify the OTP verification code", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: mobile,
          password,
          dob,
          referralCode,
          otp: otpCode,
          role: "CUSTOMER",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Registration failed", "error");
        return;
      }

      showToast("Account created successfully! ₹500 welcome bonus added to your wallet 🎉", "success");
      window.location.href = "/";
    } catch {
      showToast("Network error during registration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-white font-black text-xl">
          B
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your BajrangiStore Account</h1>
        <p className="text-xs text-slate-500">
          Join millions of shoppers enjoying certified genuine brands & hyper-express delivery
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950">Welcome Gift: ₹500 Instant Wallet Credit</div>
            <div className="text-[11px] text-amber-800">Automatically credited upon completing registration</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Mobile Number with OTP Verification trigger */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 99887 76655"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || otpTimer > 0}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-3 py-2.5 rounded-xl shrink-0 transition-colors"
              >
                {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Get OTP"}
              </button>
            </div>
          </div>

          {/* OTP Code Input */}
          {otpSent && (
            <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/80 space-y-1.5 animate-in fade-in">
              <label className="font-bold text-slate-700 block">
                Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl focus:outline-amber-600 text-sm font-mono tracking-widest text-slate-900 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Connected to automated BajrangiStore OTP verification service
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Date of Birth & Referral Code (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. FESTIVE2026"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-amber-600 text-xs text-slate-900 font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
          >
            {isSubmitting ? "Creating Account..." : "Create BajrangiStore Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Existing account prompt */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-amber-600 hover:underline">
              Sign in to your account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-500">
            <Link href="/seller/register" className="flex items-center gap-1 hover:text-blue-600 font-medium">
              <Store className="w-3.5 h-3.5 text-blue-600" /> Sell on BajrangiStore
            </Link>
            <span>•</span>
            <Link href="/delivery/register" className="flex items-center gap-1 hover:text-emerald-600 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-600" /> Become a Delivery Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
