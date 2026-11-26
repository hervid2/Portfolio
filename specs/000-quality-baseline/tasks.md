# Tasks — Spec 000
> [P] = parallelizable (does not share files with other pending [P] tasks).

Source: `specs/000-quality-baseline/plan.md` (Approved) · Spec: `spec.md` v1.1 · Written: 2026-11-26.
> **G-Plan approved by Hernán 2026-11-26.** D-1: yes, with the characterization test, so T-20
> runs and T-21 depends on T-20.

**Conventions for every task**
- One task = one commit: `<type>(<scope>): <description> [T-NN]` (Conventional Commits).
- All `Verify` commands run from the repository root in Git Bash. `(cd <pkg> && …)` is used where a
  tool needs the package as its working directory.
- From T-06 on, every task that touches a package also passes `npm run format:check --prefix <pkg>`.
  From T-09/T-10 on, it also passes `npx tsc -b frontend` / `npx tsc -p api --noEmit` and the
  package's `npm test`. These are implied and not repeated in each `Verify`.
- Until T-22 (api) and T-32 (frontend), the full `npm run lint` is expected to fail on the known
  baseline violations (plan §1.2). Fix tasks therefore lint only the files they touch, with
  `--max-warnings 0`.
- [P] tasks may run in any order once their dependencies are done; the dependency chain keeps
  tasks that share a file (for example `package.json`) out of the same parallel set.
- A task that finds an unlisted violation of the same kind fixes it in place; anything else is a
  stop and report (plan R-14).
- **Path exceptions** approved at G-Plan for spec 000 only: see plan §2. The task that uses each
  one is named in its `Files` field.

## Phase A — Baseline and repository hygiene

- [x] **T-01** — Capture the visual baseline and the `main` bundle size, before any other
  implementation commit (spec §4.1b). Create a worktree of `main` at
  `git merge-base main HEAD` in `../portfolio-main-baseline`; there, `npm ci && npm run build`
  (no `.env` in the worktree, so no `VITE_*` values, as in CI) and
  `npx vite preview --port 4173 --strictPort`. With the Playwright MCP, run the plan §6 procedure
  (emulation steps 3, state matrix step 4) and save the shots and text records to
  `.evidence/000-quality-baseline/baseline/`. Write `visual-baseline.md` with: the baseline SHA,
  the state list, the exact capture script (so validation reuses it unchanged for the 4174 run
  and the diff), the tolerance (≤ 0.1 % of pixels, channel delta > 25/255), the console log
  summary and the `main` initial JS / CSS gzip sizes per the plan §6 NFR-002 definition. Add
  `.evidence/` to `.gitignore`. Keep the worktree until validation (removed in P-04).
  - AC: AC-000-09 (baseline half), AC-000-13 (`main` reference size)
  - Files: `specs/000-quality-baseline/visual-baseline.md`, `.gitignore` (path exceptions);
    Playwright MCP (path exception, this task only)
  - Verify: `test -z "$(git log --oneline main..HEAD -- frontend api)" &&
    test "$(ls .evidence/000-quality-baseline/baseline/*.png | wc -l)" -ge 32 &&
    grep -q "$(git merge-base main HEAD)" specs/000-quality-baseline/visual-baseline.md &&
    grep -Eq '[0-9.]+ kB' specs/000-quality-baseline/visual-baseline.md &&
    git check-ignore -q .evidence/x`
  - Depends on: — (G-Plan approved)
  - Evidence: 4a6ac70 · Verify → exit 0 (40 PNGs; main ed051a4; JS 96.46 kB / CSS 4.24 kB gzip)

- [x] **T-02** — Add the root `.gitattributes` (`* text=auto eol=lf`; `binary` for
  `*.png *.jpg *.jpeg *.gif *.webp *.ico *.mp4 *.webm *.woff *.woff2 *.ttf *.otf *.pdf`; SVG stays
  text) and run `git add --renormalize .`. The commit contains only this (plan §1.9, R-2).
  - AC: AC-000-03 (line-ending policy)
  - Files: `.gitattributes` (path exception) + the files the renormalize re-stages (EOL only)
    + root `.gitignore` (add `.playwright-mcp/`, the Playwright MCP output folder)
  - Scope addition: `.playwright-mcp/` in the root `.gitignore`, approved by Hernán 2026-11-26
    (T-01 follow-up).
  - Verify: `test -z "$(git ls-files --eol | grep 'i/crlf')" &&
    test -z "$(git diff HEAD~1 HEAD --ignore-cr-at-eol --name-only -- . ':!.gitattributes')"`
  - Depends on: T-01
  - Evidence: d39ae6a · Verify part 1 → OK; part 2 lists only the approved `.gitignore` addition
    (passes with `':!.gitignore'` added); renormalize re-staged 0 files (index was already LF)

