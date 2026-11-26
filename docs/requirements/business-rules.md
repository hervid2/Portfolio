# Business rules

## BR-001 — Initial language and persistence
- **Type:** constraint
- **Rule:** The initial language is the value stored in `localStorage` if it is `"en"` or `"es"`; otherwise `"en"`. Every change is persisted.
- **Formula / decision table:** stored `"es"` → ES · stored `"en"` → EN · missing/invalid → EN
- **Examples:** stored `"es"` → ES · stored `"fr"` → EN (edge case) · nothing → EN
- **Exceptions:** Pre-rendered HTML is produced in EN (ASM-010); the client then applies the stored preference.
- **Origin and date:** Existing code, documented 2026-11-26
- **Requirements that use it:** FR-002, FR-007, FR-010

## BR-002 — Initial theme and persistence
- **Type:** constraint
- **Rule:** The initial theme is `"light"` only if `localStorage` holds `"light"`; otherwise `"dark"`.
- **Formula / decision table:** `"light"` → light · anything else → dark
- **Examples:** `"light"` → light · nothing → dark · `"blue"` → dark (edge case)
- **Exceptions:** —
- **Origin and date:** Existing code, documented 2026-11-26
- **Requirements that use it:** FR-003

## BR-003 — Contact field validation
- **Type:** validation
- **Rule:** After trimming, `name` has 2–80 chars, `email` is a valid email of ≤ 120 chars, and `message` has 10–1200 chars.
- **Formula / decision table:** See `api/src/interfaces/http/validators/contactSchema.ts`
- **Examples:** name "Al" → valid · name "A" → invalid (edge case) · message of 9 chars → invalid
- **Exceptions:** —
- **Origin and date:** Existing code, documented 2026-11-26
- **Requirements that use it:** FR-008

## BR-004 — Contact rate limit
- **Type:** constraint
- **Rule:** At most 5 contact requests per IP per 15 minutes.
- **Formula / decision table:** request n ≤ 5 in window → processed · n ≥ 6 → HTTP 429
- **Examples:** 5th request → 2xx · 6th within 15 min → 429 (edge case) · 6th after 15 min → 2xx
- **Exceptions:** —
- **Origin and date:** `rules/portfolio_rules.md`, existing code
- **Requirements that use it:** FR-008

## BR-005 — CV by language
- **Type:** calculation
- **Rule:** The CV link is chosen by the active language.
- **Formula / decision table:**

| Language | File | URL |
|---|---|---|
| en | Hernan_Cardona_CV_EN_ATS.pdf | `https://drive.google.com/file/d/1GWU6MBvnigqTEpdCfcVcLMPqUa60Cf-7/view` |
| es | Hernan_Cardona_CV_ES_ATS.pdf | `https://drive.google.com/file/d/1SnzOeIDChiTw8Oiac2KDDpGBrh5jGRun/view` |

- **Examples:** EN → EN URL · ES → ES URL · switch EN→ES while on page → link updates without reload (edge case)
- **Exceptions:** —
- **Origin and date:** Owner, 2026-11-26 (ASM-009 for `/view` vs direct download)
- **Requirements that use it:** FR-010

## BR-006 — Source of truth for public positioning
- **Type:** constraint
- **Rule:** Role, stack, location, market, project kind and per-project stack shown on the site must match the GitHub profile README (`hervid2/hervid2`). If they differ, the profile wins until the owner updates it.
- **Formula / decision table:** Kind: Sushi Burrito Desktop → client · Sushi Burrito Web → client · Slicing Edge → personal · FlyWorkFlow → personal
- **Examples:** FlyWorkFlow stack lists NestJS 11 (profile) → card must list NestJS · the card says "Next.js 14" → violation
- **Exceptions:** —
- **Origin and date:** Owner, 2026-11-26 (ASM-005)
- **Requirements that use it:** FR-013, FR-014, FR-016, FR-017, FR-018

## BR-007 — Testimonial authorization
- **Type:** authorization
- **Rule:** A testimonial is published only with a written authorization from its author that states the text, the display name and permission to name the business.
- **Formula / decision table:** authorization recorded → publish · missing or revoked → do not publish / remove
- **Examples:** a message from the owner saying "yes, as 'Owner, Sushi Burrito'" → publish · LinkedIn recommendation without consent → do not publish (edge case)
- **Exceptions:** —
- **Origin and date:** GENESIS Art. 8, brief §5, 2026-11-26
- **Requirements that use it:** FR-021
