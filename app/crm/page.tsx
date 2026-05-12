"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import CRMOverview from "@/components/crm/CRMOverview";
import CustomerDatabase from "@/components/crm/CustomerDatabase";
import LeadManagement from "@/components/crm/LeadManagement";
import CampaignTools from "@/components/crm/CampaignTools";
import MarketingAnalytics from "@/components/crm/MarketingAnalytics";
import SalesAnalytics from "@/components/crm/SalesAnalytics";
import {
  LayoutDashboard, Users, UserPlus, Megaphone,
  BarChart3, TrendingUp,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, color: "#06b6d4" },
  { id: "customers", label: "Customers", icon: Users, color: "#22c55e" },
  { id: "leads", label: "Lead Management", icon: UserPlus, color: "#a78bfa" },
  { id: "campaigns", label: "Campaigns", icon: Megaphone, color: "#d4a017" },
  { id: "marketing", label: "Marketing Analytics", icon: BarChart3, color: "#f472b6" },
  { id: "sales", label: "Sales Analytics", icon: TrendingUp, color: "#34d399" },
];

export default function CRMPage() {
  const [active, setActive] = useState("overview");
  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <MainLayout title="CRM & Marketing">
      {/* Tab Navigation */}
      <div
        className="flex gap-1.5 mb-6 p-1.5 rounded-xl overflow-x-auto"
        style={{ background: "rgba(8,14,31,0.8)", border: "1px solid rgba(30,58,95,0.4)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{
              color: active === t.id ? "#fff" : "var(--text-muted)",
            }}
          >
            {active === t.id && (
              <motion.div
                layoutId="crm-tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{ background: `${t.color}18`, border: `1px solid ${t.color}40` }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <t.icon
              size={15}
              className="relative z-10 flex-shrink-0"
              style={{ color: active === t.id ? t.color : undefined }}
            />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {active === "overview" && <CRMOverview />}
          {active === "customers" && <CustomerDatabase />}
          {active === "leads" && <LeadManagement />}
          {active === "campaigns" && <CampaignTools />}
          {active === "marketing" && <MarketingAnalytics />}
          {active === "sales" && <SalesAnalytics />}
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}
