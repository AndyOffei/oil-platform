"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import {
  Users, Shield, Database, CheckCircle2, Plus, Edit2,
  Trash2, ToggleLeft, ToggleRight, X, Key, Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { TableSkeleton } from "@/components/skeletons/Skeleton";

interface User {
  id: string; name: string; email: string; role: string;
  avatar: string; active: boolean; createdAt: string;
}

const roles = [
  { id: "superadmin", label: "Super Admin", color: "#d4a017", permissions: ["All access", "User management", "System config", "Reports"] },
  { id: "manager",    label: "Manager",     color: "#a78bfa", permissions: ["Analytics", "CRM", "Reports", "Campaigns"] },
  { id: "analyst",    label: "Analyst",     color: "#06b6d4", permissions: ["Analytics", "Reports", "Monitoring"] },
  { id: "sales",      label: "Sales Rep",   color: "#22c55e", permissions: ["CRM", "Leads", "Campaigns"] },
];

const pendingApprovals = [
  { id: "PA001", type: "data",     description: "Production data update — Agbami Field Oct figures",         submitter: "J. Okafor", time: "2h ago" },
  { id: "PA002", type: "campaign", description: "Campaign launch: Q4 Refinery Promo — 12,400 recipients",   submitter: "A. Hassan", time: "4h ago" },
  { id: "PA003", type: "customer", description: "New enterprise account: Qatar National Bank",               submitter: "S. Mensah", time: "1d ago" },
];

const dataForms = [
  { id: "oil",      label: "Oil Production Data",   color: "#06b6d4", fields: ["Field Name", "Date", "Output (bbl/day)", "Region", "Notes"] },
  { id: "price",    label: "Pricing Update",         color: "#d4a017", fields: ["Crude Type", "Date", "Price (USD/bbl)", "Source", "Validity"] },
  { id: "refinery", label: "Refinery Record",        color: "#f59e0b", fields: ["Refinery Name", "Throughput", "Efficiency %", "Status", "Alert Level"] },
  { id: "customer", label: "Customer Onboarding",    color: "#22c55e", fields: ["Company", "Contact Name", "Email", "Segment", "Initial Value"] },
];

const tabs = [
  { id: "users",     label: "User Management",    icon: Users         },
  { id: "roles",     label: "Roles & Permissions", icon: Shield        },
  { id: "approvals", label: "Pending Approvals",   icon: CheckCircle2  },
  { id: "data",      label: "Data Entry",           icon: Database      },
];

const roleColors: Record<string, string> = {
  superadmin: "#d4a017", manager: "#a78bfa", analyst: "#06b6d4", sales: "#22c55e",
};

