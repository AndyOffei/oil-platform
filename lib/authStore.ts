import { create } from "zustand";

interface User {
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
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("oil_token");
    const user = localStorage.getItem("oil_user");
    if (token && user) {
      document.cookie = `oilintel_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      set({ token, user: JSON.parse(user), isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    // Try the real backend first; fall back to mock if server is unreachable
    let data: { token: string; user: User };
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
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
      // If server is unreachable (network error), use mock auth
      if (err instanceof TypeError && err.message.includes("fetch")) {
        data = mockLogin(email, password);
      } else {
        throw err;
      }
    }
    localStorage.setItem("oil_token", data.token);
    localStorage.setItem("oil_user", JSON.stringify(data.user));
    document.cookie = `oilintel_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("oil_token");
    localStorage.removeItem("oil_user");
    document.cookie = "oilintel_token=; path=/; max-age=0";
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

const MOCK_USERS: Record<string, { id: string; name: string; email: string; role: string; avatar: string }> = {
  "admin@oilintel.com":    { id: "1", name: "Admin User",     email: "admin@oilintel.com",    role: "superadmin", avatar: "AD" },
  "j.okafor@oilintel.com": { id: "2", name: "James Okafor",   email: "j.okafor@oilintel.com", role: "analyst",    avatar: "JO" },
  "a.hassan@oilintel.com": { id: "3", name: "Amina Hassan",   email: "a.hassan@oilintel.com", role: "manager",    avatar: "AH" },
  "s.chen@oilintel.com":   { id: "4", name: "Sarah Chen",     email: "s.chen@oilintel.com",   role: "sales",      avatar: "SC" },
};

function mockLogin(email: string, password: string): { token: string; user: typeof MOCK_USERS[string] } {
  const user = MOCK_USERS[email.toLowerCase()];
  if (!user || password !== "password") throw new Error("Invalid email or password.");
  return { token: "mock-jwt-token-" + user.id, user };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("oil_token");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`http://localhost:4000${path}`, {
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
