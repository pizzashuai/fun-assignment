## Implementation Plan for Analytics Dashboard

### 1. Foundation
- **Create Next.js app** with `/dashboard` and dynamic `/customers/[id]` routes using the App Router for better streaming and incremental adoption.
- **Configure TypeScript, ESLint, Tailwind CSS, and testing (Vitest + Testing Library)** to enforce correctness and styling conventions.
- **Install dependencies:** charting library (e.g., Recharts), `@tanstack/react-query` for data fetching/cache orchestration beyond what Next.js offers on the client, shadcn/ui component library (plus class-variance-authority and Radix primitives) to bootstrap accessible UI, date utilities (date-fns), and mock server helpers (MSW or simple API routes).
- **Run `npx shadcn-ui@latest init`** to seed component registry and import only the primitives needed (Buttons, Cards, Tabs, Dropdown, Skeleton, Dialog).

### 2. Data Modeling & Mock Layer
- Define TypeScript types for KPI, filter, customer summary, trend point, feature metrics, and events.
- Create `data/fixtures.ts` with seed data plus helpers to derive aggregates.
- Expose a lightweight data service (`features/<domain>/api/*`) that simulates server latency and supports filtering logic; reuse on both server and client to keep logic centralized.

### 3. Routing & Data Fetching Strategy
- `/dashboard` page: server components fetch initial KPI + chart data based on default filters using a cached server action or route handler; hydrate filter state in the client.
- `/customers/[id]`: fetch summary plus activity server-side, stream sections with Suspense for responsive UX.
- Implement revalidation window (e.g., `revalidateTag`) to mimic fresh data; allow client-triggered refreshes when filters change.

### 4. State & Interaction
- **Filters**: co-locate state in a dedicated `useDashboardFilters` hook backed by URL search params (via `useSearchParams` + `useRouter`). Debounce updates before requesting new data and invalidate TanStack Query keys so cached payloads stay synced.
- **Async handling**: use TanStack Query status + Suspense boundaries to show shadcn Skeletons while fetching, empty-state components when no data, and inline errors with retry buttons.
- **Local UI state** (e.g., chart hover, table pagination) handled with component-level hooks.

### 5. UI Composition
- Build reusable primitives via shadcn/ui (`Card`, `Tabs`, `DropdownMenu`, `Alert`, `Skeleton`) to keep consistency; wrap them when domain-specific logic is needed (`KpiCard`, `FilterPanel`, `TrendChart`, `BarChart`, `CustomersTable`, `BreakdownCard`, `CustomerHero`, `HealthBadge`, `ActivityTable`).
- Compose layout using Tailwind utility classes + CSS grid, ensuring keyboard navigation and accessible labels on controls.
- Provide Tailwind-driven theme tokens (CSS variables) that make a dark mode toggle trivial later.

### 6. Performance & Accessibility Guardrails
- Use Next.js automatic code-splitting plus dynamic import for heavy chart components.
- Use TanStack Query for client-side cache, background revalidation, and status management so filters translate to cached queries instead of ad-hoc fetches.
- Memoize expensive chart datasets and wrap charts in `React.Suspense` with skeletons from shadcn/ui.
- Ensure semantic landmarks (`<main>`, `<section>`, `<nav>`), ARIA labeling, and focus outlines; verify via eslint-plugin-jsx-a11y and Storybook/Playwright axe checks.

### 7. Testing & Validation
- Unit test data helpers and filter reducer.
- Component tests for KPI cards and filters using Testing Library.
- Integration test via Playwright or Cypress stub to confirm filter-driven URL sync and navigation from dashboard to customer page.
- Add lightweight performance budget checks (Next.js `analyze` script) and axe accessibility scan as optional extras.

### 8. Documentation & Delivery
- Document reasoning (tradeoffs, scalability, quality approach) in `DECISIONS.md`.
- Update `README.md` with setup, scripts, and architectural overview.
- Include screenshots or Loom-instructions if helpful.
