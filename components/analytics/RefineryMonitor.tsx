"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Thermometer, Gauge, AlertTriangle, CheckCircle2, Wrench, Activity } from "lucide-react";

const refineries = [
  { id: "R001", name: "Warri Refinery", country: "Nigeria", capacity: 125000, throughput: 84000, efficiency: 67.2, status: "Operational", temp: 412, pressure: 186, alert: false },
  { id: "R002", name: "Port Harcourt", country: "Nigeria", capacity: 210000, throughput: 142000, efficiency: 67.6, status: "Operational", temp: 398, pressure: 192, alert: false },
  { id: "R003", name: "Ras Tanura", country: "Saudi Arabia", capacity: 550000, throughput: 512000, efficiency: 93.1, status: "Operational", temp: 445, pressure: 201, alert: false },
  { id: "R004", name: "Tema Oil Refinery", country: "Ghana", capacity: 45000, throughput: 18000, efficiency: 40.0, status: "Maintenance", temp: 0, pressure: 0, alert: true },
  { id: "R005", name: "Skikda Refinery", country: "Algeria", capacity: 300000, throughput: 271000, efficiency: 90.3, status: "Operational", temp: 431, pressure: 198, alert: false },
];

function GaugeRing({ value, max, color, size = 60 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (value / max) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(30,58,95,0.4)" strokeWidth={5} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">
        {value > 0 ? `${value.toFixed(0)}%` : "—"}
      </text>
    </svg>
  );
}

export default function RefineryMonitor() {
  const [data, setData] = useState(refineries);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((r) =>
          r.status === "Operational"
            ? { ...r, temp: parseFloat((r.temp + (Math.random() - 0.5) * 4).toFixed(1)), pressure: parseFloat((r.pressure + (Math.random() - 0.5) * 2).toFixed(1)) }
            : r
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Refinery Monitoring</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Live operational metrics — updates every 3s</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />LIVE
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
        {data.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
            className="px-5 py-4 hover:bg-slate-800/20 transition-colors">
            <div className="flex items-center gap-4">
              {/* Efficiency gauge */}
              <GaugeRing value={r.efficiency} max={100} color={r.efficiency > 80 ? "#22c55e" : r.efficiency > 60 ? "#f59e0b" : "#ef4444"} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {r.alert
                    ? <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0" />
                    : r.status === "Operational"
                    ? <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                    : <Wrench size={13} className="text-orange-400 flex-shrink-0" />}
                  <span className="text-sm font-semibold text-slate-200">{r.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                    background: r.status === "Operational" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                    color: r.status === "Operational" ? "#22c55e" : "#f59e0b",
                  }}>{r.status}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{r.country} · Capacity: {r.capacity.toLocaleString()} bbl/day</p>

                {/* Throughput bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: r.capacity > 0 ? `${(r.throughput / r.capacity) * 100}%` : "0%" }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      style={{ background: r.efficiency > 80 ? "#22c55e" : r.efficiency > 60 ? "#f59e0b" : "#ef4444" }}
                    />
                  </div>
                  <span className="text-xs font-medium w-28 text-right" style={{ color: "var(--text-secondary)" }}>
                    {r.throughput.toLocaleString()} / {r.capacity.toLocaleString()} bbl
                  </span>
                </div>
              </div>

              {/* Live readings */}
              {r.status === "Operational" && (
                <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 rounded-lg" style={{ background: "rgba(8,14,31,0.6)", border: "1px solid rgba(30,58,95,0.3)" }}>
                    <Thermometer size={12} className="mx-auto mb-1 text-orange-400" />
                    <p className="text-xs font-bold text-white">{r.temp}°C</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Temp</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ background: "rgba(8,14,31,0.6)", border: "1px solid rgba(30,58,95,0.3)" }}>
                    <Gauge size={12} className="mx-auto mb-1 text-cyan-400" />
                    <p className="text-xs font-bold text-white">{r.pressure} bar</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Pressure</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
