"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, RefreshCw, Truck, CreditCard, ChevronUp } from "lucide-react";

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
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">100% Authentic</div>
              <div className="text-[11px] text-slate-400">Direct from certified brands</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">7-Day Free Returns</div>
              <div className="text-[11px] text-slate-400">Doorstep pickup & quick refund</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Express Delivery</div>
              <div className="text-[11px] text-slate-400">Free delivery on orders over ₹499</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Secure Payments</div>
              <div className="text-[11px] text-slate-400">256-bit encrypted checkout</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Get to Know Us</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About NexMart
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers & Culture
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:text-white transition-colors">
                Press Releases
              </Link>
            </li>
            <li>
              <Link href="/sustainability" className="hover:text-white transition-colors">
                NexMart Cares
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Make Money with Us</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/seller" className="hover:text-white transition-colors font-medium text-amber-400">
                Sell on NexMart Hub
              </Link>
            </li>
            <li>
              <Link href="/seller/register" className="hover:text-white transition-colors">
                Become a Verified Merchant
              </Link>
            </li>
            <li>
              <Link href="/affiliate" className="hover:text-white transition-colors">
                Affiliate Program
              </Link>
            </li>
            <li>
              <Link href="/fulfillment" className="hover:text-white transition-colors">
                Fulfillment by NexMart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">NexMart Protection</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/account" className="hover:text-white transition-colors">
                Your Account
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Returns Center
              </Link>
            </li>
            <li>
              <Link href="/protection" className="hover:text-white transition-colors">
                100% Purchase Guarantee
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white transition-colors">
                Help Center & FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">NexMart Mobile</h4>
          <p className="text-slate-400 leading-relaxed mb-4">
            Shop on the go with real-time delivery notifications, AR product previews, and instant flash deal drops.
          </p>
          <div className="flex flex-col gap-2">
            <div className="border border-slate-800 bg-slate-900 rounded-xl p-2.5 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Download for</div>
                <div className="text-xs font-bold text-white">iOS & Android App</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand & Legal Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">NexMart</span>
            <span className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} NexMart Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-white">
              Conditions of Use & Sale
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Notice
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Interest-Based Ads
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
