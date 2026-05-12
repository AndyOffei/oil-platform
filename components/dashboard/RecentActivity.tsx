"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, ArrowDownRight, Users, Package, Mail } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "deal",
    title: "New contract signed",
    sub: "Aramco Trading — $4.2M",
    time: "3 min ago",
    icon: ArrowUpRight,
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.1)",
  },
  {
    id: 2,
    type: "lead",
    title: "New lead captured",
    sub: "Gulf Petroleum Corp",
    time: "17 min ago",
    icon: Users,
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.1)",
  },
  {
    id: 3,
    type: "price",
    title: "Price alert triggered",
    sub: "Brent > $100/bbl",
    time: "32 min ago",
    icon: ArrowUpRight,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.1)",
  },
  {
    id: 4,
    type: "shipment",
    title: "Shipment dispatched",
    sub: "200K bbl — Rotterdam",
    time: "1h ago",
    icon: Package,
    iconColor: "#a78bfa",
    iconBg: "rgba(167,139,250,0.1)",
  },
  {
    id: 5,
    type: "campaign",
    title: "Campaign launched",
    sub: "Q4 Refinery Promo — 1,200 recipients",
    time: "2h ago",
    icon: Mail,
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.1)",
  },
  {
    id: 6,
    type: "deal",
    title: "Contract renewed",
    sub: "Shell International — $8.9M",
    time: "3h ago",
    icon: ArrowUpRight,
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.1)",
  },
];

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={15} style={{ color: "#06b6d4" }} />
          <h3 className="text-sm font-semibold text-slate-200">Recent Activity</h3>
        </div>
        <button className="text-xs" style={{ color: "#06b6d4" }}>
          View all
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
        {activities.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 cursor-pointer transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: item.iconBg }}
            >
              <item.icon size={14} style={{ color: item.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{item.title}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {item.sub}
              </p>
            </div>
            <p className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
              {item.time}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
