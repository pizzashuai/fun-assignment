import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import type { KpiMetric } from "@/features/dashboard/types";

const meta: Meta<typeof KpiCard> = {
  title: "Dashboard/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

const base: KpiMetric = {
  id: "mau",
  label: "Monthly Active Users",
  value: 68200,
  unit: "number",
  trend: 5.3,
  trendDirection: "up",
};

export const TrendingUp: Story = {
  args: { metric: base },
};

export const TrendingDown: Story = {
  args: {
    metric: {
      ...base,
      id: "conversion",
      label: "Conversion Rate",
      value: 14,
      unit: "percent",
      trend: -1.1,
      trendDirection: "down",
    },
  },
};

export const Neutral: Story = {
  args: {
    metric: {
      ...base,
      id: "retention",
      label: "Retention Rate",
      value: 88,
      unit: "percent",
      trend: 0,
      trendDirection: "neutral",
    },
  },
};

export const Currency: Story = {
  args: {
    metric: {
      ...base,
      id: "mrr",
      label: "MRR",
      value: 250000,
      unit: "currency",
      trend: 3.8,
      trendDirection: "up",
    },
  },
};
