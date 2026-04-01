"use client";

import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { classicScatterData, type ScatterDataPoint } from "../../data/mock-data";

export function ClassicScatter() {
  const [data, setData] = useState<ScatterDataPoint[]>(classicScatterData);
  const [thresholdY, setThresholdY] = useState(70);

  const updatePoint = (index: number, field: "x" | "y", value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const fields = data.flatMap((d, i) => [
    { key: `${i}-x`, label: `P${i + 1} x`, value: d.x, min: 0, max: 24 },
    { key: `${i}-y`, label: `P${i + 1} y`, value: d.y, min: 0, max: 100 },
  ]);

  return (
    <ChartSection
      title="Classic Scatter Plot"
      description="Exploratory relationship — biomarker vs exposure"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" domain={[0, 24]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} name="x" />
            <YAxis dataKey="y" type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} name="y" />
            <Tooltip {...chartTooltipProps} />
            <ReferenceLine y={thresholdY} stroke="var(--chart-5)" strokeDasharray="6 3" />
            <Scatter data={data} fill="var(--chart-1)" r={4} />
          </ScatterChart>
        </ResponsiveContainer>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const allFields = [
              ...fields,
              { key: "thresholdY", label: "Threshold Y", value: thresholdY, min: 0, max: 100 },
            ];
            const handleChange = (key: string, v: number) => {
              if (key === "thresholdY") { setThresholdY(v); return; }
              const [idx, field] = key.split("-");
              updatePoint(Number(idx), field as "x" | "y", v);
            };
            if (mode === "slider") return <SliderEditor fields={allFields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={allFields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "x", label: "X" },
                  { key: "y", label: "Y" },
                ]}
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
