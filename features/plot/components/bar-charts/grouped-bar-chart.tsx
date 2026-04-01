"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { groupedBarData, type GroupedBarDataPoint } from "../../data/mock-data";

export function GroupedBarChart() {
  const [data, setData] = useState<GroupedBarDataPoint[]>(groupedBarData);
  const [threshold, setThreshold] = useState(65);

  const updateField = (index: number, field: string, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const fields = data.flatMap((d, i) => [
    { key: `${i}-group1`, label: `${d.label} G1`, value: d.group1, min: 0, max: 100 },
    { key: `${i}-group2`, label: `${d.label} G2`, value: d.group2, min: 0, max: 100 },
    { key: `${i}-group3`, label: `${d.label} G3`, value: d.group3, min: 0, max: 100 },
  ]);

  return (
    <ChartSection
      title="Grouped Bar Chart"
      description="Side-by-side bars for covariate / subgroup comparison"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipProps} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={threshold} stroke="var(--chart-5)" strokeDasharray="6 3" />
            <Bar dataKey="group1" name="Group 1" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="group2" name="Group 2" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="group3" name="Group 3" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
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
              if (key === "threshold") {
                setThreshold(v);
                return;
              }
              const [idx, field] = key.split("-");
              updateField(Number(idx), field, v);
            };
            if (mode === "slider") return <SliderEditor fields={allFields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={allFields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "label", label: "Quarter", editable: false },
                  { key: "group1", label: "Group 1" },
                  { key: "group2", label: "Group 2" },
                  { key: "group3", label: "Group 3" },
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
