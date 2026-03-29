import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/features/shared/utils";
import type { CustomerSummary } from "@/features/customers/types";

interface HealthBadgeProps {
  score: number;
  riskLevel: CustomerSummary["riskLevel"];
}

const riskStyles: Record<CustomerSummary["riskLevel"], string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function HealthBadge({ score, riskLevel }: HealthBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        className={cn(
          "capitalize border-0 text-xs font-medium",
          riskStyles[riskLevel]
        )}
        aria-label={`Risk level: ${riskLevel}`}
      >
        {riskLevel} risk
      </Badge>
      <span className="text-sm text-muted-foreground" aria-label={`Health score: ${score}/100`}>
        Health: <span className="font-semibold text-foreground">{score}/100</span>
      </span>
    </div>
  );
}
