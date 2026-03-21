import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
  {
    title: "All your subscriptions in one place",
    description: "Track Netflix, Spotify, SaaS tools, or any recurring expense in one clear view.",
  },
  {
    title: "Reminders before you're charged",
    description: "Get an email alert 3 days before every subscription renewal date.",
  },
  {
    title: "Free to start",
    description: "Email reminders are free forever. SMS and WhatsApp reminders are coming soon.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="container-width mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#1E254A] md:flex">
            <a href="#features" className="hover:text-[#1FA168]">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#1FA168]">
              Pricing
            </a>
            <Link
              href="/auth"
              className="rounded-lg bg-[#1FA168] px-4 py-2 text-white transition hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
          <Link
            href="/auth"
            className="rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Start
          </Link>
        </div>
      </header>

      <main>
        <section className="container-width mx-auto px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-block rounded-full bg-[#FFDAB9] px-4 py-1 text-sm font-semibold text-[#1E254A]">
              Stay in control of recurring payments
            </p>
            <h1 className="text-4xl font-bold leading-tight text-[#1E254A] sm:text-5xl">
              Never get surprised by a subscription charge again.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#334155]">
              Renwize tracks all your subscriptions and sends you email reminders 3 days before
              you&apos;re charged. Free forever for email reminders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="rounded-lg bg-[#1FA168] px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="rounded-lg border border-[#1E254A] px-5 py-3 font-semibold text-[#1E254A] transition hover:bg-[#1E254A] hover:text-white"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="container-width mx-auto px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold text-[#1E254A]">Features</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                <h3 className="text-lg font-bold text-[#1E254A]">{feature.title}</h3>
                <p className="mt-3 text-[#475569]">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="container-width mx-auto px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold text-[#1E254A]">Pricing</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border-2 border-[#1FA168] bg-white p-6">
              <p className="text-sm font-semibold uppercase text-[#1FA168]">Free Plan</p>
              <p className="mt-4 text-4xl font-bold text-[#1E254A]">$0</p>
              <p className="text-[#64748B]">/month</p>
              <ul className="mt-5 space-y-2 text-[#334155]">
                <li>Email reminders</li>
                <li>Unlimited subscriptions</li>
              </ul>
            </article>

            <article className="rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] p-6 opacity-80">
              <p className="text-sm font-semibold uppercase text-[#64748B]">Pro Plan (Coming Soon)</p>
              <p className="mt-4 text-4xl font-bold text-[#1E254A]">$5</p>
              <p className="text-[#64748B]">/month</p>
              <ul className="mt-5 space-y-2 text-[#334155]">
                <li>SMS reminders</li>
                <li>WhatsApp reminders</li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-[#E2E8F0] bg-white">
        <div className="container-width mx-auto flex flex-col justify-between gap-3 px-4 py-6 text-sm text-[#64748B] sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Renwize. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#1E254A]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1E254A]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
