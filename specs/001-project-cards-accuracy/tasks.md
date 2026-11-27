# Tasks — Spec 001
> [P] = parallelizable (does not share files with other pending [P] tasks).

Source: `specs/001-project-cards-accuracy/plan.md` (Approved, G-Plan 2026-11-27) · Spec:
`spec.md` v1.1 · Written: 2026-11-27.

**Conventions for every task**
- One task = one commit: `<type>(<scope>): <description> [T-NN]` (Conventional Commits), ending
  with the attribution line from the session.
- All `Verify` commands run from the repository root in Git Bash.
- Every code task (T-01 … T-11, T-18) also passes, with `--prefix frontend`:
  `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
  (AGENTS.md; AC-001-21). These are implied and not repeated in each `Verify`.
- Write the failing test first (GENESIS §C.2), then the change; the commit holds both.
- [P] is logical only. Commit-producing agents run **one at a time** in this checkout (MEMORY.md:
  parallel agents break `node_modules`).
- **Human gates:** tasks marked **⛔ Hernán's go-ahead** must not start until Hernán gives an
  explicit go-ahead in the conversation, for that task (and, for T-13 … T-15, for that demo).
  They touch live third-party deployments under BR-008. They are documentation tasks, separate
  from the code tasks, and they never edit `frontend/`.
- **Audit window (plan §1.6, D-1, ASM-001-14):** T-12 … T-17 run within 7 days of `auditDate`
  (the T-12 date), and G-Merge happens within 7 days of it; otherwise spec §4.2 B4 (re-run) applies.

## Phase A — Data model and content

- [ ] **T-01** — Add `ProjectKind` and the required `kind` plus optional `coldStartNotice` to
  `Project` (plan §1.1); set `kind` on the four projects per BR-006; create
  `frontend/src/data/projects.test.ts` with the kind test and the `@ts-expect-error` fixture
  (every required field except `kind`, used in an assertion).
  - AC: AC-001-08
  - Files: `frontend/src/types/project.ts`, `frontend/src/data/projects.ts`,
    `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    npm run typecheck --prefix frontend && grep -c "AC-001-08" frontend/src/data/projects.test.ts`
  - Depends on: — (G-Plan approved 2026-11-27)

- [ ] **T-02** — Replace the four stacks with the approved lists of spec §6 (order exact, no
  versions); add the stack tests.
  - AC: AC-001-01, AC-001-03, AC-001-07
  - Files: `frontend/src/data/projects.ts`, `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    ! grep -n '"Docker"\|"SQL"\|"WebSockets"\|"Vanilla.js"' frontend/src/data/projects.ts`
  - Depends on: T-01

- [ ] **T-03** — Replace the four EN/ES descriptions with K-10 … K-17 (byte for byte); add the
  description tests (exact copy, no "Next.js 14", FlyWorkFlow terms, Slicing Edge first sentence).
  - AC: AC-001-02, AC-001-04, AC-001-06 (U)
  - Files: `frontend/src/data/projects.ts`, `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    ! grep -rn "Next.js 14" frontend/src`
  - Depends on: T-02

- [ ] **T-04** [P] — Icons, part 1 of 2: copy the 12 Simple Icons glyphs from
  `simple-icons@16.37.0` (plan §1.3 table, light file unchanged, `-dark` with `fill="white"`);
  add their 12 map keys; export `hasTechIcon`; create `frontend/src/utils/techIcons.test.ts` that
  checks the 12 labels are explicit keys and their files exist.
  - AC: AC-001-05 (brand labels)
  - Files: `frontend/src/utils/techIcons.ts`, `frontend/src/utils/techIcons.test.ts`,
    `frontend/public/assets/icons/tech/{nestjs,prisma,upstash,turborepo,vite,sequelize,socketio,nginx,digitalocean,spring,flyway,junit5}{,-dark}.svg`
  - Verify: `npm test --prefix frontend -- src/utils/techIcons.test.ts &&
    test "$(ls frontend/public/assets/icons/tech/{nestjs,prisma,upstash,turborepo,vite,sequelize,socketio,nginx,digitalocean,spring,flyway,junit5}{,-dark}.svg | wc -l)" -eq 24 &&
    for f in nestjs prisma upstash turborepo vite sequelize socketio nginx digitalocean spring
    flyway junit5; do grep -q 'fill="white"' frontend/public/assets/icons/tech/$f-dark.svg || exit 1;
    done`
  - Depends on: — (G-Plan approved)

- [ ] **T-05** — Icons, part 2 of 2: author `generic-tech.svg` / `generic-tech-dark.svg` (original
  24×24 cube outline, `<title>Technology</title>`); add the keys `aws lambda`, `amazon s3`,
  `llm tool calling (groq)` (→ generic) and `vanilla js` (→ `javascript.svg`); extend the test to
  every label of every stack in `projects.ts` plus the explicit list of the 16 D-10 labels.
  - AC: AC-001-05 (complete)
  - Files: `frontend/src/utils/techIcons.ts`, `frontend/src/utils/techIcons.test.ts`,
    `frontend/public/assets/icons/tech/generic-tech{,-dark}.svg`
  - Verify: `npm test --prefix frontend -- src/utils/techIcons.test.ts &&
    grep -q "<title>Technology</title>" frontend/public/assets/icons/tech/generic-tech.svg &&
    grep -c "AC-001-05" frontend/src/utils/techIcons.test.ts`
  - Depends on: T-02, T-04

## Phase B — i18n and card UI

- [ ] **T-06** [P] — Add `portfolio.kind.{client,personal,personalQualifier}` and
  `portfolio.coldStartNotice` to `AppDictionary`, `en.ts`, `es.ts`; change `portfolio.subtitle`
  to K-03; pin K-01 … K-04 to the approved literals in `dictionaries.test.ts`; create
  `frontend/src/components/sections/PortfolioSection.test.tsx` with the subtitle test (EN, and ES
  via the stored language).
  - AC: AC-001-11; copy support for AC-001-09, AC-001-17
  - Files: `frontend/src/types/i18n.ts`, `frontend/src/i18n/en.ts`, `frontend/src/i18n/es.ts`,
    `frontend/src/i18n/dictionaries.test.ts`,
    `frontend/src/components/sections/PortfolioSection.test.tsx`
    (+ `frontend/src/test/setup.ts` only if R-7 occurs)
  - Verify: `npm test --prefix frontend -- src/i18n/dictionaries.test.ts
    src/components/sections/PortfolioSection.test.tsx &&
    grep -c "AC-001-11" frontend/src/components/sections/PortfolioSection.test.tsx`
  - Depends on: T-01 (the section renders the grid, which needs `kind`)

- [ ] **T-07** [P] — Create `ProjectKindLabel` (plan §1.5: `<p>`, chip palette, `rounded-md`,
  "·" in `aria-hidden="true"` with spaces outside) and its test (EN/ES per kind, `aria-hidden`).
  - AC: AC-001-09 (component)
  - Files: `frontend/src/components/ui/ProjectKindLabel.tsx`,
    `frontend/src/components/ui/ProjectKindLabel.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ProjectKindLabel.test.tsx &&
    ! grep -n "motion" frontend/src/components/ui/ProjectKindLabel.tsx`
  - Depends on: T-01, T-06

- [ ] **T-08** [P] — Create `ColdStartNotice` (`<p role="note">`, `text-xs text-text-secondary`)
  and its test (K-04 EN/ES).
  - AC: AC-001-17 (component)
  - Files: `frontend/src/components/ui/ColdStartNotice.tsx`,
    `frontend/src/components/ui/ColdStartNotice.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ColdStartNotice.test.tsx &&
    ! grep -n "motion" frontend/src/components/ui/ColdStartNotice.tsx`
  - Depends on: T-06

- [ ] **T-09** — Extract `ProjectCardBody` from `ProjectCard` and render, in order: kind label,
  title, description, stack, footer `mt-auto flex flex-col gap-3` (notice when
  `coldStartNotice`, then `ProjectCardActions`). Create `ProjectCard.test.tsx`: Slicing Edge EN
  description starts "AI shopping assistant"; EN → ES rerender switches label, description and
  notice; label precedes `<h3>`; flagged fixture shows the note, unflagged shows none.
  - AC: AC-001-06 (C), AC-001-10, AC-001-17 (card)
  - Files: `frontend/src/components/ui/ProjectCardBody.tsx`,
    `frontend/src/components/ui/ProjectCard.tsx`,
    `frontend/src/components/ui/ProjectCard.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ProjectCard.test.tsx &&
    (cd frontend && npx eslint --max-warnings 0 src/components/ui/ProjectCard.tsx
    src/components/ui/ProjectCardBody.tsx)`
  - Depends on: T-03, T-07, T-08

- [ ] **T-10** — Grid-level tests in `PortfolioSection.test.tsx`: the four cards show the
  right kind label in EN and in ES; after clicking a category filter, every visible card still
  shows its label. Test-only task (no source change expected).
  - AC: AC-001-09 (grid), AC-001-20
  - Files: `frontend/src/components/sections/PortfolioSection.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/sections/PortfolioSection.test.tsx
    src/components/ui/ProjectFilterBar.test.tsx src/hooks/useProjectFilter.test.ts &&
    grep -c "AC-001-20" frontend/src/components/sections/PortfolioSection.test.tsx`
  - Depends on: T-06, T-09

- [ ] **T-11** [P] — DEBT-013: wrap `ProjectCard` in `forwardRef<HTMLElement, ProjectCardProps>`
  and pass `ref` to `motion.article`; create `PortfolioGrid.test.tsx` with a `console.error` spy:
  render 4 projects, rerender with 3, no "Function components cannot be given refs" call.
  - AC: AC-001-22
  - Files: `frontend/src/components/ui/ProjectCard.tsx`,
    `frontend/src/components/sections/PortfolioGrid.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/sections/PortfolioGrid.test.tsx &&
    grep -q "forwardRef" frontend/src/components/ui/ProjectCard.tsx`
  - Depends on: T-09

## Phase C — Live demo audit (documentation only; no `frontend/` edits)

- [ ] **T-12** — **⛔ Hernán's go-ahead (starts the audit run; no login).** Audit preflight
  (plan §1.6 step 1): check the Playwright MCP connection (record the result; if it fails, T-13 …
  T-15 use the fallback: Hernán logs in by hand, the auditor records); create
  `docs/discovery/demo-audit.md` with the six headings, section 1 (date = `auditDate`, auditor,
  method version 1, links to spec 001 / FR-019 / BR-008, OQ-001-04 and OQ-001-12 owner
  confirmations dated 2026-11-27) and section 2 (BR-008 rules, exact commands, ASM-001-03); in
  section 3, the final status and redirect chain of the 7 URLs (3 `liveDemoUrl`, 4 `codeUrl`) and
  the oEmbed status of the 8 YouTube ids; propose the OQ-001-11 endpoints from public network
  requests (no login, no form). A final non-2xx after one re-check → stop and escalate (B-E1,
  B-E4).
  - AC: AC-001-19 (live part), AC-001-13 (structure), AC-001-18 (method)
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `test "$(grep -cE '^## [1-6]\. ' docs/discovery/demo-audit.md)" -eq 6 &&
    grep -q "BR-008" docs/discovery/demo-audit.md &&
    grep -q "OQ-001-04" docs/discovery/demo-audit.md &&
    grep -q "OQ-001-12" docs/discovery/demo-audit.md &&
    test "$(grep -c "youtube.com/oembed\|oEmbed" docs/discovery/demo-audit.md)" -ge 1`
  - Depends on: T-01 … T-11 (code done first, so the window ends near G-Merge)

- [ ] **T-13** — **⛔ Hernán's go-ahead for the Sushi Burrito Web demo.** One login attempt each
  for `admin@demo.com`, `kitchen@demo.com`, `waiter@demo.com`; record role, landing page,
  logout; result per spec §8.2 item 4. BR-008 only; B-E2 / B-E3 apply.
  - AC: AC-001-13 (rows), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `for u in admin@demo.com kitchen@demo.com waiter@demo.com; do
    grep -qE "$u.*(verified|failed|not tested)" docs/discovery/demo-audit.md || exit 1; done`
  - Depends on: T-12

- [ ] **T-14** — **⛔ Hernán's go-ahead for the Slicing Edge demo.** One login attempt each for
  `admin@slicing-edge.com` and `customer@example.com`; same rules as T-13. Note any visible Stripe
  test-mode indicator without starting a checkout.
  - AC: AC-001-13 (rows), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `for u in admin@slicing-edge.com customer@example.com; do
    grep -qE "$u.*(verified|failed|not tested)" docs/discovery/demo-audit.md || exit 1; done`
  - Depends on: T-13 (shares the file; any order between T-13 … T-15 is fine, one at a time)

- [ ] **T-15** — **⛔ Hernán's go-ahead for the FlyWorkFlow demo.** One login attempt each for
  the Admin and Member accounts; same rules as T-13. The Super Admin row
  (`camila.rojas@flyworkflow.io`) is written as `not audited — owner investigation pending`, with
  **no** login (OQ-001-05, OQ-001-15).
  - AC: AC-001-13 (rows), AC-001-15 (D), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -qE "camila.rojas@flyworkflow.io.*not audited — owner investigation pending"
    docs/discovery/demo-audit.md && for u in isabela.nieto diego.salazar; do
    grep -qE "$u@constructoradelvalle.com.*(verified|failed|not tested)"
    docs/discovery/demo-audit.md || exit 1; done`
  - Depends on: T-14

