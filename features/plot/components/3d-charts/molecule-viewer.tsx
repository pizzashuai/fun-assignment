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

type MolKey = "licoo2" | "lipf6" | "ec";

interface AtomSpec {
  pos: [number, number, number];
  el: string;
  hexColor: number;
  r: number;
}

interface BondSpec {
  a: number;
  b: number;
}

interface MolDef {
  label: string;
  desc: string;
  atoms: AtomSpec[];
  bonds: BondSpec[];
}

const EL_COLOR: Record<string, number> = {
  H: 0xe8e8e8,
  C: 0x444444,
  O: 0xee2222,
  Li: 0x00cc55,
  Co: 0x3399ff,
  P: 0xaa44ff,
  F: 0x55dd22,
};

const EL_RADIUS: Record<string, number> = {
  H: 0.22,
  C: 0.35,
  O: 0.32,
  Li: 0.42,
  Co: 0.48,
  P: 0.40,
  F: 0.28,
};

function atom(el: string, pos: [number, number, number]): AtomSpec {
  return { pos, el, hexColor: EL_COLOR[el] ?? 0x888888, r: EL_RADIUS[el] ?? 0.35 };
}

function makeLiCoO2(): MolDef {
  const atoms: AtomSpec[] = [
    atom("Co", [0, 0, 0]),
    atom("O", [2.0, 0, 0]), atom("O", [-2.0, 0, 0]),
    atom("O", [0, 2.0, 0]), atom("O", [0, -2.0, 0]),
    atom("O", [0, 0, 2.0]), atom("O", [0, 0, -2.0]),
    atom("Li", [0, 3.7, 0]), atom("Li", [0, -3.7, 0]),
  ];
  const bonds: BondSpec[] = [
    { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 },
    { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 },
    { a: 7, b: 3 }, { a: 8, b: 4 },
  ];
  return {
    label: "LiCoO₂ Fragment",
    desc: "Layered oxide cathode — Co in octahedral oxygen coordination, Li in interlayer sites",
    atoms,
    bonds,
  };
}

function makeLiPF6(): MolDef {
  const d = 1.6;
  const atoms: AtomSpec[] = [
    atom("P", [0, 0, 0]),
    atom("F", [d, 0, 0]), atom("F", [-d, 0, 0]),
    atom("F", [0, d, 0]), atom("F", [0, -d, 0]),
    atom("F", [0, 0, d]), atom("F", [0, 0, -d]),
    atom("Li", [3.6, 0, 0]),
  ];
  const bonds: BondSpec[] = [
    { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 },
    { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 },
  ];
  return {
    label: "LiPF₆",
    desc: "Most common Li-ion salt — PF₆⁻ octahedron ion-paired with Li⁺",
    atoms,
    bonds,
  };
}

function makeEC(): MolDef {
  const r = 1.4;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const degs = [90, 162, 234, 306, 18];
  const ring = degs.map(
    (d) => [r * Math.cos(toRad(d)), 0, r * Math.sin(toRad(d))] as [number, number, number]
  );
  const [c1, o1pos, c2, c3, o2pos] = ring;
  const atoms: AtomSpec[] = [
    atom("C", c1),
    atom("O", o1pos),
    atom("C", c2),
    atom("C", c3),
    atom("O", o2pos),
    atom("O", [c1[0], 1.28, c1[2]]),
    atom("H", [c2[0] - 0.7, 0.88, c2[2]]),
    atom("H", [c2[0] + 0.35, -0.88, c2[2]]),
    atom("H", [c3[0] - 0.35, 0.88, c3[2]]),
    atom("H", [c3[0] + 0.7, -0.88, c3[2]]),
  ];
  const bonds: BondSpec[] = [
    { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 },
    { a: 3, b: 4 }, { a: 4, b: 0 }, { a: 0, b: 5 },
    { a: 2, b: 6 }, { a: 2, b: 7 }, { a: 3, b: 8 }, { a: 3, b: 9 },
  ];
  return {
    label: "Ethylene Carbonate",
    desc: "Common electrolyte solvent in Li-ion batteries — 5-membered ring with carbonyl",
    atoms,
    bonds,
  };
}

const MOLECULES: Record<MolKey, MolDef> = {
  licoo2: makeLiCoO2(),
  lipf6: makeLiPF6(),
  ec: makeEC(),
};

