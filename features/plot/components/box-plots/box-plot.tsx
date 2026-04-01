"use client";

import { useState, useMemo } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { boxPlotData, type BoxPlotStats } from "../../data/mock-data";

const SVG_W = 600;
const SVG_H = 300;
const PAD = { top: 20, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function yScale(v: number, min: number, max: number) {
  return PAD.top + PLOT_H * (1 - (v - min) / (max - min));
}

export function BoxPlot() {
  const [data, setData] = useState<BoxPlotStats[]>(boxPlotData);
  const [threshold, setThreshold] = useState(60);

  const updateField = (index: number, field: string, value: number) => {
    setData((d) => d.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const { yMin, yMax } = useMemo(() => {
    const allVals = data.flatMap((d) => [d.min, d.max]);
    return { yMin: Math.min(...allVals) - 5, yMax: Math.max(...allVals) + 5 };
  }, [data]);

  const boxWidth = Math.min(40, PLOT_W / data.length * 0.5);

  const fields = data.flatMap((d, i) => [
    { key: `${i}-min`, label: `${d.label} Min`, value: d.min, min: 0, max: 100 },
    { key: `${i}-q1`, label: `${d.label} Q1`, value: d.q1, min: 0, max: 100 },
    { key: `${i}-median`, label: `${d.label} Med`, value: d.median, min: 0, max: 100 },
    { key: `${i}-q3`, label: `${d.label} Q3`, value: d.q3, min: 0, max: 100 },
    { key: `${i}-max`, label: `${d.label} Max`, value: d.max, min: 0, max: 100 },
  ]);

  const ticks = useMemo(() => {
    const count = 6;
    const step = (yMax - yMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(yMin + i * step));
  }, [yMin, yMax]);

  return (
    <ChartSection
      title="Standard Box Plot"
      description="Distribution: min, Q1, median, Q3, max with threshold line"
      chart={
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          {/* grid lines */}
          {ticks.map((t) => (
            <line
              key={t}
              x1={PAD.left}
              x2={SVG_W - PAD.right}
              y1={yScale(t, yMin, yMax)}
              y2={yScale(t, yMin, yMax)}
              className="stroke-border"
              strokeDasharray="3 3"
            />
          ))}
          {/* y axis labels */}
          {ticks.map((t) => (
            <text
              key={`label-${t}`}
              x={PAD.left - 8}
              y={yScale(t, yMin, yMax) + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {t}
            </text>
          ))}
          {/* threshold */}
          <line
            x1={PAD.left}
            x2={SVG_W - PAD.right}
            y1={yScale(threshold, yMin, yMax)}
            y2={yScale(threshold, yMin, yMax)}
            stroke="var(--chart-5)"
            strokeDasharray="6 3"
            strokeWidth={1.5}
          />
          {/* boxes */}
          {data.map((d, i) => {
            const cx = PAD.left + (i + 0.5) * (PLOT_W / data.length);
            const halfW = boxWidth / 2;
            return (
              <g key={i}>
                {/* whisker line */}
                <line
                  x1={cx} x2={cx}
                  y1={yScale(d.max, yMin, yMax)} y2={yScale(d.min, yMin, yMax)}
                  stroke="var(--chart-1)" strokeWidth={1.5}
                />
                {/* whisker caps */}
                <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={yScale(d.max, yMin, yMax)} y2={yScale(d.max, yMin, yMax)} stroke="var(--chart-1)" strokeWidth={1.5} />
                <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={yScale(d.min, yMin, yMax)} y2={yScale(d.min, yMin, yMax)} stroke="var(--chart-1)" strokeWidth={1.5} />
                {/* box */}
                <rect
                  x={cx - halfW}
                  y={yScale(d.q3, yMin, yMax)}
                  width={boxWidth}
                  height={yScale(d.q1, yMin, yMax) - yScale(d.q3, yMin, yMax)}
                  fill="var(--chart-1)"
                  fillOpacity={0.3}
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                  rx={2}
                />
                {/* median */}
                <line
                  x1={cx - halfW} x2={cx + halfW}
                  y1={yScale(d.median, yMin, yMax)} y2={yScale(d.median, yMin, yMax)}
                  stroke="var(--chart-1)" strokeWidth={2.5}
                />
                {/* x label */}
                <text x={cx} y={SVG_H - PAD.bottom + 20} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
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
              const [idx, field] = key.split("-");
              updateField(Number(idx), field, v);
            };
            if (mode === "slider") return <SliderEditor fields={allFields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={allFields} onChange={handleChange} />;
            return (
              <TableEditor
                columns={[
                  { key: "label", label: "X", editable: false },
                  { key: "min", label: "Min" },
                  { key: "q1", label: "Q1" },
                  { key: "median", label: "Median" },
                  { key: "q3", label: "Q3" },
                  { key: "max", label: "Max" },
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
