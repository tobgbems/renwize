import Link from "next/link";
import HeroPreviewCard from "@/components/HeroPreviewCard";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import FooterEmailCapture from "@/components/FooterEmailCapture";

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

const howItWorksSteps = [
  {
    step: 1,
    title: "Add your subscriptions",
    description: "Enter name, amount, billing cycle, and next renewal date.",
  },
  {
    step: 2,
    title: "Choose your reminder timing",
    description: "Default is 3 days before. Custom options coming later.",
  },
  {
    step: 3,
    title: "Get notified by email",
    description: "We email you before each charge so nothing slips through.",
  },
  {
    step: 4,
    title: "Stay in control",
    description: "See everything in one place and avoid surprise renewals.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* Navbar — same brand; added section anchors + Log in */}
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="container-width mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="inline-flex shrink-0" aria-label="Renwize home">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand lockup from public/ */}
            <img
              src="/logo-lockup.svg"
              alt="Renwize"
              className="h-8 w-auto sm:h-9"
              width={180}
              height={58}
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#1E254A] lg:flex">
            <a href="#features" className="transition hover:text-[#1FA168]">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-[#1FA168]">
              How it works
            </a>
            <a href="#pricing" className="transition hover:text-[#1FA168]">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-[#1FA168]">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth"
              className="hidden text-sm font-semibold text-[#1E254A] hover:text-[#1FA168] sm:inline"
            >
              Log in
            </Link>
            <Link
              href="/auth"
              className="rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — text + floating preview; stacks on mobile */}
        <section className="container-width mx-auto px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
            <div className="order-2 max-w-xl lg:order-1">
              <p className="mb-4 inline-block rounded-full bg-[#FFDAB9] px-4 py-1.5 text-sm font-semibold text-[#1E254A]">
                Stay in control of recurring payments
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#1E254A] sm:text-5xl lg:text-[2.75rem] xl:text-5xl">
                Never get surprised by a subscription charge again.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#334155]">
                Renwize tracks all your subscriptions and sends you email reminders 3 days before
                you&apos;re charged.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-xl bg-[#1FA168] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#1FA168]/25 transition hover:opacity-95"
                >
                  Get Started Free
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#1E254A] bg-white px-6 py-3.5 text-sm font-bold text-[#1E254A] transition hover:bg-[#1E254A] hover:text-white"
                >
                  See How It Works
                </a>
              </div>
              {/* Trust line */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#64748B] sm:text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FA168]" />
                  No card required
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[#CBD5E1] sm:block" aria-hidden />
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FA168]" />
                  Email reminders free
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[#CBD5E1] sm:block" aria-hidden />
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FA168]" />
                  Privacy-friendly
                </span>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <HeroPreviewCard />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 border-t border-[#E2E8F0] bg-white py-16 sm:py-20">
          <div className="container-width mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-[#1E254A] sm:text-4xl">Features</h2>
              <p className="mt-3 text-[#64748B]">
                Everything you need to see renewals coming, before your card is charged.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-6 shadow-sm transition hover:border-[#1FA168]/40 hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1FA168]/10 text-[#1FA168]">
                    <span className="h-2 w-2 rounded-full bg-[#1FA168] ring-4 ring-[#1FA168]/20" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E254A]">{feature.title}</h3>
                  <p className="mt-3 text-[#475569] leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — 4 steps in a row on desktop */}
        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container-width mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-[#1E254A] sm:text-4xl">How it works</h2>
              <p className="mt-3 text-[#64748B]">
                From signup to your first reminder in four simple steps.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm lg:text-left"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1FA168] text-lg font-bold text-white lg:mx-0">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-[#1E254A]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />
        <FaqSection />
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white">
        <FooterEmailCapture />
        <div className="container-width mx-auto grid grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-[#64748B] sm:grid-cols-3 sm:gap-4 sm:px-6">
          <div className="flex justify-center sm:justify-start">
            <Link href="/" className="inline-flex" aria-label="Renwize home">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand lockup from public/ */}
              <img
                src="/logo-lockup.svg"
                alt="Renwize"
                className="h-7 w-auto opacity-90 sm:h-8"
                width={160}
                height={51}
              />
            </Link>
          </div>
          <p className="text-center">
            © {new Date().getFullYear()} Renwize. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:justify-end">
            <Link href="/privacy" className="font-medium hover:text-[#1E254A]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-medium hover:text-[#1E254A]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
