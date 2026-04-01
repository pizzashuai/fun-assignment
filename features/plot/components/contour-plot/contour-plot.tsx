"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";

const DEFAULT_ROWS = 10;
const DEFAULT_COLS = 10;

function generateGrid(centerX: number, centerY: number, spread: number, rows: number, cols: number) {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const nx = (c / (cols - 1)) * 8 - 2;
      const ny = (r / (rows - 1)) * 700 + 100;
      const dx = nx - centerX;
      const dy = (ny - centerY) / 100;
      grid[r][c] = Math.round(Math.exp(-(dx * dx + dy * dy) / spread) * 100) / 100;
    }
  }
  return grid;
}

function interpolateColor(t: number): string {
  const r = Math.round(220 - t * 180);
  const g = Math.round(235 - t * 175);
  const b = Math.round(255 - t * 55);
  return `rgb(${r},${g},${b})`;
}

function drawContour(
  canvas: HTMLCanvasElement,
  grid: number[][],
  threshold: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rows = grid.length;
  const cols = grid[0].length;
  const w = canvas.width;
  const h = canvas.height;
  const pad = { top: 30, right: 30, bottom: 40, left: 60 };
  const pw = w - pad.left - pad.right;
  const ph = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  const resolution = 2;
  for (let py = 0; py < ph; py += resolution) {
    for (let px = 0; px < pw; px += resolution) {
      const gx = (px / pw) * (cols - 1);
      const gy = (py / ph) * (rows - 1);
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const x1 = Math.min(x0 + 1, cols - 1);
      const y1 = Math.min(y0 + 1, rows - 1);
      const fx = gx - x0;
      const fy = gy - y0;
      const val =
        grid[y0][x0] * (1 - fx) * (1 - fy) +
        grid[y0][x1] * fx * (1 - fy) +
        grid[y1][x0] * (1 - fx) * fy +
        grid[y1][x1] * fx * fy;
      ctx.fillStyle = interpolateColor(val);
      ctx.fillRect(pad.left + px, pad.top + py, resolution, resolution);
    }
  }

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 8; i++) {
    const x = pad.left + (i / 8) * pw;
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + ph);
    ctx.stroke();
  }
  for (let i = 0; i <= 7; i++) {
    const y = pad.top + (i / 7) * ph;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + pw, y);
    ctx.stroke();
  }

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches ||
    document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#ccc" : "#333";

  ctx.fillStyle = textColor;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  const xLabels = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  xLabels.forEach((v, i) => {
    ctx.fillText(String(v), pad.left + (i / (xLabels.length - 1)) * pw, pad.top + ph + 16);
  });
  ctx.fillText("Hydrophobicity (log P)", pad.left + pw / 2, pad.top + ph + 34);

  ctx.textAlign = "right";
  const yLabels = [100, 200, 300, 400, 500, 600, 700, 800];
  yLabels.forEach((v, i) => {
    ctx.fillText(String(v), pad.left - 8, pad.top + ph - (i / (yLabels.length - 1)) * ph + 4);
  });

  ctx.save();
  ctx.translate(14, pad.top + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Molecular Weight (Da)", 0, 0);
  ctx.restore();

  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1.5;
  const thY = pad.top + ph * (1 - threshold);
  ctx.beginPath();
  ctx.moveTo(pad.left, thY);
  ctx.lineTo(pad.left + pw, thY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.fillText(`Threshold ${threshold.toFixed(2)}`, pad.left + 4, thY - 6);
}

export function ContourPlot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [centerX, setCenterX] = useState(2);
  const [centerY, setCenterY] = useState(400);
  const [spread, setSpread] = useState(6);
  const [threshold, setThreshold] = useState(0.45);

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    const grid = generateGrid(centerX, centerY, spread, DEFAULT_ROWS, DEFAULT_COLS);
    drawContour(canvasRef.current, grid, threshold);
  }, [centerX, centerY, spread, threshold]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const fields = [
    { key: "centerX", label: "Center X (logP)", value: centerX, min: -2, max: 6, step: 0.5 },
    { key: "centerY", label: "Center Y (MW)", value: centerY, min: 100, max: 800, step: 50 },
    { key: "spread", label: "Spread", value: spread, min: 1, max: 15, step: 0.5 },
    { key: "threshold", label: "Threshold", value: threshold, min: 0, max: 1, step: 0.05 },
  ];

  return (
    <ChartSection
      title="Contour Plot"
      description="2D density — Hydrophobicity vs Molecular Weight"
      chart={
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="w-full h-auto rounded-md"
        />
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "centerX") setCenterX(v);
              else if (key === "centerY") setCenterY(v);
              else if (key === "spread") setSpread(v);
              else if (key === "threshold") setThreshold(v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
