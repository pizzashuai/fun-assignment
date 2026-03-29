import { subDays, format } from "date-fns";
import type { CustomerDetail, CustomerEvent, CustomerSummary } from "@/features/customers/types";
import type { DashboardFilters } from "@/features/dashboard/types";
import type { FeatureMetric, TrendPoint } from "@/features/shared/types";

// ─── Helpers (must be defined before CUSTOMERS) ───────────────────────────────

function generateTrend(days: number, base: number, delta: number): TrendPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");
    const progress = i / (days - 1);
    const noise = (Math.random() - 0.5) * base * 0.08;
    const value = Math.max(0, Math.round(base + delta * progress + noise));
    return { date, value };
  });
}

function featureMetrics(features: string[]): FeatureMetric[] {
  return features.map((feature) => ({
    feature,
    adoptionRate: Math.round(30 + Math.random() * 65),
    totalUsers: Math.round(200 + Math.random() * 5000),
    weeklyActiveUsers: Math.round(50 + Math.random() * 2000),
  }));
}

const EVENT_TYPES: Array<CustomerEvent["type"]> = [
  "login",
  "feature_use",
  "export",
  "api_call",
  "support_ticket",
  "upgrade",
];

const EVENT_DESCRIPTIONS: Record<CustomerEvent["type"], string> = {
  login: "User signed in",
  feature_use: "Used dashboard analytics",
  export: "Exported usage report as CSV",
  api_call: "Triggered API endpoint",
  support_ticket: "Opened support ticket #4821",
  upgrade: "Upgraded plan tier",
};

function generateEvents(customerId: string, count: number): CustomerEvent[] {
  return Array.from({ length: count }, (_, i) => {
    const type = EVENT_TYPES[i % EVENT_TYPES.length];
    return {
      id: `evt-${customerId}-${i}`,
      customerId,
      type,
      description: EVENT_DESCRIPTIONS[type],
      timestamp: subDays(new Date(), i).toISOString(),
    };
  });
}

// ─── Seed customers ───────────────────────────────────────────────────────────

export const CUSTOMERS: CustomerDetail[] = [
  {
    id: "cust-001",
    name: "Acme Corp",
    segment: "enterprise",
    region: "north-america",
    plan: "enterprise",
    mau: 12400,
    retentionRate: 94,
    healthScore: 87,
    riskLevel: "low",
    mrr: 45000,
    joinedAt: "2022-03-15",
    usageTrend: generateTrend(90, 10000, 1400),
    topFeatures: featureMetrics(["dashboard", "reports", "api", "integrations"]),
    recentEvents: generateEvents("cust-001", 10),
  },
  {
    id: "cust-002",
    name: "Globex Industries",
    segment: "enterprise",
    region: "europe",
    plan: "enterprise",
    mau: 9800,
    retentionRate: 88,
    healthScore: 72,
    riskLevel: "medium",
    mrr: 38000,
    joinedAt: "2021-11-02",
    usageTrend: generateTrend(90, 8000, 900),
    topFeatures: featureMetrics(["reports", "mobile", "dashboard"]),
    recentEvents: generateEvents("cust-002", 8),
  },
  {
    id: "cust-003",
    name: "Initech LLC",
    segment: "mid-market",
    region: "north-america",
    plan: "growth",
    mau: 3200,
    retentionRate: 79,
    healthScore: 58,
    riskLevel: "high",
    mrr: 12000,
    joinedAt: "2023-01-20",
    usageTrend: generateTrend(90, 2800, -200),
    topFeatures: featureMetrics(["dashboard", "api"]),
    recentEvents: generateEvents("cust-003", 6),
  },
  {
    id: "cust-004",
    name: "Umbrella Analytics",
    segment: "enterprise",
    region: "asia-pacific",
    plan: "enterprise",
    mau: 15600,
    retentionRate: 96,
    healthScore: 93,
    riskLevel: "low",
    mrr: 62000,
    joinedAt: "2020-07-08",
    usageTrend: generateTrend(90, 13000, 2200),
    topFeatures: featureMetrics(["api", "integrations", "reports", "dashboard", "mobile"]),
    recentEvents: generateEvents("cust-004", 12),
  },
  {
    id: "cust-005",
    name: "Hooli SaaS",
    segment: "startup",
    region: "north-america",
    plan: "starter",
    mau: 420,
    retentionRate: 65,
    healthScore: 41,
    riskLevel: "high",
    mrr: 990,
    joinedAt: "2024-02-14",
    usageTrend: generateTrend(90, 380, -60),
    topFeatures: featureMetrics(["dashboard"]),
    recentEvents: generateEvents("cust-005", 4),
  },
  {
    id: "cust-006",
    name: "Massive Dynamic",
    segment: "mid-market",
    region: "europe",
    plan: "growth",
    mau: 4700,
    retentionRate: 83,
    healthScore: 76,
    riskLevel: "low",
    mrr: 18500,
    joinedAt: "2022-09-01",
    usageTrend: generateTrend(90, 4200, 500),
    topFeatures: featureMetrics(["reports", "dashboard", "mobile"]),
    recentEvents: generateEvents("cust-006", 7),
  },
  {
    id: "cust-007",
    name: "Stark Industries",
    segment: "enterprise",
    region: "north-america",
    plan: "enterprise",
    mau: 21000,
    retentionRate: 97,
    healthScore: 95,
    riskLevel: "low",
    mrr: 85000,
    joinedAt: "2019-05-22",
    usageTrend: generateTrend(90, 18000, 3000),
    topFeatures: featureMetrics(["api", "integrations", "dashboard", "reports"]),
    recentEvents: generateEvents("cust-007", 15),
  },
  {
    id: "cust-008",
    name: "Rekall Corp",
    segment: "smb",
    region: "latam",
    plan: "growth",
    mau: 1100,
    retentionRate: 71,
    healthScore: 63,
    riskLevel: "medium",
    mrr: 4200,
    joinedAt: "2023-06-11",
    usageTrend: generateTrend(90, 950, 80),
    topFeatures: featureMetrics(["mobile", "dashboard"]),
    recentEvents: generateEvents("cust-008", 5),
  },
];

