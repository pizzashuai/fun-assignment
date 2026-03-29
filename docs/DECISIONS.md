# Architecture Decisions

## 1. Architecture Choices

### State management approach

Filter state lives in the URL via `useSearchParams` + `useRouter` (see `features/dashboard/hooks/use-dashboard-filters.ts`). This gives us:

- Shareable, bookmarkable URLs out of the box
- No extra atom/store boilerplate
- SSR-friendly defaults (the server reads search params directly)

TanStack Query manages the asynchronous lifecycle (loading, error, cache, background refetch) for the client-driven re-fetches that happen when filters change. Its query key is the filter object, so changing any filter automatically invalidates and re-fetches without manual cache management.

Local, ephemeral UI state (chart hover, table sort direction) is kept in component-level `useState` — there's no need to hoist it.

I avoided any global state management since this is a simple UI w/o too much global logic.

### Folder structure

- Route-specific UI lives in `features/<domain>/components/` (e.g., dashboard widgets, customer detail cards) while the `app/` directory only holds the routing shells.
- Reusable primitives (charts, feedback states, shadcn UI) live in `features/shared/components/`, co-located with other shared code rather than in a top-level `components/` folder. So all components/features can all live under features, I don't need to decide where to put logic or code (used to struggle to decide /lib or /components or /hooks, and it's easier to find the code by deciding the top level feature rather than finding the specific feature related file under /lib or /components...)
- Feature-specific data contracts live alongside their feature (e.g., `features/dashboard/types.ts`, `features/customers/types.ts`) so only true cross-cutting primitives stay in `features/shared/types.ts`.
- Domain logic stays inside the owning feature directory (e.g., `features/dashboard/data/transforms.ts`, `features/dashboard/filters.ts`), while cross-cutting utilities (fixtures, feature flags, analytics helpers) live in `features/shared/`.
- Hooks are colocated with their feature (`features/dashboard/hooks/`) to clarify ownership and API surfaces.

### Rendering strategy

- `/dashboard` is a **server component** that renders the page shell server-side (header, filter panel, layout). The data-heavy content (`DashboardContent`) is a client component that fetches via the `/api/analytics` route handler on mount and on every filter change. This gives us fast initial HTML plus reactive client updates.
- `/customers/[id]` is a fully **server-rendered** page that fetches customer data before streaming the HTML. Dynamic chart imports (`next/dynamic` with `ssr: false`) are wrapped in client-side wrappers so the server component constraint is respected.
- Recharts is a client-only library (relies on DOM), so all charts are dynamically imported with `ssr: false` inside `features/shared/components/charts/chart-wrappers.tsx` (a client component), which is then imported by server components safely.

### Where the data came from?

`features/shared/data/fixtures.ts` generates deterministic seed data at import time. `features/dashboard/data/transforms.ts` applies filter logic and builds the analytics payload. `features/dashboard/api/fetch-analytics.ts` adds simulated latency. The route handler at `app/api/analytics/route.ts` delegates to this service. Swapping to a real backend means changing only the service module.

The pinned customers is used to showcase the optimistic update feature; its values are stored inside LocalStorage so it persists after browser refresh.

---

## 2. Tradeoffs

| Decision                          | What was simplified                   | Production replacement                                                                                                                                                                                                                                                   |
| --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mock data                         | No real database or time-series store | ClickHouse / BigQuery + REST/GraphQL API                                                                                                                                                                                                                                 |
| TanStack Query stale time of 60 s | No granular cache invalidation        | `revalidateTag` keyed on customer/filter dimensions                                                                                                                                                                                                                      |
| Recharts                          | Simpler API, lighter weight           | Highcharts or Victory for enterprise PDF export                                                                                                                                                                                                                          |
| No auth                           | Assumes single-tenant access          | Clerk with role-based guards, the nextjs auth middleware has seen recent issues and when traffic increases the pricing can become unpredictable according to news/articles, it's clean in terms of architecture but I'd double check and run tests before settling on it |

---

## 3. Scalability

### More widgets

Each dashboard widget is an independent component. Adding a new widget means:

