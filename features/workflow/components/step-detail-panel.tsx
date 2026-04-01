"use client";

import { X, CheckCircle2, XCircle, Clock, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/features/shared/utils";
import type { WorkflowStep, PlotData } from "../data/workflow-data";

interface StepDetailPanelProps {
  step: WorkflowStep;
  onClose: () => void;
}

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    iconClass: "text-green-500",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    iconClass: "text-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    label: "Rejected",
  },
  running: {
    icon: Loader2,
    iconClass: "text-blue-500 animate-spin",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Running",
  },
  pending: {
    icon: Clock,
    iconClass: "text-slate-400",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    label: "Pending",
  },
} as const;

const CHART_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#ef4444", "#84cc16"];

function MiniBarChart({ plot }: { plot: PlotData }) {
  const maxVal = Math.max(...(plot.data as { value: number }[]).map((d) => d.value));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={plot.data} margin={{ top: 4, right: 8, left: -20, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
          interval={0}
          angle={-35}
          textAnchor="end"
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8 }}
          cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {(plot.data as { value: number }[]).map((entry, i) => (
            <Cell
              key={i}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              opacity={entry.value === maxVal ? 1 : 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MiniLineChart({ plot }: { plot: PlotData }) {
  const keys = Object.keys(plot.data[0] ?? {}).filter((k) => k !== "x" && k !== "week" && k !== "month" && k !== "cycle");
  const xKey = Object.keys(plot.data[0] ?? {}).find((k) =>
    ["x", "week", "month", "cycle"].includes(k)
  ) ?? "x";

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={plot.data} margin={{ top: 4, right: 8, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
        {keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniScatterChart({ plot }: { plot: PlotData }) {
  // Check if this is a forest-plot style data (has hr, lower, upper, label)
  const isForestPlot = plot.data[0] && "hr" in (plot.data[0] as Record<string, unknown>);

  if (isForestPlot) {
    const forestData = plot.data as { label: string; hr: number; lower: number; upper: number }[];
    return (
      <div className="space-y-1.5 px-2">
        {forestData.map((d, i) => {
          const pct = ((d.hr - 0.4) / (1.2 - 0.4)) * 100;
          const lPct = ((d.lower - 0.4) / (1.2 - 0.4)) * 100;
          const uPct = ((d.upper - 0.4) / (1.2 - 0.4)) * 100;
          return (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="w-20 text-right text-muted-foreground shrink-0">{d.label}</span>
              <div className="relative flex-1 h-4">
                <div className="absolute inset-y-[45%] w-full h-px bg-muted-foreground/20" />
                <div
                  className="absolute inset-y-[40%] h-[20%] bg-blue-400/40"
                  style={{ left: `${lPct}%`, width: `${uPct - lPct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500"
                  style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
                />
                <div className="absolute inset-y-0 bg-red-400/30 w-px" style={{ left: "50%" }} />
              </div>
              <span className="w-10 text-muted-foreground font-mono">{d.hr.toFixed(2)}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-2 pt-1 border-t border-border/50">
          <span className="w-20" />
          <div className="flex-1 flex justify-between">
            <span>0.4</span>
            <span>Favours Trt</span>
            <span>1.0</span>
            <span>Favours Ctrl</span>
            <span>1.2</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
        <XAxis dataKey="x" type="number" name="Biomarker" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <YAxis dataKey="y" type="number" name="Response" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} cursor={{ strokeDasharray: "3 3" }} />
        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 2" />
        <Scatter data={plot.data as { x: number; y: number }[]} fill="#3b82f6" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function WaterfallBar({ plot }: { plot: PlotData }) {
  const data = plot.data as { label: string; value: number }[];
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
          interval={0}
          angle={-35}
          textAnchor="end"
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={entry.value / total > 0.2 ? 1 : 0.7} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PlotBlock({ plot }: { plot: PlotData }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3">
      <p className="text-xs font-semibold text-foreground mb-2">{plot.title}</p>
      {plot.type === "bar" && <MiniBarChart plot={plot} />}
      {plot.type === "line" && <MiniLineChart plot={plot} />}
      {plot.type === "scatter" && <MiniScatterChart plot={plot} />}
      {plot.type === "waterfall" && <WaterfallBar plot={plot} />}
    </div>
  );
}

export function StepDetailPanel({ step, onClose }: StepDetailPanelProps) {
  const status = step.status as keyof typeof STATUS_CONFIG;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-border/60 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className={cn("shrink-0 w-4 h-4", cfg.iconClass)} />
            <h2 className="text-sm font-bold text-foreground leading-tight">{step.label}</h2>
          </div>
          <span className={cn("inline-block text-[10px] font-medium px-2 py-0.5 rounded-full", cfg.badge)}>
            {cfg.label}
          </span>
          {step.completedAt && (
            <span className="ml-2 text-[10px] text-muted-foreground">Completed {step.completedAt}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Duration: <strong className="text-foreground">{step.duration}</strong></span>
        </div>

        {/* Metrics grid */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            {step.metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 bg-muted/30 p-2.5"
              >
                <div className="text-[10px] text-muted-foreground mb-0.5">{m.label}</div>
                <div className="text-sm font-bold text-foreground">{m.value}</div>
                {m.delta && (
                  <div className={cn("flex items-center gap-0.5 text-[10px] mt-0.5", m.positive ? "text-green-600" : "text-red-500")}>
                    {m.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Plots */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Analysis Charts</p>
          <div className="space-y-3">
            {step.plots.map((plot, i) => (
              <PlotBlock key={i} plot={plot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