// ─── Aggregate helpers ────────────────────────────────────────────────────────

export function getFilteredCustomers(
  filters: Partial<DashboardFilters>
): CustomerSummary[] {
  let customers: CustomerSummary[] = CUSTOMERS.map((c) => ({ ...c }));

  if (filters.region && filters.region !== "global") {
    customers = customers.filter((c) => c.region === filters.region);
  }
  if (filters.segment) {
    customers = customers.filter((c) => c.segment === filters.segment);
  }

  return customers;
}

export function getGlobalUsageTrend(days: number): TrendPoint[] {
  const allTrends = CUSTOMERS.flatMap((c) => c.usageTrend.slice(-days));
  const byDate = new Map<string, number>();
  for (const pt of allTrends) {
    byDate.set(pt.date, (byDate.get(pt.date) ?? 0) + pt.value);
  }
  return Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}

export function getGlobalFeatureAdoption(
  filters: Partial<DashboardFilters>
): FeatureMetric[] {
  const customers = getFilteredCustomers(filters);
  const featureMap = new Map<string, { total: number; users: number; wau: number }>();

  for (const c of customers) {
    const detail = CUSTOMERS.find((d) => d.id === c.id);
    if (!detail) continue;
    for (const f of detail.topFeatures) {
      const existing = featureMap.get(f.feature) ?? { total: 0, users: 0, wau: 0 };
      featureMap.set(f.feature, {
        total: existing.total + 1,
        users: existing.users + f.totalUsers,
        wau: existing.wau + f.weeklyActiveUsers,
      });
    }
  }

  return Array.from(featureMap.entries()).map(([feature, stats]) => ({
    feature,
    adoptionRate: Math.round((stats.total / Math.max(customers.length, 1)) * 100),
    totalUsers: stats.users,
    weeklyActiveUsers: stats.wau,
  }));
}

export function getKpiValues(customers: CustomerSummary[]) {
  if (customers.length === 0) {
    return { mau: 0, dau: 0, retentionRate: 0, conversionRate: 0, errorRate: 0 };
  }

  const mau = customers.reduce((s, c) => s + c.mau, 0);
  const dau = Math.round(mau * 0.12);
  const retentionRate = Math.round(
    customers.reduce((s, c) => s + c.retentionRate, 0) / customers.length
  );
  const conversionRate = Math.round(12 + Math.random() * 8);
  const errorRate = +(1.2 + Math.random() * 0.8).toFixed(1);

  return { mau, dau, retentionRate, conversionRate, errorRate };
}

export function getDeviceBreakdown() {
  return {
    dimension: "Device",
    items: [
      { label: "Desktop", value: 5820, percent: 58 },
      { label: "Mobile", value: 2500, percent: 25 },
      { label: "Tablet", value: 1700, percent: 17 },
    ],
  };
}

export function getBrowserBreakdown() {
  return {
    dimension: "Browser",
    items: [
      { label: "Chrome", value: 6240, percent: 62 },
      { label: "Safari", value: 1800, percent: 18 },
      { label: "Firefox", value: 1100, percent: 11 },
      { label: "Edge", value: 760, percent: 8 },
      { label: "Other", value: 100, percent: 1 },
    ],
  };
}

export function getPlatformBreakdown() {
  return {
    dimension: "Platform",
    items: [
      { label: "Windows", value: 4500, percent: 45 },
      { label: "macOS", value: 2700, percent: 27 },
      { label: "iOS", value: 1500, percent: 15 },
      { label: "Android", value: 900, percent: 9 },
      { label: "Linux", value: 400, percent: 4 },
    ],
  };
}

/** @deprecated use getDeviceBreakdown / getBrowserBreakdown / getPlatformBreakdown */
export function getBreakdown() {
  return getDeviceBreakdown();
}

export function getCustomerById(id: string): CustomerDetail | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}
