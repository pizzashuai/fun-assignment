"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { WorkflowStepNode } from "./workflow-step-node";
import { StepDetailPanel } from "./step-detail-panel";
import { INITIAL_NODES, INITIAL_EDGES, type WorkflowNodeData } from "../data/workflow-graph";
import { WORKFLOW_STEPS } from "../data/workflow-data";
import type { WorkflowStep } from "../data/workflow-data";

const NODE_TYPES = { workflowStep: WorkflowStepNode };

export function WorkflowGraph() {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);

  const handleApprove = useCallback(
    (id: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, status: "approved" } }
            : n
        )
      );
    },
    [setNodes]
  );

  const handleReject = useCallback(
    (id: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, status: "rejected" } }
            : n
        )
      );
    },
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      const step = WORKFLOW_STEPS[node.data.stepId];
      if (step) {
        // Reflect live status from the node into the step detail
        setSelectedStep({ ...step, status: node.data.status as WorkflowStep["status"] });
      }
    },
    []
  );

  // Inject callbacks into node data at render time
  const nodesWithCallbacks = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onApprove: handleApprove,
      onReject: handleReject,
      isSelected: selectedStep?.id === n.data.stepId,
    },
  }));

  const onConnect = useCallback(
    (params: Connection) => addEdge(params, edges),
    [edges]
  );

  return (
    <div className="flex h-full min-h-0">
      {/* Flow canvas */}
      <div className="flex-1 min-w-0 relative">
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="currentColor"
            className="opacity-10"
          />
          <Controls
            className="!bg-background !border-border !shadow-sm [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
          />
          <MiniMap
            className="!bg-muted/80 !border-border"
            nodeColor={(n) => {
              const s = (n.data as WorkflowNodeData).status;
              if (s === "approved") return "#22c55e";
              if (s === "rejected") return "#ef4444";
              if (s === "running") return "#3b82f6";
              return "#94a3b8";
            }}
            maskColor="rgba(0,0,0,0.06)"
          />
        </ReactFlow>

        {/* Legend */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-3 bg-background/90 backdrop-blur-sm border border-border/60 rounded-xl px-3 py-2 shadow-sm">
          {[
            { color: "bg-green-500", label: "Approved" },
            { color: "bg-red-500", label: "Rejected" },
            { color: "bg-blue-500", label: "Running" },
            { color: "bg-slate-400", label: "Pending" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
          <div className="w-px bg-border mx-0.5" />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-5 h-px bg-blue-400 border-t-2 border-dashed" />
            Branch
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={`
          border-l border-border bg-card transition-all duration-300 ease-in-out overflow-hidden
          ${selectedStep ? "w-80 xl:w-96" : "w-0"}
        `}
      >
        {selectedStep && (
          <StepDetailPanel
            step={selectedStep}
            onClose={() => setSelectedStep(null)}
          />
        )}
      </div>
    </div>
  );
}
