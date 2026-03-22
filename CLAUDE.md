@AGENTS.md

# Claude — quick reference

- **Stack:** Next.js App Router (JS only), NextAuth, Supabase, Tailwind, Resend for transactional email.
- **Cron:** Production only; schedule in `vercel.json`. Secure the handler with `CRON_SECRET` and `Authorization: Bearer …`.
- **When editing reminders:** Prefer `lib/reminders.js` + `lib/emailTemplate.js`; keep `getSupabaseAdmin()` from `lib/supabase.js` for server-side queries.
