"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { horizontalBarData, type BarDataPoint } from "../../data/mock-data";

export function HorizontalBarChart() {
  const [data, setData] = useState<BarDataPoint[]>(horizontalBarData);

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
      title="Horizontal Bar Chart"
      description="Horizontal bars for category comparison"
      chart={
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
            <Tooltip {...chartTooltipProps} />
            <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
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
