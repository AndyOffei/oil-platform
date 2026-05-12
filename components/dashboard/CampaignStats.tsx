"use client";

import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Mail, MessageSquare, Share2, Users } from "lucide-react";

const funnelData = [
  { name: "Impressions", value: 48200, color: "#1e3a5f" },
  { name: "Clicks", value: 12400, color: "#0ea5e9" },
  { name: "Leads", value: 3100, color: "#06b6d4" },
  { name: "Converted", value: 842, color: "#22c55e" },
];

const channels = [
  { name: "Email", icon: Mail, sent: 12400, open: "42%", color: "#06b6d4" },
  { name: "SMS", icon: MessageSquare, sent: 8300, open: "78%", color: "#d4a017" },
  { name: "Social", icon: Share2, sent: 24000, open: "18%", color: "#a78bfa" },
  { name: "Direct", icon: Users, sent: 3600, open: "61%", color: "#22c55e" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
    >
      <p className="font-semibold text-white">{payload[0].name}</p>
      <p style={{ color: "var(--text-secondary)" }}>{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function CampaignStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Campaign Performance</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Active campaigns this quarter
          </p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          3 Active
        </span>
      </div>

      {/* Funnel */}
      <div className="space-y-2 mb-4">
        {funnelData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="text-xs w-20 text-right" style={{ color: "var(--text-muted)" }}>
              {item.name}
            </span>
            <div className="flex-1 h-5 rounded" style={{ background: "rgba(30,58,95,0.3)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / funnelData[0].value) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                className="h-full rounded flex items-center pl-2"
                style={{ background: item.color, minWidth: "2rem" }}
              >
                <span className="text-xs font-medium text-white/80">
                  {item.value.toLocaleString()}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion rate */}
      <div
        className="flex items-center justify-between py-2.5 px-3 rounded-lg mb-4"
        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Overall Conversion Rate</span>
        <span className="text-sm font-bold" style={{ color: "#22c55e" }}>
          {((842 / 48200) * 100).toFixed(1)}%
        </span>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-2 gap-2">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center gap-2 p-2.5 rounded-lg"
            style={{ background: "rgba(13,22,41,0.5)", border: "1px solid rgba(30,58,95,0.3)" }}
          >
            <ch.icon size={13} style={{ color: ch.color }} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300">{ch.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {ch.sent.toLocaleString()} • {ch.open} open
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
