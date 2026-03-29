# Requirements vs. `app` — gap analysis

This document compares [requirements-analysis.md](./requirements-analysis.md) to the current Next.js implementation under [`app/`](../app/). It lists what is **missing**, **partially met**, or **only documented as future work**, so implementation can be prioritized.

---

## Implemented (for context)

| Area | Status |
|------|--------|
| `/dashboard` — KPIs, filters (date, region, segment, feature), charts, top customers table, device breakdown | Met |
| URL-synced filters (`useDashboardFilters`) | Met (nice-to-have “URL-persisted filters”) |
| `/customers/[id]` — summary, health, trends, top features, activity table | Met |
| Loading / error / empty UI, route `loading.tsx` / `error.tsx`, skeletons | Largely met |
| Mock API (`/api/analytics`), transforms, TanStack Query on dashboard | Met |
| Vitest unit + integration tests, `eslint-plugin-jsx-a11y` | Met |
| `README.md`, `DECISIONS.md` under `app/` | Met |
| Responsive-oriented layout | Largely met (not exhaustively audited) |

---

## Missing or incomplete

### 1. Dark / light theme switch

**Requirement:** Nice-to-have dark mode ([requirements § Nice-to-haves](./requirements-analysis.md)).

**Current state:** `app/app/globals.css` defines a full `.dark` token palette and some components use `dark:` Tailwind variants, but:

- `<html>` in `app/app/layout.tsx` never receives `className="dark"` (or a theme class).
- There is no `ThemeProvider` (e.g. [`next-themes`](https://github.com/pacocoursey/next-themes)) or persisted user preference (localStorage / `prefers-color-scheme`).
- No UI control (toggle, dropdown, or system sync) to switch themes.

**To close the gap:** Add a client theme provider, persist choice, and a visible theme control in the shell (e.g. header or filter row).

---

### 2. Optimistic UI (with a concrete use case)

**Requirement:** Nice-to-have optimistic UI ([requirements § Nice-to-haves](./requirements-analysis.md)).

**Current state:** Dashboard data is **read-only** (`useQuery` only). There are no `useMutation` calls, no `onMutate` / rollback, and no “instant feedback before server confirms” patterns.

**Suggested showcase (does not exist yet — implement when adding mutations):**

| Use case | Why it fits |
|----------|-------------|
| **“Pin customer to watchlist”** on the top-customers table | User-triggered write; list order can update immediately while `POST /api/customers/:id/pin` runs; easy to revert on error and to show a toast. |
| **“Save current filters as default”** | Writes user prefs; URL can update optimistically with optional rollback. |

**Minimal implementation sketch:** Add a small mutation + TanStack Query `onMutate` that snapshots the previous customer list, applies the optimistic pin state, then rolls back in `onError`. Pair with a mock API route that introduces artificial delay so the effect is visible.

---

### 3. Playwright (or equivalent E2E) testing

**Requirement:** “Preferred styling **and testing tools**” plus production-minded quality ([requirements § Technical expectations](./requirements-analysis.md)). [DECISIONS.md](../app/DECISIONS.md) explicitly calls out Vitest-only as a tradeoff and names Playwright as the replacement.

**Current state:** `app/package.json` scripts are `test` / `test:watch` for **Vitest** only. No `@playwright/test` dependency, no `e2e/` (or similar) specs, no CI recipe for browser tests.

**To close the gap:** Add Playwright, cover at least: open `/dashboard`, assert KPI section; change a filter; assert URL query params; navigate to a customer row → customer detail.

---

### 4. Feature flags

**Requirement:** Nice-to-have feature flags ([requirements § Nice-to-haves](./requirements-analysis.md)).

**Current state:** No flag client, no env-based toggles, no conditional rendering of widgets or routes.

---

### 5. Product analytics abstraction

**Requirement:** Nice-to-have “analytics abstractions” (interpreted as **instrumentation for product analytics** — page views, filter changes, etc., not the dashboard’s domain “analytics” API).

**Current state:** No shared `track()` helper, no provider, no integration stub (Segment, PostHog, etc.).

---

### 6. Storybook / design-system documentation

**Requirement:** Nice-to-have Storybook / design system primitives ([requirements § Nice-to-haves](./requirements-analysis.md)).

**Current state:** shadcn-style primitives live in `components/ui/`, but there is no Storybook config or stories.

---

### 7. Root-level error boundary

**Requirement:** Nice-to-have error boundaries ([requirements § Nice-to-haves](./requirements-analysis.md)).

**Current state:** Route-level `error.tsx` exists for `dashboard` and `customers/[id]`. There is no `app/global-error.tsx` for failures outside nested layouts (or root layout errors).

---

### 8. Collaboration artifact: `CONTRIBUTING.md`

**Requirement:** “Thoughtful documentation … **collaboration guidelines**” ([requirements § Technical expectations](./requirements-analysis.md)).

**Current state:** [DECISIONS.md](../app/DECISIONS.md) mentions a hypothetical `CONTRIBUTING.md` (“not included here”). No `CONTRIBUTING.md` file in the repo.

---

### 9. Breakdown dimension breadth

**Requirement:** “An **additional** breakdown (**device/browser/platform**)” ([requirements § Functional scope](./requirements-analysis.md)).

**Current state:** Device-only breakdown (`BreakdownCard` + fixtures). Browser and platform are not separate selectable breakdowns (DECISIONS notes a single mock dimension).

---

### 10. Observability / instrumentation stubs

**Requirement:** Non-functional resilience and production-mindedness ([requirements § Non-functional priorities](./requirements-analysis.md)).

**Current state:** DECISIONS describes Sentry / monitoring as **future** wiring; no `instrumentation.ts`, no Sentry SDK.

---

### 11. Dashboard initial HTML vs. client fetch

**Requirement:** “Mix of **server-side rendering**, caching/revalidation, and client interactivity” ([requirements § Data handling](./requirements-analysis.md)).

**Current state:** The dashboard **shell** is server-rendered, but KPI/chart/table data are loaded in `DashboardContent` via **client** `useQuery` after hydration. `/api/analytics` sets `Cache-Control` for CDNs, but typical browser `fetch` from the client does not match “SSR first paint with KPI numbers” unless additional patterns (e.g. server prefetch + `HydrationBoundary`, or server-loaded props) are added.

**Note:** Treat as **partial** if the bar is “KPIs visible without JS”; treat as **met** if “hybrid shell + client reactivity” is enough.

---

## Suggested priority order

1. **Playwright** — highest leverage for “production-minded” and regression safety.  
2. **Theme switch** — CSS work is mostly done; mostly wiring + UX.  
3. **Optimistic UI** — requires a small write API + mutation UX (see suggested use case above).  
4. **CONTRIBUTING.md** + **global-error** — low effort, clear documentation/resilience wins.  
5. **Feature flags**, **analytics abstraction**, **Storybook**, **multi-dimensional breakdown**, **Sentry/instrumentation** — scale with team/process needs.

---

## References

- Requirements: [requirements-analysis.md](./requirements-analysis.md)  
- Implementation notes: [app/README.md](../app/README.md), [app/DECISIONS.md](../app/DECISIONS.md)
