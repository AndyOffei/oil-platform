"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ProductionChart from "@/components/dashboard/ProductionChart";
import MarketPriceChart from "@/components/dashboard/MarketPriceChart";
import AIForecastWidget from "@/components/dashboard/AIForecastWidget";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CampaignStats from "@/components/dashboard/CampaignStats";
import { KPICardSkeleton, ChartSkeleton } from "@/components/skeletons/Skeleton";
import { api } from "@/lib/api";
import {
  DollarSign, Droplets, TrendingUp, Ship,
  Users, Megaphone, Target, Brain,
} from "lucide-react";

interface Summary {
  totalProduction: number;
  avgUtilization: string;
  currentBrent: number;
  priceChange7d: number;
  activeRefineries: number;
  alerts: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.summary()
      .then(setSummary)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const bblK  = summary ? Math.round(summary.totalProduction / 1000) : 213;
  const brent = summary ? summary.currentBrent : 102.4;
  const pct7d = summary ? summary.priceChange7d : 2.3;

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$84.2M",
      change: 12.4,
      changeLabel: "vs last quarter",
      icon: <DollarSign size={18} />,
      accentColor: "#22c55e",
      sparkData: [42, 44, 41, 48, 52, 49, 55, 58, 54, 61, 64, 68],
    },
    {
      title: "Oil Production",
      value: `${bblK}K`,
      suffix: "bbl/day",
      change: 5.7,
      changeLabel: "vs last month",
      icon: <Droplets size={18} />,
      accentColor: "#06b6d4",
      sparkData: [180, 188, 195, 190, 200, 205, 198, 208, 210, 206, 212, bblK],
    },
    {
      title: "Brent Crude",
      value: `$${brent.toFixed(1)}`,
      suffix: "/bbl",
      change: pct7d,
      changeLabel: "7-day change",
      icon: <TrendingUp size={18} />,
      accentColor: "#d4a017",
      sparkData: [88, 91, 89, 94, 90, 96, 93, 98, 95, 100, 99, brent],
    },
    {
      title: "Export Volume",
      value: "1.4M",
      suffix: "bbl",
      change: 8.1,
      changeLabel: "this month",
      icon: <Ship size={18} />,
      accentColor: "#a78bfa",
      sparkData: [900, 980, 1050, 1020, 1100, 1150, 1200, 1180, 1250, 1300, 1380, 1400],
    },
    {
      title: "Active Clients",
      value: "2,847",
      change: 3.2,
      changeLabel: "new this month",
      icon: <Users size={18} />,
      accentColor: "#f472b6",
      sparkData: [2500, 2560, 2580, 2610, 2640, 2670, 2700, 2720, 2760, 2800, 2820, 2847],
    },
    {
      title: "Campaign ROI",
      value: "342%",
      change: 18.6,
      changeLabel: "vs last campaign",
      icon: <Megaphone size={18} />,
      accentColor: "#fb923c",
      sparkData: [200, 220, 240, 260, 250, 280, 290, 300, 310, 320, 335, 342],
    },
    {
      title: "Lead Conversion",
      value: "27.1%",
      change: -1.4,
      changeLabel: "vs last week",
      icon: <Target size={18} />,
      accentColor: "#34d399",
      sparkData: [22, 24, 26, 25, 27, 28, 27, 29, 28, 27, 28, 27],
    },
    {
      title: "AI Forecast Accuracy",
      value: "94.2%",
      change: 0.8,
      changeLabel: "7-day model accuracy",
      icon: <Brain size={18} />,
      accentColor: "#a78bfa",
      sparkData: [88, 89, 91, 90, 92, 91, 93, 92, 93, 94, 94, 94],
    },
  ];

  return (
    <MainLayout title="Executive Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <KPICardSkeleton key={i} />)
          : kpiData.map((kpi, i) => <KPICard key={kpi.title} {...kpi} index={i} />)
        }
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {loading ? <ChartSkeleton height={200} /> : <RevenueChart />}
        {loading ? <ChartSkeleton height={200} /> : <MarketPriceChart />}
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {loading ? <ChartSkeleton height={200} /> : <ProductionChart />}
        <div className="lg:col-span-2">
          {loading ? <ChartSkeleton height={200} /> : <AIForecastWidget />}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <CampaignStats />
      </div>
    </MainLayout>
  );
}
