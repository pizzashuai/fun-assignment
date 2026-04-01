export type StepStatus = "approved" | "rejected" | "pending" | "running";

export interface PlotData {
  type: "line" | "bar" | "scatter" | "waterfall";
  title: string;
  data: Record<string, unknown>[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
  duration: string;
  completedAt?: string;
  plots: PlotData[];
  metrics: { label: string; value: string; delta?: string; positive?: boolean }[];
}

// --- Mock plots per step ---

const protocolDesignStep: WorkflowStep = {
  id: "protocol-design",
  label: "Protocol Design",
  description: "Define trial objectives, endpoints, eligibility criteria, and statistical analysis plan.",
  status: "approved",
  duration: "14 days",
  completedAt: "2024-01-15",
  metrics: [
    { label: "Primary Endpoints", value: "3", positive: true },
    { label: "Eligibility Criteria", value: "12" },
    { label: "Sample Size", value: "480 patients", positive: true },
    { label: "Power", value: "90%", positive: true },
  ],
  plots: [
    {
      type: "bar",
      title: "Endpoint Priority Score",
      data: [
        { label: "Overall Survival", value: 95 },
        { label: "Progression-Free Survival", value: 88 },
        { label: "Objective Response Rate", value: 76 },
        { label: "Quality of Life", value: 62 },
        { label: "Biomarker Response", value: 55 },
      ],
    },
    {
      type: "line",
      title: "Sample Size vs. Statistical Power",
      data: [
        { x: 100, power: 52 },
        { x: 200, power: 70 },
        { x: 300, power: 82 },
        { x: 400, power: 89 },
        { x: 480, power: 90 },
        { x: 550, power: 93 },
      ],
    },
  ],
};

const patientScreeningStep: WorkflowStep = {
  id: "patient-screening",
  label: "Patient Screening",
  description: "Screen candidates against inclusion/exclusion criteria. Collect baseline demographics.",
  status: "approved",
  duration: "42 days",
  completedAt: "2024-02-26",
  metrics: [
    { label: "Screened", value: "812" },
    { label: "Enrolled", value: "481", positive: true },
    { label: "Screen Failure Rate", value: "40.8%", positive: false },
    { label: "Median Age", value: "54 yrs" },
  ],
  plots: [
    {
      type: "bar",
      title: "Screen Failure Reasons",
      data: [
        { label: "Prior Therapy", value: 38 },
        { label: "Lab Out-of-Range", value: 27 },
        { label: "Comorbidities", value: 22 },
        { label: "Patient Refusal", value: 9 },
        { label: "Other", value: 4 },
      ],
    },
    {
      type: "bar",
      title: "Enrollment by Site",
      data: [
        { label: "Site A", value: 118 },
        { label: "Site B", value: 97 },
        { label: "Site C", value: 85 },
        { label: "Site D", value: 76 },
        { label: "Site E", value: 105 },
      ],
    },
  ],
};

const dataCollectionStep: WorkflowStep = {
  id: "data-collection",
  label: "Data Collection",
  description: "Administer treatment, collect PK/PD samples, and record adverse events across all sites.",
  status: "approved",
  duration: "180 days",
  completedAt: "2024-08-25",
  metrics: [
    { label: "CRF Completion", value: "98.2%", positive: true },
    { label: "Protocol Deviations", value: "14", positive: false },
    { label: "Dropout Rate", value: "6.2%", positive: false },
    { label: "Data Queries", value: "203" },
  ],
  plots: [
    {
      type: "line",
      title: "Cumulative Data Entry Over Time (weeks)",
      data: [
        { week: 4, pct: 12 },
        { week: 8, pct: 28 },
        { week: 12, pct: 47 },
        { week: 16, pct: 63 },
        { week: 20, pct: 78 },
        { week: 24, pct: 91 },
        { week: 26, pct: 98.2 },
      ],
    },
    {
      type: "bar",
      title: "Adverse Events by Grade",
      data: [
        { label: "Grade 1", value: 142 },
        { label: "Grade 2", value: 89 },
        { label: "Grade 3", value: 34 },
        { label: "Grade 4", value: 11 },
        { label: "Grade 5", value: 2 },
      ],
    },
  ],
};

const safetyReviewStep: WorkflowStep = {
  id: "safety-review",
  label: "Safety Review",
  description: "Independent DSMB safety evaluation. Review serious adverse events and stopping rules.",
  status: "approved",
  duration: "21 days",
  completedAt: "2024-09-15",
  metrics: [
    { label: "SAEs Reported", value: "28" },
    { label: "Treatment-Related SAEs", value: "11", positive: false },
    { label: "DSMB Recommendation", value: "Continue", positive: true },
    { label: "Stopping Rule Triggered", value: "No", positive: true },
  ],
  plots: [
    {
      type: "waterfall",
      title: "SAE Categories",
      data: [
        { label: "Hematologic", value: 9 },
        { label: "Hepatic", value: 6 },
        { label: "Cardiac", value: 5 },
        { label: "Neurologic", value: 4 },
        { label: "GI", value: 4 },
      ],
    },
    {
      type: "line",
      title: "Cumulative SAE Rate Over Time",
      data: [
        { month: 1, rate: 0.8 },
        { month: 2, rate: 1.6 },
        { month: 3, rate: 2.9 },
        { month: 4, rate: 3.7 },
        { month: 5, rate: 4.5 },
        { month: 6, rate: 5.8 },
      ],
    },
  ],
};

const statisticalAnalysisStep: WorkflowStep = {
  id: "statistical-analysis",
  label: "Statistical Analysis",
  description: "Primary and secondary endpoint analysis using pre-specified statistical models.",
  status: "approved",
  duration: "28 days",
  completedAt: "2024-10-13",
  metrics: [
    { label: "Median OS", value: "24.3 mo", positive: true, delta: "+5.1 mo vs control" },
    { label: "Hazard Ratio", value: "0.68", positive: true },
    { label: "p-value", value: "0.0021", positive: true },
    { label: "95% CI", value: "[0.54, 0.86]", positive: true },
  ],
  plots: [
    {
      type: "line",
      title: "Kaplan-Meier Overall Survival",
      data: [
        { month: 0, treatment: 100, control: 100 },
        { month: 6, treatment: 91, control: 84 },
        { month: 12, treatment: 79, control: 66 },
        { month: 18, treatment: 68, control: 51 },
        { month: 24, treatment: 55, control: 38 },
        { month: 30, treatment: 42, control: 27 },
        { month: 36, treatment: 31, control: 18 },
      ],
    },
    {
      type: "scatter",
      title: "Forest Plot — Subgroup Hazard Ratios",
      data: [
        { label: "Overall", hr: 0.68, lower: 0.54, upper: 0.86 },
        { label: "Age < 55", hr: 0.61, lower: 0.44, upper: 0.83 },
        { label: "Age ≥ 55", hr: 0.74, lower: 0.57, upper: 0.96 },
        { label: "Male", hr: 0.65, lower: 0.48, upper: 0.88 },
        { label: "Female", hr: 0.72, lower: 0.52, upper: 0.99 },
        { label: "ECOG 0", hr: 0.59, lower: 0.41, upper: 0.85 },
        { label: "ECOG 1", hr: 0.76, lower: 0.58, upper: 1.00 },
      ],
    },
  ],
};

const biomarkerAnalysisStep: WorkflowStep = {
  id: "biomarker-analysis",
  label: "Biomarker Analysis",
  description: "Correlate biomarker expression levels with treatment response and survival outcomes.",
  status: "running",
  duration: "35 days",
  metrics: [
    { label: "Biomarkers Assessed", value: "6" },
    { label: "Predictive Markers", value: "2", positive: true },
    { label: "High Responders", value: "38%", positive: true },
    { label: "Biomarker+ ORR", value: "72%", positive: true },
  ],
  plots: [
    {
      type: "scatter",
      title: "Biomarker Level vs. Tumor Response (%)",
      data: Array.from({ length: 40 }, (_, i) => ({
        x: 10 + i * 3 + Math.round(Math.random() * 8),
        y: -70 + i * 1.4 + Math.round(Math.random() * 20 - 10),
      })),
    },
    {
      type: "bar",
      title: "Response Rate by Biomarker Subgroup",
      data: [
        { label: "BM1+", value: 72 },
        { label: "BM1-", value: 31 },
        { label: "BM2+", value: 68 },
        { label: "BM2-", value: 34 },
        { label: "Dual+", value: 84 },
        { label: "Dual-", value: 22 },
      ],
    },
  ],
};

const safetyProfileStep: WorkflowStep = {
  id: "safety-profile",
  label: "Safety Profile",
  description: "Comprehensive integrated safety summary including exposure-adjusted AE rates.",
  status: "pending",
  duration: "21 days",
  metrics: [
    { label: "Any AE", value: "94%" },
    { label: "Grade ≥3 AE", value: "41%", positive: false },
    { label: "Dose Reductions", value: "18%", positive: false },
    { label: "Discontinuations", value: "7%", positive: false },
  ],
  plots: [
    {
      type: "bar",
      title: "Top 10 Treatment-Emergent AEs (%)",
      data: [
        { label: "Fatigue", value: 58 },
        { label: "Nausea", value: 47 },
        { label: "Neutropenia", value: 42 },
        { label: "Anemia", value: 39 },
        { label: "Diarrhea", value: 35 },
        { label: "Thrombocytopenia", value: 28 },
        { label: "Alopecia", value: 24 },
        { label: "Vomiting", value: 21 },
        { label: "Peripheral Neuropathy", value: 18 },
        { label: "Rash", value: 15 },
      ],
    },
    {
      type: "line",
      title: "Dose Intensity Over Time (%)",
      data: [
        { cycle: 1, intensity: 100 },
        { cycle: 2, intensity: 97 },
        { cycle: 3, intensity: 93 },
        { cycle: 4, intensity: 89 },
        { cycle: 5, intensity: 85 },
        { cycle: 6, intensity: 82 },
      ],
    },
  ],
};

const regulatorySubmissionStep: WorkflowStep = {
  id: "regulatory-submission",
  label: "Regulatory Submission",
  description: "Compile clinical study report and submit NDA/BLA to regulatory authorities.",
  status: "pending",
  duration: "60 days",
  metrics: [
    { label: "Modules Completed", value: "0/5" },
    { label: "Target Submission", value: "Q1 2025" },
    { label: "Priority Review", value: "Requested", positive: true },
    { label: "Orphan Designation", value: "Yes", positive: true },
  ],
  plots: [
    {
      type: "bar",
      title: "CTD Module Completion (%)",
      data: [
        { label: "Module 1 — Admin", value: 100 },
        { label: "Module 2 — Summaries", value: 78 },
        { label: "Module 3 — Quality", value: 92 },
        { label: "Module 4 — Nonclinical", value: 100 },
        { label: "Module 5 — Clinical", value: 45 },
      ],
    },
    {
      type: "line",
      title: "Projected Submission Timeline",
      data: [
        { week: 0, planned: 0, actual: 0 },
        { week: 4, planned: 20, actual: 18 },
        { week: 8, planned: 45, actual: 42 },
        { week: 12, planned: 70, actual: null },
        { week: 16, planned: 90, actual: null },
        { week: 20, planned: 100, actual: null },
      ],
    },
  ],
};

export const WORKFLOW_STEPS: Record<string, WorkflowStep> = {
  "protocol-design": protocolDesignStep,
  "patient-screening": patientScreeningStep,
  "data-collection": dataCollectionStep,
  "safety-review": safetyReviewStep,
  "statistical-analysis": statisticalAnalysisStep,
  "biomarker-analysis": biomarkerAnalysisStep,
  "safety-profile": safetyProfileStep,
  "regulatory-submission": regulatorySubmissionStep,
};