- [ ] **T-16** — **⛔ Hernán's go-ahead · blocked by OQ-001-11.** Latency session 1 (no login):
  `curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}"` on each confirmed
  endpoint (FlyWorkFlow `/health`; Slicing Edge API health or `/docs` and storefront home; Sushi
  Burrito API health if one exists, else N/A with reason), each sample after ≥ 30 min without
  auditor traffic; record time (UTC-5), endpoint and values.
  - AC: AC-001-13 (latency rows), AC-001-16 (input)
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -q "time_total" docs/discovery/demo-audit.md &&
    grep -q "Session 1" docs/discovery/demo-audit.md`
  - Depends on: T-12, OQ-001-11 closed (Hernán confirms the T-12 proposal or gives the URLs)

- [ ] **T-17** — **⛔ Hernán's go-ahead · blocked by OQ-001-11.** Latency session 2, in a separate
  implementer invocation, completing 3 samples per endpoint; write the `coldStartNotice` decision
  per project (yes if any `time_total` > 10 s / no / N/A with reason).
  - AC: AC-001-13 (latency rows), AC-001-16 (input)
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -q "Session 2" docs/discovery/demo-audit.md &&
    test "$(grep -ciE 'coldStartNotice.*(yes|no|N/A)' docs/discovery/demo-audit.md)" -ge 4`
  - Depends on: T-16

