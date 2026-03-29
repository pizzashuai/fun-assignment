// ─── Shared filter primitives ────────────────────────────────────────────────

export type Region = "global" | "north-america" | "europe" | "asia-pacific" | "latam";
export type Segment = "enterprise" | "mid-market" | "smb" | "startup";
export type Feature =
  | "all"
  | "dashboard"
  | "reports"
  | "integrations"
  | "api"
  | "mobile";

// ─── Cross-feature chart / metric shapes ─────────────────────────────────────

export interface TrendPoint {
  date: string; // ISO date string
  value: number;
}

export interface FeatureMetric {
  feature: string;
  adoptionRate: number; // 0-100
  totalUsers: number;
  weeklyActiveUsers: number;
}
