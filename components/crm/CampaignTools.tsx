"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MessageSquare, Share2, Workflow, Image as ImageIcon,
  Plus, Play, Pause, Eye, MoreVertical, Users, Clock,
  CheckCircle2, Circle, ArrowRight, Zap, Calendar, BarChart3,
  Send, RefreshCw, X as XIcon, Globe,
} from "lucide-react";

const tabs = [
  { id: "email", label: "Email", icon: Mail, color: "#06b6d4" },
  { id: "sms", label: "SMS", icon: MessageSquare, color: "#d4a017" },
  { id: "social", label: "Social Media", icon: Share2, color: "#a78bfa" },
  { id: "workflows", label: "Workflows", icon: Workflow, color: "#22c55e" },
  { id: "banners", label: "Banners", icon: ImageIcon, color: "#f472b6" },
];

const emailCampaigns = [
  { id: 1, name: "Q4 Refinery Partnership Outreach", status: "Active", sent: 4240, opened: 1781, clicked: 487, converted: 62, segment: "Enterprise", date: "Nov 1" },
  { id: 2, name: "LNG Export Opportunity Newsletter", status: "Active", sent: 8120, opened: 2844, clicked: 891, converted: 124, segment: "All Clients", date: "Oct 28" },
  { id: 3, name: "Crude Oil Price Alert Bulletin", status: "Completed", sent: 12400, opened: 5208, clicked: 1612, converted: 218, segment: "VIP", date: "Oct 15" },
  { id: 4, name: "New Platform Features Announcement", status: "Draft", sent: 0, opened: 0, clicked: 0, converted: 0, segment: "All", date: "—" },
  { id: 5, name: "Year-End Contract Renewal Campaign", status: "Scheduled", sent: 0, opened: 0, clicked: 0, converted: 0, segment: "Enterprise", date: "Dec 1" },
];

const smsCampaigns = [
  { id: 1, name: "Price Alert — Brent > $100", status: "Active", sent: 3200, delivered: 3136, opened: 2811, replied: 384 },
  { id: 2, name: "Deal Reminder — 48hr", status: "Active", sent: 640, delivered: 628, opened: 591, replied: 211 },
  { id: 3, name: "Event Invite — Oil Summit 2025", status: "Completed", sent: 5400, delivered: 5292, opened: 4234, replied: 620 },
];

const socialPosts = [
  { id: 1, platform: "LinkedIn", content: "Brent crude prices surge 4.2% as OPEC announces supply cuts for Q1...", status: "Published", likes: 284, shares: 61, date: "Today, 10:00 AM", icon: Share2, color: "#0a66c2" },
  { id: 2, platform: "Twitter/X", content: "Oil markets react to geopolitical tensions in the Gulf region. Our AI forecast...", status: "Scheduled", likes: 0, shares: 0, date: "Today, 3:00 PM", icon: XIcon, color: "#1d9bf0" },
  { id: 3, platform: "LinkedIn", content: "OilIntel platform update: New AI-powered market prediction engine with 94% accuracy...", status: "Draft", likes: 0, shares: 0, date: "Tomorrow, 9:00 AM", icon: Share2, color: "#0a66c2" },
  { id: 4, platform: "Facebook", content: "Exciting news for our partners in West Africa! New export routes...", status: "Published", likes: 142, shares: 28, date: "Yesterday, 2:30 PM", icon: Globe, color: "#1877f2" },
];

