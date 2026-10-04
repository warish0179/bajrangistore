"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  ChevronDown,
  Bell,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Store,
  LayoutDashboard,
  LogOut,
  Flame,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/format";

export function Navbar() {
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const { totalCount, subtotal } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pincode, setPincode] = useState("560038");
  const [cityArea, setCityArea] = useState("Bengaluru, Indiranagar");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch unread notifications
  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [user]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedCategory === "all") return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  const markNotificationsRead = async () => {
    if (unreadCount > 0) {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
    }
    setIsNotifOpen(!isNotifOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden md:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            MEGA FEST LIVE:
          </span>
          <span>Up to 70% Off on Electronics & Fashion | Free Express Delivery with code</span>
          <span className="bg-amber-400/20 text-amber-300 font-mono px-1.5 py-0.5 rounded text-[11px] font-bold">
            FREESHIP
          </span>
        </div>

        {/* Demo Switcher Quick Bar */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Test Role:</span>
          <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-800">
            <button
              onClick={() => switchRole("CUSTOMER")}
              className={`px-2 py-0.5 text-[11px] rounded transition-all font-medium ${
                user?.role === "CUSTOMER"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => switchRole("SELLER")}
              className={`px-2 py-0.5 text-[11px] rounded transition-all font-medium ${
                user?.role === "SELLER"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className={`px-2 py-0.5 text-[11px] rounded transition-all font-medium ${
                user?.role === "ADMIN"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-slate-900 text-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-6">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                  NexMart
                </span>
                <span className="text-[9px] tracking-wider uppercase text-brand-300 -mt-1 font-semibold">
                  Hyper-Store
                </span>
              </div>
            </Link>
          </div>

          {/* Location Delivery Selector (Desktop) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden lg:flex items-center gap-2 text-xs text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
          >
            <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Deliver to</div>
              <div className="font-semibold text-white truncate max-w-[130px]">{cityArea}</div>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl relative flex items-center shadow-inner rounded-xl overflow-hidden bg-white"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 text-slate-700 text-xs px-2.5 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer hidden sm:block font-medium hover:bg-slate-200 transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-living">Home & Living</option>
              <option value="beauty-grooming">Beauty</option>
              <option value="audio-sound">Audio</option>
              <option value="sports-fitness">Sports</option>
            </select>

            <input
              type="text"
              placeholder="Search for 4K laptops, flagship phones, sneakers, watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-slate-800 text-sm px-3.5 py-2.5 focus:outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-5 py-2.5 flex items-center justify-center transition-all duration-200 shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Notifications Dropdown */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={markNotificationsRead}
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <span className="text-xs text-brand-600 font-medium">All caught up</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link || "/account"}
                            onClick={() => setIsNotifOpen(false)}
                            className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                          >
                            <div className="font-semibold text-xs text-slate-900">{n.title}</div>
                            <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden sm:flex items-center gap-1.5 p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 relative transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/90 text-white px-3 py-2 rounded-xl border border-slate-700 transition-colors group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-medium">My Cart</span>
                <span className="text-xs font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>
            </Link>

            {/* User Account / Profile Menu */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/40"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-[10px] text-slate-400">Hi, {user.name.split(" ")[0]}</span>
                    <span className="text-xs font-bold flex items-center gap-0.5">
                      {user.role} <ChevronDown className="w-3 h-3 text-slate-400" />
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md shadow-brand-500/20"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Account Dropdown Modal */}
              {isAccountOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
                    <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                    <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-brand-100 text-brand-700 font-semibold text-[10px] rounded-full">
                      {user.role} ACCOUNT
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" /> My Orders & Returns
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Heart className="w-4 h-4 text-slate-400" /> My Wishlist
                    </Link>

                    {/* Seller Link */}
                    {(user.role === "SELLER" || user.role === "ADMIN") && (
                      <Link
                        href="/seller"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50/60 hover:bg-amber-100/60"
                      >
                        <Store className="w-4 h-4 text-amber-600" /> Seller Dashboard
                      </Link>
                    )}

                    {/* Admin Link */}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50/60 hover:bg-purple-100/60"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" /> Admin Console
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Strip */}
      <nav className="bg-slate-800 text-slate-200 border-t border-slate-700/60 px-4 md:px-8 py-2 text-xs overflow-x-auto scrollbar-none hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link
            href="/products"
            className="flex items-center gap-1 font-bold text-white hover:text-brand-300 transition-colors shrink-0"
          >
            <Menu className="w-4 h-4" /> All Categories
          </Link>
          <Link
            href="/products?isDeal=true"
            className="flex items-center gap-1 text-amber-400 font-semibold hover:text-amber-300 transition-colors shrink-0"
          >
            <Flame className="w-3.5 h-3.5" /> Flash Deals
          </Link>
          <Link
            href="/category/electronics"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Electronics & Gadgets
          </Link>
          <Link
            href="/category/fashion"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Fashion & Apparel
          </Link>
          <Link
            href="/category/home-living"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Home & Kitchen
          </Link>
          <Link
            href="/category/audio-sound"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Audio & Acoustics
          </Link>
          <Link
            href="/category/sports-fitness"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Sports & Fitness
          </Link>
          <Link
            href="/category/beauty-grooming"
            className="hover:text-white transition-colors shrink-0 font-medium"
          >
            Beauty & Skincare
          </Link>

          <div className="ml-auto flex items-center gap-4 text-slate-300 text-xs shrink-0">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 100% Certified Genuine
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span className="font-bold text-lg">NexMart Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {/* Role Switcher in Mobile Drawer */}
              <div className="bg-slate-100 p-3 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 mb-2">Instant Demo Switcher:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => {
                      switchRole("CUSTOMER");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1 text-xs rounded font-medium ${
                      user?.role === "CUSTOMER" ? "bg-brand-600 text-white" : "bg-white text-slate-700"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => {
                      switchRole("SELLER");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1 text-xs rounded font-medium ${
                      user?.role === "SELLER" ? "bg-amber-600 text-white" : "bg-white text-slate-700"
                    }`}
                  >
                    Seller
                  </button>
                  <button
                    onClick={() => {
                      switchRole("ADMIN");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1 text-xs rounded font-medium ${
                      user?.role === "ADMIN" ? "bg-purple-600 text-white" : "bg-white text-slate-700"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="space-y-1 font-medium text-slate-700">
                <Link
                  href="/products?isDeal=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-amber-600 font-bold bg-amber-50"
                >
                  <Flame className="w-4 h-4 text-amber-500" /> Flash Deals & Offers
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  All Products
                </Link>
                <Link
                  href="/category/electronics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Electronics & Gadgets
                </Link>
                <Link
                  href="/category/fashion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Fashion & Apparel
                </Link>
                <Link
                  href="/category/home-living"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Home & Living
                </Link>
                <Link
                  href="/category/audio-sound"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Audio & Acoustics
                </Link>
                <Link
                  href="/category/sports-fitness"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Sports & Fitness
                </Link>
                <Link
                  href="/category/beauty-grooming"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-100"
                >
                  Beauty & Skincare
                </Link>
              </div>

              {user && (
                <div className="border-t border-slate-200 pt-3 space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    My Account
                  </div>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    My Wishlist
                  </Link>
                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <Link
                      href="/seller"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 rounded-lg text-amber-600 font-semibold"
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 rounded-lg text-purple-600 font-semibold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200">
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Pincode & Delivery Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> Choose Delivery Location
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 my-3">
              Delivery options and speeds may vary based on your postal code. Enter your 6-digit pin code below:
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 560038"
                className="flex-1 px-4 py-2 border rounded-xl font-mono text-sm focus:outline-brand-600"
              />
              <button
                onClick={() => {
                  if (pincode.length === 6) {
                    setCityArea(`Pincode ${pincode}`);
                    setIsLocationModalOpen(false);
                  }
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs px-4 py-2 rounded-xl"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600">Quick Cities:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setPincode("560038");
                    setCityArea("Bengaluru, 560038");
                    setIsLocationModalOpen(false);
                  }}
                  className="p-2 border rounded-lg hover:border-brand-500 text-left font-medium text-slate-700"
                >
                  Bengaluru (Indiranagar)
                </button>
                <button
                  onClick={() => {
                    setPincode("110001");
                    setCityArea("New Delhi, 110001");
                    setIsLocationModalOpen(false);
                  }}
                  className="p-2 border rounded-lg hover:border-brand-500 text-left font-medium text-slate-700"
                >
                  New Delhi (Connaught Pl.)
                </button>
                <button
                  onClick={() => {
                    setPincode("400001");
                    setCityArea("Mumbai, 400001");
                    setIsLocationModalOpen(false);
                  }}
                  className="p-2 border rounded-lg hover:border-brand-500 text-left font-medium text-slate-700"
                >
                  Mumbai (Fort / Colaba)
                </button>
                <button
                  onClick={() => {
                    setPincode("500081");
                    setCityArea("Hyderabad, 500081");
                    setIsLocationModalOpen(false);
                  }}
                  className="p-2 border rounded-lg hover:border-brand-500 text-left font-medium text-slate-700"
                >
                  Hyderabad (Hitec City)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
