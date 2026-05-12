export type Role = "superadmin" | "manager" | "analyst" | "sales" | "guest";

// Numeric rank — higher = more access
const RANK: Record<Role, number> = {
  superadmin: 5,
  manager:    4,
  analyst:    3,
  sales:      2,
  guest:      1,
};

export function rank(role: string): number {
  return RANK[role as Role] ?? 0;
}

// Route-level access
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/admin":      ["superadmin"],
  "/crm":        ["superadmin", "manager", "sales"],
  "/reports":    ["superadmin", "manager", "analyst", "sales"],
  "/monitoring": ["superadmin", "manager", "analyst", "sales"],
  "/map":        ["superadmin", "manager", "analyst", "sales", "guest"],
  "/analytics":  ["superadmin", "manager", "analyst", "sales", "guest"],
  "/ai-predictions": ["superadmin", "manager", "analyst", "sales", "guest"],
  "/dashboard":  ["superadmin", "manager", "analyst", "sales", "guest"],
};

export function canAccess(role: string, route: string): boolean {
  const allowed = ROUTE_ROLES[route];
  if (!allowed) return rank(role) >= RANK.analyst;
  return allowed.includes(role as Role);
}

// Feature-level flags
export function canEdit(role: string)        { return rank(role) >= RANK.analyst; }
export function canManageUsers(role: string) { return role === "superadmin"; }
export function canResolveAlerts(role: string) { return rank(role) >= RANK.manager; }
export function canGenerateReports(role: string) { return rank(role) >= RANK.analyst; }
export function canAccessCRM(role: string)   { return ["superadmin","manager","sales"].includes(role); }
export function isGuest(role: string)        { return role === "guest"; }
export function isAdmin(role: string)        { return role === "superadmin"; }
