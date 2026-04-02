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

type CurveKey = "helix" | "trefoil" | "lissajous" | "torus_knot" | "viviani" | "spring";

interface CurveDef {
  label: string;
  desc: string;
  tMax: number;
  steps: number;
  fn: (t: number, a: number, b: number) => [number, number, number];
  color: number;
  defaultA: number;
  defaultB: number;
  labelA: string;
  labelB: string;
}

const CURVES: Record<CurveKey, CurveDef> = {
  helix: {
    label: "Helix",
    desc: "x=cos(t), y=sin(t), z=t/b — DNA double helix, solenoids, spring physics",
    tMax: Math.PI * 6,
    steps: 300,
    fn: (t, a, b) => [a * Math.cos(t), a * Math.sin(t), t / b],
    color: 0x3b82f6,
    defaultA: 1.5,
    defaultB: 2,
    labelA: "Radius",
    labelB: "Pitch",
  },
  trefoil: {
    label: "Trefoil Knot",
    desc: "Simplest non-trivial knot — topology, polymer entanglement, magnetic field lines",
    tMax: Math.PI * 2,
    steps: 400,
    fn: (t, a) => [
      a * (Math.sin(t) + 2 * Math.sin(2 * t)),
      a * (Math.cos(t) - 2 * Math.cos(2 * t)),
      a * -Math.sin(3 * t),
    ],
    color: 0xec4899,
    defaultA: 0.7,
    defaultB: 1,
    labelA: "Scale",
    labelB: "(unused)",
  },
  lissajous: {
    label: "Lissajous 3D",
    desc: "x=cos(at), y=sin(bt), z=cos(ct+δ) — harmonic oscillators, signal analysis",
    tMax: Math.PI * 2,
    steps: 600,
    fn: (t, a, b) => [
      Math.cos(a * t),
      Math.sin(b * t),
      Math.cos((a + b) * t + 0.7),
    ],
    color: 0xf59e0b,
    defaultA: 3,
    defaultB: 5,
    labelA: "Freq a",
    labelB: "Freq b",
  },
  torus_knot: {
    label: "Torus Knot (p,q)",
    desc: "Knot wrapped on a torus — algebraic topology, fiber bundles, particle physics",
    tMax: Math.PI * 2,
    steps: 500,
    fn: (t, a, b) => {
      const p = Math.round(a);
      const q = Math.round(b);
      const r = Math.cos(q * t) + 2.2;
      return [r * Math.cos(p * t), r * Math.sin(p * t), -Math.sin(q * t)];
    },
    color: 0x22c55e,
    defaultA: 2,
    defaultB: 3,
    labelA: "p (wraps)",
    labelB: "q (turns)",
  },
  viviani: {
    label: "Viviani's Curve",
    desc: "Intersection of a sphere and cylinder — 17th-century geometry, surveying",
    tMax: Math.PI * 2,
    steps: 300,
    fn: (t, a) => [
      a * (1 + Math.cos(t)),
      a * Math.sin(t),
      2 * a * Math.sin(t / 2),
    ],
    color: 0xa855f7,
    defaultA: 1.2,
    defaultB: 1,
    labelA: "Radius",
    labelB: "(unused)",
  },
  spring: {
    label: "Conical Spring",
    desc: "Expanding helix — mechanical spring design, antenna coils, architecture",
    tMax: Math.PI * 8,
    steps: 350,
    fn: (t, a, b) => {
      const growth = t / (Math.PI * 8);
      return [
        (0.5 + growth * a) * Math.cos(t),
        (0.5 + growth * a) * Math.sin(t),
        (t - Math.PI * 4) / b,
      ];
    },
    color: 0xf97316,
    defaultA: 1.0,
    defaultB: 2.5,
    labelA: "Flare Rate",
    labelB: "Pitch",
  },
};

