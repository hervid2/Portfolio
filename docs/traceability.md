# Traceability matrix

> Updated at every G-Merge. FR-001 … FR-009 are implemented but have no automated tests yet
> (DEBT-001); spec 000 adds the first ones.

| FR | BR | Spec | AC | Test(s) | Status |
|---|---|---|---|---|---|
| FR-001 | — | (existing) | — | — | ⚠️ Implemented, untested |
| FR-002 | BR-001 | (existing) / 000 | AC-000-05(a), AC-000-05(e) | `frontend/src/i18n/dictionaries.test.ts`, `frontend/src/context/LanguageContext.test.tsx` | 🧪 Tested (spec 000) |
| FR-003 | BR-002 | (existing) / 000 | AC-000-05(f) | `frontend/src/hooks/useThemeMode.test.ts` | 🧪 Tested (spec 000) |
| FR-004 | — | (existing) | — | — | ⚠️ Implemented, untested |
| FR-005 | — | (existing) | — | — | ⚠️ Implemented, untested |
| FR-006 | — | (existing) | — | — | ⚠️ Implemented, untested |
| FR-007 | BR-001 | (existing) | — | — | ⚠️ Implemented, untested |
| FR-008 | BR-003, BR-004 | (existing) / 000 | AC-000-06(a), AC-000-06(b) | `api/src/interfaces/http/validators/contactSchema.test.ts`, `api/src/application/use-cases/SubmitContactMessageUseCase.test.ts`; `api/src/scripts/*` (manual) | 🧪 BR-003 tested (spec 000); BR-004 manual |
| FR-009 | — | (existing) | — | — | ⚠️ Implemented, untested |
| FR-010 | BR-005 | 002 | — | — | Planned |
| FR-011 | — | 002 | — | — | Planned |
| FR-012 | — | 004 | — | — | Planned |
| FR-013 | BR-006 | 006 | — | — | Planned |
| FR-014 | BR-006 | 001 | AC-001-01 … AC-001-05 | `frontend/src/data/projects.test.ts`, `frontend/src/utils/techIcons.test.ts` | 🧪 Tested (spec 001) |
| FR-015 | — | 001 | AC-001-06, AC-001-07 | `frontend/src/data/projects.test.ts`, `frontend/src/components/ui/ProjectCard.test.tsx` | 🧪 Tested (spec 001) |
| FR-016 | BR-006 | 001 | AC-001-08 … AC-001-12, AC-001-20 | `frontend/src/data/projects.test.ts` + `npm run typecheck` (AC-001-08), `frontend/src/components/ui/ProjectKindLabel.test.tsx`, `frontend/src/components/ui/ProjectCard.test.tsx`, `frontend/src/components/sections/PortfolioSection.test.tsx`, `frontend/src/components/ui/ProjectFilterBar.test.tsx`, `frontend/src/hooks/useProjectFilter.test.ts`; AC-001-12 recorded browser check in `specs/001-project-cards-accuracy/validation.md` (P-02); AC-001-20 browser part: T-11a frame trace | 🧪 Tested (spec 001); AC-001-12 recorded in `validation.md` |
| FR-017 | BR-006 | 002 | — | — | Planned |
| FR-018 | BR-006 | 003 | — | — | Planned |
| FR-019 | — | 001 | AC-001-13 … AC-001-19 | `frontend/src/data/projects.test.ts` (AC-001-13 … AC-001-16, reads the audit summary), `frontend/src/components/ui/ColdStartNotice.test.tsx`, `frontend/src/components/ui/ProjectCard.test.tsx` (AC-001-17); manual: `docs/discovery/demo-audit.md` (T-12 … T-18, incl. the Slicing Edge re-audit T-14a / T-14b) for AC-001-13 (D), AC-001-15 (D), AC-001-18, AC-001-19, and the ASM-008 row in `docs/discovery/brief.md` (AC-001-15 D) | 🧪 Tested (spec 001); audit recorded, document checks passed in `validation.md` |
| FR-020 | — | 005 | — | — | Planned |
| FR-021 | BR-007 | 008 | — | — | Planned |
| FR-022 | — | 007 | — | — | Planned |

Spec 001 regression ACs, shared by FR-014, FR-015, FR-016 and FR-019: AC-001-21 (the five
`--prefix frontend` commands on every code task, plus CI's `frontend` job: green on PR #8, run
46102964883)
and AC-001-22 (DEBT-013: `frontend/src/components/sections/PortfolioGrid.test.tsx`, T-11
`forwardRef` and T-11a positioned grid with its browser frame trace). Spec 001 rows written at
T-19 (2026-11-27); confirmed at G-Merge 2026-11-27 (P-03; PR #8 merged as `da9dece`).
