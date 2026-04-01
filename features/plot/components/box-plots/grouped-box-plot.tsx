"use client";

import { useState, useMemo } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";
import { groupedBoxPlotData, type GroupedBoxPlotStats, type BoxPlotStats } from "../../data/mock-data";

const SVG_W = 600;
const SVG_H = 300;
const PAD = { top: 20, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function yScale(v: number, min: number, max: number) {
  return PAD.top + PLOT_H * (1 - (v - min) / (max - min));
}

function renderBox(
  stats: BoxPlotStats, cx: number, halfW: number,
  yMin: number, yMax: number, color: string,
) {
  return (
    <g>
      <line x1={cx} x2={cx} y1={yScale(stats.max, yMin, yMax)} y2={yScale(stats.min, yMin, yMax)} stroke={color} strokeWidth={1.5} />
      <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={yScale(stats.max, yMin, yMax)} y2={yScale(stats.max, yMin, yMax)} stroke={color} strokeWidth={1.5} />
      <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={yScale(stats.min, yMin, yMax)} y2={yScale(stats.min, yMin, yMax)} stroke={color} strokeWidth={1.5} />
      <rect
        x={cx - halfW} y={yScale(stats.q3, yMin, yMax)}
        width={halfW * 2}
        height={yScale(stats.q1, yMin, yMax) - yScale(stats.q3, yMin, yMax)}
        fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} rx={2}
      />
      <line x1={cx - halfW} x2={cx + halfW} y1={yScale(stats.median, yMin, yMax)} y2={yScale(stats.median, yMin, yMax)} stroke={color} strokeWidth={2.5} />
    </g>
  );
}

export function GroupedBoxPlot() {
  const [data, setData] = useState<GroupedBoxPlotStats[]>(groupedBoxPlotData);

  const updateGroupField = (index: number, group: "groupA" | "groupB", field: string, value: number) => {
    setData((d) =>
      d.map((p, i) =>
        i === index ? { ...p, [group]: { ...p[group], [field]: value } } : p
      )
    );
  };

  const allVals = data.flatMap((d) => [
    d.groupA.min, d.groupA.max, d.groupB.min, d.groupB.max,
  ]);
  const yMin = Math.min(...allVals) - 5;
  const yMax = Math.max(...allVals) + 5;

  const groupWidth = PLOT_W / data.length;
  const boxW = Math.min(24, groupWidth * 0.25);

  const ticks = useMemo(() => {
    const count = 6;
    const step = (yMax - yMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(yMin + i * step));
  }, [yMin, yMax]);

  const fields = data.flatMap((d, i) =>
    (["groupA", "groupB"] as const).flatMap((g) =>
      (["min", "q1", "median", "q3", "max"] as const).map((f) => ({
        key: `${i}-${g}-${f}`,
        label: `${d.label} ${g === "groupA" ? "A" : "B"} ${f}`,
        value: d[g][f],
        min: 0,
        max: 100,
      }))
    )
  );

  return (
    <ChartSection
      title="Grouped Box Plot"
      description="Paired box plots for dose group / covariate comparison"
      chart={
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          {ticks.map((t) => (
            <line key={t} x1={PAD.left} x2={SVG_W - PAD.right} y1={yScale(t, yMin, yMax)} y2={yScale(t, yMin, yMax)} className="stroke-border" strokeDasharray="3 3" />
          ))}
          {ticks.map((t) => (
            <text key={`l-${t}`} x={PAD.left - 8} y={yScale(t, yMin, yMax) + 4} textAnchor="end" className="fill-muted-foreground" fontSize={11}>{t}</text>
          ))}
          {data.map((d, i) => {
            const cx = PAD.left + (i + 0.5) * groupWidth;
            return (
              <g key={i}>
                {renderBox(d.groupA, cx - boxW * 0.8, boxW / 2, yMin, yMax, "var(--chart-1)")}
                {renderBox(d.groupB, cx + boxW * 0.8, boxW / 2, yMin, yMax, "var(--chart-3)")}
                <text x={cx} y={SVG_H - PAD.bottom + 20} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>{d.label}</text>
              </g>
            );
          })}
          {/* legend */}
          <rect x={SVG_W - PAD.right - 120} y={PAD.top} width={12} height={12} fill="var(--chart-1)" fillOpacity={0.4} rx={2} />
          <text x={SVG_W - PAD.right - 104} y={PAD.top + 10} className="fill-foreground" fontSize={11}>Group A</text>
          <rect x={SVG_W - PAD.right - 120} y={PAD.top + 18} width={12} height={12} fill="var(--chart-3)" fillOpacity={0.4} rx={2} />
          <text x={SVG_W - PAD.right - 104} y={PAD.top + 28} className="fill-foreground" fontSize={11}>Group B</text>
        </svg>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [idx, group, field] = key.split("-");
              updateGroupField(Number(idx), group as "groupA" | "groupB", field, v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            const tableRows = data.flatMap((d, i) =>
              (["groupA", "groupB"] as const).map((g) => ({
                _idx: i,
                _group: g,
                label: `${d.label} ${g === "groupA" ? "A" : "B"}`,
                min: d[g].min,
                q1: d[g].q1,
                median: d[g].median,
                q3: d[g].q3,
                max: d[g].max,
              }))
            );
            return (
              <TableEditor
                columns={[
                  { key: "label", label: "Group", editable: false },
                  { key: "min", label: "Min" },
                  { key: "q1", label: "Q1" },
                  { key: "median", label: "Median" },
                  { key: "q3", label: "Q3" },
                  { key: "max", label: "Max" },
                ]}
                rows={tableRows}
                onCellChange={(ri, k, v) => {
                  const row = tableRows[ri];
                  updateGroupField(row._idx as number, row._group as "groupA" | "groupB", k, v);
                }}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
