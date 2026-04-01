"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";

interface ChartSectionProps {
  title: string;
  description?: string;
  chart: ReactNode;
  editor: ReactNode;
}

export function ChartSection({ title, description, chart, editor }: ChartSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {chart}
        {editor}
      </CardContent>
    </Card>
  );
}
