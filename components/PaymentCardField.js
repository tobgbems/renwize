"use client";

import { useMemo, useState, useTransition } from "react";
import { createCard } from "@/lib/actions/cardActions";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#1E254A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20";

const labelClass = "block text-sm font-semibold text-[#1E254A]";
const NETWORKS = ["visa", "mastercard", "verve", "amex", "other"];
const ADD_NEW_SENTINEL = "__add_new_card__";

function formatNetwork(network) {
  if (network === "mastercard") return "Mastercard";
  if (network === "amex") return "Amex";
  return network ? network.charAt(0).toUpperCase() + network.slice(1) : "Other";
}

function cardOptionLabel(card) {
  return `${formatNetwork(card.network)} - ${card.label} - ****${card.last_four}`;
}

export default function PaymentCardField({ cards = [], initialCardId = "" }) {
  const [availableCards, setAvailableCards] = useState(cards);
  const [selectedCardId, setSelectedCardId] = useState(initialCardId || "");
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [label, setLabel] = useState("");
  const [network, setNetwork] = useState("visa");
  const [lastFour, setLastFour] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const [fieldSuccess, setFieldSuccess] = useState(null);
  const [isPending, startTransition] = useTransition();

  const sortedCards = useMemo(
    () => [...availableCards].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [availableCards]
  );

  function handleCardSelectChange(e) {
    const nextValue = e.target.value;
    setFieldError(null);
    setFieldSuccess(null);
    if (nextValue === ADD_NEW_SENTINEL) {
      setShowAddCardForm(true);
      return;
    }
    setSelectedCardId(nextValue);
  }

  function handleSaveCard() {
    setFieldError(null);
    setFieldSuccess(null);

    const digitsOnly = lastFour.replace(/\D/g, "");
    if (!label.trim()) {
      setFieldError("Please enter a card label.");
      return;
    }
    if (!digitsOnly) {
      setFieldError("Please enter last 4 digits.");
      return;
    }

    const formData = new FormData();
    formData.append("label", label.trim());
    formData.append("network", network);
    formData.append("last_four", digitsOnly);

    startTransition(async () => {
      const result = await createCard(formData);
      if (result?.error) {
        setFieldError(result.error);
        return;
      }

      if (result?.card?.id) {
        setAvailableCards((prev) => [...prev, result.card]);
        setSelectedCardId(result.card.id);
        setShowAddCardForm(false);
        setLabel("");
        setNetwork("visa");
        setLastFour("");
        setFieldSuccess("Card saved and selected.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="card_id" className={labelClass}>
          Payment card <span className="font-normal text-[#64748B]">(optional)</span>
        </label>
        <select id="card_id" name="card_id" value={selectedCardId} onChange={handleCardSelectChange} className={inputClass}>
          <option value="">None</option>
          {sortedCards.map((card) => (
            <option key={card.id} value={card.id}>
              {cardOptionLabel(card)}
            </option>
          ))}
          <option value={ADD_NEW_SENTINEL}>+ Add new card</option>
        </select>
      </div>

      {fieldError ? (
        <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#E8203B]">
          {fieldError}
        </p>
      ) : null}
      {fieldSuccess ? (
        <p className="rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534]">
          {fieldSuccess}
        </p>
      ) : null}

      {showAddCardForm ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <h4 className="text-sm font-bold text-[#1E254A]">Add payment card</h4>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="card_label" className={labelClass}>
                Label
              </label>
              <input
                id="card_label"
                type="text"
                required
                maxLength={80}
                placeholder="e.g. My GTB card"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="card_network" className={labelClass}>
                  Network
                </label>
                <select
                  id="card_network"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className={inputClass}
                >
                  {NETWORKS.map((network) => (
                    <option key={network} value={network}>
                      {formatNetwork(network)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="card_last_four" className={labelClass}>
                  Last 4 digits
                </label>
                <input
                  id="card_last_four"
                  type="number"
                  required
                  min="0"
                  max="9999"
                  inputMode="numeric"
                  placeholder="1234"
                  value={lastFour}
                  onChange={(e) => setLastFour(e.target.value.slice(0, 4))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveCard}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save card"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddCardForm(false)}
                className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#1E254A] transition hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
