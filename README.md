# Analytics Dashboard

A production-ready product analytics dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and TanStack Query.

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ (bundled with Node.js 20)

## Quick start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/dashboard` — the root route redirects there automatically.

## Setup instructions

1. Clone the repository locally and install Node.js 20 / npm 10 if you have not already.
2. From the repo root, run `npm install` to pull dependencies (this writes to `node_modules/` and generates `package-lock.json`).
3. Duplicate any required environment variables. Today only `NEXT_PUBLIC_FEATURE_FLAGS` is consumed, so you can skip this unless you want to toggle demo features.
4. Launch the dev server with `npm run dev` and open `http://localhost:3000/dashboard` (or `/customers/<id>` for drill-down pages).
5. Run `npm run storybook` in a second terminal whenever you want the isolated component workbench; it mirrors the Tailwind/shadcn configuration used in the app.
6. Use the scripts under **Testing** to validate the change before sending a PR.

## Available scripts

| Script                | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `npm run dev`         | Start Next.js in development mode                                           |
| `npm run build`       | Production build                                                            |
| `npm run lint`        | ESLint (includes `eslint-plugin-jsx-a11y`)                                  |
| `npm test`            | Vitest unit + integration tests                                             |
| `npm run test:watch`  | Vitest in watch mode                                                        |
| `npm run test:e2e`    | Playwright end-to-end tests (requires a running server or uses `webServer`) |
| `npm run test:e2e:ui` | Playwright interactive UI mode                                              |
| `npm run storybook`   | Storybook component explorer at http://localhost:6006                       |

## Feature flags

Dashboard features can be conditionally enabled via the `NEXT_PUBLIC_FEATURE_FLAGS` environment variable (comma-separated flag names). Example:

```
NEXT_PUBLIC_FEATURE_FLAGS=opsBanner,betaChart npm run dev
```

See `features/shared/feature-flags.ts` for details.

## Documentation

All detailed docs now live in [`docs/`](./docs). Start with `docs/README.md` for the full setup guide, QA checklist, architecture notes, and project decisions.

## Architecture summary

```
.
├── app/                       # App Router entrypoints and API route handlers
├── features/
│   ├── dashboard/             # Widgets, filter hooks, data transforms, analytics API helpers
│   ├── customers/             # Customer detail components + data fetching helpers
│   └── shared/                # shadcn/ui primitives, chart wrappers, fixtures, feature flags, utils
├── stories/                   # Storybook stories colocated with widgets/components
├── tests/                     # Vitest unit/integration suites
└── playwright*.ts             # Playwright config + reports for cross-browser E2E flows
```

- URL parameters are the single source of truth for filter state (`features/dashboard/hooks/use-dashboard-filters.ts`), so sharing a link reproduces the same dashboard view.
- TanStack Query manages all async fetching with the filter object as the `queryKey`, enabling automatic cache invalidation when users tweak filters.
- Mock analytics data comes from `features/shared/data/fixtures.ts` and flows through `features/dashboard/data/transforms.ts` before the `/api/analytics` route responds; swapping to a real backend touches only these modules.
- Charts (Recharts) render inside client components via `dynamic(() => import(...), { ssr: false })`, while the dashboard and customer shells remain server components for fast first paint.

## Assumptions

- There is no authentication/authorization — anyone with access to the dev server can view the dashboard.
- Mock fixtures are deterministic per boot; mutations such as "pinned customers" live in `localStorage` for demo purposes only.
- `/` always redirects to `/dashboard`, and the URL holds the active filters so dashboards are shareable/bookmarkable.
- Feature-flag evaluation happens entirely on the client through `NEXT_PUBLIC_FEATURE_FLAGS`; server-side rollout logic is out of scope for this assignment.
