---
name: testing-conventions
description: Use when writing, changing or reviewing unit or component tests in frontend/ or api/ (Vitest, Testing Library, jsdom shims, fakes and mocks, AC ids in test names, coverage).
---
# Testing conventions

## When it applies
- Any new or changed `*.test.ts` / `*.test.tsx` file in `frontend/src/` or `api/src/`.
- Any change to `frontend/vitest.config.ts`, `api/vitest.config.ts` or `frontend/src/test/setup.ts`.
- Writing the failing test first for a task (GENESIS §C.2) and reviewing a diff that adds tests or
  classes.
- e2e (Playwright) is out of scope here: it is defined in spec 004.

## Deterministic rules
1. **Location and naming:**
   - Tests are colocated next to the unit they cover, with the same base name:
     `hooks/useProjectFilter.ts` → `hooks/useProjectFilter.test.ts`.
   - `.test.tsx` only when the file contains JSX; otherwise `.test.ts`.
   - Vitest only picks up `src/**/*.test.{ts,tsx}` (frontend) and `src/**/*.test.ts` (API). No
     `__tests__/` folders, no `.spec.ts` files.
   - Shared test setup lives in `frontend/src/test/`. The API has no setup file.
2. **Runner and environment:**
   - Vitest 3. Import the API explicitly: `import { describe, expect, it, vi } from "vitest";`
     (no globals).
   - Frontend runs in `jsdom` and inherits the Vite config, so the `@/` alias works in tests.
   - API runs in `node`; it has no Testing Library and no jsdom. Keep the `.js` suffix in
     relative imports, as in the API source (`./SubmitContactMessageUseCase.js`).
   - `restoreMocks: true` is set in both configs: spies and `vi.fn` implementations are reset after
     each test. Do not rely on mock state leaking between tests.
3. **Testing Library patterns (frontend):**
   - Components: `render(...)` and query through `screen`, by role and accessible name first
     (`getByRole("button", { name })`), then by label or text. No `container.querySelector`, no
     test ids unless there is no accessible handle.
   - Hooks: `renderHook(() => useX())`; wrap state changes in `act(...)`.
   - Interactions: `fireEvent` (the project has no `@testing-library/user-event`; adding it is a
     new dependency and needs an approved plan).
   - Assertions: the jest-dom matchers (`toBeInTheDocument`, `toHaveAttribute`, ...) are available
     and typed through `setup.ts`.
   - Take expected copy from the dictionaries (`enDictionary.portfolio.filterAll`) and expected
     lists from `src/data/`, never hardcoded strings, so a copy change does not break tests.
   - Components that read `useLanguage()` need the real `LanguageProvider` around them.
4. **jsdom shims (`frontend/src/test/setup.ts`):**
   - It imports `@testing-library/jest-dom/vitest`, and runs `cleanup()` and `localStorage.clear()`
     after each test, so every test starts with an empty DOM and empty storage.
   - It shims `window.matchMedia` with a non-matching `MediaQueryList` (used by `useMediaQuery`).
     To test the matching branch, override it in that test with `vi.spyOn(window, "matchMedia")`.
   - Add an `IntersectionObserver` shim to `setup.ts` only when a test renders a `whileInView`
     component. Add shims to `setup.ts`, never inline in one test file.
   - Tests that touch `document.documentElement` (theme classes) reset it in their own
     `afterEach`.
5. **AC id in test names:**
   - When a test proves an acceptance criterion, both the `describe` and each `it` start with the
     AC id: `describe("AC-000-05(b) useProjectFilter", ...)` and
     `it("AC-000-05(b) 'all' is active by default ...", ...)`.
   - The rest of the name states the behavior in plain English (input → expected result).
   - Tests that do not prove an AC (characterization, regressions) carry their reason instead:
     `describe("getEnvConfig (D-1 characterization)", ...)`.
   - Every AC that `docs/traceability.md` maps to a test has at least one test whose name contains
     that id, so `grep -rn "AC-NNN-XX" frontend/src api/src` finds it.
