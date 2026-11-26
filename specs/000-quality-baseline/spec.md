# Spec 000 — Quality baseline (brownfield walking skeleton)
Status: Implemented · Version: 1.4 · Branch: feat/000-quality-baseline ·
FR: FR-002 (partial), FR-008 (tests only) · NFR: NFR-002, NFR-007, NFR-008, NFR-009 ·
Debt: DEBT-001, DEBT-005 · Depends on: —

## 1. Objective
The portfolio is live but has no linter, formatter, tests or CI (DEBT-001), so every change
can reach production with no automated check. This spec gives both packages (`frontend/`, `api/`)
a working quality pipeline: format, lint, type check, tests and build, run locally and in GitHub
Actions. It also brings the existing code into compliance with the constitution's code rules.
Every later spec (001–008) builds on this pipeline.

## 2. Scope
**Includes**
- **Line endings (CL-04):** a root `.gitattributes` with `* text=auto eol=lf`, binary assets
  (images, video, fonts, PDF) marked `binary`, and a one-time `git add --renormalize .` in its
  own commit.
- **Prettier (CL-11)** in both packages, with `format` and `format:check` scripts. Options match
  the current style: `semi: true`, `singleQuote: false`, `trailingComma: "none"`,
  `printWidth: 100`, `endOfLine: "lf"`. Scope: `ts, tsx, js, cjs, css, json, html` inside each
  package (no Markdown). No `prettier-plugin-tailwindcss` (it conflicts with the constitution's
  class order).
- **ESLint flat config** in both packages, run with `--max-warnings 0`, every rule at `error`:
  - TypeScript rules (not type-aware; type-aware linting is deferred, CL-23).
  - React hooks (frontend): only `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`
    (CL-10). No React Compiler rules.
  - `max-len` 100, from whichever source is not removed in the chosen ESLint major (core or
    `@stylistic`; the plan decides, CL-10). URLs are ignored (ASM-000-01).
  - `max-lines-per-function` 40, counted with `skipBlankLines` and `skipComments` (ASM-000-02).
  - `no-console`.
  - JSDoc scope (CL-07): required on function declarations, class declarations and methods
    (constructors only when they have logic), and arrow or function expressions that are
    assigned to a named variable or exported (components, hooks, utils). Not required on inline
    callbacks passed as arguments or JSX props. `jsdoc/require-param` with
    `checkDestructured: false` (keeps the existing flat `@param <propName>` style) and
    `jsdoc/require-returns`.
  - `eslint-config-prettier` is applied **before** the project rules, so `max-len` stays active
    (CL-11).
  - Explicit ignores for build outputs: `dist`, `coverage`, `*.tsbuildinfo` and the generated
    config files (CL-05).
  - Relaxations (CL-13): in `**/*.test.{ts,tsx}` and test setup files,
    `max-lines-per-function` and `jsdoc/require-jsdoc` are off (`max-len` and `no-console`
    stay on). In `api/src/scripts/**`, only `no-console` is off.
  - `react/jsx-no-target-blank` (NFR-011) **only if** `eslint-plugin-react` is accepted in the
    plan's dependency list; otherwise deferred to spec 002 (CL-23).
- **Fixing every existing violation now** (owner decision, 2026-11-26), including splitting
  oversized React components into subcomponents with **no visual or behavior change** (§7).
  Long Tailwind class lists are split by string concatenation by default; `@apply` is used only
  for patterns repeated ≥ 3 times, in `@layer components`, following the `ui-tokens-motion`
  skill (CL-12).
- **API logging (CL-03):** a minimal `api/src/infrastructure/logging/logger.ts` that wraps
  `console.info/warn/error`. It is the only file with a documented
  `eslint-disable-next-line no-console`. `server.ts` and `errorHandler.ts` log through it. No
  new dependency.
