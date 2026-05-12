"use client";

import { motion } from "framer-motion";
import {
  Users, Target, DollarSign, TrendingUp, Mail, MessageSquare,
  Share2, ArrowUpRight, ArrowDownRight, UserPlus, Handshake,
  Activity, CheckCircle2, Clock, UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";

const kpis = [
  { label: "Total Customers", value: "2,847", change: 3.2, color: "#06b6d4", icon: Users },
  { label: "Active Leads", value: "486", change: 11.4, color: "#a78bfa", icon: UserPlus },
  { label: "Revenue (MTD)", value: "$6.4M", change: 8.7, color: "#22c55e", icon: DollarSign },
  { label: "Conversion Rate", value: "27.1%", change: -1.4, color: "#f59e0b", icon: Target },
  { label: "Campaign ROI", value: "342%", change: 18.6, color: "#d4a017", icon: TrendingUp },
  { label: "Deals Closed", value: "138", change: 5.9, color: "#f472b6", icon: Handshake },
];

const acquisitionData = [
  { month: "Jan", organic: 142, paid: 98, referral: 64 },
  { month: "Feb", organic: 128, paid: 112, referral: 71 },
  { month: "Mar", organic: 165, paid: 134, referral: 88 },
  { month: "Apr", organic: 178, paid: 121, referral: 79 },
  { month: "May", organic: 192, paid: 145, referral: 95 },
  { month: "Jun", organic: 210, paid: 168, referral: 102 },
];

const engagementData = [
  { name: "Email", value: 38, color: "#06b6d4" },
  { name: "SMS", value: 24, color: "#d4a017" },
  { name: "Social", value: 22, color: "#a78bfa" },
  { name: "Direct", value: 16, color: "#22c55e" },
];

const pipeline = [
  { stage: "Inquiries",    count: 1240, value: "$—",     color: "#475569", pct: 100 },
  { stage: "MQLs",         count: 486,  value: "$12.4M", color: "#06b6d4", pct: 39  },
  { stage: "SQLs",         count: 214,  value: "$9.8M",  color: "#a78bfa", pct: 17  },
  { stage: "Proposals",    count: 87,   value: "$6.2M",  color: "#d4a017", pct: 7   },
  { stage: "Negotiations", count: 42,   value: "$4.8M",  color: "#f59e0b", pct: 3.4 },
  { stage: "Closed",       count: 38,   value: "$3.9M",  color: "#22c55e", pct: 3.1 },
];

const activityFeed = [
  { icon: UserCheck,    color: "#22c55e", text: "Shell Intl Trading deal closed — $8.9M",                 time: "1h ago"  },
  { icon: Mail,         color: "#06b6d4", text: "LNG Export Newsletter sent to 8,120 recipients",          time: "3h ago"  },
  { icon: UserPlus,     color: "#a78bfa", text: "New lead: Gulf Petrochemicals Ltd via LinkedIn",           time: "5h ago"  },
  { icon: TrendingUp,   color: "#d4a017", text: "Aramco deal moved to Negotiation stage",                   time: "8h ago"  },
  { icon: Activity,     color: "#f472b6", text: "Campaign 'Q4 Refinery Outreach' hit 42% open rate",       time: "1d ago"  },
  { icon: CheckCircle2, color: "#22c55e", text: "NNPC Ltd contract renewed — $5.6M for Q1 2025",            time: "1d ago"  },
];

const recentDeals = [
  { company: "Aramco Trading Ltd", value: "$4.2M", stage: "Closed Won", rep: "J. Okafor", time: "2h ago", up: true },
  { company: "Gulf Petroleum Corp", value: "$1.8M", stage: "Negotiation", rep: "A. Hassan", time: "5h ago", up: true },
  { company: "TotalEnergies ME", value: "$3.1M", stage: "Proposal", rep: "S. Mensah", time: "1d ago", up: null },
  { company: "Shell Intl Trading", value: "$8.9M", stage: "Closed Won", rep: "M. Adeyemi", time: "1d ago", up: true },
  { company: "BP West Africa", value: "$2.4M", stage: "Closed Lost", rep: "K. Asante", time: "2d ago", up: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}>
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function CRMOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10 blur-xl" style={{ background: k.color }} />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${k.color}20`, border: `1px solid ${k.color}30` }}>
              <k.icon size={15} style={{ color: k.color }} />
            </div>
            <p className="text-lg font-bold text-white">{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {k.change >= 0 ? <ArrowUpRight size={11} className="text-green-400" /> : <ArrowDownRight size={11} className="text-red-400" />}
              <span className="text-xs font-semibold" style={{ color: k.change >= 0 ? "#22c55e" : "#ef4444" }}>
                {Math.abs(k.change)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer Acquisition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Customer Acquisition</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Monthly new customers by channel</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={acquisitionData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.3)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30,58,95,0.2)" }} />
              <Bar dataKey="organic" name="Organic" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="paid" name="Paid" stackId="a" fill="#d4a017" radius={[0, 0, 0, 0]} />
              <Bar dataKey="referral" name="Referral" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Channel Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl p-5"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Channel Engagement</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Share by marketing channel</p>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={engagementData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                  {engagementData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} contentStyle={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {engagementData.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{e.name}</span>
                <span className="text-xs font-semibold text-white ml-auto">{e.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Deals + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
            <h3 className="text-sm font-semibold text-slate-200">Recent Deals</h3>
            <button className="text-xs" style={{ color: "#06b6d4" }}>View pipeline →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                  {["Company", "Deal Value", "Stage", "Rep", "Time"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
                {recentDeals.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-200">{d.company}</td>
                    <td className="px-5 py-3 font-bold" style={{ color: "#22c55e" }}>{d.value}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{
                        background: d.stage === "Closed Won" ? "rgba(34,197,94,0.1)" : d.stage === "Closed Lost" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        color: d.stage === "Closed Won" ? "#22c55e" : d.stage === "Closed Lost" ? "#ef4444" : "#f59e0b",
                      }}>{d.stage}</span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>{d.rep}</td>
                    <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
        >
          <div className="px-4 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
            <Activity size={13} style={{ color: "#06b6d4" }} />
            <h3 className="text-sm font-semibold text-slate-200">Activity Feed</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-slate-800/20 transition-colors">
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                  <item.icon size={11} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-snug">{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sales Pipeline Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-xl p-5"
        style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Sales Pipeline</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Lead progression tracking</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
            Overall conversion: 3.1%
          </span>
        </div>
        <div className="space-y-2">
          {pipeline.map((s, i) => (
            <div key={s.stage} className="flex items-center gap-3">
              <span className="w-24 text-xs text-right flex-shrink-0" style={{ color: "var(--text-secondary)" }}>{s.stage}</span>
              <div className="flex-1 relative">
                <div className="h-7 rounded" style={{ background: "rgba(30,58,95,0.3)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.06 }}
                    className="h-full rounded flex items-center px-2"
                    style={{ background: `${s.color}30`, borderLeft: `3px solid ${s.color}` }}
                  >
                    <span className="text-xs font-semibold" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
                  </motion.div>
                </div>
              </div>
              <span className="w-16 text-xs text-right flex-shrink-0 font-semibold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
