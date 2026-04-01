import type { Node, Edge } from "@xyflow/react";
import { WORKFLOW_STEPS } from "./workflow-data";

export type WorkflowNodeData = {
  stepId: string;
  label: string;
  description: string;
  status: string;
  isBranch?: boolean;
};

export const INITIAL_NODES: Node<WorkflowNodeData>[] = [
  {
    id: "protocol-design",
    type: "workflowStep",
    position: { x: 320, y: 40 },
    data: {
      stepId: "protocol-design",
      label: WORKFLOW_STEPS["protocol-design"].label,
      description: WORKFLOW_STEPS["protocol-design"].description,
      status: WORKFLOW_STEPS["protocol-design"].status,
    },
  },
  {
    id: "patient-screening",
    type: "workflowStep",
    position: { x: 320, y: 180 },
    data: {
      stepId: "patient-screening",
      label: WORKFLOW_STEPS["patient-screening"].label,
      description: WORKFLOW_STEPS["patient-screening"].description,
      status: WORKFLOW_STEPS["patient-screening"].status,
    },
  },
  {
    id: "data-collection",
    type: "workflowStep",
    position: { x: 320, y: 320 },
    data: {
      stepId: "data-collection",
      label: WORKFLOW_STEPS["data-collection"].label,
      description: WORKFLOW_STEPS["data-collection"].description,
      status: WORKFLOW_STEPS["data-collection"].status,
    },
  },
  {
    id: "safety-review",
    type: "workflowStep",
    position: { x: 320, y: 460 },
    data: {
      stepId: "safety-review",
      label: WORKFLOW_STEPS["safety-review"].label,
      description: WORKFLOW_STEPS["safety-review"].description,
      status: WORKFLOW_STEPS["safety-review"].status,
    },
  },
  // Efficacy analysis branches
  {
    id: "statistical-analysis",
    type: "workflowStep",
    position: { x: 60, y: 620 },
    data: {
      stepId: "statistical-analysis",
      label: WORKFLOW_STEPS["statistical-analysis"].label,
      description: WORKFLOW_STEPS["statistical-analysis"].description,
      status: WORKFLOW_STEPS["statistical-analysis"].status,
      isBranch: true,
    },
  },
  {
    id: "biomarker-analysis",
    type: "workflowStep",
    position: { x: 320, y: 620 },
    data: {
      stepId: "biomarker-analysis",
      label: WORKFLOW_STEPS["biomarker-analysis"].label,
      description: WORKFLOW_STEPS["biomarker-analysis"].description,
      status: WORKFLOW_STEPS["biomarker-analysis"].status,
      isBranch: true,
    },
  },
  {
    id: "safety-profile",
    type: "workflowStep",
    position: { x: 580, y: 620 },
    data: {
      stepId: "safety-profile",
      label: WORKFLOW_STEPS["safety-profile"].label,
      description: WORKFLOW_STEPS["safety-profile"].description,
      status: WORKFLOW_STEPS["safety-profile"].status,
      isBranch: true,
    },
  },
  {
    id: "regulatory-submission",
    type: "workflowStep",
    position: { x: 320, y: 780 },
    data: {
      stepId: "regulatory-submission",
      label: WORKFLOW_STEPS["regulatory-submission"].label,
      description: WORKFLOW_STEPS["regulatory-submission"].description,
      status: WORKFLOW_STEPS["regulatory-submission"].status,
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  {
    id: "e-protocol-screening",
    source: "protocol-design",
    target: "patient-screening",
    type: "smoothstep",
    animated: false,
    label: "Approved",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    labelStyle: { fill: "#22c55e", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  {
    id: "e-screening-collection",
    source: "patient-screening",
    target: "data-collection",
    type: "smoothstep",
    animated: false,
    label: "Approved",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    labelStyle: { fill: "#22c55e", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  {
    id: "e-collection-safety",
    source: "data-collection",
    target: "safety-review",
    type: "smoothstep",
    animated: false,
    label: "Approved",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    labelStyle: { fill: "#22c55e", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  // Branch edges from safety review
  {
    id: "e-safety-statistical",
    source: "safety-review",
    target: "statistical-analysis",
    type: "smoothstep",
    animated: false,
    label: "Branch A",
    style: { stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 3" },
    labelStyle: { fill: "#3b82f6", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  {
    id: "e-safety-biomarker",
    source: "safety-review",
    target: "biomarker-analysis",
    type: "smoothstep",
    animated: true,
    label: "Branch B",
    style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 3" },
    labelStyle: { fill: "#a855f7", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  {
    id: "e-safety-profile",
    source: "safety-review",
    target: "safety-profile",
    type: "smoothstep",
    animated: false,
    label: "Branch C",
    style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5 3" },
    labelStyle: { fill: "#f59e0b", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "transparent" },
  },
  // Merge back to regulatory submission
  {
    id: "e-statistical-submission",
    source: "statistical-analysis",
    target: "regulatory-submission",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#64748b", strokeWidth: 1.5 },
  },
  {
    id: "e-biomarker-submission",
    source: "biomarker-analysis",
    target: "regulatory-submission",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#64748b", strokeWidth: 1.5 },
  },
  {
    id: "e-safetyprofile-submission",
    source: "safety-profile",
    target: "regulatory-submission",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#64748b", strokeWidth: 1.5 },
  },
];
