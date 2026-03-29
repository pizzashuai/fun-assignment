'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { DashboardFilters } from '@/features/dashboard/types';
import { track } from '@/features/shared/analytics/track';

const DEFAULTS: DashboardFilters = {
  dateRange: '30d',
  region: 'global',
  segment: 'enterprise',
  feature: 'all',
};

export function useDashboardFilters(): [
  DashboardFilters,
  (update: Partial<DashboardFilters>) => void,
] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: DashboardFilters = {
    dateRange:
      (searchParams.get('dateRange') as DashboardFilters['dateRange']) ??
      DEFAULTS.dateRange,
    region:
      (searchParams.get('region') as DashboardFilters['region']) ??
      DEFAULTS.region,
    segment:
      (searchParams.get('segment') as DashboardFilters['segment']) ??
      DEFAULTS.segment,
    feature:
      (searchParams.get('feature') as DashboardFilters['feature']) ??
      DEFAULTS.feature,
  };

  const setFilters = useCallback(
    (update: Partial<DashboardFilters>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(update)) {
        if (value !== undefined) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      track('dashboard_filter_changed', update);
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return [filters, setFilters];
}