6. **Fakes vs mocks:**
   - Prefer the real in-memory and no-op adapters as fakes (`InMemoryContactRepository`,
     `NoopMailService`) and observe them with `vi.spyOn(adapter, "method")`.
   - Use `vi.fn()` for a small port that has no fake, built as an object literal that matches the
     port: `{ verifyToken: vi.fn().mockResolvedValue(true) }`.
   - Use `vi.fn()` for component callbacks (`onSelect`) and assert on the calls.
   - Do not `vi.mock` a whole module when an adapter or a prop can be injected instead; never mock
     the unit under test.
   - Time: `vi.useFakeTimers()` + `vi.setSystemTime(...)` in `beforeEach`, `vi.useRealTimers()` in
     `afterEach`.
   - Environment: `vi.stubEnv(key, value)` for every key the code reads (so a local `.env` cannot
     leak in) and `vi.unstubAllEnvs()` in `afterEach`.
   - No network, no database, no real mail in unit tests. Those are the manual diagnostics
     (`npm run test:e2e --prefix api`, `test:persistence`, `test:smtp`).
7. **Code rules in tests:**
   - Lint turns off `max-lines-per-function` and `jsdoc/require-jsdoc` for test files and
     `src/test/**`. Still give shared helpers (`setup`, `renderBar`) and fixed fixtures a short
     English JSDoc, as the existing tests do.
   - `max-len` (100), `no-console`, strict TypeScript and Prettier still apply. `tsc` type-checks
     the tests (`npx tsc -b frontend`, `npx tsc -p api --noEmit`).
8. **Coverage:**
   - `npm test --prefix frontend` and `npm test --prefix api` run `vitest run --coverage` (v8,
     `text` + `lcov`, written to `<package>/coverage/`, which is git-ignored).
   - One file: `npm test --prefix frontend -- <path>`. Watch mode: `npm run test:watch --prefix
     frontend`.
   - Coverage is reported, not gated (ASM-011): there are no thresholds. CI uploads the reports
     as `coverage-frontend` and `coverage-api`. Do not add thresholds without a spec.
9. **Review check: constructors with logic carry JSDoc.** Lint never requires JSDoc on a
   constructor (`checkConstructors: false`; `eslint-plugin-jsdoc` cannot tell an empty
   constructor from one with logic, plan §1.2). So the reviewer checks every new or changed class
   by hand:
   - a constructor with logic (validation, building clients, defaults, branching) has a JSDoc
     block with `@param` for each parameter, as in `NodemailerMailService` and
     `ResendMailService`;
   - a constructor that only declares parameter properties is exempt.

## Correct examples
```ts
// api/src/application/use-cases/SubmitContactMessageUseCase.test.ts
/**
 * Builds the use case with spies on the in-memory repository and the no-op mail service.
 *
 * @param captchaVerdict - What the fake verifier resolves to.
 * @returns The use case and its spies.
 */
function setup(captchaVerdict: boolean) {
  const repository = new InMemoryContactRepository();
  const saveSpy = vi.spyOn(repository, "save");
  const verifier = { verifyToken: vi.fn().mockResolvedValue(captchaVerdict) };
  // ...
}

describe("AC-000-06(b) SubmitContactMessageUseCase", () => { /* ... */ });
```

```tsx
// frontend/src/components/ui/ProjectFilterBar.test.tsx
const groupLabel = enDictionary.portfolio.filterLabel;

it("AC-000-05(d) renders one button per category inside the labelled group", () => {
  renderBar(ALL_CATEGORIES_KEY);
  const group = screen.getByRole("group", { name: groupLabel });
  expect(group).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(categories.length);
});
```

## Typical mistakes (anti-examples)
- `it("works", ...)` or a test for an AC without the AC id in its name.
- `expect(screen.getByText("All"))`: a hardcoded string instead of the dictionary value.
- `vi.mock("../../infrastructure/email/NoopMailService.js")` when the adapter can be injected.
- Reading `process.env` without `vi.stubEnv`, so the result depends on the developer's `.env`.
- Shimming `matchMedia` or `IntersectionObserver` inside one test file instead of `setup.ts`.
- A `__tests__/` folder, a `.spec.ts` file or a `.test.tsx` file with no JSX.
- A coverage threshold added to `vitest.config.ts` without a spec.
- A new `MailService` whose constructor builds a client, without JSDoc, passing lint unnoticed.

## Verification
- `npm test --prefix frontend` and `npm test --prefix api` pass and print the coverage table.
- `npm run lint --prefix frontend` and `npm run lint --prefix api` pass.
- `npx tsc -b frontend` and `npx tsc -p api --noEmit` pass.
- A new test fails before the change it covers (red), and passes after it (green).
- Review: every new or changed constructor with logic has JSDoc (rule 9).