const workflows = [
  {
    id: 1, name: "New Lead Welcome Sequence", status: "Active", leads: 186, steps: [
      { label: "Lead captured", done: true },
      { label: "Send welcome email", done: true },
      { label: "Wait 2 days", done: true },
      { label: "Send follow-up SMS", done: false },
      { label: "Assign to sales rep", done: false },
    ],
  },
  {
    id: 2, name: "At-Risk Customer Re-engagement", status: "Active", leads: 43, steps: [
      { label: "Trigger: 60 days inactive", done: true },
      { label: "Send re-engagement email", done: true },
      { label: "Wait 5 days", done: false },
      { label: "SMS follow-up", done: false },
      { label: "Escalate to account manager", done: false },
    ],
  },
  {
    id: 3, name: "Post-Deal Onboarding Flow", status: "Paused", leads: 28, steps: [
      { label: "Deal marked Closed Won", done: true },
      { label: "Send onboarding kit", done: true },
      { label: "Schedule kickoff call", done: false },
      { label: "30-day check-in email", done: false },
    ],
  },
];

const banners = [
  { id: 1, name: "Q4 Crude Oil Sale Banner", size: "1200×628", status: "Active", impressions: 48200, clicks: 1840 },
  { id: 2, name: "LNG Export Promo — Leaderboard", size: "728×90", status: "Active", impressions: 31400, clicks: 924 },
  { id: 3, name: "New Platform Launch — Square", size: "300×250", status: "Draft", impressions: 0, clicks: 0 },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
    Completed: { bg: "rgba(6,182,212,0.1)", color: "#06b6d4" },
    Draft: { bg: "rgba(148,163,184,0.1)", color: "#94a3b8" },
    Scheduled: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    Paused: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
    Published: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  };
  const s = map[status] || map.Draft;
  return <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: s.bg, color: s.color }}>{status}</span>;
};