- **API captcha seam (CL-01):** `CaptchaVerifier` is injected into
  `SubmitContactMessageUseCase`. The controller passes the token and the client IP. The use case
  reports a typed "captcha rejected" outcome, and the controller maps it to the same
  `400 {"message":"Captcha validation failed"}` as today. `NoopCaptchaVerifier` is injected when
  captcha is disabled (today's behavior). This is the only API structural change allowed besides
  CL-03 and lint fixes (§8).
- **Vitest** in both packages (`npm test`) with a coverage report (text + lcov, not gated,
  ASM-011):
  - frontend: jsdom + Testing Library;
  - api: unit tests only (ASM-000-04).
- **Test layout (CL-14):** `*.test.ts(x)` colocated next to the code. API: a
  `tsconfig.build.json` that excludes tests is used by `npm run build`, while
  `tsc -p api --noEmit` still type-checks the tests. Frontend: test types (Vitest, jest-dom) come
  from a setup file included in `tsconfig.json`, with jsdom shims such as `matchMedia`. Config
  files are type-checked through `tsconfig.node.json`.
- The first real tests (§10, AC-000-05 and AC-000-06).
- **CI:** one GitHub Actions workflow with `frontend` and `api` jobs (§8).
- **DEBT-005 (CL-05):** remove the committed build artifacts, ignore them, and fix the cause:
  `frontend/tsconfig.node.json` must not emit beside the sources (for example, emit and
  `tsBuildInfoFile` under `node_modules/.tmp`; the planner confirms the exact setting for
  TS 5.6). A CI guard step fails if any DEBT-005 path is tracked.
- **Branch protection** on `main` (CL-08), applied by an agent through the GitHub REST API after
  G-Merge, with the owner's explicit yes (§8, AC-000-11).
- **Harness (CL-20):** the `testing-conventions` skill in `.harness/skills/` plus regenerated
  Claude Code adapters, and the `AGENTS.md` updates listed in AC-000-12.
- **Documentation (CL-21):**
  - `docs/traceability.md`: rows for FR-002/BR-001 → AC-000-05 (a)(e), FR-003/BR-002 →
    AC-000-05(f) and FR-008/BR-003 → AC-000-06;
  - `docs/roadmap.md`: DEBT-001 and DEBT-005 marked closed;
  - the NFR-002 bundle baseline (AC-000-13).

**Does not include**
- Playwright / e2e tests and axe: deferred to spec 004 (owner decision). AC-000-09 uses
  Playwright MCP for a one-off comparison only.
- HTTP-level API tests (supertest) and middleware tests: deferred (owner decision, ASM-000-04).
- Coverage thresholds (ASM-011).
- Type-aware linting (CL-23).
- Dependency upgrades (DEBT-007), new features, copy changes, visual changes. New tools are
  pinned to versions compatible with Vite 5.4, React 18.3 and TS 5.6 (CL-10, ASM-000-07).
- Changes to Vercel settings, DNS or the API host.
- Fixing the `sourceIp` / `userAgent` drift (recorded as DEBT-008, CL-24).

## 3. Actors and permissions
- **Contributor** (Hernán or an agent): runs the scripts locally and opens PRs.
- **CI** (GitHub Actions): runs the checks on PRs and on pushes to `main`. Read-only token
  (`contents: read`), no secrets.
- **Owner** (Hernán): approves the gates. Pushes the branch and opens the draft PR (or approves an
  agent doing it). Says yes at G-Merge to the branch-protection change, and provides an admin
  `gh` session before it (OQ-000-01).
- **Protection agent:** an agent session designated by the Coordinator (not the Coordinator
  itself). It applies and verifies branch protection after G-Merge, using Hernán's `gh` session,
  and only after his explicit yes.

## 4. Flows
### 4.1 Main flow (contributor changes code)
1. The contributor edits code on a `feat/…` branch.
2. Locally, they run `format:check`, `lint`, the type check, `test` and `build` for each touched
   package. All of them exit 0.
3. They push and open a PR to `main`.
4. CI runs the `frontend` and `api` jobs: install (`npm ci`) → format check → lint → type check →
   tests with coverage → build, plus the repository guard steps (AC-000-10, AC-000-12,
   AC-000-13). The coverage reports are uploaded as `coverage-frontend` and `coverage-api`.
5. Both jobs pass and the PR shows green checks. The owner may merge.
6. On merge, CI runs again on `main`.

### 4.1b Delivery order for this spec
1. The **first implementation task** captures the visual baseline from `main` (AC-000-09),
   before any refactor or formatting commit.
2. Implementation tasks run, one commit each. The renormalize commit (CL-04) stands alone.
3. After the last implementation task and before validation, the Coordinator asks Hernán to push
   the branch and open a **draft PR**, so CI runs on it (AC-000-07, CL-18).
4. Validation (phase 7), then G-Merge.
5. After merge, with Hernán's explicit yes and an admin `gh` session (OQ-000-01), the protection
   agent applies branch protection and records the `GET` verification in `MEMORY.md`. The spec
   becomes **Implemented** only then.

### 4.2 Alternative flows
- **4.2a Only one package changed:** both jobs still run, so the required checks are always
  reported (path filtering is out of scope).
- **4.2b Formatting drift:** the contributor runs `npm run format --prefix <pkg>` and recommits.
- **4.2c Superseded run:** a newer push to the same ref cancels the older CI run (`concurrency`).

### 4.3 Error flows
- **4.3a Lint, format, type or test failure:** the job fails at that step, the PR check is red,
  and with branch protection on, merging is blocked. The log names the file and the rule.
- **4.3b Build failure:** same as 4.3a, at the build step.
- **4.3c Refactor changes the UI:** the visual comparison (AC-000-09) finds the difference and
  the task goes back to the implementer.
- **4.3d Build artifact tracked again:** the DEBT-005 guard step fails the job and names the
  path.
- **4.3e Admin `gh` session missing at G-Merge:** branch protection waits; the spec stays in
  "In validation" until OQ-000-01 is closed and AC-000-11 is verified.

## 5. Applicable business rules
- **BR-001** (initial language and persistence): tested directly by AC-000-05(e) with the
  BR-001 examples (`"es"` → ES, `"fr"` → EN, nothing → EN, `setLanguage` persists). The EN/ES
  dictionary test (a) protects the language switch (FR-002). Example: a key in `en.ts` that is
  missing in `es.ts`, or an empty string value, fails the test.
- **BR-002** (theme): tested directly by AC-000-05(f) with the BR-002 examples (`"light"` →
  light, nothing → dark, `"blue"` → dark) and toggle persistence (ASM-000-10, resolved).
- **BR-003** (contact field limits, after trim): name 2–80, email ≤ 120 and valid format,
  message 10–1200. Tested at the boundaries by AC-000-06(a). Example: name `"A"` is invalid,
  `"Al"` is valid, `"  A  "` is invalid.
- **BR-006** (profile README as source of truth): no copy changes, so nothing to check.

## 6. Data
No entities, fields or migrations change. Only the repository tracking changes:
- untracked and deleted locally (DEBT-005): `frontend/tsconfig*.tsbuildinfo`,
  `frontend/vite.config.{js,d.ts}`, `frontend/tailwind.config.{js,d.ts}`;
- those paths are added to `.gitignore`;
- `frontend/tsconfig.node.json` no longer emits beside the sources (CL-05);
- line endings are normalized to LF by `.gitattributes` (CL-04).

## 7. Interface
- **No visual or behavior change** to any screen (CL-06). Comparison method and state matrix:
  1. **Baseline:** captured from `main` by the first implementation task: screenshots and the
     console log, with `prefers-reduced-motion: reduce` emulated, preview videos paused, and the
     YouTube iframe and Turnstile blocked or masked.
  2. **Fixed state matrix:** EN/ES × dark/light × 360/1280 px for each section, plus:
     - mobile nav menu open (360);
     - each modal open (`CredentialsModal`, `VideoModal`), including focus placement and close
       with Esc;
     - a focus-visible keyboard pass;
     - hover on a project card (1280) and a tap on a card (360, touch emulation);
     - contact form client-side validation error, and API-unreachable error (no real
       submission);
     - `MotionConfig reducedMotion="user"` still wraps the tree;
     - language and theme persist after reload (BR-001, BR-002).
  3. **Comparison:** Playwright pixel diff with a small tolerance (set in the plan). Where a pixel
     diff is impractical, the reviewer does a side-by-side check and records it in
     `validation.md`.
  4. **Evidence location:** outside git, or in `specs/000-quality-baseline/evidence/` only if the
     total is under ~5 MB.
- No copy is added or changed, so the i18n dictionaries keep the same keys and values (only
  line wrapping may change).

## 8. Integrations and contracts
- **GitHub Actions:** `.github/workflows/ci.yml` (CL-18).
  - Triggers: `pull_request` to `main` and `push` to `main`.
  - Job ids `frontend` and `api`; each job's `name` equals its id, so the check contexts are
    `frontend` and `api`. These become the required status checks.
  - Node version: from a root `.nvmrc` (`22`).
  - Permissions: `contents: read`. No secrets; the frontend builds without `VITE_*` values
    (ASM-000-12).
  - Official actions pinned to major tags (e.g. `actions/checkout@v4`; versions confirmed in the
    plan).
  - `concurrency` group per ref that cancels superseded runs.
  - Coverage artifacts named `coverage-frontend` and `coverage-api`.
  - Repository guard steps: DEBT-005 tracked paths (AC-000-10), harness docs (AC-000-12) and the
    NFR-002 baseline record (AC-000-13). The plan decides whether these are inline steps or one
    small script.
- **GitHub branch protection** on `main` (CL-08), classic protection, applied through
  `PUT /repos/hervid2/Portfolio/branches/main/protection` by the protection agent after G-Merge,
  only with the owner's explicit yes:
  - required status checks `frontend` and `api`, `strict: false`;
  - require a pull request before merging, 0 approvals;
  - `enforce_admins: false` (owner decision; accepted risk ASM-000-08);
  - force pushes and deletions disabled.
  The repository is public (verified 2026-11-26), so protection is available on the free plan.
  Needs an admin `gh` session (OQ-000-01).
- **Contact API contract:** unchanged. API edits are limited to formatting, JSDoc, line wrapping,
  the captcha seam (CL-01) and the logger (CL-03) (CL-22, ASM-000-09). The HTTP responses,
  including `400 {"message":"Captcha validation failed"}`, stay byte-for-byte the same.

## 9. Applicable non-functional requirements
- **NFR-002:** spec 000 records the initial JS and CSS gzip baseline that later specs compare
  against (AC-000-13).
- **NFR-007:** lint, type check, tests and build are green on every PR in CI. Every AC has ≥ 1
  automated test, except the approved exception below.
- **NFR-008:** strict TypeScript, JSDoc (scope as in §2), ≤ 100 chars/line, ≤ 40 lines/function.
  Enforced by ESLint as errors.
- **NFR-009:** the workflow uses no secrets, and no `.env` files are added.

**Approved verification exception (spec 000 only, CL-02, owner decision 2026-11-26).**
AC-000-08, AC-000-09 and AC-000-11 are verified by a **recorded verification** (commands, output
or screenshots, recorded in `validation.md` or, for AC-000-11, in `MEMORY.md`) instead of an
automated test. The exception is one-off: it does not amend NFR-007 and does not carry over to
later specs. Every other AC is automated or proven by the CI run.

## 10. Acceptance criteria
Each AC ends with **Verified by**: the automated test or check, or the named exception (§9).

- **AC-000-01** — Given the frontend package, when `npm run lint --prefix frontend` runs, then it
  exits 0 with 0 errors and 0 warnings, and the config enforces `max-len` 100,
  `max-lines-per-function` 40, the JSDoc scope of §2, `no-console`, `rules-of-hooks` and
  `exhaustive-deps`, with the test-file relaxations of §2.
  **Verified by:** the CI `lint` step (AC-000-07); rule activity is exercised by AC-000-08.
- **AC-000-02** — Given the api package, when `npm run lint --prefix api` runs, then it exits 0
  with 0 errors and 0 warnings under the same code-limit, JSDoc and `no-console` rules, where
  `no-console` is off only in `src/scripts/**`, and
  `src/infrastructure/logging/logger.ts` is the only file with an `eslint-disable` for
  `no-console`.
  **Verified by:** the CI `lint` step (AC-000-07); a guard (plan decides: a lint rule such as
  `eslint-comments` or a `grep` step) fails if another file disables `no-console`.
- **AC-000-03** — Given either package and the root `.gitattributes`, when
  `npm run format:check --prefix <pkg>` runs on Windows or Linux, then it exits 0 with the
  Prettier options of §2 (`printWidth: 100`, `endOfLine: "lf"`).
  **Verified by:** the CI `format:check` step (AC-000-07), plus a local run on Hernán's Windows
  machine recorded in `validation.md` as supporting evidence.
- **AC-000-04** — Given the repository, when `npm run typecheck --prefix frontend` (`tsc -b`)
  and `npm run typecheck --prefix api` (`tsc -p tsconfig.json --noEmit`) run, then both exit 0,
  and the API type check includes the test files.
  **Verified by:** the CI type-check step (AC-000-07).
- **AC-000-05** — Given the frontend package, when `npm test --prefix frontend` runs, then
  Vitest (jsdom + Testing Library) passes at least these tests, with expectations derived from
  the data, not hardcoded (CL-15, CL-17), and a coverage report (text + lcov) is produced with no
  threshold:
  - (a) `en.ts` and `es.ts` have deep-equal key sets and no empty string values;
  - (b) `useProjectFilter` (via `renderHook`): `categories` equals `["all", …unique categories in
    first-appearance order]`; `"all"` returns every project in data order; each category returns
    only its projects; the union over categories equals all projects;
  - (c) `buildCardLayoutId` returns `project-card-<id>`, is deterministic, and is unique across
    every id in `projects`;
  - (d) `ProjectFilterBar` renders one button per category; the "all" chip shows `allLabel`;
    `aria-pressed` is true only on the active chip; a click calls `onSelect` with the category
    key;
  - (e) `LanguageProvider` with `localStorage` `"es"` renders ES, `"fr"` renders EN, nothing
    renders EN, and `setLanguage` persists the value (BR-001);
  - (f) `useThemeMode` (via `renderHook`) with `localStorage` `"light"` returns light and
    sets `theme-light` on `<html>`; nothing and `"blue"` return dark; toggling persists the
    new value (BR-002, ASM-000-10).
  **Verified by:** these Vitest tests, named with their AC id (e.g. `it("AC-000-05b …")`).
- **AC-000-06** — Given the api package, when `npm test --prefix api` runs, then Vitest passes
  these unit tests, and a coverage report is produced with no threshold:
  - (a) `contactSchema` at the BR-003 boundaries: name `"A"` invalid, `"Al"` valid, `"  A  "`
    invalid; email with a bad format invalid, 121 chars invalid; message 9 chars invalid, 10 and
    1200 valid, 1201 invalid; missing `name` invalid; missing `captchaToken` valid and
    defaulted to `""`;
  - (b) `SubmitContactMessageUseCase` with fakes or spies (`vi.fn`, `vi.spyOn`) on the in-memory
    repository, the mail service and the captcha verifier: given a verifier that returns `true`,
    the message is saved and then mailed (`save` before `sendContactNotification`); given a fake
    verifier that returns `false`, the use case reports "captcha rejected", and nothing is saved
    or mailed.
  **Verified by:** these Vitest tests, named with their AC id.
- **AC-000-07** — Given this feature's draft PR to `main` (and later a push to `main`), when CI
  runs, then the `frontend` and `api` jobs (check contexts with those exact names) each run
  install → format check → lint → type check → test with coverage → build plus the guard steps,
  both pass, the artifacts `coverage-frontend` and `coverage-api` are uploaded, and the workflow
  has `contents: read`, no secrets and a `concurrency` group.
  **Verified by:** the CI run itself on the draft PR (link recorded in `validation.md`).
- **AC-000-08** — Given a throwaway change in each package that adds, one at a time, a lint error,
  a line over 100 chars, a formatting error, a type error and a failing test, when the same
  commands as CI run, then the matching step exits non-zero each time. The change is never
  committed.
  **Verified by:** recorded verification (approved exception, §9): commands and exit codes in
  `validation.md`.
- **AC-000-09** — Given the baseline captured from `main` before the first refactor commit, when
  the branch build is rendered across the full state matrix of §7, then the pixel diff is within
  the plan's tolerance (or the reviewer's side-by-side check finds no difference), behavior
  matches, and there are no new console errors.
  **Verified by:** recorded verification (approved exception, §9): diff results or side-by-side
  notes in `validation.md`, evidence stored per §7.4.
