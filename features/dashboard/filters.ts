import type { DashboardFilters } from "@/features/dashboard/types";

export const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: "30d",
  region: "global",
  segment: "enterprise",
  feature: "all",
};

/** Parse URL search params into a validated DashboardFilters object. */
export function parseFiltersFromParams(
  searchParams: URLSearchParams | Record<string, string>
): DashboardFilters {
  const get = (key: string): string | null =>
    searchParams instanceof URLSearchParams
      ? searchParams.get(key)
      : searchParams[key] ?? null;

  return {
    dateRange:
      (get("dateRange") as DashboardFilters["dateRange"]) ??
      DEFAULT_FILTERS.dateRange,
    region:
      (get("region") as DashboardFilters["region"]) ?? DEFAULT_FILTERS.region,
    segment:
      (get("segment") as DashboardFilters["segment"]) ??
      DEFAULT_FILTERS.segment,
    feature:
      (get("feature") as DashboardFilters["feature"]) ??
      DEFAULT_FILTERS.feature,
  };
}

/** Serialize filters to URL query string. */
export function filtersToQueryString(filters: Partial<DashboardFilters>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) params.set(key, value);
  }
  return params.toString();
}
