import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle,
  Truck,
  PackageCheck,
  FileText,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      timeline: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!order) {
    notFound();
  }

  let address: any = {};
  if (order.shippingAddress) {
    try {
      address = JSON.parse(order.shippingAddress);
    } catch {}
  }

  const estimatedDelivery = new Date(Date.now() + 48 * 3600 * 1000);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Celebratory Hero Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Confirmed • Verified
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Thank You! Your Order Has Been Placed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Order ID: <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>. A confirmation email and SMS have been sent with dispatch updates.
          </p>
        </div>

        {/* Expected Delivery Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-left">
            <Truck className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500">Estimated Delivery By:</div>
              <div className="font-extrabold text-slate-900 text-sm">
                {formatDate(estimatedDelivery)} (Express Air)
              </div>
            </div>
          </div>

          <Link
            href={`/account/orders/${order.orderNumber}`}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" /> Track Shipment
          </Link>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h3 className="font-black text-sm text-slate-900 pb-3 border-b border-slate-100">
          Order Items & Summary
        </h3>

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border border-slate-100 bg-slate-50"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.productTitle}
                  </div>
                  {item.variantName && (
                    <div className="text-[11px] text-slate-500">{item.variantName}</div>
                  )}
                  <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(item.total)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatCurrency(item.price)} each
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping address & Payment method details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> Delivery Address:
            </div>
            <div className="font-semibold text-slate-800">{address.fullName}</div>
            <div className="text-slate-600 text-[11px]">{address.street}</div>
            <div className="text-slate-500 text-[11px]">
              {address.city}, {address.state} - {address.postalCode}
            </div>
            <div className="text-slate-500 text-[11px]">Contact: {address.phone}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment & Logistics:
            </div>
            <div className="text-slate-700">
              Method: <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="text-slate-700">
              Transaction ID: <span className="font-mono text-[11px]">{order.transactionId}</span>
            </div>
            <div className="text-slate-700">
              Courier Partner: <span className="font-semibold">{order.courierName}</span>
            </div>
            <div className="text-slate-700">
              Tracking Number: <span className="font-mono text-[11px]">{order.trackingNumber}</span>
            </div>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">{formatCurrency(order.totalAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold text-slate-800">
              {order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Taxes (5%)</span>
            <span className="font-bold text-slate-800">{formatCurrency(order.taxAmount)}</span>
          </div>
          <div className="pt-2 border-t flex justify-between font-black text-sm text-slate-900">
            <span>Amount Paid</span>
            <span>{formatCurrency(order.finalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/account/orders/${order.orderNumber}`}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4" /> Live Tracking Timeline
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