- **AC-000-10** — Given the repository, when `git ls-files` runs, then none of the DEBT-005
  artifacts are tracked and they are listed in `.gitignore`; and when
  `npm run build --prefix frontend` then runs, it succeeds, `git status` stays clean, and no
  `frontend/vite.config.js` or `frontend/tailwind.config.js` exists.
  **Verified by:** the CI DEBT-005 guard step, run after the frontend build.
- **AC-000-11** — Given the merged feature, an admin `gh` session (OQ-000-01) and the owner's
  explicit yes after G-Merge, when the protection agent applies branch protection, then
  `GET /repos/hervid2/Portfolio/branches/main/protection` shows required status checks
  `frontend` and `api` with `strict: false`, a required pull request with 0 approvals,
  `enforce_admins` false, and force pushes and deletions disabled.
  **Verified by:** recorded verification (approved exception, §9): the `GET` response summary in
  `MEMORY.md`. The spec becomes "Implemented" once it is recorded.
- **AC-000-12** — Given the harness, when a contributor reads `AGENTS.md`, then the test, lint
  and format rows have no † mark, a `format` / `format:check` row exists, the e2e row reads
  "defined in spec 004 (Playwright)", the stale "Until spec 000 lands" and "`testing-conventions`
  arrives with spec 000" lines are updated, and `.harness/skills/testing-conventions/` and
  `.claude/skills/testing-conventions/` exist. The skill covers file location and naming, Vitest
  and Testing Library patterns, jsdom shims, the AC-id convention in test names, fakes vs mocks,
  and the coverage commands.
  **Verified by:** a CI guard step or small script (the plan decides) that checks the `AGENTS.md`
  rows and both skill folders; the skill's content is checked in review.
