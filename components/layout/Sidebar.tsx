"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BarChart3, Brain, Users, Settings,
  Activity, Globe, FileText, ChevronLeft, ChevronRight,
  Droplets, LogOut, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";
import { canManageUsers, canAccessCRM, isGuest } from "@/lib/permissions";

const ALL_NAV = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Dashboard",      group: "main", roles: null },
  { href: "/analytics",      icon: BarChart3,        label: "Oil Analytics",  group: "main", roles: null },
  { href: "/ai-predictions", icon: Brain,            label: "AI Predictions", group: "main", roles: null },
  { href: "/crm",            icon: Users,            label: "CRM & Marketing",group: "main", roles: ["superadmin","manager","sales"] },
  { href: "/monitoring",     icon: Activity,         label: "Live Monitoring",group: "ops",  roles: ["superadmin","manager","analyst","sales"], badge: "3" },
  { href: "/map",            icon: Globe,            label: "Global Map",     group: "ops",  roles: null },
  { href: "/reports",        icon: FileText,         label: "Reports",        group: "ops",  roles: ["superadmin","manager","analyst","sales"] },
  { href: "/admin",          icon: Settings,         label: "Admin Panel",    group: "system", roles: ["superadmin"] },
];

const GROUPS: Record<string, string> = { main: "Core Modules", ops: "Operations", system: "System" };

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  manager:    "Manager",
  analyst:    "Analyst",
  sales:      "Sales",
  guest:      "Guest",
};

const ROLE_COLORS: Record<string, string> = {
  superadmin: "#f59e0b",
  manager:    "#a78bfa",
  analyst:    "#06b6d4",
  sales:      "#34d399",
  guest:      "#64748b",
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const role = user?.role ?? "guest";
  const roleColor = ROLE_COLORS[role] ?? "#64748b";

  // Filter nav items based on role
  const navItems = ALL_NAV.filter((item) =>
    !item.roles || item.roles.includes(role)
  );

  const grouped = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex-shrink-0 h-screen flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #080e1f 0%, #050a17 100%)",
        borderRight: "1px solid rgba(30, 58, 95, 0.5)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: "rgba(30,58,95,0.5)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}>
            <Droplets size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="font-bold text-sm leading-tight gradient-text-cyan truncate">OilIntel</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Enterprise Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Guest banner */}
      <AnimatePresence>
        {!collapsed && isGuest(role) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{ background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.2)" }}
          >
            <Lock size={11} style={{ color: "#64748b" }} />
            <p className="text-xs" style={{ color: "#475569" }}>
              Read-only access.{" "}
              <Link href="/login" className="underline" style={{ color: "#64748b" }}>Sign in</Link>
              {" "}for full access.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-2">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="mb-6">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs font-semibold uppercase tracking-widest px-3 mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {GROUPS[group]}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: collapsed ? 0 : 4 }}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          active ? "text-white" : "text-slate-400 hover:text-slate-200"
                        )}
                        style={active
                          ? { background: "linear-gradient(90deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))", borderLeft: "2px solid #06b6d4" }
                          : { borderLeft: "2px solid transparent" }
                        }
                      >
                        <item.icon size={18} className="flex-shrink-0" style={{ color: active ? "#06b6d4" : undefined }} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                              className="truncate flex-1"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!collapsed && item.badge && (
                          <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(30,58,95,0.5)" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: "rgba(13,22,41,0.5)" }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}>
            {user?.avatar ?? "GU"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name ?? "Guest"}</p>
                <p className="text-xs truncate font-medium" style={{ color: roleColor }}>
                  {ROLE_LABELS[role] ?? role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={handleLogout} title="Sign out">
              <LogOut size={14} className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
        style={{ background: "#06b6d4", border: "2px solid #030712", boxShadow: "0 0 10px rgba(6,182,212,0.5)" }}
      >
        {collapsed ? <ChevronRight size={12} className="text-black" /> : <ChevronLeft size={12} className="text-black" />}
      </button>
    </motion.aside>
  );
}
