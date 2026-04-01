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
import { tornadoData, type TornadoDataPoint } from "../../data/mock-data";

export function TornadoChart() {
  const [data, setData] = useState<TornadoDataPoint[]>(tornadoData);

  const updateField = (index: number, field: string, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const sorted = [...data].sort((a, b) => (b.positive - b.negative) - (a.positive - a.negative));

  const fields = data.flatMap((d, i) => [
    { key: `${i}-positive`, label: `${d.label} (+)`, value: d.positive, min: 0, max: 80 },
    { key: `${i}-negative`, label: `${d.label} (−)`, value: d.negative, min: -80, max: 0 },
  ]);

  return (
    <ChartSection
      title="Tornado Chart"
      description="Bidirectional horizontal bars — biomarker vs exposure, sensitivity analysis"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
            <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
            <Tooltip {...chartTooltipProps} />
            <ReferenceLine x={0} stroke="var(--foreground)" strokeWidth={1} />
            <Bar dataKey="positive" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="negative" fill="var(--chart-3)" radius={[4, 0, 0, 4]} />
          </BarChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [idx, field] = key.split("-");
              updateField(Number(idx), field, v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "label", label: "Parameter", editable: false },
                  { key: "positive", label: "Positive" },
                  { key: "negative", label: "Negative" },
                ]}
                rows={data}
                onCellChange={(ri, k, v) => updateField(ri, k, v)}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
