"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush } from "recharts";

const generatePrices = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const base = 95 + Math.sin(i / 8) * 12 + (Math.random() - 0.5) * 6;
    return {
      date: new Date(Date.now() - (days - 1 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Brent: parseFloat((base + 4).toFixed(2)),
      WTI: parseFloat((base + 1.2).toFixed(2)),
      OPEC: parseFloat((base + 5.8).toFixed(2)),
      Dubai: parseFloat((base + 3.1).toFixed(2)),
    };
  });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}>
      <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-bold text-white">${p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function OilPriceChart() {
  const [range, setRange] = useState(30);
  const [data, setData] = useState(() => generatePrices(30));

  useEffect(() => { setData(generatePrices(range)); }, [range]);

  const latest = data[data.length - 1];
  const prev = data[data.length - 8];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Oil Price Tracking</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>USD per barrel — historical data</p>
        </div>
        <div className="flex gap-1">
          {[7, 30, 60, 90].map((d) => (
            <button key={d} onClick={() => setRange(d)}
              className="px-2.5 py-1 rounded text-xs font-medium transition-all"
              style={{ background: range === d ? "rgba(6,182,212,0.2)" : "rgba(13,22,41,0.5)", color: range === d ? "#06b6d4" : "var(--text-muted)", border: range === d ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(30,58,95,0.3)" }}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Price summary row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Brent", value: latest?.Brent, color: "#06b6d4" },
          { label: "WTI", value: latest?.WTI, color: "#d4a017" },
          { label: "OPEC", value: latest?.OPEC, color: "#a78bfa" },
          { label: "Dubai", value: latest?.Dubai, color: "#22c55e" },
        ].map(({ label, value, color }) => {
          const prevVal = prev?.[label as keyof typeof prev] as number;
          const chg = value && prevVal ? (((value - prevVal) / prevVal) * 100).toFixed(1) : "0.0";
          return (
            <div key={label} className="p-3 rounded-lg" style={{ background: "rgba(8,14,31,0.6)", border: "1px solid rgba(30,58,95,0.3)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-lg font-bold" style={{ color }}>${value?.toFixed(2)}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: Number(chg) >= 0 ? "#22c55e" : "#ef4444" }}>
                {Number(chg) >= 0 ? "+" : ""}{chg}% 7d
              </p>
            </div>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 20, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(range / 7)} />
          <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Brush dataKey="date" height={20} stroke="rgba(30,58,95,0.5)" fill="rgba(8,14,31,0.8)" travellerWidth={6} />
          <Line type="monotone" dataKey="Brent" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="WTI" stroke="#d4a017" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="OPEC" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="Dubai" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="2 3" dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
