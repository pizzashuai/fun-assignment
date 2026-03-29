import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { cn } from "@/features/shared/utils";
import type { KpiMetric } from "@/features/dashboard/types";

function formatValue(value: number, unit: KpiMetric["unit"]): string {
  if (unit === "percent") return `${value}%`;
  if (unit === "currency") return `$${value.toLocaleString()}`;
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const { label, value, unit, trend, trendDirection } = metric;

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    metric.id === "errorRate"
      ? trendDirection === "up"
        ? "text-green-600"
        : "text-red-500"
      : trendDirection === "up"
        ? "text-green-600"
        : trendDirection === "down"
          ? "text-red-500"
          : "text-muted-foreground";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-1 pt-4">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-3xl font-bold tabular-nums" aria-label={`${label}: ${formatValue(value, unit)}`}>
          {formatValue(value, unit)}
        </p>
        <p className={cn("mt-1 flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" aria-hidden />
          <span>
            {trend > 0 ? "+" : ""}
            {trend}% vs prior period
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
