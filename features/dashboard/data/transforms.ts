import type { KpiMetric, DashboardFilters } from "@/features/dashboard/types";
import {
  getFilteredCustomers,
  getGlobalUsageTrend,
  getGlobalFeatureAdoption,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getPlatformBreakdown,
  getKpiValues,
} from "@/features/shared/data/fixtures";
export function buildKpis(filters: Partial<DashboardFilters>): KpiMetric[] {
  const customers = getFilteredCustomers(filters);
  const { mau, dau, retentionRate, conversionRate, errorRate } = getKpiValues(customers);

  const days = filters.dateRange === "7d" ? 7 : filters.dateRange === "90d" ? 90 : 30;
  const prevCustomers = getFilteredCustomers({ ...filters, dateRange: "90d" });
  const { mau: prevMau } = getKpiValues(prevCustomers);
  const mauTrend =
    prevMau > 0 ? +(((mau - prevMau * 0.9) / (prevMau * 0.9)) * 100).toFixed(1) : 0;

  return [
    {
      id: "mau",
      label: "Monthly Active Users",
      value: mau,
      unit: "number",
      trend: mauTrend,
      trendDirection: mauTrend >= 0 ? "up" : "down",
    },
    {
      id: "dau",
      label: "Daily Active Users",
      value: dau,
      unit: "number",
      trend: +(mauTrend * 0.9).toFixed(1),
      trendDirection: mauTrend >= 0 ? "up" : "down",
    },
    {
      id: "retention",
      label: "Retention Rate",
      value: retentionRate,
      unit: "percent",
      trend: 2.4,
      trendDirection: "up",
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: conversionRate,
      unit: "percent",
      trend: -1.1,
      trendDirection: "down",
    },
    {
      id: "errorRate",
      label: "Error Rate",
      value: errorRate,
      unit: "percent",
      trend: -0.3,
      trendDirection: "up", // down is good for errors, but we track as 'up' improvement
    },
  ];
  void days;
}

export function buildAnalyticsPayload(filters: Partial<DashboardFilters>) {
  const days =
    filters.dateRange === "7d" ? 7 : filters.dateRange === "90d" ? 90 : 30;

  const device = getDeviceBreakdown();
  const browser = getBrowserBreakdown();
  const platform = getPlatformBreakdown();

  const topCustomers = getFilteredCustomers(filters).slice(0, 8);

  return {
    kpis: buildKpis(filters),
    usageTrend: getGlobalUsageTrend(days),
    featureAdoption: getGlobalFeatureAdoption(filters),
    topCustomers,
    breakdown: device,
    breakdowns: { device, browser, platform },
    filters: {
      dateRange: filters.dateRange ?? "30d",
      region: filters.region ?? "global",
      segment: filters.segment ?? "enterprise",
      feature: filters.feature ?? "all",
    },
  };
}
