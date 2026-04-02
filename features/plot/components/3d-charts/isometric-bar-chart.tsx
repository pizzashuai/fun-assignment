"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";

type MetricKey = "energy" | "power" | "cycles" | "safety" | "cost";

interface Material {
  name: string;
  energy: number;
  power: number;
  cycles: number;
  safety: number;
  cost: number;
  baseHue: number;
}

const MATERIALS: Material[] = [
  { name: "LFP",  energy: 160, power: 500,  cycles: 3000, safety: 96, cost: 28,  baseHue: 140 },
  { name: "NMC",  energy: 250, power: 700,  cycles: 1500, safety: 72, cost: 45,  baseHue: 210 },
  { name: "NCA",  energy: 275, power: 1000, cycles: 1200, safety: 65, cost: 50,  baseHue: 35  },
  { name: "LTO",  energy: 80,  power: 2000, cycles: 8000, safety: 99, cost: 60,  baseHue: 290 },
  { name: "LMFP", energy: 230, power: 600,  cycles: 2500, safety: 90, cost: 35,  baseHue: 170 },
];

const METRICS: Record<MetricKey, { label: string; unit: string; max: number }> = {
  energy:  { label: "Energy Density",  unit: "Wh/kg",  max: 300  },
  power:   { label: "Power Density",   unit: "W/kg",   max: 2200 },
  cycles:  { label: "Cycle Life",      unit: "cycles", max: 8500 },
  safety:  { label: "Safety Score",    unit: "%",      max: 100  },
  cost:    { label: "Cost",            unit: "$/kWh",  max: 65   },
};

// Isometric 3D projection
function iso(
  wx: number, wy: number, wz: number,
  ox: number, oy: number,
  scaleH: number, scaleV: number,
): [number, number] {
  const cos30 = Math.sqrt(3) / 2;
  const sin30 = 0.5;
  const px = ox + (wx - wz) * cos30 * scaleH;
  const py = oy - wy * scaleV + (wx + wz) * sin30 * scaleH;
  return [px, py];
}

function hsl(hue: number, sat: number, lig: number) {
  return `hsl(${hue}, ${sat}%, ${lig}%)`;
}

function drawBar(
  ctx: CanvasRenderingContext2D,
  col: number,
  heightNorm: number,
  maxBarH: number,
  baseHue: number,
  ox: number,
  oy: number,
  scaleH: number,
  scaleV: number,
  bw: number,
  bd: number,
  progress: number,
) {
  const h = heightNorm * maxBarH * progress;
  const x0 = col * (bw + 0.3);
  const x1 = x0 + bw;
  const z0 = 0;
  const z1 = bd;

  const corners = {
    // base
    bfl: iso(x0, 0, z1, ox, oy, scaleH, scaleV),
    bfr: iso(x1, 0, z1, ox, oy, scaleH, scaleV),
    bbl: iso(x0, 0, z0, ox, oy, scaleH, scaleV),
    bbr: iso(x1, 0, z0, ox, oy, scaleH, scaleV),
    // top
    tfl: iso(x0, h, z1, ox, oy, scaleH, scaleV),
    tfr: iso(x1, h, z1, ox, oy, scaleH, scaleV),
    tbl: iso(x0, h, z0, ox, oy, scaleH, scaleV),
    tbr: iso(x1, h, z0, ox, oy, scaleH, scaleV),
  };

  // Right face
  ctx.beginPath();
  ctx.moveTo(...corners.bfr);
  ctx.lineTo(...corners.tfr);
  ctx.lineTo(...corners.tbr);
  ctx.lineTo(...corners.bbr);
  ctx.closePath();
  ctx.fillStyle = hsl(baseHue, 70, 30);
  ctx.fill();
  ctx.strokeStyle = hsl(baseHue, 50, 20);
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Left (front) face
  ctx.beginPath();
  ctx.moveTo(...corners.bfl);
  ctx.lineTo(...corners.tfl);
  ctx.lineTo(...corners.tfr);
  ctx.lineTo(...corners.bfr);
  ctx.closePath();
  ctx.fillStyle = hsl(baseHue, 70, 42);
  ctx.fill();
  ctx.stroke();

  // Top face
  ctx.beginPath();
  ctx.moveTo(...corners.tfl);
  ctx.lineTo(...corners.tbl);
  ctx.lineTo(...corners.tbr);
  ctx.lineTo(...corners.tfr);
  ctx.closePath();
  ctx.fillStyle = hsl(baseHue, 75, 58);
  ctx.fill();
  ctx.stroke();
}

