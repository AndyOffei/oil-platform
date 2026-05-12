"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import {
  FileText, Upload, Download, Trash2, Search,
  FileSpreadsheet, Eye, CheckCircle2, Loader2,
  BarChart3, HardDrive, User,
} from "lucide-react";
import { api } from "@/lib/api";
import { TableSkeleton } from "@/components/skeletons/Skeleton";

interface Report {
  id: string; name: string; type: string; size: string;
  author: string; status: string; downloads: number; createdAt: string;
}

const uploadedFiles = [
  { name: "Field_Production_Oct.csv",       size: "480 KB",  uploaded: "Nov 10", type: "CSV"   },
  { name: "Refinery_Inspection_Report.pdf", size: "12.4 MB", uploaded: "Nov 8",  type: "PDF"   },
  { name: "Price_Data_Q3.xlsx",             size: "2.1 MB",  uploaded: "Nov 5",  type: "Excel" },
];

const reportTemplates = [
  { id: "tpl1", name: "Production Summary",  icon: BarChart3,     color: "#06b6d4", type: "PDF",   desc: "Daily/monthly output by field and region"      },
  { id: "tpl2", name: "Price Analytics",     icon: FileText,      color: "#d4a017", type: "Excel", desc: "Historical and current price movements"         },
  { id: "tpl3", name: "CRM & Sales Report",  icon: User,          color: "#a78bfa", type: "Excel", desc: "Leads, conversions, and revenue metrics"        },
  { id: "tpl4", name: "Refinery Operations", icon: HardDrive,     color: "#f59e0b", type: "PDF",   desc: "Efficiency, throughput, and maintenance logs"   },
  { id: "tpl5", name: "Campaign Analytics",  icon: BarChart3,     color: "#f472b6", type: "PDF",   desc: "Email, SMS, and social media performance"       },
  { id: "tpl6", name: "Dashboard Export",    icon: Download,      color: "#22c55e", type: "PDF",   desc: "Full dashboard snapshot as PDF"                 },
];

export default function ReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [files, setFiles]       = useState(uploadedFiles);
  const [search, setSearch]     = useState("");
  const [generating, setGenerating] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.reports()
      .then(setReports)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const generate = async (tplId: string, name: string, type: string) => {
    if (generating) return;
    setGenerating(tplId);
    try {
      const newReport = await api.generateReport(name, type);
      setReports((prev) => [{ ...newReport, createdAt: newReport.createdAt || new Date().toISOString() }, ...prev]);
      // Poll until Ready
      const poll = setInterval(async () => {
        const all = await api.reports().catch(() => null);
        if (!all) return;
        const updated = all.find((r: Report) => r.id === newReport.id);
        if (updated?.status === "Ready") {
          setReports(all);
          setGenerating(null);
          clearInterval(poll);
        }
      }, 2000);
    } catch {
      setGenerating(null);
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach((f) => {
      setFiles((prev) => [{
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        uploaded: "Just now",
        type: f.name.split(".").pop()?.toUpperCase() || "File",
      }, ...prev]);
    });
  };

  return (
    <MainLayout title="File & Report Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)", color: "var(--text-muted)" }}>
            <Search size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports…"
              className="bg-transparent outline-none flex-1 text-slate-300 placeholder:text-slate-500 text-xs" />
          </div>

          {loading ? <TableSkeleton rows={5} /> : (
            <motion.div className="rounded-xl overflow-hidden"
              style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                <h3 className="text-sm font-semibold text-slate-200">Analytics Reports
                  <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>({reports.length} total · from database)</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
                      {["Report Name","Type","Size","Created","Author","Status",""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
                    <AnimatePresence>
                      {filtered.map((r, i) => (
                        <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04 }} className="hover:bg-slate-800/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {r.type === "PDF"
                                ? <FileText size={14} style={{ color: "#ef4444" }} />
                                : <FileSpreadsheet size={14} style={{ color: "#22c55e" }} />}
                              <span className="font-medium text-slate-200">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-xs"
                              style={{ background: r.type === "PDF" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: r.type === "PDF" ? "#ef4444" : "#22c55e" }}>
                              {r.type}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.size}</td>
                          <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{r.createdAt?.split("T")[0]}</td>
                          <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.author}</td>
                          <td className="px-4 py-3">
                            {r.status === "Ready"
                              ? <span className="flex items-center gap-1" style={{ color: "#22c55e" }}><CheckCircle2 size={11} />Ready</span>
                              : <span className="flex items-center gap-1" style={{ color: "#f59e0b" }}><Loader2 size={11} className="animate-spin" />Generating…</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {r.status === "Ready" && (
                                <>
                                  <button className="p-1.5 rounded hover:bg-slate-700/50"><Eye size={12} style={{ color: "#06b6d4" }} /></button>
                                  <button className="p-1.5 rounded hover:bg-slate-700/50"><Download size={12} style={{ color: "#22c55e" }} /></button>
                                </>
                              )}
                              <button onClick={() => deleteReport(r.id)} className="p-1.5 rounded hover:bg-slate-700/50">
                                <Trash2 size={12} style={{ color: "#f87171" }} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Uploaded Files */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
              <h3 className="text-sm font-semibold text-slate-200">Uploaded Files</h3>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
                <Upload size={12} /> Upload File
              </button>
              <input ref={fileInputRef} type="file" multiple className="hidden"
                onChange={(e) => {
                  Array.from(e.target.files || []).forEach((f) => {
                    setFiles((prev) => [{ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, uploaded: "Just now", type: f.name.split(".").pop()?.toUpperCase() || "File" }, ...prev]);
                  });
                }} />
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
                  {f.type === "PDF"   ? <FileText size={14} style={{ color: "#ef4444" }} />
                    : f.type === "CSV" ? <FileSpreadsheet size={14} style={{ color: "#06b6d4" }} />
                    : <FileSpreadsheet size={14} style={{ color: "#22c55e" }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{f.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.size} · {f.uploaded}</p>
                  </div>
                  <button className="p-1.5 rounded hover:bg-slate-700/50"><Download size={12} style={{ color: "#06b6d4" }} /></button>
                  <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="p-1.5 rounded hover:bg-slate-700/50">
                    <Trash2 size={12} style={{ color: "#f87171" }} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Upload + Templates */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl p-6 text-center cursor-pointer transition-all"
            style={{
              background: dragOver ? "rgba(6,182,212,0.08)" : "rgba(13,22,41,0.9)",
              border: dragOver ? "2px dashed #06b6d4" : "2px dashed rgba(30,58,95,0.5)",
            }}>
            <Upload size={28} className="mx-auto mb-3" style={{ color: dragOver ? "#06b6d4" : "var(--text-muted)" }} />
            <p className="text-sm font-medium text-slate-300">Drop files here</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>PDF, Excel, CSV supported</p>
            <button className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
              Browse Files
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
            <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(30,58,95,0.3)" }}>
              <h3 className="text-sm font-semibold text-slate-200">Generate Report</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Saves to database</p>
            </div>
            <div className="p-3 grid grid-cols-1 gap-2">
              {reportTemplates.map((t) => (
                <button key={t.id} onClick={() => generate(t.id, t.name, t.type)}
                  disabled={!!generating}
                  className="flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "rgba(8,14,31,0.6)", border: "1px solid rgba(30,58,95,0.4)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}18` }}>
                    {generating === t.id
                      ? <Loader2 size={15} style={{ color: t.color }} className="animate-spin" />
                      : <t.icon size={15} style={{ color: t.color }} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200">{t.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
