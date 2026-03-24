import PricingPagePlans from "@/components/PricingPagePlans";

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

        <PricingPagePlans />
      </div>
    </main>
  );
}
