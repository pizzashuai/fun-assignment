import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import type { KpiMetric } from "@/features/dashboard/types";

const mockMetric: KpiMetric = {
  id: "mau",
  label: "Monthly Active Users",
  value: 12400,
  unit: "number",
  trend: 11.1,
  trendDirection: "up",
};

describe("KpiCard", () => {
  it("renders the label", () => {
    render(<KpiCard metric={mockMetric} />);
    expect(screen.getByText("Monthly Active Users")).toBeInTheDocument();
  });

  it("formats large numbers with k suffix", () => {
    render(<KpiCard metric={mockMetric} />);
    expect(screen.getByText("12.4k")).toBeInTheDocument();
  });

  it("renders percentage values with %", () => {
    const percentMetric: KpiMetric = {
      ...mockMetric,
      id: "retention",
      label: "Retention Rate",
      value: 94,
      unit: "percent",
      trend: 2.4,
    };
    render(<KpiCard metric={percentMetric} />);
    expect(screen.getByText("94%")).toBeInTheDocument();
  });

  it("shows trend text with + prefix for positive trends", () => {
    render(<KpiCard metric={mockMetric} />);
    expect(screen.getByText(/\+11\.1%/)).toBeInTheDocument();
  });

  it("shows trend text without + prefix for negative trends", () => {
    const downMetric: KpiMetric = {
      ...mockMetric,
      trend: -1.1,
      trendDirection: "down",
    };
    render(<KpiCard metric={downMetric} />);
    expect(screen.getByText(/-1\.1%/)).toBeInTheDocument();
  });

  it("has an accessible aria-label on the value element", () => {
    render(<KpiCard metric={mockMetric} />);
    expect(
      screen.getByLabelText("Monthly Active Users: 12.4k")
    ).toBeInTheDocument();
  });
});