function draw(
  canvas: HTMLCanvasElement,
  metric: MetricKey,
  scaleH: number,
  scaleV: number,
  progress: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const isDark =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const textColor = isDark ? "#cbd5e1" : "#334155";
  const subColor = isDark ? "#64748b" : "#94a3b8";

  const bw = 1.2;
  const bd = 0.8;
  const maxBarH = 5;
  const ox = w * 0.5 + 30;
  const oy = h * 0.72;

  const metaDef = METRICS[metric];

  // Draw floor grid
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  ctx.lineWidth = 0.5;
  const totalCols = MATERIALS.length;
  const gridW = totalCols * (bw + 0.3) + 1;
  for (let xi = 0; xi <= gridW; xi += 0.5) {
    const [ax, ay] = iso(xi, 0, 0, ox, oy, scaleH, scaleV);
    const [bx, by] = iso(xi, 0, bd + 0.5, ox, oy, scaleH, scaleV);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  for (let zi = 0; zi <= bd + 0.5; zi += 0.5) {
    const [ax, ay] = iso(0, 0, zi, ox, oy, scaleH, scaleV);
    const [bx, by] = iso(gridW, 0, zi, ox, oy, scaleH, scaleV);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  // Draw bars (back to front: from col N-1 to 0)
  for (let i = MATERIALS.length - 1; i >= 0; i--) {
    const mat = MATERIALS[i];
    const rawVal = mat[metric];
    const normVal = rawVal / metaDef.max;
    drawBar(ctx, i, normVal, maxBarH, mat.baseHue, ox, oy, scaleH, scaleV, bw, bd, progress);
  }

  // Labels above bars
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < MATERIALS.length; i++) {
    const mat = MATERIALS[i];
    const rawVal = mat[metric];
    const normVal = rawVal / metaDef.max;
    const h2 = normVal * maxBarH * progress;
    const x0 = i * (bw + 0.3) + bw / 2;
    const [px, py] = iso(x0, h2 + 0.15, bd / 2, ox, oy, scaleH, scaleV);
    ctx.fillStyle = hsl(mat.baseHue, 70, isDark ? 75 : 40);
    ctx.fillText(
      `${rawVal}${metaDef.unit.length <= 3 ? " " + metaDef.unit : ""}`,
      px, py,
    );
  }

  // X-axis labels
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = textColor;
  for (let i = 0; i < MATERIALS.length; i++) {
    const x0 = i * (bw + 0.3) + bw / 2;
    const [px, py] = iso(x0, -0.3, bd + 0.6, ox, oy, scaleH, scaleV);
    ctx.fillText(MATERIALS[i].name, px, py);
  }

  // Y-axis value markers
  ctx.font = "10px sans-serif";
  ctx.fillStyle = subColor;
  ctx.textAlign = "right";
  for (let v = 0; v <= 5; v++) {
    const yVal = (v / 5) * metaDef.max;
    const [px, py] = iso(-0.3, (v / 5) * maxBarH, 0, ox, oy, scaleH, scaleV);
    ctx.fillText(String(Math.round(yVal)), px, py + 4);
  }

  // Axis title
  ctx.save();
  ctx.font = "11px sans-serif";
  ctx.fillStyle = subColor;
  ctx.textAlign = "center";
  const [ax, ay] = iso(-0.5, maxBarH * 0.5, 0, ox, oy, scaleH, scaleV);
  ctx.translate(ax - 28, ay);
  ctx.rotate(-Math.PI / 4);
  ctx.fillText(`${metaDef.label} (${metaDef.unit})`, 0, 0);
  ctx.restore();
}

export function IsometricBarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const [metric, setMetric] = useState<MetricKey>("energy");
  const [scaleH, setScaleH] = useState(28);
  const [scaleV, setScaleV] = useState(38);

  const redraw = useCallback(
    (progress: number) => {
      if (canvasRef.current) draw(canvasRef.current, metric, scaleH, scaleV, progress);
    },
    [metric, scaleH, scaleV],
  );

  // Animate bars on metric change
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    progressRef.current = 0;
    const startTime = performance.now();
    const duration = 700;

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      progressRef.current = ease;
      redraw(ease);
      if (t < 1) animRef.current = requestAnimationFrame(step);
    }
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [metric, redraw]);

  useEffect(() => {
    redraw(progressRef.current || 1);
  }, [scaleH, scaleV, redraw]);

  const fields = [
    { key: "scaleH", label: "Horizontal Scale", value: scaleH, min: 15, max: 50, step: 1 },
    { key: "scaleV", label: "Vertical Scale",   value: scaleV, min: 20, max: 70, step: 1 },
  ];

  return (
    <ChartSection
      title="Isometric 3D Bar Chart"
      description="Battery material comparison in isometric projection — animated bars with Canvas 2D"
      chart={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Metric:</span>
            <Select value={metric} onValueChange={(v) => setMetric(v as MetricKey)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(METRICS) as MetricKey[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {METRICS[k].label} ({METRICS[k].unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <canvas
            ref={canvasRef}
            width={680}
            height={420}
            className="w-full h-auto rounded-md bg-muted/10"
          />
        </div>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "scaleH") setScaleH(v);
              else if (key === "scaleV") setScaleV(v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
