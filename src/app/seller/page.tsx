"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Trash2,
  ExternalLink,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Settings,
  X,
  ShieldCheck,
  FileText,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "PRODUCTS" | "ORDERS" | "SETTINGS">("OVERVIEW");
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New product state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("30");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Tracking update state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [courierName, setCourierName] = useState("Bajrangi HyperLogistics");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("PACKED");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  const fetchSellerData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/seller/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          brand: brand.trim(),
          categoryId: categoryId || categories[0]?.id,
          basePrice,
          salePrice,
          stock,
          images: [imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
          description,
        }),
      });

      if (res.ok) {
        showToast("Product listed successfully on BajrangiStore!", "success");
        setIsAddProductOpen(false);
        setTitle("");
        setBasePrice("");
        setSalePrice("");
        fetchSellerData();
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to add product", "error");
      }
    } catch {
      showToast("Error adding product", "error");
    }
  };

  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingTracking(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: dispatchStatus,
          courierName,
          trackingNumber: trackingNumber || `BJR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        }),
      });

      if (res.ok) {
        showToast(`Order #${selectedOrder.orderNumber} marked as ${dispatchStatus}!`, "success");
        setSelectedOrder(null);
        fetchSellerData();
      }
    } catch {
      showToast("Error updating order shipment", "error");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500">Loading BajrangiStore Sell Center...</span>
      </div>
    );
  }

  const seller = stats?.seller;
  const metrics = stats?.metrics || {};
  const products = stats?.products || [];
  const orders = stats?.orders || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-amber-600" /> {seller?.storeName || "BajrangiStore Sell Center"}
            </h1>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> VERIFIED MERCHANT (GSTIN ACTIVE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store catalog, pack orders for Bajrangi courier pickup, and view settlement payouts
          </p>
        </div>

        {seller?.storeSlug && (
          <Link
            href={`/sellers/${seller.storeSlug}`}
            className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-amber-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Storefront
          </Link>
        )}
      </div>

      {/* Seller Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "OVERVIEW", label: "Overview & Sales", icon: TrendingUp },
          { key: "PRODUCTS", label: "My Catalog & Stock", icon: Package },
          { key: "ORDERS", label: "Orders Fulfillment", icon: ShoppingCart },
          { key: "SETTINGS", label: "Store KYC & Profile", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Store Revenue
              </span>
              <div className="text-2xl font-black text-slate-900">
                {formatCurrency(metrics.totalRevenue || 0)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                Direct settlement payout
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
                Assigned for dispatch
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Listed Products
              </span>
              <div className="text-2xl font-black text-slate-900">
                {metrics.totalProducts || 0}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Active on marketplace</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Low Stock Warning
              </span>
              <div className="text-2xl font-black text-amber-600">
                {metrics.lowStockCount || 0}
              </div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 block">
                Units below threshold
              </span>
            </div>
          </div>

          {/* Recent Orders for Seller */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Buyer Orders</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {orders.slice(0, 5).map((o: any) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900">Order #{o.orderNumber}</div>
                    <div className="text-[11px] text-slate-500">
                      Buyer: {o.user?.name} • Items: {o.items.map((i: any) => i.productTitle).join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      {o.status}
                    </span>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      {formatDateTime(o.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PRODUCTS */}
      {activeTab === "PRODUCTS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Listed Products ({products.length})
            </h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {products.map((p: any) => (
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
                      Stock: <span className="font-bold">{p.stock} units</span> • Rating: {p.rating}★
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900">{formatCurrency(p.salePrice)}</div>
                  <div className="text-[10px] text-slate-400 mrp-strike">
                    {formatCurrency(p.basePrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ORDERS FULFILLMENT */}
      {activeTab === "ORDERS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Orders Awaiting Dispatch & History ({orders.length})
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {orders.map((ord: any) => (
              <div key={ord.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Order #{ord.orderNumber}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Buyer: {ord.user?.name} ({ord.user?.email}) • Items: {ord.items.length}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Status: <span className="font-bold text-slate-700">{ord.status}</span> • Courier: {ord.courierName || "Bajrangi HyperLogistics"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(ord);
                      setTrackingNumber(`BJR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" /> Pack & Dispatch
                  </button>

                  <Link
                    href={`/account/orders/${ord.orderNumber}`}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border"
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

      {/* Tab 4: SETTINGS */}
      {activeTab === "SETTINGS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 max-w-xl">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Store Profile & Compliance
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Name</label>
              <input
                type="text"
                disabled
                value={seller?.storeName || "TechNova Official Store"}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Slug URL</label>
              <input
                type="text"
                disabled
                value={`/sellers/${seller?.storeSlug || "technova"}`}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN Number</label>
              <input
                type="text"
                disabled
                value={seller?.gstNumber || "29AABCU9603R1ZM"}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PAN Number</label>
              <input
                type="text"
                disabled
                value={seller?.panNumber || "AAACU9603R"}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Bio & Description</label>
              <textarea
                rows={3}
                defaultValue={seller?.description || "Official seller of authentic electronics & smart gadgets on BajrangiStore."}
                className="w-full px-3 py-2 border rounded-xl resize-none"
              />
            </div>
            <button
              onClick={() => showToast("Store profile saved successfully!", "success")}
              className="bg-amber-600 text-white font-bold px-5 py-2 rounded-xl"
            >
              Save Store Profile
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal for Seller */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">List New Product</h3>
              <button onClick={() => setIsAddProductOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Wireless Active Noise Cancelling Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {categories.map((c) => (
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
                    placeholder="2999"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="1999"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">
                Fulfill Order #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleDispatchOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Fulfillment Status</label>
                <select
                  value={dispatchStatus}
                  onChange={(e) => setDispatchStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold"
                >
                  <option value="PACKED">PACKED (Ready for Courier Pickup)</option>
                  <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                  <option value="SHIPPED">DISPATCHED (In Transit)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Courier Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                >
                  <option value="Bajrangi HyperLogistics">Bajrangi HyperLogistics (Doorstep OTP Fleet)</option>
                  <option value="BlueDart Air Express">BlueDart Air Express</option>
                  <option value="Delhivery Express">Delhivery Express</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Waybill / Tracking Number</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTracking}
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  {isUpdatingTracking ? "Saving..." : "Confirm Status Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