export function MoleculeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<{ position: { z: number } } | null>(null);
  const spinRef = useRef(1.0);
  const [molKey, setMolKey] = useState<MolKey>("licoo2");
  const [spinSpeed, setSpinSpeed] = useState(1.0);
  const [zoom, setZoom] = useState(6.0);
  spinRef.current = spinSpeed;

  // Update camera zoom without rebuilding scene
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

    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current) return;

      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 400;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
      camera.position.set(0, 0, zoom);
      cameraRef.current = camera as unknown as { position: { z: number } };

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h, false);

      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(ambient);
      const sun = new THREE.DirectionalLight(0xffffff, 1.1);
      sun.position.set(5, 8, 10);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0x8899ff, 0.35);
      fill.position.set(-6, -4, -6);
      scene.add(fill);

      const mol = MOLECULES[molKey];
      const molGroup = new THREE.Group();
      scene.add(molGroup);

      const positions = mol.atoms.map((a) => new THREE.Vector3(...a.pos));

      for (const a of mol.atoms) {
        const geo = new THREE.SphereGeometry(a.r, 28, 28);
        const mat = new THREE.MeshPhongMaterial({
          color: a.hexColor,
          shininess: 110,
          specular: 0x333333,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...a.pos);
        molGroup.add(mesh);
      }

      const bondMat = new THREE.MeshPhongMaterial({ color: 0x777777, shininess: 50 });
      for (const b of mol.bonds) {
        const pA = positions[b.a];
        const pB = positions[b.b];
        const dir = new THREE.Vector3().subVectors(pB, pA);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
        const geo = new THREE.CylinderGeometry(0.08, 0.08, len, 10);
        const mesh = new THREE.Mesh(geo, bondMat);
        mesh.position.copy(mid);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        molGroup.add(mesh);
      }

      let isDragging = false;
      let prev = { x: 0, y: 0 };
      let manualRY = 0;
      let manualRX = 0;
      let autoT = 0;

      const onDown = (e: MouseEvent) => {
        isDragging = true;
        prev = { x: e.clientX, y: e.clientY };
      };
      const onUp = () => { isDragging = false; };
      const onMove = (e: MouseEvent) => {
        if (!isDragging) return;
        manualRY += (e.clientX - prev.x) * 0.012;
        manualRX += (e.clientY - prev.y) * 0.012;
        prev = { x: e.clientX, y: e.clientY };
      };

      canvas.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("mousemove", onMove);

      let animId: number;
      function animate() {
        animId = requestAnimationFrame(animate);
        autoT += 0.016 * spinRef.current;
        if (isDragging || (manualRX !== 0 && manualRY !== 0)) {
          molGroup.rotation.y = manualRY;
          molGroup.rotation.x = manualRX;
        } else {
          molGroup.rotation.y = autoT;
          molGroup.rotation.x = Math.sin(autoT * 0.28) * 0.22;
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
  }, [molKey]);

  const mol = MOLECULES[molKey];
  const uniqueEls = [...new Set(mol.atoms.map((a) => a.el))];

  const fields = [
    { key: "spinSpeed", label: "Spin Speed", value: spinSpeed, min: 0, max: 4, step: 0.1 },
    { key: "zoom", label: "Camera Distance", value: zoom, min: 3, max: 14, step: 0.5 },
  ];

  return (
    <ChartSection
      title="3D Molecule Viewer"
      description={mol.desc}
      chart={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Molecule:</span>
            <Select value={molKey} onValueChange={(v) => setMolKey(v as MolKey)}>
              <SelectTrigger className="w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MOLECULES) as MolKey[]).map((k) => (
                  <SelectItem key={k} value={k}>{MOLECULES[k].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground italic">Drag to rotate</span>
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              className="w-full h-auto rounded-md bg-muted/20 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            />
            <div className="absolute bottom-2 right-2 flex flex-wrap gap-2">
              {uniqueEls.map((el) => (
                <div key={el} className="flex items-center gap-1 bg-background/80 rounded px-1.5 py-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: `#${EL_COLOR[el].toString(16).padStart(6, "0")}` }}
                  />
                  <span className="text-[10px] font-mono">{el}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      editor={
        <DataEditor>
          {(mode) => {
            const handleChange = (key: string, v: number) => {
              if (key === "spinSpeed") setSpinSpeed(v);
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
