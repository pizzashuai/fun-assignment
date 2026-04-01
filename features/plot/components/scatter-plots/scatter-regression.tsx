"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { scatterRegressionData, type ScatterDataPoint } from "../../data/mock-data";

function linearRegression(points: ScatterDataPoint[]) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function ScatterRegression() {
  const [data, setData] = useState<ScatterDataPoint[]>(scatterRegressionData);

  const updatePoint = (index: number, field: "x" | "y", value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const { slope, intercept } = useMemo(() => linearRegression(data), [data]);

  const regLine = useMemo(() => {
    const xs = [0, 24];
    return xs.map((x) => ({ x, y: slope * x + intercept, regY: slope * x + intercept }));
  }, [slope, intercept]);

  const combined = useMemo(
    () => [...data.map((d) => ({ ...d, regY: undefined as number | undefined })), ...regLine.map((d) => ({ ...d, y: undefined as number | undefined }))],
    [data, regLine]
  );

  const fields = data.flatMap((d, i) => [
    { key: `${i}-x`, label: `P${i + 1} x`, value: d.x, min: 0, max: 24 },
    { key: `${i}-y`, label: `P${i + 1} y`, value: d.y, min: 0, max: 100 },
  ]);

  return (
    <ChartSection
      title="Scatter with Regression Line"
      description="Exposure-response with linear fit"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={combined} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" domain={[0, 24]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipProps} />
            <Scatter dataKey="y" fill="var(--chart-1)" r={4} name="Observed" />
            <Line dataKey="regY" stroke="var(--chart-2)" strokeWidth={2} dot={false} name="Regression" connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [idx, field] = key.split("-");
              updatePoint(Number(idx), field as "x" | "y", v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[{ key: "x", label: "X" }, { key: "y", label: "Y" }]}
                rows={data}
                onCellChange={(ri, k, v) => updatePoint(ri, k as "x" | "y", v)}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
