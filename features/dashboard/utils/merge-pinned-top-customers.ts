import type { CustomerSummary } from "@/features/customers/types";

export function mergePinnedIntoTopCustomers(
  customers: CustomerSummary[],
  pinnedIds: ReadonlySet<string>
): CustomerSummary[] {
  return [...customers]
    .map((c) => ({ ...c, pinned: pinnedIds.has(c.id) }))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
}
