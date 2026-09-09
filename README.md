# Aviance SEO OS

AI-powered SEO command center for agencies — multi-client dashboard, technical &
on-page audits, keyword intelligence, content planning, competitor & backlink
intelligence, GSC/GA4 analytics, an AI copilot, automation and client reporting,
all in one platform.

This repository currently contains the **frontend** (Next.js). It renders
against a typed mock-data layer designed to be swapped for a real backend API
without touching page code — see `lib/services/`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (base-ui primitives)
- **Recharts** for charts, **TanStack Table v8** for data tables
- **React Hook Form** + **Zod** for forms
- **next-themes** for light/dark mode

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/login`
(any email/password works, this is mock auth). From there, `/dashboard` is the
main app shell.

## Project structure

```
app/
  (auth)/        Login, register, forgot/reset password — no sidebar
  (app)/         Sidebar + header shell — every agency-facing module
  (portal)/      Simplified client-facing portal
components/
  ui/            shadcn/ui primitives (generated — prefer `npx shadcn add`)
  layout/        Sidebar, header, page header, nav config
  shared/        Reusable app components (StatCard, DataTable, badges, …)
  <module>/      Module-specific components (dashboard/, clients/, …)
lib/
  mock-data/     Deterministic seeded mock data generators (source of truth)
  services/      Typed async functions pages call — swap for real fetch() later
  website-context.ts   Resolves the "current website" from ?site= search param
types/           Domain type definitions, one file per module
```

## Conventions

- **Data flow**: pages are Server Components that `await` functions from
  `lib/services/*`, which currently read from `lib/mock-data/*`. Swapping to a
  real backend means editing the service functions only.
- **Current website**: agency pages are scoped to one website at a time,
  carried in the `?site=` query param (see `lib/website-context.ts`), not
  client state — this keeps server-rendered pages correct without a client
  round-trip. Use `resolveWebsiteIdFromSearchParams`.
- **Design tokens**: brand colors (`--brand-navy`, `--brand-accent`) and the
  full light/dark palette live in `app/globals.css`. The sidebar keeps the
  Aviance navy in both themes; page content follows the theme toggle.
- **Async params**: this Next.js version requires `params`/`searchParams` to
  be awaited — see any page under `app/(app)/` for the pattern.

## Roadmap

Backend (FastAPI + PostgreSQL + Celery), real Google Search Console/Analytics
integration, and the AI engine are planned as separate phases — see project
history for the phased build plan.
