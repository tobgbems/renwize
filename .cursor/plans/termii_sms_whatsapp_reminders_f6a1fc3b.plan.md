---
name: termii_sms_whatsapp_reminders
overview: Add Termii-backed SMS and WhatsApp reminders to the existing cron reminder flow, gated to Pro users with a phone number, and update UI/product copy from “coming soon” to active availability.
todos:
  - id: add-termii-helper
    content: Create `lib/termii.js` with Termii message sender, env checks, and `sendSMS`/`sendWhatsApp` exports.
    status: completed
  - id: wire-reminders
    content: Update `lib/reminders.js` to load Pro + phone fields and send SMS/WhatsApp after email for eligible users.
    status: completed
  - id: update-copy
    content: Replace SMS/WhatsApp “coming soon” placeholder text across dashboard/settings/pricing/landing with active availability copy.
    status: completed
  - id: verify-search-lints
    content: Run focused placeholder search and lint checks on touched files.
    status: completed
isProject: false
---

# Termii SMS + WhatsApp Reminders Plan

## Scope and decisions

- Implement Termii messaging in server-only code and trigger it from the existing cron-driven reminder loop after email sends.
- Gate SMS/WhatsApp sends to users who are Pro and have a phone value available.
- Use the existing `users.phone_number` storage, mapping it to `user.phone` in reminder logic for the guard check.
- Update all discovered placeholder copy (including landing page per your clarification) from “coming soon” language to active/available language.

## Files to change

- Reminder orchestration: [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\lib\reminders.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\lib\reminders.js)
- New Termii helper: [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\lib\termii.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\lib\termii.js)
- Settings phone hint: [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\ProfileSettingsForm.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\ProfileSettingsForm.js)
- Pro-upgrade dashboard messaging: [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\app\dashboard\page.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\app\dashboard\page.js)
- Pricing card placeholders: [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\PricingPagePlans.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\PricingPagePlans.js)
- Landing copy (explicitly included per your override): [C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\LandingPage.js](C:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\components\LandingPage.js)

## Implementation details

- In `lib/termii.js`:
  - Add a top comment listing required env vars: `TERMII_API_KEY`, `TERMII_SENDER_ID`.
  - Implement a shared internal sender for `POST https://api.ng.termii.com/api/sms/send` with payload keys: `api_key`, `to`, `from`, `sms`, `type: "plain"`, and `channel`.
  - Export:
    - `sendSMS(phone, message)` with `channel: "generic"`
    - `sendWhatsApp(phone, message)` with `channel: "whatsapp"`
  - Add robust error handling for missing env, non-2xx responses, and API-declared failures.
- In `lib/reminders.js`:
  - Import `sendSMS` and `sendWhatsApp`.
  - Expand users query from `id, name, email` to include Pro + phone data (use aliasing so logic can use `user.phone` while reading from `phone_number`).
  - Keep email behavior unchanged, then attempt SMS and WhatsApp for each successful email when:
    - `user.is_pro` is truthy
    - `user.phone` is truthy
  - Build channel message text aligned with email tone, e.g.: `Hi {name}, your {subscription} renews in 3 days for {amount}. Log in at renwize.com to review it.`
  - Keep cron resilient: failures in SMS/WhatsApp should be captured in `failed` but should not stop processing remaining subscriptions.
- UI copy updates:
  - Replace “coming soon” wording with active availability wording in dashboard, profile settings, pricing, and landing copy.
  - Keep Pro gating language accurate (SMS/WhatsApp are available for Pro users).

## Validation

- Run a targeted search to ensure no stale “coming soon” placeholder remains for SMS/WhatsApp.
- Verify lint diagnostics for edited files.
- Sanity-check reminder return payload still includes expected keys (`sent`, `targetDate`, `failed`) and that added failure reasons remain readable for cron response logs.

## Environment setup note for you

- You’ll need to add these before deploy/runtime testing:
  - Local: `.env.local` → `TERMII_API_KEY`, `TERMII_SENDER_ID`
  - Vercel project env vars: `TERMII_API_KEY`, `TERMII_SENDER_ID` (Production, plus Preview/Development if needed)
- I’ll wire code to fail clearly when missing, so configuration gaps are immediately visible in logs.

