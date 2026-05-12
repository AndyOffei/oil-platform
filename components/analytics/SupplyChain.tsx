"use client";

import { motion } from "framer-motion";
import { Ship, ArrowRight, CheckCircle2, Clock, Loader2, Package } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Line, Area } from "recharts";

const exports_ = [
  { route: "Nigeria → Rotterdam", volume: 280000, product: "Crude", status: "In Transit", eta: "Nov 18", progress: 62 },
  { route: "Saudi Arabia → Singapore", volume: 420000, product: "LNG", status: "Loading", eta: "Nov 20", progress: 15 },
  { route: "Algeria → Marseille", volume: 160000, product: "Crude", status: "Delivered", eta: "Nov 12", progress: 100 },
  { route: "Ghana → Houston", volume: 95000, product: "Crude", status: "In Transit", eta: "Nov 22", progress: 38 },
  { route: "UAE → Tokyo", volume: 380000, product: "LNG", status: "In Transit", eta: "Nov 25", progress: 24 },
];

const monthlyExport = [
  { month: "Jun", crude: 4.2, lng: 1.8, refined: 0.9 },
  { month: "Jul", crude: 4.8, lng: 2.1, refined: 1.1 },
  { month: "Aug", crude: 5.1, lng: 2.4, refined: 1.0 },
  { month: "Sep", crude: 4.6, lng: 2.2, refined: 1.3 },
  { month: "Oct", crude: 5.4, lng: 2.8, refined: 1.2 },
  { month: "Nov", crude: 5.9, lng: 3.1, refined: 1.4 },
];

const statusIcon = (s: string) => {
  if (s === "Delivered") return <CheckCircle2 size={13} className="text-green-400" />;
  if (s === "Loading") return <Loader2 size={13} className="text-yellow-400 animate-spin" />;
  return <Ship size={13} className="text-cyan-400" />;
};

export default function SupplyChain() {
  return (
    <div className="space-y-4">
      {/* Active Shipments */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
          <h3 className="text-sm font-semibold text-slate-200">Active Shipments & Export Routes</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
          {exports_.map((e, i) => (
            <div key={i} className="px-5 py-3.5">
              <div className="flex items-center gap-3 mb-2">
                {statusIcon(e.status)}
                <span className="text-sm font-medium text-slate-200">{e.route}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{
                  background: e.status === "Delivered" ? "rgba(34,197,94,0.1)" : e.status === "Loading" ? "rgba(245,158,11,0.1)" : "rgba(6,182,212,0.1)",
                  color: e.status === "Delivered" ? "#22c55e" : e.status === "Loading" ? "#f59e0b" : "#06b6d4",
                }}>{e.status}</span>
              </div>
              <div className="flex items-center gap-3 text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                <span><Package size={10} className="inline mr-1" />{e.product}</span>
                <span>·</span>
                <span>{e.volume.toLocaleString()} bbl</span>
                <span>·</span>
                <span><Clock size={10} className="inline mr-1" />ETA: {e.eta}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${e.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                    className="h-full rounded-full" style={{ background: e.status === "Delivered" ? "#22c55e" : "#06b6d4" }} />
                </div>
                <span className="text-xs w-8 text-right font-semibold" style={{ color: "var(--text-secondary)" }}>{e.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Volume Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">Export/Import Volume</h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Monthly volume by product type (Million bbl)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyExport} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
            <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="crude" name="Crude" fill="#06b6d4" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="lng" name="LNG" fill="#d4a017" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="refined" name="Refined" fill="#a78bfa" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
