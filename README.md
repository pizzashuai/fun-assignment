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

## Storybook

```bash
npm run storybook
```

Starts the component explorer on `http://localhost:6006` with hot reload enabled.

## Available scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Production build |
| `npm run lint` | ESLint (includes `eslint-plugin-jsx-a11y`) |
| `npm test` | Vitest unit + integration tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests (requires a running server or uses `webServer`) |
| `npm run test:e2e:ui` | Playwright interactive UI mode |
| `npm run storybook` | Storybook component explorer at http://localhost:6006 |

## Testing

```bash
npm test            # run the unit suite once
npm run test:watch  # watch mode for unit tests
npm run test:storybook  # story-level regression tests
npm run test:e2e        # headless Playwright run
npm run test:e2e:ui     # interactive Playwright UI
```

### Running E2E tests

Playwright spins up the Next.js dev server automatically on port 3000. To run tests:

```bash
npx playwright install --with-deps chromium  # install browsers once
npm run test:e2e                               # full suite
npm run test:e2e:ui                            # interactive / headed mode
```

In CI, set `CI=true` so Playwright retries on failure and does not reuse an existing server.

## Feature flags

Dashboard features can be conditionally enabled via the `NEXT_PUBLIC_FEATURE_FLAGS` environment variable (comma-separated flag names). Example:

```
NEXT_PUBLIC_FEATURE_FLAGS=opsBanner,betaChart npm run dev
```

See `features/shared/feature-flags.ts` for details.

## Documentation

All detailed docs now live in [`docs/`](./docs). Start with `docs/README.md` for the full setup guide, QA checklist, architecture notes, and project decisions.

## Contribution workflow

1. Branch off `main` using descriptive names (`feat/`, `fix/`, `chore/`).
2. Keep PRs focused: one feature or bug fix per PR.
3. Ensure `npm run lint`, `npm test`, and `npm run build` pass before requesting review.
4. Describe _why_ the change is needed in the PR, not just _what_ changed.
