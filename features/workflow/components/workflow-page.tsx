"use client";

import dynamic from "next/dynamic";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";

const WorkflowGraph = dynamic(
  () => import("./workflow-graph").then((m) => ({ default: m.WorkflowGraph })),
  { ssr: false }
);

export function WorkflowPage() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Clinical Trial Workflow</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive approval pipeline — click a node to view details, approve or reject steps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Phase III · Protocol ID: CT-2024-481</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main — fills remaining height */}
      <main className="flex-1 min-h-0">
        <WorkflowGraph />
      </main>
    </div>
  );
}
