"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import OilPriceChart from "@/components/analytics/OilPriceChart";
import RefineryMonitor from "@/components/analytics/RefineryMonitor";
import SupplyChain from "@/components/analytics/SupplyChain";
import { api } from "@/lib/api";
import {
  TrendingUp, Factory, Ship, BarChart3, Globe2,
  ArrowUpRight, ArrowDownRight, Activity, Flame,
  Droplets, AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

const tabs = [
  { id: "prices",     label: "Price Tracking", icon: TrendingUp, color: "#06b6d4" },
  { id: "production", label: "Production",     icon: BarChart3,  color: "#d4a017" },
  { id: "refinery",   label: "Refinery",       icon: Factory,    color: "#f59e0b" },
  { id: "supply",     label: "Supply Chain",   icon: Ship,       color: "#a78bfa" },
  { id: "regional",   label: "Regional",       icon: Globe2,     color: "#22c55e" },
];

const productionByRegion = [
  { region: "West Africa",  bbl: 93600,  capacity: 105000, color: "#06b6d4" },
  { region: "Gulf States",  bbl: 213000, capacity: 230000, color: "#d4a017" },
  { region: "North Africa", bbl: 71700,  capacity: 85000,  color: "#a78bfa" },
  { region: "Caspian",      bbl: 61800,  capacity: 70000,  color: "#22c55e" },
  { region: "Americas",     bbl: 98400,  capacity: 110000, color: "#f472b6" },
];

const opPerf = [
  { subject: "Efficiency", A: 87 }, { subject: "Uptime",   A: 94 },
  { subject: "Safety",     A: 98 }, { subject: "Output",   A: 82 },
  { subject: "Quality",    A: 91 }, { subject: "Cost",     A: 76 },
];

const topFields = [
  { name: "Ghawar Field",  country: "Saudi Arabia", bbl: 142000, change: 1.2  },
  { name: "Permian Basin", country: "USA",          bbl: 98400,  change: 3.8  },
  { name: "Bu Hasa Field", country: "UAE",          bbl: 71000,  change: -0.4 },
  { name: "Tengiz Field",  country: "Kazakhstan",   bbl: 61800,  change: 2.1  },
  { name: "Agbami Field",  country: "Nigeria",      bbl: 55400,  change: 0.9  },
];

const marketSignals = [
  { type: "bullish", text: "OPEC+ extends voluntary cuts of 2.2M bbl/day through Q1 2025", time: "2h ago" },
  { type: "neutral", text: "US crude inventories fell 3.4M barrels last week — API data", time: "5h ago" },
  { type: "bearish", text: "China demand growth forecast revised down by IEA to 650K bbl/day", time: "8h ago" },
  { type: "bullish", text: "Brent backwardation widens; prompt premium signals tight supply", time: "12h ago" },
  { type: "neutral", text: "WTI-Brent spread narrows to $2.80 — lowest in 6 weeks", time: "1d ago" },
];

const spreadData = [
  { date: "Apr 20", brentWti: 4.2, brentDubai: 1.8 },
  { date: "Apr 25", brentWti: 3.9, brentDubai: 2.1 },
  { date: "Apr 30", brentWti: 4.5, brentDubai: 1.6 },
  { date: "May 3",  brentWti: 3.6, brentDubai: 2.4 },
  { date: "May 6",  brentWti: 3.1, brentDubai: 2.9 },
  { date: "May 9",  brentWti: 2.8, brentDubai: 3.1 },
];

const regionShare = [
  { name: "Gulf States",  value: 39.4, color: "#d4a017" },
  { name: "Americas",     value: 18.1, color: "#f472b6" },
  { name: "West Africa",  value: 17.2, color: "#06b6d4" },
  { name: "Caspian",      value: 11.4, color: "#22c55e" },
  { name: "North Africa", value: 13.2, color: "#a78bfa" },
  { name: "Other",        value: 0.7,  color: "#475569" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("prices");
  const [summary, setSummary]     = useState<any>(null);

  useEffect(() => {
    api.summary().then(setSummary).catch(() => null);
  }, []);

  const kpis = [
    {
      label: "Total Production", suffix: "bbl/day",
      value: summary ? `${Math.round(summary.totalProduction / 1000)}K` : "—",
      change: 5.7, color: "#06b6d4", icon: BarChart3,
    },
    {
      label: "Brent Crude",
      value: summary ? `$${summary.currentBrent?.toFixed(2)}` : "—",
      change: summary?.priceChange7d ?? 2.3, color: "#d4a017", icon: TrendingUp,
    },
    {
      label: "Active Refineries",
      value: summary ? `${summary.activeRefineries} / 5` : "—",
      change: 0, color: "#22c55e", icon: Factory,
    },
    {
      label: "Open Alerts",
      value: summary ? String(summary.alerts) : "—",
      change: 14.3, color: "#ef4444", icon: AlertTriangle,
    },
  ];

  return (
    <MainLayout title="Oil Analytics">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10 blur-2xl" style={{ background: k.color }} />
            <k.icon size={15} style={{ color: k.color }} className="mb-2" />
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-white">{k.value}</p>
              {k.suffix && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{k.suffix}</p>}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <div className="flex items-center gap-0.5 mt-1.5 text-xs font-semibold"
              style={{ color: k.change > 0 ? "#22c55e" : k.change < 0 ? "#ef4444" : "var(--text-muted)" }}>
              {k.change > 0 ? <ArrowUpRight size={11} /> : k.change < 0 ? <ArrowDownRight size={11} /> : null}
              {k.change !== 0 ? `${Math.abs(k.change)}%` : "Stable"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 p-1.5 rounded-xl overflow-x-auto"
        style={{ background: "rgba(8,14,31,0.8)", border: "1px solid rgba(30,58,95,0.4)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{ color: activeTab === t.id ? "#fff" : "var(--text-muted)" }}>
            {activeTab === t.id && (
              <motion.div layoutId="analytics-tab" className="absolute inset-0 rounded-lg"
                style={{ background: `${t.color}18`, border: `1px solid ${t.color}40` }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
            )}
            <t.icon size={14} className="relative z-10" style={{ color: activeTab === t.id ? t.color : undefined }} />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* ── Prices ────────────────────────────────────── */}
          {activeTab === "prices" && (
            <div className="space-y-4">
              <OilPriceChart />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Spread analysis */}
                <div className="lg:col-span-2 rounded-xl p-5"
                  style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">Price Spread Analysis</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Brent–WTI and Brent–Dubai differentials ($/bbl)</p>
                    </div>
                    <Activity size={15} style={{ color: "#06b6d4" }} />
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={spreadData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                      <defs>
                        <linearGradient id="bwGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="bdGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4a017" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any) => [`$${v}/bbl`]} />
                      <Area type="monotone" dataKey="brentWti"   name="Brent–WTI"   stroke="#06b6d4" fill="url(#bwGrad)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="brentDubai" name="Brent–Dubai"  stroke="#d4a017" fill="url(#bdGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Market signals */}
                <div className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                  <div className="px-4 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                    <Flame size={14} style={{ color: "#f59e0b" }} />
                    <h3 className="text-sm font-semibold text-slate-200">Market Signals</h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
                    {marketSignals.map((s, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-start gap-2.5 hover:bg-slate-800/20 transition-colors">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{
                          background: s.type === "bullish" ? "#22c55e" : s.type === "bearish" ? "#ef4444" : "#94a3b8",
                        }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-snug">{s.text}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Production ─────────────────────────────────── */}
          {activeTab === "production" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Progress bars */}
              <div className="rounded-xl p-5"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Output vs Capacity</h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Daily output by region (thousand bbl)</p>
                <div className="space-y-4">
                  {productionByRegion.map((r, i) => (
                    <div key={r.region}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-300">{r.region}</span>
                        <span style={{ color: "var(--text-muted)" }}>{(r.bbl / 1000).toFixed(0)}K / {(r.capacity / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(r.bbl / r.capacity) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
                          className="h-full rounded-full" style={{ background: r.color }} />
                      </div>
                      <p className="text-xs mt-0.5 text-right" style={{ color: r.color }}>
                        {((r.bbl / r.capacity) * 100).toFixed(0)}% utilization
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar */}
              <div className="rounded-xl p-5"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Operational Health</h3>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Multi-dimension performance score</p>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={opPerf} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke="rgba(30,58,95,0.4)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Top fields */}
              <div className="rounded-xl overflow-hidden"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                  <h3 className="text-sm font-semibold text-slate-200">Top Fields by Output</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>bbl/day — 7d change</p>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
                  {topFields.map((f, i) => (
                    <div key={f.name} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
                      <span className="text-sm font-bold w-5 text-center" style={{ color: "var(--text-muted)" }}>
                        {i + 1}
                      </span>
                      <Droplets size={13} style={{ color: "#06b6d4", flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{f.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">{(f.bbl / 1000).toFixed(0)}K</p>
                        <p className="text-xs font-semibold" style={{ color: f.change >= 0 ? "#22c55e" : "#ef4444" }}>
                          {f.change >= 0 ? "+" : ""}{f.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Refinery ──────────────────────────────────── */}
          {activeTab === "refinery" && <RefineryMonitor />}

          {/* ── Supply Chain ──────────────────────────────── */}
          {activeTab === "supply" && <SupplyChain />}

          {/* ── Regional ──────────────────────────────────── */}
          {activeTab === "regional" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Horizontal bar chart */}
              <div className="lg:col-span-2 rounded-xl p-5"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Output vs Capacity by Region</h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Thousand bbl/day</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={productionByRegion} layout="vertical" margin={{ top: 5, right: 30, bottom: 0, left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="region" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any) => [`${(v / 1000).toFixed(0)}K bbl/day`]} />
                    <Bar dataKey="capacity" name="Capacity" fill="rgba(30,58,95,0.5)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="bbl" name="Output" radius={[0, 4, 4, 0]}>
                      {productionByRegion.map((r, i) => (
                        <Cell key={i} fill={r.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Market share donut */}
              <div className="rounded-xl p-5"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Production Share</h3>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>% of total output by region</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={regionShare} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" strokeWidth={0} paddingAngle={2}>
                      {regionShare.map((r, i) => <Cell key={i} fill={r.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {regionShare.map((r) => (
                    <div key={r.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: r.color }} />
                      <span className="flex-1" style={{ color: "var(--text-secondary)" }}>{r.name}</span>
                      <span className="font-semibold text-white">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}
