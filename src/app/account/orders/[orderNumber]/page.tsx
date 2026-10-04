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
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

const ORDER_STAGES = [
  { key: "CONFIRMED", label: "Order Confirmed" },
  { key: "PROCESSING", label: "Packed & Quality Checked" },
  { key: "SHIPPED", label: "Dispatched & In Transit" },
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
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500">Loading order tracking timeline...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs font-bold text-brand-600">
          Back to Orders
        </Link>
      </div>
    );
  }

  let address: any = {};
  if (order.shippingAddress) {
    try {
      address = JSON.parse(order.shippingAddress);
    } catch {}
  }

  // Determine active step index
  const stageKeys = ORDER_STAGES.map((s) => s.key);
  let activeIndex = stageKeys.indexOf(order.status);
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
        showToast("Order cancelled successfully. Refund initiated.", "info");
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
        showToast("Return request submitted! Courier pickup will be scheduled.", "success");
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> All Orders
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Order #{order.orderNumber}
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                order.status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.status === "CANCELLED"
                  ? "bg-rose-100 text-rose-700"
                  : order.status === "RETURN_REQUESTED"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-brand-100 text-brand-700"
              }`}
            >
              {order.status}
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
            <FileText className="w-3.5 h-3.5 text-brand-600" /> View Invoice
          </button>

          {(order.status === "CONFIRMED" || order.status === "PROCESSING") && (
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

      {/* Visual Tracking Progress Stepper */}
      {activeIndex >= 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" /> Real-Time Delivery Tracking
              </h3>
              <p className="text-[11px] text-slate-500">
                Courier: <span className="font-semibold text-slate-800">{order.courierName || "Express Courier"}</span> • Tracking ID: <span className="font-mono font-semibold text-slate-800">{order.trackingNumber || "Pending"}</span>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Updates
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
              ? `Reason: ${order.cancelReason || "Customer requested"}. Refund of ${formatCurrency(order.finalAmount)} has been credited.`
              : `Return Reason: ${order.returnReason || "Item return requested"}. Reverse pickup initiated.`}
          </p>
        </div>
      )}

      {/* Real-time Order Timeline Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline Events Log (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Shipment Activity Log
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((event: any, idx: number) => (
                <div key={event.id || idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white shadow-xs" />
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
              <div className="text-xs text-slate-400">Order confirmed. Waiting for dispatch scan.</div>
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
                <span>{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> Delivery Address
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

            <p className="text-xs text-slate-600">
              Please choose a reason for cancelling this order. If paid online, a full refund of {formatCurrency(order.finalAmount)} will be initiated immediately to your payment method.
            </p>

            <div className="space-y-2 text-xs">
              {[
                "Found a better price elsewhere",
                "Order created by mistake",
                "Estimated delivery time is too long",
                "Need to change delivery address",
                "Other reason",
              ].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="cancel_r"
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                    className="accent-rose-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold text-xs"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
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
              <h3 className="font-bold text-base text-amber-800">
                Request Return / Replacement
              </h3>
              <button onClick={() => setIsReturnModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              NexMart 7-Day Guarantee: Our delivery executive will inspect the item at doorstep and hand you a replacement or trigger an instant refund.
            </p>

            <div className="space-y-2 text-xs">
              {[
                "Product damaged or defective",
                "Received wrong item or size",
                "Missing accessories or parts",
                "Item not as described on website",
                "No longer needed",
              ].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="return_r"
                    checked={returnReason === r}
                    onChange={() => setReturnReason(r)}
                    className="accent-amber-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnOrder}
                disabled={isReturning}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20"
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-150 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="text-lg font-black text-slate-900">Tax Invoice & Cash Receipt</h2>
                <div className="text-[11px] text-slate-400">NexMart Retail Private Limited</div>
              </div>
              <button onClick={() => setIsInvoiceOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs gap-4">
              <div>
                <span className="font-bold text-slate-500 block">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-800">INV-{order.orderNumber}</span>
                <span className="font-bold text-slate-500 block mt-2">Date:</span>
                <span className="text-slate-800">{formatDate(order.createdAt)}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500 block">GSTIN:</span>
                <span className="font-mono text-slate-800">29AABCN8942P1Z8</span>
                <span className="font-bold text-slate-500 block mt-2">Payment:</span>
                <span className="text-slate-800">{order.paymentMethod} (PAID)</span>
              </div>
            </div>

            <div className="border rounded-2xl overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-2.5 text-left">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {order.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-2.5">{item.productTitle}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right">{formatCurrency(item.price)}</td>
                      <td className="p-2.5 text-right font-bold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs space-y-1 text-right max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%) + SGST (2.5%):</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                <span>Grand Total:</span>
                <span>{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => window.print()}
                className="bg-brand-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
