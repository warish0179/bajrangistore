"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, RefreshCw, Truck, CreditCard, ChevronUp, Store } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-16 border-t border-slate-800 pb-16 md:pb-0">
      {/* Back to top banner */}
      <button
        onClick={scrollToTop}
        className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 py-3 text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b border-slate-800"
      >
        <ChevronUp className="w-4 h-4" /> Back to top
      </button>

      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">100% Genuine Products</div>
              <div className="text-[11px] text-slate-400">Direct from certified sellers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">7-Day Free Returns</div>
              <div className="text-[11px] text-slate-400">Doorstep pickup & instant wallet refund</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Bajrangi HyperLogistics</div>
              <div className="text-[11px] text-slate-400">Doorstep OTP-verified deliveries</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">UPI & Bank Transfer</div>
              <div className="text-[11px] text-slate-400">Zero surcharge & instant UTR verification</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-4">About BajrangiStore</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About BajrangiStore
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers & Opportunities
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:text-white transition-colors">
                Press & Media
              </Link>
            </li>
            <li>
              <Link href="/sustainability" className="hover:text-white transition-colors">
                Bajrangi Cares & Initiatives
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Partner with Us</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/seller" className="hover:text-amber-400 text-amber-300 transition-colors font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Sell on BajrangiStore
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:text-emerald-400 text-emerald-300 transition-colors font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Delivery Partner Portal
              </Link>
            </li>
            <li>
              <Link href="/seller/register" className="hover:text-white transition-colors">
                Become a Verified Merchant
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-purple-400 text-purple-300 transition-colors font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Controller Desk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Customer Care</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/account" className="hover:text-white transition-colors">
                My Profile & Wallet
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Track Orders & OTP
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Returns & Replacement
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white transition-colors">
                24x7 Help Center & FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Payment & Security</h4>
          <p className="text-slate-400 leading-relaxed mb-4">
            Supports PhonePe UPI QR scanner, direct IMPS/NEFT bank transfers, Cash on Delivery, and instant BajrangiStore Wallet checkouts.
          </p>
          <div className="flex flex-col gap-2">
            <div className="border border-slate-800 bg-slate-900 rounded-xl p-3 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Official Partner</div>
                <div className="text-xs font-bold text-white">Jio Payments Bank & UPI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand & Legal Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">BajrangiStore</span>
            <span className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} BajrangiStore Bharat Hyper-Market. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Security & Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
