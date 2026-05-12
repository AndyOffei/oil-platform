"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer rounded-lg", className)}
      style={{ background: "rgba(30,58,95,0.3)", ...style }}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>
      <Skeleton className="w-24 h-7 mb-2" />
      <Skeleton className="w-32 h-4 mb-4" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
        <Skeleton className="w-24 h-7 rounded-lg" />
      </div>
      <Skeleton className="w-full rounded-xl" style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
        <Skeleton className="w-40 h-4" />
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-48 h-3" />
              <Skeleton className="w-32 h-3" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlertSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.4)" }}>
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="rounded-2xl flex-1 min-h-[480px] flex items-center justify-center relative overflow-hidden"
      style={{ background: "rgba(5,10,20,0.95)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <Skeleton className="absolute inset-0 rounded-2xl opacity-30" />
      <div className="relative text-center space-y-3">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="w-32 h-4 mx-auto" />
        <Skeleton className="w-24 h-3 mx-auto" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-3 mb-2" />
      <Skeleton className="w-2/3 h-3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ChartSkeleton height={200} /></div>
        <ChartSkeleton height={200} />
      </div>
      {/* Table row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TableSkeleton rows={4} />
        <ChartSkeleton height={180} />
      </div>
    </div>
  );
}
