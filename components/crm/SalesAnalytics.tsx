"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ComposedChart, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { DollarSign, TrendingUp, Users, RotateCcw, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";

const revenueGrowth = [
  { q: "Q1 '23", revenue: 18.2, growth: null },
  { q: "Q2 '23", revenue: 21.4, growth: 17.6 },
  { q: "Q3 '23", revenue: 24.8, growth: 15.9 },
  { q: "Q4 '23", revenue: 31.2, growth: 25.8 },
  { q: "Q1 '24", revenue: 29.4, growth: -5.8 },
  { q: "Q2 '24", revenue: 35.6, growth: 21.1 },
  { q: "Q3 '24", revenue: 42.1, growth: 18.3 },
  { q: "Q4 '24", revenue: 52.8, growth: 25.4 },
];

const retentionData = [
  { month: "Jan", retained: 94, churned: 6 },
  { month: "Feb", retained: 92, churned: 8 },
  { month: "Mar", retained: 95, churned: 5 },
  { month: "Apr", retained: 93, churned: 7 },
  { month: "May", retained: 96, churned: 4 },
  { month: "Jun", retained: 94, churned: 6 },
  { month: "Jul", retained: 97, churned: 3 },
  { month: "Aug", retained: 95, churned: 5 },
  { month: "Sep", retained: 96, churned: 4 },
  { month: "Oct", retained: 98, churned: 2 },
  { month: "Nov", retained: 96, churned: 4 },
  { month: "Dec", retained: 97, churned: 3 },
];

const regionalSales = [
  { region: "West Africa", revenue: 18.4, deals: 48, growth: 22.1, color: "#06b6d4" },
  { region: "Gulf States", revenue: 14.2, deals: 36, growth: 14.8, color: "#d4a017" },
  { region: "North Africa", revenue: 9.6, deals: 28, growth: 18.3, color: "#a78bfa" },
  { region: "East Africa", revenue: 6.1, deals: 19, growth: 31.4, color: "#22c55e" },
  { region: "Europe", revenue: 4.8, deals: 12, growth: 8.2, color: "#f472b6" },
  { region: "Americas", revenue: 3.2, deals: 9, growth: 12.6, color: "#f59e0b" },
];

const conversionMetrics = [
  { month: "Jul", rate: 22.4, deals: 28 },
  { month: "Aug", rate: 24.1, deals: 31 },
  { month: "Sep", rate: 23.8, deals: 29 },
  { month: "Oct", rate: 25.6, deals: 34 },
  { month: "Nov", rate: 27.1, deals: 38 },
  { month: "Dec", rate: 26.4, deals: 36 },
];

const topReps = [
  { name: "J. Okafor", deals: 42, revenue: "$8.4M", quota: 94, change: 12 },
  { name: "M. Adeyemi", deals: 38, revenue: "$7.1M", quota: 88, change: 8 },
  { name: "A. Hassan", deals: 31, revenue: "$5.8M", quota: 82, change: -3 },
  { name: "S. Mensah", deals: 28, revenue: "$4.9M", quota: 76, change: 15 },
  { name: "K. Asante", deals: 22, revenue: "$3.6M", quota: 68, change: -6 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}>
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SalesAnalytics() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$56.3M", change: 25.4, icon: DollarSign, color: "#22c55e" },
          { label: "Revenue Growth", value: "+25.4%", change: 6.2, icon: TrendingUp, color: "#06b6d4" },
          { label: "Retention Rate", value: "96.8%", change: 1.4, icon: RotateCcw, color: "#a78bfa" },
          { label: "Active Reps", value: "24", change: 4.3, icon: Users, color: "#d4a017" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full opacity-10 blur-xl" style={{ background: k.color }} />
            <k.icon size={15} style={{ color: k.color }} className="mb-2" />
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold" style={{ color: k.change >= 0 ? "#22c55e" : "#ef4444" }}>
              {k.change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {Math.abs(k.change)}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Growth + Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Revenue Growth</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Quarterly revenue (USD Millions)</p>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={revenueGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="revGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="q" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
              <YAxis yAxisId="gr" orientation="right" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue ($M)" stroke="#22c55e" strokeWidth={2} fill="url(#revGrowthGrad)" dot={false} activeDot={{ r: 4 }} />
              <Bar yAxisId="gr" dataKey="growth" name="Growth (%)" fill="rgba(6,182,212,0.2)" radius={[2, 2, 0, 0]} maxBarSize={20} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Retention */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Customer Retention</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Monthly retention vs churn rate (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={retentionData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="retained" name="Retained %" stroke="#a78bfa" strokeWidth={2} fill="url(#retGrad)" dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="churned" name="Churn %" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Regional Sales + Conversion Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Regional */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
            <h3 className="text-sm font-semibold text-slate-200">Regional Sales Performance</h3>
          </div>
          <div className="p-5 space-y-3">
            {regionalSales.map((r, i) => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} style={{ color: r.color }} />
                    <span className="text-sm font-medium text-slate-200">{r.region}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{r.deals} deals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>+{r.growth}%</span>
                    <span className="text-sm font-bold text-white">${r.revenue}M</span>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(30,58,95,0.3)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.revenue / regionalSales[0].revenue) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                    className="h-full rounded-full"
                    style={{ background: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion Metrics */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Conversion Metrics</h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Monthly close rate</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={conversionMetrics} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" name="Conversion Rate" stroke="#d4a017" strokeWidth={2} dot={{ r: 3, fill: "#d4a017" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {conversionMetrics.slice(-3).map((m) => (
              <div key={m.month} className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>{m.month}</span>
                <span className="font-semibold text-white">{m.deals} deals closed</span>
                <span className="font-bold" style={{ color: "#d4a017" }}>{m.rate}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sales Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl overflow-hidden"
        style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
          <h3 className="text-sm font-semibold text-slate-200">Sales Rep Leaderboard</h3>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Q4 2024</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                {["Rank", "Rep", "Deals Closed", "Revenue", "Quota Attainment", "vs Last Quarter"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {topReps.map((r, i) => (
                <tr key={r.name} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold" style={{ color: i === 0 ? "#d4a017" : i === 1 ? "#94a3b8" : i === 2 ? "#f59e0b" : "var(--text-muted)" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-200">{r.name}</td>
                  <td className="px-5 py-3 text-white">{r.deals}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: "#22c55e" }}>{r.revenue}</td>
                  <td className="px-5 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.quota}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.08 }}
                          className="h-full rounded-full"
                          style={{ background: r.quota >= 80 ? "#22c55e" : "#f59e0b" }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-8" style={{ color: r.quota >= 80 ? "#22c55e" : "#f59e0b" }}>{r.quota}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: r.change >= 0 ? "#22c55e" : "#ef4444" }}>
                      {r.change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {Math.abs(r.change)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
