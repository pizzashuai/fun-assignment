import type { DashboardFilters } from "@/features/dashboard/types";
import { buildAnalyticsPayload } from "@/features/dashboard/data/transforms";
import { simulateLatency } from "@/features/shared/api/simulate-latency";

export async function fetchAnalytics(filters: Partial<DashboardFilters>) {
  await simulateLatency();
  return buildAnalyticsPayload(filters);
}
