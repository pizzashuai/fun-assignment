"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import type { FeatureMetric } from "@/features/shared/types";
import { chartTooltipProps } from "./chart-tooltip-theme";

interface FeatureBarChartProps {
  data: FeatureMetric[];
  title?: string;
}

export function FeatureBarChart({
  data,
  title = "Feature Adoption",
}: FeatureBarChartProps) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.adoptionRate - a.adoptionRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              dataKey="feature"
              type="category"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value) => [`${Number(value)}%`, "Adoption Rate"]}
              {...chartTooltipProps}
            />
            <Bar dataKey="adoptionRate" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
