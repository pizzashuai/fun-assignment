"use client";

import { Slider } from "@/features/shared/components/ui/slider";

interface SliderEditorProps {
  fields: { key: string; label: string; value: number; min: number; max: number; step?: number }[];
  onChange: (key: string, value: number) => void;
}

export function SliderEditor({ fields, onChange }: SliderEditorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground truncate mr-2">{f.label}</span>
            <span className="font-mono font-medium tabular-nums">{f.value}</span>
          </div>
          <Slider
            value={[f.value]}
            min={f.min}
            max={f.max}
            step={f.step ?? 1}
            onValueChange={([v]) => onChange(f.key, v)}
          />
        </div>
      ))}
    </div>
  );
}
