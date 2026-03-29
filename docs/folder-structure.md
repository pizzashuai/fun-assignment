## Proposed Folder Structure

```
├─ app/
│  ├─ dashboard/
│  │  ├─ page.tsx              # Server entry for KPI dashboard
│  │  ├─ loading.tsx           # Skeleton for dashboard route
│  │  ├─ error.tsx             # Error boundary UI with reset
│  │  └─ components/           # Dashboard-only UI (charts, cards)
│  ├─ customers/
│  │  └─ [id]/
│  │     ├─ page.tsx           # Customer detail drill-down
│  │     ├─ loading.tsx
│  │     └─ components/
│  ├─ api/
│  │  └─ analytics/route.ts    # Optional mock API (filters support)
│  └─ layout.tsx               # Global shell, theme provider, metadata
├─ features/
│  ├─ dashboard/
│  │  ├─ components/           # Dashboard-only UI (charts, cards)
│  │  ├─ hooks/                # URL filter hook, tracking helpers
│  │  ├─ api/                  # fetchAnalytics + latency helpers
│  │  ├─ data/                 # transforms.ts compute KPI payloads
│  │  └─ filters.ts            # URL + serialization utilities
│  ├─ customers/
│  │  ├─ components/           # Customer detail widgets
│  │  └─ api/                  # fetchCustomer mock data access
│  └─ shared/
│     ├─ components/           # Shared UI primitives, charts, feedback
│     │  ├─ ui/               # shadcn/ui primitives (button, card, badge)
│     │  ├─ charts/           # Chart wrappers with lazy-loading logic
│     │  ├─ feedback/         # Empty/error/skeleton components
│     │  ├─ theme-toggle.tsx
│     │  └─ providers.tsx
│     ├─ analytics/track.ts    # Console-friendly analytics shim
│     ├─ api/simulate-latency  # Latency helper reused everywhere
│     ├─ data/
│     │  ├─ fixtures.ts        # Static seed data
│     │  └─ pin-store.ts       # Mock persistence for pinning
│     ├─ feature-flags.ts      # NEXT_PUBLIC_FEATURE_FLAGS parsing
│     ├─ types.ts              # Shared TypeScript contracts
│     └─ utils.ts              # cn(), sr-only helpers
├─ styles/
│  ├─ globals.css
│  └─ tokens.css               # CSS variables for light/dark + spacing
├─ tests/
│  ├─ unit/
│  └─ integration/
├─ stories/                    # Optional Storybook stories per component
├─ public/
│  └─ assets/                  # Icons, logos, sample exports
├─ docs/
│  ├─ requirements-analysis.md
│  ├─ implementation-plan.md
│  └─ folder-structure.md
├─ README.md
└─ DECISIONS.md
```

### Notes
- Feature-specific code (UI, hooks, data) lives in `features/<domain>/` while the Next.js `app/` directory stays lean with route shells.
- Shared UI primitives live in `features/shared/components/` alongside other cross-cutting shared code, keeping all shared concerns in one place.
- Mock data helpers under `features/shared/data` keep server/client imports consistent and make future API swaps easier.
- Hooks, styles, and docs stay isolated to encourage modular ownership and future scaling across teams.
