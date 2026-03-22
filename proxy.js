/**
 * Next.js 16+ uses `proxy.js` (replaces deprecated `middleware.js`).
 * Re-export NextAuth's auth wrapper as `proxy` so /dashboard stays protected.
 */
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};
