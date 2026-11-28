# Validation — Spec 001 (consolidated) · Cycle 1/3

**Consolidated verdict: APPROVED** — the one MAJOR finding (C-01) is resolved in `9a1d2b6`; no
BLOCKER or MAJOR finding is open across the three focuses. Consolidated and re-verified by the
reviewer on 2026-11-27 at HEAD `9a1d2b6` (GENESIS §C.3). Self-correction cycles used: **1 of 3**.

| Focus | Verdict (HEAD `f154d8e`) | After cycle 1 (HEAD `9a1d2b6`) | Findings |
|---|---|---|---|
| Compliance | CHANGES REQUIRED | APPROVED | 1 MAJOR (C-01, resolved), 3 MINOR (C-02…C-04, resolved), 3 SUGGESTION (C-05…C-07, open) |
| e2e | APPROVED | APPROVED | 6 pre-existing on `main` (E-01…E-06): 2 new debts, 1 debt extended, 2 already tracked, 1 environment |
| Quality-security | APPROVED | APPROVED | 3 MINOR (QS-01…QS-03, resolved), 5 SUGGESTION (QS-04…QS-08, open) |

**Range.** `main...HEAD` = `77db57c..9a1d2b6`: 56 commits, 58 files, +3197 / −66. Branch
`feat/001-project-cards-accuracy`, not pushed.

**Key evidence.**
- AC-001-21 (local half): `format:check`, `lint`, `typecheck`, `test` (13 files, 222/222) and
  `build` all exit 0 at `9a1d2b6` (re-run below). The CI half is pending P-01.
- AC-001-12: all 8 combinations (EN/ES × dark/light × 360/1280) plus reduced motion pass; label
  contrast **7.63:1** (light) and **10.64:1** (dark), both above AA 4.5:1.
- NFR-002: initial JS 96.62 → **96.80 kB** gzip (+0.19 %), CSS 4.24 → **4.28 kB**; re-measured at
  `9a1d2b6` with the same values.
- AC-001-19: 3 demos, 4 repos and 2 YouTube oEmbed checks all end in 200 (~22:15 UTC-5).
- BR-006: the profile README (`hervid2/hervid2` commit `20ff39c`, 2026-11-20) supports every fact
  and every project kind on the cards.

**Open items (not findings).**
- **P-01:** push the branch (ask Hernán first) and Hernán opens the **draft** PR. **AC-001-21 stays
  Partial until CI's `frontend` job is green on that PR.**
- **P-03 / G-Merge deadline: 2026-12-04** (`auditDate` 2026-11-27 + 7 days, spec §4.2 B4,
  AC-001-13). After that date the audit must be re-run before merging (C-07).
- DEBT-013 is already marked "Closed (spec 001, T-11 + T-11a)" in the roadmap; AC-001-22 asks for
  that at G-Merge, which is consistent as long as the merge happens.
- axe was not run in the e2e pass (the classifier blocked the CDN); the a11y checks were done by
  hand (see e2e). Full axe coverage belongs to spec 004.

---

## Cycle-1 fix re-verification (2026-11-27, HEAD `9a1d2b6`)
Every fix was checked against the diff and the files, not the commit message.

| Finding | Fix commit | Check | Result |
|---|---|---|---|
| QS-01 (5 s timeout under load) | `236b4e1` | `PortfolioGrid.test.tsx`: `MOTION_TEST_TIMEOUT_MS = 15_000` passed as the third `it` argument to **both** AC-001-22 tests | ✅ Confirmed. Suite run: both pass (443 ms and < 100 ms) |
| QS-02 (duplicated helpers) | `236b4e1` | `projects.test.ts`: `stackOf` deleted, the single `projectById` moved up, callers use `projectById(id).stack`; `grep -n stackOf` → 0 hits | ✅ Confirmed. 33/33 tests in the file pass |
| QS-03 (`container.querySelector`) | `236b4e1` | The positioned-parent test now uses `screen.getAllByRole("article")[0].parentElement`; `grep -n querySelector` in both files → 0 hits | ✅ Confirmed |
| C-01 (T-11a outside the plan, no approval) | `9a1d2b6` | `tasks.md` T-11a has "⛔ Approved by Hernán 2026-11-27 (after the fact …)"; plan §2 has a `PortfolioGrid.tsx` Modify row; `PortfolioGrid.tsx` removed from "Not touched" | ✅ Confirmed (documentary). The approval itself is Hernán's, relayed by the Coordinator; the reviewer cannot verify it beyond the record |
| C-02 (plan header v1.1) | `9a1d2b6` | Plan header now "spec.md v1.4 (planned at v1.1 …)" and lists T-11a, T-14a, T-14b added after G-Plan | ✅ Confirmed |
| C-03 (model.md "pending investigation") | `9a1d2b6` | `docs/domain/model.md:41-43` → "owner-verified 2026-11-27, no audit login (… ASM-008 closed)" | ✅ Confirmed |
| C-04 (superseded audit text unmarked) | `9a1d2b6` | `docs/discovery/demo-audit.md`: status line, the OQ-001-16 decision row, the B-E2 rule and the T-14 finding each carry "*Superseded (v1.4, T-14a/T-14b)*" | ✅ Confirmed |
| E-01 → DEBT-024 | `9a1d2b6` | `docs/roadmap.md` row DEBT-024 (navbar brand wraps at 360 px), Open | ✅ Logged |
| E-02 → DEBT-025 | `9a1d2b6` | `docs/roadmap.md` row DEBT-025 (hardcoded EN strings in the credentials dialog), Open | ✅ Logged |
| E-03 → DEBT-011 extended | `9a1d2b6` | DEBT-011 now also names "focus is not trapped … does not return to the trigger after Tab then Esc" | ✅ Logged |

