---
name: i18n-dictionaries
description: Use when adding, changing or removing any user-visible text in the portfolio frontend (dictionaries, bilingual data fields, labels, aria-labels, alt text).
---
# i18n dictionaries (EN/ES)

## When it applies
Any change that touches text a visitor can see or hear:
- copy, labels, placeholders, `aria-label` and `alt`;
- error and success messages;
- bilingual fields in `frontend/src/data/`.

## Deterministic rules
1. **Two sources of strings, and only two:**
   - UI strings → `frontend/src/i18n/en.ts` and `frontend/src/i18n/es.ts`, typed by `AppDictionary` in `frontend/src/types/i18n.ts`.
   - Content strings → `{ en: string; es: string }` fields in `frontend/src/data/*.ts`.
2. **Add the key in three places in the same commit:**
   - (a) the `AppDictionary` interface;
   - (b) `en.ts`;
   - (c) `es.ts`.

   The `AppDictionary` type makes `tsc` fail if a language is missing, so never use `Partial<>` or `?` to silence it.
3. **Keys** are camelCase and grouped by section (`nav`, `hero`, `portfolio`, `about`, `contact`, `footer`, plus new sections when a spec adds one). Use glossary terms.
4. **Reading strings in components:** `const { dictionary, language } = useLanguage();`.
   - Dictionary: `dictionary.section.key`.
   - Data: `project.description[language]`.
   - Never `language === "es" ? "…" : "…"` with inline literals.
5. **Copy rules:**
   - EN: US English, concrete, no filler adjectives ("scalable", "elegant", "modern") unless backed by a fact.
   - ES: neutral Latin American Spanish, using *tú* (as in the existing `es.ts`).
   - Both languages say the same thing; adapt the phrasing, never the facts.
   - Positioning and stack follow the GitHub profile README (BR-006).
6. **Proper nouns stay untranslated:** product names, technologies, "Sushi Burrito", "FlyWorkFlow".
7. **Accessibility text** (`aria-label`, `alt`, `title`) is translated too.

## Correct examples
```ts
// types/i18n.ts
hero: { role: string; statement: string; ctaPrimary: string; ctaSecondary: string; downloadCv: string };
// en.ts
downloadCv: "Download CV",
// es.ts
downloadCv: "Descargar CV",
// Component
<a className="btn-secondary" href={cvUrlByLanguage[language]}>{dictionary.hero.downloadCv}</a>
```

## Typical mistakes (anti-examples)
- `<span>{language === "es" ? "Copiado" : "Copied"}</span>`: inline literals bypass the dictionary.
- Adding `downloadCv` to `en.ts` only and marking the interface field optional.
- Translating "Live Demo" in a data file instead of using `dictionary.portfolio.liveDemo`.
- Different facts in each language (e.g. "US & Canada" in EN but "EE. UU., Canadá y LATAM" in ES).

## Verification
- `npm run typecheck --prefix frontend` passes, which proves dictionary parity.
- `grep -rnE "language === \"(es|en)\" \?" frontend/src` returns nothing new.
- Visual check of the changed screen in both languages (Playwright MCP or manual).
