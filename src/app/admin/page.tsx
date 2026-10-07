"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  Layers,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  Banknote,
  DollarSign,
  Copy,
  Settings,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "PAYMENTS" | "PAYMENT_SETTINGS" | "DELIVERY_FLEET" | "PRODUCTS" | "ORDERS" | "CATEGORIES" | "USERS" | "COUPONS" | "BANNERS"
  >("OVERVIEW");

  const [metrics, setMetrics] = useState<any>({});
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allCoupons, setAllCoupons] = useState<any[]>([]);
  const [allBanners, setAllBanners] = useState<any[]>([]);

  // Payment Receiving Center state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState<any>({});
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [isVerifyingTx, setIsVerifyingTx] = useState(false);

  // Reject transaction modal
  const [rejectTxId, setRejectTxId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("UTR reference not found in bank statement.");

  // Payment Settings state
  const [paymentSettings, setPaymentSettings] = useState<any>({
    upiId: "9835400188-k322-3@ibl",
    upiQrImage: "/payments/bajrangi_upi_qr.jpg",
    accountHolder: "Warish Raj",
    accountNumber: "000521713102565",
    ifscCode: "JIOP0000001",
    bankName: "Jio Payments Bank",
    paymentInstructions: "Scan QR or transfer to bank details. Submit 12-digit UTR.",
    isUpiActive: true,
    isBankTransferActive: true,
    isCodActive: true,
    isWalletActive: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Delivery Fleet state
  const [deliveryWorkers, setDeliveryWorkers] = useState<any[]>([]);
  const [unassignedOrders, setUnassignedOrders] = useState<any[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");

  // New product form modal
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [prodTitle, setProdTitle] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodBasePrice, setProdBasePrice] = useState("");
  const [prodSalePrice, setProdSalePrice] = useState("");
  const [prodStock, setProdStock] = useState("50");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodDescription, setProdDescription] = useState("");

  // New coupon modal
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("PERCENT");
  const [couponVal, setCouponVal] = useState("20");
  const [couponMinOrder, setCouponMinOrder] = useState("999");

  // Fetch admin overview stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics || {});
        setSalesData(data.salesData || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/payments?status=${paymentFilter}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setPaymentAnalytics(data.analytics || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch("/api/payment-settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setPaymentSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeliveryFleet = async () => {
    try {
      const res = await fetch("/api/admin/delivery/assign");
      if (res.ok) {
        const data = await res.json();
        setDeliveryWorkers(data.workers || []);
        setUnassignedOrders(data.unassignedOrders || []);
        if (data.workers?.[0]) setSelectedWorkerId(data.workers[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPaymentSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "PAYMENTS") {
      fetchTransactions();
    } else if (activeTab === "PAYMENT_SETTINGS") {
      fetchPaymentSettings();
    } else if (activeTab === "DELIVERY_FLEET") {
      fetchDeliveryFleet();
    } else if (activeTab === "PRODUCTS") {
      fetch("/api/products?limit=50")
        .then((r) => r.json())
        .then((d) => setAllProducts(d.products || []));
    } else if (activeTab === "ORDERS") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => setAllOrders(d.orders || []));
    } else if (activeTab === "CATEGORIES") {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((d) => setAllCategories(d.categories || []));
    } else if (activeTab === "USERS") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => setAllUsers(d.users || []));
    } else if (activeTab === "COUPONS") {
      fetch("/api/admin/coupons")
        .then((r) => r.json())
        .then((d) => setAllCoupons(d.coupons || []));
    } else if (activeTab === "BANNERS") {
      fetch("/api/admin/banners")
        .then((r) => r.json())
        .then((d) => setAllBanners(d.banners || []));
    }
  }, [activeTab, paymentFilter]);

  const handleVerifyPayment = async (transactionId: string, status: "APPROVED" | "REJECTED", note?: string) => {
    setIsVerifyingTx(true);
    try {
      const res = await fetch("/api/payments/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          status,
          adminNote: note,
        }),
      });

      if (res.ok) {
        showToast(`Transaction ${status.toLowerCase()} successfully!`, "success");
        setRejectTxId(null);
        fetchTransactions();
        fetchStats();
      } else {
        const d = await res.json();
        showToast(d.error || "Action failed", "error");
      }
    } catch {
      showToast("Network error verifying transaction", "error");
    } finally {
      setIsVerifyingTx(false);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentSettings),
      });

      if (res.ok) {
        showToast("Store payment settings updated successfully!", "success");
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to update settings", "error");
      }
    } catch {
      showToast("Network error saving payment settings", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAssignDelivery = async (orderId: string) => {
    if (!selectedWorkerId) {
      showToast("Please select a delivery worker", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/delivery/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          deliveryWorkerId: selectedWorkerId,
        }),
      });

      if (res.ok) {
        showToast("Order assigned to courier partner!", "success");
        fetchDeliveryFleet();
      } else {
        const d = await res.json();
        showToast(d.error || "Assignment failed", "error");
      }
    } catch {
      showToast("Network error assigning delivery", "error");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prodTitle,
          brand: prodBrand,
          categoryId: prodCategory || allCategories[0]?.id,
          basePrice: prodBasePrice,
          salePrice: prodSalePrice,
          stock: prodStock,
          images: [prodImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
          description: prodDescription,
        }),
      });

      if (res.ok) {
        showToast("Product created successfully!", "success");
        setIsNewProductOpen(false);
        setProdTitle("");
        setProdBrand("");
        setProdBasePrice("");
        setProdSalePrice("");
        fetch("/api/products?limit=50")
          .then((r) => r.json())
          .then((d) => setAllProducts(d.products || []));
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to create product", "error");
      }
    } catch {
      showToast("Error creating product", "error");
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Product deleted", "info");
        setAllProducts((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  const handleUpdateOrderStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order #${orderNumber} marked as ${newStatus}`, "success");
        setAllOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          discountType: couponType,
          discountValue: couponVal,
          minOrderAmount: couponMinOrder,
        }),
      });

      if (res.ok) {
        showToast(`Coupon ${couponCode.toUpperCase()} created!`, "success");
        setIsNewCouponOpen(false);
        setCouponCode("");
        fetch("/api/admin/coupons")
          .then((r) => r.json())
          .then((d) => setAllCoupons(d.coupons || []));
      }
    } catch {
      showToast("Failed to create coupon", "error");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      showToast("Coupon removed", "info");
      setAllCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch {
      showToast("Error deleting coupon", "error");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-purple-600" /> BajrangiStore Admin Controller
            </h1>
            <span className="bg-purple-100 text-purple-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
              ENTERPRISE COMMAND
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Central controller for Payments Receiving Desk, Delivery Fleet, Inventory, Orders, and Marketing
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          View Live Storefront &rarr;
        </Link>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "OVERVIEW", label: "Overview & Analytics", icon: TrendingUp },
          { key: "PAYMENTS", label: "Payment Receiving Center", icon: CreditCard },
          { key: "PAYMENT_SETTINGS", label: "Payment Settings (UPI & Bank)", icon: Settings },
          { key: "DELIVERY_FLEET", label: "Delivery Fleet & Assignments", icon: Truck },
          { key: "PRODUCTS", label: "Product Catalog", icon: Package },
          { key: "ORDERS", label: "Orders Fulfillment", icon: ShoppingCart },
          { key: "CATEGORIES", label: "Categories", icon: Layers },
          { key: "USERS", label: "Users & Roles", icon: Users },
          { key: "COUPONS", label: "Coupons & Offers", icon: Tag },
          { key: "BANNERS", label: "Hero Banners", icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Gross Platform Revenue
              </span>
              <div className="text-2xl font-black text-slate-900">
                {formatCurrency(metrics.totalRevenue || 0)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this week
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total Orders
              </span>
              <div className="text-2xl font-black text-slate-900">
                {metrics.totalOrders || 0}
              </div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 block">
                Across fulfillment network
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Active Customers
              </span>
              <div className="text-2xl font-black text-slate-900">
                {metrics.totalUsers || 0}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {metrics.totalSellers || 1} registered sellers • 1 delivery fleet
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Low Stock Alerts
              </span>
              <div className="text-2xl font-black text-rose-600">
                {metrics.lowStockProducts || 0} Items
              </div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 block">
                Restock trigger recommended
              </span>
            </div>
          </div>

          {/* Revenue Trend Visualizer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Weekly Revenue Inflow</h3>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2.5 py-1 rounded-full">
                Real-Time Trend
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
              {salesData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">
                    {formatCurrency(d.revenue).slice(0, 5)}k
                  </span>
                  <div className="w-full bg-slate-100 h-36 rounded-2xl flex items-end p-1.5 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-amber-500 rounded-xl transition-all duration-500"
                      style={{ height: `${(d.revenue / 250000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Purchases</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900">
                      #{o.orderNumber} • {o.user?.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {o.items.length} items • {formatDateTime(o.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">{formatCurrency(o.finalAmount)}</div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT RECEIVING CENTER */}
      {activeTab === "PAYMENTS" && (
        <div className="space-y-6">
          {/* Payment Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Inflow</span>
              <div className="text-xl font-black text-slate-900 mt-1">{formatCurrency(paymentAnalytics.totalRevenue || 0)}</div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UPI QR Revenue</span>
              <div className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(paymentAnalytics.upiRevenue || 0)}</div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Transfer</span>
              <div className="text-xl font-black text-blue-600 mt-1">{formatCurrency(paymentAnalytics.bankRevenue || 0)}</div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COD Collected</span>
              <div className="text-xl font-black text-purple-600 mt-1">{formatCurrency(paymentAnalytics.codTotalCollected || 0)}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Pending UTR Verification</span>
              <div className="text-xl font-black text-amber-700 mt-1">{paymentAnalytics.pendingVerificationCount || 0} Queued</div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" /> Transaction Verification Desk ({transactions.length})
              </h3>

              <div className="flex gap-2">
                {["ALL", "PENDING_VERIFICATION", "APPROVED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPaymentFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      paymentFilter === st ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400">No payment transactions found matching filter.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Order #{tx.order?.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tx.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : tx.status === "PENDING_VERIFICATION"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {tx.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-1">
                        Customer: <span className="font-semibold text-slate-800">{tx.user?.name}</span> ({tx.user?.email}) • Method: <span className="font-bold text-slate-800">{tx.paymentMethod}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Submitted UTR / Ref: <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{tx.transactionRef || "N/A"}</span>
                      </div>
                      {tx.adminNote && (
                        <div className="text-[11px] text-slate-400 mt-0.5 italic">Note: {tx.adminNote}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-black text-slate-900">{formatCurrency(tx.amount)}</div>
                        <div className="text-[10px] text-slate-400">{formatDateTime(tx.createdAt)}</div>
                      </div>

                      {tx.status === "PENDING_VERIFICATION" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleVerifyPayment(tx.id, "APPROVED")}
                            disabled={isVerifyingTx}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectTxId(tx.id)}
                            disabled={isVerifyingTx}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT SETTINGS (UPI & BANK) */}
      {activeTab === "PAYMENT_SETTINGS" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" /> Store Payment Configuration (Encrypted)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure store UPI receiver ID, visual QR code, and Warish Raj Jio Payments Bank settlement account.
            </p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-6 text-xs">
            {/* UPI Settings */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-600" /> UPI QR & Scanner Configuration
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store UPI ID</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.upiId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">UPI QR Code Image Asset URL / Path</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.upiQrImage}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, upiQrImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs bg-white"
                  />
                </div>
              </div>

              {/* QR Preview */}
              <div className="flex items-center gap-4 pt-2">
                <img
                  src={paymentSettings.upiQrImage || "/payments/bajrangi_upi_qr.jpg"}
                  alt="QR Preview"
                  className="w-24 h-24 object-contain rounded-xl border bg-white shadow-2xs"
                />
                <div className="text-[11px] text-slate-500">
                  Current Active QR Image. Displays to customers during checkout when selecting UPI QR.
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Bank Transfer (NEFT / IMPS) Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.accountHolder}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, accountHolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.bankName}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.accountNumber}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.ifscCode}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, ifscCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Instructions shown to Customers</label>
                <textarea
                  rows={2}
                  value={paymentSettings.paymentInstructions}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white"
                />
              </div>
            </div>

            {/* Gateway Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.isUpiActive}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, isUpiActive: e.target.checked })}
                  className="accent-purple-600"
                />
                <span className="font-semibold text-slate-800">Enable UPI QR</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.isBankTransferActive}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, isBankTransferActive: e.target.checked })}
                  className="accent-purple-600"
                />
                <span className="font-semibold text-slate-800">Enable Bank Transfer</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.isCodActive}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, isCodActive: e.target.checked })}
                  className="accent-purple-600"
                />
                <span className="font-semibold text-slate-800">Enable Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.isWalletActive}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, isWalletActive: e.target.checked })}
                  className="accent-purple-600"
                />
                <span className="font-semibold text-slate-800">Enable Wallet Balance</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                {isSavingSettings ? "Saving Settings..." : "Save Payment Configuration"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: DELIVERY FLEET & ASSIGNMENTS */}
      {activeTab === "DELIVERY_FLEET" && (
        <div className="space-y-6">
          {/* Active Workers Fleet */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Active Delivery Fleet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {deliveryWorkers.map((w) => (
                <div key={w.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{w.user?.name}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {w.isOnline ? "ACTIVE ON RUN" : "IDLE"}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Vehicle: <span className="font-semibold">{w.vehicleType}</span> ({w.vehicleNumber})
                  </div>
                  <div className="text-slate-500">Service Zone: {w.currentCity}</div>
                  <div className="flex justify-between pt-2 border-t text-[11px] font-bold">
                    <span>Delivered: {w.completedDeliveriesCount}</span>
                    <span className="text-amber-600">Rating: {w.rating}⭐</span>
                    <span className="text-emerald-700">Earned: ₹{w.totalEarnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unassigned Orders Ready for Dispatch */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">
                Orders Ready for Delivery Assignment ({unassignedOrders.length})
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Assign to:</span>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="px-3 py-1.5 border rounded-xl bg-slate-50 font-bold"
                >
                  {deliveryWorkers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.user?.name} ({w.vehicleType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {unassignedOrders.length === 0 ? (
                <div className="py-6 text-center text-slate-400">All packed orders have been assigned to delivery personnel.</div>
              ) : (
                unassignedOrders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900">
                        #{ord.orderNumber} • {ord.user?.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Amount: {formatCurrency(ord.finalAmount)} • Method: {ord.paymentMethod}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignDelivery(ord.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" /> Assign Rider
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCTS MANAGEMENT */}
      {activeTab === "PRODUCTS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Product Catalog ({allProducts.length})
            </h3>
            <button
              onClick={() => setIsNewProductOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {allProducts.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border bg-slate-50 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Brand: {p.brand} • Category: {p.category?.name} • Stock: {p.stock} units
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-black text-slate-900">{formatCurrency(p.salePrice)}</div>
                    <div className="text-[10px] text-slate-400 mrp-strike">
                      {formatCurrency(p.basePrice)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(p.slug)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ORDERS FULFILLMENT */}
      {activeTab === "ORDERS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Fulfillment Console ({allOrders.length})
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {allOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Order #{ord.orderNumber}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Customer: {ord.user?.name} ({ord.user?.email}) • {ord.items.length} items • Amount: {formatCurrency(ord.finalAmount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Payment: {ord.paymentMethod} ({ord.paymentStatus}) • Courier: {ord.courierName} • OTP: {ord.deliveryOtp}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateOrderStatus(ord.orderNumber, e.target.value)}
                    className="border rounded-xl px-3 py-1.5 text-xs font-bold bg-slate-50 focus:outline-purple-600"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PACKED">PACKED</option>
                    <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                    <option value="ASSIGNED_TO_DELIVERY">ASSIGNED TO DELIVERY</option>
                    <option value="PICKED_UP">PICKED UP</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <Link
                    href={`/account/orders/${ord.orderNumber}`}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                    title="View Timeline"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CATEGORIES */}
      {activeTab === "CATEGORIES" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Categories & Taxonomies ({allCategories.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCategories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500">{c.description}</div>
                <div className="text-[10px] font-bold text-purple-600 pt-1">
                  Slug: /{c.slug} • {c._count?.products || 0} Products
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: USERS & ROLES */}
      {activeTab === "USERS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Registered Ecosystem Users ({allUsers.length})
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {allUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {u.role}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Wallet: ₹{(u.walletBalance || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: COUPONS */}
      {activeTab === "COUPONS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">Coupons & Promo Codes</h3>
            <button
              onClick={() => setIsNewCouponOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allCoupons.map((cpn) => (
              <div key={cpn.id} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 flex justify-between items-start">
                <div>
                  <div className="font-mono font-black text-sm text-purple-700">{cpn.code}</div>
                  <div className="text-xs text-slate-600 mt-1">{cpn.description}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Used: {cpn.timesUsed} times • Min Order: ₹{cpn.minOrderAmount}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(cpn.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: BANNERS */}
      {activeTab === "BANNERS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Hero Banners & Marketing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allBanners.map((b) => (
              <div key={b.id} className="rounded-2xl border overflow-hidden bg-slate-50">
                <img src={b.image} alt="" className="w-full h-36 object-cover" />
                <div className="p-3">
                  <div className="font-bold text-xs text-slate-900">{b.title}</div>
                  <div className="text-[11px] text-slate-500">{b.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {rejectTxId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-rose-600">Reject Payment Transaction</h3>
            <p className="text-xs text-slate-600">
              Provide reason for rejecting payment reference:
            </p>
            <input
              type="text"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectTxId(null)}
                className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyPayment(rejectTxId, "REJECTED", rejectNote)}
                className="w-1/2 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Add New Product to Store</h3>
              <button onClick={() => setIsNewProductOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Ultra Wireless Gaming Mouse"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">
                    Actual Brand <span className="text-[10px] text-amber-600 font-normal">(e.g. Samsung, Apple, Nike)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter actual brand name"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="4999"
                    value={prodBasePrice}
                    onChange={(e) => setProdBasePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="3499"
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isNewCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Create New Coupon</h3>
              <button onClick={() => setIsNewCouponOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={(e) => setCouponVal(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
