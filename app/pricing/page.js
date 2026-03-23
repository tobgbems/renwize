import Link from "next/link";

export const metadata = {
  title: "Pricing | Renwize",
  description: "Choose a Renwize plan.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F4F6F8] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-[#1E254A] sm:text-4xl">Simple pricing</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#64748B]">
            Start free with email reminders. Upgrade to Pro to unlock SMS and WhatsApp
            reminders as those channels roll out.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1FA168]">Free</h2>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-[#1E254A]">$0</span>
              <span className="text-[#64748B]">/month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-[#334155]">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
                Email reminders
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
                Unlimited subscriptions
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-8 w-full cursor-default rounded-xl border border-[#1E254A] py-3 text-sm font-bold text-[#1E254A]"
            >
              Current plan
            </button>
          </article>

          <article className="flex flex-col rounded-2xl bg-[#1FA168] p-8 text-white shadow-[0_20px_50px_-14px_rgba(31,161,104,0.55)]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/90">Pro</h2>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold">NGN 2,000</span>
              <span className="text-white/80">/month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-white/95">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                Everything in Free
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                SMS reminders (coming soon)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                WhatsApp reminders (coming soon)
              </li>
            </ul>
            <Link
              href="/api/payments/initiate"
              className="mt-8 inline-block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-[#1FA168] transition hover:bg-[#ECFDF3]"
            >
              Upgrade to Pro
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
