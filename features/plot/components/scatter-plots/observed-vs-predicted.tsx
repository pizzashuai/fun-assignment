"use client";

import { useState, useMemo } from "react";
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
import { observedVsPredictedData, type ScatterDataPoint } from "../../data/mock-data";

export function ObservedVsPredicted() {
  const [data, setData] = useState<ScatterDataPoint[]>(observedVsPredictedData);

  const updatePoint = (index: number, field: "x" | "y", value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const unityLine = useMemo(() => [{ x: 0, y: 0 }, { x: 110, y: 110 }], []);

  const fields = data.flatMap((d, i) => [
    { key: `${i}-x`, label: `Pred ${i + 1}`, value: d.x, min: 0, max: 120 },
    { key: `${i}-y`, label: `Obs ${i + 1}`, value: d.y, min: 0, max: 120 },
  ]);

  return (
    <ChartSection
      title="Observed vs Predicted Scatter"
      description="PK validation / model diagnostics with unity line (y = x)"
      chart={
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="x" type="number" domain={[0, 110]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} name="Predicted" label={{ value: "Predicted", position: "insideBottom", offset: -4, fontSize: 11 }} />
            <YAxis dataKey="y" type="number" domain={[0, 110]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} name="Observed" label={{ value: "Observed", angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }} />
            <Tooltip {...chartTooltipProps} />
            <ReferenceLine segment={unityLine as [{ x: number; y: number }, { x: number; y: number }]} stroke="var(--muted-foreground)" strokeDasharray="6 3" strokeWidth={1.5} />
            <Scatter data={data} fill="var(--chart-1)" r={5} />
          </ScatterChart>
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
                columns={[{ key: "x", label: "Predicted" }, { key: "y", label: "Observed" }]}
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