function EmailTab() {
  const activeCampaigns = emailCampaigns.filter(c => c.status === "Active");
  const totalSent       = emailCampaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpened     = emailCampaigns.reduce((s, c) => s + c.opened, 0);
  const totalConverted  = emailCampaigns.reduce((s, c) => s + c.converted, 0);
  const avgOpenRate     = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Campaigns", value: activeCampaigns.length, color: "#22c55e" },
          { label: "Total Sent",       value: totalSent.toLocaleString(), color: "#06b6d4" },
          { label: "Avg Open Rate",    value: `${avgOpenRate}%`,          color: "#d4a017" },
          { label: "Total Converted",  value: totalConverted,             color: "#a78bfa" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl p-3.5"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{emailCampaigns.length} campaigns</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#000" }}>
          <Plus size={13} /> New Campaign
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                {["Campaign Name", "Status", "Sent", "Open Rate", "Click Rate", "Conversions", "Segment", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {emailCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200 max-w-xs truncate">{c.name}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-white">{c.sent.toLocaleString()}</td>
                  <td className="px-4 py-3" style={{ color: "#22c55e" }}>{c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(1) + "%" : "—"}</td>
                  <td className="px-4 py-3" style={{ color: "#06b6d4" }}>{c.sent > 0 ? ((c.clicked / c.sent) * 100).toFixed(1) + "%" : "—"}</td>
                  <td className="px-4 py-3 font-semibold text-white">{c.converted > 0 ? c.converted : "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{c.segment}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{c.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><Eye size={12} style={{ color: "#06b6d4" }} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-700/50"><BarChart3 size={12} style={{ color: "#94a3b8" }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SMSTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{smsCampaigns.length} campaigns</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #d4a017, #fbbf24)", color: "#000" }}>
          <Plus size={13} /> New SMS Campaign
        </button>
      </div>
      <div className="grid gap-4">
        {smsCampaigns.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(c.status)}
                  <h4 className="text-sm font-semibold text-slate-200">{c.name}</h4>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-slate-700/50"><Play size={12} style={{ color: "#22c55e" }} /></button>
                <button className="p-1.5 rounded hover:bg-slate-700/50"><BarChart3 size={12} style={{ color: "#06b6d4" }} /></button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Sent", value: c.sent.toLocaleString(), color: "text-white" },
                { label: "Delivered", value: `${((c.delivered / c.sent) * 100).toFixed(0)}%`, color: "text-cyan-400" },
                { label: "Opened", value: `${((c.opened / c.sent) * 100).toFixed(0)}%`, color: "text-green-400" },
                { label: "Replied", value: `${((c.replied / c.sent) * 100).toFixed(0)}%`, color: "text-yellow-400" },
              ].map((m) => (
                <div key={m.label}>
                  <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SocialTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>4 posts scheduled</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff" }}>
          <Plus size={13} /> Schedule Post
        </button>
      </div>
      <div className="grid gap-4">
        {socialPosts.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 flex items-start gap-4"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}20` }}>
              <p.icon size={16} style={{ color: p.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {statusBadge(p.status)}
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.date}</span>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2">{p.content}</p>
              {p.likes > 0 && (
                <div className="flex gap-3 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>👍 {p.likes}</span>
                  <span>🔁 {p.shares}</span>
                </div>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-1.5 rounded hover:bg-slate-700/50"><Eye size={12} style={{ color: "#06b6d4" }} /></button>
              <button className="p-1.5 rounded hover:bg-slate-700/50"><Send size={12} style={{ color: "#94a3b8" }} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WorkflowsTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{workflows.length} automated workflows</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#000" }}>
          <Plus size={13} /> New Workflow
        </button>
      </div>
      <div className="grid gap-4">
        {workflows.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(w.status)}
                  <h4 className="text-sm font-semibold text-slate-200">{w.name}</h4>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{w.leads} leads enrolled</p>
              </div>
              <div className="flex gap-1">
                {w.status === "Active" ? (
                  <button className="p-1.5 rounded hover:bg-slate-700/50"><Pause size={12} style={{ color: "#f59e0b" }} /></button>
                ) : (
                  <button className="p-1.5 rounded hover:bg-slate-700/50"><Play size={12} style={{ color: "#22c55e" }} /></button>
                )}
                <button className="p-1.5 rounded hover:bg-slate-700/50"><Eye size={12} style={{ color: "#06b6d4" }} /></button>
              </div>
            </div>
            {/* Steps */}
            <div className="flex items-center gap-1 flex-wrap">
              {w.steps.map((s, si) => (
                <div key={si} className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs" style={{
                    background: s.done ? "rgba(34,197,94,0.1)" : "rgba(30,58,95,0.3)",
                    color: s.done ? "#22c55e" : "var(--text-muted)",
                    border: `1px solid ${s.done ? "rgba(34,197,94,0.2)" : "rgba(30,58,95,0.3)"}`,
                  }}>
                    {s.done ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                    <span>{s.label}</span>
                  </div>
                  {si < w.steps.length - 1 && <ArrowRight size={10} style={{ color: "var(--text-muted)" }} />}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BannersTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{banners.length} banners</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)", color: "#fff" }}>
          <Plus size={13} /> Upload Banner
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {banners.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            {/* Placeholder Banner */}
            <div className="h-32 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(212,160,23,0.1))" }}>
              <ImageIcon size={28} style={{ color: "rgba(6,182,212,0.4)" }} />
              <div className="absolute top-2 right-2">{statusBadge(b.status)}</div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-200 mb-1">{b.name}</p>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{b.size}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-bold text-white">{b.impressions.toLocaleString()}</p>
                  <p style={{ color: "var(--text-muted)" }}>Impressions</p>
                </div>
                <div>
                  <p className="font-bold" style={{ color: "#06b6d4" }}>{b.clicks.toLocaleString()}</p>
                  <p style={{ color: "var(--text-muted)" }}>Clicks</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CampaignTools() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === t.id ? `${t.color}15` : "rgba(13,22,41,0.8)",
              color: activeTab === t.id ? t.color : "var(--text-muted)",
              border: activeTab === t.id ? `1px solid ${t.color}40` : "1px solid rgba(30,58,95,0.4)",
            }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === "email" && <EmailTab />}
          {activeTab === "sms" && <SMSTab />}
          {activeTab === "social" && <SocialTab />}
          {activeTab === "workflows" && <WorkflowsTab />}
          {activeTab === "banners" && <BannersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