- [x] **T-03** — DEBT-005: `git rm` the six artifacts
  (`frontend/tsconfig.node.tsbuildinfo`, `frontend/tsconfig.tsbuildinfo`,
  `frontend/vite.config.{js,d.ts}`, `frontend/tailwind.config.{js,d.ts}`); add `*.tsbuildinfo`
  and the four generated config paths to `.gitignore`; in `frontend/tsconfig.node.json` add
  `emitDeclarationOnly`, `outDir`, `tsBuildInfoFile` under `./node_modules/.tmp/` and
  `skipLibCheck` (plan §1.5); in `frontend/tsconfig.json` add
  `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"`. (`vitest.config.ts` joins
  the `include` list in T-09, when the file exists.)
  - AC: AC-000-10, AC-000-04
  - Files: the six artifacts (delete), `.gitignore` (path exception),
    `frontend/tsconfig.node.json`, `frontend/tsconfig.json`
  - Verify: `npx tsc -b frontend && npm run build --prefix frontend &&
    test -z "$(git status --porcelain)" &&
    test ! -e frontend/vite.config.js && test ! -e frontend/tailwind.config.js &&
    test -z "$(git ls-files frontend | grep -E 'tsbuildinfo$|(vite|tailwind)\.config\.(js|d\.ts)$')"`
  - Depends on: T-02
  - Evidence: a402b51 · Verify → exit 0 (tsc via `frontend/node_modules/.bin/tsc`; emit only in
    `frontend/node_modules/.tmp/`; bundle JS 96.46 kB / CSS 4.24 kB gzip, same as `main`)

## Phase B — Prettier

- [x] **T-04** — Frontend Prettier setup: `npm install -D prettier@^3.10.1 --prefix frontend`;
  create `frontend/.prettierrc.json` (the 5 options of spec §2) and `frontend/.prettierignore`
  (`dist`, `coverage`, `package-lock.json`, `*.tsbuildinfo`, generated configs); add the `format`
  and `format:check` scripts (plan §1.3). No file is reformatted in this commit.
  - AC: AC-000-03
  - Files: `frontend/package.json`, `frontend/package-lock.json`, `frontend/.prettierrc.json`,
    `frontend/.prettierignore`
  - Verify: `(cd frontend && npx prettier --version | grep -q '^3\.') &&
    (npm run format:check --prefix frontend; test $? -eq 1)` — exit 1 is expected here; record
    the count of listed files in Evidence (the residue T-06 fixes).
  - Depends on: T-03
  - Evidence: 57af1fd · Verify → prettier 3.10.1, `format:check` exit 1 with 21 files listed
    (plan measured 22; all under `src/`); build OK, bundle JS 96.46 kB / CSS 4.24 kB gzip

- [x] **T-05** — API Prettier setup: same as T-04 for `api/`, with `api/.prettierrc.json`
  byte-identical to the frontend copy. The plan measured `api/` as already conformant; if
  `format:check` still lists files, run `npm run format --prefix api` in this same commit (API
  formatting only, no other edit).
  - AC: AC-000-03
  - Files: `api/package.json`, `api/package-lock.json`, `api/.prettierrc.json`,
    `api/.prettierignore` (+ API files only if reformatted)
  - Verify: `npm run format:check --prefix api && cmp frontend/.prettierrc.json api/.prettierrc.json`
  - Depends on: T-04
  - Evidence: cd2f150 · Verify → prettier 3.10.1, `format:check` exit 0 (no reformat needed),
    `cmp` identical; `tsc --noEmit` and `npm run build` in `api/` OK

- [x] **T-06** — Pure formatting commit for the frontend: `npm run format --prefix frontend`.
  No manual edit (plan R-2: reviewed with `git diff -w`).
  - AC: AC-000-03
  - Files: in-scope files under `frontend/` (format only)
  - Verify: `npm run format:check --prefix frontend && npm run build --prefix frontend &&
    test -z "$(git diff HEAD~1 HEAD --name-only -- . ':!frontend')"`
  - Depends on: T-04
  - Evidence: accd0d0 · Verify → `format:check` exit 0, build OK (JS 96.46 kB / CSS 4.24 kB gzip,
    unchanged), scope test empty; 9 files committed (the other 12 of 21 differed only in CRLF in
    the working tree), `git diff -w` = wrapping only

## Phase C — ESLint

- [x] **T-07** [P] — Frontend ESLint: install `eslint@^10.15.0`, `@eslint/js@^10.0.1`,
  `typescript-eslint@^8.74.0`, `eslint-plugin-react-hooks@^7.1.1`, `eslint-plugin-jsdoc@^63.3.3`,
  `eslint-config-prettier@^10.1.8` (dev); create `frontend/eslint.config.js` exactly per plan
  §1.2 (preset order, `eslint-config-prettier` before the rules block, the rules table, the
  `src/i18n/**` and `src/data/**` `max-len` options, test relaxations, `*.cjs` block, ignores,
  `reportUnusedDisableDirectives`); set `lint` to `eslint . --max-warnings 0`.
  - AC: AC-000-01 (config)
  - Files: `frontend/package.json`, `frontend/package-lock.json`, `frontend/eslint.config.js`
  - Verify: `(cd frontend && npx eslint eslint.config.js postcss.config.cjs --max-warnings 0) &&
    npm run lint --prefix frontend > .evidence/lint-fe.txt 2>&1; test $? -eq 1 &&
    test -z "$(grep -E '^ +[0-9]+:[0-9]+' .evidence/lint-fe.txt | grep -vE
    '(max-len|max-lines-per-function|jsdoc/require-(jsdoc|param|returns)|react-hooks/exhaustive-deps|@typescript-eslint/no-unused-vars)$')"
    && ! grep -qE 'dist/|coverage/|\.config\.js' .evidence/lint-fe.txt` — record the per-rule
    histogram (`grep -oE '[a-z@/-]+$' | sort | uniq -c`) in Evidence.
  - Depends on: T-06
  - Evidence: e0dee46 · Verify → exit 0 (lint exit 1, 43 problems, only allowed rules):
    27 max-len, 10 max-lines-per-function, 4 jsdoc/require-jsdoc, 1 exhaustive-deps,
    1 no-unused-vars; format:check and build OK (JS 96.46 kB / CSS 4.24 kB gzip)

