"use client";

interface NumberInputEditorProps {
  fields: { key: string; label: string; value: number; min?: number; max?: number; step?: number }[];
  onChange: (key: string, value: number) => void;
}

export function NumberInputEditor({ fields, onChange }: NumberInputEditorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {fields.map((f) => (
        <div key={f.key} className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground truncate min-w-0 flex-1">
            {f.label}
          </label>
          <input
            type="number"
            value={f.value}
            min={f.min}
            max={f.max}
            step={f.step ?? 1}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(f.key, v);
            }}
            className="w-20 rounded-md border bg-background px-2 py-1 text-xs font-mono tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ))}
    </div>
  );
}
