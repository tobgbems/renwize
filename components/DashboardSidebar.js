"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function linkClass(active) {
  return [
    "flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition",
    active
      ? "bg-[#ECFDF3] text-[#0F5C3A]"
      : "text-[#1E254A] hover:bg-[#F1F5F9] hover:text-[#1FA168]",
  ].join(" ");
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "overview";

  const inSubscriptionsFlow =
    pathname.startsWith("/dashboard/add") || pathname.startsWith("/dashboard/edit/");

  const items = [
    {
      href: "/dashboard?section=overview",
      label: "Overview",
      active: pathname === "/dashboard" && section === "overview",
    },
    {
      href: "/dashboard?section=subscriptions",
      label: "Subscriptions",
      active: inSubscriptionsFlow || (pathname === "/dashboard" && section === "subscriptions"),
    },
    {
      href: "/dashboard?section=settings",
      label: "Settings",
      active: pathname === "/dashboard/settings" || (pathname === "/dashboard" && section === "settings"),
    },
  ];

  return (
    <aside className="w-full lg:w-56 lg:shrink-0">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-sm">
        <nav className="space-y-1" aria-label="Dashboard sections">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className={linkClass(item.active)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
