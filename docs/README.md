# Analytics Dashboard

A production-minded product analytics dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and TanStack Query.

---

## Setup and running locally

**Prerequisites:** Node.js 20+, npm 10+

```bash
# 1. Clone and enter the repository root

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
open http://localhost:3000/dashboard
```

The app redirects `/` → `/dashboard` automatically.

---

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Start production server (requires build) |
| `npm run lint` | Run ESLint (includes jsx-a11y) |
| `npm test` | Run all unit and integration tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |

---

## Manual smoke test (browser QA)

Follow these steps to verify the app end-to-end:

### 1. Dashboard renders (SSR)

1. Open `http://localhost:3000/dashboard`
2. Right-click → **View Page Source** — confirm you see "Analytics Dashboard" and KPI numbers in the HTML (not a blank client shell)
3. Five KPI cards must be visible: Monthly Active Users, Daily Active Users, Retention Rate, Conversion Rate, Error Rate

### 2. Charts render

1. A **line chart** (Usage Trend) and a **bar chart** (Feature Adoption) should be visible below the KPIs
2. The bar chart should show feature names on the y-axis and adoption percentages on the x-axis

### 3. Table and breakdown

1. A **Top Customers** table should list rows with customer name, segment, MAU, retention, and risk badge
2. A **Device Breakdown** card (Desktop / Mobile / Tablet) should be visible to the right of the table

### 4. Filters update the URL and data

1. Click the **Region** dropdown → select **Europe**
2. The URL changes to `?region=europe`
3. The KPI cards and table update to show only European customers (e.g., Globex Industries)
4. Copy the URL, open a new tab, paste it — the same filtered view appears

### 5. Customer drill-down

1. Click a customer name in the table (e.g., **Globex Industries**)
2. You are taken to `/customers/cust-002` (or the appropriate ID)
3. The customer detail page shows: name, health badge, MAU / Retention / MRR summary, usage trend chart, top features bar chart, and recent activity table
4. Click **Back to Dashboard** — returns to the dashboard

### 6. Not-found handling

1. Visit `http://localhost:3000/customers/nonexistent-id`
2. A "Customer not found" 404 page is shown with a link back to the dashboard

### 7. Mock API

1. Open `http://localhost:3000/api/analytics`
2. JSON with `kpis`, `usageTrend`, `featureAdoption`, `topCustomers`, `breakdown`, `filters` is returned
3. Try `?region=europe&dateRange=7d` — the JSON updates to reflect filtered data and 7 trend points

---

## Architecture summary

```
.
├── app/
│   ├── dashboard/            # Route shell + suspense boundaries
│   ├── customers/[id]/       # Customer detail route
│   └── api/analytics/        # Route handler — delegates to feature service
├── features/
│   ├── dashboard/
│   │   ├── components/       # KpiCard, FilterPanel, CustomersTable, BreakdownCard, DashboardContent
│   │   ├── hooks/            # URL-synced filter state, analytics tracking helpers
│   │   ├── api/              # fetchAnalytics + TanStack prefetch helpers
│   │   ├── data/             # transforms.ts builds analytics payloads
│   │   └── filters.ts        # Filter parsing/serialization helpers
│   ├── customers/
│   │   ├── components/       # HealthBadge, ActivityTable
│   │   └── api/              # fetchCustomer w/ simulated latency
│   └── shared/
│       ├── components/       # Shared UI primitives (shadcn/ui, charts, feedback, providers)
│       │   ├── ui/           # shadcn/ui primitives
│       │   ├── charts/       # TrendChart, FeatureBarChart + client wrappers (ssr:false)
│       │   ├── feedback/     # SkeletonCard, EmptyState, ErrorState
│       │   ├── theme-toggle.tsx
│       │   └── providers.tsx # TanStack QueryClientProvider
│       ├── analytics/        # track() helper w/ debug logging
│       ├── api/              # simulateLatency helper
│       ├── data/             # fixtures.ts + pin-store.ts seed data
│       ├── types.ts          # Shared TypeScript contracts
│       ├── utils.ts          # cn(), sr-only helpers
│       └── feature-flags.ts  # NEXT_PUBLIC_FEATURE_FLAGS parser
```

### Key data flow

```
Browser (filters change)
  → features/dashboard/hooks/useDashboardFilters (URL params)
  → TanStack Query (queryKey = filters)
  → GET /api/analytics?...
  → features/dashboard/api/fetch-analytics.ts
  → features/dashboard/data/transforms.ts + features/shared/data/fixtures.ts
  → JSON response → UI re-renders
```

### Rendering decisions

| Route | Strategy | Reason |
|---|---|---|
| `/dashboard` shell | Server component | Fast initial HTML, SEO |
| Dashboard KPIs/charts | Client (`useQuery`) | Reactive to filter changes without full-page navigation |
| `/customers/[id]` | Server component | Data known at request time; no client interactivity needed |
| Charts (Recharts) | `dynamic(ssr:false)` in client wrapper | Recharts requires DOM APIs unavailable at SSR |

See [DECISIONS.md](./DECISIONS.md) for full architecture rationale, tradeoffs, scalability plan, and collaboration standards.

---

## Assumptions

- Mock data is generated at server startup and is stable within a session (random noise uses `Math.random()` at module load time).
- No authentication is required.
- The "date range" filter changes the number of trend points returned but does not gate which customers are shown (region + segment do that).
- The breakdown dimension is fixed to "Device" for this implementation; adding more dimensions is a one-function change in `features/shared/data/fixtures.ts`.
