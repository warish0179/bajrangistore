"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Truck,
  CheckCircle2,
  Search,
  X,
  Sparkles,
  Loader2,
  Navigation,
  ShieldCheck,
} from "lucide-react";

// Pre-cached offline mapping for fast 0ms response for major regions
const KNOWN_PINCODES: Record<string, { area: string; city: string; state: string; days: string }> = {
  "846009": { area: "Laxmisagar / Dhoi", city: "Darbhanga", state: "Bihar", days: "24-48 Hours" },
  "846004": { area: "Darbhanga Tower / Lalbagh", city: "Darbhanga", state: "Bihar", days: "24-48 Hours" },
  "846001": { area: "Darbhanga GPO / Mirzapur", city: "Darbhanga", state: "Bihar", days: "24-48 Hours" },
  "800001": { area: "GPO / Fraser Road", city: "Patna", state: "Bihar", days: "24-48 Hours" },
  "800020": { area: "Kankarbagh", city: "Patna", state: "Bihar", days: "24-48 Hours" },
  "842001": { area: "Muzaffarpur Head Office", city: "Muzaffarpur", state: "Bihar", days: "24-48 Hours" },
  "110001": { area: "Connaught Place / Janpath", city: "New Delhi", state: "Delhi", days: "Same Day / Next Day" },
  "110092": { area: "Laxmi Nagar / Anand Vihar", city: "East Delhi", state: "Delhi", days: "Next Day" },
  "400001": { area: "Fort / Colaba", city: "Mumbai", state: "Maharashtra", days: "Next Day" },
  "400050": { area: "Bandra West", city: "Mumbai", state: "Maharashtra", days: "Next Day" },
  "560001": { area: "MG Road / Brigade Road", city: "Bengaluru", state: "Karnataka", days: "Same Day / Next Day" },
  "560038": { area: "Indiranagar", city: "Bengaluru", state: "Karnataka", days: "Same Day / Next Day" },
  "500081": { area: "Hitec City / Madhapur", city: "Hyderabad", state: "Telangana", days: "Next Day" },
  "700001": { area: "BBD Bagh / Esplanade", city: "Kolkata", state: "West Bengal", days: "Next Day" },
  "600001": { area: "George Town", city: "Chennai", state: "Tamil Nadu", days: "Next Day" },
  "226001": { area: "Hazratganj", city: "Lucknow", state: "Uttar Pradesh", days: "24-48 Hours" },
  "302001": { area: "MI Road / Pink City", city: "Jaipur", state: "Rajasthan", days: "24-48 Hours" },
  "380001": { area: "Navrangpura", city: "Ahmedabad", state: "Gujarat", days: "24-48 Hours" },
};

