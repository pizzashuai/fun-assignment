"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart, Scatter, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { scatterConfidenceData, type ScatterDataPoint } from "../../data/mock-data";

function sigmoid(x: number, L: number, k: number, x0: number) {
  return L / (1 + Math.exp(-k * (x - x0)));
}

export function ScatterConfidenceBand() {
  const [data, setData] = useState<ScatterDataPoint[]>(scatterConfidenceData);
  const [bandWidth, setBandWidth] = useState(12);

  const updatePoint = (index: number, field: "x" | "y", value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const fitCurve = useMemo(() => {
    const points: { x: number; fit: number; upper: number; lower: number }[] = [];
    for (let x = 0; x <= 24; x += 0.5) {
      const fit = sigmoid(x, 95, 0.25, 10);
      points.push({ x, fit, upper: fit + bandWidth, lower: Math.max(0, fit - bandWidth) });
    }
    return points;
  }, [bandWidth]);

  const fields = [
    ...data.flatMap((d, i) => [
      { key: `${i}-x`, label: `P${i + 1} x`, value: d.x, min: 0, max: 24 },
      { key: `${i}-y`, label: `P${i + 1} y`, value: d.y, min: 0, max: 100 },
    ]),
    { key: "bandWidth", label: "CI Width", value: bandWidth, min: 2, max: 30 },
  ];

  return (
    <ChartSection
      title="Scatter with Confidence Band"
      description="Modeled exposure-response with CI band"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={fitCurve} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" domain={[0, 24]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 110]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipProps} />
            <Area dataKey="upper" stroke="none" fill="var(--chart-1)" fillOpacity={0.12} />
            <Area dataKey="lower" stroke="none" fill="var(--background)" fillOpacity={1} />
            <Line dataKey="fit" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Fit" />
            <Scatter data={data} dataKey="y" fill="var(--chart-2)" r={4} name="Observed" />
          </ComposedChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "bandWidth") { setBandWidth(v); return; }
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
