"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

const generateData = () => {
  const base = [82, 84, 81, 86, 88, 85, 90, 87, 92, 89, 94, 91, 96, 93, 88, 91, 95, 98, 94, 99, 97, 102, 99, 103];
  return base.map((v, i) => ({
    time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    brent: v + Math.random() * 2 - 1,
    wti: v - 3 + Math.random() * 2 - 1,
    opec: v + 1.5 + Math.random() * 2 - 1,
  }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-lg text-xs"
      style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
    >
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold text-white">${p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default function MarketPriceChart() {
  const [data, setData] = useState(generateData());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const newPoint = {
          time: "now",
          brent: last.brent + (Math.random() - 0.48) * 1.5,
          wti: last.wti + (Math.random() - 0.48) * 1.5,
          opec: last.opec + (Math.random() - 0.48) * 1.5,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Live Oil Prices</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            USD per barrel — updates every 3s
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          {[
            { label: "Brent", value: latest?.brent, color: "#06b6d4" },
            { label: "WTI", value: latest?.wti, color: "#d4a017" },
            { label: "OPEC", value: latest?.opec, color: "#a78bfa" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-right">
              <p style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="font-bold" style={{ color }}>
                ${value?.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="brent" name="Brent" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="wti" name="WTI" stroke="#d4a017" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="opec" name="OPEC" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Change indicators */}
      <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
        {[
          { label: "Brent 24h", change: 2.3, color: "#06b6d4" },
          { label: "WTI 24h", change: 1.8, color: "#d4a017" },
          { label: "OPEC 24h", change: -0.5, color: "#a78bfa" },
        ].map(({ label, change, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <TrendingUp size={10} style={{ color, transform: change < 0 ? "scaleY(-1)" : "none" }} />
            <span style={{ color: "var(--text-muted)" }}>{label}</span>
            <span className="font-semibold" style={{ color: change >= 0 ? "#22c55e" : "#ef4444" }}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