- [x] **T-08** [P] — API ESLint: install the same packages minus `eslint-plugin-react-hooks`;
  create `api/eslint.config.js` (plan §1.2, with `no-console` off in `src/scripts/**`); set `lint`
  to `eslint . --max-warnings 0`.
  - AC: AC-000-02 (config)
  - Files: `api/package.json`, `api/package-lock.json`, `api/eslint.config.js`
  - Verify: `(cd api && npx eslint eslint.config.js --max-warnings 0) &&
    npm run lint --prefix api > .evidence/lint-api.txt 2>&1; test $? -eq 1 &&
    test -z "$(grep -E '^ +[0-9]+:[0-9]+' .evidence/lint-api.txt | grep -vE
    '(max-len|max-lines-per-function|jsdoc/require-(jsdoc|param|returns)|no-console)$')" &&
    ! grep -q 'src/scripts/.*no-console' .evidence/lint-api.txt` — record the histogram in Evidence.
  - Depends on: T-05
  - Evidence: b715ce3 · Verify → exit 0 (lint exit 1, 27 problems, only allowed rules):
    14 jsdoc/require-jsdoc, 4 max-len, 3 max-lines-per-function, 6 no-console (server.ts ×5,
    errorHandler.ts ×1; none in src/scripts); format:check, `tsc --noEmit` and build OK

## Phase D — Vitest

- [x] **T-09** [P] — Frontend Vitest: install `vitest@^3.2.7`, `@vitest/coverage-v8@^3.2.7`,
  `jsdom@^29.1.1`, `@testing-library/react@^16.3.3`, `@testing-library/dom@^10.4.2`,
  `@testing-library/jest-dom@^7.0.1` (dev); create `frontend/vitest.config.ts` and
  `frontend/src/test/setup.ts` (plan §1.4); add `vitest.config.ts` to the `include` of
  `frontend/tsconfig.node.json` (annotate with `ViteUserConfig` if TS2742 appears, R-8; stop if
  that is not enough); add scripts `test` (`vitest run --coverage`), `test:watch`, `typecheck`
  (`tsc -b`). Confirm `npm ls vite --prefix frontend` shows a single Vite 5.4.x.
  - AC: AC-000-04, AC-000-05 (runner + coverage report)
  - Files: `frontend/package.json`, `frontend/package-lock.json`, `frontend/vitest.config.ts`,
    `frontend/src/test/setup.ts`, `frontend/tsconfig.node.json`
  - Verify: `npm test --prefix frontend -- --passWithNoTests && npx tsc -b frontend &&
    npm run build --prefix frontend && test -z "$(git status --porcelain)" &&
    test "$(npm ls vite --prefix frontend --all --parseable | sort -u | wc -l)" -eq 1 &&
    (cd frontend && npx eslint vitest.config.ts src/test/setup.ts --max-warnings 0)`
  - Depends on: T-07
  - Evidence: 71de16d · Verify → exit 0 (tsc via `frontend/node_modules/.bin/tsc`; no TS2742, no
    `ViteUserConfig` needed; single `vite@5.4.21`; coverage text report printed; bundle unchanged)

- [ ] **T-10** [P] — API Vitest: install `vitest@^3.2.7`, `@vitest/coverage-v8@^3.2.7` (dev);
  create `api/vitest.config.ts` (node environment, coverage excludes `src/scripts/**` and
  `src/server.ts`) and `api/tsconfig.build.json` (`extends ./tsconfig.json`, excludes
  `src/**/*.test.ts`); change `build` to `tsc -p tsconfig.build.json`; add `test`
  (`vitest run --coverage`), `test:watch`, `typecheck` (`tsc -p tsconfig.json --noEmit`).
  `api/tsconfig.json` stays unchanged (plan §1.5).
  - AC: AC-000-04, AC-000-06 (runner + coverage report)
  - Files: `api/package.json`, `api/package-lock.json`, `api/vitest.config.ts`,
    `api/tsconfig.build.json`
  - Verify: `npm test --prefix api -- --passWithNoTests && npx tsc -p api --noEmit &&
    npm run build --prefix api && test -f api/dist/server.js &&
    test -z "$(find api/dist -name '*.test.js')" &&
    (cd api && npx eslint vitest.config.ts --max-warnings 0)`
  - Depends on: T-08

