"use client";

import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardFilters } from "@/features/dashboard/hooks/use-dashboard-filters";
import { KpiCard } from "./kpi-card";
import { CustomersTable } from "./customers-table";
import { BreakdownCard } from "./breakdown-card";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/features/shared/components/feedback/skeleton-card";
import { EmptyState } from "@/features/shared/components/feedback/empty-state";
import { ErrorState } from "@/features/shared/components/feedback/error-state";
import { TrendChartClient, FeatureBarChartClient } from "@/features/shared/components/charts/chart-wrappers";
import { track } from "@/features/shared/analytics/track";
import { usePinnedCustomerIds } from "@/features/shared/data/pinned-customers-storage";
import { mergePinnedIntoTopCustomers } from "@/features/dashboard/utils/merge-pinned-top-customers";
import type { AnalyticsData, DashboardFilters } from "@/features/dashboard/types";

async function fetchDashboard(filters: DashboardFilters): Promise<AnalyticsData> {
  const params = new URLSearchParams({
    dateRange: filters.dateRange,
    region: filters.region,
    segment: filters.segment,
    feature: filters.feature,
  });
  const res = await fetch(`/api/analytics?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function DashboardContent() {
  const [filters] = useDashboardFilters();
  const pinnedIds = usePinnedCustomerIds();

  useEffect(() => {
    track("dashboard_viewed");
  }, []);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["analytics", filters],
    queryFn: () => fetchDashboard(filters),
  });

  // Memoize expensive chart dataset derivations to avoid re-running on every render.
  // Deps use `data` (not `data?.field`) so react-hooks/preserve-manual-memoization matches the compiler.
  const usageTrend = useMemo(() => data?.usageTrend ?? [], [data]);
  const featureAdoption = useMemo(() => data?.featureAdoption ?? [], [data]);
  const topCustomers = useMemo(
    () => (data?.topCustomers ? mergePinnedIntoTopCustomers(data.topCustomers, pinnedIds) : []),
    [data, pinnedIds]
  );

  if (isError) {
    return (
      <ErrorState
        description="We couldn't load the dashboard data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <section aria-label="Key performance indicators" data-testid="kpi-section">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {isPending
            ? Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
            : data!.kpis.map((kpi) => <KpiCard key={kpi.id} metric={kpi} />)}
        </div>
      </section>

      {/* Charts */}
      <section
        aria-label="Usage trends and feature adoption"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {isPending ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : data!.usageTrend.length === 0 ? (
          <div className="col-span-2">
            <EmptyState description="No trend data for the selected filters." />
          </div>
        ) : (
          <>
            <TrendChartClient data={usageTrend} title="Usage Trend" />
            <FeatureBarChartClient data={featureAdoption} title="Feature Adoption" />
          </>
        )}
      </section>

      {/* Table + Breakdown */}
      <section
        aria-label="Top customers and breakdown"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {isPending ? (
          <>
            <div className="lg:col-span-2">
              <SkeletonTable />
            </div>
            <SkeletonChart />
          </>
        ) : topCustomers.length === 0 ? (
          <div className="lg:col-span-3">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="lg:col-span-2">
              <CustomersTable customers={topCustomers} />
            </div>
            <BreakdownCard breakdowns={data!.breakdowns} />
          </>
        )}
      </section>
    </div>
  );
}
