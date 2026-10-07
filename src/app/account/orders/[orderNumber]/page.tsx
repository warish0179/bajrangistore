"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  RotateCcw,
  XCircle,
  ShieldCheck,
  ChevronLeft,
  X,
  Phone,
  KeyRound,
  Banknote,
  Send,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

const ORDER_STAGES = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PACKED", label: "Packed at Hub" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const { showToast } = useToast();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Found a better price elsewhere");
  const [isCancelling, setIsCancelling] = useState(false);

  // Return modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Product damaged or defective");
  const [isReturning, setIsReturning] = useState(false);

  // Invoice modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Resubmit UTR modal
  const [isUtrModalOpen, setIsUtrModalOpen] = useState(false);
  const [newUtrInput, setNewUtrInput] = useState("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500">Loading order tracking timeline...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs font-bold text-amber-600">
          Back to Orders
        </Link>
      </div>
    );
  }

  let address: any = {};
  if (order.shippingAddress) {
    try {
      address = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress;
    } catch {}
  }

  // Determine active step index
  const stageKeys = ORDER_STAGES.map((s) => s.key);
  let activeIndex = stageKeys.indexOf(order.status);
  if (order.status === "SELLER_PROCESSING" || order.status === "PROCESSING") activeIndex = 0;
  if (order.status === "READY_FOR_PICKUP" || order.status === "ASSIGNED_TO_DELIVERY") activeIndex = 1;
  if (order.status === "DELIVERED") activeIndex = 4;
  else if (order.status === "CANCELLED" || order.status === "RETURN_REQUESTED" || order.status === "RETURNED") {
    activeIndex = -1;
  }

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", cancelReason }),
      });
      if (res.ok) {
        showToast("Order cancelled successfully. Refund credited to BajrangiStore Wallet.", "info");
        setIsCancelModalOpen(false);
        fetchOrder();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to cancel order", "error");
      }
    } catch {
      showToast("Error processing cancellation", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnOrder = async () => {
    setIsReturning(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RETURN", returnReason }),
      });
      if (res.ok) {
        showToast("Return request submitted! Rider doorstep pickup scheduled.", "success");
        setIsReturnModalOpen(false);
        fetchOrder();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to submit return", "error");
      }
    } catch {
      showToast("Error processing return", "error");
    } finally {
      setIsReturning(false);
    }
  };

  const handleResubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUtrInput.trim()) return;

    setIsSubmittingUtr(true);
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          transactionRef: newUtrInput.trim(),
          paymentMethod: order.paymentMethod,
        }),
      });

      if (res.ok) {
        showToast("Updated UTR reference submitted for Admin verification!", "success");
        setIsUtrModalOpen(false);
        setNewUtrInput("");
        fetchOrder();
      } else {
        const data = await res.json();
        showToast(data.error || "Submission failed", "error");
      }
    } catch {
      showToast("Network error submitting UTR", "error");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const isOrderActive = order.status !== "DELIVERED" && order.status !== "CANCELLED";

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> All Orders
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Order #{order.orderNumber}
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                order.status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "CANCELLED"
                  ? "bg-rose-100 text-rose-800"
                  : order.status === "RETURN_REQUESTED"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {formatDateTime(order.createdAt)} • {order.items.length} items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" /> View Invoice
          </button>

          {(order.status === "CONFIRMED" || order.status === "PAYMENT_PENDING" || order.status === "PACKED") && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              Cancel Order
            </button>
          )}

          {order.status === "DELIVERED" && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Return / Replace
            </button>
          )}
        </div>
      </div>

      {/* Payment Verification Banner if Pending */}
      {order.paymentStatus === "PENDING_VERIFICATION" && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-amber-900">Payment Verification Queued</div>
              <div className="text-amber-700">
                Submitted reference: <span className="font-mono font-bold">{order.transactionId}</span>. The Admin Finance Desk is matching this against Jio Payments Bank statement.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsUtrModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shrink-0"
          >
            Update Reference
          </button>
        </div>
      )}

      {/* Secret Doorstep Delivery OTP Card (Active Orders) */}
      {isOrderActive && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-amber-100">Doorstep Verification Security</div>
              <div className="text-lg font-black">Your Secret Delivery OTP</div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Share this 4-digit code ONLY with your delivery rider at your doorstep.
              </p>
            </div>
          </div>

          <div className="bg-white text-slate-900 px-6 py-2 rounded-2xl font-mono text-2xl font-black tracking-widest shadow-md shrink-0">
            {order.deliveryOtp || "8942"}
          </div>
        </div>
      )}

      {/* Assigned Delivery Worker Card */}
      {order.deliveryWorker && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Assigned Delivery Partner</div>
              <div className="font-bold text-sm text-white">{order.deliveryWorker.user?.name || "Ramesh Kumar"}</div>
              <div className="text-xs text-slate-300">
                {order.deliveryWorker.vehicleType || "Hero Splendor"} • {order.deliveryWorker.vehicleNumber || "KA-05-EQ-4412"} • Rating 4.9⭐
              </div>
            </div>
          </div>

          <a
            href={`tel:${order.deliveryWorker.user?.phone || "+919988776655"}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call Rider
          </a>
        </div>
      )}

      {/* Visual Tracking Progress Stepper */}
      {activeIndex >= 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" /> Real-Time Delivery Tracking
              </h3>
              <p className="text-[11px] text-slate-500">
                Courier: <span className="font-semibold text-slate-800">{order.courierName || "Bajrangi HyperLogistics"}</span> • Tracking ID: <span className="font-mono font-semibold text-slate-800">{order.trackingNumber || "Pending"}</span>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Live Manifest Updates
            </span>
          </div>

          {/* Stepper Line */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
            {ORDER_STAGES.map((stage, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-xs mb-2 ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    } ${isCurrent ? "ring-4 ring-emerald-500/20 scale-105" : ""}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isCompleted ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 space-y-1">
          <div className="flex items-center gap-2 font-black text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            {order.status === "CANCELLED" ? "Order Cancelled" : "Return / Replacement in Progress"}
          </div>
          <p className="text-xs">
            {order.status === "CANCELLED"
              ? `Reason: ${order.cancelReason || "Customer requested"}. Refund of ${formatCurrency(order.finalAmount)} credited to BajrangiStore Wallet.`
              : `Return Reason: ${order.returnReason || "Item return requested"}. Doorstep pickup initiated.`}
          </p>
        </div>
      )}

      {/* Real-time Order Timeline Log & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timeline Events Log (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Shipment Activity Log
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((event: any, idx: number) => (
                <div key={event.id || idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white shadow-xs" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{event.title}</div>
                    {event.description && (
                      <p className="text-xs text-slate-600 mt-0.5">{event.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{formatDateTime(event.timestamp)}</span>
                      {event.location && <span>• {event.location}</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">Order logged. Awaiting warehouse dispatch scan.</div>
            )}
          </div>
        </div>

        {/* Items & Address Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Items Summary */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Purchased Items ({order.items.length})
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 border shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 truncate">{item.productTitle}</div>
                      {item.variantName && (
                        <div className="text-[10px] text-slate-400">{item.variantName}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900">{formatCurrency(item.total)}</div>
                    <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t">
                <span>Total Amount Paid</span>
                <span className="text-amber-600">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Delivery Address
            </h4>
            <div className="font-bold text-slate-800">{address.fullName}</div>
            <div className="text-slate-600 leading-snug">{address.street}</div>
            <div className="text-slate-500">
              {address.city}, {address.state} - {address.postalCode}
            </div>
            <div className="text-slate-500">Phone: {address.phone}</div>
          </div>
        </div>
      </div>

      {/* Resubmit UTR Modal */}
      {isUtrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Update Payment UTR Reference</h3>
              <button onClick={() => setIsUtrModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleResubmitUtr} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Enter your 12-digit UTR/Reference number from your UPI or Bank transfer receipt:
              </p>
              <input
                type="text"
                required
                value={newUtrInput}
                onChange={(e) => setNewUtrInput(e.target.value)}
                placeholder="e.g. 427819204812"
                className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-sm"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUtrModalOpen(false)}
                  className="w-1/2 py-2.5 font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUtr}
                  className="w-1/2 py-2.5 font-bold text-white bg-amber-600 rounded-xl"
                >
                  Submit UTR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-rose-600">Cancel Order #{order.orderNumber}</h3>
              <button onClick={() => setIsCancelModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this order? Any payments will be credited instantly to your BajrangiStore Wallet.
            </p>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-50"
              >
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-1/2 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-amber-700">Request Return / Replacement</h3>
              <button onClick={() => setIsReturnModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              BajrangiStore offers 7-day hassle-free doorstep returns. A courier rider will inspect and collect the package.
            </p>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Return Reason</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-50"
              >
                <option value="Product damaged or defective">Product damaged or defective</option>
                <option value="Item not as described">Item not as described</option>
                <option value="Size/fit issue">Size/fit issue</option>
                <option value="Missing parts or accessories">Missing parts or accessories</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnOrder}
                disabled={isReturning}
                className="w-1/2 py-2.5 text-xs font-bold text-white bg-amber-600 rounded-xl"
              >
                {isReturning ? "Submitting..." : "Schedule Pickup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-150 space-y-6 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-lg font-black tracking-tight text-amber-600">BajrangiStore</span>
                <p className="text-[10px] text-slate-400">Bharat Hyper-Market Pvt Ltd • GSTIN: 29AABCU9603R1ZM</p>
              </div>
              <button onClick={() => setIsInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold text-slate-900">Tax Invoice / Bill of Supply</div>
                <div className="text-slate-500">Invoice No: INV-{order.orderNumber}</div>
                <div className="text-slate-500">Order Date: {formatDate(order.createdAt)}</div>
                <div className="text-slate-500">Payment: {order.paymentMethod} ({order.paymentStatus})</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">Billed & Shipped To:</div>
                <div className="text-slate-600">{address.fullName}</div>
                <div className="text-slate-500">{address.street}</div>
                <div className="text-slate-500">{address.city}, {address.state} - {address.postalCode}</div>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-semibold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((i: any) => (
                  <tr key={i.id}>
                    <td className="py-2 font-medium">{i.productTitle} {i.variantName ? `(${i.variantName})` : ""}</td>
                    <td className="py-2 text-center">{i.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(i.price)}</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(i.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-3 space-y-1 text-right ml-auto max-w-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 border-t pt-2">
                <span>Grand Total:</span>
                <span className="text-amber-600">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>

            <div className="text-center pt-4 border-t text-[11px] text-slate-400">
              Thank you for shopping at BajrangiStore! Authorized digital invoice.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
