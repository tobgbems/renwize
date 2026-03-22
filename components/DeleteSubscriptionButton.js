"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Deletes a subscription after confirm(); refreshes the server page on success.
 */
export default function DeleteSubscriptionButton({ subscriptionId, subscriptionName }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    const ok = window.confirm(
      `Delete "${subscriptionName}"? This cannot be undone.`,
    );
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not delete subscription.");
      }
      router.refresh();
    } catch (e) {
      alert(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="rounded-lg border border-[#FECACA] bg-white px-3 py-1.5 text-sm font-semibold text-[#E8203B] transition hover:bg-[#FEF2F2] disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
