"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Brain, TrendingUp, Phone, Mail, Calendar,
  ChevronRight, Plus, Filter, Target, Clock, ArrowRight,
  Zap, AlertCircle, CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, FunnelChart, Funnel, LabelList,
} from "recharts";

const leads = [
  { id: 1, name: "Mohammed Al-Rashid", company: "Qatar Energy", email: "m.rashid@qe.qa", phone: "+974 44 56 7890", source: "Website", stage: "Qualified", score: 94, value: "$2.8M", assigned: "J. Okafor", days: 3, hot: true },
  { id: 2, name: "Fatima Zahra", company: "Sonatrach", email: "f.zahra@sonatrach.dz", phone: "+213 21 54 60 00", source: "Referral", stage: "Proposal", score: 87, value: "$1.5M", assigned: "A. Hassan", days: 7, hot: true },
  { id: 3, name: "Emmanuel Ofori", company: "Ghana NOC", email: "e.ofori@gnoc.gov.gh", phone: "+233 30 277 4000", source: "LinkedIn", stage: "New", score: 71, value: "$0.9M", assigned: "S. Mensah", days: 1, hot: false },
  { id: 4, name: "Olumide Bankole", company: "Oando PLC", email: "o.bankole@oando.com", phone: "+234 1 270 7000", source: "Cold Outreach", stage: "Contacted", score: 62, value: "$0.6M", assigned: "K. Asante", days: 12, hot: false },
  { id: 5, name: "Ana Lima", company: "Petrobras Africa", email: "a.lima@petrobras.com", phone: "+55 21 3224 4477", source: "Conference", stage: "Qualified", score: 88, value: "$3.4M", assigned: "M. Adeyemi", days: 5, hot: true },
  { id: 6, name: "Hassan Diallo", company: "PETROCI", email: "h.diallo@petroci.ci", phone: "+225 27 20 25 90 00", source: "Website", stage: "New", score: 55, value: "$0.4M", assigned: "J. Okafor", days: 0, hot: false },
];

const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed"];
const stageColors: Record<string, string> = {
  New: "#94a3b8",
  Contacted: "#06b6d4",
  Qualified: "#a78bfa",
  Proposal: "#f59e0b",
  Negotiation: "#f472b6",
  Closed: "#22c55e",
};

const funnelData = [
  { name: "Inquiries", value: 1240, fill: "#1e3a5f" },
  { name: "MQLs", value: 486, fill: "#0ea5e9" },
  { name: "SQLs", value: 214, fill: "#06b6d4" },
  { name: "Proposals", value: 87, fill: "#d4a017" },
  { name: "Closed", value: 38, fill: "#22c55e" },
];

const acquisitionTrend = [
  { week: "W1", leads: 48 }, { week: "W2", leads: 61 }, { week: "W3", leads: 54 },
  { week: "W4", leads: 72 }, { week: "W5", leads: 65 }, { week: "W6", leads: 84 },
  { week: "W7", leads: 78 }, { week: "W8", leads: 96 },
];

function AIScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444";
  const label = score >= 85 ? "Hot" : score >= 65 ? "Warm" : "Cold";
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(30,58,95,0.4)" strokeWidth="3" />
          <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 75.4} 75.4`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{score}</span>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function InquiryForm({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
          <div>
            <h3 className="text-sm font-bold text-slate-100">New Lead Inquiry</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Capture a new prospect</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">✕</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: "Full Name", placeholder: "Mohammed Al-Rashid", col: 1 },
            { label: "Company", placeholder: "Company name", col: 1 },
            { label: "Email Address", placeholder: "email@company.com", col: 1 },
            { label: "Phone Number", placeholder: "+1 (555) 000-0000", col: 1 },
            { label: "Deal Value (USD)", placeholder: "$0.00", col: 1 },
            { label: "Lead Source", placeholder: "Select source", col: 1 },
          ].map((f, i) => (
            <div key={i} className={f.col === 2 ? "col-span-2" : ""}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{f.label}</label>
              <input
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "#e2e8f0" }}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Notes</label>
            <textarea rows={3} placeholder="Initial inquiry details..."
              className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
              style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "#e2e8f0" }}
            />
          </div>
        </div>
        <div className="px-6 py-4 flex gap-2 justify-end" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs" style={{ background: "rgba(30,58,95,0.3)", color: "var(--text-secondary)" }}>Cancel</button>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#000" }}>
            Save Lead + AI Score
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadManagement() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? leads : leads.filter((l) => l.stage === filter);

  return (
    <div className="space-y-4">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: "486", icon: UserPlus, color: "#a78bfa" },
          { label: "Hot Leads", value: "94", icon: Zap, color: "#ef4444" },
          { label: "Avg Score", value: "76.2", icon: Brain, color: "#06b6d4" },
          { label: "This Week", value: "+38", icon: TrendingUp, color: "#22c55e" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <s.icon size={16} style={{ color: s.color }} className="mb-2" />
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sales Funnel + Acquisition Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Sales Funnel</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Lead progression tracking</p>
          <div className="space-y-2">
            {funnelData.map((f, i) => {
              const pct = (f.value / funnelData[0].value) * 100;
              return (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{f.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{f.value.toLocaleString()}</span>
                      {i > 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>({((f.value / funnelData[i - 1].value) * 100).toFixed(0)}%)</span>}
                    </div>
                  </div>
                  <div className="h-6 rounded" style={{ background: "rgba(30,58,95,0.3)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                      className="h-full rounded flex items-center justify-end pr-2"
                      style={{ background: f.fill, minWidth: "2rem" }}
                    >
                      <span className="text-xs font-medium text-white/70">{pct.toFixed(0)}%</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Overall conversion: <span className="font-semibold" style={{ color: "#22c55e" }}>
                {((38 / 1240) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </motion.div>

        {/* Acquisition Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Lead Acquisition Trend</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Weekly new leads</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={acquisitionTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="leads" name="New Leads" stroke="#a78bfa" strokeWidth={2} fill="url(#leadGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Lead Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="px-5 py-4 flex flex-wrap gap-3 items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
          <div className="flex gap-2 flex-wrap">
            {["All", ...stages].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{ background: filter === s ? `${stageColors[s] || "#06b6d4"}20` : "rgba(13,22,41,0.5)", color: filter === s ? (stageColors[s] || "#06b6d4") : "var(--text-muted)", border: `1px solid ${filter === s ? stageColors[s] || "#06b6d4" : "rgba(30,58,95,0.4)"}40` }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff" }}>
            <Plus size={13} /> New Lead
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                {["Lead", "Company", "Source", "Stage", "AI Score", "Deal Value", "Assigned", "Last Contact", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {filtered.map((l, i) => (
                <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {l.hot && <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />}
                      <span className="font-medium text-slate-200 whitespace-nowrap">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{l.company}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(30,58,95,0.4)", color: "var(--text-secondary)" }}>{l.source}</span></td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${stageColors[l.stage]}20`, color: stageColors[l.stage] }}>{l.stage}</span>
                  </td>
                  <td className="px-4 py-3"><AIScoreBadge score={l.score} /></td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#22c55e" }}>{l.value}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{l.assigned}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: l.days === 0 ? "#22c55e" : l.days > 10 ? "#ef4444" : "var(--text-muted)" }}>
                      {l.days === 0 ? "Today" : `${l.days}d ago`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Mail size={12} style={{ color: "#06b6d4" }} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Phone size={12} style={{ color: "#94a3b8" }} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Calendar size={12} style={{ color: "#a78bfa" }} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && <InquiryForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
