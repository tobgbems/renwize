@AGENTS.md

# Claude — quick reference

- **Stack:** Next.js App Router (JS only), NextAuth, Supabase, Tailwind, Resend for transactional email.
- **Cron:** Production only; schedule in `vercel.json`. Secure the handler with `CRON_SECRET` and `Authorization: Bearer …`.
- **When editing reminders:** Prefer `lib/reminders.js` + `lib/emailTemplate.js`; keep `getSupabaseAdmin()` from `lib/supabase.js` for server-side queries.
- **Production URL:** `https://www.renwize.com` is the primary live domain. `https://renwize.vercel.app` still works, but is secondary.

## Project status

- Stage 1: Landing page + Auth ✅
- Stage 2: Dashboard + Subscription management ✅
- Stage 3: Email reminders via Resend + Vercel Cron ✅
- Stage 4: Paystack payments + Pro tier ✅
- Custom domain: renwize.com ✅
