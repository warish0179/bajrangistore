"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Store, ShieldCheck, ArrowRight, Building, FileText, CreditCard, MapPin } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SellerRegisterPage() {
  const { showToast } = useToast();

  const [sellerName, setSellerName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !storeName || !mobile || !email || !password) {
      showToast("Please fill in all mandatory seller fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sellerName,
          email,
          phone: mobile,
          password,
          role: "SELLER",
          storeName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Seller onboarding failed", "error");
        return;
      }

      showToast("Seller registration submitted! Welcome to BajrangiStore Sell Center.", "success");
      window.location.href = "/seller";
    } catch {
      showToast("Network error during seller registration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 text-white">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Sell on BajrangiStore</h1>
          <p className="text-xs text-slate-400">
            Reach millions of customers with low 5% platform commission and next-day settlements
          </p>
        </div>

        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-800/80 text-xs text-blue-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="font-bold">Verified Merchant Guarantee</div>
              <div className="text-[11px] text-blue-300">
                All seller accounts undergo swift document verification for marketplace integrity.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Primary Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Primary Contact / Seller Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Store / Brand Trade Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Digital Retailers"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Official Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98111 22334"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Official Business Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="merchant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Portal Security Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500"
              />
            </div>

            {/* Tax & Legal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="font-bold text-slate-300 block mb-1">PAN Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. AABCS8942P"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 29AABCS8942P1Z8"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* Bank Details for Settlements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Settlement Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234 / JIOP0000001"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* Addresses */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Warehouse / Pickup Address</label>
              <textarea
                rows={2}
                placeholder="Address where delivery riders will collect packed parcels"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
            >
              {isSubmitting ? "Submitting Application..." : "Complete Seller Registration"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already a registered merchant?{" "}
            <Link href="/seller/login" className="font-bold text-blue-400 hover:underline">
              Sign In to Sell Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
