import { Suspense } from "react";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { FilterPanel } from "@/features/dashboard/components/filter-panel";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { SkeletonCard } from "@/features/shared/components/feedback/skeleton-card";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import { parseFiltersFromParams } from "@/features/dashboard/filters";
import { buildAnalyticsPayload } from "@/features/dashboard/data/transforms";
import { isFeatureEnabled } from "@/features/shared/feature-flags";

export const metadata = {
  title: "Dashboard — Analytics",
};

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFiltersFromParams(params);

  // Prefetch on the server so the first paint already has KPI data.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["analytics", filters],
    queryFn: () => buildAnalyticsPayload(filters),
  });

  const showOpsBanner = isFeatureEnabled("opsBanner");

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Feature-flag-gated ops banner (enable via NEXT_PUBLIC_FEATURE_FLAGS=opsBanner) */}
        {showOpsBanner && (
          <div
            role="alert"
            className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200"
          >
            <strong>Ops notice:</strong> Scheduled maintenance window on Saturday 02:00–04:00 UTC. Data may be delayed.
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor adoption, engagement, and feature usage across customers.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {/* FilterPanel is a client component that reads/writes URL params */}
            <Suspense fallback={null}>
              <FilterPanel />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>

        {/* Main content — re-fetches on filter change via TanStack Query */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            }
          >
            <DashboardContent />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}
