"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, Clock, ArrowRight, Search, FileText } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async (status: string) => {
    setIsLoading(true);
    try {
      const url = status === "ALL" ? "/api/orders" : `/api/orders?status=${status}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const matchNumber = o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchItem = o.items.some((i: any) =>
      i.productTitle.toLowerCase().includes(search.toLowerCase())
    );
    return matchNumber || matchItem;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Orders & History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track packages, initiate returns, download invoices, and manage past purchases
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
          {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab === "ALL" ? "All Orders" : tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search within orders */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search order ID or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border rounded-xl text-xs bg-white focus:outline-brand-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any orders matching the current filter.
          </p>
          <Link
            href="/products"
            className="inline-block bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              {/* Card Header Strip */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Order Placed
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Total
                    </span>
                    <span className="font-black text-slate-900">
                      {formatCurrency(order.finalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-brand-100 text-brand-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                  >
                    #{order.orderNumber} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items row */}
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3 flex-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 pr-4">
                      <img
                        src={item.productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                          {item.productTitle}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Qty: {item.quantity} • {formatCurrency(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track Package
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
