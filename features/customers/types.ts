import type { Feature, FeatureMetric, Region, Segment, TrendPoint } from "@/features/shared/types";

export interface CustomerSummary {
  id: string;
  name: string;
  segment: Segment;
  region: Region;
  plan: "starter" | "growth" | "enterprise";
  mau: number;
  retentionRate: number;
  healthScore: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  mrr: number;
  joinedAt: string;
  pinned?: boolean;
}

export interface CustomerEvent {
  id: string;
  customerId: string;
  type: "login" | "feature_use" | "export" | "api_call" | "support_ticket" | "upgrade";
  description: string;
  timestamp: string;
  feature?: Feature;
}

export interface CustomerDetail extends CustomerSummary {
  usageTrend: TrendPoint[];
  topFeatures: FeatureMetric[];
  recentEvents: CustomerEvent[];
}
