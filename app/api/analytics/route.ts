import { NextRequest, NextResponse } from "next/server";
import type { DashboardFilters } from "@/features/dashboard/types";
import { fetchAnalytics } from "@/features/dashboard/api/fetch-analytics";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: Partial<DashboardFilters> = {
    dateRange: (searchParams.get("dateRange") as DashboardFilters["dateRange"]) ?? "30d",
    region: (searchParams.get("region") as DashboardFilters["region"]) ?? "global",
    segment: (searchParams.get("segment") as DashboardFilters["segment"]) ?? undefined,
    feature: (searchParams.get("feature") as DashboardFilters["feature"]) ?? "all",
  };

  const data = await fetchAnalytics(filters);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
