"use client";

import { cn } from "@/features/shared/utils";

export type EditorMode = "slider" | "number" | "table";

interface EditorModeToggleProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}

const modes: { value: EditorMode; label: string }[] = [
  { value: "slider", label: "Sliders" },
  { value: "number", label: "Numbers" },
  { value: "table", label: "Table" },
];

export function EditorModeToggle({ mode, onChange }: EditorModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md bg-muted p-1 text-muted-foreground">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-xs font-medium transition-all",
            mode === m.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground/80"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
