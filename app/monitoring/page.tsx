"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import {
  AlertTriangle, AlertCircle, Info, CheckCircle2, X,
  Factory, TrendingUp, Mail, Users, Activity, Wifi,
  Filter, Bell, Loader2,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { api } from "@/lib/api";
import { AlertSkeleton } from "@/components/skeletons/Skeleton";

interface Alert {
  id: string; type: string; category: string;
  message: string; time: string; resolved: boolean;
}

const liveMetrics = [
  { time: "10:00", brent: 100.2 }, { time: "10:15", brent: 100.8 },
  { time: "10:30", brent: 101.4 }, { time: "10:45", brent: 100.9 },
  { time: "11:00", brent: 101.8 }, { time: "11:15", brent: 102.1 },
  { time: "11:30", brent: 101.6 }, { time: "11:45", brent: 102.4 },
];

const activityFeed = [
  { icon: Users,     color: "#06b6d4", text: "New lead: Gulf Petroleum Corp captured from website",        time: "3m ago"  },
  { icon: TrendingUp,color: "#d4a017", text: "Brent price alert triggered at $102/bbl",                   time: "9m ago"  },
  { icon: Factory,   color: "#f59e0b", text: "Refinery maintenance scheduled: Tema Oil, Nov 20",          time: "22m ago" },
  { icon: Mail,      color: "#a78bfa", text: "Campaign 'LNG Export Promo' launched — 8,120 recipients",   time: "1h ago"  },
  { icon: Users,     color: "#22c55e", text: "Contract renewed: Shell International — $8.9M",              time: "2h ago"  },
  { icon: Factory,   color: "#ef4444", text: "CRITICAL: Warri Refinery Unit 2 temperature alert",         time: "2h ago"  },
  { icon: TrendingUp,color: "#06b6d4", text: "AI forecast updated — 94.2% accuracy rating maintained",    time: "3h ago"  },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  critical: { icon: AlertCircle,  color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)"  },
  warning:  { icon: AlertTriangle,color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  info:     { icon: Info,         color: "#06b6d4", bg: "rgba(6,182,212,0.1)",  border: "rgba(6,182,212,0.3)"  },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000)    return "Just now";
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function MonitoringPage() {
  const [alerts, setAlerts]     = useState<Alert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"all"|"critical"|"warning"|"info">("all");
  const [liveData, setLiveData] = useState(liveMetrics);
  const [livePrice, setLivePrice] = useState(102.4);

  // Load alerts from DB
  useEffect(() => {
    api.alerts()
      .then((data) => setAlerts(data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  // Live price ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setLivePrice((p) => parseFloat((p + (Math.random() - 0.48) * 0.8).toFixed(2)));
      setLiveData((prev) => {
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const next = parseFloat((prev[prev.length - 1].brent + (Math.random() - 0.48) * 0.8).toFixed(2));
        return [...prev.slice(-14), { time: now, brent: next }];
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const resolve = async (id: string) => {
    try {
      await api.resolveAlert(id);
      setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
    } catch {}
  };

  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const filtered   = alerts.filter((a) => filter === "all" || a.type === filter);
  const unresolved = alerts.filter((a) => !a.resolved);
  const critCount  = unresolved.filter((a) => a.type === "critical").length;

  return (
    <MainLayout title="Live Monitoring">
      {/* Status bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Alerts", value: loading ? "—" : unresolved.length, color: "#ef4444", icon: Bell       },
          { label: "Critical",      value: loading ? "—" : critCount,          color: "#ef4444", icon: AlertCircle },
          { label: "Brent (Live)",  value: `$${livePrice}`,                    color: "#06b6d4", icon: TrendingUp  },
          { label: "System Status", value: "Online",                           color: "#22c55e", icon: Wifi        },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: "rgba(13,22,41,0.9)", border: `1px solid ${s.label === "Critical" && critCount > 0 ? "rgba(239,68,68,0.4)" : "rgba(30,58,95,0.5)"}` }}>
            <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full opacity-10 blur-xl" style={{ background: s.color }} />
            <s.icon size={15} style={{ color: s.color }} className="mb-2" />
            <p className="text-xl font-bold" style={{ color: s.value === "Online" ? "#22c55e" : "white" }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alert Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 items-center">
            <Filter size={13} style={{ color: "var(--text-muted)" }} />
            {(["all", "critical", "warning", "info"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: filter === f ? typeConfig[f]?.bg || "rgba(6,182,212,0.1)" : "rgba(13,22,41,0.8)",
                  color:      filter === f ? typeConfig[f]?.color || "#06b6d4" : "var(--text-muted)",
                  border:     filter === f ? `1px solid ${typeConfig[f]?.border || "rgba(6,182,212,0.3)"}` : "1px solid rgba(30,58,95,0.4)",
                }}>
                {f === "all" ? `All (${alerts.length})` : f}
              </button>
            ))}
          </div>

          {loading ? (
            <AlertSkeleton count={5} />
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((a, i) => {
                  const cfg = typeConfig[a.type];
                  return (
                    <motion.div key={a.id}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-xl p-4 flex items-start gap-3"
                      style={{
                        background: a.resolved ? "rgba(8,14,31,0.6)" : cfg.bg,
                        border: `1px solid ${a.resolved ? "rgba(30,58,95,0.3)" : cfg.border}`,
                        opacity: a.resolved ? 0.6 : 1,
                      }}>
                      <cfg.icon size={16} style={{ color: a.resolved ? "var(--text-muted)" : cfg.color, flexShrink: 0, marginTop: 1 }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded" style={{ background: `${cfg.color}20`, color: cfg.color }}>{a.type}</span>
                          <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{a.category}</span>
                          <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{timeAgo(a.time)}</span>
                        </div>
                        <p className="text-sm text-slate-300">{a.message}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!a.resolved && (
                          <button onClick={() => resolve(a.id)} className="p-1.5 rounded hover:bg-slate-700/50" title="Resolve">
                            <CheckCircle2 size={13} className="text-green-400" />
                          </button>
                        )}
                        <button onClick={() => dismiss(a.id)} className="p-1.5 rounded hover:bg-slate-700/50">
                          <X size={13} style={{ color: "var(--text-muted)" }} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl p-4" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-300">Live Brent Crude</p>
                <p className="text-xl font-bold" style={{ color: "#06b6d4" }}>${livePrice}</p>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                LIVE
              </div>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={liveData} margin={{ top: 2, right: 2, bottom: 2, left: -30 }}>
                <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis domain={["auto", "auto"]} tick={false} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="brent" stroke="#06b6d4" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
              <p className="text-xs font-semibold text-slate-200">Activity Log</p>
              <Activity size={13} style={{ color: "#06b6d4" }} />
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-slate-800/20 transition-colors">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                    <item.icon size={11} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-snug">{item.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
