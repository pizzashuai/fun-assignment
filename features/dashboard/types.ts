import type {
  Feature,
  FeatureMetric,
  Region,
  Segment,
  TrendPoint,
} from "@/features/shared/types";
import type { CustomerSummary } from "@/features/customers/types";

export interface DashboardFilters {
  dateRange: "7d" | "30d" | "90d" | "custom";
  region: Region;
  segment: Segment;
  feature: Feature;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  unit: "number" | "percent" | "currency";
  trend: number; // percentage change vs prior period
  trendDirection: "up" | "down" | "neutral";
}

export interface BreakdownItem {
  label: string;
  value: number;
  percent: number;
}

export interface BreakdownData {
  dimension: string;
  items: BreakdownItem[];
}

export interface Breakdowns {
  device: BreakdownData;
  browser: BreakdownData;
  platform: BreakdownData;
}

export interface AnalyticsData {
  kpis: KpiMetric[];
  usageTrend: TrendPoint[];
  featureAdoption: FeatureMetric[];
  topCustomers: CustomerSummary[];
  /** @deprecated use `breakdowns` for multi-dimensional breakdown */
  breakdown: BreakdownData;
  breakdowns: Breakdowns;
  filters: DashboardFilters;
}
