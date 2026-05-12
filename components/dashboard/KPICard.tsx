"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import { SparklineChart } from "./SparklineChart";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel?: string;
  icon: React.ReactNode;
  accentColor: string;
  sparkData?: number[];
  index?: number;
  suffix?: string;
}

export default function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  accentColor,
  sparkData,
  index = 0,
  suffix,
}: KPICardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative rounded-xl p-5 overflow-hidden cursor-default"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9) 0%, rgba(8,14,31,0.9) 100%)",
        border: `1px solid rgba(30, 58, 95, 0.5)`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      {/* Accent glow in corner */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ background: accentColor }}
      />

      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>

        {/* Trend badge */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            background: isNeutral
              ? "rgba(148,163,184,0.1)"
              : isPositive
              ? "rgba(34,197,94,0.1)"
              : "rgba(239,68,68,0.1)",
            color: isNeutral ? "#94a3b8" : isPositive ? "#22c55e" : "#ef4444",
            border: `1px solid ${
              isNeutral
                ? "rgba(148,163,184,0.2)"
                : isPositive
                ? "rgba(34,197,94,0.2)"
                : "rgba(239,68,68,0.2)"
            }`,
          }}
        >
          {isNeutral ? (
            <Minus size={10} />
          ) : isPositive ? (
            <TrendingUp size={10} />
          ) : (
            <TrendingDown size={10} />
          )}
          {formatPercent(Math.abs(change), false)}
        </div>
      </div>

      {/* Value */}
      <div className="mb-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
          {suffix && (
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {suffix}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
      </div>

      {/* Change label */}
      {changeLabel && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {changeLabel}
        </p>
      )}

      {/* Sparkline */}
      {sparkData && (
        <div className="mt-3 -mx-1">
          <SparklineChart data={sparkData} color={accentColor} positive={isPositive} />
        </div>
      )}
    </motion.div>
  );
}
