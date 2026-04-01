"use client";

import { useState, useMemo } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { violinData, type ViolinDataPoint } from "../../data/mock-data";

const SVG_W = 600;
const SVG_H = 300;
const PAD = { top: 20, right: 30, bottom: 40, left: 50 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function kde(values: number[], bandwidth: number, nPoints: number, vMin: number, vMax: number) {
  const result: { y: number; density: number }[] = [];
  const step = (vMax - vMin) / (nPoints - 1);
  for (let i = 0; i < nPoints; i++) {
    const y = vMin + i * step;
    let sum = 0;
    for (const v of values) {
      const u = (y - v) / bandwidth;
      sum += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    }
    result.push({ y, density: sum / (values.length * bandwidth) });
  }
  return result;
}

function yScale(v: number, min: number, max: number) {
  return PAD.top + PLOT_H * (1 - (v - min) / (max - min));
}

export function ViolinPlot() {
  const [data, setData] = useState<ViolinDataPoint[]>(violinData);

  const updateValue = (groupIdx: number, valIdx: number, value: number) => {
    setData((d) =>
      d.map((p, i) =>
        i === groupIdx
          ? { ...p, values: p.values.map((v, j) => (j === valIdx ? value : v)) }
          : p
      )
    );
  };

  const allVals = data.flatMap((d) => d.values);
  const yMin = Math.min(...allVals) - 5;
  const yMax = Math.max(...allVals) + 5;
  const groupWidth = PLOT_W / data.length;
  const maxHalfWidth = Math.min(50, groupWidth * 0.4);

  const densities = useMemo(
    () => data.map((d) => kde(d.values, 5, 40, yMin, yMax)),
    [data, yMin, yMax]
  );
  const maxDensity = Math.max(...densities.flatMap((ds) => ds.map((p) => p.density)));

  const ticks = useMemo(() => {
    const count = 6;
    const step = (yMax - yMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(yMin + i * step));
  }, [yMin, yMax]);

  const fields = data.flatMap((d, gi) =>
    d.values.map((v, vi) => ({
      key: `${gi}-${vi}`,
      label: `${d.label}[${vi}]`,
      value: v,
      min: 0,
      max: 100,
    }))
  );

  return (
    <ChartSection
      title="Violin Plot"
      description="Density distribution shape comparison across groups"
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
            const kdeData = densities[i];
            const leftPath = kdeData
              .map((p) => `${cx - (p.density / maxDensity) * maxHalfWidth},${yScale(p.y, yMin, yMax)}`)
              .join(" L ");
            const rightPath = [...kdeData]
              .reverse()
              .map((p) => `${cx + (p.density / maxDensity) * maxHalfWidth},${yScale(p.y, yMin, yMax)}`)
              .join(" L ");
            const sorted = [...d.values].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            const q1 = sorted[Math.floor(sorted.length * 0.25)];
            const q3 = sorted[Math.floor(sorted.length * 0.75)];
            return (
              <g key={i}>
                <path
                  d={`M ${leftPath} L ${rightPath} Z`}
                  fill="var(--chart-1)"
                  fillOpacity={0.25}
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                />
                <line x1={cx} x2={cx} y1={yScale(q1, yMin, yMax)} y2={yScale(q3, yMin, yMax)} stroke="var(--chart-1)" strokeWidth={3} />
                <circle cx={cx} cy={yScale(median, yMin, yMax)} r={4} fill="var(--chart-1)" />
                <text x={cx} y={SVG_H - PAD.bottom + 20} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [gi, vi] = key.split("-");
              updateValue(Number(gi), Number(vi), v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
