"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { region: "Gulf", bbl: 42, capacity: 50 },
  { region: "North Sea", bbl: 38, capacity: 45 },
  { region: "Sahara", bbl: 29, capacity: 35 },
  { region: "Caspian", bbl: 31, capacity: 38 },
  { region: "Arctic", bbl: 18, capacity: 25 },
  { region: "Permian", bbl: 55, capacity: 60 },
];

const COLORS = ["#06b6d4", "#0ea5e9", "#38bdf8", "#67e8f9", "#a5f3fc", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const utilization = ((payload[0].value / payload[0].payload.capacity) * 100).toFixed(1);
  return (
    <div
      className="px-3 py-2.5 rounded-lg text-xs"
      style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
    >
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      <p style={{ color: "#06b6d4" }}>Production: <strong>{payload[0].value}K bbl/day</strong></p>
      <p style={{ color: "var(--text-muted)" }}>Capacity: {payload[0].payload.capacity}K bbl/day</p>
      <p style={{ color: "#22c55e" }}>Utilization: {utilization}%</p>
    </div>
  );
};

export default function ProductionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Production by Region</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Daily output in thousand barrels
          </p>
        </div>
        <div
          className="text-xs px-2 py-1 rounded-full"
          style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
        >
          Live
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" horizontal={true} vertical={false} />
          <XAxis dataKey="region" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30,58,95,0.2)" }} />
          <Bar dataKey="bbl" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Utilization bars */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 3).map((item, i) => (
          <div key={item.region} className="flex items-center gap-3">
            <span className="text-xs w-16" style={{ color: "var(--text-muted)" }}>
              {item.region}
            </span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.bbl / item.capacity) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                className="h-full rounded-full"
                style={{ background: COLORS[i] }}
              />
            </div>
            <span className="text-xs w-8 text-right" style={{ color: "var(--text-secondary)" }}>
              {((item.bbl / item.capacity) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