No fix could not be confirmed.

### Re-run of the pipeline (Windows 11, Git Bash, Node 22.17.0, working tree, `--prefix frontend`)
```text
format:check  exit 0   All matched files use Prettier code style!
lint          exit 0   eslint . --max-warnings 0 (no output)
typecheck     exit 0   tsc -b
test          exit 0   Test Files 13 passed (13) · Tests 222 passed (222) · Duration 8.56 s
  PortfolioGrid.test.tsx (2 tests) 529 ms · projects.test.ts (33 tests) 21 ms
build         exit 0   493 modules transformed
  dist/index.html                           0.79 kB │ gzip:  0.47 kB
  dist/assets/index-DyLzKJLY.css           18.88 kB │ gzip:  4.28 kB
  dist/assets/AboutSection-CLbsc5Q6.js      3.84 kB │ gzip:  1.20 kB
  dist/assets/ContactSection-BN-SC_QK.js    5.22 kB │ gzip:  2.15 kB
  dist/assets/PortfolioSection-551N2R4R.js 29.43 kB │ gzip:  9.43 kB
  dist/assets/index-DbdKAaLA.js           296.35 kB │ gzip: 96.80 kB
git status --short after build → (empty)
```
Note: this run used the working tree, which holds a git-ignored `frontend/.env`; the bundle sizes
equal the quality-security scratch-worktree measurement, so the `.env` does not change them.

### Built site served (`vite preview`, the `preview` script, port 4173)
```text
GET /                                   200 text/html (792 B): <html lang="en">, title
                                        "Hernán David Cardona | Full-stack Developer",
                                        /assets/index-DbdKAaLA.js + /assets/index-DyLzKJLY.css
GET /assets/index-DbdKAaLA.js           200 (296,387 B)
GET /assets/PortfolioSection-551N2R4R.js 200; contains "Client project", "Personal project",
                                        "Proyecto de cliente", "Proyecto personal"
GET /assets/icons/tech/nestjs-dark.svg  200 image/svg+xml (one of the 26 new icons)
```
The SPA renders client-side (`<div id="root"></div>`); there are no pre-rendered routes yet
(ADR-0003 lands later), so the raw-HTML content check does not apply to 001. The browser matrix of
AC-001-12 was run by the e2e reviewer on the dev server (limitation recorded below).
Cleanup: the preview process (PID 22844, `vite.js preview --port 4173`) was stopped;
`Get-NetTCPConnection -LocalPort 4173 -State Listen` → none ("4173 free").

---

## Focus: compliance (HEAD `f154d8e`, re-verified at `9a1d2b6`)
**Verdict:** CHANGES REQUIRED at `f154d8e` (C-01) → **APPROVED** after `9a1d2b6`.

- **Inputs read:** spec.md v1.4, clarifications.md, plan.md, tasks.md, the diff
  `main...HEAD`, `docs/constitution.md`, `docs/glossary.md`, `docs/traceability.md`,
  `docs/roadmap.md`, `docs/discovery/demo-audit.md`, `docs/discovery/brief.md`, the profile README.
