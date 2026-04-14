"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function iconClass(active) {
  return active ? "text-[#1FA168]" : "text-white/80";
}

function labelClass(active) {
  return active ? "text-[#1FA168]" : "text-white/90";
}

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "overview";

  const items = [
    {
      href: "/dashboard?section=overview",
      label: "Home",
      active: pathname === "/dashboard" && section === "overview",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-8.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard?section=subscriptions",
      label: "Subs",
      active:
        pathname === "/dashboard/subscriptions" ||
        pathname.startsWith("/dashboard/edit/") ||
        (pathname === "/dashboard" && section === "subscriptions"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard?section=settings",
      label: "Settings",
      active:
        pathname === "/dashboard/settings" ||
        (pathname === "/dashboard" && section === "settings"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M19.4 13.4a7.8 7.8 0 0 0 .06-2.8l2-1.55-2-3.46-2.5.7a7.6 7.6 0 0 0-2.4-1.4L12 2 9.44 4.85a7.6 7.6 0 0 0-2.4 1.4l-2.5-.7-2 3.46 2 1.55a7.8 7.8 0 0 0 .06 2.8l-2 1.55 2 3.46 2.5-.7a7.6 7.6 0 0 0 2.4 1.4L12 22l2.56-2.85a7.6 7.6 0 0 0 2.4-1.4l2.5.7 2-3.46-2-1.55Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Dashboard mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#1E254A] px-2 py-2 md:hidden"
    >
      <ul className="mx-auto flex w-full max-w-xl items-center justify-around">
        {items.map((item) => (
          <li key={item.label} className="min-w-0 flex-1">
            <Link
              href={item.href}
              className={[
                "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition",
                item.active ? "bg-white/10" : "hover:bg-white/5",
              ].join(" ")}
            >
              <span className={iconClass(item.active)}>{item.icon}</span>
              <span className={labelClass(item.active)}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
