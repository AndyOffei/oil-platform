"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, X, Send, Sparkles, TrendingUp, BarChart3, Users, Lightbulb, ChevronDown,
} from "lucide-react";

type Message = { role: "user" | "assistant"; text: string; time: string };

const suggestions = [
  { icon: TrendingUp, label: "Summarize oil prices", prompt: "Summarize the current oil price trends and what's driving them." },
  { icon: BarChart3, label: "Production insights", prompt: "Give me insights on production performance across all fields." },
  { icon: Users, label: "CRM recommendations", prompt: "Recommend marketing strategies for our top at-risk customers." },
  { icon: Lightbulb, label: "AI forecast summary", prompt: "Explain the 7-day AI price forecast and confidence levels." },
];

const responses: Record<string, string> = {
  default: "I've analyzed your platform data and can provide insights on production, pricing, CRM, refinery operations, and market trends. What would you like to know?",
  price: "**Brent Crude** is currently trading at **$102.4/bbl**, up 2.1% over the past 24 hours. The upward pressure is driven by OPEC supply discipline and rising demand from Asian markets. WTI is tracking at $98.7/bbl. Our AI model projects continued upward movement toward **$104–$106** over the next 7 days with 87% confidence.",
  production: "Across your 7 active production sites, total output stands at **510,900 bbl/day**. The **Ghawar Field** leads at 142,000 bbl/day. The Agbami field is underperforming by 8% — a pressure review is recommended. Tengiz and Permian Basin are both meeting targets. Overall efficiency: **94.2%**.",
  marketing: "For your 3 at-risk customers, I recommend: (1) **BP West Africa** — assign a dedicated account manager and schedule a Q4 review call within 5 days. (2) Reactivate dormant leads with a targeted LNG pricing email campaign. (3) Deploy the 'Q4 Outreach' SMS sequence to 4,200 opted-in contacts. Expected re-engagement: ~18%.",
  forecast: "The 7-day AI forecast shows **$101.20 → $104.50** trajectory with an 87% confidence band. Key drivers: OPEC meeting Nov 26 (potential supply cut), Asian demand recovery (+3.1%), and USD weakening. Downside risks include US inventory builds. The model has maintained **94.2% accuracy** over the past 30 days.",
};

function getReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("price") || t.includes("brent") || t.includes("wti") || t.includes("trend")) return responses.price;
  if (t.includes("production") || t.includes("field") || t.includes("output") || t.includes("insight")) return responses.production;
  if (t.includes("marketing") || t.includes("crm") || t.includes("customer") || t.includes("strategy") || t.includes("risk")) return responses.marketing;
  if (t.includes("forecast") || t.includes("predict") || t.includes("ai") || t.includes("confidence")) return responses.forecast;
  return responses.default;
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function MdText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm your OilIntel AI Assistant. I can analyze your platform data, explain trends, and recommend strategies. How can I help?", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: "user", text: text.trim(), time: now() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, { role: "assistant", text: getReply(text), time: now() }]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)", border: "1px solid rgba(6,182,212,0.4)" }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><ChevronDown size={22} color="white" /></motion.span>
            : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Bot size={22} color="white" /></motion.span>
          }
        </AnimatePresence>
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "#ef4444", color: "white", fontSize: "9px" }}>
            {messages.filter(m => m.role === "assistant").length}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: "rgba(8,14,31,0.97)",
              border: "1px solid rgba(6,182,212,0.25)",
              height: "520px",
              backdropFilter: "blur(20px)",
            }}>
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)", background: "rgba(13,22,41,0.8)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
                <Sparkles size={15} style={{ color: "#06b6d4" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">OilIntel AI</p>
                <p className="text-xs" style={{ color: "#22c55e" }}>● Online · GPT-4 powered</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-slate-700/50 transition-colors">
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(6,182,212,0.2)" }}>
                      <Bot size={11} style={{ color: "#06b6d4" }} />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl px-3 py-2.5 text-xs leading-relaxed"
                      style={{
                        background: m.role === "user" ? "rgba(6,182,212,0.15)" : "rgba(13,22,41,0.9)",
                        border: m.role === "user" ? "1px solid rgba(6,182,212,0.25)" : "1px solid rgba(30,58,95,0.4)",
                        color: m.role === "user" ? "#e2e8f0" : "#cbd5e1",
                        borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      }}>
                      <MdText text={m.text} />
                    </div>
                    <p className={`text-xs mt-1 ${m.role === "user" ? "text-right" : ""}`} style={{ color: "var(--text-muted)", fontSize: "10px" }}>{m.time}</p>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(6,182,212,0.2)" }}>
                    <Bot size={11} style={{ color: "#06b6d4" }} />
                  </div>
                  <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.4)", borderRadius: "4px 18px 18px 18px" }}>
                    <div className="flex gap-1 items-center h-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#06b6d4" }}
                          animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions (shown when only 1 message) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 grid grid-cols-2 gap-1.5">
                {suggestions.map((s) => (
                  <button key={s.label} onClick={() => send(s.prompt)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-left transition-all hover:opacity-90"
                    style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                    <s.icon size={11} style={{ color: "#06b6d4", flexShrink: 0 }} />
                    <span className="text-xs text-slate-300 leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
              <div className="flex gap-2 items-end">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Ask about prices, production, CRM..."
                  className="flex-1 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none resize-none"
                  style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
                />
                <button onClick={() => send(input)} disabled={!input.trim() || typing}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.3)" }}>
                  <Send size={13} style={{ color: "#06b6d4" }} />
                </button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)", fontSize: "10px" }}>AI responses are illustrative based on platform data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
