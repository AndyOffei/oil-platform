"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Droplets, Users, Globe2, X, Search, ArrowRight, TrendingUp, Zap, Plus, Minus, RotateCcw } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const productionSites = [
  { id: 1, name: "Agbami Field",      country: "Nigeria",      type: "production", lat: 6.5,  lng: 3.4,    bbl: 55400,  color: "#06b6d4" },
  { id: 2, name: "Jubilee Field",     country: "Ghana",        type: "production", lat: 5.5,  lng: -0.2,   bbl: 38200,  color: "#06b6d4" },
  { id: 3, name: "Ghawar Field",      country: "Saudi Arabia", type: "production", lat: 24.7, lng: 49.1,   bbl: 142000, color: "#06b6d4" },
  { id: 4, name: "Bu Hasa Field",     country: "UAE",          type: "production", lat: 24.5, lng: 54.4,   bbl: 71000,  color: "#06b6d4" },
  { id: 5, name: "Hassi Messaoud",    country: "Algeria",      type: "production", lat: 31.7, lng: 6.1,    bbl: 43100,  color: "#06b6d4" },
  { id: 6, name: "Tengiz Field",      country: "Kazakhstan",   type: "production", lat: 45.4, lng: 53.1,   bbl: 61800,  color: "#06b6d4" },
  { id: 7, name: "Permian Basin",     country: "USA",          type: "production", lat: 31.8, lng: -102.5, bbl: 98400,  color: "#06b6d4" },
];

const exportZones = [
  { id: 10, name: "Rotterdam Hub",  country: "Netherlands", type: "export", lat: 51.9, lng: 4.5,   volume: 280000, color: "#d4a017" },
  { id: 11, name: "Singapore Hub",  country: "Singapore",   type: "export", lat: 1.3,  lng: 103.8, volume: 420000, color: "#d4a017" },
  { id: 12, name: "Houston Hub",    country: "USA",         type: "export", lat: 29.7, lng: -95.4, volume: 190000, color: "#d4a017" },
  { id: 13, name: "Tokyo Hub",      country: "Japan",       type: "export", lat: 35.7, lng: 139.7, volume: 380000, color: "#d4a017" },
];

const customers = [
  { id: 20, name: "Aramco Trading Ltd",  country: "Saudi Arabia", type: "customer", lat: 24.7, lng: 46.7, value: "$4.2M", revenue: 4.2, color: "#22c55e" },
  { id: 21, name: "Shell Intl Trading",  country: "UK",           type: "customer", lat: 51.5, lng: -0.1, value: "$8.9M", revenue: 8.9, color: "#22c55e" },
  { id: 22, name: "NNPC Ltd",            country: "Nigeria",       type: "customer", lat: 9.1,  lng: 7.4,  value: "$5.6M", revenue: 5.6, color: "#22c55e" },
  { id: 23, name: "TotalEnergies ME",    country: "France",        type: "customer", lat: 48.9, lng: 2.3,  value: "$3.1M", revenue: 3.1, color: "#22c55e" },
];

const allMarkers = [...productionSites, ...exportZones, ...customers];

const layers = [
  { id: "production", label: "Production", color: "#06b6d4", icon: Droplets },
  { id: "export",     label: "Export Hubs", color: "#d4a017", icon: Globe2  },
  { id: "customer",   label: "Customers",   color: "#22c55e", icon: Users   },
];

