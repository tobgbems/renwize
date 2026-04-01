import Link from "next/link";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";
import DashboardGreeting from "@/components/DashboardGreeting";
import DeleteSubscriptionButton from "@/components/DeleteSubscriptionButton";
import {
  formatMoney,
  formatCategoryLabel,
  billingCycleLabel,
  formatDate,
  daysFromToday,
  sumByCurrency,
  formatTotalsByCurrency,
} from "@/lib/subscriptionDisplay";

/**
 * Resolve Supabase user id from session email (JWT stores name/email; id is looked up here).
 */
async function getUserByEmail(supabase, email) {
  const { data, error } = await supabase
    .from("users")
    .select("id, is_pro, pro_expires_at")
    .eq("email", email.toLowerCase())
    .single();
  if (error || !data) return null;
  return data;
}

function categoryBadgeClass(category) {
  const k = (category || "").toLowerCase();
  const map = {
    streaming: "bg-[#1FA168]/15 text-[#0F5C3A] ring-[#1FA168]/25",
    saas: "bg-[#1E254A]/10 text-[#1E254A] ring-[#1E254A]/15",
    fitness: "bg-[#E8203B]/10 text-[#A61630] ring-[#E8203B]/20",
    finance: "bg-amber-100 text-amber-900 ring-amber-200",
    utilities: "bg-sky-100 text-sky-900 ring-sky-200",
    other: "bg-[#FFDAB9]/80 text-[#1E254A] ring-[#FFDAB9]",
  };
  return map[k] || map.other;
}

export default async function DashboardPage({ searchParams }) {
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "friend";
  const email = session?.user?.email;
  const resolvedSearchParams = await searchParams;
  const upgraded = resolvedSearchParams?.upgraded === "true";

  let subscriptions = [];
  let loadError = null;
  let isPro = false;

  if (email) {
    const supabase = getSupabaseAdmin();
    const userRow = await getUserByEmail(supabase, email);

    if (userRow?.id) {
      isPro = Boolean(userRow.is_pro);

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userRow.id)
        .order("next_billing_date", { ascending: true });

      if (error) {
        loadError = error.message;
      } else {
        subscriptions = data || [];
      }
    }
  }

  const monthlyByCur = sumByCurrency(subscriptions, "monthly");
  const yearlyByCur = sumByCurrency(subscriptions, "yearly");
  const activeCount = subscriptions.length;

  // Renewals in the next 7 days (inclusive of today through +7 calendar days)
  const upcoming = subscriptions
    .filter((s) => {
      const d = daysFromToday(s.next_billing_date);
      return d >= 0 && d <= 7;
    })
    .sort((a, b) => new Date(a.next_billing_date) - new Date(b.next_billing_date));

  return (
    <div className="min-h-full flex flex-col bg-[#F8FAFC]">
      <DashboardNav />

      <main className="container-width mx-auto flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {upgraded ? (
          <p className="mb-6 rounded-xl border border-[#1FA168]/35 bg-[#ECFDF3] px-4 py-3 text-sm font-medium text-[#0F5C3A]">
            You&apos;re now on Pro! SMS and WhatsApp reminders coming soon.
          </p>
        ) : null}

        {/* Top: greeting + primary CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <DashboardGreeting userName={userName} isPro={isPro} />
          <Link
            href="/dashboard/add"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1FA168] px-5 py-3 text-center text-sm font-bold text-white shadow-md shadow-[#1FA168]/25 transition hover:opacity-95"
          >
            Add subscription
          </Link>
        </div>

        {loadError ? (
          <p className="mt-6 rounded-xl border border-[#FECACA] bg-white px-4 py-3 text-sm text-[#E8203B]">
            Could not load subscriptions: {loadError}
          </p>
        ) : null}

        {/* Summary cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Spending summary">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Total monthly spend
            </p>
            <p className="mt-2 text-2xl font-bold leading-snug text-[#1E254A]">
              {formatTotalsByCurrency(monthlyByCur)}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">Sum of monthly billing cycles</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Total yearly spend
            </p>
            <p className="mt-2 text-2xl font-bold leading-snug text-[#1E254A]">
              {formatTotalsByCurrency(yearlyByCur)}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">Sum of yearly billing cycles</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Active subscriptions
            </p>
            <p className="mt-2 text-2xl font-bold text-[#1FA168]">{activeCount}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">Tracked in your account</p>
          </div>
        </section>

        {/* Upcoming renewals */}
        <section className="mt-10" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="text-lg font-bold text-[#1E254A]">
            Upcoming renewals
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">Next 7 days</p>

          {upcoming.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-white/80 px-4 py-8 text-center text-sm text-[#64748B]">
              No renewals in the next week.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#E2E8F0] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              {upcoming.map((s) => {
                const days = daysFromToday(s.next_billing_date);
                const dayLabel =
                  days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
                return (
                  <li
                    key={s.id}
                    className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#1E254A]">{s.name}</p>
                      <p className="text-xs text-[#64748B]">{dayLabel}</p>
                    </div>
                    <p className="text-sm font-bold tabular-nums text-[#1E254A]">
                      {formatMoney(s.amount, s.currency)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* All subscriptions */}
        <section className="mt-10" aria-labelledby="all-heading">
          <h2 id="all-heading" className="text-lg font-bold text-[#1E254A]">
            All subscriptions
          </h2>

          {subscriptions.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-white/80 px-4 py-10 text-center text-[#64748B]">
              You haven&apos;t added any subscriptions yet. Use{" "}
              <strong className="text-[#1E254A]">Add subscription</strong> to get started.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {subscriptions.map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#1FA168]/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1E254A]">{s.name}</h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      {s.remind_to_cancel ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
                          Remind to cancel
                        </span>
                      ) : null}
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${categoryBadgeClass(s.category)}`}
                      >
                        {formatCategoryLabel(s.category)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-[#1E254A]">
                    {formatMoney(s.amount, s.currency)}
                  </p>
                  <dl className="mt-3 space-y-1 text-sm text-[#64748B]">
                    <div className="flex justify-between gap-2">
                      <dt>Billing</dt>
                      <dd className="font-medium text-[#1E254A]">{billingCycleLabel(s.billing_cycle)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Next renewal</dt>
                      <dd className="font-medium text-[#1E254A]">{formatDate(s.next_billing_date)}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F1F5F9] pt-4">
                    <Link
                      href={`/dashboard/edit/${s.id}`}
                      className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm font-semibold text-[#1E254A] transition hover:border-[#1FA168]/40 hover:bg-white"
                    >
                      Edit
                    </Link>
                    <DeleteSubscriptionButton subscriptionId={s.id} subscriptionName={s.name} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {!isPro ? (
          <section className="mt-10">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Upgrade to Pro to unlock SMS and WhatsApp reminders as soon as they launch.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-[#1FA168]/35 bg-[#ECFDF3] px-3 py-2 font-semibold text-[#0F5C3A] transition hover:bg-[#DFF8EA]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