## Phase E — Frontend regression net (tests on code the refactors do not split)
Written before the Phase G refactors so they guard them (plan R-1). Test names start with the AC
id; expectations are derived from the data (CL-15, CL-17).

- [ ] **T-11** [P] — `dictionaries.test.ts`: recursive deep key-set equality of `enDictionary` /
  `esDictionary` and no empty string at any depth.
  - AC: AC-000-05(a)
  - Files: `frontend/src/i18n/dictionaries.test.ts`
  - Verify: `npm test --prefix frontend -- src/i18n/dictionaries.test.ts &&
    (cd frontend && npx eslint src/i18n/dictionaries.test.ts --max-warnings 0)`
  - Depends on: T-09

- [ ] **T-12** [P] — `useProjectFilter.test.ts` with `renderHook`: `categories` =
  `["all", ...new Set(projects.map(p => p.category))]`; `"all"` → `projects` in order; each
  category → only its projects; the union equals all projects.
  - AC: AC-000-05(b)
  - Files: `frontend/src/hooks/useProjectFilter.test.ts`
  - Verify: `npm test --prefix frontend -- src/hooks/useProjectFilter.test.ts &&
    (cd frontend && npx eslint src/hooks/useProjectFilter.test.ts --max-warnings 0)`
  - Depends on: T-09

- [ ] **T-13** [P] — `projectCardIdentity.test.ts`: `buildCardLayoutId` returns
  `project-card-<id>`, is deterministic, and `new Set(ids.map(build)).size === projects.length`.
  - AC: AC-000-05(c)
  - Files: `frontend/src/utils/projectCardIdentity.test.ts`
  - Verify: `npm test --prefix frontend -- src/utils/projectCardIdentity.test.ts &&
    (cd frontend && npx eslint src/utils/projectCardIdentity.test.ts --max-warnings 0)`
  - Depends on: T-09

- [ ] **T-14** [P] — `ProjectFilterBar.test.tsx`: renders `categories.length` buttons; the "all"
  chip text equals `allLabel`; `aria-pressed="true"` only on the active chip;
  `fireEvent.click` calls `onSelect(key)`.
  - AC: AC-000-05(d)
  - Files: `frontend/src/components/ui/ProjectFilterBar.test.tsx`
  - Verify: `npm test --prefix frontend -- src/components/ui/ProjectFilterBar.test.tsx &&
    (cd frontend && npx eslint src/components/ui/ProjectFilterBar.test.tsx --max-warnings 0)`
  - Depends on: T-09

- [ ] **T-15** [P] — `LanguageContext.test.tsx`: `LanguageProvider` + probe consumer; stored
  `"es"` → `esDictionary.nav.home`; `"fr"` and nothing → `enDictionary.nav.home`;
  `setLanguage("es")` → `localStorage` holds `"es"` (BR-001).
  - AC: AC-000-05(e)
  - Files: `frontend/src/context/LanguageContext.test.tsx`
  - Verify: `npm test --prefix frontend -- src/context/LanguageContext.test.tsx &&
    (cd frontend && npx eslint src/context/LanguageContext.test.tsx --max-warnings 0)`
  - Depends on: T-09

## Phase F — API

- [ ] **T-16** — API logger (CL-03): create `api/src/infrastructure/logging/logger.ts` (plan §1.6,
  one documented `eslint-disable-next-line no-console` per method); `server.ts` and
  `errorHandler.ts` call `logger.*` with identical arguments and `[API] …` prefixes; JSDoc on
  `bootstrap` and `shutdown`; wrap the long line in `server.ts`.
  - AC: AC-000-02
  - Files: `api/src/infrastructure/logging/logger.ts`, `api/src/server.ts`,
    `api/src/interfaces/http/middlewares/errorHandler.ts`
  - Verify: `(cd api && npx eslint src/infrastructure/logging/logger.ts src/server.ts
    src/interfaces/http/middlewares/errorHandler.ts --max-warnings 0) &&
    test -z "$(grep -rn 'console\.' api/src --include='*.ts' | grep -v '^api/src/scripts/' |
    grep -v '^api/src/infrastructure/logging/logger.ts')"`
  - Depends on: T-10

- [ ] **T-17** — Captcha seam (CL-01), test first: write
  `SubmitContactMessageUseCase.test.ts` (plan §6 AC-000-06(b): spies on
  `InMemoryContactRepository.save` and `NoopMailService.sendContactNotification`, fake verifier,
  `invocationCallOrder`, `vi.setSystemTime` for `submittedAt`) and run it red; record the failing
  output in Evidence. Then add `SubmitContactMessageCommand` / `SubmitContactMessageResult` to
  `api/src/types/contact.ts`, inject `CaptchaVerifier` as the use case's third constructor
  argument (steps 1–5 of plan §1.6), and change the controller to always inject the verifier it
  builds, drop its own captcha branch, map `captcha-rejected` to the unchanged
  `400 {"message":"Captcha validation failed"}`, and wrap its imports. One commit (test + seam).
  - AC: AC-000-06(b)
  - Files: `api/src/application/use-cases/SubmitContactMessageUseCase.test.ts`,
    `api/src/application/use-cases/SubmitContactMessageUseCase.ts`, `api/src/types/contact.ts`,
    `api/src/interfaces/http/controllers/contactController.ts`
  - Verify: `npm test --prefix api -- src/application/use-cases/SubmitContactMessageUseCase.test.ts
    && npx tsc -p api --noEmit && npm run build --prefix api &&
    grep -q '"Captcha validation failed"' api/src/interfaces/http/controllers/contactController.ts
    && (cd api && npx eslint src/application/use-cases src/types/contact.ts
    src/interfaces/http/controllers/contactController.ts --max-warnings 0)`
  - Depends on: T-16