export function ParametricCurve3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<{ position: { z: number } } | null>(null);
  const [curveKey, setCurveKey] = useState<CurveKey>("trefoil");
  const [paramA, setParamA] = useState(CURVES[curveKey].defaultA);
  const [paramB, setParamB] = useState(CURVES[curveKey].defaultB);
  const [tubeRadius, setTubeRadius] = useState(0.08);
  const [zoom, setZoom] = useState(6.0);

  useEffect(() => {
    const def = CURVES[curveKey];
    setParamA(def.defaultA);
    setParamB(def.defaultB);
  }, [curveKey]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoom;
    }
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanupFn: (() => void) | null = null;

    const def = CURVES[curveKey];

    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) return;

      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 400;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
      camera.position.set(0, 0, zoom);
      cameraRef.current = camera as unknown as { position: { z: number } };

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h, false);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);
      const sun = new THREE.DirectionalLight(0xffffff, 1.2);
      sun.position.set(6, 8, 10);
      scene.add(sun);
      const rim = new THREE.DirectionalLight(def.color, 0.6);
      rim.position.set(-6, -4, -6);
      scene.add(rim);

      // Build curve points
      const pts: import("three").Vector3[] = [];
      for (let i = 0; i <= def.steps; i++) {
        const t = (i / def.steps) * def.tMax;
        const [x, y, z] = def.fn(t, paramA, paramB);
        pts.push(new THREE.Vector3(x, y, z));
      }

      const curvePath = new THREE.CatmullRomCurve3(pts, def.tMax === Math.PI * 2);
      const tubeGeo = new THREE.TubeGeometry(curvePath, def.steps * 2, tubeRadius, 12, def.tMax === Math.PI * 2);

      // Gradient-colored material using vertex colors
      const colors: number[] = [];
      const posArr = tubeGeo.attributes.position;
      const segments = tubeGeo.parameters.tubularSegments;
      const radialSegs = tubeGeo.parameters.radialSegments;
      const baseColor = new THREE.Color(def.color);
      const endColor = new THREE.Color(def.color).offsetHSL(0.2, 0, 0.3);

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const c = baseColor.clone().lerp(endColor, t);
        for (let j = 0; j <= radialSegs; j++) {
          colors.push(c.r, c.g, c.b);
        }
      }
      tubeGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      const tubeMat = new THREE.MeshPhongMaterial({
        vertexColors: true,
        shininess: 120,
        specular: 0x444444,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);

      // Subtle grid floor
      const grid = new THREE.GridHelper(8, 16, 0x333333, 0x222222);
      grid.position.y = -3.5;
      grid.material = new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.3, transparent: true });
      scene.add(grid);

      let isDragging = false;
      let prev = { x: 0, y: 0 };
      let rotY = 0;
      let rotX = 0.2;
      let autoT = 0;

      const onDown = (e: MouseEvent) => { isDragging = true; prev = { x: e.clientX, y: e.clientY }; };
      const onUp = () => { isDragging = false; };
      const onMove = (e: MouseEvent) => {
        if (!isDragging) return;
        rotY += (e.clientX - prev.x) * 0.012;
        rotX += (e.clientY - prev.y) * 0.012;
        prev = { x: e.clientX, y: e.clientY };
      };

      canvas.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("mousemove", onMove);

      let animId: number;
      function animate() {
        animId = requestAnimationFrame(animate);
        if (!isDragging) {
          autoT += 0.006;
          tubeMesh.rotation.y = autoT;
          tubeMesh.rotation.x = Math.sin(autoT * 0.4) * 0.25;
        } else {
          tubeMesh.rotation.y = rotY;
          tubeMesh.rotation.x = rotX;
        }
        renderer.render(scene, camera);
      }
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("mousemove", onMove);
        renderer.dispose();
        cameraRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curveKey, paramA, paramB, tubeRadius]);

  const def = CURVES[curveKey];
  const fields = [
    { key: "paramA", label: def.labelA, value: paramA, min: 0.1, max: 5, step: 0.1 },
    { key: "paramB", label: def.labelB, value: paramB, min: 0.5, max: 8, step: 0.5 },
    { key: "tubeRadius", label: "Tube Radius", value: tubeRadius, min: 0.02, max: 0.3, step: 0.01 },
    { key: "zoom", label: "Camera Distance", value: zoom, min: 3, max: 14, step: 0.5 },
  ];

  return (
    <ChartSection
      title="Parametric 3D Curves"
      description={def.desc}
      chart={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Curve:</span>
            <Select value={curveKey} onValueChange={(v) => setCurveKey(v as CurveKey)}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CURVES) as CurveKey[]).map((k) => (
                  <SelectItem key={k} value={k}>{CURVES[k].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground italic">Drag to rotate</span>
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="w-full h-auto rounded-md bg-muted/20 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          />
        </div>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "paramA") setParamA(v);
              else if (key === "paramB") setParamB(v);
              else if (key === "tubeRadius") setTubeRadius(v);
              else if (key === "zoom") setZoom(v);
            };
            if (mode === "slider") return <SliderEditor fields={fields} onChange={handleChange} />;
            return <NumberInputEditor fields={fields} onChange={handleChange} />;
          }}
        </DataEditor>
      }
    />
  );
}
