"use client";

import { useState, useMemo } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";

const ROWS = 8;
const COLS = 10;

function generateHeatMapGrid(seed: number[][]): number[][] {
  return seed;
}

function colorScale(value: number, min: number, max: number): string {
  const t = (value - min) / (max - min || 1);
  const r = Math.round(220 - t * 180);
  const g = Math.round(235 - t * 175);
  const b = Math.round(255 - t * 55);
  return `rgb(${r},${g},${b})`;
}

function makeInitialGrid(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = Math.round((Math.sin(r * 0.8) * Math.cos(c * 0.6) + 1) * 50);
    }
  }
  return grid;
}

export function HeatMap() {
  const [grid, setGrid] = useState<number[][]>(makeInitialGrid);

  const { min, max } = useMemo(() => {
    const flat = grid.flat();
    return { min: Math.min(...flat), max: Math.max(...flat) };
  }, [grid]);

  const updateCell = (r: number, c: number, value: number) => {
    setGrid((g) => g.map((row, ri) =>
      ri === r ? row.map((v, ci) => (ci === c ? value : v)) : row
    ));
  };

  const fields = grid.flatMap((row, r) =>
    row.map((v, c) => ({
      key: `${r}-${c}`,
      label: `[${r},${c}]`,
      value: v,
      min: 0,
      max: 100,
    }))
  );

  const yLabels = [0, 25, 50, 75, 100];
  const xLabels = [0, 4, 8, 12, 16, 20, 24];

  return (
    <ChartSection
      title="Heat Map"
      description="Gene expression / continuous parameter matrix"
      chart={
        <div className="space-y-1">
          <div className="flex">
            <div className="w-10 shrink-0" />
            <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {xLabels.map((x, i) => (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground text-center"
                  style={{
                    gridColumn: Math.round((x / 24) * (COLS - 1)) + 1,
                  }}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="w-10 shrink-0 flex flex-col justify-between py-1">
              {yLabels.reverse().map((y) => (
                <span key={y} className="text-[10px] text-muted-foreground text-right pr-1">
                  {y}
                </span>
              ))}
            </div>
            <div
              className="grid flex-1 gap-[1px] rounded-md overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
              {grid.map((row, r) =>
                row.map((v, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-[1.4] flex items-center justify-center text-[9px] font-mono"
                    style={{
                      backgroundColor: colorScale(v, min, max),
                      color: v > (min + max) / 2 ? "#fff" : "#333",
                    }}
                    title={`[${r},${c}] = ${v}`}
                  >
                    {v}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-center text-[10px] text-muted-foreground mt-1">x-axis label</div>
        </div>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              const [r, c] = key.split("-").map(Number);
              updateCell(r, c, v);
            };
            if (mode === "slider") return <SliderEditor fields={fields.slice(0, 20)} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
