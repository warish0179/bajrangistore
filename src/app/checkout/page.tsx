"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Lock,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, shippingFee, taxAmount, finalAmount, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("rahul@okaxis");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8912");
  const [cardExpiry, setCardExpiry] = useState("10/28");
  const [cardCvv, setCardCvv] = useState("789");

  // New address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Bengaluru");
  const [newState, setNewState] = useState("Karnataka");
  const [newPostalCode, setNewPostalCode] = useState("560038");
  const [newType, setNewType] = useState("HOME");

  // Load user addresses or provide defaults
  useEffect(() => {
    const defaultAddresses = [
      {
        id: "addr-1",
        fullName: user?.name || "Rahul Sharma",
        phone: "+91 99887 76655",
        street: "Flat 402, Skyline Residency, Indiranagar 100 Feet Rd",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
        country: "India",
        type: "HOME",
        isDefault: true,
      },
      {
        id: "addr-2",
        fullName: (user?.name || "Rahul Sharma") + " (Office)",
        phone: "+91 99887 76655",
        street: "Tower B, 7th Floor, Prestige Tech Cloud Park, Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560103",
        country: "India",
        type: "WORK",
        isDefault: false,
      },
    ];
    setAddresses(defaultAddresses);
    setSelectedAddressId("addr-1");
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="inline-block bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
          Browse Products
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newPostalCode) return;

    const newAddr = {
      id: "addr-" + Date.now(),
      fullName: newFullName,
      phone: newPhone || "+91 98765 43210",
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: "India",
      type: newType,
      isDefault: false,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    setIsAddressModalOpen(false);
    showToast("New delivery address added!", "success");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: selectedAddress,
          paymentMethod,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to place order", "error");
        setIsPlacingOrder(false);
        return;
      }

      showToast("Order placed successfully! Redirecting...", "success");
      clearCart();
      router.push(`/order-success/${data.order.orderNumber}`);
    } catch {
      showToast("Error processing checkout", "error");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your order with verified 256-bit encryption
          </p>
        </div>
        <Link href="/cart" className="text-xs font-bold text-brand-600 hover:text-brand-700">
          &larr; Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address & Payment Selection (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address Section */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600" /> Select Delivery Address
                </h3>
              </div>

              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug line-clamp-2">{addr.street}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <div className="text-[11px] text-slate-700 font-medium mt-1">
                    Phone: {addr.phone}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Payment Options Section */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-600" /> Choose Payment Option
              </h3>
            </div>

            <div className="space-y-3">
              {/* UPI Option */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "UPI"
                    ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-500"
                    : "border-slate-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="accent-brand-600"
                  />
                  <QrCode className="w-5 h-5 text-brand-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">UPI Instant Pay / QR</div>
                    <div className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    FASTEST
                  </span>
                </label>

                {paymentMethod === "UPI" && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okaxis / phonepe"
                      className="w-full sm:w-64 px-3 py-2 border rounded-xl text-xs font-mono focus:outline-brand-600 bg-white"
                    />
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Auto-verified & ready
                    </span>
                  </div>
                )}
              </div>

              {/* Credit / Debit Card Option */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "CARD"
                    ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-500"
                    : "border-slate-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="accent-brand-600"
                  />
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Credit / Debit Cards</div>
                    <div className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Amex</div>
                  </div>
                </label>

                {paymentMethod === "CARD" && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        Valid Thru
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "NET_BANKING"
                    ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-500"
                    : "border-slate-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "NET_BANKING"}
                    onChange={() => setPaymentMethod("NET_BANKING")}
                    className="accent-brand-600"
                  />
                  <Building2 className="w-5 h-5 text-brand-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Net Banking</div>
                    <div className="text-[11px] text-slate-500">All major Indian banks supported</div>
                  </div>
                </label>
              </div>

              {/* Cash on Delivery */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "COD"
                    ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-500"
                    : "border-slate-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-brand-600"
                  />
                  <Banknote className="w-5 h-5 text-brand-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                    <div className="text-[11px] text-slate-500">Pay cash or UPI at your doorstep</div>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Review & Confirmation (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Order Review
          </h3>

          {/* Cart preview */}
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-800">{item.quantity}x</span>{" "}
                  <span className="text-slate-600">{item.product.title}</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">
                  {formatCurrency(
                    (item.variant ? item.variant.salePrice : item.product.salePrice) * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-800">
                {shippingFee === 0 ? <span className="text-emerald-600 font-bold uppercase">FREE</span> : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span className="font-bold text-slate-800">{formatCurrency(taxAmount)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="font-extrabold text-sm text-slate-900">Total Amount</span>
            <span className="font-black text-2xl text-slate-900">{formatCurrency(finalAmount)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-black text-sm py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {isPlacingOrder ? "Processing..." : `Pay & Place Order • ${formatCurrency(finalAmount)}`}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Guaranteed Safe Checkout with 100% Protection
            </div>
            <div>Delivery expected within 24-48 hours with live tracking</div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Delivery Address</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 99887 76655"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <textarea
                  required
                  rows={2}
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat, building, street, landmark"
                  className="w-full px-3 py-2 border rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
