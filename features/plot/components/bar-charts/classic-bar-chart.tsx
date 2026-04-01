"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { classicBarData, type BarDataPoint } from "../../data/mock-data";

export function ClassicBarChart() {
  const [data, setData] = useState<BarDataPoint[]>(classicBarData);
  const [threshold, setThreshold] = useState(60);

  const updateValue = (index: number, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, value } : p)));
  };

  const fields = data.map((d, i) => ({
    key: String(i),
    label: d.label,
    value: d.value,
    min: 0,
    max: 100,
  }));

  return (
    <ChartSection
      title="Classic Bar Chart"
      description="Vertical bars with optional threshold line"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipProps} />
            <ReferenceLine y={threshold} stroke="var(--chart-5)" strokeDasharray="6 3" label={{ value: `Threshold ${threshold}`, position: "right", fontSize: 10 }} />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const allFields = [
              ...fields,
              { key: "threshold", label: "Threshold", value: threshold, min: 0, max: 100 },
            ];
            const handleChange = (key: string, v: number) => {
              if (key === "threshold") setThreshold(v);
              else updateValue(Number(key), v);
            };
            if (mode === "slider") return <SliderEditor fields={allFields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={allFields} onChange={handleChange} />;
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
