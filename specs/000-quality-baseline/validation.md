# Validation — Spec 000 (consolidated) · Cycle 1/3

**Consolidated verdict: APPROVED** — no BLOCKER or MAJOR findings in spec 000 scope across the
three focuses. Consolidated by the Coordinator on 2026-11-26 (GENESIS §C.3).

| Focus | Verdict | Findings |
|---|---|---|
| Compliance | APPROVED | 6 MINOR (C-01…C-06), 2 SUGGESTION (C-07, C-08) |
| e2e | APPROVED | 2 MINOR pre-existing (E2E-01, E2E-02), 2 SUGGESTION |
| Quality-security | APPROVED | 3 MINOR (QS-01…QS-03), 4 SUGGESTION; 3 pre-existing risks (PE-01…PE-03) |

**Context.** PR #4 was merged by the owner before phase 7 (G-Merge skipped, finding C-01), so
validation ran post-merge against `ed051a4..e11bf10`. CI passed on the PR (run 45905796398) and on
the post-merge push to `main` (run 45905884732). Vercel production is at `e11bf10`; the API host
auto-deploys from `main` (owner, 2026-11-26).

**Key evidence.**
- AC-000-09: 40/40 screenshots at 0.0000 % pixel diff against the `main` baseline; behavior
  records (focus, tab order, reduced-motion list, persistence) equal; no new console errors.
- AC-000-08: every throwaway probe (lint, format, type, failing test) fails the matching step in
  both packages.
- AC-000-13: initial JS 96.62 kB / CSS 4.24 kB gzip (+0.16 kB vs `main`).
- Production smoke: `/health` 200; invalid contact payload → 400 with the defined shape.

**Open items.**
- AC-000-11 (branch protection): ~~pending owner approval (OQ-000-01)~~ done, see below.
- ASM-000-09: the API `test:e2e` was not run (no local MySQL); accepted risk, partly offset by
  the production smoke.
- Retroactive G-Merge decision by the owner (C-01): approved, see below.

**AC-000-11 verification (2026-11-26).** OQ-000-01 is resolved: the `gh` session has admin
rights. After Hernán's explicit yes, the Coordinator applied branch protection to `main` and
verified it with `GET /repos/hervid2/Portfolio/branches/main/protection`:
```text
required_status_checks.contexts  ["frontend", "api"]   strict: false
enforce_admins                   false                 (owner choice, CL-08)
allow_force_pushes               false
allow_deletions                  false
required_pull_request_reviews    required_approving_review_count: 0
```
AC-000-11 → ✅ Pass. The "Pending" rows for AC-000-11 in the focus reports below are superseded.

**G-Merge (retroactive).** Hernán approved the merge of PR #4 retroactively on 2026-11-26,
after reading this consolidated verdict (C-01). The phase 7 findings are handled as follow-ups
on `chore/000-closeout`. Spec 000 → Implemented (spec v1.4).

The three focus reports follow unchanged.

---

# Validation — Spec 000 · Cycle 1/3 · Focus: compliance
**Verdict:** APPROVED (no BLOCKER or MAJOR findings; 6 MINOR, 2 SUGGESTION, listed below)

- **Range validated:** `git diff ed051a4..e11bf10`. `ed051a4` is `main` before spec 000; `e11bf10`
  is the merge commit of PR #4, now local `main`. 84 commits, 101 files.
- **Inputs read:**
  - `spec.md` v1.3, `clarifications.md` (CL-01…CL-24), `plan.md`, `tasks.md`,
    `visual-baseline.md`;
  - `AGENTS.md`, `MEMORY.md`, `docs/constitution.md`, `docs/glossary.md`, `docs/traceability.md`,
    `docs/roadmap.md`, `docs/architecture/overview.md`, GENESIS §A.4, §C.6 and D.22.
- **Context:** PR #4 was merged by the owner before phase 7, so G-Merge was skipped (C-01).
  This verdict only says whether the merged content complies. It does not replace G-Merge.
- **Where it ran:** every local run used a throwaway worktree of `e11bf10` in the session
  scratchpad, built with `npm ci` in both packages and `npx prisma generate`, the same as CI. The
  worktree was removed afterwards. No `.env` was present, as in CI. The main checkout was only
  read. `git status` there is clean.
- **Out of scope:** AC-000-09 (the visual and behavior comparison) is checked in the e2e focus,
  not here.

