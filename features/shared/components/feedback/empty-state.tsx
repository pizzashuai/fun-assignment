import { BarChart2 } from "lucide-react";
import { cn } from "@/features/shared/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "Try adjusting your filters to see results.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      <BarChart2 className="mb-4 h-12 w-12 text-muted-foreground/40" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
