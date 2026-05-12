"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { TrendingUp, Target, Users, DollarSign, Eye, MousePointerClick, ArrowUpRight } from "lucide-react";

const roiData = [
  { month: "Jan", spend: 24000, revenue: 82000, roi: 242 },
  { month: "Feb", spend: 28000, revenue: 91000, roi: 225 },
  { month: "Mar", spend: 32000, revenue: 112000, roi: 250 },
  { month: "Apr", spend: 29000, revenue: 98000, roi: 238 },
  { month: "May", spend: 35000, revenue: 128000, roi: 266 },
  { month: "Jun", spend: 38000, revenue: 149000, roi: 292 },
  { month: "Jul", spend: 41000, revenue: 161000, roi: 293 },
  { month: "Aug", spend: 44000, revenue: 175000, roi: 298 },
  { month: "Sep", spend: 42000, revenue: 168000, roi: 300 },
  { month: "Oct", spend: 46000, revenue: 192000, roi: 317 },
  { month: "Nov", spend: 48000, revenue: 206000, roi: 329 },
  { month: "Dec", spend: 52000, revenue: 230000, roi: 342 },
];

const conversionData = [
  { stage: "Impressions", value: 480000 },
  { stage: "Reach", value: 142000 },
  { stage: "Clicks", value: 18400 },
  { stage: "Leads", value: 3100 },
  { stage: "MQLs", value: 842 },
  { stage: "Converted", value: 218 },
];

const audienceData = [
  { subject: "Engagement", A: 88, fullMark: 100 },
  { subject: "Reach", A: 76, fullMark: 100 },
  { subject: "Retention", A: 82, fullMark: 100 },
  { subject: "Conversion", A: 71, fullMark: 100 },
  { subject: "Loyalty", A: 84, fullMark: 100 },
  { subject: "Advocacy", A: 68, fullMark: 100 },
];

const engagementByDay = [
  { day: "Mon", emails: 2400, sms: 1200, social: 800 },
  { day: "Tue", emails: 2800, sms: 1400, social: 1100 },
  { day: "Wed", emails: 3200, sms: 1600, social: 900 },
  { day: "Thu", emails: 2900, sms: 1800, social: 1400 },
  { day: "Fri", emails: 3400, sms: 2100, social: 1800 },
  { day: "Sat", emails: 1800, sms: 900, social: 2200 },
  { day: "Sun", emails: 1200, sms: 600, social: 2600 },
];

const topCampaigns = [
  { name: "Crude Oil Bulletin", channel: "Email", roi: "418%", revenue: "$142K", leads: 284 },
  { name: "Price Alert SMS", channel: "SMS", roi: "381%", revenue: "$98K", leads: 196 },
  { name: "LinkedIn Reach", channel: "Social", roi: "294%", revenue: "$64K", leads: 128 },
  { name: "Q4 Refinery Promo", channel: "Email", roi: "351%", revenue: "$119K", leads: 238 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}>
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold text-white">{typeof p.value === "number" && p.value > 999 ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MarketingAnalytics() {
  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Campaign ROI", value: "342%", change: "+18.6%", icon: TrendingUp, color: "#22c55e" },
          { label: "Total Impressions", value: "480K", change: "+24.1%", icon: Eye, color: "#06b6d4" },
          { label: "Conversion Rate", value: "7.03%", change: "+1.2%", icon: MousePointerClick, color: "#a78bfa" },
          { label: "Revenue Attributed", value: "$2.06M", change: "+31.4%", icon: DollarSign, color: "#d4a017" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full opacity-10 blur-xl" style={{ background: k.color }} />
            <k.icon size={15} style={{ color: k.color }} className="mb-2" />
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold" style={{ color: "#22c55e" }}>
              <ArrowUpRight size={11} />{k.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROI over time + Audience Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">ROI Tracking</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Monthly marketing spend vs revenue attributed</p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={roiData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="revenueAttr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenueAttr)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="spend" name="Spend" stroke="#ef4444" strokeWidth={1.5} fill="url(#spendGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Audience Insights</h3>
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Engagement health radar</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={audienceData}>
              <PolarGrid stroke="rgba(30,58,95,0.4)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#475569", fontSize: 9 }} />
              <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {audienceData.map((d) => (
              <div key={d.subject} className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>{d.subject}</span>
                <span className="font-semibold" style={{ color: d.A >= 80 ? "#22c55e" : d.A >= 70 ? "#f59e0b" : "#ef4444" }}>{d.A}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement by day + Top Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Engagement Reports</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Channel activity by day of week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementByDay} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30,58,95,0.2)" }} />
              <Bar dataKey="emails" name="Email" fill="#06b6d4" radius={[2, 2, 0, 0]} maxBarSize={16} />
              <Bar dataKey="sms" name="SMS" fill="#d4a017" radius={[2, 2, 0, 0]} maxBarSize={16} />
              <Bar dataKey="social" name="Social" fill="#a78bfa" radius={[2, 2, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Campaigns */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
            <h3 className="text-sm font-semibold text-slate-200">Top Performing Campaigns</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
            {topCampaigns.map((c, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                <span className="text-xs font-bold w-5 text-center" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{c.channel} · {c.leads} leads</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: "#22c55e" }}>{c.roi} ROI</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion tracking */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-xl p-5"
        style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">Conversion Tracking</h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Full-funnel breakdown from impression to customer</p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {conversionData.map((c, i) => {
            const pct = ((c.value / conversionData[0].value) * 100).toFixed(1);
            const colors = ["#1e3a5f", "#0ea5e9", "#06b6d4", "#a78bfa", "#d4a017", "#22c55e"];
            return (
              <div key={c.stage} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(30,58,95,0.3)" strokeWidth="5" />
                    <motion.circle cx="32" cy="32" r="26" fill="none" stroke={colors[i]} strokeWidth="5"
                      strokeDasharray={`${(Number(pct) / 100) * 163.4} 163.4`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 163.4" }}
                      animate={{ strokeDasharray: `${(Number(pct) / 100) * 163.4} 163.4` }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{pct}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">{c.value.toLocaleString()}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.stage}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
