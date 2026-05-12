"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, Target,
  BarChart3, Activity, ChevronDown, ChevronUp, Cpu, Database,
  ShieldCheck, Lightbulb, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";

const forecast7d = [
  { day: "Today",  price: 102.4, low: 100.1, high: 104.8, confidence: 94, signal: "Bullish"  },
  { day: "Tue",    price: 104.1, low: 101.4, high: 106.9, confidence: 88, signal: "Bullish"  },
  { day: "Wed",    price: 103.2, low: 100.0, high: 106.4, confidence: 81, signal: "Neutral"  },
  { day: "Thu",    price: 106.5, low: 103.1, high: 110.0, confidence: 76, signal: "Bullish"  },
  { day: "Fri",    price: 105.8, low: 102.2, high: 109.4, confidence: 72, signal: "Neutral"  },
  { day: "Sat",    price: 108.3, low: 104.4, high: 112.2, confidence: 68, signal: "Bullish"  },
  { day: "Sun",    price: 107.1, low: 103.0, high: 111.2, confidence: 61, signal: "Bearish"  },
];

const demandForecast = [
  { month: "Nov", actual: 98.2,  predicted: 99.1  },
  { month: "Dec", actual: 102.4, predicted: 103.8 },
  { month: "Jan", actual: null,  predicted: 106.2 },
  { month: "Feb", actual: null,  predicted: 104.8 },
  { month: "Mar", actual: null,  predicted: 109.1 },
  { month: "Apr", actual: null,  predicted: 111.4 },
];

const supplyRisks = [
  { region: "Gulf Region",   risk: 78, factor: "Geopolitical tension",  impact: "High",   color: "#ef4444" },
  { region: "West Africa",   risk: 45, factor: "Infrastructure aging",   impact: "Medium", color: "#f59e0b" },
  { region: "North Africa",  risk: 32, factor: "Pipeline maintenance",   impact: "Medium", color: "#f59e0b" },
  { region: "Caspian Sea",   risk: 18, factor: "Seasonal weather",       impact: "Low",    color: "#22c55e" },
  { region: "Americas",      risk: 12, factor: "Regulatory changes",     impact: "Low",    color: "#22c55e" },
];

const recommendations = [
  { id: 1, type: "buy",    title: "Increase Brent exposure",     detail: "AI detects upward momentum with 88% confidence. OPEC cuts + Asian demand surge align.",                    impact: "+$2.1M est.", confidence: 88 },
  { id: 2, type: "hedge",  title: "Hedge Gulf supply risk",       detail: "Geopolitical risk index at 78/100. Consider 30-day forward contracts to protect margins.",               impact: "-Risk 34%",   confidence: 81 },
  { id: 3, type: "sell",   title: "Reduce WTI short position",   detail: "Model detects overbought signal. Inventory data suggests price correction likely by Fri.",                impact: "+$0.8M est.", confidence: 74 },
  { id: 4, type: "expand", title: "Expand West Africa output",   detail: "Demand-supply gap widening. Jubilee field has 15% spare capacity available immediately.",               impact: "+8.2K bbl/d", confidence: 82 },
];

const insights = [
  { icon: TrendingUp, color: "#22c55e", title: "Bullish 7-Day Bias", body: "5 of 7 days forecast as bullish. OPEC+ supply discipline the primary catalyst driving the upside signal." },
  { icon: AlertTriangle, color: "#f59e0b", title: "Gulf Risk Elevated", body: "Gulf region risk index climbed to 78/100. Model increases hedge recommendations when this threshold is crossed." },
  { icon: Lightbulb, color: "#a78bfa", title: "Demand Acceleration", body: "Q1 2025 demand forecast upgraded +3.2% vs prior model run. Asian LNG imports beating seasonal estimates." },
];

const trendData = Array.from({ length: 60 }, (_, i) => {
  const actual    = i < 30;
  const base      = 95 + Math.sin(i / 8) * 10 + (Math.random() - 0.5) * 4;
  return {
    i,
    actual:    actual ? parseFloat(base.toFixed(2)) : null,
    predicted: !actual ? parseFloat((base + (Math.random() - 0.4) * 3).toFixed(2)) : null,
    upper:     !actual ? parseFloat((base + 5).toFixed(2)) : null,
    lower:     !actual ? parseFloat((base - 5).toFixed(2)) : null,
  };
});

