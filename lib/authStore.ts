import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  hydrate: () => void;
}

const GUEST_USER: User = {
  id: "guest",
  name: "Guest User",
  email: "guest@oilintel.com",
  role: "guest",
  avatar: "GU",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("oil_token");
    const user  = localStorage.getItem("oil_user");
    if (token && user) {
      document.cookie = `oilintel_token=${token}; path=/; max-age=28800; SameSite=Lax`;
      set({ token, user: JSON.parse(user), isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    let data: { token: string; user: User };
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
      data = await res.json();
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        data = mockLogin(email, password);
      } else {
        throw err;
      }
    }
    persistSession(data.token, data.user);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  loginAsGuest: () => {
    const token = "guest-session-token";
    persistSession(token, GUEST_USER);
    set({ token, user: GUEST_USER, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("oil_token");
    localStorage.removeItem("oil_user");
    document.cookie = "oilintel_token=; path=/; max-age=0";
    document.cookie = "oil_user=; path=/; max-age=0";
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

function persistSession(token: string, user: User) {
  localStorage.setItem("oil_token", token);
  localStorage.setItem("oil_user", JSON.stringify(user));
  const maxAge = 28800;
  document.cookie = `oilintel_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `oil_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// ── Mock auth (fallback when backend unreachable) ─────────────────────────────
const MOCK_USERS: Record<string, User> = {
  "admin@oilintel.com":    { id: "usr_1", name: "Bright Offei",    email: "admin@oilintel.com",    role: "superadmin", avatar: "BO" },
  "j.okafor@oilintel.com": { id: "usr_2", name: "John Okafor",     email: "j.okafor@oilintel.com", role: "analyst",    avatar: "JO" },
  "a.hassan@oilintel.com": { id: "usr_3", name: "Gloria Gyamfuah", email: "a.hassan@oilintel.com", role: "manager",    avatar: "GG" },
  "s.mensah@oilintel.com": { id: "usr_4", name: "Samuel Mensah",   email: "s.mensah@oilintel.com", role: "sales",      avatar: "SM" },
};

function mockLogin(email: string, password: string): { token: string; user: User } {
  const user = MOCK_USERS[email.toLowerCase()];
  if (!user || password !== "password") throw new Error("Invalid credentials.");
  return { token: "mock-jwt-" + user.id, user };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("oil_token");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).error || "Request failed");
  return res.json();
}
