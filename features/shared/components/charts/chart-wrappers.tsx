"use client";

import dynamic from "next/dynamic";
import { SkeletonChart } from "@/features/shared/components/feedback/skeleton-card";
import type { TrendPoint, FeatureMetric } from "@/features/shared/types";

const TrendChartInner = dynamic(
  () => import("./trend-chart").then((m) => m.TrendChart),
  { ssr: false, loading: () => <SkeletonChart /> }
);

const FeatureBarChartInner = dynamic(
  () => import("./feature-bar-chart").then((m) => m.FeatureBarChart),
  { ssr: false, loading: () => <SkeletonChart /> }
);

export function TrendChartClient({ data, title }: { data: TrendPoint[]; title?: string }) {
  return <TrendChartInner data={data} title={title} />;
}

export function FeatureBarChartClient({ data, title }: { data: FeatureMetric[]; title?: string }) {
  return <FeatureBarChartInner data={data} title={title} />;
}