type AnyMarker = typeof allMarkers[0];

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState(["production", "export", "customer"]);
  const [selected, setSelected]         = useState<AnyMarker | null>(null);
  const [zoom, setZoom]                 = useState(1);
  const [center, setCenter]             = useState<[number, number]>([20, 15]);
  const [search, setSearch]             = useState("");

  const toggleLayer = (id: string) =>
    setActiveLayers((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);

  const visible  = allMarkers.filter((m) => activeLayers.includes(m.type));
  const searched = allMarkers.filter((m) =>
    activeLayers.includes(m.type) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.country.toLowerCase().includes(search.toLowerCase()))
  );

  const selectMarker = (m: AnyMarker) => {
    setSelected(m);
    setCenter([m.lng, m.lat]);
    setZoom(3);
  };

  const totalBbl    = productionSites.reduce((s, p) => s + p.bbl, 0);
  const totalVolume = exportZones.reduce((s, e) => s + e.volume, 0);
  const totalValue  = customers.reduce((s, c) => s + (c as any).revenue, 0);

  return (
    <MainLayout title="Global Map">
      <div className="flex gap-4" style={{ height: "calc(100vh - 120px)" }}>

        {/* ── Left: map column ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">

          {/* Layer toggles + zoom */}
          <div className="flex flex-wrap items-center gap-2">
            {layers.map((l) => {
              const on = activeLayers.includes(l.id);
              return (
                <button key={l.id} onClick={() => toggleLayer(l.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: on ? `${l.color}18` : "rgba(13,22,41,0.8)",
                    color:      on ? l.color : "var(--text-muted)",
                    border:     on ? `1px solid ${l.color}40` : "1px solid rgba(30,58,95,0.4)",
                  }}>
                  <l.icon size={12} />
                  {l.label}
                  <span className="w-2 h-2 rounded-full" style={{ background: on ? l.color : "transparent", border: `1px solid ${l.color}80` }} />
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={() => setZoom((z) => Math.min(z + 0.5, 6))}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <Plus size={13} style={{ color: "#06b6d4" }} />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <Minus size={13} style={{ color: "#06b6d4" }} />
              </button>
              <button onClick={() => { setCenter([20, 15]); setZoom(1); setSelected(null); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <RotateCcw size={12} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          </div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden flex-1"
            style={{ background: "rgba(4,8,18,0.98)", border: "1px solid rgba(30,58,95,0.5)", boxShadow: "inset 0 0 60px rgba(6,182,212,0.03)" }}>

            <ComposableMap projection="geoMercator" style={{ width: "100%", height: "100%" }}
              projectionConfig={{ scale: 145, center: [20, 15] }}>
              <ZoomableGroup zoom={zoom} center={center}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo}
                        style={{
                          default: { fill: "#0a1628", stroke: "#162a47", strokeWidth: 0.4, outline: "none" },
                          hover:   { fill: "#0d1e38", stroke: "#06b6d4", strokeWidth: 0.5, outline: "none" },
                          pressed: { fill: "#0d1e38", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {visible.map((m) => {
                  const isSelected = selected?.id === m.id;
                  const r = m.type === "production"
                    ? Math.sqrt((m as any).bbl / 1200) + 4
                    : m.type === "export" ? 7 : 6;
                  return (
                    <Marker key={m.id} coordinates={[m.lng, m.lat]} onClick={() => selectMarker(m)}>
                      <g style={{ cursor: "pointer" }}>
                        {/* Outer pulse ring */}
                        <circle r={r + 6} fill="none" stroke={m.color} strokeWidth={isSelected ? 1.5 : 0.8}
                          strokeOpacity={isSelected ? 0.6 : 0.25} />
                        {/* Middle ring */}
                        <circle r={r + 2} fill={m.color} fillOpacity={isSelected ? 0.2 : 0.1} stroke="none" />
                        {/* Core dot */}
                        <circle r={r} fill={m.color} fillOpacity={isSelected ? 0.9 : 0.7}
                          stroke={isSelected ? "#fff" : m.color} strokeWidth={isSelected ? 1.5 : 0.5} />
                        {isSelected && <circle r={3} fill="#fff" />}
                      </g>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Corner watermark */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs"
              style={{ color: "rgba(71,85,105,0.6)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(6,182,212,0.4)" }} />
              OilIntel Global Intelligence Network
            </div>

            {/* Zoom level */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs"
              style={{ background: "rgba(8,14,31,0.8)", border: "1px solid rgba(30,58,95,0.4)", color: "var(--text-muted)" }}>
              {zoom.toFixed(1)}×
            </div>
          </motion.div>
        </div>

        {/* ── Right: sidebar ───────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Fields",   value: productionSites.length, sub: `${(totalBbl / 1000).toFixed(0)}K bbl/d`,  color: "#06b6d4" },
              { label: "Hubs",     value: exportZones.length,     sub: `${(totalVolume / 1000).toFixed(0)}K bbl`, color: "#d4a017" },
              { label: "Clients",  value: customers.length,       sub: `$${totalValue.toFixed(1)}M`,              color: "#22c55e" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-medium text-slate-300">{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <Search size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites & clients…"
              className="bg-transparent outline-none flex-1 text-xs text-slate-300 placeholder:text-slate-500" />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Marker list */}
          <div className="flex-1 rounded-xl overflow-hidden flex flex-col"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)", minHeight: 0 }}>
            <div className="overflow-y-auto flex-1">
              {layers.map((layer) => {
                const items = searched.filter((m) => m.type === layer.id);
                if (!activeLayers.includes(layer.id) || items.length === 0) return null;
                return (
                  <div key={layer.id}>
                    <div className="px-3 py-2 flex items-center gap-1.5 sticky top-0"
                      style={{ background: "rgba(13,22,41,0.95)", borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                      <layer.icon size={11} style={{ color: layer.color }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: layer.color }}>{layer.label}</span>
                      <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: `${layer.color}18`, color: layer.color }}>{items.length}</span>
                    </div>
                    {items.map((m) => {
                      const isActive = selected?.id === m.id;
                      return (
                        <button key={m.id} onClick={() => selectMarker(m)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-slate-800/40"
                          style={{
                            background: isActive ? `${layer.color}0d` : "transparent",
                            borderLeft: isActive ? `2px solid ${layer.color}` : "2px solid transparent",
                          }}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: layer.color, opacity: isActive ? 1 : 0.6 }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">{m.name}</p>
                            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                              {m.country}
                              {m.type === "production" && ` · ${((m as any).bbl / 1000).toFixed(0)}K bbl/d`}
                              {m.type === "export"     && ` · ${((m as any).volume / 1000).toFixed(0)}K bbl`}
                              {m.type === "customer"   && ` · ${(m as any).value}`}
                            </p>
                          </div>
                          <ArrowRight size={10} style={{ color: isActive ? layer.color : "var(--text-muted)", flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {searched.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No results for "{search}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected detail card */}
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }}
                className="rounded-xl p-4 flex-shrink-0"
                style={{ background: "rgba(13,22,41,0.98)", border: `1px solid ${selected.color}40`, boxShadow: `0 0 24px ${selected.color}10` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${selected.color}20` }}>
                      {selected.type === "production" ? <Droplets size={15} style={{ color: selected.color }} />
                        : selected.type === "export"  ? <Globe2 size={15} style={{ color: selected.color }} />
                        : <Users size={15} style={{ color: selected.color }} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100 leading-tight">{selected.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selected.country}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-slate-700/50 ml-2">
                    <X size={12} style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>

                <div className="space-y-2 pt-2" style={{ borderTop: "1px solid rgba(30,58,95,0.3)" }}>
                  {selected.type === "production" && <>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Daily Output</span>
                      <span className="font-bold text-white">{((selected as any).bbl).toLocaleString()} bbl/d</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Est. Revenue</span>
                      <span className="font-bold" style={{ color: "#22c55e" }}>${((selected as any).bbl * 102 / 1e6).toFixed(1)}M/day</span>
                    </div>
                  </>}
                  {selected.type === "export" && <>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Monthly Volume</span>
                      <span className="font-bold text-white">{((selected as any).volume).toLocaleString()} bbl</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Trade Value</span>
                      <span className="font-bold" style={{ color: "#d4a017" }}>${((selected as any).volume * 102 / 1e6).toFixed(0)}M</span>
                    </div>
                  </>}
                  {selected.type === "customer" && <>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Deal Value</span>
                      <span className="font-bold" style={{ color: "#22c55e" }}>{(selected as any).value}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Status</span>
                      <span className="font-bold text-white">Active Client</span>
                    </div>
                  </>}
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>Coordinates</span>
                    <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{selected.lat}°, {selected.lng}°</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-1.5">
                  <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-center transition-all hover:opacity-80"
                    style={{ background: `${selected.color}18`, color: selected.color, border: `1px solid ${selected.color}30` }}>
                    <TrendingUp size={11} className="inline mr-1" />View Analytics
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-center transition-all hover:opacity-80"
                    style={{ background: "rgba(13,22,41,0.8)", color: "var(--text-secondary)", border: "1px solid rgba(30,58,95,0.4)" }}>
                    <Zap size={11} className="inline mr-1" />Quick Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
