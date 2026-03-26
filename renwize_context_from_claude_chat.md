# Renwize — Project Context for Claude

## About the builder
- Name: Tobi Gbemisola
- Background: Bubble (no-code) developer with product-building experience
- Three previous products: Thrilly, JobHunch, Renwize (Bubble version)
- Learning vibe coding using Cursor AI + Claude
- Based in Lagos, Nigeria

---

## About Renwize
Renwize is a subscription reminder SaaS app that helps users track their app subscriptions and receive email reminders 3 days before they are charged.

**Live URL:** https://www.renwize.com
**GitHub:** https://github.com/tobgbems/renwize
**Vercel project:** renwize (under tobgbems' projects)

---

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, no TypeScript) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v5 (auth.js) |
| Database | Supabase (PostgreSQL) |
| Email reminders | Resend |
| Scheduled jobs | Vercel Cron Jobs |
| Payments | Paystack |
| Hosting | Vercel |
| Domain registrar | Namecheap |

---

## Project folder location
```
C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize
```

---

## Completed stages

### Stage 1 — Landing page + Auth ✅
- Public landing page at `/`
- Sign up / Log in at `/auth` (email + Google OAuth)
- Protected dashboard at `/dashboard`
- Privacy and Terms placeholder pages
- NextAuth v5 with credentials + Google provider
- Supabase `users` table

### Stage 2 — Dashboard + Subscription management ✅
- Dashboard with greeting, spend summary cards, upcoming renewals, all subscriptions grid
- Add subscription at `/dashboard/add`
- Edit subscription at `/dashboard/edit/[id]`
- Delete subscription with confirmation
- All data stored in Supabase `subscriptions` table
- Data filtered by logged-in user's `user_id`

### Stage 3 — Email reminders ✅
- `lib/reminders.js` — queries subscriptions where `next_billing_date` = today + 3 days
- `lib/emailTemplate.js` — branded HTML email template
- `app/api/cron/send-reminders/route.js` — protected GET endpoint
- `vercel.json` — cron job runs daily at 8AM UTC
- Emails sent via Resend from `onboarding@resend.dev` (pending custom domain verification)
- **How to manually test:** Run this in PowerShell:
```
Invoke-WebRequest -Uri "https://www.renwize.com/api/cron/send-reminders" -Headers @{"Authorization"="Bearer YOUR_CRON_SECRET"} -UseBasicParsing
```

### Stage 4 — Paystack payments ✅
- `/pricing` page with Free and Pro plan cards
- `app/api/payments/initiate/route.js` — initializes Paystack transaction
- `app/api/payments/verify/route.js` — verifies payment, updates `is_pro` and `pro_expires_at`
- `app/api/payments/webhook/route.js` — handles Paystack `charge.success` webhook
- Dashboard shows Pro badge and upgrade banner
- Pro plan: NGN 2,000/month or NGN 20,000/year (one-time payment, not recurring Paystack plan)

---

## Supabase tables

### `public.users`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| name | text | |
| email | text | unique |
| password_hash | text | nullable (Google users have no password) |
| is_pro | boolean | default false |
| pro_expires_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

### `public.subscriptions`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | references users(id) on delete cascade |
| name | text | |
| amount | numeric | |
| currency | text | default 'USD' |
| billing_cycle | text | 'monthly' or 'yearly' |
| next_billing_date | date | |
| category | text | streaming, saas, fitness, finance, utilities, other |
| notes | text | nullable |
| created_at | timestamptz | default now() |

---

## Environment variables
### `.env.local` (local)
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=Renwize <onboarding@resend.dev>
CRON_SECRET=
PAYSTACK_SECRET_KEY=sk_test_... (switch to sk_live_ for production)
PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel environment variables (production)
Same as above except:
- `AUTH_URL=https://www.renwize.com`
- `NEXT_PUBLIC_APP_URL=https://www.renwize.com`
- `PAYSTACK_SECRET_KEY=sk_live_...` (when switched to live)

---

## Key files
```
renwize/
├── app/
│   ├── page.js                          # Landing page
│   ├── auth/page.js                     # Login/signup
│   ├── dashboard/
│   │   ├── page.js                      # Main dashboard
│   │   ├── add/
│   │   │   ├── page.js
│   │   │   └── actions.js               # Server action: createSubscription
│   │   └── edit/[id]/
│   │       ├── page.js
│   │       └── actions.js               # Server action: updateSubscription
│   ├── pricing/page.js
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── auth/signup/route.js
│   │   ├── subscriptions/[id]/route.js  # DELETE handler
│   │   ├── cron/send-reminders/route.js
│   │   └── payments/
│   │       ├── initiate/route.js
│   │       ├── verify/route.js
│   │       └── webhook/route.js
│   └── layout.js
├── components/
│   ├── LandingPage.js
│   ├── AuthForm.js
│   ├── DashboardNav.js
│   ├── DashboardGreeting.js
│   ├── AddSubscriptionForm.js
│   ├── DeleteSubscriptionButton.js
│   ├── LogoutButton.js
│   ├── PricingSection.js
│   ├── FaqSection.js
│   ├── HeroPreviewCard.js
│   └── FooterEmailCapture.js
├── lib/
│   ├── supabase.js                      # getSupabaseAdmin()
│   ├── reminders.js                     # Email reminder logic
│   ├── emailTemplate.js                 # Branded HTML email
│   └── subscriptionDisplay.js           # formatMoney, formatDate helpers
├── auth.js                              # NextAuth config
├── proxy.js                             # Route protection (Next.js 16)
├── vercel.json                          # Cron job config
└── public/
    ├── logo-lockup.svg                  # Header/footer logo
    └── favicon.svg                      # Browser tab icon
```

---

## Brand guidelines
- **Primary green:** `#1FA168` (Sea Green)
- **Primary dark:** `#1E254A` (Midnight Blue)
- **Secondary red:** `#E8203B` (Crimson)
- **Secondary warm:** `#FFDAB9` (Peach Puff)
- **Font:** DM Sans (Google Fonts — substitute for Sofia Pro)
- **Logo files location:** `C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\Context\Branding\logo\SVG\`

---

## Known pending items (next to work on)
1. **Auto-rollover billing dates** — after a subscription's `next_billing_date` passes, automatically advance it by 1 month or 1 year depending on billing cycle
2. **Verify Resend sending domain** — set up `@renwize.com` as sending domain so reminder emails come from a branded address instead of `onboarding@resend.dev`
3. **Switch Paystack to live keys** — update `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` in Vercel env vars when ready to accept real payments
4. **Update Paystack callback/webhook URLs** — already set to `https://www.renwize.com/...`

---

## Git workflow
```bash
git add .
git commit -m "describe change here"
git push
```
Vercel auto-deploys on every push to `main`.

## Local dev workflow
```bash
# Kill any running node processes
taskkill /F /IM node.exe

# Start dev server
cd "C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize"
npm run dev
```
Then open http://localhost:3000
