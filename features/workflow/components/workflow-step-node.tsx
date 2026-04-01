"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, XCircle, Clock, Loader2, ChevronRight, GitBranch } from "lucide-react";
import { cn } from "@/features/shared/utils";
import type { WorkflowNodeData } from "../data/workflow-graph";

const STATUS_CONFIG = {
  approved: {
    border: "border-green-500/60",
    bg: "bg-green-50 dark:bg-green-950/20",
    icon: CheckCircle2,
    iconClass: "text-green-500",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    label: "Approved",
  },
  rejected: {
    border: "border-red-500/60",
    bg: "bg-red-50 dark:bg-red-950/20",
    icon: XCircle,
    iconClass: "text-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    label: "Rejected",
  },
  running: {
    border: "border-blue-500/60",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    icon: Loader2,
    iconClass: "text-blue-500 animate-spin",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Running",
  },
  pending: {
    border: "border-slate-300 dark:border-slate-700",
    bg: "bg-slate-50 dark:bg-slate-900/40",
    icon: Clock,
    iconClass: "text-slate-400",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    label: "Pending",
  },
} as const;

interface WorkflowStepNodeProps extends NodeProps {
  data: WorkflowNodeData & {
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    isSelected?: boolean;
  };
}

export const WorkflowStepNode = memo(function WorkflowStepNode({
  id,
  data,
  selected,
}: WorkflowStepNodeProps) {
  const status = (data.status as keyof typeof STATUS_CONFIG) ?? "pending";
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  const handleApprove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      data.onApprove?.(id);
    },
    [id, data]
  );

  const handleReject = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      data.onReject?.(id);
    },
    [id, data]
  );

  const isPending = status === "pending" || status === "running";

  return (
    <div
      className={cn(
        "relative w-52 rounded-xl border-2 shadow-sm transition-all duration-150 cursor-pointer select-none",
        cfg.border,
        cfg.bg,
        selected
          ? "ring-2 ring-blue-400 ring-offset-2 shadow-md scale-[1.02]"
          : "hover:shadow-md hover:scale-[1.01]"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
      />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {data.isBranch && (
              <GitBranch className="shrink-0 w-3 h-3 text-slate-400" />
            )}
            <span className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
              {data.label}
            </span>
          </div>
          <StatusIcon className={cn("shrink-0 w-4 h-4 mt-0.5", cfg.iconClass)} />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1 mb-2">
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", cfg.badge)}>
            {cfg.label}
          </span>
        </div>

        {/* View details hint */}
        <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
          <ChevronRight className="w-3 h-3" />
          <span>Click to view details</span>
        </div>

        {/* Approve / Reject buttons for actionable steps */}
        {isPending && (
          <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-border/50">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-[10px] font-semibold py-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              Approve
            </button>
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[10px] font-semibold py-1.5 transition-colors"
            >
              <XCircle className="w-3 h-3" />
              Reject
            </button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
      />
    </div>
  );
});
