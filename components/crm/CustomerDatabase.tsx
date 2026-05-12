"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, MoreVertical, Mail, Phone,
  MapPin, Building2, Star, ChevronDown, X, Eye,
  Edit2, Trash2, Tag,
} from "lucide-react";

const segments = ["All", "Enterprise", "Mid-Market", "SMB", "VIP", "At Risk"];

const customers = [
  { id: 1, name: "Aramco Trading Ltd", contact: "Khalid Al-Falih", email: "k.falih@aramco.com", phone: "+966 11 872 0000", location: "Riyadh, SA", segment: "Enterprise", value: "$4.2M", status: "Active", score: 98, tags: ["Oil", "LNG", "Refinery"], avatar: "AT", color: "#06b6d4" },
  { id: 2, name: "Gulf Petroleum Corp", contact: "Ahmed Hassan", email: "a.hassan@gulfpetro.ae", phone: "+971 4 282 5000", location: "Dubai, UAE", segment: "Enterprise", value: "$1.8M", status: "Active", score: 87, tags: ["Crude", "Export"], avatar: "GP", color: "#d4a017" },
  { id: 3, name: "TotalEnergies ME", contact: "Sophie Mercier", email: "s.mercier@totalenergies.com", phone: "+33 1 47 44 45 46", location: "Paris, FR", segment: "Enterprise", value: "$3.1M", status: "Active", score: 92, tags: ["LNG", "Downstream"], avatar: "TE", color: "#a78bfa" },
  { id: 4, name: "Shell Intl Trading", contact: "Mark Adeyemi", email: "m.adeyemi@shell.com", phone: "+44 20 7934 1234", location: "London, UK", segment: "VIP", value: "$8.9M", status: "Active", score: 99, tags: ["Crude", "Refinery", "LNG"], avatar: "SI", color: "#22c55e" },
  { id: 5, name: "BP West Africa", contact: "Kwame Asante", email: "k.asante@bp.com", phone: "+233 30 274 5000", location: "Accra, GH", segment: "Mid-Market", value: "$2.4M", status: "At Risk", score: 54, tags: ["Export", "Crude"], avatar: "BP", color: "#f59e0b" },
  { id: 6, name: "Nigerian NNPC Ltd", contact: "Mele Kyari", email: "m.kyari@nnpc.gov.ng", phone: "+234 9 461 8000", location: "Abuja, NG", segment: "Enterprise", value: "$5.6M", status: "Active", score: 91, tags: ["Crude", "Refinery"], avatar: "NN", color: "#f472b6" },
  { id: 7, name: "Chevron West Africa", contact: "Patricia Yarger", email: "p.yarger@chevron.com", phone: "+1 925 842 1000", location: "Lagos, NG", segment: "VIP", value: "$7.2M", status: "Active", score: 96, tags: ["Oil", "Gas", "LNG"], avatar: "CW", color: "#34d399" },
  { id: 8, name: "Sahara Group", contact: "Temitope Shonubi", email: "t.shonubi@sahara-group.com", phone: "+234 1 461 1000", location: "Lagos, NG", segment: "SMB", value: "$0.9M", status: "Inactive", score: 42, tags: ["Downstream"], avatar: "SG", color: "#94a3b8" },
];

const statusColors: Record<string, React.CSSProperties> = {
  Active: { background: "rgba(34,197,94,0.1)", color: "#22c55e" },
  "At Risk": { background: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  Inactive: { background: "rgba(148,163,184,0.1)", color: "#94a3b8" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function ContactProfileModal({ customer, onClose }: { customer: typeof customers[0]; onClose: () => void }) {
  const commHistory = [
    { type: "email", text: "Sent Q4 renewal proposal", date: "2 days ago", icon: Mail },
    { type: "call", text: "Discovery call — 45 min", date: "1 week ago", icon: Phone },
    { type: "email", text: "Followed up on contract terms", date: "2 weeks ago", icon: Mail },
    { type: "meeting", text: "Quarterly business review", date: "1 month ago", icon: Building2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-black"
              style={{ background: customer.color }}>
              {customer.avatar}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{customer.name}</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{customer.contact} · {customer.location}</p>
              <div className="flex gap-2 mt-1.5">
                {customer.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700/50"><X size={16} className="text-slate-400" /></button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Contact Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Contact Info</p>
            <div className="space-y-2.5">
              {[
                { icon: Mail, label: customer.email },
                { icon: Phone, label: customer.phone },
                { icon: MapPin, label: customer.location },
                { icon: Building2, label: customer.segment + " · " + customer.segment },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm">
                  <Icon size={14} style={{ color: "#06b6d4" }} />
                  <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: "var(--text-muted)" }}>Deal Value</p>
            <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{customer.value}</p>

            <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: "var(--text-muted)" }}>Health Score</p>
            <ScoreBar score={customer.score} />
          </div>

          {/* Communication History */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Communication History</p>
            <div className="space-y-2">
              {commHistory.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: "rgba(13,22,41,0.6)", border: "1px solid rgba(30,58,95,0.3)" }}>
                  <c.icon size={13} style={{ color: "#06b6d4", marginTop: 2 }} />
                  <div>
                    <p className="text-xs text-slate-300">{c.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex gap-2" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
            <Mail size={12} /> Send Email
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
            <Phone size={12} /> Log Call
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ml-auto" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CustomerDatabase() {
  const [search, setSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = customers.filter((c) => {
    const matchSeg = activeSegment === "All" || c.segment === activeSegment || c.status === activeSegment;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    return matchSeg && matchSearch;
  });

  const selectedCustomer = customers.find((c) => c.id === selected);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {segments.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSegment(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeSegment === s ? "rgba(6,182,212,0.15)" : "rgba(13,22,41,0.8)",
                color: activeSegment === s ? "#06b6d4" : "var(--text-muted)",
                border: activeSegment === s ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(30,58,95,0.4)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "var(--text-muted)" }}>
            <Search size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="bg-transparent outline-none w-36 text-slate-300 placeholder:text-slate-500"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
            <Plus size={13} /> Add Customer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                {["Company", "Contact", "Segment", "Deal Value", "Status", "Health Score", "Tags", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-800/20 transition-colors cursor-pointer"
                  onClick={() => setSelected(c.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-black flex-shrink-0" style={{ background: c.color }}>
                        {c.avatar}
                      </div>
                      <span className="font-medium text-slate-200 whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{c.contact}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(6,182,212,0.08)", color: "#06b6d4" }}>{c.segment}</span>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#22c55e" }}>{c.value}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full" style={statusColors[c.status]}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 w-32"><ScoreBar score={c.score} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.slice(0, 2).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{t}</span>
                      ))}
                      {c.tags.length > 2 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>+{c.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 rounded hover:bg-slate-700/50" onClick={() => setSelected(c.id)}><Eye size={13} style={{ color: "#06b6d4" }} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Edit2 size={13} style={{ color: "#94a3b8" }} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Trash2 size={13} style={{ color: "#f87171" }} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Showing {filtered.length} of {customers.length} customers</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className="w-7 h-7 rounded text-xs font-medium" style={{ background: p === 1 ? "rgba(6,182,212,0.15)" : "rgba(13,22,41,0.5)", color: p === 1 ? "#06b6d4" : "var(--text-muted)", border: p === 1 ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(30,58,95,0.3)" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && selectedCustomer && (
          <ContactProfileModal customer={selectedCustomer} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