- **Content checks:**
  - K-10…K-17 descriptions byte-identical to spec §7 (8/8); stacks equal §6; K-01…K-04 match.
  - Profile README (`hervid2/hervid2` commit `20ff39c`, 2026-11-20) supports every fact and
    every kind: **no BR-006 contradiction**.
  - Published credentials identical to `main` (8) and tied to the audit summary.
  - Constitution: OK. Commits: all follow Conventional Commits with a task id or `[001]`
    (55 counted at `f154d8e`; `git rev-list --count main..HEAD` = 56 at `9a1d2b6`; the two
    cycle-1 commits also follow the convention).
  - Typecheck exit 0; tests 222/222.

### Findings
| ID | Severity | File:line | Description | Status |
|---|---|---|---|---|
| C-01 | MAJOR | `frontend/src/components/sections/PortfolioGrid.tsx`; `specs/001-project-cards-accuracy/plan.md` §2; `tasks.md` T-11a | T-11a changed `PortfolioGrid.tsx`, which the approved plan listed as "Not touched", with no recorded approval | **Resolved in `9a1d2b6`**: approval line in T-11a, plan §2 Modify row, removed from "Not touched" |
| C-02 | MINOR | `plan.md:2` | Plan header anchored to spec v1.1; T-11a / T-14a / T-14b not listed | **Resolved in `9a1d2b6`** |
| C-03 | MINOR | `docs/domain/model.md:41-42` | Still said "pending investigation" for the Super Admin exception after ASM-008 closed | **Resolved in `9a1d2b6`** |
| C-04 | MINOR | `docs/discovery/demo-audit.md` (status, OQ-001-16 row, B-E2 rule, T-14 finding) | Text superseded by spec v1.4 (T-14a/T-14b) was not marked | **Resolved in `9a1d2b6`** |
| C-05 | SUGGESTION | `docs/traceability.md` (spec 001 rows) | Rows say "Tested" before G-Merge | Open suggestion (Coordinator / planner at G-Merge) |
| C-06 | SUGGESTION | `AGENTS.md` § Code conventions | The `[NNN]` suffix used for spec-level commits is not documented (only `[T-NN]` is) | Open suggestion |
| C-07 | SUGGESTION | `docs/discovery/demo-audit.md:21` | G-Merge must happen by **2026-12-04** (audit window) or the audit is re-run | Open suggestion (tracked in P-03) |

---

## Focus: e2e (HEAD `f154d8e`; dev server, Playwright MCP, compared with a `main` worktree)
**Verdict:** APPROVED. No regression; every finding is pre-existing on `main`.

**Limitation:** the matrix ran on the dev server, not on `npm run preview`. The consolidated
re-verification above confirms the production build serves (200, assets and kind-label copy in
the chunk); the code under test is the same.

- **AC-001-12, all 8 combinations pass** (EN/ES × dark/light × 360/1280): 4 cards; the label sits
  before the `h3` with the EN/ES copy; K-03 subtitle; descriptions and stacks; no horizontal
  scroll (`scrollWidth` 345 at 360 px, 1266 at 1280 px).
- **Measured label contrast (AC-001-12):**

  | Theme | Text | Background | Ratio | AA (4.5:1) |
  |---|---|---|---|---|
  | Light | `rgb(58, 76, 104)` | `rgb(231, 241, 255)` | **7.63:1** | ✅ |
  | Dark | `rgb(196, 202, 216)` | `rgb(19, 26, 37)` | **10.64:1** | ✅ |

- **Notice:** 0 cold-start notices rendered (`coldStartProjectIds` is `[]`), as the audit decided.
- **Icons:** 36 chip icons load in both themes; AWS Lambda, Amazon S3 and Groq use the generic
  cube; Vanilla JS uses its explicit key.
- **AC-001-10:** EN → ES switches without a reload.
- **Reduced motion:** the label is static.
- **Filters (AC-001-20, browser half) at 1280 and 360 px:** labels kept, 0 exit frames outside the
  grid, no ref warning (`main` logs it).
- **Credentials modal:** lists exactly the audit §6 usernames, EN and ES; desktop project has no
  button.
- **A11y (by hand):** "·" is `aria-hidden`; the label reads "Personal project deployed"; no role;
  tab order OK; no unnamed controls. axe not run (classifier blocked the CDN).
- **AC-001-19 live re-run (~22:15 UTC-5):** 3 demos 200 (FlyWorkFlow 307 → 200), 4 repos 200,
  2 YouTube oEmbed 200.

