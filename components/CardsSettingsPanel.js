"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCard, deleteCard } from "@/lib/actions/cardActions";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#1E254A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20";
const labelClass = "block text-sm font-semibold text-[#1E254A]";
const NETWORKS = ["visa", "mastercard", "verve", "amex", "other"];

function formatNetwork(network) {
  if (network === "mastercard") return "Mastercard";
  if (network === "amex") return "Amex";
  return network ? network.charAt(0).toUpperCase() + network.slice(1) : "Other";
}

function cardDisplayText(card) {
  return `${formatNetwork(card.network)} - ${card.label} - ****${card.last_four}`;
}

export default function CardsSettingsPanel({ initialCards = [] }) {
  const [cards, setCards] = useState(initialCards);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [cards]
  );

  function handleAddSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFeedback({ error: null, success: null });

    startTransition(async () => {
      const result = await createCard(formData);
      if (result?.error) {
        setFeedback({ error: result.error, success: null });
        return;
      }

      if (result?.card) {
        setCards((prev) => [...prev, result.card]);
      }
      setFeedback({ error: null, success: "Card added successfully." });
      setShowAddForm(false);
      router.refresh();
    });
  }

  function handleDelete(cardId) {
    setFeedback({ error: null, success: null });
    startTransition(async () => {
      const result = await deleteCard(cardId);
      if (result?.error) {
        setFeedback({ error: result.error, success: null });
        return;
      }
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      setFeedback({ error: null, success: "Card deleted." });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {feedback.error ? (
        <div
          className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#E8203B]"
          role="alert"
        >
          {feedback.error}
        </div>
      ) : null}
      {feedback.success ? (
        <div
          className="rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534]"
          role="status"
        >
          {feedback.success}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1E254A]">Saved cards</h2>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
        >
          {showAddForm ? "Close form" : "Add card"}
        </button>
      </div>

      {showAddForm ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label htmlFor="new_card_label" className={labelClass}>
                Label
              </label>
              <input
                id="new_card_label"
                name="label"
                type="text"
                required
                maxLength={80}
                placeholder="e.g. My GTB card"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="new_card_network" className={labelClass}>
                  Network
                </label>
                <select id="new_card_network" name="network" defaultValue="visa" className={inputClass}>
                  {NETWORKS.map((network) => (
                    <option key={network} value={network}>
                      {formatNetwork(network)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new_card_last_four" className={labelClass}>
                  Last 4 digits
                </label>
                <input
                  id="new_card_last_four"
                  name="last_four"
                  type="number"
                  required
                  min="0"
                  max="9999"
                  inputMode="numeric"
                  placeholder="1234"
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save card"}
            </button>
          </form>
        </div>
      ) : null}

      {sortedCards.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-4 py-8 text-center text-sm text-[#64748B]">
          You do not have any saved cards yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {sortedCards.map((card) => (
            <li
              key={card.id}
              className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-[#1E254A]">{cardDisplayText(card)}</p>
              <button
                type="button"
                onClick={() => handleDelete(card.id)}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-lg border border-[#FECACA] bg-white px-3 py-1.5 text-sm font-semibold text-[#E8203B] transition hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
