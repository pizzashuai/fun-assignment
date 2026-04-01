"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { waterfallData, type WaterfallDataPoint } from "../../data/mock-data";

export function WaterfallChart() {
  const [data, setData] = useState<WaterfallDataPoint[]>(waterfallData);

  const updateValue = (index: number, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, value } : p)));
  };

  const chartData = useMemo(() => {
    let cumulative = 0;
    return data.map((d) => {
      const base = d.value >= 0 ? cumulative : cumulative + d.value;
      const height = Math.abs(d.value);
      cumulative += d.value;
      return { label: d.label, base, height, value: d.value, total: cumulative };
    });
  }, [data]);

  const yMax = Math.max(...chartData.map((d) => d.base + d.height), 0) + 10;
  const yMin = Math.min(...chartData.map((d) => d.base), 0) - 10;

  const fields = data.map((d, i) => ({
    key: String(i),
    label: d.label,
    value: d.value,
    min: -80,
    max: 80,
  }));

  return (
    <ChartSection
      title="Waterfall Chart"
      description="Stepped bars showing cumulative change (e.g. tumor response, RECIST)"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              {...chartTooltipProps}
              formatter={(value, name) => {
                if (name === "base") return [null, null];
                return [value, "Change"];
              }}
            />
            <ReferenceLine y={0} stroke="var(--foreground)" strokeWidth={1} />
            <Bar dataKey="base" stackId="stack" fill="transparent" />
            <Bar dataKey="height" stackId="stack" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.value >= 0 ? "var(--chart-1)" : "var(--chart-4)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => updateValue(Number(key), v);
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "label", label: "Label", editable: false },
                  { key: "value", label: "Value" },
                ]}
                rows={data}
                onCellChange={(ri, _k, v) => updateValue(ri, v)}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
