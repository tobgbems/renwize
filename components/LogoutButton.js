"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg bg-[#1E254A] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Log Out
    </button>
  );
}
