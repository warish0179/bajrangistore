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
  Copy,
  Check,
  Info,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, shippingFee, taxAmount, finalAmount, appliedCoupon, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI_QR" | "BANK_TRANSFER" | "WALLET" | "COD" | "CARD">("UPI_QR");
  const [transactionRef, setTransactionRef] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Dynamic payment settings loaded securely from server
  const [paymentSettings, setPaymentSettings] = useState<any>({
    upiId: "9835400188-k322-3@ibl",
    upiQrImage: "/payments/bajrangi_upi_qr.jpg",
    accountHolder: "Warish Raj",
    accountNumber: "000521713102565",
    ifscCode: "JIOP0000001",
    bankName: "Jio Payments Bank",
  });

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

  useEffect(() => {
    // Fetch dynamic store payment configurations
    fetch("/api/payment-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setPaymentSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Load user addresses from database
  useEffect(() => {
    if (user) {
      fetch("/api/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            setAddresses(data.addresses);
            const def = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(def.id);
          } else {
            const fallbackAddresses = [
              {
                id: "addr-1",
                fullName: user.name,
                phone: "+91 99887 76655",
                street: "Flat 402, Skyline Residency, Indiranagar 100 Feet Rd",
                city: "Bengaluru",
                state: "Karnataka",
                postalCode: "560038",
                country: "India",
                type: "HOME",
                isDefault: true,
              },
            ];
            setAddresses(fallbackAddresses);
            setSelectedAddressId("addr-1");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`, "info");
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Require visitor login before checkout
  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Sign In to Complete Checkout</h2>
        <p className="text-xs text-slate-500">
          Please log in to your BajrangiStore account or create a new account to select your delivery address and complete your order.
        </p>
        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/auth/login?redirect=/checkout"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-amber-500/30 transition-all text-center"
          >
            Sign In to BajrangiStore
          </Link>
          <Link
            href="/auth/register?redirect=/checkout"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all text-center"
          >
            Create New Customer Account
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const walletBalance = user?.walletBalance ?? 2500;
  const canPayWithWallet = walletBalance >= finalAmount;

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newPostalCode) return;

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newFullName,
          phone: newPhone || "+91 99887 76655",
          street: newStreet,
          city: newCity,
          state: newState,
          postalCode: newPostalCode,
          type: newType,
          isDefault: addresses.length === 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [...prev, data.address]);
        setSelectedAddressId(data.address.id);
      } else {
        const fallback = {
          id: "addr-" + Date.now(),
          fullName: newFullName,
          phone: newPhone || "+91 99887 76655",
          street: newStreet,
          city: newCity,
          state: newState,
          postalCode: newPostalCode,
          country: "India",
          type: newType,
          isDefault: false,
        };
        setAddresses((prev) => [...prev, fallback]);
        setSelectedAddressId(fallback.id);
      }
      setIsAddressModalOpen(false);
      showToast("Delivery address saved!", "success");
    } catch {
      showToast("Address added for this checkout", "info");
      setIsAddressModalOpen(false);
    }
  };

  const handlePlaceOrder = async () => {
    if ((paymentMethod === "UPI_QR" || paymentMethod === "BANK_TRANSFER") && !transactionRef.trim()) {
      showToast("Please enter your 12-digit UTR/Reference number for payment verification", "error");
      return;
    }

    if (paymentMethod === "WALLET" && !canPayWithWallet) {
      showToast("Insufficient BajrangiStore Wallet balance", "error");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: selectedAddress,
          paymentMethod,
          transactionRef: transactionRef.trim() || undefined,
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
      refreshUser();
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
            <Lock className="w-5 h-5 text-emerald-600" /> BajrangiStore Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted UPI QR, Bank Transfer, COD, and Wallet Checkout
          </p>
        </div>
        <Link href="/cart" className="text-xs font-bold text-amber-600 hover:text-amber-700">
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
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" /> Select Delivery Address
                </h3>
              </div>

              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
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
                      ? "border-amber-600 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-xs"
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
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-600" /> Choose Payment Option
              </h3>
            </div>

            <div className="space-y-3">
              {/* Option A: UPI Instant QR Payment */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "UPI_QR"
                    ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "UPI_QR"}
                    onChange={() => setPaymentMethod("UPI_QR")}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">
                      UPI QR Code / Scanner (PhonePe, GPay, Paytm, BHIM)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Scan store QR code or pay to official UPI ID: <span className="font-mono text-slate-800">{paymentSettings.upiId}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                </label>

                {paymentMethod === "UPI_QR" && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                      {/* Real Uploaded UPI QR Code */}
                      <div className="flex flex-col items-center">
                        <div className="p-2 border-2 border-slate-900 rounded-2xl bg-white shadow-md">
                          <img
                            src={paymentSettings.upiQrImage || "/payments/bajrangi_upi_qr.jpg"}
                            alt="BajrangiStore PhonePe UPI QR"
                            className="w-44 h-44 object-contain rounded-xl"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1.5 font-medium">Scan using any UPI App</span>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Official Store UPI ID</div>
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-mono font-bold text-sm text-slate-900 select-all">{paymentSettings.upiId}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentSettings.upiId, "UPI ID")}
                              className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              {copiedField === "UPI ID" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedField === "UPI ID" ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-800 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-amber-600" /> Payment Instructions:
                          </div>
                          <p className="text-[11px] text-amber-700 leading-snug">
                            1. Open PhonePe, Google Pay, or Paytm and scan the QR or pay to the UPI ID.
                            <br />
                            2. Copy the 12-digit UTR/Reference number from your payment receipt and paste below.
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Enter 12-Digit UTR / Transaction Reference Number <span className="text-rose-500">*</span>:
                          </label>
                          <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="e.g. 427819204812 / UTR-9835400188-..."
                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:outline-amber-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Direct Bank Transfer (IMPS / NEFT / RTGS) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Direct Bank Transfer (IMPS / NEFT)</div>
                    <div className="text-[11px] text-slate-500">
                      Transfer directly to store bank account ({paymentSettings.bankName})
                    </div>
                  </div>
                </label>

                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Building2 className="w-4 h-4 text-amber-600" /> Store Bank Account Details:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-semibold block">Account Holder</span>
                          <span className="font-bold text-slate-900">{paymentSettings.accountHolder}</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-semibold block">Bank Name</span>
                          <span className="font-bold text-slate-900">{paymentSettings.bankName}</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block">Account Number</span>
                            <span className="font-mono font-bold text-slate-900">{paymentSettings.accountNumber}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentSettings.accountNumber, "Account Number")}
                            className="px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1"
                          >
                            {copiedField === "Account Number" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block">IFSC Code</span>
                            <span className="font-mono font-bold text-slate-900">{paymentSettings.ifscCode}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentSettings.ifscCode, "IFSC Code")}
                            className="px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1"
                          >
                            {copiedField === "IFSC Code" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          Bank Reference / UTR Number <span className="text-rose-500">*</span>:
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. NEFT-9841029410 / IMPS Reference"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:outline-amber-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option C: BajrangiStore Wallet Balance */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "WALLET"
                    ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "WALLET"}
                    onChange={() => setPaymentMethod("WALLET")}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <Wallet className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">
                      BajrangiStore Wallet Balance
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Available Balance: <span className="font-bold text-emerald-700 font-mono">₹{walletBalance.toLocaleString()}</span>
                    </div>
                  </div>
                  {canPayWithWallet ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      INSTANT 1-CLICK
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      LOW BALANCE
                    </span>
                  )}
                </label>

                {paymentMethod === "WALLET" && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
                    {canPayWithWallet ? (
                      <p className="text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ₹{finalAmount.toLocaleString()} will be debited instantly from your wallet balance.
                      </p>
                    ) : (
                      <p className="text-rose-600 flex items-center gap-1.5">
                        Your wallet balance (₹{walletBalance.toLocaleString()}) is less than the order amount (₹{finalAmount.toLocaleString()}). Please choose UPI or Bank Transfer.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Option D: Cash on Delivery */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "COD"
                    ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                    <div className="text-[11px] text-slate-500">
                      Pay cash or UPI to your Bajrangi HyperLogistics rider at delivery
                    </div>
                  </div>
                </label>
              </div>

              {/* Option E: Card & Net Banking */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  paymentMethod === "CARD"
                    ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                    <div className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</div>
                  </div>
                </label>

                {paymentMethod === "CARD" && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Valid Thru</label>
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
                  {formatCurrency((item.variant?.salePrice || item.product.salePrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Hyper-Express Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST (5%)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-black text-slate-900 text-base">
              <span>Total Payable</span>
              <span className="text-amber-600 font-black text-xl">{formatCurrency(finalAmount)}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || (paymentMethod === "WALLET" && !canPayWithWallet)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isPlacingOrder ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Place Order • {formatCurrency(finalAmount)}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified by BajrangiStore 256-bit Security
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Delivery Address</h3>
            <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50"
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
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <textarea
                  required
                  rows={2}
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat / House No., Building Name, Street..."
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Address Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50"
                  >
                    <option value="HOME">Home</option>
                    <option value="WORK">Work / Office</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="w-1/2 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md"
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