/* ── Add User Modal ── */
function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: User) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "analyst" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const user = await api.createUser(form);
      onCreated(user);
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#0d1629", border: "1px solid rgba(30,58,95,0.6)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
          <h3 className="text-sm font-bold text-slate-100">Add New User</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {err && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>{err}</p>}
          {[
            { label: "Full Name",      key: "name",     type: "text",     placeholder: "John Okafor"          },
            { label: "Email Address",  key: "email",    type: "email",    placeholder: "j.okafor@oilintel.com" },
            { label: "Password",       key: "password", type: "password", placeholder: "••••••••"              },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{f.label}</label>
              <input type={f.type} required placeholder={f.placeholder}
                value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-xs outline-none"
                style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "#e2e8f0" }} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Role</label>
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none"
              style={{ background: "rgba(13,22,41,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "#e2e8f0" }}>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs"
              style={{ background: "rgba(30,58,95,0.3)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#000", opacity: saving ? 0.7 : 1 }}>
              {saving && <Loader2 size={12} className="animate-spin" />}
              {saving ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab]   = useState("users");
  const [users, setUsers]           = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [approvals, setApprovals]   = useState(pendingApprovals);
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    api.users()
      .then(setUsers)
      .catch(() => null)
      .finally(() => setLoadingUsers(false));
  }, []);

  const toggleUser = async (id: string, active: boolean) => {
    try {
      await api.updateUser(id, { active: !active });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
    } catch {}
  };

  const deleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <MainLayout title="Admin Panel">
      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 p-1.5 rounded-xl overflow-x-auto"
        style={{ background: "rgba(8,14,31,0.8)", border: "1px solid rgba(30,58,95,0.4)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={{ color: activeTab === t.id ? "#fff" : "var(--text-muted)" }}>
            {activeTab === t.id && (
              <motion.div layoutId="admin-tab" className="absolute inset-0 rounded-lg"
                style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.4)" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
            )}
            <t.icon size={15} className="relative z-10" style={{ color: activeTab === t.id ? "#06b6d4" : undefined }} />
            <span className="relative z-10">{t.label}</span>
            {t.id === "approvals" && approvals.length > 0 && (
              <span className="relative z-10 text-xs px-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>{approvals.length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {/* ── USER MANAGEMENT ── */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {loadingUsers ? "Loading…" : `${users.length} users · ${users.filter((u) => u.active).length} active · from database`}
                </p>
                <button onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#000" }}>
                  <Plus size={13} /> Add User
                </button>
              </div>

              {loadingUsers ? <TableSkeleton rows={4} /> : (
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                        {["User","Email","Role","Status","Created","Actions"].map((h) => (
                          <th key={h} className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "rgba(30,58,95,0.2)" }}>
                      <AnimatePresence>
                        {users.map((u, i) => (
                          <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-slate-800/20 transition-colors" style={{ opacity: u.active ? 1 : 0.55 }}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                                  style={{ background: roleColors[u.role] || "#64748b" }}>{u.avatar}</div>
                                <span className="font-medium text-slate-200">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                                style={{ background: `${roleColors[u.role] || "#64748b"}20`, color: roleColors[u.role] || "#64748b" }}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1 text-xs" style={{ color: u.active ? "#22c55e" : "#94a3b8" }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.active ? "#22c55e" : "#94a3b8" }} />
                                {u.active ? "Active" : "Disabled"}
                              </span>
                            </td>
                            <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <button onClick={() => toggleUser(u.id, u.active)} className="p-1.5 rounded hover:bg-slate-700/50" title={u.active ? "Disable" : "Enable"}>
                                  {u.active
                                    ? <ToggleRight size={14} style={{ color: "#22c55e" }} />
                                    : <ToggleLeft  size={14} style={{ color: "#94a3b8" }} />}
                                </button>
                                <button className="p-1.5 rounded hover:bg-slate-700/50"><Edit2 size={12} style={{ color: "#06b6d4" }} /></button>
                                <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded hover:bg-slate-700/50">
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
              )}
            </div>
          )}

          {/* ── ROLES & PERMISSIONS ── */}
          {activeTab === "roles" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-5" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${r.color}20` }}>
                      <Key size={16} style={{ color: r.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{r.label}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{users.filter((u) => u.role === r.id).length} users assigned</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {r.permissions.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <CheckCircle2 size={11} style={{ color: r.color }} />{p}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── PENDING APPROVALS ── */}
          {activeTab === "approvals" && (
            <div className="space-y-3">
              <AnimatePresence>
                {approvals.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                    <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">All caught up — no pending approvals</p>
                  </motion.div>
                )}
                {approvals.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start justify-between gap-4 rounded-xl p-4"
                    style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{a.description}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        Submitted by <span style={{ color: "#06b6d4" }}>{a.submitter}</span> · {a.time}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setApprovals((p) => p.filter((x) => x.id !== a.id))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
                        Approve
                      </button>
                      <button onClick={() => setApprovals((p) => p.filter((x) => x.id !== a.id))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                        Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ── DATA ENTRY ── */}
          {activeTab === "data" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dataForms.map((form, i) => (
                <motion.div key={form.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl overflow-hidden" style={{ background: "rgba(13,22,41,0.9)", border: "1px solid rgba(30,58,95,0.5)" }}>
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left"
                    style={{ borderBottom: activeForm === form.id ? "1px solid rgba(30,58,95,0.3)" : "none" }}
                    onClick={() => setActiveForm(activeForm === form.id ? null : form.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: form.color }} />
                      <span className="text-sm font-semibold text-slate-200">{form.label}</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{activeForm === form.id ? "▲ Close" : "▼ Open"}</span>
                  </button>
                  <AnimatePresence>
                    {activeForm === form.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden">
                        <div className="p-5 space-y-3">
                          {form.fields.map((f) => (
                            <div key={f}>
                              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{f}</label>
                              <input className="w-full px-3 py-2.5 rounded-lg text-xs outline-none"
                                style={{ background: "rgba(8,14,31,0.8)", border: "1px solid rgba(30,58,95,0.5)", color: "#e2e8f0" }}
                                placeholder={`Enter ${f.toLowerCase()}`} />
                            </div>
                          ))}
                          <button onClick={handleSave}
                            className="w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 mt-2"
                            style={{ background: `linear-gradient(135deg, ${form.color}, ${form.color}cc)`, color: "#000" }}>
                            {saving ? <><Loader2 size={12} className="animate-spin" />Saving…</> : "Save Record"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showAddUser && (
          <AddUserModal
            onClose={() => setShowAddUser(false)}
            onCreated={(u) => setUsers((prev) => [...prev, u])}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
