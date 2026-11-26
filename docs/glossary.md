# Glossary (ubiquitous language)

| Business term | Code identifier | Definition | Forbidden synonyms | Source |
|---|---|---|---|---|
| Project | `Project` (`frontend/src/types/project.ts`) | A piece of software shown as a card in the Portfolio section | Work, item, app (in code) | Existing code |
| Project kind | `ProjectKind` = `"client" \| "personal"` | Whether a project was built for and is used by a real client (`client`), or is a deployed project with no client and fictional data (`personal`) | Type, origin | Brief §5, PO-6 |
| Category | `Project.category` | Filterable product category of a project (e.g. "Web SPA", "E-commerce") | Tag, type | Existing code |
| Stack | `Project.stack` | Ordered list of technologies shown on a card | Tags, techs | Existing code |
| Live demo | `Project.liveDemoUrl` | Public URL of the running project | Preview, deploy | Existing code |
| Demo credential | `DemoCredential` | A public demo account (role, username, password) with fictional data, published on purpose | Login, user | Existing code |
| Demo video | `Project.demoVideoId` | YouTube video id per language | Trailer | Existing code |
| Preview clip | `Project.previewVideoUrl` | Muted looping clip played on card hover | GIF | Existing code |
| Case study | `CaseStudy` | Long-form narrative of a project: Problem → Role → Decisions (and why) → Mistakes and fixes → Result | Article, post, blog | PO-3 |
| Architecture map | `ArchitectureMap` | Interactive diagram of a project's components, connections and guided views, shown in a modal | Diagram (in code), chart | PO-12 |
| Map node | `ArchitectureNode` | One component of an architecture map (e.g. "API on AWS Lambda") | Box, block | PO-12 |
| Map edge | `ArchitectureEdge` | A directed connection between two map nodes | Link, arrow | PO-12 |
| Map view | `ArchitectureView` | A named guided focus over a subset of nodes (e.g. "A request") | Tour, step | FlyWorkFlow Archify JSON |
| Testimonial | `Testimonial` | A short authorized quote from a client with name and role | Review, recommendation (in code) | PO-11 |
| CV | `cvUrl` | The curriculum vitae PDF in the active language, hosted on Google Drive | Resume (in code, use `cv`) | PO-1 |
| Public email | `PUBLIC_EMAIL` | The contact email shown with a copy button | Mail | PO-1 |
| Skill | `Skill` (`frontend/src/types/skill.ts`) | A technology shown in the About → Skills grid | Tech, tool | Existing code |
| Language | `Language` = `"en" \| "es"` | UI language; persisted preference | Locale (in code), lang | Existing code |
| Dictionary | `AppDictionary` (`frontend/src/types/i18n.ts`) | Typed set of UI strings per language | Translations, messages | Existing code |
| Theme mode | `ThemeMode` = `"dark" \| "light"` (`frontend/src/types/theme.ts`; state in `frontend/src/hooks/useThemeMode.ts`) | Visual theme; persisted preference | Color scheme | Existing code |
| Contact message | `ContactMessage` (Prisma) | A message submitted through the contact form | Lead, inquiry | Existing code |
| Section | DOM id `home` · `portfolio` · `about` · `contact` | A top-level part of the home page | Page (for these) | Existing code |
| CAPTCHA verifier | `CaptchaVerifier` (`api/src/domain/interfaces/CaptchaVerifier.ts`) | Port that checks a Turnstile token server-side; `NoopCaptchaVerifier` accepts every token when CAPTCHA is disabled | Bot check, recaptcha | Existing code; injected into the use case by spec 000 (CL-01) |
| Submission command | `SubmitContactMessageCommand` (`api/src/types/contact.ts`) | Input of `SubmitContactMessageUseCase.execute`: the parsed contact fields plus `captchaToken` and the optional `remoteIp` | Request, payload (in the use case) | Spec 000 (C-08) |
| Submission outcome | `SubmitContactMessageResult` = `{ status: "accepted" }` \| `{ status: "captcha-rejected" }` | Typed result of `SubmitContactMessageUseCase`; the controller maps `captcha-rejected` to `400 {"message":"Captcha validation failed"}` | Error code, response (in the use case) | Spec 000 plan |
| API logger | `logger` (`api/src/infrastructure/logging/logger.ts`) | The only place the API writes to the console (`info`, `warn`, `error`) | Console (in app code), log helper | Spec 000 (CL-03) |
| Required check | CI job ids `frontend` · `api` | A GitHub Actions job whose name is a required status check on `main` | Pipeline, build (for these) | Spec 000 (CL-08, CL-18) |

> One concept = one name across the whole system (documents, code, database, UI).
