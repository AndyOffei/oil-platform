"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion, AnimatePresence, useMotionValue,
  useTransform, animate,
} from "framer-motion";
import {
  Droplets, Eye, EyeOff, Mail, Lock,
  AlertCircle, Loader2, ShieldCheck, ArrowRight,
  TrendingUp, Globe2, BarChart3, Zap,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { Eye as EyeIcon } from "lucide-react";

/* ── animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2,
      delay: 0.8,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const STATS = [
  { icon: TrendingUp, label: "Assets Tracked",    value: 2.4,   suffix: "B",   prefix: "$" },
  { icon: Globe2,     label: "Countries Active",   value: 38,    suffix: "",    prefix: ""  },
  { icon: BarChart3,  label: "Forecast Accuracy",  value: 94,    suffix: "%",   prefix: ""  },
  { icon: Zap,        label: "Live Data Streams",  value: 512,   suffix: "+",   prefix: ""  },
];

const ROLES = [
  { label: "Super Admin",   email: "admin@oilintel.com",    color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" },
  { label: "Manager",       email: "a.hassan@oilintel.com", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  { label: "Analyst",       email: "j.okafor@oilintel.com", color: "#06b6d4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.25)"  },
];

/* ── floating particle ── */
function Particle({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, opacity: 0 }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

const PARTICLES = [
  { x: "10%", y: "20%", size: 3, delay: 0,   color: "rgba(6,182,212,0.8)"   },
  { x: "80%", y: "15%", size: 2, delay: 1.2, color: "rgba(212,160,23,0.8)"  },
  { x: "25%", y: "70%", size: 4, delay: 0.5, color: "rgba(6,182,212,0.6)"   },
  { x: "70%", y: "60%", size: 2, delay: 2,   color: "rgba(212,160,23,0.6)"  },
  { x: "50%", y: "85%", size: 3, delay: 1.5, color: "rgba(6,182,212,0.7)"   },
  { x: "90%", y: "40%", size: 2, delay: 0.8, color: "rgba(167,139,250,0.7)" },
  { x: "5%",  y: "50%", size: 3, delay: 2.5, color: "rgba(212,160,23,0.5)"  },
];

/* ── input field ── */
function Field({
  label, type, value, onChange, placeholder, icon: Icon,
  right, delay,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  icon: any; right?: React.ReactNode; delay: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>{label}</label>
        {right}
      </div>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 3px rgba(6,182,212,0.18), 0 1px 3px rgba(0,0,0,0.4)"
            : "0 1px 3px rgba(0,0,0,0.3)",
        }}
        className="relative rounded-xl overflow-hidden"
        style={{
          border: focused ? "1.5px solid rgba(6,182,212,0.8)" : "1.5px solid rgba(71,85,105,0.9)",
          background: "rgba(8,15,30,0.95)",
          transition: "border-color 0.2s",
        }}
      >
        <Icon
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? "#06b6d4" : "#334155" }}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          autoComplete={type === "email" ? "email" : "current-password"}
          className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm outline-none"
          style={{
            color: "#e2e8f0",
            caretColor: "#06b6d4",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest, isAuthenticated, hydrate } = useAuthStore();
  const [email, setEmail]       = useState("admin@oilintel.com");
  const [password, setPassword] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { if (isAuthenticated) router.replace("/dashboard"); }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#04080f" }}>

      {/* ═══════════════════════════════════════
          LEFT  —  Brand Panel
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[54%] flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #020a18 0%, #04111f 55%, #030c1a 100%)" }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: [
            "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "60px 60px",
        }} />

        {/* Glows */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 65%)" }} />

        {/* Particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Right separator */}
        <div className="absolute right-0 inset-y-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(6,182,212,0.2) 30%, rgba(6,182,212,0.2) 70%, transparent 100%)" }} />

        {/* Logo bar */}
        <div className="relative z-10 p-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 40px rgba(6,182,212,0.5)", "0 0 20px rgba(6,182,212,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" }}
            >
              <Droplets size={20} className="text-white" />
            </motion.div>
            <div>
              <p className="text-base font-bold text-white tracking-wide">OilIntel</p>
              <p className="text-xs" style={{ color: "#334155" }}>Enterprise Platform</p>
            </div>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}>
              v4.1
            </span>
          </motion.div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.25em] mb-5"
            style={{ color: "#06b6d4" }}
          >
            ● Global Energy Intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="text-4xl xl:text-5xl font-extrabold leading-[1.12] mb-6"
            style={{ color: "#f1f5f9", letterSpacing: "-0.03em" }}
          >
            The Nerve Centre<br />
            of{" "}
            <span style={{
              background: "linear-gradient(90deg, #06b6d4 0%, #d4a017 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Oil Operations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-base leading-relaxed mb-12 max-w-md"
            style={{ color: "#475569" }}
          >
            Real-time production analytics, AI price forecasting, and end-to-end
            CRM — built for the modern energy enterprise.
          </motion.p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-5 mb-12">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.12)" }}>
                    <s.icon size={13} style={{ color: "#06b6d4" }} />
                  </div>
                  <span className="text-xs" style={{ color: "#334155" }}>{s.label}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>
                  {s.prefix}
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-8" style={{ background: "linear-gradient(to right, rgba(30,58,95,0.6), transparent)" }} />

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex gap-4 items-start"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{ background: "rgba(212,160,23,0.12)", color: "#d4a017", border: "1px solid rgba(212,160,23,0.2)" }}>
              A
            </div>
            <div>
              <p className="text-sm italic leading-relaxed" style={{ color: "#64748b" }}>
                "OilIntel transformed how we monitor production across 12 fields —
                live data, one screen."
              </p>
              <p className="text-xs mt-2 font-semibold" style={{ color: "#334155" }}>
                A. Hassan · VP Operations, Agbami Energy
              </p>
            </div>
          </motion.div>
        </div>

        {/* Security badges */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative z-10 px-12 pb-10 flex items-center gap-6"
        >
          {["ISO 27001", "SOC 2 Type II", "256-bit TLS"].map((b) => (
            <div key={b} className="flex items-center gap-1.5">
              <ShieldCheck size={12} style={{ color: "#1e3a5f" }} />
              <span className="text-xs" style={{ color: "#1e3a5f" }}>{b}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════
          RIGHT  —  Login Form
      ═══════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center px-5 py-10 relative"
        style={{ background: "linear-gradient(160deg, #05090f 0%, #060b14 100%)" }}
      >
        {/* Soft radial glow behind the card */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full" style={{ maxWidth: "420px" }}>

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden flex items-center gap-2.5 mb-8"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
              <Droplets size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">OilIntel</span>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-8"
            style={{
              background: "rgba(13,22,40,0.95)",
              border: "1px solid rgba(30,58,95,0.7)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-1.5" style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                Welcome back
              </h2>
              <p className="text-sm" style={{ color: "#475569" }}>
                Sign in to your OilIntel workspace
              </p>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm overflow-hidden"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email field */}
                <Field
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@company.com"
                  icon={Mail}
                  delay={0.2}
                />

                {/* Password field */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>Password</label>
                    <button type="button"
                      className="text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: "#06b6d4" }}>
                      Forgot password?
                    </button>
                  </div>
                  <PasswordInput value={password} onChange={setPassword} show={showPass} onToggle={() => setShowPass(!showPass)} />
                </motion.div>

                {/* Sign in button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                  className="pt-1 space-y-3"
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.015, boxShadow: "0 8px 32px rgba(6,182,212,0.35)" } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all"
                    style={{
                      background: loading ? "rgba(6,182,212,0.3)" : "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                      color: "#fff",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(6,182,212,0.3)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Authenticating…</>
                    ) : (
                      <><span>Sign In</span><ArrowRight size={15} /></>
                    )}
                  </motion.button>

                  {/* Guest access */}
                  <motion.button
                    type="button"
                    onClick={() => { loginAsGuest(); router.replace("/dashboard"); }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(71,85,105,0.5)",
                      color: "#64748b",
                    }}
                  >
                    <EyeIcon size={14} />
                    Continue as Guest
                    <span className="text-xs px-1.5 py-0.5 rounded-full ml-1"
                      style={{ background: "rgba(100,116,139,0.15)", color: "#475569" }}>
                      Read-only
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 my-6"
            >
              <div className="flex-1 h-px" style={{ background: "rgba(30,58,95,0.6)" }} />
              <span className="text-xs font-medium px-1" style={{ color: "#1e3a5f" }}>Quick Access</span>
              <div className="flex-1 h-px" style={{ background: "rgba(30,58,95,0.6)" }} />
            </motion.div>

            {/* Role cards */}
            <div className="space-y-2">
              {ROLES.map((r, i) => (
                <motion.button
                  key={r.email}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08, duration: 0.35 }}
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                  onClick={() => { setEmail(r.email); setPassword("password"); setError(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                  style={{ background: "rgba(15,23,42,0.6)", border: `1px solid ${r.border}` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: r.bg, color: r.color }}>
                    {r.label[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{r.label}</p>
                    <p className="text-xs truncate" style={{ color: "#334155" }}>{r.email}</p>
                  </div>
                  <ArrowRight size={13} style={{ color: r.color, opacity: 0.7 }} />
                </motion.button>
              ))}
            </div>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="text-center mt-6 text-xs"
              style={{ color: "#1e3a5f" }}
            >
              All demo accounts use password:{" "}
              <span className="font-mono font-semibold" style={{ color: "#334155" }}>password</span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── standalone password input to isolate focus state ── */
function PasswordInput({
  value, onChange, show, onToggle,
}: {
  value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 3px rgba(6,182,212,0.18), 0 1px 3px rgba(0,0,0,0.4)"
          : "0 1px 3px rgba(0,0,0,0.3)",
      }}
      className="relative rounded-xl overflow-hidden"
      style={{
        border: focused ? "1.5px solid rgba(6,182,212,0.8)" : "1.5px solid rgba(71,85,105,0.9)",
        background: "rgba(8,15,30,0.95)",
        transition: "border-color 0.2s",
      }}
    >
      <Lock
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
        style={{ color: focused ? "#06b6d4" : "#334155" }}
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="••••••••••"
        required
        autoComplete="current-password"
        className="w-full bg-transparent pl-11 pr-12 py-3.5 text-sm outline-none"
        style={{ color: "#e2e8f0", caretColor: "#06b6d4" }}
      />
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded"
        style={{ color: "#334155" }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </motion.button>
    </motion.div>
  );
}