1. Define the data shape next to the owning feature (e.g. `features/dashboard/types.ts`).
2. Add a transform in `features/dashboard/data/transforms.ts`
3. Add a component in `features/dashboard/components/`
4. Compose it into `DashboardContent`

Storybook stories live next to each widget so engineers can stub data, capture edge cases, and validate visual regressions before wiring the widget into the dashboard. The Storybook dev server mirrors the production Tailwind + shadcn UI stack, so widget iteration stays isolated from the rest of the app until the widget is production-ready.

No global store or UI changes required.

### Multiple teams

- `features/shared/components/ui/` (shadcn primitives) form a design system boundary — teams consume, not edit.
- Feature-specific components live in `features/<domain>/components/`, reducing cross-team file conflicts.
- `features/shared/types.ts` only holds primitives used across domains; each feature owns its richer contracts under `features/<domain>/types.ts`, so changes stay scoped to the right team.
- Storybook acts as a shared component workbench — teams can build or review widgets in isolation, swap mocked TanStack Query data, and leave review notes without touching the main app routes.
- ESLint + TypeScript + `eslint-plugin-jsx-a11y` enforce quality automatically in CI.
- The top-level `README.md` documents the import layering rules (routes → features/shared/components → features/<domain> → features/shared, never the reverse) so onboarding engineers have a canonical reference.

---

## 4. Quality

### Testing approach

- **Unit tests** (`tests/unit/`) cover data helpers (`fixtures.ts`), filter utilities (`filters.ts`), and the `KpiCard` component with Testing Library.
- **Integration tests** (`tests/integration/`) verify `buildAnalyticsPayload` produces correct KPIs, trend lengths, and filter application across the full transform pipeline.
- **End-to-end tests** (`npm run test:e2e`) use Playwright against the running Next.js server to cover routing, optimistic updates, and customer flows across browsers.
- Run with `npm test` (Vitest).

### Monitoring and error tracking

In production this would wire:

- `Sentry.init()` in `instrumentation.ts` for both server and client exception capture, and make sure we only capture minimal amount of data required to debug any issues.
- Next.js custom `_error` boundary to tag errors with route context.
- Uptime / API latency tracked via Datadog or Grafana.

### Accessibility approach

- Semantic landmarks (`<main>`, `<section aria-label>`, `<nav>`) on every page.
- Every table has `aria-label` on `<table>` and `scope` on `<th>`.
- Every filter control has an explicit `<label>` with `htmlFor` wired to the input `id`.
- Progress bars in `BreakdownCard` use `role="progressbar"` with `aria-valuenow/min/max`.
- Charts are client-only and rely on Recharts' built-in tooltip; screen-reader users see data in the table and KPI cards.
- `eslint-plugin-jsx-a11y` runs in lint to catch regressions.

---

## 5. Collaboration

### Guiding engineers in this codebase

- **Import layering rule:** `app/` routes → `features/shared/components/` → `features/<domain>/` → `features/shared/` (one direction only). `features/shared/components` may depend on `features/shared` helpers (e.g. `utils`, `types`) but must never import from feature-specific modules.
- **Client vs server boundary:** add `"use client"` only when you need browser APIs or hooks. Chart wrappers are the canonical example of the pattern.
- **URL as state:** new persistent filter dimensions go into `features/dashboard/filters.ts` and `features/dashboard/hooks/use-dashboard-filters.ts`; they don't need a global store.
- **Component ownership:** route-specific components stay in their route folder; anything used in 2+ routes moves to `features/shared/components/`.
- **Test coverage expectation:** new data helpers require a unit test; new UI components require at least a render smoke test.

### Standards / conventions

- TypeScript strict mode (no `any`, exhaustive union checks where feasible).
- Tailwind utility classes only — no inline styles except for dynamic chart colors.
- CSS variables for theme tokens (`--chart-1` through `--chart-5`, `--primary`, etc.) so dark mode is a one-line class toggle.
- shadcn/ui as the component primitive layer — add to `features/shared/components/ui/` via `npx shadcn add`, don't hand-roll Radix wrappers.
