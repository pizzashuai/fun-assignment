"use client";

import { useDashboardFilters } from "@/features/dashboard/hooks/use-dashboard-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";

export function FilterPanel() {
  const [filters, setFilters] = useDashboardFilters();

  return (
    <div
      className="flex flex-wrap gap-3"
      role="group"
      aria-label="Dashboard filters"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="dateRange-select">
          Date Range
        </label>
        <Select
          value={filters.dateRange}
          onValueChange={(v) => setFilters({ dateRange: v as typeof filters.dateRange })}
        >
          <SelectTrigger id="dateRange-select" className="h-8 w-36 text-sm" aria-label="Date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="region-select">
          Region
        </label>
        <Select
          value={filters.region}
          onValueChange={(v) => setFilters({ region: v as typeof filters.region })}
        >
          <SelectTrigger id="region-select" className="h-8 w-40 text-sm" aria-label="Region">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="north-america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
            <SelectItem value="latam">LatAm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="segment-select">
          Segment
        </label>
        <Select
          value={filters.segment}
          onValueChange={(v) => setFilters({ segment: v as typeof filters.segment })}
        >
          <SelectTrigger id="segment-select" className="h-8 w-36 text-sm" aria-label="Segment">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="mid-market">Mid-Market</SelectItem>
            <SelectItem value="smb">SMB</SelectItem>
            <SelectItem value="startup">Startup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="feature-select">
          Feature
        </label>
        <Select
          value={filters.feature}
          onValueChange={(v) => setFilters({ feature: v as typeof filters.feature })}
        >
          <SelectTrigger id="feature-select" className="h-8 w-36 text-sm" aria-label="Feature">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Features</SelectItem>
            <SelectItem value="dashboard">Dashboard</SelectItem>
            <SelectItem value="reports">Reports</SelectItem>
            <SelectItem value="integrations">Integrations</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