- **AC-000-13** — Given the refactored branch, when `npm run build --prefix frontend` runs, then
  it reports the initial JS and CSS gzip sizes, and these are recorded as the NFR-002 baseline
  (in `docs/traceability.md` or `docs/architecture/overview.md`, the plan decides), with the
  `main` size before spec 000 noted for reference.
  **Verified by:** a CI guard step or script that fails if the baseline record is missing; the
  numbers are compared with the CI build log in review (ASM-000-11).

## 11. Assumptions and open questions
| ID | Type | Statement | Owner | Status |
|---|---|---|---|---|
| ASM-000-01 | ASM | `max-len` ignores URLs everywhere. Long prose strings in `src/i18n/**` and `src/data/**` are exempt too (`ignoreStrings`), because wrapping copy hurts readability. Elsewhere, long class lists are split by concatenation; `@apply` only for patterns repeated ≥ 3 times (CL-12). | agent | Proposed |
| ASM-000-02 | ASM | `max-lines-per-function` counts with `skipBlankLines` and `skipComments`. | agent | Proposed |
| ASM-000-03 | ASM | Frontend test targets as in AC-000-05, strengthened by CL-15 and CL-17. | Hernán | Accepted 2026-11-26 |
| ASM-000-04 | ASM | The API gets unit tests only. Middlewares (validation, error handler, rate limit) stay untested until a later spec. Risk: an HTTP-layer regression would go unnoticed. | Hernán | Accepted 2026-11-26 |
| ASM-000-05 | ASM | Playwright / e2e / axe are deferred to spec 004. AC-000-09 is checked once with Playwright MCP under the §7 method. | Hernán | Accepted 2026-11-26 |
| ASM-000-06 | ASM | DEBT-005 cleanup is in scope, including the `tsconfig.node.json` emit fix (CL-05). | Hernán | Accepted 2026-11-26 |
| ASM-000-07 | ASM | The new dev dependencies (ESLint stack, Prettier, Vitest stack, Testing Library, jsdom, optionally `eslint-plugin-react`) are listed and approved in the plan (G-Plan), pinned to the newest versions compatible with Vite 5.4, React 18.3 and TS 5.6, with a compatibility source per tool (CL-10). | agent | Proposed |
| ASM-000-08 | ASM | `enforce_admins: false`: branch protection binds agents and collaborators, not the admin. Hernán can still push to or merge into `main` without checks. Accepted risk (CL-08). | Hernán | Accepted 2026-11-26 |
| ASM-000-09 | ASM | API edits are limited per §8 (CL-22). Smoke check: `npm run build --prefix api` (in CI) plus a local `npm run test:e2e --prefix api` if Hernán has MySQL locally; otherwise an accepted risk recorded in `validation.md`. | Hernán | Accepted 2026-11-26 |
| ASM-000-10 | ASM | A BR-002 theme-persistence test is added as AC-000-05(f) only if the plan sizes it at ≤ 1 task; otherwise it is deferred and the plan says so (CL-17). Resolved: included as AC-000-05(f), because `useThemeMode` is extracted by the `Navbar` split anyway (plan §8). | Hernán | Resolved 2026-11-26 (G-Plan) |
| ASM-000-11 | ASM | The AC-000-13 automated check proves the baseline is recorded, not that the numbers are right; the numbers are checked against the CI build log in review. | agent | Proposed |
| ASM-000-12 | ASM | `vite build` does not fail when `VITE_API_BASE_URL` / `VITE_TURNSTILE_SITE_KEY` are missing, so CI needs no secrets. The planner confirms (Art. 14). Confirmed by code reading: every `import.meta.env.VITE_*` read uses optional chaining with a fallback (plan §8); the draft-PR CI run is the final proof. | Hernán | Confirmed 2026-11-26 (G-Plan) |
| ASM-000-13 | ASM | The protection agent uses Hernán's own `gh` session for one call after his explicit yes; no admin token is stored in the repo or in CI (CL-08, NFR-009). | Hernán | Accepted 2026-11-26 |
| ASM-000-14 | ASM | The API host builds with `npm run build` or a bare `tsc`. Both still produce `dist/server.js` (plan R-4). | agent | Accepted 2026-11-26 (G-Plan) |
| ASM-000-15 | ASM | AC-000-09's "`MotionConfig` still wraps the tree" is checked by behavior (under reduced motion, no regression against the `main` baseline list of elements that keep a transform; F-1 / DEBT-010), plus a code check that `App.tsx` still renders `<MotionConfig reducedMotion="user">` around the tree. | agent | Accepted 2026-11-26 (G-Plan) |
| OQ-000-01 | OQ | The `gh` token is invalid (MEMORY.md). AC-000-11 needs a session with admin rights on `hervid2/Portfolio`: Hernán runs `gh auth login` before the protection step (after G-Merge). Until then the spec cannot reach "Implemented". | Hernán | Resolved 2026-11-26 (admin `gh` session; protection applied, AC-000-11 verified) |

