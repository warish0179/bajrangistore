"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, ArrowRight, ShieldCheck, Tag, Zap } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast("All notifications marked as read", "info");
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-600" /> Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Order tracking updates, price drops, and exclusive flash deals
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-400">
          No notifications yet. You are all caught up!
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || "/account"}
              className={`block p-4 rounded-2xl border transition-all ${
                !n.read
                  ? "bg-white border-brand-300 shadow-xs ring-1 ring-brand-500/20"
                  : "bg-white/80 border-slate-200/80 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === "ORDER"
                        ? "bg-brand-50 text-brand-600"
                        : n.type === "PRICE_DROP"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {n.type === "ORDER" ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : n.type === "PRICE_DROP" ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <Tag className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
