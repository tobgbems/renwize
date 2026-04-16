# Renwize - Stage 1

Renwize is a subscription reminder app built with:

- Next.js App Router (JavaScript)
- Tailwind CSS
- NextAuth.js v5
- Supabase
- Resend (email reminders)
- Termii (SMS + WhatsApp reminders for Pro users)

## 1) Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2) Supabase setup (database + connection values)

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. In your project, open **SQL Editor** and run this:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table if exists public.users
add column if not exists phone_number text;

alter table if exists public.subscriptions
add column if not exists remind_to_cancel boolean not null default false;
```

3. Go to **Project Settings -> API** and copy:
   - `Project URL` (for `NEXT_PUBLIC_SUPABASE_URL`)
   - `service_role` key (for `SUPABASE_SERVICE_ROLE_KEY`)  
   Keep the service role key secret and only on the server.

## 3) Google OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select a project.
3. Go to **APIs & Services -> OAuth consent screen** and configure it.
4. Go to **Credentials -> Create Credentials -> OAuth Client ID**.
5. Choose **Web application**.
6. Add these redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (after deploy)
7. Copy:
   - Client ID (`AUTH_GOOGLE_ID`)
   - Client Secret (`AUTH_GOOGLE_SECRET`)

## 4) Environment variables (`.env.local`)

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

AUTH_SECRET=
AUTH_URL=http://localhost:3000

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
CRON_SECRET=

TERMII_API_KEY=
TERMII_SENDER_ID=

PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

**Pro / Paystack:** Checkout uses `/api/payments/initiate` (callback `/api/payments/verify`, webhook `/api/payments/webhook`). Pro users can manage plan intent (cancel at period end / reactivate) from **Dashboard → Settings → Profile** (`ManagePlanSection`). Older Supabase projects may need `users.plan_type` and `users.cancel_at_period_end` added in the SQL Editor; see [`AGENTS.md`](AGENTS.md) for field behavior.

## 5) Routes included in Stage 1

- `/` - public marketing landing page
- `/auth` - sign up / log in page (credentials + Google)
- `/dashboard` - protected placeholder dashboard
- `/privacy` and `/terms` - footer placeholder pages

If a user is not logged in, visiting `/dashboard` redirects to `/auth`.
