"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Search, RefreshCw, Wifi, WifiOff } from "lucide-react";

const alerts = [
  { id: 1, text: "Brent crude up 2.3% in last hour", type: "up", time: "2m ago" },
  { id: 2, text: "Refinery Unit B maintenance alert", type: "warn", time: "15m ago" },
  { id: 3, text: "New lead: Gulf Petrochemicals Ltd", type: "info", time: "1h ago" },
];

export default function Header({ title }: { title: string }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [live, setLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLastUpdated(new Date());
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: "rgba(8, 14, 31, 0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(30, 58, 95, 0.4)",
      }}
    >
      {/* Left: title + live indicator */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100">{title}</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: live ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${live ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: live ? "#22c55e" : "#ef4444",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: live ? "#22c55e" : "#ef4444" }}
          />
          {live ? "LIVE" : "OFFLINE"}
        </div>
      </div>

      {/* Right: search, refresh, notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{
            background: "rgba(13, 22, 41, 0.8)",
            border: "1px solid rgba(30, 58, 95, 0.5)",
            color: "var(--text-muted)",
          }}
        >
          <Search size={14} />
          <span className="text-xs w-36">Search platform...</span>
          <kbd
            className="hidden lg:inline text-xs px-1 rounded"
            style={{ background: "rgba(30,58,95,0.5)", color: "var(--text-muted)" }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg transition-all hover:opacity-80"
          style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <RefreshCw size={14} className="text-slate-400" />
          </motion.div>
        </button>

        {/* Live toggle */}
        <button
          onClick={() => setLive(!live)}
          className="p-2 rounded-lg transition-all hover:opacity-80"
          style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          {live ? (
            <Wifi size={14} style={{ color: "#22c55e" }} />
          ) : (
            <WifiOff size={14} className="text-red-400" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)" }}
          >
            <Bell size={14} className="text-slate-400" />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {alerts.length}
            </span>
          </button>

          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
              style={{
                background: "#0d1629",
                border: "1px solid rgba(30,58,95,0.6)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}
              >
                <p className="text-sm font-semibold text-slate-200">Notifications</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}
                >
                  {alerts.length} new
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.3)" }}>
                {alerts.map((alert) => (
                  <div key={alert.id} className="px-4 py-3 hover:bg-slate-800/30 cursor-pointer transition-colors">
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            alert.type === "up"
                              ? "#22c55e"
                              : alert.type === "warn"
                              ? "#f59e0b"
                              : "#06b6d4",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300">{alert.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2" style={{ borderTop: "1px solid rgba(30,58,95,0.4)" }}>
                <button className="text-xs w-full text-center" style={{ color: "#06b6d4" }}>
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
