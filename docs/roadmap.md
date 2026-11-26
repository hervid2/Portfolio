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
| 008 | Sushi Burrito testimonial | PO-11 | FR-021 | Should | 001, OQ-001 (resolved 2026-11-26) | Planned |

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
| DEBT-008 | Doc vs code drift: `docs/requirements/roles-permissions.md` says contact creation stores `sourceIp` and `userAgent`, but `ContactMessageDTO` and `PrismaContactRepository.save` store neither (the `schema.prisma` columns are nullable). Found in spec 000 clarification (CL-24) | Docs overstate what is stored; privacy and retention decisions (OQ-005) rest on wrong facts | Decide with OQ-005: store them (with a retention policy) or correct the docs; not in spec 000 | Open |
| DEBT-009 | Tooling pinned below the latest majors for Node 22.17 / Vite 5 (Vitest 3, jsdom 29, `eslint-plugin-jsdoc` 63; ESLint 10 core `max-len` is removed in ESLint 11). Found in spec 000 planning (R-6) | Missing tool fixes; an ESLint 11 upgrade would drop the `max-len` rule | Revisit with DEBT-007 or a Node upgrade; move `max-len` to `@stylistic` before ESLint 11 | Open |
| DEBT-010 | With `prefers-reduced-motion: reduce`, 32 animated elements never finish their entry animation: 28 stay offset by `translateY(24px)` and the 4 project cards stay at `scale(0.96) translateY(24px)`. Found in spec 000 T-01 (F-1, `specs/000-quality-baseline/visual-baseline.md`) | Reduced-motion users see shifted, slightly shrunken content (a11y and visual polish) | Fix in a later spec (not 000, which forbids behavior changes); spec 000 only checks there is no regression | Open |
| DEBT-011 | `CredentialsModal` and `VideoModal` do not move focus into the dialog on open (focus stays on the trigger; Esc and focus return work). Found in spec 000 T-01 (F-2) | Keyboard and screen-reader users are not taken into the dialog (a11y) | Fix in a later spec (e.g. spec 004, a11y); not 000 | Open |
| DEBT-012 | The contact form shows the raw `Failed to fetch` when the API is unreachable: not a dictionary string, not bilingual. Found in spec 000 T-01 (F-3) | Violates constitution Title II/III (every user-visible string in EN and ES); poor error UX | Fix in a later spec with a bilingual error message; not 000 | Open |
