# Plan — Spec 000
Spec: `specs/000-quality-baseline/spec.md` v1.1 (Planned) · Planned: 2026-11-26 · Status: Approved
> **G-Plan approved by Hernán 2026-11-26:** D-1 yes, with the `getEnvConfig` characterization
> test (T-20 runs); implementer path exceptions, Playwright MCP use, §7 dependencies and the
> §8 spec v1.1 changes approved as written.

Versions were checked with `npm view` on 2026-11-26 (Art. 14). The local machine runs Node 22.17.0
and npm 10.9.2, and the lockfiles resolve TypeScript **5.9.3** (range `^5.6.3`), Vite 5.4.21 and
React 18.3.1. Every tool below supports that exact set. Upgrading Node is a Title VI stop, so the
local Node version is a hard constraint.

## 1. Technical approach (and discarded alternatives)

### 1.1 Toolchain per package
Each package (`frontend/`, `api/`) owns its whole toolchain: dev dependencies, `eslint.config.js`,
`.prettierrc.json`, `.prettierignore` and `vitest.config.ts`. The repository root has no
`package.json`, so a shared root config could not resolve the plugins it imports.
- *Discarded:* a root `package.json` with npm workspaces. It changes how Vercel and the API host
  install dependencies. That is a deployment change, out of scope.
- *Discarded:* a root `.prettierrc.json` shared by both packages. Prettier would resolve it, but
  that would put the implementer outside `frontend/**` and `api/**` for no gain. The 7-line file
  is duplicated instead, and a CI step checks that both copies match (§6, AC-000-03).

### 1.2 ESLint 10 (flat config) and its rule sources
- **ESLint 10.15** with `@eslint/js` 10, `typescript-eslint` 8.74 (non-type-aware `recommended`,
  CL-23), `eslint-plugin-react-hooks` 7.1 (frontend only) and `eslint-plugin-jsdoc` 63.3.
  `eslint-config-prettier` comes right after the presets and **before** the project rules block,
  so `max-len` stays on (CL-11).
- **`max-len` comes from ESLint core.** In ESLint 10.15 it is deprecated, but it still ships
  (`availableUntil: "11.0.0"` in `lib/rules/max-len.js`). Using it avoids a dependency. Switching
  to `@stylistic/max-len` is recorded as part of DEBT-009 for the ESLint 11 upgrade.
  *Discarded:* `@stylistic/eslint-plugin` now (an extra dependency that does the same thing today).
- **React hooks:** only `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` are set, at
  `error`. The plugin's presets are not used, because the 7.x `recommended` preset adds React
  Compiler rules (CL-10).
- **`eslint-plugin-react` is not accepted** (§7). Version 7.37.5, the latest, declares
  `eslint: ... ^9.7` and does not support ESLint 10. So `react/jsx-no-target-blank` (NFR-011) is
  deferred to spec 002, per spec §2 / CL-23. Note for spec 002: core `no-restricted-syntax` with a
  JSX selector can enforce `rel="noopener noreferrer"` with no plugin.
  *Discarded:* staying on ESLint 9 only to get this one rule. It would pin the whole lint stack to
  the previous major.