## 12. Change log
| Version | Date | Change | Approved by |
|---|---|---|---|
| 0.1 | 2026-11-26 | Initial draft from the owner interview (2 rounds) | — |
| 0.2 | 2026-11-26 | Applied the owner's answers to CL-01…CL-24: captcha seam in the use case; named recorded-verification exception (AC-000-08/09/11) instead of rewording NFR-007; logger wrapper; LF policy; tsconfig emit fix and DEBT-005 CI guard; visual comparison method and delivery order; JSDoc scope; branch protection by an agent with `enforce_admins: false`; NFR-002 baseline (new AC-000-13); version pinning; stronger test oracles; NFR-002/NFR-009 and FR-008 in the header; DEBT-008 recorded | Answers: Hernán 2026-11-26 · G-Spec pending |
| 1.0 | 2026-11-26 | Approved at G-Spec (no changes to v0.2 content) | Hernán (G-Spec) |
| 1.1 | 2026-11-26 | Minor, from plan §8: added AC-000-05(f) (BR-002 theme test); ASM-000-10 resolved (included); ASM-000-12 confirmed; added ASM-000-14 and ASM-000-15; status → Planned | Hernán (G-Plan) |
| 1.2 | 2026-11-26 | ASM-000-15 reduced-motion check reads "no regression against the `main` baseline" (T-01 finding F-1, DEBT-010) | Hernán (2026-11-26) |
| 1.3 | 2026-11-26 | AC-000-04 names the `typecheck` scripts (same `tsc` commands); the root `npx tsc` form fails because TypeScript is not installed at the root (found in T-03, fixed in AGENTS.md at T-34) | Coordinator (clarification, no scope change) |
| 1.4 | 2026-11-26 | Status → Implemented. Validation cycle 1 APPROVED (3 focuses). G-Merge: retroactive approval by Hernán 2026-11-26 (PR #4 was merged before phase 7, C-01). AC-000-11 verified (branch protection on `main`; OQ-000-01 resolved). Closeout doc fixes C-03, C-04, C-05, C-07, C-08 | Hernán (G-Merge, retroactive) |
