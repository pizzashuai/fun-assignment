## Frontend Analytics Dashboard Requirements

### Objective
- Build a production-minded analytics dashboard in Next.js that showcases strong product thinking, architecture, and attention to performance, accessibility, and maintainability.

### Core User Value
- Provide product managers with a clear view of adoption, engagement, and feature usage, including the ability to investigate customer-level detail and operational states (loading, empty, error).

### Functional Scope
1. **Dashboard Overview**
   - `/dashboard` route with KPI cards for MAU, DAU, Retention Rate, Conversion Rate, and Error Rate.
   - Global filters for date range, region, customer segment, and product/feature selection that keep dashboard state in sync and scalable.
   - Visualizations: usage trend line chart, feature adoption bar chart, top customers/accounts table, and an additional breakdown (device/browser/platform).
2. **Customer Detail**
   - `/customers/[id]` drill-down including customer summary, usage trend, top features, health/risk indicator, and recent activity/events table.
3. **Data Handling**
   - Mix of server-side rendering, caching/revalidation, and client interactivity.
   - Demonstrate thoughtful state management for filters, URL sync, local UI state, and async states.
4. **UX Quality**
   - Semantic HTML, keyboard-accessible controls, labeled inputs, contrast-compliant palettes, and readable loading/empty/error UI.
   - Loading/error states and fallback skeletons where appropriate.

### Technical Expectations
- Stack: Next.js (latest), TypeScript, chosen charting library, preferred styling and testing tools.
- Data sources can be mock JSON, API routes, or lightweight fake backend, but should feel production-ready.
- Provide `README.md`, `DECISIONS.md`, tests, and thoughtful documentation of architecture, tradeoffs, scalability, quality, and collaboration guidelines.

### Non-functional Priorities
- Performance mindful of bundle size, rerenders, routing, caching, and asset strategy; justify tradeoffs.
- Accessibility, resilience to various states, and extendability for more widgets or contributor teams.
- Nice-to-haves: URL-persisted filters, responsive layout, dark mode, optimistic UI, feature flags, analytics abstractions, error boundaries, skeletons, Storybook/design system primitives.
