import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardNav from "@/components/DashboardNav";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";

export const metadata = {
  title: "Add subscription | Renwize",
  description: "Add a new subscription to track in Renwize.",
};

export default async function AddSubscriptionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-full flex flex-col bg-[#F8FAFC]">
      <DashboardNav />

      <main className="container-width mx-auto flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1FA168] transition hover:text-[#178a56]"
          >
            <span aria-hidden>←</span> Back to dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">Add subscription</h1>
          <p className="mt-2 max-w-xl text-[#64748B]">
            Enter the details below. We&apos;ll save it to your account and show it on your dashboard.
          </p>
        </div>

        <div className="max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          <AddSubscriptionForm />
        </div>
      </main>
    </div>
  );
}
