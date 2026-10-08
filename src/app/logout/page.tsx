"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center animate-pulse">
        <LogOut className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-black text-slate-900">Signing Out of BajrangiStore...</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        Clearing your active shopping session and secure credentials. Redirecting to home...
      </p>
      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );
}
