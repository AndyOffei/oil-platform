"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4.2, target: 3.8 },
  { month: "Feb", revenue: 3.9, target: 4.0 },
  { month: "Mar", revenue: 5.1, target: 4.2 },
  { month: "Apr", revenue: 4.7, target: 4.5 },
  { month: "May", revenue: 5.8, target: 4.8 },
  { month: "Jun", revenue: 6.2, target: 5.2 },
  { month: "Jul", revenue: 5.9, target: 5.5 },
  { month: "Aug", revenue: 6.8, target: 5.8 },
  { month: "Sep", revenue: 7.1, target: 6.0 },
  { month: "Oct", revenue: 6.5, target: 6.2 },
  { month: "Nov", revenue: 7.4, target: 6.5 },
  { month: "Dec", revenue: 8.2, target: 7.0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-lg text-xs"
      style={{
        background: "#0d1629",
        border: "1px solid rgba(30,58,95,0.6)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold text-white">${p.value}M</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Revenue Overview</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Monthly revenue vs target (USD Millions)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-xs px-2 py-1 rounded-lg outline-none"
            style={{
              background: "rgba(13,22,41,0.8)",
              border: "1px solid rgba(30,58,95,0.5)",
              color: "var(--text-secondary)",
            }}
          >
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4a017" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#d4a017"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            fill="url(#targetGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#d4a017", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
