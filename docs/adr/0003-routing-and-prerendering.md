# ADR-0003 — Routing and pre-rendering
- **Status:** Accepted (2026-11-26)
- **Date:** 2026-11-26
- **Context:**
  - FR-012 / NFR-005 require the served HTML to contain each route's content; today it is `<div id="root"></div>`.
  - FR-013 adds routes (`/case-studies/<slug>`), so the SPA needs a router.
  - FR-020 needs per-route meta tags.
  - Current stack: React 18.3, Vite 5.4, `react-helmet-async`, `motion` 13; Node 22.17 locally.
  - Versions verified on 2026-11-26 (`npm view`, Art. 14):

| Package | Latest | Requires |
|---|---|---|
| react | 19.3.1 | — |
| vite | 8.4.0 | — |
| react-router | 8.5.3 | Node ≥ 22.22, React ≥ 19.2.7, Vite 7/8 in framework mode |
| vite-react-ssg | 0.9.2 (Jul 2026) | Vite ≥ 6.4, react-router-dom v6 |

  - Options A and B require upgrading Vite. Option C does not: Vite 5.4 already ships SSR builds.
    (Correction, 2026-11-26: an earlier draft and the G-Foundational question said every option did. That was wrong.)
  - Constraints: free Vercel hosting; keep the visual design; Art. 7 (minimal changes).
- **Options considered:**

| Option | Pros | Cons | Fit with NFRs |
|---|---|---|---|
| **A. React Router 8, framework mode, static pre-render** (`ssr: false` + pre-rendered routes) | Official and actively maintained. One tool for routing, pre-render, per-route `meta` (react-helmet-async can go) and code splitting. The upgrade to React 19 pays off stack debt and matches the stack the hero advertises | Largest migration: React 18→19, Vite 5→7/8, route modules, entry files. Node ≥ 22.22 (local upgrade, Art. 9). Bigger change to the Vercel build | Meets NFR-005 and FR-020; NFR-001 to be verified |
| B. `vite-react-ssg` + react-router-dom v6 | Small API surface; React 18 can stay | Ties the site to a router two majors behind, which the library keeps only in maintenance for v6. Single maintainer. Still needs Vite ≥ 6.4 | Meets NFR-005 |
| C. Vite's documented SSG pattern (`vite build --ssr` + a script with `react-dom/server` that writes one HTML per route) and a minimal route table | No new runtime dependency; full control; React 18 can stay | Homemade pipeline to maintain (routing, hydration, meta, 404). Little showcase value | Meets NFR-005 |
| D. Migrate to Astro or Next.js | Best-in-class SSG | Rewrite: violates Art. 7 for a 4-route site | Meets NFR-005 |

- **Recommendation (agent):**
  - **Option A**, run as its own spec: first the platform upgrade with unchanged behavior (004), then pre-rendering and SEO (005). This keeps each change verifiable on a Vercel preview.
  - Pre-rendered HTML is in EN; the client applies the stored language after hydration (ASM-010).
  - Discarded:
    - C, because it trades a maintained framework for custom code you would own forever.
    - B, because it locks you into an outdated router.
- **Decision:** **Option C — Vite's documented SSG pattern** (`vite build --ssr` + a build-time pre-render script with `react-dom/server`, plus a minimal typed route table; no new runtime dependency). Decided by Hernán at G-Foundational, 2026-11-26.
  The details (route table, hydration, per-route meta, 404 and SPA fallback on Vercel) are designed in spec 004's plan. Upgrading Vite and React stays optional (DEBT-007).
- **Consequences:**
  - Positive: indexable routes with no framework lock-in; React 18 and Vite 5 stay; the change is small and fully understood.
  - Negative: a custom pipeline to maintain (routing, hydration, meta), so it needs tests (NFR-005 check in CI).
  - Risks:
    - `motion` animations start hidden in SSR (the content is still in the HTML; verify that LCP does not regress).
    - Turnstile and `window` access must be client-only.
  - What would make us reconsider it: the number of routes growing beyond ~10, or the need for data loading or SSR at runtime → reconsider Option A.