- **The rules block** (identical in both packages, except for the hooks rules):

  | Rule | Setting |
  |---|---|
  | `max-len` | `{ code: 100, tabWidth: 2, ignoreUrls: true }`; in `src/i18n/**` and `src/data/**` also `ignoreStrings: true, ignoreTemplateLiterals: true` (ASM-000-01) |
  | `max-lines-per-function` | `{ max: 40, skipBlankLines: true, skipComments: true }` (ASM-000-02) |
  | `no-console` | `error` |
  | `@typescript-eslint/no-unused-vars` | `{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" }` (keeps `_token`, `_next`) |
  | `jsdoc/require-jsdoc` | `require: { FunctionDeclaration, ClassDeclaration, MethodDefinition: true, ArrowFunctionExpression: false, FunctionExpression: false }`, `contexts: ["VariableDeclarator > ArrowFunctionExpression", "VariableDeclarator > FunctionExpression"]`, `checkConstructors: false`, `publicOnly: false` |
  | `jsdoc/require-param` | `{ checkDestructured: false }` |
  | `jsdoc/require-returns` | `error` |
  | `linterOptions.reportUnusedDisableDirectives` | `"error"` |

  - **Constructor gap:** `eslint-plugin-jsdoc` cannot tell an empty constructor from one with
    logic. I probed `exemptEmptyConstructors` and a `contexts` selector: the first only looks at
    parameters, and the selector is ignored while `checkConstructors` is false. So lint never
    requires JSDoc on a constructor. The two constructors that have logic
    (`NodemailerMailService`, `ResendMailService`) get JSDoc in T-API-JSDOC, and review checks any
    new ones (written into the `testing-conventions` skill's checklist). *Discarded:*
    `checkConstructors: true`, which would also demand JSDoc on the parameter-property-only
    constructors that the spec exempts.
  - **Relaxations (CL-13):**
    - `**/*.test.{ts,tsx}` and `src/test/**`: `max-lines-per-function` and `jsdoc/require-jsdoc`
      are off.
    - `api/src/scripts/**`: `no-console` is off.
  - **`*.cjs`** (`frontend/postcss.config.cjs`): `sourceType: "commonjs"` and an inline
    `globals: { module: "writable" }`. No `globals` package.
  - **Ignores (CL-05):** `dist/**`, `coverage/**`, `**/*.tsbuildinfo`, `vite.config.js`,
    `vite.config.d.ts`, `tailwind.config.js`, `tailwind.config.d.ts`.
- **Script:** `eslint . --max-warnings 0`.
- **Measured baseline:** I ran this config from the scratchpad, against the current code, before
  any Prettier pass. It reports **83 problems**: 44 × `max-len`, 18 × `jsdoc/require-jsdoc`,
  13 × `max-lines-per-function`, 6 × `no-console`, 1 × `exhaustive-deps`
  (`ContactSection.tsx:113`), 1 × `no-unused-vars` (`data/projects.ts:1`). The fix tasks in §2
  cover each one.

### 1.3 Prettier 3
- **Options (spec §2):** `semi: true`, `singleQuote: false`, `trailingComma: "none"`,
  `printWidth: 100`, `endOfLine: "lf"`.
- **Scripts:**
  - `format`: `prettier --write "**/*.{ts,tsx,js,cjs,css,json,html}"`
  - `format:check`: the same glob with `--check`
- **`.prettierignore`:** `dist`, `coverage`, `package-lock.json`, `*.tsbuildinfo` and the generated
  configs.
- **Measured drift:** with these options, `api/` already passes and `frontend/` has 22 files that
  differ. Most of them are CRLF files in the working copy. After `.gitattributes` and the format
  commit, the residue is real wrapping.

### 1.4 Vitest 3 (not 4 or 5)
- **Version limits:**
  - `vitest@5` declares `peer vite ^6.4 || ^7 || ^8`.
  - `vitest@4` depends on `vite ^6 || ^7`.
  - `vitest@3.2.7` depends on `vite ^5 || ^6 || ^7`. In `frontend/` it dedupes to the existing
    Vite 5.4.21, so there is one Vite and no upgrade (DEBT-007, CL-10).
- **Frontend:** `jsdom` 29.1.1 (`jsdom@30` and later need Node ≥ 22.22.2), Testing Library
  (`react` 16, `dom` 10) and `@testing-library/jest-dom` 7.0.1 (8.x needs Vitest ≥ 5).
  `user-event` is not added; `fireEvent.click` covers AC-000-05(d).
- **`frontend/vitest.config.ts`:** `mergeConfig(viteConfig, defineConfig({ test }))`, so the `@`
  alias is shared. Settings:
  - `environment: "jsdom"`
  - `setupFiles: ["./src/test/setup.ts"]`
  - `include: ["src/**/*.test.{ts,tsx}"]`
  - `restoreMocks: true`
  - coverage `provider: "v8"`, `reporter: ["text", "lcov"]`, `reportsDirectory: "./coverage"`,
    `include: ["src/**/*.{ts,tsx}"]`, `exclude`: tests, `src/test/**`, `**/*.d.ts`, `src/main.tsx`
  - no thresholds (ASM-011)
- **`frontend/src/test/setup.ts`:**
  - imports `@testing-library/jest-dom/vitest`, which also brings the matcher types into
    `tsc -b` (CL-14);
  - calls `cleanup()` and `localStorage.clear()` in `afterEach`;
  - shims `window.matchMedia` (used by `useMediaQuery`).

  Add an `IntersectionObserver` shim only if a test renders a `whileInView` component (none in
  this spec).
- **`api/vitest.config.ts`:** `environment: "node"`, `include: ["src/**/*.test.ts"]`, same coverage
  settings (with `src/scripts/**` and `src/server.ts` excluded). The API gets no Testing Library
  and no jsdom.
- **Script:** `test`: `vitest run --coverage` (AC-000-05/06 say `npm test` itself produces the
  report). Added: `test:watch`: `vitest`.
- *Discarded:*
  - Vitest 4. It would install a second Vite (6 or 7) next to Vite 5, and `mergeConfig` would mix
    plugin types across majors.
  - Jest. It needs a separate transform setup and duplicates Vite's config.

### 1.5 TypeScript configs
- **Frontend (CL-05, CL-14).**
  - **`tsconfig.node.json`:** keeps `composite: true` and adds:
    - `"emitDeclarationOnly": true`
    - `"outDir": "./node_modules/.tmp/tsconfig.node"`
    - `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"`
    - `"skipLibCheck": true`
    - `vitest.config.ts` in `include`
  - **Root `tsconfig.json`:** gets `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"`.
  - **Probe:** on a copy of `frontend/` under the ignored `node_modules/`, with TS 5.9.3,
    `tsc -b` exited 0 and wrote only under `node_modules/.tmp/`.
  - *Discarded:* the current create-vite layout (`noEmit` in the referenced project, root
    `files: []`). The probe failed with TS6306 ("must have setting composite") and TS6310 ("may not
    disable emit"), because the root here is not a solution-style config. Switching to it means
    restructuring three tsconfigs for no gain.
  - **Lookup order:** confirmed in the installed packages. Vite 5's `DEFAULT_CONFIG_FILES` lists
    `vite.config.js` first (`node_modules/vite/dist/node/constants.js:34`). Tailwind 3 tries
    `./tailwind.config.js` before `.ts` (`resolveConfigPath.js:27-30`). The stale-shadowing risk
    in CL-05 is real, so the emit fix is required, not cosmetic.
- **API.**
  - **`tsconfig.json` stays unchanged** (`rootDir: src`, `outDir: dist`, `include: ["src"]`), so
    `npx tsc -p api --noEmit` type-checks the colocated tests (AC-000-04).
  - **A new `tsconfig.build.json`:** `extends: "./tsconfig.json"`,
    `exclude: ["src/**/*.test.ts"]`. The `build` script becomes `tsc -p tsconfig.build.json`.
  - **Effect:** whether the API host runs `npm run build` or a bare `tsc`, the output is still
    `dist/server.js` (ASM-000-14).
  - **`api/vitest.config.ts`** sits outside `rootDir`, so it is linted but not type-checked.
    Vitest validates it at runtime. *Discarded:* adding it to `tsconfig.json`. That moves
    `rootDir` up to `api/`, emits `dist/src/server.js` and breaks `npm start` if the host runs a
    bare `tsc`.
- **Scripts:**
  - frontend `typecheck`: `tsc -b`
  - api `typecheck`: `tsc -p tsconfig.json --noEmit`
  - `AGENTS.md` keeps `npx tsc -b frontend` and `npx tsc -p api --noEmit` as the canonical
    commands.

### 1.6 API seams (the only API structural changes)
- **Captcha seam (CL-01):** `SubmitContactMessageUseCase` receives `CaptchaVerifier` as its third
  constructor argument. `execute(command)` follows these steps:
  1. Verify the token with the remote IP.
  2. If the verifier rejects it, return `{ status: "captcha-rejected" }` and do nothing else.
  3. Otherwise build the `ContactMessageDTO` with `submittedAt: new Date().toISOString()`.
  4. `save`, then `sendContactNotification`.
  5. Return `{ status: "accepted" }`.

  Stamping `submittedAt` after verification keeps today's timing: the controller currently stamps
  it after the Turnstile round trip. The controller always injects the verifier it already builds
  (`TurnstileCaptchaVerifier` when `captchaEnabled`, otherwise `NoopCaptchaVerifier`, which
  returns `true`). It drops its own `if (envConfig.captchaEnabled)` branch and maps
  `captcha-rejected` to the same `400 {"message":"Captcha validation failed"}`. *Discarded:*
  - throwing a `CaptchaRejectedError`, because exceptions for an expected outcome hide the
    control flow;
  - keeping the controller check and also checking in the use case (duplicate logic).
- **Logger (CL-03):** `api/src/infrastructure/logging/logger.ts` exports
  `logger = { info, warn, error }`, each `(...args: unknown[]) => void`. Each method holds one
  `// eslint-disable-next-line no-console -- the API logger is the only console sink (CL-03)`.
  `server.ts` and `errorHandler.ts` call `logger.*` with the same arguments and the same
  `[API] …` prefixes, so the output is byte-identical.
- **Function-length fixes in the API (decision D-1, needs Hernán at G-Plan).** Three API
  functions exceed 40 lines:
  - `getEnvConfig` (51 lines, `config/env.ts:60`);
  - `run` in `scripts/persistenceSmokeTest.ts` (112 lines);
  - `run` in `scripts/contactFormE2eTest.ts` (44 lines).

  Spec §2 allows "lint fixes" besides CL-01 and CL-03, but §8's list (formatting, JSDoc, line
  wrapping, seam, logger) does not name extract-function refactors.
  - **Recommended:** treat behavior-preserving extract-function refactors of exactly these three
    functions as lint fixes. Before splitting, add a characterization test,
    `api/src/config/env.test.ts`:
    - it stubs every env key with `vi.stubEnv`, so a local `api/.env` cannot leak in through
      `dotenv.config()`;
    - it covers the defaults, the fail-fast errors (missing `DATABASE_URL`, `PORT=0`, mail on
      without `SMTP_HOST`, captcha on without `TURNSTILE_SECRET_KEY`) and the parsed output.

    `getEnvConfig` runs at API startup, so a regression would take production down; the test
    costs one task.
  - *Alternative:* split with no test. Cheaper, but production startup is then unguarded.
  - *Alternative:* exempt `config/env.ts` and `scripts/**` from `max-lines-per-function`. That
    contradicts NFR-008 and spec §2 ("fixing every existing violation now").

### 1.7 Frontend refactor (no visual or behavior change, CL-06, CL-12)
- **Boundary:** the DOM output, class strings, Motion props, ARIA attributes, event handlers and
  effect timing stay identical. Only the function boundaries move.
- **Placement:** a new subcomponent goes in its own file (constitution: one component per file),
  in its parent's folder, named `<Parent><Part>.tsx`. Logic moves into hooks in `src/hooks/`.
- **Indicative split:** the implementer may adjust names, but not the boundaries rule above or
  the file list in §2.

  | Over-limit function (lines) | Split |
  |---|---|
  | `Navbar` (145) | `useThemeMode` hook (BR-002 logic, unchanged) + `ThemeMode` type to `types/theme.ts`; `NavbarSectionLinks` renders the 4 desktop buttons and `NavbarMobileMenu` the 4 mobile buttons, each by mapping a `NAV_SECTION_IDS` list (same order, same classes); `NavbarControls` (menu, language, theme buttons). Mapping replaces the repeated buttons, so `@apply` is not needed (CL-12). |
  | `ContactSection` (177) | `useTurnstileWidget(siteKey, onToken)` hook (the effect, unchanged); `ContactAlternatives` (alt-contact block); `ContactForm` + `ContactFormField` (the 3 identical field blocks). Fixes `exhaustive-deps`: `useContactForm` wraps `updateField` in `useCallback([])` (it only calls the stable `setValues`), and the effect lists it. The effect runs exactly as often as today. |
  | `ProjectCard` (178), `ProjectLink` (41) | `ProjectCardMedia` (poster + preview clip), `ProjectStackList`, `ProjectCardActions`; `ProjectLink` moves to `ProjectLink.tsx` and is shortened. The two inline SVGs move to `ProjectActionIcons.tsx` (`PlayIcon`, `KeyIcon`; both are components, so each gets its own file if the reviewer insists on one per file). |
  | `CredentialsModal` (110), `VideoModal` (72) | `useModalBehavior(onClose)` (Esc to close + body scroll lock), extracted only if both modals' effects are character-identical; otherwise one hook per modal. `CredentialRow` moves to its own file. `CredentialsModal` keeps `handleCopy`; the panel header becomes `ModalHeader` only if it is the same markup in both modals. |
  | `HeroSection` (98) | `HeroIntro` (headline + copy), `HeroActions` (CTAs), `HeroProfileCard` (right column) |
  | `AboutSection` (78) | `AboutBio` (photo + text) and `AboutSkillsGrid` |
  | `PortfolioSection` (75) | `PortfolioGrid` (filtered grid + `AnimatePresence`) and `PortfolioModals` (the two modal `AnimatePresence` blocks) |
  | `useContactForm` (43) | extract a module-level `resolveValidationError(values, captchaEnabled, dictionary): string \| null` |

- **Small fixes:**
  - `App.tsx` long lazy-import lines: Prettier wrapping, plus a manual split if one is still
    over 100.
  - `ProjectFilterBar.tsx:39` className split by concatenation.
  - remove the unused `DemoCredential` import in `data/projects.ts`.
  - JSDoc on the named inner arrows (`useMediaQuery` `handleChange`, `ContactSection`
    `renderWidget`, both modals' `handleEsc`).
- **Not to touch:** pre-existing issues outside spec 000 stay as they are (no copy or visual
  change). They are recorded in §8 R-12:
  - hardcoded English strings (`Navbar` theme `aria-label`, `App` `"Loading..."`, `alt` in
    `ProjectCard`, the `Helmet` title);
  - the hardcoded `rgba(16,217,229,0.2)` hover shadow.

### 1.8 CI (CL-18)
One workflow, `.github/workflows/ci.yml`:
- **Triggers:** `pull_request` and `push` to `main`.
- **Settings:** `permissions: contents: read`; `concurrency` group
  `${{ github.workflow }}-${{ github.ref }}` with `cancel-in-progress: true`.
- **Jobs:** `frontend` and `api`, each with `name` equal to its id, on `ubuntu-latest`, with
  `defaults.run.working-directory` set to the package.
- **Actions:** checked on 2026-11-26 through the GitHub releases API. The latest majors are
  `actions/checkout@v7` (7.0.1), `actions/setup-node@v7` (7.1.0) and
  `actions/upload-artifact@v7` (7.0.2). They are pinned to the major tags.
- **Node setup:** `setup-node` uses `node-version-file: .nvmrc` (`22`), `cache: npm` and the
  package's `cache-dependency-path`.

| Step | `frontend` | `api` |
|---|---|---|
| 1 | checkout | checkout |
| 2 | setup-node | setup-node |
| 3 | `npm ci` | `npm ci` |
| 4 | — | `npx prisma generate` (needed for the Prisma client types; no DB access) |
| 5 | `npm run format:check` | `npm run format:check` |
| 6 | `npm run lint` | `npm run lint` |
| 7 | `npm run typecheck` | `npm run typecheck` |
| 8 | `npm test` | `npm test` |
| 9 | upload `coverage-frontend` (`if: ${{ !cancelled() }}`) | upload `coverage-api` (same) |
| 10 | `npm run build` | `npm run build` |
| 11 | guard: DEBT-005 (AC-000-10) | guard: `no-console` disables (AC-000-02) |
| 12 | guard: NFR-002 baseline record (AC-000-13) | guard: harness docs (AC-000-12) |
| 13 | guard: Prettier configs identical (AC-000-03) | — |

**Guards are inline `bash` steps** (`working-directory: .`), 2–6 lines each. They run unchanged in
Git Bash on Hernán's machine. *Discarded:* a guard script in the repository. It would sit outside
both packages' lint and format scope, and it would push the implementer outside its paths again.
Exact checks:
- **DEBT-005:** fail if `git ls-files` lists any of `frontend/tsconfig*.tsbuildinfo`,
  `frontend/{vite,tailwind}.config.{js,d.ts}`. Then, after the build, fail if `git status
  --porcelain` is non-empty, or if `frontend/vite.config.js` or `frontend/tailwind.config.js`
  exists.
- **`no-console`:** `grep -rnE "eslint-disable" api/src frontend/src`, minus the lines from
  `api/src/infrastructure/logging/logger.ts`, filtered to lines that name `no-console` or are
  blanket disables (`eslint-disable(-next-line|-line)?\s*($|\*/|--)`). Fail if anything remains.
- **Harness:** fail unless all of these hold:
  - `! grep -q '†' AGENTS.md`;
  - `grep -q 'format:check' AGENTS.md`;
  - `grep -q 'defined in spec 004 (Playwright)' AGENTS.md`;
  - `! grep -qE 'Until spec 000 lands|arrives with spec 000' AGENTS.md`;
  - `test -f .harness/skills/testing-conventions/SKILL.md`;
  - `test -f .claude/skills/testing-conventions/SKILL.md`.
- **NFR-002:** `grep -Eq '^\| spec 000 baseline \| [0-9a-f]{7,40} \| [0-9.]+ kB \| [0-9.]+ kB \|'
  docs/architecture/overview.md`.
- **Prettier parity:** `cmp frontend/.prettierrc.json api/.prettierrc.json`.

### 1.9 Repository hygiene
- **`.gitattributes` (CL-04):**
  - `* text=auto eol=lf`;
  - `binary` for `*.png *.jpg *.jpeg *.gif *.webp *.ico *.mp4 *.webm *.woff *.woff2 *.ttf *.otf
    *.pdf`;
  - SVG stays text.

  It lands in its own commit with `git add --renormalize .` and nothing else.
- **Working copy:** the `eol=lf` attribute overrides `core.autocrlf=true`. The later Prettier
  `--write` rewrites the in-scope files with LF on disk. No `git reset --hard` is needed.
- **`.gitignore` additions:**
  - `*.tsbuildinfo`
  - `frontend/vite.config.js`, `frontend/vite.config.d.ts`
  - `frontend/tailwind.config.js`, `frontend/tailwind.config.d.ts`
  - `.evidence/` (local visual-baseline evidence, §6)

  `coverage/` is already ignored at any depth.
- **`.nvmrc`:** `22` at the root.

### 1.10 Delivery order (input for `tasks.md`)
Spec §4.1b fixes the first and the last steps.
1. **Visual baseline + `main` bundle size**, from a `git worktree` of `main` at a recorded SHA.
   This comes before any other commit (AC-000-09, AC-000-13 reference).
2. `.gitattributes` + renormalize (standalone).
3. DEBT-005: untrack the artifacts, `.gitignore`, the tsconfig emit fix.
4. Prettier config in both packages + `.nvmrc`. Then a separate pure-formatting commit per
   package.
5. ESLint config per package. The lint run reports the known violation set, then reaches 0
   through the fix tasks.
6. Vitest setup per package.
7. API: logger → captcha seam (test first, AC-000-06b) → `contactSchema` tests → JSDoc and
   wrapping → D-1 (env characterization test, then the splits).
8. Frontend: one refactor task per row of the §1.7 table, each followed by a lint check of the
   touched files. Then small fixes, then tests AC-000-05 (a)…(f).
9. CI workflow.
10. Harness: the `testing-conventions` skill, `AGENTS.md`, `node .harness/sync-claude-code.mjs`.
11. Docs: the NFR-002 baseline, traceability, roadmap, the testing strategy in the overview.
12. Draft PR (Hernán), validation, G-Merge, then branch protection (§4).

## 2. Files to create / modify
**Path exceptions for the implementer** (its default scope is `frontend/**`, `api/**`,
`.github/workflows/**`, `specs/*/tasks.md`). G-Plan approves these paths for spec 000 only:
- `.gitattributes`, `.gitignore`, `.nvmrc`
- `AGENTS.md`
- `.harness/skills/testing-conventions/**`, `.claude/skills/testing-conventions/**`
- `docs/traceability.md`, `docs/roadmap.md`, `docs/architecture/overview.md`
- `specs/000-quality-baseline/visual-baseline.md`
- the Playwright MCP, used in the baseline task only (`.harness/mcp.md` lists it for the reviewer
  and coordinator)

| Path | Action | Reason |
|---|---|---|
| `.gitattributes` | create | LF policy, binaries (CL-04) |
| `.gitignore` | modify | DEBT-005 artifacts, `*.tsbuildinfo`, `.evidence/` |
| `.nvmrc` | create | `22`, the CI Node source (spec §8) |
| `.github/workflows/ci.yml` | create | CI (§1.8, AC-000-07) |
| `frontend/tsconfig.node.tsbuildinfo`, `frontend/tsconfig.tsbuildinfo`, `frontend/vite.config.js`, `frontend/vite.config.d.ts`, `frontend/tailwind.config.js`, `frontend/tailwind.config.d.ts` | delete (`git rm`) | DEBT-005 |
| `frontend/tsconfig.node.json` | modify | emit under `node_modules/.tmp`, include `vitest.config.ts` (CL-05) |
| `frontend/tsconfig.json` | modify | `tsBuildInfoFile` under `node_modules/.tmp` |
| `frontend/package.json`, `frontend/package-lock.json` | modify | dev dependencies (§7); scripts `lint`, `format`, `format:check`, `typecheck`, `test`, `test:watch` |
| `frontend/.prettierrc.json`, `frontend/.prettierignore` | create | Prettier (CL-11) |
| `frontend/eslint.config.js` | create | ESLint flat config (§1.2) |
| `frontend/vitest.config.ts` | create | Vitest (§1.4) |
| `frontend/src/test/setup.ts` | create | jest-dom, cleanup, `matchMedia` shim (CL-14) |
| `frontend/src/types/theme.ts` | create | `ThemeMode` (glossary) |
| `frontend/src/hooks/useThemeMode.ts` | create | theme logic out of `Navbar` (BR-002) |
| `frontend/src/hooks/useTurnstileWidget.ts` | create | Turnstile effect out of `ContactSection` |
| `frontend/src/hooks/useModalBehavior.ts` | create (conditional, §1.7) | Esc + scroll lock shared by the modals |
| `frontend/src/components/layout/NavbarSectionLinks.tsx`, `NavbarMobileMenu.tsx`, `NavbarControls.tsx` | create | `Navbar` split |
| `frontend/src/components/sections/ContactAlternatives.tsx`, `ContactForm.tsx`, `ContactFormField.tsx` | create | `ContactSection` split |
| `frontend/src/components/sections/HeroIntro.tsx`, `HeroActions.tsx`, `HeroProfileCard.tsx` | create | `HeroSection` split |
| `frontend/src/components/sections/AboutBio.tsx`, `AboutSkillsGrid.tsx` | create | `AboutSection` split |
| `frontend/src/components/sections/PortfolioGrid.tsx`, `PortfolioModals.tsx` | create | `PortfolioSection` split |
| `frontend/src/components/ui/ProjectCardMedia.tsx`, `ProjectStackList.tsx`, `ProjectCardActions.tsx`, `ProjectLink.tsx`, `ProjectActionIcons.tsx` | create | `ProjectCard` split |
| `frontend/src/components/ui/CredentialRow.tsx`, `ModalHeader.tsx` (conditional) | create | modal splits |
| `frontend/src/components/layout/Navbar.tsx`, `sections/{Contact,Hero,About,Portfolio}Section.tsx`, `ui/{ProjectCard,CredentialsModal,VideoModal,ProjectFilterBar}.tsx`, `App.tsx` | modify | lint fixes, splits |
| `frontend/src/hooks/useContactForm.ts`, `useMediaQuery.ts`, `frontend/src/data/projects.ts` | modify | `useCallback`, extracted validator, JSDoc, unused import |
| all other in-scope frontend files | modify (format only) | the Prettier commit (wrapping, LF) |
| `frontend/src/i18n/dictionaries.test.ts` | create | AC-000-05(a) |
| `frontend/src/hooks/useProjectFilter.test.ts` | create | AC-000-05(b) |
| `frontend/src/utils/projectCardIdentity.test.ts` | create | AC-000-05(c) |
| `frontend/src/components/ui/ProjectFilterBar.test.tsx` | create | AC-000-05(d) |
| `frontend/src/context/LanguageContext.test.tsx` | create | AC-000-05(e), BR-001 |
| `frontend/src/hooks/useThemeMode.test.ts` | create | AC-000-05(f), BR-002 (ASM-000-10 resolved: ≤ 1 task) |
| `api/package.json`, `api/package-lock.json` | modify | dev dependencies; scripts `lint`, `format`, `format:check`, `typecheck`, `test`, `test:watch`; `build` → `tsc -p tsconfig.build.json` |
| `api/tsconfig.build.json` | create | build excludes tests (CL-14) |
| `api/.prettierrc.json`, `api/.prettierignore`, `api/eslint.config.js`, `api/vitest.config.ts` | create | toolchain |
| `api/src/infrastructure/logging/logger.ts` | create | CL-03 |
| `api/src/server.ts`, `api/src/interfaces/http/middlewares/errorHandler.ts` | modify | use `logger`; JSDoc on `bootstrap`, `shutdown`; wrap the long line |
| `api/src/types/contact.ts` | modify | add `SubmitContactMessageCommand`, `SubmitContactMessageResult` (§4) |
| `api/src/application/use-cases/SubmitContactMessageUseCase.ts` | modify | captcha seam (CL-01) |
| `api/src/interfaces/http/controllers/contactController.ts` | modify | inject the verifier, map the result, wrap imports |
| `api/src/infrastructure/{captcha,email,repositories}/*.ts`, `api/src/config/env.ts` | modify | JSDoc (methods, the 2 constructors with logic, helpers) |
| `api/src/config/env.ts`, `api/src/scripts/persistenceSmokeTest.ts`, `api/src/scripts/contactFormE2eTest.ts` | modify (D-1) | extract functions to ≤ 40 lines |
| `api/src/config/env.test.ts` | create (D-1, recommended) | characterization test before the split |
| `api/src/interfaces/http/validators/contactSchema.test.ts` | create | AC-000-06(a), BR-003 |
| `api/src/application/use-cases/SubmitContactMessageUseCase.test.ts` | create | AC-000-06(b) |
| `.harness/skills/testing-conventions/SKILL.md` | create | CL-20, AC-000-12 |
| `.claude/skills/testing-conventions/SKILL.md` | create (generated) | `node .harness/sync-claude-code.mjs` |
| `AGENTS.md` | modify | AC-000-12 rows and lines; Stack gets a "Tooling" line (ESLint 10, Prettier 3, Vitest 3) |
| `docs/architecture/overview.md` | modify | "Bundle baseline (NFR-002)" table (§6, AC-000-13); "Testing strategy" now describes the live setup |
| `docs/traceability.md` | modify | FR-002/BR-001 → AC-000-05(a)(e); FR-003/BR-002 → AC-000-05(f); FR-008/BR-003 → AC-000-06 |
| `docs/roadmap.md` | modify | DEBT-001, DEBT-005 → Closed (spec 000); add DEBT-009 (§8 R-6) |
| `specs/000-quality-baseline/visual-baseline.md` | create | baseline SHA, state list, capture and diff procedure, `main` bundle sizes (small, tracked) |
| `docs/glossary.md` | modified by the planner (done) | CAPTCHA verifier, Submission outcome, API logger, Required check; `ThemeMode` location |

## 3. Data changes and migrations (with rollback strategy)
- **No schema, entity or migration changes.**
- **Repository tracking changes:**
  - the DEBT-005 files are untracked and ignored;
  - line endings are normalized.
- **Rollback:**
  - each change is its own commit, so `git revert <sha>` undoes it;
  - reverting the renormalize commit restores the old index EOLs, with no content change;
  - reverting the DEBT-005 commit re-tracks the artifacts. Nothing at runtime depends on them,
    because Vite and Tailwind fall back to the `.ts` configs.

## 4. Contracts (API, events, interfaces)
- **HTTP: unchanged, byte for byte** (spec §8):
  - `POST /api/contact` → `201 {"message":"Contact message sent successfully"}`;
  - a rejected captcha → `400 {"message":"Captcha validation failed"}`;
  - validation errors and 500s are unchanged.
- **Application contract** (new, `api/src/types/contact.ts`):
  ```ts
  /** Input of SubmitContactMessageUseCase, built by the controller from the validated body. */
  export interface SubmitContactMessageCommand {
    name: string;
    email: string;
    message: string;
    captchaToken: string; // "" when absent (contactSchema default)
    remoteIp?: string; // request.ip
  }

  /** Typed outcome; the controller maps "captcha-rejected" to HTTP 400. */
  export type SubmitContactMessageResult = { status: "accepted" } | { status: "captcha-rejected" };
  ```
  ```ts
  new SubmitContactMessageUseCase(contactRepository, mailService, captchaVerifier);
  execute(command: SubmitContactMessageCommand): Promise<SubmitContactMessageResult>;
  ```
  `ContactMessageDTO`, `ContactRepository`, `MailService` and `CaptchaVerifier` keep their
  signatures.
- **Logger:** `logger.info | warn | error(...args: unknown[]): void`.
- **CI contract:**
  - check contexts `frontend` and `api`;
  - artifacts `coverage-frontend` and `coverage-api`.
- **Branch protection** (AC-000-11). After G-Merge, Hernán's explicit yes and his
  `gh auth login` (OQ-000-01), the protection agent runs:
  ```bash
  gh api -X PUT repos/hervid2/Portfolio/branches/main/protection --input - <<'JSON'
  {
    "required_status_checks": { "strict": false,
      "checks": [ { "context": "frontend" }, { "context": "api" } ] },
    "enforce_admins": false,
    "required_pull_request_reviews": { "required_approving_review_count": 0 },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false
  }
  JSON
  gh api repos/hervid2/Portfolio/branches/main/protection \
    --jq '{checks: [.required_status_checks.checks[].context],
      strict: .required_status_checks.strict,
      approvals: .required_pull_request_reviews.required_approving_review_count,
      enforce_admins: .enforce_admins.enabled, force_pushes: .allow_force_pushes.enabled,
      deletions: .allow_deletions.enabled}'
  ```
  The expected output is
  `{"checks":["frontend","api"],"strict":false,"approvals":0,"enforce_admins":false,
  "force_pushes":false,"deletions":false}`, and it is recorded in `MEMORY.md`.

  The checks must have reported at least once on `main`, which the post-merge push run provides,
  so run this only after that run finishes.

## 5. UI components
- **No new UI, copy, tokens or palettes.** The components in §1.7 are extractions only, and the
  i18n dictionaries keep the same keys and values.
- **`ui-tokens-motion`:** the skill applies to any class string that is moved. Classes are moved
  verbatim and split only by concatenation.
- **Preserved:** `MotionConfig reducedMotion="user"` keeps wrapping the tree in `App.tsx`, and
  the `layoutId` identities (`buildCardLayoutId`, `ACTIVE_PILL_LAYOUT_ID`) are unchanged.

## 6. Testing strategy (unit, integration, e2e) mapped to each AC
Test names start with the AC id, for example `it("AC-000-05b returns only projects of the
category", …)`. Expectations are derived from `projects`, `enDictionary` / `esDictionary` and
`contactSchema` inputs, never hardcoded counts (CL-15, CL-17).

| AC | Verified by | Type | File / location |
|---|---|---|---|
| AC-000-01 | CI `lint` step (`frontend`); rule activity exercised by AC-000-08 | CI | `.github/workflows/ci.yml` |
| AC-000-02 | CI `lint` step (`api`) + the `no-console` disable guard | CI | `ci.yml` |
| AC-000-03 | CI `format:check` in both jobs + the Prettier parity guard; local Windows run recorded in `validation.md` | CI + record | `ci.yml` |
| AC-000-04 | CI `typecheck` (`tsc -b`; `tsc -p tsconfig.json --noEmit`, which includes `*.test.ts`) | CI | `ci.yml` |
| AC-000-05(a) | deep key-set equality of `enDictionary` / `esDictionary` (recursive) + no empty string at any depth | unit | `frontend/src/i18n/dictionaries.test.ts` |
| AC-000-05(b) | `renderHook(useProjectFilter)`: `categories` = `["all", ...new Set(projects.map(c))]`; `"all"` → `projects`, in order; each category → only its projects; union = all | unit (hook) | `frontend/src/hooks/useProjectFilter.test.ts` |
| AC-000-05(c) | format `project-card-<id>`, deterministic, `new Set(ids.map(build)).size === projects.length` | unit | `frontend/src/utils/projectCardIdentity.test.ts` |
| AC-000-05(d) | renders `categories.length` buttons; the "all" chip text = `allLabel`; `aria-pressed="true"` only on the active one; `fireEvent.click` → `onSelect(key)` | component | `frontend/src/components/ui/ProjectFilterBar.test.tsx` |
| AC-000-05(e) | `LanguageProvider` + probe consumer: stored `"es"` → `esDictionary.nav.home`; `"fr"` and nothing → `enDictionary.nav.home`; `setLanguage("es")` → `localStorage` = `"es"` | component | `frontend/src/context/LanguageContext.test.tsx` |
| AC-000-05(f) (ASM-000-10) | `renderHook(useThemeMode)`: `"light"` → light + `theme-light` on `<html>`; nothing and `"blue"` → dark; toggle persists | unit (hook) | `frontend/src/hooks/useThemeMode.test.ts` |
| AC-000-05 (report) | `npm test` prints the text coverage table and writes `coverage/lcov.info` | CI | `ci.yml` (`coverage-frontend`) |
| AC-000-06(a) | `contactSchema.safeParse` at the BR-003 boundaries (all 11 cases of the AC; lengths built with `"a".repeat(n)`) | unit | `api/src/interfaces/http/validators/contactSchema.test.ts` |
| AC-000-06(b) | `vi.spyOn` on `InMemoryContactRepository.save` and `NoopMailService.sendContactNotification`; fake verifier `{ verifyToken: vi.fn() }`. True → `accepted`, `save` before send (`mock.invocationCallOrder`), DTO carries `submittedAt` (`vi.setSystemTime`). False → `captcha-rejected`, 0 calls to both | unit | `api/src/application/use-cases/SubmitContactMessageUseCase.test.ts` |
| AC-000-06 (report) | `npm test` coverage | CI | `ci.yml` (`coverage-api`) |
| D-1 (if approved) | `getEnvConfig` characterization: defaults, fail-fast errors, parsed output; `vi.stubEnv` for every key | unit | `api/src/config/env.test.ts` |
| AC-000-07 | the CI run on the draft PR (link in `validation.md`); workflow review for `contents: read`, no `secrets.`, `concurrency` | CI | `ci.yml` |
| AC-000-08 | **recorded verification** (spec §9 exception): in each package, one at a time, a lint error, a 101-char line, a formatting error, a type error and a failing test. Each matching command exits ≠ 0. Commands and exit codes go in `validation.md`; nothing is committed | record | `validation.md` |
| AC-000-09 | **recorded verification**, procedure below | record | `visual-baseline.md`, `validation.md`, `.evidence/` |
| AC-000-10 | DEBT-005 guard, run after the frontend build | CI | `ci.yml` |
| AC-000-11 | **recorded verification**: the GET summary (§4) in `MEMORY.md` | record | `MEMORY.md` |
| AC-000-12 | harness guard (§1.8); skill content checked in review | CI + review | `ci.yml` |
| AC-000-13 | NFR-002 guard; numbers compared with the CI build log in review (ASM-000-11) | CI + review | `ci.yml`, `docs/architecture/overview.md` |

**AC-000-09 procedure** (written into `visual-baseline.md` by the baseline task):
1. **Baseline:**
   - `git worktree add ../portfolio-main-baseline <main SHA>`
   - `npm ci && npm run build && npx vite preview --port 4173 --strictPort`
   - record the SHA.
2. **Branch:** in the validation phase, `npm run build && npx vite preview --port 4174
   --strictPort` from the feature branch.
3. **Emulation:**
   - `prefers-reduced-motion: reduce`;
   - `<video>` elements paused with `currentTime = 0`;
   - requests to `youtube.com`, `youtube-nocookie.com` and `challenges.cloudflare.com` blocked
     through `page.route`;
   - after each scroll, wait 1500 ms (Motion opacity fades still run under reduced motion);
   - viewport screenshots (not full page), one per section, after `scrollIntoView`.
4. **State matrix (spec §7):**
   - 4 sections × EN/ES × dark/light × 360/1280 (32 shots);
   - mobile menu open (360);
   - `CredentialsModal` and `VideoModal` open: the focused element and its close-with-Esc result
     are recorded as text;
   - a focus-visible keyboard pass (Tab sequence: tag names + accessible names, as text);
   - hover on a card (1280) and a tap with touch emulation (360);
   - a contact client-side validation error;
   - API unreachable (route `**/api/contact` → abort);
   - the `MotionConfig` check through the React tree in DevTools is replaced by a DOM-free check:
     with reduced motion emulated, no element keeps a non-identity `transform` after settling;
   - language and theme kept after reload.
5. **Diff:** one Playwright MCP `browser_run_code_unsafe` script takes the same shot from 4173
   and 4174 as PNG buffers and decodes both into an `OffscreenCanvas` in the page. A pixel counts
   as different if any RGBA channel differs by more than 25/255.
   - **Tolerance: ≤ 0.1 % of pixels per shot.**
   - Shots over the tolerance get a side-by-side review, recorded in `validation.md`.
   - Console errors from both runs are compared: no new errors allowed.
   - No dependency is added; the decoding uses the browser's canvas.
6. **Evidence:** in `.evidence/000-quality-baseline/{baseline,branch}/` (gitignored). The ~44
   PNGs exceed the 5 MB rule in spec §7.4, so they stay outside git. Only `visual-baseline.md`
   (SHA, list, numbers) is tracked.

**NFR-002 measurement.**
- **Definition:** "initial JS / CSS" = the gzip sizes (as printed by `vite build`) of the JS chunks
  and the CSS file that `dist/index.html` references (module script + `modulepreload` links).
  Lazy section chunks are excluded.
- **Where it is recorded:** a table in `docs/architecture/overview.md`, under "Testing strategy",
  section "Bundle baseline (NFR-002)":
  ```
  | Measured on | Commit | Initial JS (gzip) | Initial CSS (gzip) | Notes |
  |---|---|---|---|---|
  | main before spec 000 | <sha> | <n> kB | <n> kB | reference only |
  | spec 000 baseline | <sha> | <n> kB | <n> kB | NFR-002 baseline (CI build, no VITE_* values) |
  ```

**Supporting checks (not ACs):**
- `npm run build --prefix api` (in CI);
- `npm run test:e2e --prefix api`, only if Hernán has MySQL locally (ASM-000-09); otherwise the
  accepted risk is recorded in `validation.md`.

## 7. New dependencies (justification per Art. 10)
All are **dev dependencies** and none ships in the runtime bundle or the API image. They are
installed with caret ranges like the existing ones; the lockfiles pin the exact versions.
Compatibility sources come from `npm view <pkg>@<v> peerDependencies engines` on 2026-11-26.
Sizes are `dist.unpackedSize` (install size, not bundle size).

| Package @ version | Pkg | Purpose | Alternatives (incl. "don't add it") | License | Maintenance | Size | Compatibility source |
|---|---|---|---|---|---|---|---|
| `eslint@^10.15.0` | both | linter (NFR-007/008) | ESLint 9.39 (older major; only gain is `eslint-plugin-react`); Biome (no JSDoc or hooks rules) | MIT | OpenJS, active (11-2026) | 2.9 MB | engines `^20.19 \|\| ^22.13 \|\| >=24` → Node 22.17 OK |
| `@eslint/js@^10.0.1` | both | core `recommended` preset | don't add it (lose `no-undef`-class core checks on JS configs) | MIT | ESLint team | 16 KB | peer `eslint ^10` |
| `typescript-eslint@^8.74.0` | both | TS parser + `recommended` | none viable for TS | MIT | very active | 43 KB (+ parser/plugin deps) | peer `eslint ^8.57 \|\| ^9 \|\| ^10`, `typescript >=4.8.4 <6.1` → TS 5.9.3 OK |
| `eslint-plugin-react-hooks@^7.1.1` | frontend | `rules-of-hooks`, `exhaustive-deps` (spec §2) | v5 (no ESLint 10 peer); don't add it (spec requires the rules) | MIT | Meta | 4.1 MB | peer includes `^10.0.0`; engines `>=18` |
| `eslint-plugin-jsdoc@^63.3.3` | both | JSDoc scope (CL-07) | v64/65 need Node ≥ 22.22.2 (Title VI stop); review only (not enforceable) | BSD-3-Clause | very active | 3.5 MB | v63 engines `^22.13 \|\| >=24`; peer `eslint ... ^10` |
| `eslint-config-prettier@^10.1.8` | both | turns off rules that conflict with Prettier (CL-11) | hand-maintained offs (fragile) | MIT | Prettier org | 59 KB | peer `eslint >=7` |
| `prettier@^3.10.1` | both | formatter (CL-11) | dprint/Biome (different output; spec names Prettier) | MIT | very active | 11 MB | engines `>=14` |
| `vitest@^3.2.7` | both | test runner (spec §2) | Vitest 4/5 (need Vite ≥ 6, DEBT-007); Jest (duplicate transform config) | MIT | active, 3.x patched 11-2026 | 1.4 MB | `dependencies.vite ^5 \|\| ^6 \|\| ^7` → dedupes to Vite 5.4.21 in frontend; engines `>=22` OK |
| `@vitest/coverage-v8@^3.2.7` | both | coverage text + lcov (AC-000-05/06) | istanbul provider (slower); don't add it (the AC requires a report) | MIT | Vitest team | 117 KB | peer `vitest 3.2.7` |
| `jsdom@^29.1.1` | frontend | DOM for component tests | happy-dom (less complete for focus and ARIA); v30+ needs Node ≥ 22.22.2 | MIT | active | 7.0 MB | v29 engines `^20.19 \|\| ^22.13 \|\| >=24` |
| `@testing-library/react@^16.3.3` | frontend | render / `renderHook` | Enzyme (dead); raw `react-dom/test-utils` (deprecated `act` paths) | MIT | active | 340 KB | peer `react ^18 \|\| ^19`, `@testing-library/dom ^10` |
| `@testing-library/dom@^10.4.2` | frontend | required peer of RTL 16 | none (peer) | MIT | active | 2.5 MB | engines `>=18` |
| `@testing-library/jest-dom@^7.0.1` | frontend | DOM matchers + types via `/vitest` | plain `expect` on attributes (more verbose); v8 needs Vitest ≥ 5 | MIT | active | 332 KB | peer `vitest >=0.32`, `@testing-library/dom >=10 <11`; engines `node >=22` |

**Not added:**
- `eslint-plugin-react`: no ESLint 10 support; NFR-011 lint deferred to spec 002.
- `@stylistic/eslint-plugin`: core `max-len` is still available.
- `globals`: an inline global for one `.cjs` file.
- `@testing-library/user-event`: `fireEvent` is enough.
- `@eslint-community/eslint-plugin-eslint-comments`: the `grep` guard covers AC-000-02.
- `prettier-plugin-tailwindcss`: forbidden by the spec.
- `pixelmatch` and friends: the browser canvas does the diff.

## 8. Risks and mitigations
| ID | Risk | Mitigation |
|---|---|---|
| R-1 | A component split changes the UI or behavior (e.g. a lost `key`, a changed effect order, a moved class) | Baseline first (§1.10 step 1); one task per component, each run against the full lint and the test suite; the §6 diff + console comparison at validation; preserved items listed in §5 |
| R-2 | The renormalize and Prettier commits make every later diff and `git blame` noisy | Separate commits containing only that change. Review them with `git diff --ignore-cr-at-eol` / `-w` (expected: empty for the renormalize commit, wrapping only for the format commit). Optionally list both SHAs in a root `.git-blame-ignore-revs` (not planned; Hernán's call) |
| R-3 | `npx prisma generate` in CI fails without `DATABASE_URL` | `generate` does not connect, but if the CLI insists on the env var, set the step env to the non-secret placeholder `mysql://ci:ci@localhost:3306/ci` (NFR-009 allows it: not a credential). The implementer checks this on the draft PR run |
| R-4 | The API host runs a bare `tsc` instead of `npm run build` | `tsconfig.json` keeps `rootDir`/`outDir`, so `dist/server.js` is produced either way (§1.5); tests would also compile into `dist/` but are never executed. Recorded as ASM-000-14 |
| R-5 | `getEnvConfig` split breaks production startup | D-1 characterization test before the split; build in CI |
| R-6 | Tools pinned below their latest majors (Vitest 3, jsdom 29, `eslint-plugin-jsdoc` 63; core `max-len` removed in ESLint 11) | Caret ranges stop at the safe major; record **DEBT-009** in `docs/roadmap.md`: "Tooling pinned for Node 22.17 / Vite 5 — revisit with DEBT-007 or a Node upgrade; move `max-len` to `@stylistic` before ESLint 11" |
| R-7 | CI uses the latest Node 22.x while Hernán uses 22.17, so results differ | All chosen engines accept both. Pinning `.nvmrc` to `22.17` is possible if drift appears (spec says `22`) |
| R-8 | `vitest.config.ts` in the composite `tsconfig.node.json` fails declaration emit (TS2742, inferred type not nameable) | Annotate the export with `ViteUserConfig` from `vitest/config`; if it still fails, the implementer stops and reports (no tsconfig redesign without the planner) |
| R-9 | A local `api/.env` / `frontend/.env` leaks into tests | Tests never depend on env except D-1, which stubs every key; CI has no `.env` files |
| R-10 | The `exhaustive-deps` fix re-runs the Turnstile effect | `updateField` made stable with `useCallback([])`, so the dependency never changes; the API-unreachable and validation states are in the §6 matrix |
| R-11 | Large CRLF → LF churn on Hernán's working copy causes local `format:check` failures before the format commit | Expected and temporary; AC-000-03's local run happens after the format commit |
| R-12 | Pre-existing constitution gaps found while planning: hardcoded EN strings (`Navbar` theme `aria-label`, `App` `"Loading..."` fallback and `Helmet` title/description, `ProjectCard` icon `alt`), a hardcoded `rgba(16,217,229,0.2)` shadow, and `react/jsx-no-target-blank` missing | Out of scope (no copy or visual change). Suggest folding them into spec 002 (links, copy) and spec 004 (a11y) when those are specified; the Coordinator decides whether to log a DEBT item |
| R-13 | Branch protection applied before the checks ever reported on `main` makes the contexts unselectable | §4 says to run it after the post-merge `main` run finishes |
| R-14 | The 83-violation baseline grows after Prettier (wrapping moves code), so the task estimates are low | The §1.7 split already covers every function over 40 lines; the remaining `max-len` lines are className or string splits. A task that finds an unlisted violation is fixed in place if it is the same kind; otherwise the implementer stops |

**Proposed for spec §11** (the Coordinator records them at G-Plan as spec v1.1, a minor change):
- **ASM-000-14** (agent): the API host builds with `npm run build` or a bare `tsc`. Both still
  produce `dist/server.js` (R-4).
- **ASM-000-15** (agent): AC-000-09's "`MotionConfig` still wraps the tree" is checked by
  behavior (no lingering transforms under reduced motion), plus a code check that `App.tsx` still
  renders `<MotionConfig reducedMotion="user">` around the tree.
- **ASM-000-10:** resolved as **included** (AC-000-05(f)), because `useThemeMode` is extracted by
  the `Navbar` split anyway.
- **ASM-000-12:** confirmed by code reading. The three `import.meta.env.VITE_*` reads
  (`ContactSection.tsx:60`, `useContactForm.ts:37`, `contactApi.ts:3-4`) all use optional chaining
  with a fallback, and Vite replaces missing `VITE_*` keys with `undefined` without failing. The
  CI run on the draft PR is the proof.

**Decision for Hernán at G-Plan:** **D-1** (§1.6), API extract-function refactors plus the
`getEnvConfig` characterization test. Recommended: yes, with the test.
**Decided 2026-11-26:** yes, with the test (Hernán, G-Plan). Recorded in spec v1.1.

## 9. New or affected ADRs
- **No new ADR.** The choice of tools (ESLint, Prettier, Vitest) is already a constitution
  decision (Title II, "Testing strategy" and "Code style and tools"). Versions are an Art. 14
  matter, recorded here and in DEBT-009.
- **ADR-0002 (layered API):** consistent. Injecting `CaptchaVerifier` into the use case
  strengthens its "DIP via interfaces" rationale. No edit is required. Optionally, add one line
  under Consequences: "CAPTCHA is verified in the application layer since spec 000".
- **ADR-0001, ADR-0003, ADR-0004:** not affected. The test and CI setup is what ADR-0003's future
  pre-render check (NFR-005) will plug into.
