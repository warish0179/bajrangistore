"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight, Smartphone, CreditCard, User, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function DeliveryRegisterPage() {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [vehicleType, setVehicleType] = useState("BIKE");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !email || !password || !vehicleNumber) {
      showToast("Please fill in all required delivery partner fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: mobile,
          password,
          dob,
          role: "DELIVERY_WORKER",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Rider registration failed", "error");
        return;
      }

      showToast("Delivery Partner registration submitted! Welcome to BajrangiStore Fleet.", "success");
      window.location.href = "/delivery";
    } catch {
      showToast("Network error during rider registration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 text-white">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Join BajrangiStore Delivery Fleet</h1>
          <p className="text-xs text-slate-400">
            Earn ₹65 to ₹120 per completed delivery with instant weekly payouts and accidental insurance
          </p>
        </div>

        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">Doorstep Handshake OTP Security</div>
              <div className="text-[11px] text-emerald-300">
                You will be equipped with our mobile-first delivery interface with tamper-proof customer OTP verification.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Full Name (as per Aadhaar) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 11223"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="rider@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Portal Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Vehicle & Driving */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500"
                >
                  <option value="BIKE">Motorcycle / Bike</option>
                  <option value="SCOOTER">Electric Scooter</option>
                  <option value="EV_VAN">Cargo EV Van</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Vehicle Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-05-EX-4891"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Driving Licence No.</label>
                <input
                  type="text"
                  placeholder="e.g. KA05-20210049281"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* KYC & Verification Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar Number"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">PAN Card Number</label>
                <input
                  type="text"
                  placeholder="10-digit PAN"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* Bank Payout Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Bank Account No.</label>
                <input
                  type="text"
                  placeholder="For Weekly Payouts"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">UPI ID (Instant Incentives)</label>
                <input
                  type="text"
                  placeholder="e.g. name@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Emergency Contact Number</label>
              <input
                type="tel"
                placeholder="+91 98450 99887 (Family / Relative)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Rider Application"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already registered with BajrangiStore Fleet?{" "}
            <Link href="/delivery/login" className="font-bold text-emerald-400 hover:underline">
              Sign In to Delivery Partner App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
