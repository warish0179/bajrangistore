"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Package,
  Heart,
  MapPin,
  Lock,
  Store,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function AccountProfilePage() {
  const { user, switchRole } = useAuth();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "Rahul Sharma");
  const [phone, setPhone] = useState("+91 99887 76655");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      showToast("Profile details updated successfully!", "success");
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    showToast("Password updated successfully!", "success");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Account & Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal information, active role, addresses, and account security
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{user?.name || "Rahul Sharma"}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-100 text-brand-700">
                {user?.role || "CUSTOMER"}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email || "customer@nexmart.com"}</p>
            <p className="text-xs text-slate-500">{phone}</p>
          </div>
        </div>

        {/* Quick Demo Switcher on Account page */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
            Switch Demo Role:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => switchRole("CUSTOMER")}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                user?.role === "CUSTOMER" ? "bg-brand-600 text-white" : "bg-white text-slate-700 border"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => switchRole("SELLER")}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                user?.role === "SELLER" ? "bg-amber-600 text-white" : "bg-white text-slate-700 border"
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                user?.role === "ADMIN" ? "bg-purple-600 text-white" : "bg-white text-slate-700 border"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/account/orders"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 shadow-2xs transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Orders & History</div>
          <div className="text-lg font-black text-slate-900">View All &rarr;</div>
        </Link>

        <Link
          href="/account/wishlist"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 shadow-2xs transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Saved Wishlist</div>
          <div className="text-lg font-black text-slate-900">{wishlist.length} Items</div>
        </Link>

        {(user?.role === "SELLER" || user?.role === "ADMIN") && (
          <Link
            href="/seller"
            className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 shadow-2xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-amber-700">Seller Central</div>
            <div className="text-lg font-black text-amber-900">Open Dashboard</div>
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 shadow-2xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-purple-700">Admin Console</div>
            <div className="text-lg font-black text-purple-900">Manage Store</div>
          </Link>
        )}
      </div>

      {/* Profile Details & Password Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Form */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" /> Personal Details
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:outline-brand-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || "customer@nexmart.com"}
                className="w-full px-3 py-2 border rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:outline-brand-600"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Security & Password */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" /> Security & Password
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:outline-brand-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:outline-brand-600"
              />
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
