# Tasks — Spec 001
> [P] = parallelizable (does not share files with other pending [P] tasks).

Source: `specs/001-project-cards-accuracy/plan.md` (Approved, G-Plan 2026-11-27) · Spec:
`spec.md` v1.4 (T-18 / T-19 wording updated 2026-11-27 for OQ-001-16 and ASM-008; T-14b and
the v1.4 T-18 wording added 2026-11-27: OQ-001-16 resolved by re-audit, no exception) ·
Written: 2026-11-27.

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

- [x] **T-01** — Add `ProjectKind` and the required `kind` plus optional `coldStartNotice` to
  `Project` (plan §1.1); set `kind` on the four projects per BR-006; create
  `frontend/src/data/projects.test.ts` with the kind test and the `@ts-expect-error` fixture
  (every required field except `kind`, used in an assertion).
  - AC: AC-001-08
  - Files: `frontend/src/types/project.ts`, `frontend/src/data/projects.ts`,
    `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    npm run typecheck --prefix frontend && grep -c "AC-001-08" frontend/src/data/projects.test.ts`
  - Depends on: — (G-Plan approved 2026-11-27)
  - Evidence: 5012f6f · Verify → exit 0 (2/2 tests; typecheck 0; grep 5); kind? mutation → TS2578

- [x] **T-02** — Replace the four stacks with the approved lists of spec §6 (order exact, no
  versions); add the stack tests.
  - AC: AC-001-01, AC-001-03, AC-001-07
  - Files: `frontend/src/data/projects.ts`, `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    ! grep -n '"Docker"\|"SQL"\|"WebSockets"\|"Vanilla.js"' frontend/src/data/projects.ts`
  - Depends on: T-01
  - Evidence: a3ad812 · Verify → exit 0 (9/9 tests; grep none); red 6 failed first; 45/45 all

- [x] **T-03** — Replace the four EN/ES descriptions with K-10 … K-17 (byte for byte); add the
  description tests (exact copy, no "Next.js 14", FlyWorkFlow terms, Slicing Edge first sentence).
  - AC: AC-001-02, AC-001-04, AC-001-06 (U)
  - Files: `frontend/src/data/projects.ts`, `frontend/src/data/projects.test.ts`
  - Verify: `npm test --prefix frontend -- src/data/projects.test.ts &&
    ! grep -rn "Next.js 14" frontend/src`
  - Depends on: T-02
  - Evidence: eefc79f · Verify → exit 0 (18/18 tests; grep none); red 9 failed first; 54/54 all

- [x] **T-04** [P] — Icons, part 1 of 2: copy the 12 Simple Icons glyphs from
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
  - Evidence: 636df58 · Verify → exit 0 (37/37 tests; 24 files; 12 fill="white"); red 37
    failed first; 91/91 all tests; format, lint, typecheck, build OK