### Findings (all pre-existing on `main`)
| ID | Severity | File:line | Description | Status |
|---|---|---|---|---|
| E-01 | MINOR | `frontend/src/components/layout/Navbar.tsx` | At 360 px the brand wraps to 3 lines (brand 84 px, header 117 px); the theme toggle is not clipped | **Logged as DEBT-024** (`9a1d2b6`) |
| E-02 | MINOR | `CredentialsModal.tsx` (`aria-label="Close"`, `label="User"`), `CredentialRow.tsx` (`Copy ${label}`) | Hardcoded English strings; ES shows "USER" | **Logged as DEBT-025** (`9a1d2b6`) |
| E-03 | MINOR | `CredentialsModal`, `VideoModal` | No focus trap; focus does not return to the trigger after Tab then Esc | **Logged: DEBT-011 extended** (`9a1d2b6`) |
| E-04 | MINOR | `<html lang>` | Stays `en` when ES is selected | Already tracked (DEBT-016) |
| E-05 | SUGGESTION | stack chip icons | `alt="<label> icon"` duplicates the visible label | Already tracked (DEBT-023) |
| E-06 | SUGGESTION | Turnstile | Widget errors on `localhost` | Environment only; no action |

---

## Focus: quality-security (HEAD `f154d8e`, re-verified at `9a1d2b6`)
**Verdict:** APPROVED.

- **Pipeline:** format, lint, typecheck and build exit 0; tests 222/222 (one 5 s timeout under
  load in `PortfolioGrid.test.tsx`, QS-01; not reproduced at `9a1d2b6`).
- **Bundle (NFR-002 ≤ 10 %), `main` built in a scratch worktree:**

  | Asset (gzip) | `main` | Branch | Delta |
  |---|---|---|---|
  | Initial JS | 96.62 kB | 96.80 kB | +0.19 % |
  | CSS | 4.24 kB | 4.28 kB | +0.04 kB |
  | `PortfolioSection` lazy chunk | 8.22 kB | 9.43 kB | +1.21 kB |
  | All JS | — | — | +1.3 % |

- **SVG safety (26 new files):** elements only `svg`, `title`, `path`; attributes only `xmlns`,
  `viewBox`, `role`, `d`, `fill`, `fill-rule`; no `script`, `href`, `url()` or `style`. 12 light
  files byte-identical to `simple-icons@16.37.0`; dark files = upstream + `fill="white"`.
  Licensing recorded in plan §1.3 (CC0).
- **Credentials:** identical to `main` (8) and tied to the audit summary; no real names or emails.
- **Secrets and dependencies:** no secrets; `.playwright-mcp` ignored; no new dependencies
  (`package.json` and `package-lock.json` unchanged vs `main`, Art. 10).

### Findings
| ID | Severity | File:line | Description | Status |
|---|---|---|---|---|
| QS-01 | MINOR | `frontend/src/components/sections/PortfolioGrid.test.tsx` | Motion-heavy AC-001-22 test hit the 5 s default timeout under load | **Resolved in `236b4e1`** (15 s on both tests) |
| QS-02 | MINOR | `frontend/src/data/projects.test.ts` | `stackOf` duplicated `projectById` | **Resolved in `236b4e1`** |
| QS-03 | MINOR | `PortfolioGrid.test.tsx` | `container.querySelector` instead of a role query | **Resolved in `236b4e1`** |
| QS-04 | SUGGESTION | SVG safety test | Only covers the generic SVGs, not all 26 | Open suggestion |
| QS-05 | SUGGESTION | `projects.test.ts` (`parseAuditSummary`) | Parsed at module load with no type checks on the JSON | Open suggestion |
| QS-06 | SUGGESTION | `frontend/src/utils/techIcons.ts` | Dead icon keys (pre-existing) | Open suggestion |
| QS-07 | SUGGESTION | repo root | A `NOTICE` file for icon licensing | Open suggestion |
| QS-08 | SUGGESTION | `ProjectCard.test.tsx` | Hardcoded "AI shopping assistant" instead of reading the data | Open suggestion |

---

