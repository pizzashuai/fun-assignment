import { SkeletonChart, SkeletonTable } from "@/features/shared/components/feedback/skeleton-card";
import { Skeleton } from "@/features/shared/components/ui/skeleton";

export default function CustomerLoading() {
  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-36 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonTable />
      </div>
    </main>
  );
}
