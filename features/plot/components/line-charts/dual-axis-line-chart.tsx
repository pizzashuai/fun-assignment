"use client";

import { useState } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { dualAxisLineData, type LineDataPoint } from "../../data/mock-data";

export function DualAxisLineChart() {
  const [data, setData] = useState<LineDataPoint[]>(dualAxisLineData);

  const updateField = (index: number, field: "y" | "y2", value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const fields = data.flatMap((d, i) => [
    { key: `${i}-y`, label: `x=${d.x} Eff`, value: d.y, min: 0, max: 100 },
    { key: `${i}-y2`, label: `x=${d.x} Risk`, value: d.y2!, min: 0, max: 100 },
  ]);

  return (
    <ChartSection
      title="Dual-Axis Line Chart"
      description="Benefit-risk / therapeutic window with two y-axes"
      chart={
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 8, right: 60, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--chart-1)" }} tickLine={false} axisLine={false} label={{ value: "Efficacy", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--chart-1)" }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--chart-4)" }} tickLine={false} axisLine={false} label={{ value: "Risk", angle: 90, position: "insideRight", fontSize: 11, fill: "var(--chart-4)" }} />
            <Tooltip {...chartTooltipProps} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area yAxisId="left" dataKey="y" fill="var(--chart-1)" fillOpacity={0.06} stroke="none" />
            <Line yAxisId="left" dataKey="y" type="basis" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} name="Efficacy" />
            <Line yAxisId="right" dataKey="y2" type="basis" stroke="var(--chart-4)" strokeWidth={2.5} dot={false} name="Risk" />
          </ComposedChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [idx, field] = key.split("-");
              updateField(Number(idx), field as "y" | "y2", v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "x", label: "X", editable: false },
                  { key: "y", label: "Efficacy" },
                  { key: "y2", label: "Risk" },
                ]}
                rows={data}
                onCellChange={(ri, k, v) => updateField(ri, k as "y" | "y2", v)}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
