import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";
import EditSubscriptionForm from "@/components/EditSubscriptionForm";

export const metadata = {
  title: "Edit subscription | Renwize",
  description: "Update a subscription in Renwize.",
};

async function getUserIdByEmail(supabase, email) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();
  if (error || !data) return null;
  return data.id;
}

export default async function EditSubscriptionPage({ params }) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth");
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const userId = await getUserIdByEmail(supabase, session.user.email);
  if (!userId) {
    notFound();
  }

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select(
      "id, name, amount, currency, billing_cycle, next_billing_date, category, notes, remind_to_cancel",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !subscription) {
    notFound();
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
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">Edit subscription</h1>
          <p className="mt-2 max-w-xl text-[#64748B]">
            Update the details below. Changes are saved to your account only.
          </p>
        </div>

        <div className="max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          <EditSubscriptionForm subscription={subscription} />
        </div>
      </main>
    </div>
  );
}