- [ ] **T-18** [P] — `contactSchema.test.ts`: the 11 BR-003 boundary cases of AC-000-06(a), with
  lengths built from `"a".repeat(n)`; missing `captchaToken` parses to `""`.
  - AC: AC-000-06(a)
  - Files: `api/src/interfaces/http/validators/contactSchema.test.ts`
  - Verify: `npm test --prefix api -- src/interfaces/http/validators/contactSchema.test.ts &&
    (cd api && npx eslint src/interfaces/http/validators/contactSchema.test.ts --max-warnings 0)`
  - Depends on: T-10

- [ ] **T-19** — API JSDoc and wrapping: JSDoc on class methods, helpers and the two
  constructors with logic (`NodemailerMailService`, `ResendMailService`); wrap lines over 100.
  No logic change. Leaves only the three D-1 function-length violations.
  - AC: AC-000-02
  - Files: `api/src/infrastructure/{captcha,email,repositories}/*.ts`, `api/src/config/env.ts`
    (JSDoc only), plus any other API file the lint lists for `max-len` / `jsdoc/*` (same-kind,
    R-14)
  - Verify: `npm run lint --prefix api > .evidence/lint-api.txt 2>&1;
    test "$(grep -cE '^ +[0-9]+:[0-9]+' .evidence/lint-api.txt)" -eq 3 &&
    test "$(grep -c 'max-lines-per-function' .evidence/lint-api.txt)" -eq 3 &&
    npm run build --prefix api`
  - Depends on: T-17, T-18

- [ ] **T-20** — *(D-1, confirmed at G-Plan 2026-11-26)* `env.test.ts`, a
  characterization test of `getEnvConfig` before the split: `vi.stubEnv` on every key it reads;
  defaults; fail-fast errors (missing `DATABASE_URL`, `PORT=0`, mail on without `SMTP_HOST`,
  captcha on without `TURNSTILE_SECRET_KEY`); the full parsed output.
  - AC: — (supports AC-000-02; plan §1.6 D-1, R-5)
  - Files: `api/src/config/env.test.ts`
  - Verify: `npm test --prefix api -- src/config/env.test.ts &&
    (cd api && npx eslint src/config/env.test.ts --max-warnings 0)`
  - Depends on: T-19

- [ ] **T-21** — *(D-1)* Split `getEnvConfig` (`config/env.ts`) into helpers of ≤ 40 lines with
  identical behavior and output. If D-1 was approved without the test, T-20 is skipped and this
  task depends on T-19 only.
  - AC: AC-000-02
  - Files: `api/src/config/env.ts`
  - Verify: `npm test --prefix api && (cd api && npx eslint src/config/env.ts --max-warnings 0) &&
    npm run build --prefix api`
  - Depends on: T-20 (or T-19)

- [ ] **T-22** — *(D-1)* Split `run` in `scripts/persistenceSmokeTest.ts` and
  `scripts/contactFormE2eTest.ts` into functions of ≤ 40 lines; same steps, order and console
  output. API lint reaches 0.
  - AC: AC-000-02
  - Files: `api/src/scripts/persistenceSmokeTest.ts`, `api/src/scripts/contactFormE2eTest.ts`
  - Verify: `npm run lint --prefix api && npx tsc -p api --noEmit && npm test --prefix api &&
    npm run build --prefix api`
  - Depends on: T-21

## Phase G — Frontend refactor (no visual or behavior change, plan §1.7)
Each split moves function boundaries only: same DOM, class strings (moved verbatim, split by
concatenation), Motion props, ARIA, handlers and effect timing. New subcomponents go in their
parent's folder as `<Parent><Part>.tsx`, one component per file, with JSDoc. Every task runs the
whole test suite (Phase E net) and the build.

