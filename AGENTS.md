<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Renwize — agent notes

## Product

Renwize is a subscription tracking app (Next.js App Router, JavaScript only, Tailwind, NextAuth, Supabase). Users manage their own subscription rows in the `subscriptions` table (`user_id` scoped).

## Repo layout (important paths)

- **`auth.js`** — NextAuth config (credentials + Google). Do not change unless the task is explicitly about auth.
- **`proxy.js`** — Next.js 16 root handler; re-exports `auth as proxy` for `/dashboard/*` protection. Do not rename or replace with `middleware.js` alongside it (Next forbids both).
- **`lib/supabase.js`** — `getSupabaseAdmin()` (service role). Used server-side for DB access.
- **`lib/actions/`** — Server actions (`createSubscription`, `updateSubscription`) kept outside `app/` to reduce Turbopack HMR churn.
- **`lib/reminders.js`** — Vercel Cron: loads subscriptions with `next_billing_date` = UTC today + 3 days, emails users via Resend.
- **`lib/emailTemplate.js`** — HTML for renewal reminder emails (branded, inline CSS).
- **`app/api/cron/send-reminders/route.js`** — `GET`, protected by `Authorization: Bearer CRON_SECRET`; calls `sendBillingReminders()`.
- **`vercel.json`** — Daily cron at 08:00 UTC → `/api/cron/send-reminders` (Vercel sends `Bearer` when `CRON_SECRET` is set in project env).
- **`app/dashboard/`** — Dashboard, add (`/dashboard/add`), edit (`/dashboard/edit/[id]`).

## Conventions

- **No TypeScript** in this project.
- **Session → user id:** JWT exposes name/email; resolve Supabase `users.id` by `session.user.email` when filtering or inserting `subscriptions`.
- **Forms:** Client forms use `onSubmit` + `useTransition` calling server actions (avoid `useActionState` here due to past dev/HMR issues).
- **Imports:** `formatMoney` and related helpers live in `lib/subscriptionDisplay.js` — import them in any page that formats currency.

## Email reminders (Resend + cron)

- **Env:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CRON_SECRET` (plus existing Supabase vars). See Resend docs for free-tier limits (verified recipients / verified domain).
- **Logic:** One email per matching subscription row; amount formatting uses `lib/subscriptionDisplay.js` (`formatMoney`, `formatDate`).

## What not to touch without explicit instruction

- Auth files, landing page (`app/page.js`, `components/LandingPage.js` and related marketing components), and **`proxy.js`**, unless the user asks for changes in those areas.
