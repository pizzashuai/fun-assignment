/**
 * Recharts Tooltip defaults don't follow theme CSS variables; in dark mode
 * labels can end up unreadable. These styles align the tooltip with popover tokens.
 */
export const chartTooltipProps = {
  contentStyle: {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--popover-foreground)",
  },
  labelStyle: {
    color: "var(--popover-foreground)",
    fontWeight: 600,
  },
  itemStyle: {
    color: "var(--popover-foreground)",
  },
} as const;