const signalStyle: Record<string, { bg: string; text: string; border: string }> = {
  Bullish: { bg: "rgba(34,197,94,0.08)",  text: "#22c55e", border: "rgba(34,197,94,0.25)"  },
  Bearish: { bg: "rgba(239,68,68,0.08)",  text: "#ef4444", border: "rgba(239,68,68,0.25)"  },
  Neutral: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
};

const recColors: Record<string, { bg: string; text: string; label: string }> = {
  buy:    { bg: "rgba(34,197,94,0.1)",   text: "#22c55e", label: "BUY SIGNAL" },
  hedge:  { bg: "rgba(245,158,11,0.1)",  text: "#f59e0b", label: "HEDGE"      },
  sell:   { bg: "rgba(239,68,68,0.1)",   text: "#ef4444", label: "SELL SIGNAL" },
  expand: { bg: "rgba(6,182,212,0.1)",   text: "#06b6d4", label: "EXPAND"     },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}>
      {payload.filter((p: any) => p.value !== null).map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-bold text-white">${p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AIPredictionsPage() {
  const [expandedRec, setExpandedRec] = useState<number | null>(1);

  return (
    <MainLayout title="AI Prediction Center">

      {/* ── Model stats banner ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Model Accuracy",       value: "94.2%",     sub: "Last 30 days",            color: "#a78bfa", icon: Cpu,       up: true  },
          { label: "Training Data",        value: "15 Years",  sub: "180K price observations", color: "#06b6d4", icon: Database,  up: null  },
          { label: "Predictions Today",    value: "1,284",     sub: "Across all models",        color: "#22c55e", icon: BarChart3, up: true  },
          { label: "Confidence Score",     value: "High",      sub: "94 / 100 composite",      color: "#d4a017", icon: ShieldCheck, up: null },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl p-4 relative overflow-hidden flex items-center gap-3"
            style={{ background: "rgba(13,22,41,0.9)", border: `1px solid rgba(30,58,95,0.5)` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top right, ${s.color}08, transparent 60%)` }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 7-Day Forecast Cards ─────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">7-Day Brent Crude Price Forecast</h3>
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>
            <Zap size={10} /> Live · Updated 6 min ago
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {forecast7d.map((f, i) => {
            const sig = signalStyle[f.signal];
            const isToday = i === 0;
            return (
              <motion.div key={f.day} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-xl p-3 text-center relative overflow-hidden"
                style={{
                  background: isToday ? "rgba(167,139,250,0.12)" : sig.bg,
                  border: isToday ? "1px solid rgba(167,139,250,0.4)" : `1px solid ${sig.border}`,
                }}>
                {isToday && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(167,139,250,0.15), transparent 70%)" }} />
                )}
                <p className="text-xs font-semibold mb-2 relative z-10" style={{ color: isToday ? "#a78bfa" : "var(--text-muted)" }}>{f.day}</p>
                <p className="text-base font-bold text-white relative z-10">${f.price}</p>
                <p className="text-xs mt-0.5 relative z-10" style={{ color: "var(--text-muted)" }}>${f.low}–{f.high}</p>
                <div className="flex items-center justify-center gap-0.5 mt-2 relative z-10">
                  {f.signal === "Bullish"
                    ? <TrendingUp size={10} style={{ color: "#22c55e" }} />
                    : f.signal === "Bearish"
                    ? <TrendingDown size={10} style={{ color: "#ef4444" }} />
                    : <Activity size={10} style={{ color: "#f59e0b" }} />}
                  <span className="text-xs font-semibold" style={{ color: sig.text }}>{f.signal}</span>
                </div>
                <div className="mt-2 h-1 rounded-full relative z-10" style={{ background: "rgba(30,58,95,0.4)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${f.confidence}%`, background: f.confidence > 80 ? "#22c55e" : f.confidence > 65 ? "#f59e0b" : "#ef4444" }} />
                </div>
                <p className="text-xs mt-1 relative z-10" style={{ color: "var(--text-muted)" }}>{f.confidence}%</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Key Insights strip ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        {insights.map((ins, i) => (
          <motion.div key={ins.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}25` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ins.color}18` }}>
              <ins.icon size={15} style={{ color: ins.color }} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 mb-0.5">{ins.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ins.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Trend Forecast */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-200">Market Trend Forecast</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block rounded" style={{ background: "#06b6d4" }} />Actual</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block rounded" style={{ background: "#a78bfa", borderTop: "2px dashed #a78bfa" }} />Predicted</span>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Historical + 30-day AI projection with confidence band</p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="predBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="i" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={29} stroke="rgba(167,139,250,0.5)" strokeDasharray="4 4" label={{ value: "Today", fill: "#a78bfa", fontSize: 10 }} />
              <Area type="monotone" dataKey="upper" name="Upper Band" stroke="transparent" fill="url(#predBand)" />
              <Area type="monotone" dataKey="lower" name="Lower Band" stroke="transparent" fill="rgba(13,22,41,0)" />
              <Line type="monotone" dataKey="actual"    name="Actual"    stroke="#06b6d4" strokeWidth={2} dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Demand Prediction */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Demand Prediction</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>6-month demand outlook (MB/day)</p>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={demandForecast} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `${v}M`} />
              <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine x="Dec" stroke="rgba(167,139,250,0.4)" strokeDasharray="4 4" label={{ value: "Forecast start", fill: "#a78bfa", fontSize: 10 }} />
              <Line type="monotone" dataKey="actual"    name="Actual"      stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: "#06b6d4" }}   connectNulls={false} />
              <Line type="monotone" dataKey="predicted" name="AI Forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: "#a78bfa" }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
          {/* Forecast summary below chart */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
            {[
              { label: "Q1 Peak",   value: "$109.1M", color: "#a78bfa" },
              { label: "Avg Growth", value: "+4.2%",   color: "#22c55e" },
              { label: "Accuracy",  value: "91.3%",   color: "#06b6d4" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Supply Risk + Recommendations ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Supply Risk */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Supply Risk Analysis</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Regional disruption risk index (0–100)</p>
            </div>
            <AlertTriangle size={15} style={{ color: "#f59e0b" }} />
          </div>
          <div className="space-y-3.5">
            {supplyRisks.map((r, i) => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm font-medium text-slate-300">{r.region}</span>
                    <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{r.factor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${r.color}15`, color: r.color }}>{r.impact}</span>
                    <span className="text-sm font-bold w-6 text-right" style={{ color: r.color }}>{r.risk}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.risk}%` }}
                    transition={{ duration: 0.8, delay: 0.65 + i * 0.08 }}
                    className="h-full rounded-full" style={{ background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
            <Brain size={14} style={{ color: "#a78bfa" }} />
            <h3 className="text-sm font-semibold text-slate-200">AI-Generated Recommendations</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>
              {recommendations.length} signals
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
            {recommendations.map((r) => {
              const c = recColors[r.type];
              return (
                <div key={r.id} className="px-5 py-3.5 cursor-pointer hover:bg-slate-800/20 transition-colors"
                  onClick={() => setExpandedRec(expandedRec === r.id ? null : r.id)}>
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: c.bg, color: c.text }}>{c.label}</span>
                    <span className="text-sm font-medium text-slate-200 flex-1 min-w-0 truncate">{r.title}</span>
                    <span className="text-xs font-bold flex-shrink-0 ml-1" style={{ color: r.type === "sell" || r.type === "hedge" ? "#f59e0b" : "#22c55e" }}>{r.impact}</span>
                    {expandedRec === r.id
                      ? <ChevronUp size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                      : <ChevronDown size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
                  </div>
                  <AnimatePresence>
                    {expandedRec === r.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="text-xs mt-2 mb-2.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{r.detail}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                            <div className="h-full rounded-full" style={{ width: `${r.confidence}%`, background: "#a78bfa" }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>Confidence: {r.confidence}%</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
