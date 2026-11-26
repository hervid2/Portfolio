---
name: project-data
description: Use when adding or editing a project card, its stack, kind (client/personal), media, demo credentials, demo video, case study link or architecture map in frontend/src/data/projects.ts.
---
# Project data

## When it applies
Any change to `frontend/src/data/projects.ts`, to `frontend/src/types/project.ts`, or to the project media in `frontend/public/assets/{images,videos}/projects/`.

## Deterministic rules
1. **The source of truth** is the GitHub profile README, <https://github.com/hervid2/hervid2> (BR-006). Check it, and the project's own README, before writing a description or stack. If they disagree, the profile wins; report the difference to Hernán.
2. **Kind** (BR-006), once spec 001 adds the field:

   | Project | Kind |
   |---|---|
   | Sushi Burrito Desktop (`java-desktop-app`) | `client` |
   | Sushi Burrito Web (`sushi-burrito-spa`) | `client` |
   | Slicing Edge (`the-slicing-edge`) | `personal` |
   | FlyWorkFlow (`flyworkflow-incidents`) | `personal` |

3. **Identity:** `id` is a stable kebab-case slug and is never renamed; other files key off it (`utils/projectCardIdentity.ts`, media file names).
4. **Bilingual fields:** `description`, `demoCredentials[].role` and `demoVideoId` are `{ en; es }`, and both values are required (see the `i18n-dictionaries` skill).
5. **Stack:**
   - Order: main framework first, then backend, data, infra, testing/CI.
   - Use official names ("Next.js", "NestJS", "PostgreSQL", "AWS Lambda").
   - Every label should resolve an icon in `utils/techIcons.ts` (`resolveTechIconPath`). If one is missing, add the SVG pair to `public/assets/icons/tech/` (`<name>.svg`, plus `<name>-dark.svg` for dark logos).
6. **Media:**
   - Poster: `public/assets/images/projects/<id-or-name>.webp`, ideally frame 0 of the clip.
   - Preview clip: `public/assets/videos/projects/<id>.mp4` — muted, short loop, no audio track.
   - `demoVideoId` is the YouTube **id**, not the URL.
7. **Demo credentials:**
   - Publish only accounts verified to work (FR-019, `docs/discovery/demo-audit.md`). They are public demo accounts with fictional data, not secrets.
   - Never add real personal accounts.
8. **Links:** `liveDemoUrl` and `codeUrl` are full HTTPS URLs or `null` (the card renders the "pending" state). Check that new URLs answer 2xx/3xx (NFR-013).

## Correct examples
```ts
{
  id: "flyworkflow-incidents",
  title: "FlyWorkFlow Incident Management",
  description: { en: "Multi-tenant incident management for construction sites…", es: "Gestión de incidencias multi-tenant para obras…" },
  stack: ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "AWS Lambda", "Amazon S3", "Mapbox GL", "Playwright", "GitHub Actions"],
  category: "Web App",
  // …
}
```

## Typical mistakes (anti-examples)
- "Next.js 14" for FlyWorkFlow: the profile says Next.js 16 (PO-4).
- Listing a demo account that the project's README no longer lists, without checking it (ASM-008).
- A description in EN only, or EN and ES that state different facts.
- Renaming an `id` to "fix" a typo, which breaks the media and identity mappings.

## Verification
- `npx tsc -b frontend` passes.
- The data invariant tests pass once spec 000 adds them (`npm test --prefix frontend`).
- `curl -sI <each new URL>` returns 2xx/3xx.
- Check the card visually in EN and ES, in both themes.