- [ ] **T-23** [P] — Split `Navbar` (145 lines): `ThemeMode` to `types/theme.ts`; `useThemeMode`
  hook (BR-002 logic unchanged); `NavbarSectionLinks` and `NavbarMobileMenu` map a
  `NAV_SECTION_IDS` list (same order and classes); `NavbarControls`.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/layout/{Navbar,NavbarSectionLinks,NavbarMobileMenu,NavbarControls}.tsx`,
    `frontend/src/hooks/useThemeMode.ts`, `frontend/src/types/theme.ts`
  - Verify: `(cd frontend && npx eslint src/components/layout src/hooks/useThemeMode.ts
    src/types/theme.ts --max-warnings 0) && npm test --prefix frontend &&
    npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-24** — `useThemeMode.test.ts` with `renderHook`: stored `"light"` → light and
  `theme-light` on `<html>`; nothing and `"blue"` → dark; toggle persists (ASM-000-10 resolved as
  included).
  - AC: AC-000-05(f)
  - Files: `frontend/src/hooks/useThemeMode.test.ts`
  - Verify: `npm test --prefix frontend -- src/hooks/useThemeMode.test.ts &&
    (cd frontend && npx eslint src/hooks/useThemeMode.test.ts --max-warnings 0)`
  - Depends on: T-23

