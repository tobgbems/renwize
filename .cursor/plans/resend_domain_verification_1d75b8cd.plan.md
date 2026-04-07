---
name: Resend domain verification
overview: Verify `renwize.com` in the Resend dashboard by adding the DNS records they show, then point `RESEND_FROM_EMAIL` at `hello@renwize.com`. No application code changes are required.
todos:
  - id: resend-add-domain
    content: Add renwize.com in Resend Domains and copy SPF/DKIM (and MX if shown) DNS records
    status: pending
  - id: dns-records
    content: Create records at renwize.com DNS host; verify until Resend shows verified
    status: pending
  - id: env-redeploy
    content: Set RESEND_FROM_EMAIL to Renwize <hello@renwize.com> locally + Vercel; redeploy
    status: pending
  - id: optional-dmarc
    content: "Optional: add DMARC TXT at _dmarc.renwize.com for better inbox placement"
    status: pending
isProject: false
---

# Use [hello@renwize.com](mailto:hello@renwize.com) for Resend reminder emails

## How it fits your app

`[lib/reminders.js](c:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize\lib\reminders.js)` reads `process.env.RESEND_FROM_EMAIL` and passes it to `resend.emails.send({ from, ... })`. Once Resend trusts your domain, you only need to change the env value (locally and on Vercel); the string format can stay the same as today, e.g. `Renwize <hello@renwize.com>`.

**Note:** Verifying the domain for *sending* does not require `hello@` to be hosted at Resend. If `hello@renwize.com` is already your real inbox (Google, Microsoft, etc.), that is fine—you are only authorizing Resend to sign mail as `@renwize.com`.

## Steps in Resend

1. Open [Resend Domains](https://resend.com/domains) (Dashboard → Domains).
2. Click **Add domain** and enter `**renwize.com`** (root domain is correct if you want `hello@renwize.com`).
3. Resend will show the exact DNS records to create. In general you must add:
  - **SPF** — a `TXT` record (and often an **MX** record used for the return-path / bounces, as Resend documents).
  - **DKIM** — one or more `TXT` records at the hostnames Resend gives you.
4. Add those records at **whoever hosts DNS for renwize.com** (registrar, Cloudflare, Vercel DNS, etc.). Copy names/values exactly; avoid extra quotes unless your DNS UI requires them.
5. Wait for propagation (minutes to a few hours), then in Resend click **Verify** (or wait for automatic recheck). Status should become **verified** (see [domain statuses](https://resend.com/docs/dashboard/domains/introduction)).

**Optional but recommended:** After send works, add a **DMARC** `TXT` record at `_dmarc.renwize.com` (Resend documents this under their DMARC guidance). Improves trust with Gmail and others.

**Subdomain alternative:** Resend often recommends a subdomain like `mail.renwize.com` for reputation isolation; that would mean a From like `Renwize <hello@mail.renwize.com>`, not `hello@renwize.com`. Since you asked specifically for `hello@renwize.com`, use the **root domain** in Resend.

## After verification

1. Set `**RESEND_FROM_EMAIL=Renwize <hello@renwize.com>`** in `[.env.local](c:\Users\Tobi\Documents\Coding projects\RenwizeRebuild\renwize)` (local) and in **Vercel → Project → Settings → Environment Variables** (Production, and Preview if you test there).
2. **Redeploy** the Vercel project (or trigger a new deployment) so serverless/cron runs pick up the new variable if they were cached from an older deploy.
3. Send a test (e.g. trigger your reminder path in dev or use Resend’s test send) and confirm headers show the new From. Use [Resend Logs](https://resend.com/emails) if delivery fails.

## If verification fails

Use Resend’s [domain not verifying](https://resend.com/knowledge-base/what-if-my-domain-is-not-verifying) article and their [DNS provider guides](https://resend.com/knowledge-base). Typical issues: typo in record name, conflicting old SPF `TXT` records (only one SPF flattening strategy per domain), or DNS not yet propagated.