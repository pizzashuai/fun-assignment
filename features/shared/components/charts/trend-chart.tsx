"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import type { TrendPoint } from "@/features/shared/types";
import { chartTooltipProps } from "./chart-tooltip-theme";

interface TrendChartProps {
  data: TrendPoint[];
  title?: string;
}

export function TrendChart({ data, title = "Usage Trend" }: TrendChartProps) {
  if (!data.length) return null;

  const formatted = data.map((p) => ({
    ...p,
    label: format(parseISO(p.date), "MMM d"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            />
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString(), "Active Users"]}
              {...chartTooltipProps}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
