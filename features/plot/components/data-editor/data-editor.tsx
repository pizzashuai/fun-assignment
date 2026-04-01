"use client";

import { useState, type ReactNode } from "react";
import { EditorModeToggle, type EditorMode } from "./editor-mode-toggle";

interface DataEditorProps {
  children: (mode: EditorMode) => ReactNode;
}

export function DataEditor({ children }: DataEditorProps) {
  const [mode, setMode] = useState<EditorMode>("slider");

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Mock Data
        </span>
        <EditorModeToggle mode={mode} onChange={setMode} />
      </div>
      {children(mode)}
    </div>
  );
}