- [ ] **T-18** — Close the audit (no live access): write section 5 (at least the four spec §8.2
  item 5 follow-ups) and the section 6 `json` summary; set `projects.ts` from it (remove every
  `failed` / `not tested` credential, keep the Super Admin unchanged, set `coldStartNotice: true`
  only for `coldStartProjectIds`, role labels follow observed app names); add the audit-summary
  tests to `projects.test.ts` (headings, valid `auditDate`, an entry per project id, credentials
  = verified + owner exception, Super Admin unchanged and only exception, notice flags).
  - AC: AC-001-13 (U), AC-001-14, AC-001-15 (U), AC-001-16
  - Files: `docs/discovery/demo-audit.md`, `frontend/src/data/projects.ts`,
    `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    for id in AC-001-13 AC-001-14 AC-001-15 AC-001-16; do
    grep -q "$id" frontend/src/data/projects.test.ts || exit 1; done`
  - Depends on: T-13, T-14, T-15, T-17 (and no unresolved B-E1 / B-E3 / B-E4 escalation)

## Phase D — Documentation

- [ ] **T-19** — Docs: glossary "Cold-start notice" (name `coldStartNotice` final, drop "proposed");
  `docs/traceability.md` rows FR-014, FR-015, FR-016, FR-019 → ACs and test files; roadmap
  DEBT-013 → Closed (spec 001, T-11); `MEMORY.md`: ASM-008 open (owner investigation) and the
  `auditDate`.
  - AC: AC-001-22 (DEBT-013 closed), AC-001-15 (D, ASM-008 note unchanged)
  - Files: `docs/glossary.md`, `docs/traceability.md`, `docs/roadmap.md`, `MEMORY.md`
  - Verify: `grep -E "^\| FR-01[4569] " docs/traceability.md | grep -c "AC-001" | grep -qx 4 &&
    grep -E "^\| DEBT-013 " docs/roadmap.md | grep -q "Closed" &&
    ! grep -n "name proposed" docs/glossary.md`
  - Depends on: T-11, T-18

