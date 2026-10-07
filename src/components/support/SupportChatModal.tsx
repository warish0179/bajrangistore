"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, PhoneCall } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SupportChatModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem("bajrangi_chat_session") || localStorage.getItem("nexmart_chat_session");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("bajrangi_chat_session", sid);
    }
    setSessionId(sid);
  }, []);

  const fetchHistory = async (sid: string) => {
    try {
      const res = await fetch(`/api/support/chat?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Welcome message
          setMessages([
            {
              id: "initial",
              sender: "BOT",
              message: "👋 Namaste! Welcome to BajrangiStore 24x7 Customer Support. How may I assist you today? You can check order tracking, delivery OTP, ask about returns, or talk to an agent.",
              quickActions: JSON.stringify([
                "Track My Order",
                "Return & Refund Policy",
                "Payment & EMI Options",
                "Chat with Human Agent",
              ]),
            },
          ]);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchHistory(sessionId);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: "temp_" + Date.now(),
      sender: "USER",
      message: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          sessionId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white p-3.5 rounded-2xl shadow-xl shadow-brand-500/30 flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Open 24/7 customer care chat"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-600 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-600" />
        </div>
        <span className="text-xs font-bold hidden sm:inline-block">24x7 Help</span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  BajrangiStore Support <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online & Ready
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Powered by BajrangiStore Neural Care</span>
            <span className="text-amber-600 font-semibold">Toll-Free: 1800-BAJRANGI</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((m, idx) => {
              const isUser = m.sender === "USER";
              let actions: string[] = [];
              if (m.quickActions) {
                try {
                  actions = JSON.parse(m.quickActions);
                } catch {}
              }

              return (
                <div
                  key={m.id || idx}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? "bg-brand-600 text-white rounded-br-none shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.message}</div>
                  </div>

                  {/* Render Quick Actions if available */}
                  {!isUser && actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => sendMessage(act)}
                          className="text-[10px] bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-300 font-medium px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          {act} <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none w-fit text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or enter Order ID (NEX-...)"
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400 text-slate-800"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
