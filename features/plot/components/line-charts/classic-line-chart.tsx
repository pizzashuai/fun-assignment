"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart,
} from "recharts";
import { chartTooltipProps } from "@/features/shared/components/charts/chart-tooltip-theme";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { classicLineData, type LineDataPoint } from "../../data/mock-data";

export function ClassicLineChart() {
  const [data, setData] = useState<LineDataPoint[]>(classicLineData);
  const [threshold, setThreshold] = useState(75);

  const updatePoint = (index: number, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, y: value } : p)));
  };

  const fields = data.map((d, i) => ({
    key: String(i),
    label: `x=${d.x}`,
    value: d.y,
    min: 0,
    max: 100,
  }));

  return (
    <ChartSection
      title="Classic Line Chart"
      description="Sensitivity curves / parameter trends with threshold"
      chart={
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipProps} />
            <ReferenceLine y={threshold} stroke="var(--chart-5)" strokeDasharray="6 3" label={{ value: "Threshold", position: "right", fontSize: 10 }} />
            <Area dataKey="y" fill="var(--chart-1)" fillOpacity={0.08} stroke="none" />
            <Line dataKey="y" type="monotone" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-1)" }} activeDot={{ r: 5 }} />
          </ComposedChart>
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
              if (key === "threshold") { setThreshold(v); return; }
              updatePoint(Number(key), v);
            };
            if (mode === "slider") return <SliderEditor fields={allFields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={allFields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "x", label: "X", editable: false },
                  { key: "y", label: "Y" },
                ]}
                rows={data}
                onCellChange={(ri, _k, v) => updatePoint(ri, v)}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
