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
| FR-014 | BR-006 | 001 | — | — | Planned |
| FR-015 | — | 001 | — | — | Planned |
| FR-016 | BR-006 | 001 | — | — | Planned |
| FR-017 | BR-006 | 002 | — | — | Planned |
| FR-018 | BR-006 | 003 | — | — | Planned |
| FR-019 | — | 001 | — | — | Planned |
| FR-020 | — | 005 | — | — | Planned |
| FR-021 | BR-007 | 008 | — | — | Planned |
| FR-022 | — | 007 | — | — | Planned |
