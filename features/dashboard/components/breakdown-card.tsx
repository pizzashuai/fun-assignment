import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui/tabs";
import type { Breakdowns, BreakdownData } from "@/features/dashboard/types";

const BAR_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

function BreakdownBars({ data }: { data: BreakdownData }) {
  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground tabular-nums">{item.percent}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={item.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${item.label}: ${item.percent}%`}
          >
            <div
              className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface BreakdownCardProps {
  breakdowns: Breakdowns;
}

export function BreakdownCard({ breakdowns }: BreakdownCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="device">
          <TabsList className="mb-4 h-8 w-full text-xs">
            <TabsTrigger value="device" className="flex-1 text-xs py-1">Device</TabsTrigger>
            <TabsTrigger value="browser" className="flex-1 text-xs py-1">Browser</TabsTrigger>
            <TabsTrigger value="platform" className="flex-1 text-xs py-1">Platform</TabsTrigger>
          </TabsList>
          <TabsContent value="device">
            <BreakdownBars data={breakdowns.device} />
          </TabsContent>
          <TabsContent value="browser">
            <BreakdownBars data={breakdowns.browser} />
          </TabsContent>
          <TabsContent value="platform">
            <BreakdownBars data={breakdowns.platform} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