- [x] **T-05** — Icons, part 2 of 2: author `generic-tech.svg` / `generic-tech-dark.svg` (original
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
  - Evidence: 7699e85 · Verify → exit 0 (123/123 tests; title found; grep 16); red 16 failed
    first; 177/177 all tests; format, lint, typecheck, build OK

## Phase B — i18n and card UI

- [x] **T-06** [P] — Add `portfolio.kind.{client,personal,personalQualifier}` and
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
  - Evidence: 850fe26 · Verify → exit 0 (9/9 tests; grep 3); red 2 failed first (pin);
    R-7 occurred → setup.ts shim; 181/181 all tests; format, lint, typecheck, build OK

- [x] **T-07** [P] — Create `ProjectKindLabel` (plan §1.5: `<p>`, chip palette, `rounded-md`,
  "·" in `aria-hidden="true"` with spaces outside) and its test (EN/ES per kind, `aria-hidden`).
  - AC: AC-001-09 (component)
  - Files: `frontend/src/components/ui/ProjectKindLabel.tsx`,
    `frontend/src/components/ui/ProjectKindLabel.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ProjectKindLabel.test.tsx &&
    ! grep -n "motion" frontend/src/components/ui/ProjectKindLabel.tsx`
  - Depends on: T-01, T-06
  - Evidence: c60fc42 · Verify → exit 0 (7/7 tests; no "motion" in source); red first (module
    missing); 188/188 all tests; format, lint, typecheck, build OK; browser check → validation

- [x] **T-08** [P] — Create `ColdStartNotice` (`<p role="note">`, `text-xs text-text-secondary`)
  and its test (K-04 EN/ES).
  - AC: AC-001-17 (component)
  - Files: `frontend/src/components/ui/ColdStartNotice.tsx`,
    `frontend/src/components/ui/ColdStartNotice.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ColdStartNotice.test.tsx &&
    ! grep -n "motion" frontend/src/components/ui/ColdStartNotice.tsx`
  - Depends on: T-06
  - Evidence: af9a095 · Verify → exit 0 (3/3 tests; no "motion" in source); red first (module
    missing); 191/191 all tests; format, lint, typecheck, build OK; browser check → T-09/validation

- [x] **T-09** — Extract `ProjectCardBody` from `ProjectCard` and render, in order: kind label,
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
  - Evidence: cb80941 · Verify → exit 0 (7/7 tests; eslint clean); red first (5/7 failed:
    no label, no note); 198/198 all tests; format, lint, typecheck, build OK; browser 360/1280
    EN/ES dark/light: 4 labels correct, no clipping, no h-scroll; only DEBT-013 + Turnstile logs

- [x] **T-10** — Grid-level tests in `PortfolioSection.test.tsx`: the four cards show the
  right kind label in EN and in ES; after clicking a category filter, every visible card still
  shows its label. Test-only task (no source change expected).
  - AC: AC-001-09 (grid), AC-001-20
  - Files: `frontend/src/components/sections/PortfolioSection.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/sections/PortfolioSection.test.tsx
    src/components/ui/ProjectFilterBar.test.tsx src/hooks/useProjectFilter.test.ts &&
    grep -c "AC-001-20" frontend/src/components/sections/PortfolioSection.test.tsx`
  - Depends on: T-06, T-09
  - Evidence: dce3a97 · Verify → exit 0 (29/29 tests; grep → 3); green at once (T-09 shipped it),
    so mutation proof: label removed → 7/7 label tests fail; kind forced "client" → 5 fail (personal
    cards only); restored. 205/205 all tests; format, lint, typecheck, build OK; no UI change

- [x] **T-11** [P] — DEBT-013: wrap `ProjectCard` in `forwardRef<HTMLElement, ProjectCardProps>`
  and pass `ref` to `motion.article`; create `PortfolioGrid.test.tsx` with a `console.error` spy:
  render 4 projects, rerender with 3, no "Function components cannot be given refs" call.
  - AC: AC-001-22
  - Files: `frontend/src/components/ui/ProjectCard.tsx`,
    `frontend/src/components/sections/PortfolioGrid.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/sections/PortfolioGrid.test.tsx &&
    grep -q "forwardRef" frontend/src/components/ui/ProjectCard.tsx`
  - Depends on: T-09
  - Evidence: 64e10f8 · Verify → exit 0 (1/1); red first (spy caught the warning from `PopChild`).
    206/206 all tests, 0 ref warnings in the run; format, lint, typecheck, build OK. Browser
    (R-9): no ref warning, but grid is `static`, so popped exit cards fly off; fixed in T-11a

- [x] **T-11a** — Grid needs a positioned parent for popLayout exits (R-9): `popLayout` pops
  exiting cards to `position: absolute`, so add `relative` as the first class of the grid
  `motion.div`; add an AC-001-22 test that the grid has class `relative` (guard only; jsdom has
  no layout, the browser frame trace is the proof).
  - AC: AC-001-22 (support), AC-001-20 (browser part)
  - Files: `frontend/src/components/sections/PortfolioGrid.tsx`,
    `frontend/src/components/sections/PortfolioGrid.test.tsx`
  - Verify: browser frame trace at 1280 and 360 px, filter All → Desktop: every exiting card
    stays within ~50 px of its slot over 120 frames; no ref warning in the console
  - Depends on: T-11
  - Evidence: acb2c45 · trace max drift 2985 → 23 px (1280), 6048 → 8 px (360); 0 ref
    warnings; new test red without `relative`. 207/207 tests; format, lint, typecheck, build OK

## Phase C — Live demo audit (documentation only; no `frontend/` edits)

- [x] **T-12** — **⛔ Hernán's go-ahead (starts the audit run; no login).** Audit preflight
  (plan §1.6 step 1): check the Playwright MCP connection (record the result; if it fails, T-13 …
  T-15 use the fallback: Hernán logs in by hand, the auditor records); create
  `docs/discovery/demo-audit.md` with the six headings, section 1 (date = `auditDate`, auditor,
  method version 1, links to spec 001 / FR-019 / BR-008, OQ-001-04 and OQ-001-12 owner
  confirmations dated 2026-11-27) and section 2 (BR-008 rules, exact commands, ASM-001-03); in
  section 3, the final status and redirect chain of the 7 URLs (3 `liveDemoUrl`, 4 `codeUrl`) and
  the oEmbed status of the 2 YouTube ids; propose the OQ-001-11 endpoints from public network
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
  - Evidence: fe5dbb9 · Verify → exit 0; auditDate 2026-11-27 (window end 2026-12-04); 7/7 final
    2xx; oEmbed 200 ×2 (2 ids: `java-desktop-app` EN/ES; "8" was a typo, owner 2026-11-27);
    MCP connected; OQ-001-11 proposal recorded

- [x] **T-13** — **⛔ Hernán's go-ahead for the Sushi Burrito Web demo.** One login attempt each
  for `admin@demo.com`, `kitchen@demo.com`, `waiter@demo.com`; record role, landing page,
  logout; result per spec §8.2 item 4. BR-008 only; B-E2 / B-E3 apply.
  - AC: AC-001-13 (rows), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `for u in admin@demo.com kitchen@demo.com waiter@demo.com; do
    grep -qE "$u.*(verified|failed|not tested)" docs/discovery/demo-audit.md || exit 1; done`
  - Depends on: T-12
  - Evidence: b22429e · Verify → exit 0; 3/3 `verified` on the first attempt (2026-11-27
    19:35 UTC-5), landing views recorded, logout OK; no real-looking data; no screenshot

- [x] **T-14** — **⛔ Hernán's go-ahead for the Slicing Edge demo.** One login attempt each for
  `admin@slicing-edge.com` and `customer@example.com`; same rules as T-13. Note any visible Stripe
  test-mode indicator without starting a checkout.
  - AC: AC-001-13 (rows), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `for u in admin@slicing-edge.com customer@example.com; do
    grep -qE "$u.*(verified|failed|not tested)" docs/discovery/demo-audit.md || exit 1; done`
  - Depends on: T-13 (shares the file; any order between T-13 … T-15 is fine, one at a time)
  - Evidence: 966fcf7 · Verify → exit 0; 2/2 `failed` on a single attempt each (2026-11-27
    19:37 UTC-5, "Invalid email or password"), not retried (B-E2); no Stripe indicator seen

- [x] **T-14a** — **⛔ Hernán's go-ahead (given 2026-11-27).** Re-audit Slicing Edge credentials
  after owner fix (OQ-001-16): a new audit run, one email/password attempt each for
  `admin@slicing-edge.com` and `customer@example.com`; same rules as T-13 (BR-008, B-E2, B-E3);
  T-14 rows kept as history.
  - AC: AC-001-13 (rows), AC-001-18
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -q "T-14a notes" docs/discovery/demo-audit.md &&
    grep -qE "admin@slicing-edge.com.*T-14a" docs/discovery/demo-audit.md`
  - Depends on: T-14, owner fix (OF-1)
  - Evidence: 2433544 · Verify → exit 0; Admin login succeeded (21:49 UTC-5, role "Admin",
    `/admin`) but showed real-looking customer data → logged out at once, nothing copied (B-E3);
    Customer not tested (run stopped). Escalated to Hernán; OQ-001-16 and OF-1 unchanged; T-18
    blocked until he decides (spec §4.3 B-E3)
  - Resolved 2026-11-27 (owner, option (a)): the admin orders are his test data (Stripe test
    mode, OQ-001-12) → Admin counts as `verified (T-14a)`; Customer re-audited in T-14b.

- [x] **T-14b** — **⛔ Hernán's go-ahead (given 2026-11-27, with his B-E3 decision).** Complete
  the Slicing Edge re-audit: record the owner's B-E3 decision (test data → Admin verified at
  T-14a, no new Admin login); one email/password attempt for `customer@example.com`; same rules
  as T-13 (BR-008, B-E2, B-E3). Then update §4.3 current rows, §5 and the §6 exception set; if
  the Customer is verified, close OQ-001-16 (no exception), OF-1 and bump the spec to v1.4.
  - AC: AC-001-13 (rows), AC-001-15 (D), AC-001-18
  - Files: `docs/discovery/demo-audit.md`, `specs/001-project-cards-accuracy/{spec,plan,tasks}.md`,
    `docs/roadmap.md`, `MEMORY.md`
  - Verify: `grep -q "T-14b notes" docs/discovery/demo-audit.md &&
    grep -qE "customer@example.com.*verified \(T-14b\)" docs/discovery/demo-audit.md &&
    grep -qE "admin@slicing-edge.com.*verified \(T-14a\)" docs/discovery/demo-audit.md`
  - Depends on: T-14a, owner B-E3 decision (2026-11-27)
  - Evidence: 64e2856 · Verify → exit 0; Customer login succeeded on the single attempt
    (2026-11-27 21:54 UTC-5, signed-in storefront, no role badge, no personal data), logout OK;
    OQ-001-16 closed (no exception), OF-1 closed; spec v1.4

- [x] **T-15** — **⛔ Hernán's go-ahead for the FlyWorkFlow demo.** One login attempt each for
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
  - Evidence: 6f6f8d7 · Verify → exit 0; Admin and Member `verified` on a single attempt each
    (2026-11-27 20:13 – 20:14 UTC-5, role shown in header); Super Admin not attempted
  - Note (spec v1.3): the Super Admin row now reads `not audited — owner-verified 2026-11-27`
    (ASM-008 closed); a re-run of this Verify must grep that string instead.

- [x] **T-16** — **⛔ Hernán's go-ahead (OQ-001-11 closed 2026-11-27).** Latency session 1
  (no login): `curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{http_code}"` on
  each confirmed endpoint (FlyWorkFlow API `/health`; Slicing Edge API `/api/health` and
  storefront home; Sushi Burrito Web API `/api`; spec §11 OQ-001-11), each sample after
  ≥ 30 min without auditor traffic; record time (UTC-5), endpoint and values.
  - AC: AC-001-13 (latency rows), AC-001-16 (input)
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -q "time_total" docs/discovery/demo-audit.md &&
    grep -q "Session 1" docs/discovery/demo-audit.md`
  - Depends on: T-12 (OQ-001-11 closed 2026-11-27: the T-12 proposal is confirmed)
  - Evidence: 0de1605 · Verify → exit 0; 2 of 3 samples per endpoint (2026-11-27 20:16 –
    21:16 UTC-5), all 200, max `time_total` 2.62 s (FlyWorkFlow, cold Lambda); none > 10 s

- [x] **T-17** — **⛔ Hernán's go-ahead (OQ-001-11 closed).** Latency session 2, in a separate
  implementer invocation, completing 3 samples per endpoint; write the `coldStartNotice` decision
  per project (yes if any `time_total` > 10 s / no / N/A with reason).
  - AC: AC-001-13 (latency rows), AC-001-16 (input)
  - Files: `docs/discovery/demo-audit.md`
  - Verify: `grep -q "Session 2" docs/discovery/demo-audit.md &&
    test "$(grep -ciE 'coldStartNotice.*(yes|no|N/A)' docs/discovery/demo-audit.md)" -ge 4`
  - Depends on: T-16
  - Evidence: 7a9f7ea · Verify → exit 0; 3 of 3 samples per endpoint (session 2 2026-11-27
    21:25 – 21:47 UTC-5), all 200, max `time_total` 2.90 s (FlyWorkFlow); notice: no × 3, N/A × 1

- [ ] **T-18** — Close the audit (no live access): write section 5 (at least the four spec §8.2
  item 5 follow-ups) and the section 6 `json` summary; set `projects.ts` from it (remove every
  `failed` / `not tested` credential **not** in `ownerExceptionUsernames`; keep the one owner
  exception unchanged: the FlyWorkFlow Super Admin (OQ-001-15); the Slicing Edge
  `admin@slicing-edge.com` and `customer@example.com` are `verified` (T-14a / T-14b, OQ-001-16
  closed in spec v1.4), so they stay through `verifiedUsernames`, not as exceptions; set
  `coldStartNotice: true` only for `coldStartProjectIds`; role labels follow observed app names);
  add the audit-summary tests to `projects.test.ts` (headings, valid `auditDate`, an entry per
  project id, credentials = verified + owner exception, the one owner-exception username
  unchanged and exactly the exception set, not verified, notice flags). No test asserts
  that a `failed` credential is absent unless it is outside `ownerExceptionUsernames`.
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
  DEBT-013 → Closed (spec 001, T-11); `MEMORY.md`: ASM-008 closed (owner-verified 2026-11-27),
  the owner exception and the `auditDate` (written in the spec v1.3 / v1.4 commits; confirm).
  - AC: AC-001-22 (DEBT-013 closed), AC-001-15 (D, ASM-008 row closed in v1.3)
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
| T-16, T-17 | Hernán's go-ahead (OQ-001-11 closed 2026-11-27) |
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
| AC-001-22 | T-11, T-11a, T-19 | `PortfolioGrid.test.tsx` + roadmap |

## Evidence
