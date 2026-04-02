"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChartSection } from "../chart-section";
import { DataEditor } from "../data-editor/data-editor";
import { SliderEditor } from "../data-editor/slider-editor";
import { NumberInputEditor } from "../data-editor/number-input-editor";

interface BatteryPoint {
  temp: number;
  cycle: number;
  capacity: number;
  chemistry: string;
}

const CHEMISTRIES: { name: string; color: string; tempRange: [number, number]; decayRate: number; noiseScale: number }[] = [
  { name: "NMC-811",    color: "#3b82f6", tempRange: [15, 55], decayRate: 0.00025, noiseScale: 2.5 },
  { name: "LFP",        color: "#22c55e", tempRange: [0, 50],  decayRate: 0.00010, noiseScale: 1.8 },
  { name: "NCA",        color: "#f59e0b", tempRange: [20, 55], decayRate: 0.00030, noiseScale: 3.0 },
  { name: "LTO",        color: "#ec4899", tempRange: [-10, 60],decayRate: 0.00005, noiseScale: 1.2 },
];

function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateData(pointsPerChem: number, maxCycles: number): BatteryPoint[] {
  const data: BatteryPoint[] = [];
  CHEMISTRIES.forEach((chem, ci) => {
    const rand = rng(ci * 1337 + 42);
    for (let i = 0; i < pointsPerChem; i++) {
      const t = chem.tempRange[0] + rand() * (chem.tempRange[1] - chem.tempRange[0]);
      const cycle = Math.round(rand() * maxCycles);
      const tempFactor = 1 - Math.abs(t - 25) * 0.003;
      const cap =
        100 * tempFactor * Math.exp(-chem.decayRate * cycle) +
        (rand() - 0.5) * chem.noiseScale;
      data.push({ temp: t, cycle, capacity: Math.max(60, Math.min(102, cap)), chemistry: chem.name });
    }
  });
  return data;
}

export function Scatter3D() {
  const divRef = useRef<HTMLDivElement>(null);
  const [pointsPerChem, setPointsPerChem] = useState(40);
  const [maxCycles, setMaxCycles] = useState(500);
  const [opacity, setOpacity] = useState(0.82);
  const [markerSize, setMarkerSize] = useState(5);

  const buildPlot = useCallback(() => {
    if (!divRef.current) return;
    const data = generateData(pointsPerChem, maxCycles);

    const isDark = document.documentElement.classList.contains("dark");
    const paperBg = "rgba(0,0,0,0)";
    const gridColor = isDark ? "#444" : "#ccc";
    const textColor = isDark ? "#ccc" : "#333";

    const traces = CHEMISTRIES.map((chem) => {
      const pts = data.filter((d) => d.chemistry === chem.name);
      return {
        type: "scatter3d",
        name: chem.name,
        x: pts.map((d) => d.temp),
        y: pts.map((d) => d.cycle),
        z: pts.map((d) => d.capacity),
        mode: "markers",
        marker: { size: markerSize, color: chem.color, opacity, line: { width: 0 } },
      };
    });

    const layout = {
      paper_bgcolor: paperBg,
      plot_bgcolor: paperBg,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      legend: { font: { color: textColor }, bgcolor: "rgba(0,0,0,0)" },
      scene: {
        xaxis: { title: "Temperature (°C)", gridcolor: gridColor, color: textColor },
        yaxis: { title: "Cycle Number",      gridcolor: gridColor, color: textColor },
        zaxis: { title: "Capacity Retention (%)", gridcolor: gridColor, color: textColor },
        bgcolor: paperBg,
        camera: { eye: { x: 1.6, y: 1.2, z: 0.8 } },
      },
      font: { color: textColor },
    };

    import("plotly.js-dist-min").then((Plotly: unknown) => {
      if (!divRef.current) return;
      const P = Plotly as {
        newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config: unknown) => void;
        purge: (el: HTMLElement) => void;
      };
      if (divRef.current) P.purge(divRef.current);
      P.newPlot(divRef.current, traces, layout, {
        responsive: true,
        displayModeBar: false,
      });
    });
  }, [pointsPerChem, maxCycles, opacity, markerSize]);

  useEffect(() => {
    buildPlot();
    return () => {
      import("plotly.js-dist-min").then((Plotly: unknown) => {
        const P = Plotly as { purge: (el: HTMLElement) => void };
        if (divRef.current) P.purge(divRef.current);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildPlot]);

  const fields = [
    { key: "pointsPerChem", label: "Points / Chemistry", value: pointsPerChem, min: 10, max: 100, step: 10 },
    { key: "maxCycles",     label: "Max Cycles",          value: maxCycles,     min: 100, max: 1000, step: 50 },
    { key: "markerSize",    label: "Marker Size",         value: markerSize,    min: 2, max: 12, step: 1 },
    { key: "opacity",       label: "Opacity",             value: opacity,       min: 0.2, max: 1, step: 0.05 },
  ];

  return (
    <ChartSection
      title="3D Battery Cycling Scatter"
      description="Capacity retention (%) vs temperature and cycle number across four battery chemistries — drag to orbit"
      chart={<div ref={divRef} className="w-full rounded-md" style={{ height: 440 }} />}
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "pointsPerChem") setPointsPerChem(v);
              else if (key === "maxCycles") setMaxCycles(v);
              else if (key === "markerSize") setMarkerSize(v);
              else if (key === "opacity") setOpacity(v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
