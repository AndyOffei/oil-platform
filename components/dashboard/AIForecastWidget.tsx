"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Zap } from "lucide-react";

const forecasts = [
  {
    day: "Today",
    price: 102.4,
    change: 1.8,
    confidence: 94,
    signal: "bullish",
  },
  {
    day: "Tomorrow",
    price: 104.1,
    change: 1.7,
    confidence: 88,
    signal: "bullish",
  },
  {
    day: "Wed",
    price: 103.2,
    change: -0.9,
    confidence: 81,
    signal: "neutral",
  },
  {
    day: "Thu",
    price: 106.5,
    change: 3.2,
    confidence: 76,
    signal: "bullish",
  },
  {
    day: "Fri",
    price: 105.8,
    change: -0.7,
    confidence: 72,
    signal: "neutral",
  },
  {
    day: "Sat",
    price: 108.3,
    change: 2.4,
    confidence: 68,
    signal: "bullish",
  },
  {
    day: "Sun",
    price: 107.1,
    change: -1.1,
    confidence: 61,
    signal: "bearish",
  },
];

const insights = [
  { icon: "⚡", text: "OPEC supply cuts driving upward pressure", impact: "high" },
  { icon: "🌊", text: "Gulf weather patterns may disrupt exports", impact: "medium" },
  { icon: "📉", text: "US inventory surplus may limit upside", impact: "low" },
  { icon: "🔥", text: "Asian demand surge expected Q4", impact: "high" },
];

export default function AIForecastWidget() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(13,22,41,0.9), rgba(8,14,31,0.9))",
        border: "1px solid rgba(30,58,95,0.5)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            <Brain size={16} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">AI Market Forecast</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Powered by OilIntel ML Engine v2.4
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
          style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}
        >
          <Zap size={10} />
          AI Active
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          7-Day Brent Crude Forecast
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {forecasts.map((f, i) => (
            <motion.div
              key={f.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-default"
              style={{
                background:
                  i === 0
                    ? "rgba(167,139,250,0.12)"
                    : "rgba(13,22,41,0.5)",
                border: i === 0 ? "1px solid rgba(167,139,250,0.3)" : "1px solid rgba(30,58,95,0.3)",
              }}
            >
              <p className="text-xs font-medium" style={{ color: i === 0 ? "#a78bfa" : "var(--text-muted)" }}>
                {f.day}
              </p>
              <p className="text-xs font-bold text-white">${f.price}</p>
              <div
                className="flex items-center gap-0.5 text-xs font-medium"
                style={{ color: f.change >= 0 ? "#22c55e" : "#ef4444" }}
              >
                {f.change >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                <span>{Math.abs(f.change)}%</span>
              </div>
              {/* Confidence bar */}
              <div className="w-full h-1 rounded-full" style={{ background: "rgba(30,58,95,0.4)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${f.confidence}%`,
                    background:
                      f.confidence > 85
                        ? "#22c55e"
                        : f.confidence > 70
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {f.confidence}%
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 w-full text-left"
          style={{ color: "var(--text-muted)" }}
        >
          Key AI Insights
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-2"
            >
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg"
                  style={{ background: "rgba(13,22,41,0.5)", border: "1px solid rgba(30,58,95,0.3)" }}
                >
                  <span className="text-sm">{insight.icon}</span>
                  <p className="text-xs flex-1 text-slate-300">{insight.text}</p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background:
                        insight.impact === "high"
                          ? "rgba(239,68,68,0.15)"
                          : insight.impact === "medium"
                          ? "rgba(245,158,11,0.15)"
                          : "rgba(34,197,94,0.15)",
                      color:
                        insight.impact === "high"
                          ? "#f87171"
                          : insight.impact === "medium"
                          ? "#fbbf24"
                          : "#4ade80",
                    }}
                  >
                    {insight.impact}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {!expanded && (
          <div className="flex gap-2">
            {insights.slice(0, 2).map((insight, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg flex-1"
                style={{ background: "rgba(13,22,41,0.5)", border: "1px solid rgba(30,58,95,0.3)" }}
              >
                <span>{insight.icon}</span>
                <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                  {insight.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
