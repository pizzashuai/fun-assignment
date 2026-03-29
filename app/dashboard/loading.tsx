import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/features/shared/components/feedback/skeleton-card";

export default function DashboardLoading() {
  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-56 rounded-md bg-muted animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonTable />
          </div>
          <SkeletonChart />
        </div>
      </div>
    </main>
  );
}
