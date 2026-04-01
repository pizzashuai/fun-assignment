"use client";

import { useState, useMemo } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import { TableEditor } from "../data-editor/table-editor";

const ROWS = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08"];
const COLS = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10"];

function makeInitialGrid(): number[][] {
  return ROWS.map((_, ri) =>
    COLS.map((_, ci) => {
      const base = 25 + ri * 2 + ci * 1.5;
      const peak = ri >= 2 && ri <= 5 && ci >= 3 && ci <= 7 ? 20 : 0;
      return Math.round((base + peak + (ri * 7 + ci * 3) % 5) * 10) / 10;
    })
  );
}

function colorScale(value: number, min: number, max: number): string {
  const t = (value - min) / (max - min || 1);
  const r = Math.round(230 - t * 190);
  const g = Math.round(240 - t * 185);
  const b = Math.round(255 - t * 50);
  return `rgb(${r},${g},${b})`;
}

export function SpatialHeatMap() {
  const [grid, setGrid] = useState<number[][]>(makeInitialGrid);

  const { min, max } = useMemo(() => {
    const flat = grid.flat();
    return { min: Math.min(...flat), max: Math.max(...flat) };
  }, [grid]);

  const updateCell = (r: number, c: number, value: number) => {
    setGrid((g) =>
      g.map((row, ri) =>
        ri === r ? row.map((v, ci) => (ci === c ? value : v)) : row
      )
    );
  };

  const fields = grid.flatMap((row, r) =>
    row.map((v, c) => ({
      key: `${r}-${c}`,
      label: `${ROWS[r]}×${COLS[c]}`,
      value: v,
      min: 20,
      max: 70,
      step: 0.1,
    }))
  );

  return (
    <ChartSection
      title="Spatial Heat Map"
      description="Temperature (°C) across cell × module grid"
      chart={
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Temperature distribution across cell/module grid (°C)
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-[10px]">
              <thead>
                <tr>
                  <th className="p-1 text-muted-foreground font-medium">Cell ID</th>
                  {COLS.map((col) => (
                    <th key={col} className="p-1 text-muted-foreground font-medium text-center min-w-[40px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, r) => (
                  <tr key={r}>
                    <td className="p-1 text-muted-foreground font-medium">{ROWS[r]}</td>
                    {row.map((v, c) => (
                      <td
                        key={c}
                        className="p-1 text-center font-mono border border-background/50"
                        style={{
                          backgroundColor: colorScale(v, min, max),
                          color: v > (min + max) * 0.55 ? "#fff" : "#333",
                        }}
                      >
                        {v.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td colSpan={COLS.length} className="text-center text-muted-foreground pt-1">
                    Module ID
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
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
            if (mode === "number") return <NumberInputEditor fields={fields} onChange={handleChange} />;
            const tableRows = grid.map((row, r) => {
              const obj: Record<string, string | number> = { row: ROWS[r] };
              COLS.forEach((col, c) => {
                obj[col] = row[c];
              });
              return obj;
            });
            return (
              <TableEditor
                columns={[
                  { key: "row", label: "Cell", editable: false },
                  ...COLS.map((col) => ({ key: col, label: col })),
                ]}
                rows={tableRows}
                onCellChange={(ri, k, v) => {
                  const ci = COLS.indexOf(k);
                  if (ci >= 0) updateCell(ri, ci, v);
                }}
              />
            );
          }}
        </DataEditor>
      }
    />
  );
}
