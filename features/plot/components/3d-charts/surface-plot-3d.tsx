"use client";

import { useState, useRef, useEffect } from "react";
import { ChartSection } from "../chart-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";

type FnKey = "gaussian" | "saddle" | "wave" | "mexican_hat" | "ripple" | "potential";

interface FnDef {
  label: string;
  desc: string;
  fn: (x: number, y: number, A: number, freq: number) => number;
  defaultA: number;
  defaultFreq: number;
}

const FUNCTIONS: Record<FnKey, FnDef> = {
  gaussian: {
    label: "Gaussian Bell",
    desc: "z = A · exp(−(x²+y²) / (2σ²)) — Probability density, wave packets",
    fn: (x, y, A, freq) => A * Math.exp(-(x * x + y * y) / (2 * freq * freq)),
    defaultA: 3,
    defaultFreq: 2,
  },
  saddle: {
    label: "Saddle Surface",
    desc: "z = A(x² − y²) — Classic saddle point in calculus & optimization",
    fn: (x, y, A) => A * (x * x - y * y) * 0.15,
    defaultA: 3,
    defaultFreq: 1,
  },
  wave: {
    label: "Standing Wave",
    desc: "z = A · sin(fx) · cos(fy) — Wave interference, quantum orbitals",
    fn: (x, y, A, freq) => A * Math.sin(freq * x) * Math.cos(freq * y),
    defaultA: 2,
    defaultFreq: 1,
  },
  mexican_hat: {
    label: "Mexican Hat",
    desc: "z = A(1 − r²)·exp(−r²/2) — Ricker wavelet, Laplacian of Gaussian",
    fn: (x, y, A, freq) => {
      const r2 = (x * x + y * y) * freq;
      return A * (1 - r2) * Math.exp(-r2 / 2);
    },
    defaultA: 3,
    defaultFreq: 0.5,
  },
  ripple: {
    label: "Circular Ripple",
    desc: "z = A · sin(f·r)/r — Diffraction pattern, electromagnetic waves",
    fn: (x, y, A, freq) => {
      const r = Math.sqrt(x * x + y * y) + 1e-6;
      return A * Math.sin(freq * r) / r;
    },
    defaultA: 4,
    defaultFreq: 2,
  },
  potential: {
    label: "Double-Well Potential",
    desc: "z = A(x⁴ − x² + y²) — Energy landscape in chemistry & physics",
    fn: (x, y, A, freq) =>
      A * (x * x * x * x * 0.05 - x * x * freq * 0.3 + y * y * 0.1),
    defaultA: 2,
    defaultFreq: 2,
  },
};

function buildSurface(fnDef: FnDef, A: number, freq: number, n: number) {
  const range = 4;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    xs.push(-range + (2 * range * i) / (n - 1));
    ys.push(-range + (2 * range * i) / (n - 1));
  }
  const z: number[][] = ys.map((y) => xs.map((x) => fnDef.fn(x, y, A, freq)));
  return { x: xs, y: ys, z };
}

export function SurfacePlot3D() {
  const divRef = useRef<HTMLDivElement>(null);
  const [fnKey, setFnKey] = useState<FnKey>("wave");
  const [amplitude, setAmplitude] = useState(FUNCTIONS[fnKey].defaultA);
  const [freq, setFreq] = useState(FUNCTIONS[fnKey].defaultFreq);
  const [resolution, setResolution] = useState(40);
  const [colorscale, setColorscale] = useState<string>("Viridis");

  const COLORSCALES = ["Viridis", "Plasma", "RdBu", "Hot", "Cividis", "Earth"];

  useEffect(() => {
    const def = FUNCTIONS[fnKey];
    setAmplitude(def.defaultA);
    setFreq(def.defaultFreq);
  }, [fnKey]);

  useEffect(() => {
    if (!divRef.current) return;
    const def = FUNCTIONS[fnKey];
    const { x, y, z } = buildSurface(def, amplitude, freq, resolution);

    const isDark = document.documentElement.classList.contains("dark");
    const paperBg = isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)";
    const gridColor = isDark ? "#444" : "#ccc";
    const textColor = isDark ? "#ccc" : "#333";

    let cancelled = false;
    import("plotly.js-dist-min").then((Plotly: unknown) => {
      if (cancelled || !divRef.current) return;
      const P = Plotly as {
        newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config: unknown) => void;
        purge: (el: HTMLElement) => void;
      };

      const data = [
        {
          type: "surface",
          x,
          y,
          z,
          colorscale,
          opacity: 0.92,
          contours: {
            z: { show: true, usecolormap: true, highlightcolor: "#42f462", project: { z: true } },
          },
        },
      ];

      const layout = {
        paper_bgcolor: paperBg,
        plot_bgcolor: paperBg,
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
          xaxis: { title: "x", gridcolor: gridColor, color: textColor },
          yaxis: { title: "y", gridcolor: gridColor, color: textColor },
          zaxis: { title: "z", gridcolor: gridColor, color: textColor },
          bgcolor: paperBg,
          camera: { eye: { x: 1.4, y: 1.4, z: 0.9 } },
        },
        font: { color: textColor },
      };

      P.newPlot(divRef.current, data, layout, {
        responsive: true,
        displayModeBar: false,
      });
    });

    return () => {
      cancelled = true;
      import("plotly.js-dist-min").then((Plotly: unknown) => {
        const P = Plotly as { purge: (el: HTMLElement) => void };
        if (divRef.current) P.purge(divRef.current);
      });
    };
  }, [fnKey, amplitude, freq, resolution, colorscale]);

  const def = FUNCTIONS[fnKey];
  const ampField = { key: "amplitude", label: "Amplitude (A)", value: amplitude, min: 0.5, max: 6, step: 0.5 };
  const freqField = { key: "freq", label: "Frequency / σ", value: freq, min: 0.2, max: 4, step: 0.2 };
  const resField = { key: "resolution", label: "Grid Resolution", value: resolution, min: 15, max: 60, step: 5 };

  return (
    <ChartSection
      title="3D Surface Plot"
      description={def.desc}
      chart={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Function:</span>
              <Select value={fnKey} onValueChange={(v) => setFnKey(v as FnKey)}>
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FUNCTIONS) as FnKey[]).map((k) => (
                    <SelectItem key={k} value={k}>{FUNCTIONS[k].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Colors:</span>
              <Select value={colorscale} onValueChange={setColorscale}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLORSCALES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div ref={divRef} className="w-full rounded-md" style={{ height: 420 }} />
        </div>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "amplitude") setAmplitude(v);
              else if (key === "freq") setFreq(v);
              else if (key === "resolution") setResolution(v);
            };
            const fields = [ampField, freqField, resField];
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
