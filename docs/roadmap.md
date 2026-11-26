# Roadmap

| Spec | Feature | Backlog | FRs covered | Priority | Depends on | Status |
|---|---|---|---|---|---|---|
| 000 | Quality baseline (brownfield walking skeleton): ESLint, Vitest + Testing Library with real tests, type check, GitHub Actions CI for frontend and api | — | NFR-007, NFR-008 | Must | — | Planned |
| 001 | Project cards accuracy: FlyWorkFlow stack, Slicing Edge AI assistant first, Client/Personal label and subtitle, demo audit and notices | PO-4, PO-5, PO-6, PO-9 | FR-014, FR-015, FR-016, FR-019 | Must | 000 | Planned |
| 002 | Hero and contact CTAs: new headline, Download CV (by language), copy email | PO-7, PO-1 | FR-010, FR-011, FR-017 | Must | 000 | Planned |
| 003 | About and Skills alignment | PO-8 | FR-018 | Should | 000 | Planned |
| 004 | Routing and static pre-rendering (ADR-0003 Option C): typed route table, SSG build script, hydration, Vercel fallback, CI check that content is in the HTML | PO-2 | FR-012 | Must | 000 | Planned |
| 005 | Link-preview SEO: per-route meta description, Open Graph and Twitter tags, OG image | PO-10 | FR-020 | Should | 004 | Planned |
| 006 | Case studies: FlyWorkFlow and Slicing Edge | PO-3 | FR-013 | Must | 005 | Planned |
| 007 | Interactive architecture maps ×4 (per ADR-0004) | PO-12 | FR-022 | Should | 001 | Planned |
| 008 | Sushi Burrito testimonial | PO-11 | FR-021 | Should | 001, OQ-001 | Blocked (OQ-001) |

> Slice features into **vertical slices**: each one delivers end-to-end value
> (UI → logic → data) and can be demonstrated on its own.
> Order rationale:
> - 001–003 are quick, data and copy changes with high recruiter impact.
> - 004 delivers PO-2 with the pipeline chosen in ADR-0003; 005 builds the metadata on top of it.
> - Case studies (006) need routes and pre-rendering.

## Future ideas (not scheduled)
- Move the canonical domain to `hernan-cardona.com` (OQ-004, "not now").
- Add `oakfern_bank_dashboard` to the portfolio (OQ-003, "out of scope").
- Pre-render ES routes (`/es/...`) with `hreflang` (see ASM-010).

## Technical debt
| ID | Description | Impact | Proposal | Status |
|---|---|---|---|---|
| DEBT-001 | No tests, no ESLint config (`npm run lint` fails: `eslint` is not installed), no CI | Regressions reach production | Spec 000 | Planned |
| DEBT-002 | `schema.prisma` defines content models (Project, Skill, Language …) used only by the smoke test | Confusing model; dead schema | Remove or document in a future spec | Open |
| DEBT-003 | No observability beyond host logs for the API | Failures go unnoticed | Uptime check on `/health` (free tier) | Open |
| DEBT-004 | No `prisma/migrations` folder in the repo, although `prisma:deploy` is used | Schema drift between environments | Baseline migration | Open |
| DEBT-005 | `tsconfig*.tsbuildinfo`, `vite.config.js/.d.ts` and `tailwind.config.js/.d.ts` are committed build artifacts | Noise; stale configs | Clean up in spec 000 if in scope | Open |
| DEBT-006 | `rules/portfolio_rules.md` is gitignored and duplicates the constitution | Two sources of rules | The constitution prevails; owner decides whether to keep `rules/` | Open |
| DEBT-007 | React 18.3 and Vite 5.4 are behind the current majors (React 19.3, Vite 8.4, checked 2026-11-26) | Missing features and security fixes over time | Dedicated upgrade spec when worthwhile; it is not needed by ADR-0003 | Open |