export function PincodeDeliveryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<{
    area: string;
    city: string;
    state: string;
    deliveryTime?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Open modal on custom event from splash screen or Navbar
    const handleSplashFinished = () => {
      const savedPin = localStorage.getItem("bajrangi_pincode_v1");
      if (!savedPin) {
        // Show after a brief 400ms pause for smooth entrance
        setTimeout(() => {
          setIsOpen(true);
        }, 400);
      }
    };

    const handleOpenExplicit = () => {
      const savedPin = localStorage.getItem("bajrangi_pincode_v1") || "846009";
      setPincode(savedPin);
      lookupPincode(savedPin);
      setIsOpen(true);
    };

    window.addEventListener("bajrangi-splash-finished", handleSplashFinished);
    window.addEventListener("bajrangi-open-pincode-modal", handleOpenExplicit);

    // Initial check on page load if splash was already seen but pincode not set
    const hasSeenSplash = sessionStorage.getItem("bajrangi_splash_shown_v1");
    const savedPin = localStorage.getItem("bajrangi_pincode_v1");
    if (hasSeenSplash && !savedPin) {
      setTimeout(() => setIsOpen(true), 600);
    }

    return () => {
      window.removeEventListener("bajrangi-splash-finished", handleSplashFinished);
      window.removeEventListener("bajrangi-open-pincode-modal", handleOpenExplicit);
    };
  }, []);

  const lookupPincode = async (code: string) => {
    if (code.length !== 6) {
      setResolvedAddress(null);
      setErrorMsg("");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // 1. Check instant local cache
    if (KNOWN_PINCODES[code]) {
      const match = KNOWN_PINCODES[code];
      setResolvedAddress({
        area: match.area,
        city: match.city,
        state: match.state,
        deliveryTime: match.days,
      });
      setLoading(false);
      return;
    }

    // 2. Query official India Post API for exact real-time address
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();

      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const officeNames = data[0].PostOffice.slice(0, 2)
          .map((p: any) => p.Name)
          .join(" / ");

        setResolvedAddress({
          area: officeNames || po.Name,
          city: po.District || po.Division || "District Hub",
          state: po.State || "India",
          deliveryTime: "24-48 Hours Express",
        });
      } else {
        setErrorMsg("Pincode not found. Please check and try again.");
        setResolvedAddress(null);
      }
    } catch {
      // Fallback
      setResolvedAddress({
        area: "Standard Delivery Zone",
        city: `Pincode ${code}`,
        state: "India",
        deliveryTime: "2-3 Days",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      lookupPincode(clean);
    } else {
      setResolvedAddress(null);
      setErrorMsg("");
    }
  };

  const handleSelectQuick = (code: string) => {
    setPincode(code);
    lookupPincode(code);
  };

  const handleConfirm = () => {
    if (!pincode || pincode.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit Pincode");
      return;
    }

    const cityLabel = resolvedAddress ? `${resolvedAddress.city}, ${resolvedAddress.state}` : `Pincode ${pincode}`;
    const fullArea = resolvedAddress ? `${resolvedAddress.area}, ${resolvedAddress.city}` : `Pincode ${pincode}`;

    localStorage.setItem("bajrangi_pincode_v1", pincode);
    localStorage.setItem("bajrangi_city_area_v1", cityLabel);
    localStorage.setItem("bajrangi_full_address_v1", fullArea);
    localStorage.setItem("bajrangi_pincode_set", "true");

    // Dispatch update so Navbar updates instantly
    window.dispatchEvent(
      new CustomEvent("bajrangi-pincode-updated", {
        detail: { pincode, cityLabel, fullArea },
      })
    );

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 px-6 py-5 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Select Delivery Location</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                अपना पिनकोड डालें और सटीक पता व सबसे तेज़ डिलीवरी पाएं
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Enter 6-Digit Postal PIN Code</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pincode}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. 846009, 110001, 560038"
                autoFocus
                className="w-full px-4 py-3.5 pr-24 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-base font-mono font-bold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 outline-none transition-all"
              />
              <div className="absolute right-3 flex items-center gap-1">
                {loading && <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />}
                {resolvedAddress && !loading && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in" />
                )}
              </div>
            </div>
            {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
          </div>

          {/* Resolved Address Card Animation */}
          {resolvedAddress && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Serviceable Location</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  Active
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-base font-extrabold text-slate-900 leading-tight">
                  📍 {resolvedAddress.city}, {resolvedAddress.state}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Postal Zone: {resolvedAddress.area} • PIN: {pincode}
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Truck className="w-3.5 h-3.5" />
                  {resolvedAddress.deliveryTime || "24-48 Hr Express"}
                </span>
                <span className="text-slate-500">
                  Free Delivery on orders above ₹499
                </span>
              </div>
            </div>
          )}

          {/* Popular Cities Quick Select */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Popular Cities & Pincodes
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: "846009", name: "Darbhanga (Bihar)" },
                { code: "800001", name: "Patna (Bihar)" },
                { code: "110001", name: "New Delhi" },
                { code: "400001", name: "Mumbai" },
                { code: "560038", name: "Bengaluru" },
                { code: "700001", name: "Kolkata" },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectQuick(item.code)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    pincode === item.code
                      ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold ring-2 ring-amber-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="font-mono text-[10px] text-slate-500">{item.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pincode.length !== 6 || loading}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                pincode.length === 6 && !loading
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-orange-500/30 active:scale-98"
                  : "bg-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              <span>Confirm & Start Shopping</span>
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
