# Non-functional requirements

> ISO/IEC 25010 checklist: functional suitability · performance efficiency · compatibility ·
> interaction capability (usability, accessibility) · reliability · security · maintainability ·
> flexibility (portability) · safety.
> Rule: if it cannot be measured, it is not a requirement; it is a wish.

| ID | Category | Requirement | Metric / threshold | Verification method | Priority |
|---|---|---|---|---|---|
| NFR-001 | Performance | Home page loads fast on mobile | LCP ≤ 2.5 s, CLS ≤ 0.1 (Lighthouse mobile, simulated 4G) on the production build (ASM-003) | Lighthouse run on `vite preview` / Vercel preview | Must |
| NFR-002 | Performance | Heavy features do not inflate the initial bundle | Architecture maps, case studies and modals are code-split; initial JS (gzip) does not grow more than 10% versus the 000 baseline | Build output size comparison | Should |
| NFR-003 | Interaction capability | Accessible to keyboard and assistive tech | WCAG 2.2 AA; 0 serious/critical axe violations on each route; modals trap focus, close with Esc, return focus | axe (Playwright) + manual keyboard pass | Must |
| NFR-004 | Interaction capability | Respects motion preferences | Under `prefers-reduced-motion: reduce`, no autoplay video and no non-essential animation | e2e with emulated media | Must |
| NFR-005 | Functional suitability | Indexable content | 100% of the route's primary text present in the served HTML (FR-012) | `curl` + assertion script in CI | Must |
| NFR-006 | Maintainability | i18n parity | EN and ES dictionaries and bilingual data have identical keys, enforced by types (`AppDictionary`, `{ en; es }`) | `tsc --noEmit` | Must |
| NFR-007 | Maintainability | Quality gates | Lint, type check, tests and build green on every PR in CI; every AC has ≥ 1 automated test | GitHub Actions | Must |
| NFR-008 | Maintainability | Code rules | Strict TypeScript; JSDoc on every function; max 100 chars/line; max 40 lines/function (constitution) | ESLint + review | Should |
| NFR-009 | Security | No secrets in frontend or repo | 0 secrets; only `VITE_*` public values in frontend; `.env.example` maintained | Review + secret scan | Must |
| NFR-010 | Security | Contact API hardening (existing) | Helmet headers; CORS allow-list; 5 req / 15 min / IP; Zod validation; no stack traces in prod | Existing scripts + review | Must |
| NFR-011 | Security | Embedded/external content is contained | External links `rel="noopener noreferrer"`; any iframe uses `sandbox` with minimum permissions | Review + lint rule | Must |
| NFR-012 | Compatibility | Evergreen browsers | Last 2 versions of Chrome, Edge, Firefox, Safari; widths 360–1920 px | e2e on desktop + mobile viewports | Must |
| NFR-013 | Reliability | External links stay alive | CV, live demo, repo and diagram URLs return 2xx/3xx | Link check (manual per release; automation decided in spec 002) | Should |
| NFR-014 | Security / privacy | Contact data retention | Retention period for `contact_messages` defined and applied (OQ-005) | Review | Could |
