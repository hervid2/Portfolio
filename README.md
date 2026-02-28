# Hernán David Cardona — Portfolio

Full-stack portfolio built with React + TypeScript + Vite + Tailwind on frontend and
Node.js + Express + TypeScript on API.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- API: Node.js, Express, TypeScript, Zod
- Database: MySQL + Prisma ORM
- Security/ops: Helmet, CORS, Rate limit, Cloudflare Turnstile CAPTCHA
- Notifications: Nodemailer (SMTP, Gmail-compatible)

## Project structure

```txt
frontend/  # SPA portfolio
api/       # Contact endpoint and API security layer
```

## Run locally

1. Install dependencies:
   - `npm install --prefix frontend`
   - `npm install --prefix api`
2. Create environment files from examples:
   - `frontend/.env` from `frontend/.env.example`
   - `api/.env` from `api/.env.example`
3. Generate Prisma client (API):
   - `npm run prisma:generate --prefix api`
4. Start API:
   - `npm run dev --prefix api`
5. Start frontend:
   - `npm run dev --prefix frontend`

## Environment variables

### Frontend (`frontend/.env`)

Based on @frontend/.env.example#1-2:

- `VITE_API_BASE_URL` (API base URL, e.g. `http://localhost:4000`)
- `VITE_TURNSTILE_SITE_KEY` (Cloudflare Turnstile site key)

### API (`api/.env`)

Based on @api/.env.example#1-14:

- Server/CORS: `PORT`, `NODE_ENV`, `ALLOWED_ORIGINS`
- DB: `DATABASE_URL`
- Mail: `MAIL_ENABLED`, `MAIL_FROM`, `MAIL_TO`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- CAPTCHA: `CAPTCHA_ENABLED`, `TURNSTILE_SECRET_KEY`

> Important: `TURNSTILE_SECRET_KEY` must stay only on backend. Never expose it in frontend.

## API and database commands

From repo root:

- Dev API: `npm run dev --prefix api`
- Build API: `npm run build --prefix api`
- Prisma generate: `npm run prisma:generate --prefix api`
- Prisma migrate (dev): `npm run prisma:migrate --prefix api`
- Prisma deploy (prod): `npm run prisma:deploy --prefix api`

## Validation and test scripts

From repo root:

- SMTP diagnostic: `npm run test:smtp --prefix api`
- Persistence smoke test: `npm run test:persistence --prefix api`
- Contact flow E2E: `npm run test:e2e --prefix api`

Notes:
- `test:e2e` is intended for test/local mode. If `CAPTCHA_ENABLED=true`, dummy tokens will fail by design.
- For full real validation, run manual UI flow with Turnstile enabled.

## Implemented scope

- Home / Portfolio / About / Contact sections.
- EN/ES switch with persistent language preference.
- Portfolio cards driven by typed data arrays.
- Contact API endpoint with Helmet, CORS, rate limit, and schema validation.
- Contact message persistence with Prisma + MySQL.
- SMTP email notifications on contact submission.
- Cloudflare Turnstile CAPTCHA validation in frontend and backend.

## Deployment notes

- Frontend (Vercel): set Root Directory to `frontend`, build command `npm run build`, output `dist`.
- API (VPS, later): set real `ALLOWED_ORIGINS`, secure `.env`, and run Prisma deploy migrations.
