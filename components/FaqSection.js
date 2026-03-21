"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is Renwize free?",
    a: "Yes. Email reminders and tracking unlimited subscriptions on the Free plan are free forever. Optional paid tiers will add channels like SMS and WhatsApp when they launch.",
  },
  {
    q: "Do I need to add my subscriptions manually?",
    a: "Yes. You add each subscription yourself—name, amount, renewal date, and billing cycle—so you always know what is on your list and stay in control.",
  },
  {
    q: "How far in advance will I be reminded?",
    a: "By default, Renwize sends email reminders 3 days before each charge. You will be able to customize timing in a future update.",
  },
  {
    q: "Can I track subscriptions in multiple currencies?",
    a: "You can record amounts in the currency you pay in (for example NGN and USD) so your overview matches how you actually spend.",
  },
  {
    q: "Is my data private?",
    a: "We only store what you enter to run reminders. We do not sell your data, and we do not connect to your bank in Stage 1.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="container-width mx-auto px-4 py-16 sm:px-6">
      <h2 className="text-center text-3xl font-bold text-[#1E254A] sm:text-4xl">FAQ</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-[#64748B]">
        Quick answers about pricing, privacy, and how reminders work.
      </p>

      <div className="mx-auto mt-10 max-w-2xl divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-white px-2 shadow-sm sm:px-0">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.q} className="px-4 py-1 sm:px-6">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-[#1E254A]">{item.q}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] text-lg font-light text-[#1FA168] transition ${
                    isOpen ? "rotate-45 border-[#1FA168]/30 bg-[#1FA168]/10" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen ? (
                <div className="pb-4 pr-12 text-sm leading-relaxed text-[#475569]">
                  {item.a}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