- [ ] **T-25** [P] — Split `ContactSection` (177 lines): `useTurnstileWidget(siteKey, onToken)`
  (effect unchanged, JSDoc on `renderWidget`); `ContactAlternatives`; `ContactForm` +
  `ContactFormField`. Fix `exhaustive-deps` at `ContactSection.tsx:113`: wrap `updateField` in
  `useCallback([])` in `useContactForm` and list it in the effect deps (R-10).
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/sections/{ContactSection,ContactAlternatives,ContactForm,ContactFormField}.tsx`,
    `frontend/src/hooks/useTurnstileWidget.ts`, `frontend/src/hooks/useContactForm.ts`
  - Verify: `(cd frontend && npx eslint src/components/sections/Contact*.tsx
    src/hooks/useTurnstileWidget.ts --max-warnings 0) && npm test --prefix frontend &&
    npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-26** — `useContactForm` (43 lines): extract module-level
  `resolveValidationError(values, captchaEnabled, dictionary): string | null`, with JSDoc.
  - AC: AC-000-01
  - Files: `frontend/src/hooks/useContactForm.ts`
  - Verify: `(cd frontend && npx eslint src/hooks/useContactForm.ts --max-warnings 0) &&
    npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-25

- [ ] **T-27** [P] — Split `ProjectCard` (178 lines): `ProjectCardMedia`, `ProjectStackList`,
  `ProjectCardActions`; move `ProjectLink` (41 lines) to `ProjectLink.tsx` and shorten it; move
  the two inline SVGs to `ProjectActionIcons.tsx` (`PlayIcon`, `KeyIcon`). `buildCardLayoutId`
  usage and `layoutId` values unchanged.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/ui/{ProjectCard,ProjectCardMedia,ProjectStackList,ProjectCardActions,ProjectLink,ProjectActionIcons}.tsx`
  - Verify: `(cd frontend && npx eslint src/components/ui/Project{Card,CardMedia,StackList,CardActions,Link,ActionIcons}.tsx
    --max-warnings 0) && npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-28** [P] — Split the modals: `CredentialsModal` (110 lines) and `VideoModal` (72
  lines). Extract `useModalBehavior(onClose)` only if both Esc + scroll-lock effects are
  character-identical (otherwise keep one effect per modal, with JSDoc on each `handleEsc`);
  `CredentialRow` to its own file; `ModalHeader` only if the header markup is identical in both.
  Record in Evidence which conditional files were created.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/ui/{CredentialsModal,VideoModal,CredentialRow}.tsx`,
    conditional `frontend/src/components/ui/ModalHeader.tsx`,
    `frontend/src/hooks/useModalBehavior.ts`
  - Verify: `(cd frontend && npx eslint src/components/ui/{CredentialsModal,VideoModal,CredentialRow}.tsx
    $(ls src/components/ui/ModalHeader.tsx src/hooks/useModalBehavior.ts 2>/dev/null)
    --max-warnings 0) && npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-29** [P] — Split `HeroSection` (98 lines): `HeroIntro`, `HeroActions`,
  `HeroProfileCard`.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/sections/{HeroSection,HeroIntro,HeroActions,HeroProfileCard}.tsx`
  - Verify: `(cd frontend && npx eslint src/components/sections/Hero*.tsx --max-warnings 0) &&
    npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-30** [P] — Split `AboutSection` (78 lines): `AboutBio`, `AboutSkillsGrid`.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/sections/{AboutSection,AboutBio,AboutSkillsGrid}.tsx`
  - Verify: `(cd frontend && npx eslint src/components/sections/About*.tsx --max-warnings 0) &&
    npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-31** [P] — Split `PortfolioSection` (75 lines): `PortfolioGrid` (filtered grid +
  `AnimatePresence`), `PortfolioModals` (the two modal `AnimatePresence` blocks). Modal and card
  props unchanged.
  - AC: AC-000-01 (CL-06)
  - Files: `frontend/src/components/sections/{PortfolioSection,PortfolioGrid,PortfolioModals}.tsx`
  - Verify: `(cd frontend && npx eslint src/components/sections/Portfolio*.tsx --max-warnings 0)
    && npm test --prefix frontend && npm run build --prefix frontend`
  - Depends on: T-11, T-12, T-13, T-14, T-15

- [ ] **T-32** — Remaining frontend fixes: `App.tsx` long lazy-import lines (manual split if
  Prettier left any over 100; `MotionConfig reducedMotion="user"` still wraps the tree);
  `ProjectFilterBar.tsx:39` className split by concatenation; remove the unused `DemoCredential`
  import in `data/projects.ts`; JSDoc on `handleChange` in `useMediaQuery`. Frontend lint reaches
  0. No change to the R-12 items (hardcoded strings, `rgba` shadow).
  - AC: AC-000-01
  - Files: `frontend/src/App.tsx`, `frontend/src/components/ui/ProjectFilterBar.tsx`,
    `frontend/src/data/projects.ts`, `frontend/src/hooks/useMediaQuery.ts` (+ any same-kind
    residue the lint lists, R-14)
  - Verify: `npm run lint --prefix frontend && npm run format:check --prefix frontend &&
    npx tsc -b frontend && npm test --prefix frontend && npm run build --prefix frontend &&
    test -z "$(git status --porcelain)" &&
    grep -q '<MotionConfig reducedMotion="user">' frontend/src/App.tsx`
  - Depends on: T-23, T-24, T-26, T-27, T-28, T-29, T-30, T-31

## Phase H — Harness

- [ ] **T-33** [P] — Create the `testing-conventions` skill in `.harness/skills/` (file location
  and naming, Vitest + Testing Library patterns, the jsdom shims in `src/test/setup.ts`, the
  AC-id convention in test names, fakes vs mocks (`vi.fn` / `vi.spyOn` on in-memory and no-op
  adapters), coverage commands, and the review check that constructors with logic carry JSDoc,
  plan §1.2); then `node .harness/sync-claude-code.mjs`.
  - AC: AC-000-12
  - Files: `.harness/skills/testing-conventions/SKILL.md`,
    `.claude/skills/testing-conventions/SKILL.md` (generated) (path exceptions)
  - Verify: `node .harness/sync-claude-code.mjs &&
    test -f .harness/skills/testing-conventions/SKILL.md &&
    test -f .claude/skills/testing-conventions/SKILL.md &&
    test -z "$(git status --porcelain .claude | grep -v 'skills/testing-conventions')"`
  - Depends on: T-32

- [ ] **T-34** — Update `AGENTS.md`: remove every † (including the "Commands marked †…"
  sentence); add a `format` / `format:check` row; e2e row reads "defined in spec 004
  (Playwright)"; replace "Until spec 000 lands: …" with the full local check list (format:check,
  lint, type check, test, build); list `testing-conventions` among the skills; add a Stack
  "Tooling" line (ESLint 10, Prettier 3, Vitest 3). Keep `npx tsc -b frontend` and
  `npx tsc -p api --noEmit` as the canonical type checks.
  - AC: AC-000-12
  - Files: `AGENTS.md` (path exception)
  - Verify: `! grep -q '†' AGENTS.md && grep -q 'format:check' AGENTS.md &&
    grep -q 'defined in spec 004 (Playwright)' AGENTS.md &&
    ! grep -qE 'Until spec 000 lands|arrives with spec 000' AGENTS.md &&
    grep -q 'testing-conventions' AGENTS.md`
  - Depends on: T-33

## Phase I — Documentation

- [ ] **T-35** [P] — NFR-002 baseline and testing strategy in `docs/architecture/overview.md`:
  measure the initial JS / CSS gzip sizes (plan §6 definition) from a clean worktree of the
  current branch HEAD (no `.env`, matching CI); add the "Bundle baseline (NFR-002)" table under
  "Testing strategy" with the `main` row (from `visual-baseline.md`) and the `spec 000 baseline`
  row (that HEAD SHA); rewrite "Testing strategy" to describe the live setup (Vitest, Testing
  Library, coverage reported not gated, CI jobs, e2e in spec 004).
  - AC: AC-000-13
  - Files: `docs/architecture/overview.md` (path exception)
  - Verify: `grep -Eq '^\| spec 000 baseline \| [0-9a-f]{7,40} \| [0-9.]+ kB \| [0-9.]+ kB \|'
    docs/architecture/overview.md &&
    grep -Eq '^\| main before spec 000 \| [0-9a-f]{7,40} \|' docs/architecture/overview.md`
  - Depends on: T-32

- [ ] **T-36** [P] — `docs/traceability.md`: FR-002/BR-001 → AC-000-05(a)(e); FR-003/BR-002 →
  AC-000-05(f); FR-008/BR-003 → AC-000-06, each with its test file path.
  - AC: AC-000-05, AC-000-06 (traceability, CL-21)
  - Files: `docs/traceability.md` (path exception)
  - Verify: `grep -q 'AC-000-05' docs/traceability.md && grep -q 'AC-000-06' docs/traceability.md &&
    grep -q 'useThemeMode.test.ts' docs/traceability.md`
  - Depends on: T-24, T-17, T-18

- [ ] **T-37** [P] — `docs/roadmap.md`: DEBT-001 and DEBT-005 → `Closed (spec 000)`; add
  DEBT-009 with the plan R-6 wording.
  - AC: — (spec §2 Documentation, CL-21)
  - Files: `docs/roadmap.md` (path exception)
  - Verify: `grep -E '^\| DEBT-001 ' docs/roadmap.md | grep -q 'Closed' &&
    grep -E '^\| DEBT-005 ' docs/roadmap.md | grep -q 'Closed' && grep -q '^| DEBT-009 ' docs/roadmap.md`
  - Depends on: T-32

## Phase J — CI

- [ ] **T-38** — Create `.nvmrc` (`22`) and `.github/workflows/ci.yml` per plan §1.8: triggers,
  `permissions: contents: read`, `concurrency`, jobs `frontend` and `api` (`name` = id),
  `actions/{checkout,setup-node,upload-artifact}@v7`, the step table (including
  `npx prisma generate` in `api`, with the R-3 placeholder `DATABASE_URL` only if needed), coverage
  artifacts `coverage-frontend` / `coverage-api` with `if: ${{ !cancelled() }}`, and the five
  inline guards (DEBT-005, `no-console` disables, harness, NFR-002, Prettier parity). Run every
  guard snippet locally in Git Bash; all must pass because T-33…T-37 are done.
  - AC: AC-000-07 (workflow), AC-000-10, AC-000-02 (guard), AC-000-03 (parity), AC-000-12,
    AC-000-13 (guards)
  - Files: `.nvmrc` (path exception), `.github/workflows/ci.yml`
  - Verify: each guard block from `ci.yml`, pasted into Git Bash at the repo root, exits 0
    (record each exit code in Evidence) && `grep -q 'contents: read' .github/workflows/ci.yml &&
    grep -q 'cancel-in-progress: true' .github/workflows/ci.yml &&
    ! grep -q 'secrets\.' .github/workflows/ci.yml &&
    grep -cE '^  (frontend|api):$' .github/workflows/ci.yml | grep -q '^2$' &&
    test "$(cat .nvmrc)" = 22`. The real proof is the draft-PR run (P-01).
  - Depends on: T-34, T-35, T-36, T-37

## Post-implementation steps (not implementer tasks; listed so every AC has an owner)

- [ ] **P-01** — Coordinator asks Hernán to push `feat/000-quality-baseline` and open a **draft
  PR**; both CI checks must pass (spec §4.1b, CL-18). Fixes go back to the implementer as new
  tasks.
  - AC: AC-000-07 (run link recorded in `validation.md`) · Owner: Hernán + Coordinator
  - Depends on: T-38
- [ ] **P-02** — Validation (phase 7) records in `validation.md`: AC-000-03 local Windows
  `format:check` run in both packages; AC-000-08 throwaway changes (lint error, 101-char line,
  formatting error, type error, failing test, per package; commands and exit codes, nothing
  committed); AC-000-09 branch capture on port 4174 with the `visual-baseline.md` script, the
  diff, side-by-side notes and console comparison; AC-000-13 numbers vs the CI build log;
  ASM-000-09 `npm run test:e2e --prefix api` result or the accepted risk.
  - AC: AC-000-03, AC-000-08, AC-000-09, AC-000-13 · Owner: reviewers
  - Depends on: P-01
- [ ] **P-03** — After G-Merge, the post-merge `main` CI run, Hernán's explicit yes and his
  `gh auth login` (OQ-000-01): the protection agent runs the plan §4 `PUT` and `GET`, and records
  the summary in `MEMORY.md`. The spec becomes Implemented.
  - AC: AC-000-11 · Owner: protection agent
  - Depends on: G-Merge
- [ ] **P-04** — Remove the baseline worktree: `git worktree remove ../portfolio-main-baseline`.
  - AC: — · Owner: Coordinator asks the implementer
  - Depends on: P-02

## AC coverage
| AC | Tasks | Test or check |
|---|---|---|
| AC-000-01 | T-07, T-23, T-25–T-32, T-38 | `npm run lint --prefix frontend` (T-32), CI `lint` |
| AC-000-02 | T-08, T-16, T-17, T-19, T-21, T-22, T-38 | `npm run lint --prefix api` (T-22), CI guard |
| AC-000-03 | T-02, T-04, T-05, T-06, T-38, P-02 | CI `format:check` + parity guard; local record |
| AC-000-04 | T-03, T-09, T-10 | `npx tsc -b frontend`, `npx tsc -p api --noEmit`, CI `typecheck` |
| AC-000-05 | T-09, T-11–T-15, T-24 | Vitest files (a)–(f); coverage report |
| AC-000-06 | T-10, T-17, T-18 | Vitest files (a)(b); coverage report |
| AC-000-07 | T-38, P-01 | CI run on the draft PR |
| AC-000-08 | P-02 | recorded verification (spec §9 exception) |
| AC-000-09 | T-01, P-02 | recorded verification (spec §9 exception) |
| AC-000-10 | T-03, T-38 | CI DEBT-005 guard |
| AC-000-11 | P-03 | recorded verification in `MEMORY.md` (spec §9 exception) |
| AC-000-12 | T-33, T-34, T-38 | CI harness guard + review |
| AC-000-13 | T-01, T-35, T-38, P-02 | CI NFR-002 guard + review |

## Evidence
