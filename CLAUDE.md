@AGENTS.md

# Claude — quick reference

- **Stack:** Next.js App Router (JS only), NextAuth, Supabase, Tailwind, Resend for transactional email, and Termii for SMS/WhatsApp reminders.
- **Cron:** Production only; schedule in `vercel.json`. Secure the handler with `CRON_SECRET` and `Authorization: Bearer …`.
- **When editing reminders:** Prefer `lib/reminders.js` + `lib/emailTemplate.js` + `lib/termii.js`; keep `getSupabaseAdmin()` from `lib/supabase.js` for server-side queries.
- **Supabase RLS:** `public.users` and `public.subscriptions` use Row Level Security in production. The app only uses the service role server-side (`getSupabaseAdmin()`), which bypasses RLS, so dashboard and cron behavior are unchanged. Repeatable SQL (inspect policies, enable RLS, optional revokes) lives in `enable_rls_users_subscriptions.sql`.
- **Empty dashboard after RLS:** Ensure **`SUPABASE_SERVICE_ROLE_KEY`** on the host is the **service_role** secret (not anon); redeploy. See `AGENTS.md` → Supabase troubleshooting.
- **Production URL:** `https://www.renwize.com` is the primary live domain. `https://renwize.vercel.app` still works, but is secondary.
- **Dashboard routing:** Use section URLs on dashboard (`/dashboard?section=overview|subscriptions|settings`) and keep add/edit in modal state (`modal=add` / `modal=edit&id=...`).
- **Edit from details modal:** Route Edit directly to `/dashboard?section=...&modal=edit&id=...` (not `/dashboard/edit/[id]`) to prevent an intermediate white-screen redirect hop.
- **Profile settings:** Name + phone are managed from dashboard settings using `components/ProfileSettingsForm.js` + `lib/actions/updateProfileSettings.js`.
- **Modal forms:** Never nest `<form>` elements in dashboard modals. For inline secondary actions (like add-card within add-subscription), use local component state and `type="button"` handlers.
- **Subscription dates:** Keep native date picker with no past selection (`min=today`) for add/edit subscription forms.
- **Cancel reminders:** `subscriptions.remind_to_cancel` should be reflected in both card badges and reminder email copy.

## Project status

- Stage 1: Landing page + Auth ✅
- Stage 2: Dashboard + Subscription management ✅
- Stage 3: Email reminders via Resend + Vercel Cron ✅
- Stage 4: Paystack payments + Pro tier ✅
- Custom domain: renwize.com ✅
