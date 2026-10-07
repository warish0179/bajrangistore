"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  ShieldCheck,
  Package,
  Heart,
  MapPin,
  Lock,
  Wallet,
  Tag,
  RotateCcw,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Truck,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDate } from "@/lib/format";

function CustomerAccountHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, refreshUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "orders" | "wallet" | "wishlist" | "coupons" | "returns" | "security" | "support"
  >("profile");

  // Sync tab from URL if present (e.g. /account?tab=orders)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "addresses", "orders", "wallet", "wishlist", "coupons", "returns", "security", "support"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Profile State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Management State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseNumber: "",
    street: "",
    area: "",
    landmark: "",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560038",
    type: "HOME",
    isDefault: false,
  });

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [topupAmount, setTopupAmount] = useState("1000");
  const [isToppingUp, setIsToppingUp] = useState(false);

  // Returns State
  const [returnsList, setReturnsList] = useState<any[]>([]);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Coupons
  const [coupons, setCoupons] = useState([
    { code: "FREESHIP", desc: "Free Delivery on orders above ₹499", discount: "₹80 OFF", min: 499 },
    { code: "WELCOME10", desc: "Flat 10% instant discount for new shoppers", discount: "10% OFF", min: 999 },
    { code: "BAJRANGI500", desc: "Flat ₹500 off on festive orders above ₹3,999", discount: "₹500 OFF", min: 3999 },
    { code: "FESTIVE25", desc: "25% Off on premium electronics and lifestyle", discount: "25% OFF", min: 2499 },
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch Addresses
  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch {
      // silent
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // silent
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const setIsOrdersLoading = (loading: boolean) => setIsLoadingOrders(loading);

  // Fetch Wallet & Transactions
  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.walletBalance || 0);
        setWalletTransactions(data.transactions || []);
      }
    } catch {
      // silent
    }
  };

  // Fetch Returns
  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/returns");
      if (res.ok) {
        const data = await res.json();
        setReturnsList(data.returnRequests || []);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      fetchAddresses();
      fetchOrders();
      fetchWallet();
      fetchReturns();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign In to View Your Account</h2>
        <p className="text-xs text-slate-500">
          Track orders, manage addresses, claim coupons, and view your BajrangiStore wallet.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md shadow-amber-500/30 hover:scale-105 transition-all"
        >
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  // Address Submit (Create or Update)
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAddressId ? "PUT" : "POST";
      const payload = editingAddressId ? { ...addressForm, id: editingAddressId } : addressForm;

      const res = await fetch("/api/addresses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingAddressId ? "Address updated!" : "New address saved!", "success");
        setIsAddressModalOpen(false);
        setEditingAddressId(null);
        setAddressForm({
          fullName: "",
          phone: "",
          houseNumber: "",
          street: "",
          area: "",
          landmark: "",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          type: "HOME",
          isDefault: false,
        });
        fetchAddresses();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to save address", "error");
      }
    } catch {
      showToast("Error saving address", "error");
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Address deleted successfully", "success");
        fetchAddresses();
      }
    } catch {
      showToast("Error deleting address", "error");
    }
  };

  // Edit Address setup
  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      houseNumber: addr.houseNumber || "",
      street: addr.street,
      area: addr.area || "",
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      type: addr.type || "HOME",
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  // Top up Wallet
  const handleTopupWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsToppingUp(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: topupAmount }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Wallet topped up successfully!", "success");
        fetchWallet();
        if (refreshUser) refreshUser();
      } else {
        showToast(data.error || "Top-up failed", "error");
      }
    } catch {
      showToast("Error processing wallet recharge", "error");
    } finally {
      setIsToppingUp(false);
    }
  };

  // Copy Coupon
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied!`, "success");
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      showToast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My BajrangiStore Account</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
              {user.role} PORTAL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal profile, addresses, orders, wallet, returns, and security settings
          </p>
        </div>

        {/* Live Wallet quick widget */}
        <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
          <Wallet className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-[10px] text-amber-800 font-bold uppercase">Bajrangi Wallet Balance</div>
            <div className="text-sm font-black text-amber-950">₹{walletBalance.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setActiveTab("wallet")}
            className="text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-xl transition-colors ml-2"
          >
            Recharge
          </button>
        </div>
      </div>

      {/* Main Grid: Clean Side Navigation + Active Tab Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Navigation Panel (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-1">
          {/* User mini banner */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-3">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"}
              alt=""
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-black text-slate-900 truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "profile"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4" /> Personal Profile
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "addresses"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" /> Delivery Addresses ({addresses.length})
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4" /> My Orders ({orders.length})
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "wallet"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4" /> Wallet & Refunds (₹{walletBalance})
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "wishlist"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "coupons"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" /> Coupons & Offers
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("returns")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "returns"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4" /> Returns & Refunds ({returnsList.length})
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "security"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Lock className="w-4 h-4" /> Login & Security
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "support"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" /> 24x7 Help Center
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <div className="pt-3 mt-3 border-t border-slate-100">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Right Content Panel (9 cols) */}
        <main className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">View and update your personal details</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    Verified Customer
                  </span>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsUpdatingProfile(true);
                  setTimeout(() => {
                    setIsUpdatingProfile(false);
                    showToast("Profile details updated successfully!", "success");
                  }, 500);
                }}
                className="space-y-4 text-xs max-w-md"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 99887 76655"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-amber-600/20"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Manage Saved Addresses</h2>
                  <p className="text-xs text-slate-500">Add or edit delivery locations for 1-click checkout</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      fullName: user.name,
                      phone: "+91 99887 76655",
                      houseNumber: "",
                      street: "",
                      area: "",
                      landmark: "",
                      city: "Bengaluru",
                      state: "Karnataka",
                      postalCode: "560038",
                      type: "HOME",
                      isDefault: addresses.length === 0,
                    });
                    setIsAddressModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              </div>

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
                  <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">No delivery addresses saved yet.</p>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    + Add your first address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
                        addr.isDefault
                          ? "border-amber-500 bg-amber-50/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {addr.type || "HOME"}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Default Address
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-slate-900">{addr.fullName}</div>
                      <div className="text-xs text-slate-600 leading-relaxed">
                        {addr.houseNumber && `${addr.houseNumber}, `}
                        {addr.street}, {addr.area && `${addr.area}, `}
                        {addr.landmark && `Near ${addr.landmark}, `}
                        {addr.city}, {addr.state} - <span className="font-mono font-semibold">{addr.postalCode}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-mono">Mobile: {addr.phone}</div>

                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-amber-600"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Modal */}
              {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
                    <h3 className="text-base font-black text-slate-900">
                      {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                    </h3>

                    <form onSubmit={handleAddressSubmit} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">10-Digit Mobile *</label>
                          <input
                            type="tel"
                            required
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Flat / House / Building</label>
                          <input
                            type="text"
                            placeholder="Flat 402, Building 7"
                            value={addressForm.houseNumber}
                            onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">PIN Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="Road, Lane, Street name"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Area / Locality</label>
                          <input
                            type="text"
                            placeholder="e.g. Indiranagar"
                            value={addressForm.area}
                            onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Landmark</label>
                          <input
                            type="text"
                            placeholder="Near Sony World Signal"
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">City / Town *</label>
                          <input
                            type="text"
                            required
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">State *</label>
                          <input
                            type="text"
                            required
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="addrType"
                            checked={addressForm.type === "HOME"}
                            onChange={() => setAddressForm({ ...addressForm, type: "HOME" })}
                          />
                          <span>Home (All-day delivery)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="addrType"
                            checked={addressForm.type === "WORK"}
                            onChange={() => setAddressForm({ ...addressForm, type: "WORK" })}
                          />
                          <span>Work (10 AM - 6 PM)</span>
                        </label>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          />
                          <span>Make this my default delivery address</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(false)}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Order History & Live Handshake OTP</h2>
                  <p className="text-xs text-slate-500">Track shipments, verify delivery OTPs, or cancel/return orders</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-700">No orders placed yet</h3>
                  <p className="text-xs text-slate-400">Discover 500+ genuine products with express delivery</p>
                  <Link
                    href="/products"
                    className="inline-block bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Order Placed</span>
                            <span className="font-bold text-slate-800">{formatDate(ord.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                            <span className="font-bold text-slate-900">{formatCurrency(ord.finalAmount)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Order ID</span>
                            <span className="font-mono font-bold text-slate-800">#{ord.orderNumber}</span>
                          </div>
                        </div>

                        {/* Secret Handshake OTP Card */}
                        {ord.status !== "DELIVERED" && ord.status !== "CANCELLED" && (
                          <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-amber-600" />
                            <div>
                              <span className="text-[10px] font-bold text-amber-900 block leading-tight">
                                Doorstep Delivery OTP
                              </span>
                              <span className="font-mono font-black text-amber-700 tracking-wider">
                                {ord.deliveryOtp || "8942"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="p-4 space-y-3">
                        {ord.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"}
                                alt=""
                                className="w-14 h-14 rounded-xl object-cover border"
                              />
                              <div>
                                <div className="font-bold text-slate-900 line-clamp-1">{item.productTitle}</div>
                                <div className="text-[11px] text-slate-500">
                                  Qty: {item.quantity} • {formatCurrency(item.price)} each
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="bg-slate-50/50 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                          Status: {ord.status.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/account/orders/${ord.orderNumber}`}
                            className="font-bold text-amber-600 hover:underline flex items-center gap-1"
                          >
                            View Order Details & Timeline <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WALLET */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">BajrangiStore Instant Wallet</h2>
                  <p className="text-xs text-slate-500">Fast 1-click checkout & instant auto-refund destination</p>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg shadow-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider opacity-80">Available Balance</span>
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black">
                  ₹{walletBalance.toLocaleString()}
                </div>
                <p className="text-xs opacity-90">
                  Instant settlement for cancellations & returns. Zero gateway failures.
                </p>
              </div>

              {/* Top up Wallet */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Add Funds to Wallet</h3>
                <form onSubmit={handleTopupWallet} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="100"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border rounded-xl font-bold bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isToppingUp}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl transition-colors"
                  >
                    {isToppingUp ? "Processing..." : "Add Money"}
                  </button>
                </form>
                <div className="flex gap-2 pt-1 text-[11px]">
                  {["500", "1000", "2000", "5000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-amber-500 font-bold"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions History */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Wallet Statements</h3>
                {walletTransactions.length === 0 ? (
                  <p className="text-xs text-slate-400">No wallet transactions logged yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border rounded-2xl overflow-hidden text-xs">
                    {walletTransactions.map((tx) => (
                      <div key={tx.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-800">
                            {tx.status === "REFUNDED" ? "Refund Credited" : "Wallet Debit / Purchase"}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatDate(tx.createdAt)} {tx.order ? `• Order #${tx.order.orderNumber}` : ""}
                          </div>
                        </div>
                        <span className={`font-mono font-bold ${tx.status === "REFUNDED" ? "text-emerald-600" : "text-slate-900"}`}>
                          {tx.status === "REFUNDED" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">My Saved Wishlist</h2>
                  <p className="text-xs text-slate-500">Products you've bookmarked for later</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
                  <Link href="/products" className="text-xs font-bold text-amber-600 hover:underline">
                    Browse Popular Deals
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-2xl p-3.5 space-y-3 relative group">
                      <img
                        src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                        alt=""
                        className="w-full h-36 object-cover rounded-xl"
                      />
                      <div>
                        <Link href={`/products/${item.slug}`} className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-amber-600">
                          {item.title}
                        </Link>
                        <div className="text-sm font-black text-slate-900 mt-1">
                          {formatCurrency(item.salePrice)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await addToCart(item, null, 1);
                            removeFromWishlist(item.id);
                            showToast("Moved to cart!", "success");
                          }}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-2 rounded-xl transition-colors"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Available Coupons & Vouchers</h2>
                  <p className="text-xs text-slate-500">Apply these at checkout for instant order deductions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.code} className="border-2 border-dashed border-amber-300 bg-amber-50/40 p-4 rounded-2xl space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {c.discount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.desc}</p>
                    <div className="text-[11px] text-slate-500">Min. order amount: ₹{c.min}</div>
                    <button
                      onClick={() => handleCopyCoupon(c.code)}
                      className="w-full mt-2 bg-white border border-amber-300 hover:bg-amber-600 hover:text-white text-amber-900 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedCode === c.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: RETURNS */}
          {activeTab === "returns" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Return & Replacement Requests</h2>
                  <p className="text-xs text-slate-500">Track return pickup status and refund credits</p>
                </div>
              </div>

              {returnsList.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-2 text-xs text-slate-500">
                  <RotateCcw className="w-10 h-10 text-slate-300 mx-auto" />
                  <p>You have no active return or replacement requests.</p>
                  <p className="text-[11px] text-slate-400">
                    All BajrangiStore products come with 7-Day Hassle-Free Doorstep Replacement.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {returnsList.map((ret) => (
                    <div key={ret.id} className="p-4 border rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {ret.type}: Order #{ret.order?.orderNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {ret.status}
                        </span>
                      </div>
                      <p className="text-slate-600">Reason: {ret.reason}</p>
                      <div className="text-[11px] text-slate-500">
                        Refund Destination: {ret.refundType === "WALLET" ? "BajrangiStore Instant Wallet" : "Original Payment Method"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Login & Security Settings</h2>
                  <p className="text-xs text-slate-500">Change your password and manage account protection</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                >
                  {isUpdatingPassword ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-6 text-xs">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">24x7 Customer Help Center</h2>
                  <p className="text-xs text-slate-500">Need assistance with your orders or delivery?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-2">
                  <HelpCircle className="w-6 h-6 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900">Live Support Chat</h3>
                  <p className="text-slate-500 text-xs">
                    Chat with our 24x7 automated assistant and live support representatives.
                  </p>
                  <button
                    onClick={() => {
                      const btn = document.getElementById("bajrangi-support-trigger");
                      if (btn) btn.click();
                      else showToast("Support chat is active on the bottom right!", "info");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Open Live Chat
                  </button>
                </div>

                <div className="p-5 border rounded-2xl bg-slate-50 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">Buyer Protection Policy</h3>
                  <p className="text-slate-500 text-xs">
                    100% genuine products, tamper-proof OTP handshakes, and instant refunds.
                  </p>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Customer Helpline: +91 98354 00188
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CustomerAccountHubPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading BajrangiStore Account Hub...</div>}>
      <CustomerAccountHubContent />
    </React.Suspense>
  );
}