## Acceptance criteria → evidence (AC-001-01 … AC-001-22)
| AC | Type | Test(s) / check | Result | Evidence |
|---|---|---|---|---|
| AC-001-01 | U | `projects.test.ts` "AC-001-01 …" (2) | ✅ Pass | 222/222 at `9a1d2b6` |
| AC-001-02 | U | `projects.test.ts` "AC-001-02 …" | ✅ Pass | No "Next.js 14" anywhere; FlyWorkFlow EN/ES names all 8 terms |
| AC-001-03 | U | `projects.test.ts` "AC-001-03 …" | ✅ Pass | 3 stacks equal §6; ≤ 10 chips |
| AC-001-04 | U | `projects.test.ts` "AC-001-04 …" | ✅ Pass | K-10…K-17 byte-identical (compliance, 8/8) |
| AC-001-05 | U | `techIcons.test.ts` (123 tests) | ✅ Pass | Every label is an explicit key; files exist; 16 D-10 labels incl. "vanilla js" |
| AC-001-06 | U, C | `projects.test.ts`, `ProjectCard.test.tsx` | ✅ Pass | EN/ES first sentence and terms; rendered paragraph starts "AI shopping assistant" |
| AC-001-07 | U | `projects.test.ts` | ✅ Pass | "LLM tool calling (Groq)" in the stack |
| AC-001-08 | U, T | `projects.test.ts` (+ `// @ts-expect-error` at `projects.test.ts:85`) | ✅ Pass | Kinds as specified; `npm run typecheck` exit 0 |
| AC-001-09 | C | `PortfolioSection.test.tsx`, `ProjectKindLabel.test.tsx` | ✅ Pass | EN/ES labels; "·" `aria-hidden` |
| AC-001-10 | C | `ProjectCard.test.tsx` | ✅ Pass | EN → ES rerender; label before title. Browser: switch without reload (e2e) |
| AC-001-11 | C | `PortfolioSection.test.tsx`, `dictionaries.test.ts` | ✅ Pass | K-03 EN/ES |
| AC-001-12 | M (exception §9) | Recorded verification (e2e) | ✅ Pass | 8/8 combos + reduced motion; contrast 7.63:1 / 10.64:1; no horizontal scroll. Dev server (limitation); build served at `9a1d2b6` |
| AC-001-13 | U, D | `projects.test.ts` + document check | ✅ Pass | 6 headings, parseable summary, `auditDate` 2026-11-27; 4 tables, 8 credential rows; window ends 2026-12-04 |
| AC-001-14 | U | `projects.test.ts` | ✅ Pass | Published = verified + owner exception, per project |
| AC-001-15 | U, D | `projects.test.ts` + document check | ✅ Pass | Super Admin only exception, "not audited — owner-verified 2026-11-27"; Slicing Edge both `verified`; ASM-008 closed in `brief.md`; `model.md` now consistent (C-03) |
| AC-001-16 | U | `projects.test.ts` | ✅ Pass | `coldStartProjectIds` `[]`; no project flagged |
| AC-001-17 | C | `ColdStartNotice.test.tsx`, `ProjectCard.test.tsx` | ✅ Pass | `role="note"` K-04 EN/ES; absent without the flag |
| AC-001-18 | D (exception §9) | Document check of `demo-audit.md` | ✅ Pass | ≤ 1 login per account per run; no Super Admin login; BR-008 actions only; no third-party data; OQ-001-04 / OQ-001-12 cited, 2026-11-27 |
| AC-001-19 | M, D (exception §9) | `demo-audit.md` + live re-run (e2e) | ✅ Pass | 3 demos, 4 repos, 2 oEmbed → 200 |
| AC-001-20 | C | `PortfolioSection.test.tsx` (4 filters) + existing `ProjectFilterBar` / `useProjectFilter` tests | ✅ Pass | Labels kept; browser frame trace at 1280/360 (e2e) |
| AC-001-21 | M, CI | Local five commands + CI on the draft PR | ⏳ **Partial** | Local: 5/5 exit 0 at `9a1d2b6`. CI: pending P-01 (push + draft PR) |
| AC-001-22 | C | `PortfolioGrid.test.tsx` (2) | ✅ Pass | `console.error` spy: no ref warning; `relative` guard; DEBT-013 Closed in roadmap |

## Definition of Done checklist (GENESIS §C.6)
- [x] All implementation tasks completed with evidence (T-01 … T-19, incl. T-11a, T-14a, T-14b);
  cycle-1 fixes in `236b4e1` and `9a1d2b6`.
- [x] Every AC covered by a green automated test or the approved §9 exception (AC-001-12, -18,
  -19 live part recorded here and in `demo-audit.md`).
- [x] Linter, formatter, type checking, full suite and build green locally at `9a1d2b6`.
- [ ] Green in CI: pending P-01 (AC-001-21 Partial).
- [x] e2e validation of the spec's flows with evidence (e2e focus; dev server, build served).
- [x] No secrets, no new dependencies, no `TODO` without a ticket, no debug logs.
- [x] Spec, plan, `traceability.md`, `roadmap.md` (DEBT-013 closed; DEBT-024, DEBT-025 added;
  DEBT-011 extended) and domain docs updated. `MEMORY.md` is the Coordinator's at phase close.
- [ ] Human approval of the merge (G-Merge), **by 2026-12-04**.
