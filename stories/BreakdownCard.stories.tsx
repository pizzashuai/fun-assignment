import type { Meta, StoryObj } from "@storybook/react";
import { BreakdownCard } from "@/features/dashboard/components/breakdown-card";
import type { Breakdowns } from "@/features/dashboard/types";

const meta: Meta<typeof BreakdownCard> = {
  title: "Dashboard/BreakdownCard",
  component: BreakdownCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BreakdownCard>;

const breakdowns: Breakdowns = {
  device: {
    dimension: "Device",
    items: [
      { label: "Desktop", value: 5820, percent: 58 },
      { label: "Mobile", value: 2500, percent: 25 },
      { label: "Tablet", value: 1700, percent: 17 },
    ],
  },
  browser: {
    dimension: "Browser",
    items: [
      { label: "Chrome", value: 6240, percent: 62 },
      { label: "Safari", value: 1800, percent: 18 },
      { label: "Firefox", value: 1100, percent: 11 },
      { label: "Edge", value: 760, percent: 8 },
      { label: "Other", value: 100, percent: 1 },
    ],
  },
  platform: {
    dimension: "Platform",
    items: [
      { label: "Windows", value: 4500, percent: 45 },
      { label: "macOS", value: 2700, percent: 27 },
      { label: "iOS", value: 1500, percent: 15 },
      { label: "Android", value: 900, percent: 9 },
      { label: "Linux", value: 400, percent: 4 },
    ],
  },
};

export const Default: Story = {
  args: { breakdowns },
};
