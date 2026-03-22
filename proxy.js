/**
 * Next.js 16+: root `proxy` entry (replaces `middleware.js`).
 * Re-export NextAuth's `auth` so /dashboard routes stay protected.
 *
 * Requires Next.js 16+. If you see errors about missing `middleware.js`, your dev
 * server is likely running Next.js 15 — run `npm install` and `npx next --version`
 * to confirm you are on Next 16, then delete the `.next` folder and restart dev.
 */
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};