## Post-implementation steps (not implementer tasks; listed so every AC has an owner)
- **P-01** — Coordinator asks Hernán before pushing; Hernán opens the **draft** PR. CI `frontend`
  job green (AC-001-21).
- **P-02** — `/sdd-validate 001` × 3 (compliance | e2e | quality-security), recorded in
  `validation.md`: AC-001-12 browser matrix with measured contrast ratios; AC-001-19 re-run of the
  curl and oEmbed commands on the final data; document checks AC-001-13 (D), -15 (D), -18.
- **P-03** — 🚦 G-Merge within 7 days of `auditDate` (else spec §4.2 B4 re-run first); roadmap row
  001 → Implemented; retrospective (GENESIS §C.9).

## Human gates and blockers
| Task | Gate |
|---|---|
| T-12 | Hernán's go-ahead to start the audit run (opens live demos, no login) |
| T-13 | Hernán's go-ahead for Sushi Burrito Web logins |
| T-14 | Hernán's go-ahead for Slicing Edge logins |
| T-15 | Hernán's go-ahead for FlyWorkFlow logins (Super Admin never logged into) |
| T-16, T-17 | Hernán's go-ahead + OQ-001-11 closed |
| P-01 | Push / PR: ask first; Hernán opens the draft PR |

## AC coverage
| AC | Task(s) | Test or evidence |
|---|---|---|
| AC-001-01 | T-02 | `projects.test.ts` |
| AC-001-02 | T-03 | `projects.test.ts` |
| AC-001-03 | T-02 | `projects.test.ts` |
| AC-001-04 | T-03 | `projects.test.ts` |
| AC-001-05 | T-04, T-05 | `techIcons.test.ts` |
| AC-001-06 | T-03, T-09 | `projects.test.ts`, `ProjectCard.test.tsx` |
| AC-001-07 | T-02 | `projects.test.ts` |
| AC-001-08 | T-01 | `projects.test.ts` + `npm run typecheck` |
| AC-001-09 | T-07, T-10 | `ProjectKindLabel.test.tsx`, `PortfolioSection.test.tsx` |
| AC-001-10 | T-09 | `ProjectCard.test.tsx` |
| AC-001-11 | T-06 | `PortfolioSection.test.tsx` |
| AC-001-12 | P-02 | `validation.md` (recorded verification, spec §9) |
| AC-001-13 | T-12 … T-18, P-02 | `projects.test.ts` + reviewer document check |
| AC-001-14 | T-18 | `projects.test.ts` |
| AC-001-15 | T-15, T-18, T-19, P-02 | `projects.test.ts` + reviewer document check |
| AC-001-16 | T-16, T-17, T-18 | `projects.test.ts` |
| AC-001-17 | T-08, T-09 | `ColdStartNotice.test.tsx`, `ProjectCard.test.tsx` |
| AC-001-18 | T-12 … T-15, P-02 | `demo-audit.md` (recorded verification, spec §9) |
| AC-001-19 | T-12, P-02 | `demo-audit.md` + validation re-run (recorded verification, spec §9) |
| AC-001-20 | T-10 | `PortfolioSection.test.tsx` + existing filter tests |
| AC-001-21 | every code task, P-01 | local five commands + CI |
| AC-001-22 | T-11, T-19 | `PortfolioGrid.test.tsx` + roadmap |

## Evidence
