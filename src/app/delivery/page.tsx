"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PackageCheck,
  Navigation,
  KeyRound,
  Banknote,
  DollarSign,
  Star,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  X,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { user, switchRole, logout } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");
  const [isLoading, setIsLoading] = useState(true);

  // Selected order for OTP modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("Handed to customer personally at doorstep");
  const [codCollected, setCodCollected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reschedule/Fail modal
  const [failOrder, setFailOrder] = useState<any>(null);
  const [failReason, setFailReason] = useState("Customer phone unreachable / door locked");

  const fetchDeliveryOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/delivery/orders?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.workerProfile) {
          setWorkerProfile(data.workerProfile);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch assigned deliveries", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOrders();
  }, [filter, user]);

  const handleStatusUpdate = async (orderId: string, newStatus: string, extraData: any = {}) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/delivery/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          newStatus,
          ...extraData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Update failed", "error");
        return;
      }

      showToast(data.message || `Order status updated to ${newStatus}`, "success");
      setSelectedOrder(null);
      setFailOrder(null);
      setOtpInput("");
      fetchDeliveryOrders();
    } catch {
      showToast("Network error updating status", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeliverWithOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 4) {
      showToast("Please enter the 4-digit Delivery OTP from the customer", "error");
      return;
    }
    handleStatusUpdate(selectedOrder.id, "DELIVERED", {
      enteredOtp: otpInput.trim(),
      proofNote: deliveryNote,
      codCollected: selectedOrder.paymentMethod === "COD" ? codCollected : false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Mobile-First Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">Bajrangi Rider App</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Rider: <span className="text-slate-200 font-semibold">{user?.name || "Ramesh Kumar"}</span> • Hero Splendor (KA-05-EQ-4412)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDeliveryOrders()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
              title="Refresh deliveries"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => switchRole("CUSTOMER")}
              className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
            >
              Exit Rider Mode
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Rider KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              Active Deliveries
              <Truck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">
              {orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              Completed Today
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {workerProfile?.completedDeliveriesCount ?? 8}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              Today's Earnings
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-300 mt-1">
              ₹{(workerProfile?.totalEarnings ?? 520).toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              Rider Rating
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">
              {workerProfile?.rating ?? 4.9} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("active")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Active Shipments ({orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "completed"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All Deliveries
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Zone: <span className="text-white font-medium">Bengaluru East & Central</span>
          </span>
        </div>

        {/* Delivery Cards Feed */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs text-slate-400">Loading delivery manifests...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-base text-white">All Clear, Good Job!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No pending deliveries matching this filter. Stand by for new order manifests assigned by Admin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              let address: any = {};
              try {
                address = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress;
              } catch {}

              const isCOD = order.paymentMethod === "COD";
              const isOutForDelivery = order.status === "OUT_FOR_DELIVERY";
              const isPickedUp = order.status === "PICKED_UP";
              const isAssigned = order.status === "ASSIGNED_TO_DELIVERY" || order.status === "PACKED" || order.status === "READY_FOR_PICKUP";
              const isDelivered = order.status === "DELIVERED";

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 rounded-3xl border transition-all overflow-hidden ${
                    isOutForDelivery
                      ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                      : isDelivered
                      ? "border-emerald-500/30 opacity-80"
                      : "border-slate-800"
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 bg-slate-950/40">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isDelivered
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : isOutForDelivery
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                            : isPickedUp
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isCOD ? (
                        <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[11px]">
                          <Banknote className="w-3.5 h-3.5" /> COD: {formatCurrency(order.finalAmount)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> PREPAID ({order.paymentMethod})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {address.fullName || order.user?.name || "Customer"}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-snug">
                          {address.street || "Address provided"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {address.city}, {address.state} - {address.postalCode}
                        </p>
                      </div>

                      {/* Action buttons: Call & Map Navigation */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`tel:${address.phone || order.user?.phone || "+919988776655"}`}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-xs font-bold px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Customer
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${address.street || ""}, ${address.city || ""}, ${address.postalCode || ""}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-xs font-bold px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Navigate
                        </a>
                      </div>
                    </div>

                    {/* Order Package Preview */}
                    <div className="text-xs">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        Package Contents ({order.items.length} items)
                      </div>
                      <div className="space-y-1.5">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between text-slate-300 bg-slate-800/40 p-2 rounded-xl">
                            <span className="truncate pr-2">
                              <span className="font-bold text-white">{item.quantity}x</span> {item.productTitle}
                            </span>
                            <span className="font-semibold text-slate-200 shrink-0">
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Controls Bar */}
                    {!isDelivered && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 justify-end">
                        {isAssigned && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "PICKED_UP")}
                            disabled={isSubmitting}
                            className="text-xs font-bold px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-colors"
                          >
                            Mark Picked Up from Hub
                          </button>
                        )}

                        {isPickedUp && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "OUT_FOR_DELIVERY")}
                            disabled={isSubmitting}
                            className="text-xs font-bold px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" /> Start Delivery Run
                          </button>
                        )}

                        {isOutForDelivery && (
                          <>
                            <button
                              onClick={() => setFailOrder(order)}
                              className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-rose-950/40 text-rose-400 rounded-xl border border-slate-700 transition-colors"
                            >
                              Unable to Deliver
                            </button>

                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setCodCollected(isCOD);
                              }}
                              className="text-xs font-black px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                            >
                              <KeyRound className="w-4 h-4" /> Enter Customer Doorstep OTP
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {isDelivered && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Successfully Delivered & Verified
                        </span>
                        <span>Earned: ₹65.00</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Doorstep Handshake OTP Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-sm text-white">Doorstep Delivery Handshake</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400">Order: <span className="font-mono font-bold text-white">#{selectedOrder.orderNumber}</span></div>
              <div className="text-slate-300">Recipient: <span className="font-bold text-white">{selectedOrder.user?.name}</span></div>
              <div className="text-[11px] text-amber-300 font-medium">
                Ask the customer to read out the 4-digit Delivery OTP shown in their BajrangiStore tracking app.
              </div>
            </div>

            {/* COD Collection Confirmation */}
            {selectedOrder.paymentMethod === "COD" && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4" /> Cash on Delivery Due:
                  </span>
                  <span className="font-black text-amber-400 text-base">
                    {formatCurrency(selectedOrder.finalAmount)}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={codCollected}
                    onChange={(e) => setCodCollected(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded"
                  />
                  <span>I have received full payment in Cash or UPI QR</span>
                </label>
              </div>
            )}

            <form onSubmit={handleDeliverWithOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Enter 4-Digit Customer OTP:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 8942"
                  autoFocus
                  className="w-full text-center text-3xl font-mono font-black tracking-widest py-3 px-4 bg-slate-950 border-2 border-emerald-500/60 focus:border-emerald-400 rounded-2xl text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Delivery Proof Note:
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-1/3 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otpInput.length !== 4}
                  className="w-2/3 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" /> Confirm & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unable to deliver / Reschedule modal */}
      {failOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Report Delivery Attempt Failed
            </h3>
            <p className="text-xs text-slate-400">
              Select reason for non-delivery of #{failOrder.orderNumber}:
            </p>

            <select
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-slate-200 focus:outline-none"
            >
              <option value="Customer phone unreachable / door locked">Customer phone unreachable / door locked</option>
              <option value="Customer requested reschedule tomorrow">Customer requested reschedule tomorrow</option>
              <option value="Incorrect delivery address provided">Incorrect delivery address provided</option>
              <option value="Customer refused package / cancelled">Customer refused package / cancelled</option>
            </select>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setFailOrder(null)}
                className="w-1/2 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(failOrder.id, "FAILED_DELIVERY", { proofNote: failReason })
                }
                className="w-1/2 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md"
              >
                Confirm Attempt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