## Acceptance criteria coverage
| AC | Test(s) / check | Result | Evidence |
|---|---|---|---|
| AC-000-01 | CI `lint` step (frontend). Rule activity checked by AC-000-08 and the stdin probes | ✅ Pass | Local `npm run lint --prefix frontend` exit 0, 0 problems. `frontend/eslint.config.js` sets `max-len` 100, `max-lines-per-function` 40 (`skipBlankLines`, `skipComments`), `no-console`, the `jsdoc/require-*` scope of §2, and `rules-of-hooks` and `exhaustive-deps` at `error`. The test-file relaxations are present. The stdin probe hit both hooks rules (a conditional `useState`, a missing dependency) → exit 1 |
| AC-000-02 | CI `lint` step (api) and CI guard "no-console disables" | ✅ Pass | Local lint exit 0. The only `eslint-disable` lines in `api/src` and `frontend/src` are the 3 in `api/src/infrastructure/logging/logger.ts:15,25,35`. `no-console` is off only for `src/scripts/**`. Guard re-run locally → exit 0. Stdin probe: missing JSDoc and a 43-line function → 3 errors in `src/`, 0 in `*.test.ts` (relaxation works) |
| AC-000-03 | CI `format:check` and the parity guard; local Windows run | ✅ Pass | Windows 11, Git Bash: `npm run format:check` exit 0 in both packages. `cmp` of the two `.prettierrc.json` files → identical, with the 5 options of §2. `.gitattributes` holds `* text=auto eol=lf` plus the binary list. `git ls-files --eol` shows 0 files with `i/crlf` |
| AC-000-04 | CI `typecheck` step | ✅ Pass | `npm run typecheck --prefix frontend` (`tsc -b`) exit 0. `npm run typecheck --prefix api` (`tsc -p tsconfig.json --noEmit`) exit 0. The API check includes the tests: the probe type error in `src/` failed it with TS2322. Wording follows spec v1.3 |
| AC-000-05 | Vitest files (a)–(f) | ✅ Pass | Local `npm test --prefix frontend`: 6 files, 36/36 pass, coverage text + `coverage/lcov.info`, no thresholds. Every `describe` and `it` starts with `AC-000-05(x)`. Oracles come from the data (`projects`, `enDictionary`, `ALL_CATEGORIES_KEY`), not hardcoded values |
| AC-000-06 | `contactSchema.test.ts` (a), `SubmitContactMessageUseCase.test.ts` (b) | ✅ Pass | Local `npm test --prefix api`: 3 files, 38/38 pass, lcov written. (a) has all 11 BR-003 boundary cases. (b) has spies on the in-memory repository and the no-op mail service, a fake verifier, `invocationCallOrder` (save before mail) and the rejected path with nothing saved or mailed. `env.test.ts` is the D-1 characterization test, named as such (not an AC test, as the skill requires) |
| AC-000-07 | CI run on the PR | ✅ Pass (one deviation, C-01) | PR run [45905796398](https://github.com/hervid2/Portfolio/actions/runs/45905796398), on `pull_request` at head `0b905aa`: jobs `frontend` and `api` both succeed, every step and guard is green, and the artifacts `coverage-frontend` (176 kB) and `coverage-api` (81 kB) were uploaded. Post-merge `push` run on `main` at `e11bf10`: [45905884732](https://github.com/hervid2/Portfolio/actions/runs/45905884732), success. `ci.yml` has `contents: read`, no `secrets.` and `concurrency` with `cancel-in-progress: true`. The PR was not a draft (C-01) |
| AC-000-08 | Recorded verification (approved exception, §9) | ✅ Pass | See "Runs → AC-000-08". In both packages every throwaway probe failed the matching CI command: lint, max-len, format, type, test, plus the frontend build. Nothing was committed and the worktree was clean after every probe |
| AC-000-09 | Recorded verification (approved exception, §9) | ⏳ Not in this focus | Checked by the e2e reviewer. In the code, `App.tsx:38` still renders `<MotionConfig reducedMotion="user">` (ASM-000-15, code half) |
| AC-000-10 | CI DEBT-005 guard, run after the build | ✅ Pass | `git ls-files` lists none of the 6 artifacts. All are in `.gitignore:22-26`. After `npm run build --prefix frontend` the tree is clean and neither `vite.config.js` nor `tailwind.config.js` exists. Guard re-run locally → exit 0 |
| AC-000-11 | Recorded verification in `MEMORY.md` (exception) | ⏳ **Pending** | Not applied yet. Public `GET /repos/hervid2/Portfolio/branches/main` shows `"protected": false`. Blocked on OQ-000-01 (`gh auth login` with admin rights) and on Hernán's explicit yes. The spec cannot reach "Implemented" until this is done |
| AC-000-12 | CI harness guard + review | ✅ Pass (MINOR C-03 on the skill's content) | Guard re-run locally → exit 0. `AGENTS.md` has no †, has a `format` / `format:check` row, the e2e row reads "defined in spec 004 (Playwright)", the stale lines are gone and `testing-conventions` is listed. The skill folders exist in `.harness/` and `.claude/`, and the two copies are byte-identical. The skill covers location and naming, Vitest and Testing Library, jsdom shims, AC ids, fakes vs mocks, coverage, and the constructor JSDoc review check |
| AC-000-13 | CI NFR-002 guard + review against the build | ✅ Pass | `overview.md:83`: spec 000 baseline at `5cb5e13` is JS 96.62 kB / CSS 4.24 kB gzip. `main` reference: 96.46 / 4.24. A clean local build of `e11bf10` (no `.env`) gives `index-BKnSKt4S.js` 96.62 kB and `index-BFX6Q03Z.css` 4.24 kB gzip, the same values and asset hashes as T-35. The CI job log could not be read without auth; the local clean build stands in for it (ASM-000-11) |

**Traceability (Art. 3 / NFR-007):**
- Every automated AC test carries its AC id. `grep -rn "AC-000-0[56]" frontend/src api/src`
  finds (a)–(f) and (a)–(b).
- `docs/traceability.md` maps FR-002/BR-001 → AC-000-05(a)(e), FR-003/BR-002 → AC-000-05(f) and
  FR-008/BR-003 → AC-000-06(a)(b), with the test file paths.
- Only AC-000-08, -09 and -11 use the recorded-verification exception, as approved in spec §9
  (CL-02). No other AC relies on it.

**Coordinator-approved deviations checked:**
| Deviation | Recorded in | Present in the code | Result |
|---|---|---|---|
| `max-len` `ignorePattern: "^\\s*import\\s"` | tasks.md T-19, T-32 | `api/eslint.config.js:27`, `frontend/eslint.config.js:16` | ✅ Matches. `max-len` is still active on other lines (AC-000-08 probe hit it at 101 chars) |
| `HeroProfileCard` → `HeroProfileLinks` | tasks.md T-32; plan updated in `2a8c1f2` | `frontend/src/components/sections/HeroProfileLinks.tsx`; no code references to the old name | ✅ |
| F-1 reduced-motion check (no regression against the baseline) | spec v1.2 and ASM-000-15; `visual-baseline.md` F-1; DEBT-010 | Behavior check is in the e2e focus; `MotionConfig` code check ✅ | ✅ Recorded consistently |
| AC-000-04 names the `typecheck` scripts | spec v1.3, tasks.md T-34, plan §1.5, AGENTS.md | `typecheck` scripts in both `package.json` files | ✅. Leftovers: C-03, C-04 |
| `defineConfig` (`eslint/config`) wrapper in both ESLint configs | **Not found** in tasks.md, plan.md or MEMORY.md (`grep -rn "eslint/config\|defineConfig" specs docs MEMORY.md` only hits plan.md:99, which is the Vitest `defineConfig`) | `frontend/eslint.config.js:5,19`, `api/eslint.config.js:5,10` | ⚠️ Equivalent to the plan's flat array, no dependency added, but not recorded (C-07) |

**Other checks:**
- **New dependencies (Art. 10):** both `package.json` diffs match plan §7 exactly: the same 12
  frontend and 8 api dev dependencies, at the same ranges. Nothing was added to `dependencies`.
- **API contract:** `contactController.ts` still returns `400 {"message":"Captcha validation
  failed"}` and `201 {"message":"Contact message sent successfully"}`. The captcha check moved
  into the use case, as approved in CL-01.
- **No copy change (BR-006, §7):** `git diff -w --word-diff` of `src/i18n/` and `src/data/` shows
  only re-wrapping and the removed unused `DemoCredential` import. The `META_DESCRIPTION` and
  `ACTIVE_PILL_CLASS` constants hold the original strings unchanged.

## Findings
| ID | Severity | Focus | File:line | Description | Suggested action |
|---|---|---|---|---|---|
| C-01 | MINOR | compliance (process) | PR #4; spec.md §4.1b; GENESIS §A.5 | **G-Merge skipped.** PR #4 was opened at 22:35:41 and merged at 22:36:33 on 2026-11-26, before phase 7. It was not a draft PR as §4.1b requires. CI was green before the merge (the PR run finished at 22:36:21), and the owner holds the gate. So the content risk is low, but the gate order of GENESIS was not followed. | Record it in MEMORY.md and in the post-merge retrospective (GENESIS §C.9). Treat the phase 7 findings as follow-up tasks on a new `fix/` or `chore/` branch. Consider applying AC-000-11 soon: with it, a PR cannot be merged before its checks pass, though as admin (`enforce_admins: false`) the owner can still merge before validation. |
| C-02 | MINOR | compliance (constitution) | `frontend/src/components/layout/NavbarControls.tsx:23`; `frontend/src/components/sections/ContactForm.tsx:51`, `:81`; `frontend/src/components/ui/ProjectActionIcons.tsx:22,36` | **Constitution Title IV, React rules, broken in new files.** "One component per file" (`constitution.md:70`) is broken by `LanguageButton` inside `NavbarControls.tsx`, `ContactFormStatus` inside `ContactForm.tsx`, and `PlayIcon` + `KeyIcon` in `ProjectActionIcons.tsx`. The tasks.md Phase G preamble repeats the rule. Only the icon file was named in T-27, and a plan cannot amend the constitution (Art. 13). Also, `ContactForm(props)` (`:81`) does not destructure its props in the signature ("Destructured props", `constitution.md:72`). These patterns did not exist on `main`. There is no behavior impact, and lint cannot catch them. | Small follow-up task: move `LanguageButton`, `ContactFormStatus`, `PlayIcon` and `KeyIcon` into their own files, and destructure the `ContactForm` props, with no behavior change. Or, if private sub-components are wanted, have the planner propose a constitution amendment, approved by Hernán. |
| C-03 | MINOR | compliance (harness) | `.harness/skills/testing-conventions/SKILL.md:79`, `:140` (+ generated `.claude/` copy) | **The new skill tells agents to run `npx tsc -b frontend` and `npx tsc -p api --noEmit`.** These are the forms T-34 replaced, because they fail from the root: `npx --no-install tsc -v` prints "This is not the tsc command you are looking for" and exits 1. Without `--no-install`, `npx` may offer to install the unrelated `tsc` package. This contradicts AGENTS.md, spec v1.3 and plan §1.5. The older `i18n-dictionaries/SKILL.md:55` and `project-data/SKILL.md:55` have the same problem (pre-existing). | Replace with `npm run typecheck --prefix frontend` / `--prefix api` in all three skills, then run `node .harness/sync-claude-code.mjs`. |
| C-04 | MINOR | compliance (docs) | `specs/000-quality-baseline/plan.md:159` (and `:147`) | **Stale bullet left in plan §1.5.** The cut-off line "`AGENTS.md` keeps `npx tsc -b frontend` and `npx tsc -p api --noEmit` as the canonical" sits right above the line that replaced it (`:160-161`). Line 147 still says `npx tsc -p api --noEmit`. | The planner deletes line 159 and changes line 147 to the `typecheck` script. |
| C-05 | MINOR | compliance (DoD / docs) | `spec.md:2`; `MEMORY.md:4-9`; `docs/traceability.md:9,10,15`; `docs/glossary.md:24`; `docs/architecture/overview.md` (Testing strategy, CI bullet) | **Status docs are out of date after the merge.** spec.md still says `Status: Planned`; per §4.3e it should be "In validation" until AC-000-11. MEMORY.md still says phase 6 and "not pushed". The traceability rows say "pending G-Merge". The glossary "Theme mode" row still says "today local to `Navbar.tsx`", but it now lives in `types/theme.ts`. overview.md says "Both jobs are the required checks", which is not true until AC-000-11 (`protected: false`). | Coordinator: update MEMORY.md. Planner: spec status, the traceability status column, the glossary row, and "will be the required checks (AC-000-11)" in overview.md. |
| C-06 | MINOR | compliance (spec §8) | `.github/workflows/ci.yml:5-6` | **PR trigger is broader than the spec.** §8 says "`pull_request` to `main`", but the workflow has a bare `pull_request:` with no `branches: [main]` filter, so it runs for PRs into any branch. Harmless in practice: it covers more, not less. | Add `branches: [main]` under `pull_request`, or amend §8 to say "every pull request". |
| C-07 | SUGGESTION | compliance (traceability of decisions) | `frontend/eslint.config.js:5,19`; `api/eslint.config.js:5,10` | **The `defineConfig` deviation is not recorded.** The coordinator lists `defineConfig` (from `eslint/config`) as an approved deviation, but no record exists in tasks.md, plan.md or MEMORY.md. The code is fine: same behavior as a flat array, part of ESLint 10 core, no new dependency. | Add a one-line note to the T-07 / T-08 evidence, or to the plan §1.2 change note, so the decision can be traced. |
| C-08 | SUGGESTION | compliance (glossary) | `api/src/types/contact.ts:9`; `docs/glossary.md` | **New domain type missing from the glossary.** `SubmitContactMessageCommand` was added, but the glossary only lists its sibling `SubmitContactMessageResult` ("Submission outcome"). | Add a "Submission command" row when the glossary is next touched. |

No BLOCKER or MAJOR findings. Not findings, but still open:
- AC-000-11 is pending (see the coverage table).
- ASM-000-09: the local `npm run test:e2e --prefix api` against MySQL was not run here (no
  database in this session). Hernán runs it, or records it as an accepted risk.
- P-04: the worktree `C:/ADSO/JAVASCRIPT/portfolio-main-baseline` still exists. It is kept for
  the AC-000-09 e2e comparison.

## Runs
All runs used Windows 11 and Git Bash, Node 22.17, on a throwaway worktree of `e11bf10` after
`npm ci` in both packages and `npx prisma generate`. No `.env` was present.

**Pipeline (same order as CI):**
```text
frontend format:check exit 0   api format:check exit 0
frontend lint         exit 0   api lint         exit 0   (0 problems, --max-warnings 0)
frontend typecheck    exit 0   api typecheck    exit 0
frontend test         exit 0   api test         exit 0
  Test Files 6 passed (6) · Tests 36 passed (36)    Test Files 3 passed (3) · Tests 38 passed (38)
frontend build        exit 0   api build        exit 0   (api/dist/server.js present, 0 *.test.js)
  dist/assets/index-BFX6Q03Z.css  18.75 kB │ gzip:  4.24 kB
  dist/assets/index-BKnSKt4S.js  295.90 kB │ gzip: 96.62 kB
git status --porcelain after both builds → (empty); no frontend/vite.config.js, tailwind.config.js
coverage: frontend/coverage/lcov.info, api/coverage/lcov.info written
```

**CI guards (bodies copied from `ci.yml`, run at the worktree root after the builds):**
```text
DEBT-005 0 · NFR-002 0 · Prettier parity 0 · no-console disables 0 · harness docs 0
```

**AC-000-08 throwaway probes.** Each probe adds one untracked file in `src/` (`probeLint.ts`,
`probeMaxLen.ts`, `probeFormat.ts`, `probeType.ts`, `probe.test.ts`), runs the CI command, records
the exit code, then deletes the file. Nothing was staged or committed, and
`git status --porcelain` was empty after each package.
```text
[api] lint error (no-console)   | npm run lint         | exit 1 | 5:3 error Unexpected console statement no-console
[api] line over 100 chars (101) | npm run lint         | exit 1 | 1:1 error This line has a length of 101. Maximum allowed is 100 max-len
[api] formatting error          | npm run format:check | exit 1 | [warn] src/probeFormat.ts
[api] type error                | npm run typecheck    | exit 2 | src/probeType.ts(1,14): error TS2322
[api] failing test              | npm run test         | exit 1 | FAIL src/probe.test.ts > probe fails on purpose
[frontend] lint error (no-console)   | npm run lint         | exit 1 | 5:3 error Unexpected console statement no-console
[frontend] line over 100 chars (101) | npm run lint         | exit 1 | 1:1 error ... length of 101 ... max-len
[frontend] formatting error          | npm run format:check | exit 1 | [warn] src/probeFormat.ts
[frontend] type error                | npm run typecheck    | exit 1 | src/probeType.ts(1,14): error TS2322
[frontend] failing test              | npm run test         | exit 1 | FAIL src/probe.test.ts > probe fails on purpose
[frontend] type error breaks build   | npm run build        | exit 1 | src/probeType.ts(1,14): error TS2322
```

**Extra rule probes** (`npx eslint --stdin`, no file written):
```text
api src/probe.ts:      jsdoc/require-jsdoc ×2, max-lines-per-function (43) → exit 1
api src/probe.test.ts: same function body → exit 0 (CL-13 relaxation works)
frontend src/hooks/useProbe.ts: react-hooks/rules-of-hooks + react-hooks/exhaustive-deps → exit 1
```

**GitHub (public REST, no auth):**
```text
CI run 45905796398  pull_request  feat/000-quality-baseline 0b905aa  success  (22:35:46 → 22:36:21)
   jobs frontend, api: success · artifacts coverage-frontend, coverage-api
CI run 45905884732  push          main e11bf10                         success
PR #4: created 22:35:41, merged 22:36:33 (not a draft)
GET /branches/main → "protected": false   (AC-000-11 pending)
```

**Root `npx tsc` (C-03):**
```text
$ npx --no-install tsc -v
This is not the tsc command you are looking for ... exit 1
```

**Cleanup:** `git worktree remove --force <scratchpad>/val-000` and `git worktree prune`. The force
was needed because of the ignored `node_modules`, `dist` and `coverage` folders. Main checkout
`git status --short` → empty.

## Definition of Done checklist (GENESIS §C.6)
- [x] All tasks completed with evidence: T-01…T-38 are checked with commit SHAs and Verify
  output. P-01 is effectively done (PR #4 run green). P-02 is this validation, plus the e2e and
  quality-security reviews. P-03 and P-04 are still open.
- [x] Every AC covered by at least one green test, or by the approved exception: AC-000-01…07,
  10, 12 and 13 are automated and green. AC-000-08 is recorded here. AC-000-09 is in the e2e
  focus. AC-000-11 is pending (allowed by §9, but blocks "Implemented").
- [x] Linter, formatter, type checking and full suite green, locally and in CI: both packages,
  locally and in runs 45905796398 and 45905884732.
- [ ] e2e validation of the spec's flows, with evidence: the AC-000-09 visual matrix belongs to
  the e2e reviewer. Not checked in this focus.
- [x] No secrets, no `TODO` without a ticket, no dead code or debug logs. `ci.yml` has no
  `secrets.`, and no `.env` was added. `console` is reachable only through `logger.ts` and
  `src/scripts/**`, both allowed. The unused `DemoCredential` import was removed.
- [ ] Spec, `traceability.md`, `roadmap.md`, `MEMORY.md` (and ADR, README, changelog if they
  apply) updated. `roadmap.md` is done (DEBT-001 and DEBT-005 closed; DEBT-010, 013 and 014
  added) and the `traceability.md` rows exist, but the spec status, the traceability status,
  MEMORY.md and the glossary are out of date (C-05). No ADR is needed (plan §9).
- [ ] APPROVED verdict from the Reviewer and human approval of the merge. This focus is
  APPROVED; the e2e and quality-security verdicts are still to come. The merge happened without
  G-Merge (C-01).


---

# Validation — Spec 000 · Cycle 1/3 · Focus: e2e
**Verdict:** APPROVED (e2e focus; no BLOCKER or MAJOR findings)

> Context: PR #4 was merged into `main` (e11bf10) and deployed to production before validation
> (G-Merge skipped). This validation is therefore post-merge: it checks `main` = e11bf10 locally
> and the live production deployment. Reviewer: e2e instance. Date: 2026-11-26.

## Acceptance criteria coverage
| AC | Test(s) | Result | e2e evidence |
|---|---|---|---|
| AC-000-09 | Recorded verification (approved exception, spec §9): capture script `.evidence/000-quality-baseline/capture.js` re-run unchanged against e11bf10 on port 4174, then a per-shot canvas pixel diff (plan §6) | **PASS** | 40/40 shots at **0.0000 %** of pixels over the threshold (tolerance ≤ 0.1 %); 39/40 byte-identical in RGBA; all text records equal; console sources equal (see Runs) |
| AC-000-13 (cross-check only; owned by quality-security) | Independent local build of e11bf10 with no `VITE_*` values | Consistent | Initial JS `index-BKnSKt4S.js` 96.62 kB gzip, CSS `index-BFX6Q03Z.css` 4.24 kB gzip, the same as `docs/architecture/overview.md:83`. CSS hash is identical to `main` before spec 000 (`ed051a4`) |

## Findings
| ID | Severity | Focus | File:line | Description | Suggested action |
|---|---|---|---|---|---|
| E2E-01 | MINOR (pre-existing, not a regression) | e2e / i18n | `frontend/src/components/layout/NavbarControls.tsx:67` (was `Navbar.tsx:125` at ed051a4) | The mobile menu toggle label `Menu` is a hardcoded English string; in ES at 360 px it still reads "Menu" (`branch/prod-home-es-light-360.png`). Violates the constitution rule that every user-visible string lives in `i18n/{en,es}.ts`. Spec 000 only moved it during the `Navbar` split, so the move is correct, but the string now sits in a file created by this spec. | Add a DEBT entry (or fold it into DEBT-012's bilingual-strings fix) in a later spec; not 000 |
| E2E-02 | MINOR (pre-existing, not a regression) | e2e / a11y | none sets it: `git grep "documentElement.lang"` finds nothing at HEAD or ed051a4 | With ES selected, `<html lang>` stays `en` (production check at 360 and 1280, both themes). Screen readers will read the Spanish content with English pronunciation (WCAG 3.1.1). ASM-010 covers pre-rendered HTML being EN only, but not the runtime switch. | Record as debt; fix in a later spec (e.g. spec 004 a11y), with the language context syncing `document.documentElement.lang` |
| E2E-03 | SUGGESTION | e2e / i18n | Turnstile widget (`useTurnstileWidget`) | In production the Turnstile widget renders in the browser locale (`lang=auto`): "Verificando…" while the site is in EN (`branch/prod-contact-validation-en-dark-1280.png`). It is not visible in the baseline because local builds have no site key. | Consider passing `language` from the active UI language when the widget is rendered (later spec) |
| E2E-04 | SUGGESTION | process / environment | `frontend/node_modules` (local, untracked) | The shared local `frontend/node_modules` was incomplete when validation started (`postcss-js` missing, so `npm run build` failed with "Cannot find module './process-result'"). Several dev and preview servers from other sessions (ports 5173, 5179, 4179) hold `esbuild.exe`, so `npm ci` fails with EPERM. I repaired it with `npm install` (lockfile unchanged), but it was being modified again concurrently (`@types/react` lost `index.d.ts`). The validated build was made from a clean `git archive HEAD` export in the scratchpad. | Before the next local runs, Hernán (or the coordinator) stops stray dev/preview servers and runs `npm ci --prefix frontend` once; parallel reviewers should not reinstall a shared `node_modules` |

Pre-existing issues seen and **not** reported as regressions (unchanged against the baseline):
DEBT-010 (F-1, the same 32 transforms), DEBT-011 (F-2, focus stays on the trigger), DEBT-012 (F-3,
raw `Failed to fetch`). DEBT-013 (ProjectCard ref warning) did not appear in the production
console, which is expected for a production React build.

## Runs
### 1. Build of e11bf10 under baseline conditions
- `frontend/.env` exists locally (git-ignored; holds `VITE_API_BASE_URL` and
  `VITE_TURNSTILE_SITE_KEY`), while the baseline was built with no `.env`. To match it, I exported
  the commit with `git archive HEAD frontend` into the scratchpad (no `.env`), then ran
  `npm ci` (399 packages) and `npm run build`.
- Build output: `index-BFX6Q03Z.css` 18.75 kB / **4.24 kB gzip**, `index-BKnSKt4S.js` 295.90 kB /
  **96.62 kB gzip**, lazy chunks About 1.20 kB, Contact 2.07 kB, Portfolio 8.22 kB gzip. The
  `localhost:4000` fallback is present in the Contact chunk and no Turnstile site key is in the
  build, so the conditions match the baseline.
- Served with `npx vite preview --port 4174 --strictPort` from the export.

### 2. Capture (Playwright MCP, `browser_run_code_unsafe` with `filename: .evidence/000-quality-baseline/capture.js`, unchanged)
- `port: 4174`, `out: …/branch`, 40 shots written.
- Console: 38 errors, 0 warnings, 0 page errors, the same as the baseline:

  | Source | Baseline | e11bf10 |
  |---|---|---|
  | `ERR_FAILED` `challenges.cloudflare.com/turnstile/v0/api.js` (blocked by emulation) | 37 | 37 |
  | `ERR_FAILED` `localhost:4000/api/contact` (aborted on purpose, state 8) | 1 | 1 |
  | anything else | 0 | 0 |

### 3. Text records (`baseline/records.json` vs `branch/records.json`, compared with a Node script)
| Record | Result |
|---|---|
| `videoModal` (focus on open = trigger, not in dialog; 0 dialogs after Esc; focus returns to trigger, `:focus-visible`) | EQUAL |
| `credentialsModal` (same pattern) | EQUAL |
| `tabSequence` (35 entries: 34 stops, all `fv`, then `body`) | EQUAL |
| `reducedMotionTransforms` (baseline stored compressed; expanded to 32 entries) | EQUAL: 32 entries, same order; 28 × `matrix(1,0,0,1,0,24)` + 4 × `matrix(0.96,0,0,0.96,0,24)`, as F-1 requires |
| `persistence` (`es`, `light`, `theme-light` on `<html>`, first nav label `Inicio`) | EQUAL |

Contact states: validation "Please complete all fields before sending." and API error raw
`Failed to fetch`. Both are pixel-identical to the baseline shots.

### 4. Pixel diff (plan §6: `OffscreenCanvas` in the Playwright browser; a pixel differs if any RGBA channel differs by > 25/255; tolerance ≤ 0.1 %)
PNGs were served from `.evidence/000-quality-baseline/` with `python -m http.server` (no new
dependency). Dimensions match for all pairs: 360×780 or 1280×800.

| Shot | Pixels > 25/255 | % | Any delta |
|---|---|---|---|
| home-{en,es}-{dark,light}-360 (4) | 0 | 0.0000 % | 0 |
| home-{en,es}-{dark,light}-1280 (4) | 0 | 0.0000 % | 0 |
| portfolio-{en,es}-{dark,light}-360 (4) | 0 | 0.0000 % | 0 |
| portfolio-{en,es}-{dark,light}-1280 (4) | 0 | 0.0000 % | 0 |
| about-{en,es}-{dark,light}-360 (4) | 0 | 0.0000 % | 0 |
| about-en-dark-1280, about-en-light-1280, about-es-light-1280 | 0 | 0.0000 % | 0 |
| **about-es-dark-1280** | **0** | **0.0000 %** | 25,570 sub-threshold pixels (see note) |
| contact-{en,es}-{dark,light}-360 (4) | 0 | 0.0000 % | 0 |
| contact-{en,es}-{dark,light}-1280 (4) | 0 | 0.0000 % | 0 |
| extra-mobile-menu-en-dark-360 | 0 | 0.0000 % | 0 |
| extra-video-modal-en-dark-1280 | 0 | 0.0000 % | 0 |
| extra-credentials-modal-en-dark-1280 | 0 | 0.0000 % | 0 |
| extra-card-hover-en-dark-1280 | 0 | 0.0000 % | 0 |
| extra-card-tap-en-dark-360 | 0 | 0.0000 % | 0 |
| extra-contact-validation-en-dark-1280 | 0 | 0.0000 % | 0 |
| extra-contact-api-unreachable-en-dark-1280 | 0 | 0.0000 % | 0 |
| extra-persist-es-light-1280 | 0 | 0.0000 % | 0 |

Note on `about-es-dark-1280`: every changed pixel lies in a 237×237 box at (90,185)–(326,421),
which is the round profile photo (`h-60 w-60`). Maximum channel delta is 4/255 (histogram:
Δ1 = 24,997, Δ2 = 552, Δ3 = 20, Δ4 = 1). This is image-decode or raster noise, not a change in
the UI. No side-by-side review is needed, because no shot exceeds the tolerance.

### 5. Production smoke (https://portfolio-hernan-cardona.vercel.app)
- **Deployed commit:** the GitHub Deployments API shows `Production` → `e11bf10787a6…`
  (2026-11-26T22:36:53Z), commit status `Vercel: success`. The served CSS is `index-BFX6Q03Z.css`.
  The JS hash differs from the local build because production inlines its `VITE_*` values.
- **Matrix** (360 and 1280 × EN and ES × dark and light, 8 loads): every load had 4/4 sections and
  4 project cards, no horizontal scroll, the right theme class, and nav label `Home` / `Inicio`.
  Screenshots: `branch/prod-home-{en,es}-{dark,light}-{360,1280}.png`.
- **Contact client-side validation** (EN dark 1280, empty form submitted): shows "Please complete
  all fields before sending."; **0 requests to `/api/contact`**, so no real message was sent. The
  Turnstile widget is rendered. Screenshot: `branch/prod-contact-validation-en-dark-1280.png`.
- **Console:** after excluding `challenges.cloudflare.com`, 0 errors and 0 warnings. Every logged
  error and warning comes from inside the Cloudflare Turnstile iframe: its `%c%d` devtools probes,
  CSP `connect-src data:` violations inside the challenge, WebGPU "No available adapters", and an
  OTS WOFF2 warning. The failed requests are `ERR_ABORTED` from the script's own reloads, plus
  `brunhild.challenges.cloudflare.com` `ERR_NAME_NOT_RESOLVED` (Cloudflare). The app logs no
  error of its own.

### Evidence (git-ignored)
`.evidence/000-quality-baseline/branch/`: 40 matrix and extra PNGs, `records.json`,
`console.log`, 9 `prod-*.png`.

### Not covered by this e2e pass
- axe and Playwright e2e suites are deferred to spec 004 (spec §3, owner decision). Keyboard and
  focus were covered by the recorded tab sequence and the modal records above.
- No pre-rendered routes exist yet (ADR-0003 lands later), so the raw-HTML `curl` check does not
  apply.

## Definition of Done checklist (GENESIS §C.6), e2e items
- [x] e2e validation of the spec's flows, with evidence: AC-000-09 passes (40/40 shots, records,
      console), and the production smoke passes.
- [x] No new console errors on the branch build (same two emulation sources as the baseline) or
      in production (only third-party Turnstile messages).
- [x] Both languages, both themes, 360 and 1280 px checked locally (diff) and in production.
- [ ] APPROVED verdict from the Reviewer **and human approval of the merge**: the e2e verdict is
      APPROVED, but G-Merge was skipped (merged before validation). The coordinator must record a
      retroactive G-Merge decision with Hernán.
- n/a here (other focuses): tests, lint, CI, docs and traceability (compliance and
      quality-security reviewers).


---

# Validation — Spec 000 · Cycle 1/3 · Focus: quality-security
**Verdict:** APPROVED (no BLOCKER or MAJOR within spec 000 scope; 3 MINOR, 4 SUGGESTION; 3
pre-existing risks escalated separately, outside the verdict)

- **Range validated:** `ed051a4..e11bf10` on local `main` (PR #4 merge; tree identical to PR head
  `0b905aa`, `git diff --stat 0b905aa e11bf10` is empty).
- **Context:** PR #4 was merged before validation (G-Merge skipped). The API host auto-deploys
  from `main` (owner confirmed via Coordinator), so the API changes are **live**.
- **Reviewer:** quality-security · 2026-11-26 · Node 22.17.0 · Windows 11.
- **Isolation:** every clean install, run and mutation ran in a pristine
  `git archive e11bf10` copy in the agent scratchpad, not in the working tree.

## Acceptance criteria coverage (this focus)
| AC | Test(s) / check | Result | Evidence |
|---|---|---|---|
| AC-000-01 | `npm run lint --prefix frontend` | PASS (exit 0) | Runs R-2; rule activity: R-6 |
| AC-000-02 | `npm run lint --prefix api`; CI guard "no-console disables" | PASS | R-2, R-6; CI api job |
| AC-000-03 | `npm run format:check` both packages (Windows, local) | PASS (exit 0) | R-2 |
| AC-000-04 | `npm run typecheck` both packages | PASS (exit 0) | R-2 |
| AC-000-05 (a)–(f) | 6 files, 36 tests, all named `AC-000-05(x) …` | PASS 3/3 runs | R-3 |
| AC-000-06 (a)(b) | 2 files, 13 tests, named `AC-000-06(x) …` (+25 D-1 env tests) | PASS 3/3 runs | R-3 |
| AC-000-07 | CI run on PR #4 and on the push to `main` | PASS | R-9 |
| AC-000-08 | Supporting evidence only (the owning record is in the compliance report) | Every gate rejects its mutation | R-6 |
| AC-000-10 | `git ls-files` (0 hits), `.gitignore` lines 22–26, clean build, CI guard | PASS | R-4, R-9 |
| AC-000-12 | CI guard "harness docs"; `.harness` and `.claude` skill copies are identical | PASS | R-9 |
| AC-000-13 | Local build 96.62 kB JS / 4.24 kB CSS gzip = the recorded baseline row | PASS | R-4 |

AC-000-09 (visual) and AC-000-11 (branch protection) are outside this focus.

## Findings
| ID | Severity | Focus | File:line | Description | Suggested action |
|---|---|---|---|---|---|
| QS-01 | MINOR | security / deps | `frontend/package-lock.json`, `api/package-lock.json` (`vitest` 3.2.7, `tinypool` 1.1.1, `@vitest/mocker` 3.2.7, `test-exclude`/`glob`/`minimatch`) | Spec 000 **introduces** 7 dev-only advisories per package (2 critical, 5 moderate): tinypool GHSA-5gmw-xhrv-c9v3 / GHSA-85c8-ppgw-ccpr (prototype-pollution gadget → RCE); @vitest/mocker GHSA-82fw-gwwq-j7x9 / GHSA-qxg6-89mg-rqv8; glob GHSA-3g3m-2fjr-6pw4; minimatch GHSA-g3hv-75wg-m249. The only fix is `vitest@5.1.2` (a major; needs Vite ≥ 6 → DEBT-007). There is no fixed 3.x: `vitest@3.2.7` is the last 3.x and pins `tinypool ^1.1.1`. **Not in any runtime artifact** (0 non-dev lock entries changed, R-7). Not reachable as used: tests run with `vitest run`, with no `--api`, UI or browser mode, and the tinypool gadget needs a separate prototype pollution. Exposure is limited to CI runners (read-only token, no secrets) and dev machines. However, plan §7 and DEBT-009 do not record this accepted risk. | Amend DEBT-009 in `docs/roadmap.md` to name these advisories as an accepted dev-only risk, cleared by the Vitest 5 move with DEBT-007. No code change now. |
| QS-02 | MINOR | CI | `.github/workflows/ci.yml:5` | `pull_request:` has no `branches: [main]` filter. Spec §8 says "`pull_request` to `main`". The workflow also runs on PRs targeting other branches. This is harmless (read-only, no secrets) and still reports the required contexts, but it deviates from the spec text. | Add `branches: [main]` under `pull_request`, or amend spec §8 to "any PR" (Art. 13, spec first). |
| QS-03 | MINOR | quality / live API | `api/src/interfaces/http/controllers/contactController.ts:54-71` | The new controller mapping (`captcha-rejected` → `400 {"message":"Captcha validation failed"}`, `accepted` → `201`) has no automated test (HTTP tests deferred, ASM-000-04). The production smoke could not exercise it safely (only the validation 400 path, R-8). Code review: equivalent to `ed051a4`. Captcha is verified before `save` and the mail send, the response bodies and status codes are byte-identical, `NoopCaptchaVerifier` reproduces the old "skip when disabled" path, and a verifier exception still propagates to `next(error)` → 500 with nothing stored (as before). The use-case half is tested (AC-000-06(b)). | Accepted residual risk. Hernán checks the host startup log line `[API] Runtime config: … captcha=<flag>` (unchanged by the logger). Optionally, one manual submit through the live form. Add HTTP-level tests (supertest) in the spec that lifts ASM-000-04. |
| QS-04 | SUGGESTION | tests / DX | `.harness/skills/testing-conventions/SKILL.md` | Windows coverage artifact **confirmed local-only**. With a lowercase `c:` cwd (cmd `cd /d c:\…\api`), v8 reports each tested file twice (100% and 0% rows) and "All files" drops from 34% to 14.61%. With an uppercase `C:` cwd (PowerShell, or the scratch copy) the duplicates are gone. CI runs on Linux (no drive letter); its artifacts are `coverage-api` (81 KB) and `coverage-frontend` (176 KB). | Add one line to the skill: "On Windows run coverage from a `C:`-cased cwd (PowerShell); a `c:` cwd duplicates rows (local artifact only)". Then regenerate the adapter. |
| QS-05 | SUGGESTION | CI supply chain | `.github/workflows/ci.yml:24,27,47` (and the api job) | Actions are pinned to major tags (`@v7`), as spec §8 and plan §1.8 require. A moved tag would run new code. The blast radius is small (`contents: read`, no secrets). | Consider commit-SHA pins plus Dependabot for `github-actions` in a later chore. |
| QS-06 | SUGGESTION | lint config | `frontend/eslint.config.js:16`, `api/eslint.config.js:25` | `ignorePattern: "^\\s*import\\s"` exempts **every** `import` line from `max-len`, not only single-specifier ones (coordinator decision T-19/T-32). Prettier still wraps multi-specifier imports at 100, so the practical gap is small. | Keep, or narrow the pattern to single-specifier imports when convenient. |
| QS-07 | SUGGESTION | tests | `api/src/application/use-cases/SubmitContactMessageUseCase.test.ts:38` | `vi.useFakeTimers()` fakes every timer, but only `Date` is needed. It is not flaky today (3/3 runs). A future dependency that awaits a timer would hang the test. | Use `vi.useFakeTimers({ toFake: ["Date"] })`. |

### Pre-existing risks found (not introduced by spec 000; excluded from the verdict; escalate)
| ID | Severity (own) | Where | Description | Suggested action |
|---|---|---|---|---|
| PE-01 | MAJOR (pre-existing, live) | `api/package-lock.json` runtime deps | `npm audit --omit=dev` on `api`: **9 runtime advisories, identical at `ed051a4` and `e11bf10`**. Critical: `proxy-addr` (GHSA-jqcg-44mw-7w3h). High: `body-parser` (GHSA-v422-hmwv-36x6), `path-to-regexp` (GHSA-37ch-88jc-xwx2), `nodemailer` (GHSA-mm7p-fcc7-pg87), `zod` (GHSA-mrhx-c7xc-m3w5). Moderate: `qs`, `resend`, `svix`, `uuid`. Most have non-major fixes (`fixAvailable: true`); `nodemailer` → 10 and `zod` → 4 are majors. As configured, reachability looks low (no `trust proxy` subnet, no route params, a valid `100kb` body limit, a strings-only schema), but this is **not verified**. Frontend runtime: 0 advisories. | A separate `/bug` or chore spec: `npm audit fix` (non-major) in `api/`, plus a build and the API smoke. Plan the majors separately. Record as DEBT now. **Resolved by BUG-api-runtime-advisories (9 → 2 runtime advisories, 2026-11-27); remainder → DEBT-019.** |
| PE-02 | MINOR (pre-existing, inference) | `api/src/app.ts` (no `app.set("trust proxy", …)`) | Production sits behind nginx (`Server: nginx/1.24.0`, R-8). Without `trust proxy`, `request.ip` is probably the proxy address. If so, the 5-per-15-min contact rate limit is **one shared bucket for all visitors**, and Turnstile gets the proxy IP as `remoteip`. Spec 000 kept this unchanged (the controller still passes `request.ip`). | Verify on the host (nginx `X-Forwarded-For` config). If confirmed, add a DEBT and set `trust proxy` to the exact hop count in a later spec. **Resolved by BUG-api-trust-proxy (2026-11-27): topology verified (nginx on the same host → localhost:4000); `trust proxy` = loopback; nginx must set X-Forwarded-For/X-Real-IP to $remote_addr (applied by Hernán before merge).** |
| PE-03 | SUGGESTION (pre-existing) | `api/src/interfaces/http/middlewares/errorHandler.ts:22-24` | In production, unhandled errors are not logged at all (OWASP A09). The new `logger` makes a production-safe log (method, path, error name, with no body or PII) a one-line change. | Fold into a later API spec. |

Frontend dev-only advisories (`vite` 5.4, `esbuild`, `postcss`, `nanoid`, …: 10 entries) are
identical at `ed051a4`. They are already tracked by DEBT-007.

## Code review summary (refactors)
- **Captcha seam:**
  - Files: `SubmitContactMessageUseCase.ts` and `contactController.ts`.
  - The order (verify → stamp `submittedAt` → save → mail) and the HTTP contract are preserved.
  - The typed result is a discriminated union (`types/contact.ts:18`). OK.
- **`getEnvConfig` split (`env.ts`):**
  - The same messages, the same validation order (PORT → DATABASE_URL → SMTP_PORT → mail →
    captcha), the same trimming and the same defaults. `parseAllowedOrigins` now runs earlier
    but cannot throw.
  - The D-1 characterization test (`env.test.ts`, 25 cases) passes **against both** the pre-split
    file (`60cb2d2`, which differs from `ed051a4` only by JSDoc) and HEAD (R-5).
  - Production `/health` 200 after the auto-deploy shows that startup with the real env succeeds
    (R-8).
- **Logger (`logger.ts`):** a pure pass-through. It is the only `eslint-disable no-console` (CI
  guard green). No user input is logged; `server.ts` logs only env flags and counts.
- **Diagnostic scripts:** pure restructuring into helpers. They use the same Prisma operations and
  the same cleanup.
- **Frontend splits, sampled:**
  - `useModalBehavior` is a verbatim extraction of the two modal effects (same deps `[onClose]`
    and `[]`).
  - `useThemeMode` matches the old `Navbar` logic.
  - `useTurnstileWidget` matches the old `ContactSection` effect. Its deps changed from
    `[isTurnstileEnabled, siteKey]` to `[siteKey, onToken]`, and `onToken` is stable
    (`useCallback` over a stable `updateField`). So there is no re-mount; plan R-10 is met.
  - `useContactForm`: `resolveValidationError` keeps the same order and the same messages.
  - The `App.tsx` meta and fallback copy are unchanged (R-12 kept as-is).
- **OWASP Top 10 (touched API code):**
  - A01: N/A (public endpoint).
  - A03: Zod validation before the controller; Prisma parameterized. Unchanged.
  - A04: the captcha still fails closed when enabled.
  - A05: Helmet headers present in production (R-8); CORS allow-list unchanged.
  - A06: QS-01 and PE-01.
  - A09: PE-03.
  - A10 (SSRF): the Turnstile URL is a constant.
  - No new attack surface.
- **Secrets:**
  - No secret-like strings in the added lines. The only matches are fake fixtures
    (`mysql://user:pass@…` in `env.test.ts`) and identifiers.
  - Tracked env files: only `api/.env.example` and `frontend/.env.example`, both placeholders and
    unchanged in the range.
  - The workflow has no `secrets.` references and declares `permissions: contents: read` at the
    top level.
- **CI workflow:**
  - Job ids and names are `frontend` / `api`.
  - `concurrency` `${{ github.workflow }}-${{ github.ref }}` with `cancel-in-progress: true`.
  - Node comes from `.nvmrc` (`22`), with an npm cache keyed per lockfile.
  - Uploads run with `if: ${{ !cancelled() }}`.
  - The guards run under `shell: bash` (`-eo pipefail`). Their logic is correct:
    - the DEBT-005 guard runs after the build;
    - the `A && … || { error; exit 1 }` form fails as intended;
    - the `no-console` grep pipeline ends in `|| true`, so an empty result does not trip
      `pipefail`.

## Runs
- **R-1 Clean install** (`npm ci`, both packages, scratch copy): exit 0.
  - Note: a first `npm ci --prefix frontend` in the working tree failed with `EPERM unlink
    esbuild.exe`, because esbuild processes from another session hold the binary. That partly
    emptied `frontend/node_modules`. The reviewer restored it with `npm install` (lockfile
    unchanged; `npm ls --depth=0` clean; `git status` clean) and then moved all runs to the
    scratch copy.
- **R-2 Format, lint and types** (scratch): `format:check`, `lint` and `typecheck` all exit 0 in
  `frontend` and `api` (6/6).
- **R-3 Tests ×3** (scratch):
  - Frontend: 6 files, 36 tests passed in runs 1, 2 and 3 (86 s / 31 s / 44 s; the duration is
    jsdom environment start-up on Windows). Coverage: All files 21.07% statements; the AC targets
    are at 100% (`useProjectFilter`, `useThemeMode`, `LanguageContext`, `ProjectFilterBar`,
    `projectCardIdentity`, `en`/`es`).
  - API: 3 files, 38 tests passed in all 3 runs (8.0 s / 5.9 s / 4.9 s). Coverage: All files 34%;
    `env.ts`, `SubmitContactMessageUseCase.ts` and `contactSchema.ts` at 100%.
  - Oracles derive from data or contract constants (categories from `projects`, labels from
    `enDictionary`/`esDictionary`, the storage keys as named contracts). The drift self-tests
    prove the dictionary walkers can fail.
  - The only timer use is fake timers for `Date` in the use-case test. No sleeps, `waitFor` or
    real timeouts.
- **R-4 Builds** (scratch):
  - `npm run build --prefix frontend`: exit 0. `index-*.js` is 295.90 kB raw, **96.62 kB gzip**;
    CSS is **4.24 kB gzip**. These match the `docs/architecture/overview.md:83` baseline row.
  - Against main before spec 000 (96.46 kB): +0.16 kB (+0.17%). Within NFR-002 (≤ 10%, and
    measured from this baseline onward).
  - No `vite.config.js`, `tailwind.config.js` or `*.tsbuildinfo` beside the sources
    (`tsconfig.node.json` emits to `node_modules/.tmp`).
  - `npm run build --prefix api`: exit 0. `dist/server.js` exists; 0 `*.test.*` files in `dist`
    (`tsconfig.build.json` excludes them).
- **R-5 D-1 characterization:** with `env.ts` from `60cb2d2` (pre-split) swapped into the scratch
  copy, `npx vitest run src/config/env.test.ts` passes 25/25. HEAD also passes (in R-3).
- **R-6 Gate mutations** (scratch only, never committed), as exit codes in `frontend` / `api`:

  | Mutation | Command | frontend | api |
  |---|---|---|---|
  | `console.log` | `eslint --max-warnings 0` | 1 | 1 |
  | 110-char line | eslint | 1 | 1 |
  | 42-line function | eslint | 1 | 1 |
  | exported function without JSDoc | eslint | 1 | 1 |
  | formatting error | `prettier --check` | 1 | 1 |
  | type error | `npm run typecheck` | 1 | 2 |
  | failing test | `vitest run` | 1 | 1 |

  A component with a missing effect dependency and a conditional hook reports
  `react-hooks/exhaustive-deps` and `react-hooks/rules-of-hooks`.
- **R-7 Dependencies against plan §7:**
  - `dependencies` are unchanged in both packages.
  - Dev additions are exactly the plan's lists: frontend 13 (`@eslint/js`, `@testing-library/dom`,
    `@testing-library/jest-dom`, `@testing-library/react`, `@vitest/coverage-v8`, `eslint`,
    `eslint-config-prettier`, `eslint-plugin-jsdoc`, `eslint-plugin-react-hooks`, `jsdom`,
    `prettier`, `typescript-eslint`, `vitest`) and api 8 (the shared subset). Nothing was removed
    or changed.
  - Locked versions: eslint 10.15.0, @eslint/js 10.0.1, typescript-eslint 8.74.0,
    eslint-plugin-react-hooks 7.1.1, eslint-plugin-jsdoc 63.3.3, eslint-config-prettier 10.1.8,
    prettier 3.10.1, vitest 3.2.7, @vitest/coverage-v8 3.2.7, jsdom 29.1.1,
    @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/jest-dom 7.0.1.
  - TypeScript was already 5.9.3 at `ed051a4`. Vite dedupes to 5.4.21 in frontend; api gets Vite
    7.3.8 as a dev transitive of Vitest.
  - **0 non-dev lock entries changed** in either package.
- **R-7b `npm audit`** (lockfiles from `git show <rev>:<pkg>/package*.json`):

  | Package @ rev | All (L / M / H / C) | Runtime only (`--omit=dev`) |
  |---|---|---|
  | frontend @ `ed051a4` | 1 / 3 / 6 / 0 (10) | 0 |
  | frontend @ `e11bf10` | 1 / 8 / 6 / 2 (17) | 0 |
  | api @ `ed051a4` | 1 / 4 / 4 / 1 (10) | 9 |
  | api @ `e11bf10` | 1 / 9 / 4 / 3 (17) | 9 (identical) |

  The delta (+7 per package) is entirely the Vitest dev chain (QS-01).
- **R-8 Production smoke** (Coordinator-authorized; nothing stored or sent):
  - `GET https://api-portfolio.hernan-cardona.com/health` → `200 {"message":"API is healthy"}`,
    with Helmet headers (CSP, HSTS, nosniff, …) and `Server: nginx/1.24.0`.
  - One `POST /api/contact` (one of the 2 allowed) with `{"name":"A","email":"not-an-email",
    "message":"short"}` → `400 {"message":"Invalid request payload","issues":[…]}`. The issues are
    `too_small` name (min 2), `invalid_string` email and `too_small` message (min 10): exactly
    the `validateRequest` + `contactSchema` shape. `RateLimit-Limit: 5`,
    `RateLimit-Remaining: 4`.
  - The second POST was not sent, to save the shared rate-limit quota (PE-02).
- **R-9 CI:**
  - PR run 45905796398 (`pull_request`, head `0b905aa`): success.
  - Post-merge run 45905884732 (`push`, `e11bf10`): success.
  - Every step in both jobs succeeded, including the 5 guards.
  - Artifacts `coverage-frontend` (176 KB) and `coverage-api` (81 KB) were uploaded in both runs.
  - Read via the public GitHub REST API.
- **R-10 CL-22 / ASM-000-09 API smoke:** nothing listens on port 3306 and there is no MySQL
  service, so `npm run test:e2e --prefix api` was **not run**. Accepted risk per ASM-000-09.
  Partly mitigated by:
  - CI `build`;
  - the D-1 test;
  - the production `/health` and validation smoke (R-8), which confirms the live boot with the
    split `getEnvConfig` and the logger.

  Still unverified end to end: the persist + mail path and the captcha-rejected HTTP path
  (QS-03).

## Definition of Done checklist (GENESIS §C.6) — this focus
- [x] Linter, formatter, type checking and full suite green, locally (R-2, R-3) and in CI (R-9).
- [x] Every AC in this focus has a green test or CI check (table above). AC-000-09 and AC-000-11
  are owned by the other reports or post-merge.
- [x] No secrets; the workflow uses no secrets; `permissions: contents: read`.
- [x] No dead code or debug logs in the touched code; `console` only in `logger.ts` and
  `src/scripts/**`. No `TODO` added in the range (`grep` of the added lines).
- [x] New dependencies match plan §7 exactly, dev-only, with exact versions in the lockfiles.
  The audit delta is recorded (QS-01; DEBT-009 amendment pending).
- [x] NFR-002 baseline verified against an independent build (96.62 / 4.24 kB).
- [ ] Human approval of the merge: **G-Merge was skipped** (PR #4 merged before validation).
  The Coordinator should record a retroactive G-Merge decision.
- [ ] AC-000-11 (branch protection) is still pending (OQ-000-01).


---

