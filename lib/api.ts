const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("oil_token");
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Analytics
  summary:    () => apiFetch("/api/analytics/summary"),
  prices:     (days = 30) => apiFetch(`/api/analytics/prices?days=${days}`),
  production: (region?: string) => apiFetch(`/api/analytics/production${region ? `?region=${region}` : ""}`),
  refineries: () => apiFetch("/api/analytics/refineries"),
  exports:    () => apiFetch("/api/analytics/export"),

  // Monitoring
  alerts:       (resolved?: boolean) => apiFetch(`/api/monitoring/alerts${resolved !== undefined ? `?resolved=${resolved}` : ""}`),
  resolveAlert: (id: string) => apiFetch(`/api/monitoring/alerts/${id}/resolve`, { method: "PATCH" }),
  live:         () => apiFetch("/api/monitoring/live"),

  // Reports
  reports:        () => apiFetch("/api/reports"),
  generateReport: (name: string, type: string) => apiFetch("/api/reports/generate", { method: "POST", body: JSON.stringify({ name, type }) }),
  deleteReport:   (id: string) => apiFetch(`/api/reports/${id}`, { method: "DELETE" }),

  // Admin
  users:      () => apiFetch("/api/admin/users"),
  createUser: (data: any) => apiFetch("/api/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) => apiFetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteUser: (id: string) => apiFetch(`/api/admin/users/${id}`, { method: "DELETE" }),
};
