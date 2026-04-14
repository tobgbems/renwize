import Link from "next/link";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import DashboardNav from "@/components/DashboardNav";
import DashboardSidebar from "@/components/DashboardSidebar";
import BottomNav from "@/components/BottomNav";
import DashboardGreeting from "@/components/DashboardGreeting";
import DeleteSubscriptionButton from "@/components/DeleteSubscriptionButton";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import EditSubscriptionForm from "@/components/EditSubscriptionForm";
import {
  formatMoney,
  formatCategoryLabel,
  billingCycleLabel,
  formatDate,
  daysFromToday,
  sumByCurrency,
  formatTotalsByCurrency,
} from "@/lib/subscriptionDisplay";

const CATEGORIES = ["streaming", "saas", "fitness", "finance", "utilities", "other"];
const BILLING_CYCLES = ["monthly", "yearly"];

/**
 * Resolve Supabase user id from session email (JWT stores name/email; id is looked up here).
 */
async function getUserByEmail(supabase, email) {
  const { data, error } = await supabase
    .from("users")
    .select("id, is_pro, pro_expires_at, name, email, phone_number")
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

function normalizeSection(section) {
  if (section === "subscriptions") return "subscriptions";
  if (section === "settings") return "settings";
  return "overview";
}

function parseFilterState(searchParams) {
  const q = (searchParams?.q || "").toString().trim();
  const category = (searchParams?.category || "all").toString().toLowerCase();
  const billingCycle = (searchParams?.billing_cycle || "all").toString().toLowerCase();
  const currency = (searchParams?.currency || "all").toString().toUpperCase();
  const remindToCancel = (searchParams?.remind_to_cancel || "all").toString().toLowerCase();
  return {
    q,
    category: CATEGORIES.includes(category) ? category : "all",
    billingCycle: BILLING_CYCLES.includes(billingCycle) ? billingCycle : "all",
    currency,
    remindToCancel: remindToCancel === "flagged" ? "flagged" : "all",
  };
}

function applySubscriptionFilters(subscriptions, filters) {
  let result = [...subscriptions];

  if (filters.q) {
    const needle = filters.q.toLowerCase();
    result = result.filter((s) => (s.name || "").toLowerCase().includes(needle));
  }

  if (filters.category !== "all") {
    result = result.filter((s) => (s.category || "other").toLowerCase() === filters.category);
  }

  if (filters.billingCycle !== "all") {
    result = result.filter((s) => s.billing_cycle === filters.billingCycle);
  }

  if (filters.currency !== "ALL") {
    result = result.filter((s) => (s.currency || "USD").toUpperCase() === filters.currency);
  }

  if (filters.remindToCancel === "flagged") {
    result = result.filter((s) => Boolean(s.remind_to_cancel));
  }

  result.sort((a, b) => {
    const aTime = new Date(a.next_billing_date).getTime();
    const bTime = new Date(b.next_billing_date).getTime();
    return aTime - bTime;
  });

  return result;
}

function SubscriptionCards({ subscriptions, section }) {
  if (!subscriptions.length) {
    return (
      <p className="mt-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-white/80 px-4 py-10 text-center text-[#64748B]">
        No subscriptions match your current filters.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {subscriptions.map((s) => (
        <article
          key={s.id}
          className="flex min-w-0 flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#1FA168]/30 hover:shadow-md"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <h3 className="min-w-0 flex-1 truncate text-base font-bold text-[#1E254A]" title={s.name}>
              {s.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {s.remind_to_cancel ? (
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200">
                  Remind to cancel
                </span>
              ) : null}
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${categoryBadgeClass(s.category)}`}
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
              href={`/dashboard?section=${section}&modal=edit&id=${s.id}`}
              className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm font-semibold text-[#1E254A] transition hover:border-[#1FA168]/40 hover:bg-white"
            >
              Edit
            </Link>
            <DeleteSubscriptionButton subscriptionId={s.id} subscriptionName={s.name} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function DashboardPage({ searchParams }) {
  const session = await auth();
  const email = session?.user?.email;
  const resolvedSearchParams = await searchParams;
  const upgraded = resolvedSearchParams?.upgraded === "true";
  const section = normalizeSection(resolvedSearchParams?.section);
  const filters = parseFilterState(resolvedSearchParams || {});
  const modal = resolvedSearchParams?.modal;
  const modalSubscriptionId = resolvedSearchParams?.id?.toString() || "";
  const isAddModalOpen = modal === "add";
  const isEditModalOpen = modal === "edit" && Boolean(modalSubscriptionId);

  let subscriptions = [];
  let loadError = null;
  let isPro = false;
  let profileName = session?.user?.name || "";
  let profileEmail = email || "";
  let profilePhoneNumber = "";

  if (email) {
    const supabase = getSupabaseAdmin();
    const userRow = await getUserByEmail(supabase, email);

    if (userRow?.id) {
      isPro = Boolean(userRow.is_pro);
      profileName = userRow.name || profileName;
      profileEmail = userRow.email || profileEmail;
      profilePhoneNumber = userRow.phone_number || "";

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
  const currencies = [...new Set(subscriptions.map((s) => (s.currency || "USD").toUpperCase()))].sort();

  // Renewals in the next 7 days (inclusive of today through +7 calendar days)
  const upcoming = subscriptions
    .filter((s) => {
      const d = daysFromToday(s.next_billing_date);
      return d >= 0 && d <= 7;
    })
    .sort((a, b) => new Date(a.next_billing_date) - new Date(b.next_billing_date));

  const filteredSubscriptions = applySubscriptionFilters(subscriptions, filters);
  const overviewPreview = subscriptions.slice(0, 6);
  const greetingName = profileName || session?.user?.email?.split("@")[0] || "friend";
  const editingSubscription =
    isEditModalOpen && modalSubscriptionId
      ? subscriptions.find((s) => s.id === modalSubscriptionId) || null
      : null;
  const baseSectionHref = `/dashboard?section=${section}`;

  return (
    <div className="min-h-full flex flex-col bg-[#F8FAFC]">
      <DashboardNav />

      <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-6 px-4 py-8 pb-24 sm:px-6 sm:py-10 sm:pb-28 md:pb-10 lg:flex-row lg:items-start">
        <DashboardSidebar />

        <div className="min-w-0 flex-1">
          {upgraded ? (
            <p className="mb-6 rounded-xl border border-[#1FA168]/35 bg-[#ECFDF3] px-4 py-3 text-sm font-medium text-[#0F5C3A]">
              You&apos;re now on Pro! SMS and WhatsApp reminders coming soon.
            </p>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {section === "overview" ? (
              <DashboardGreeting userName={greetingName} isPro={isPro} />
            ) : section === "settings" ? (
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">Settings</h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  Manage your profile details for future reminder channels.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">Subscriptions</h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  Track and manage all your subscriptions with filters.
                </p>
              </div>
            )}
            {section !== "settings" ? (
              <Link
                href={`/dashboard?section=${section}&modal=add`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1FA168] px-5 py-3 text-center text-sm font-bold text-white shadow-md shadow-[#1FA168]/25 transition hover:opacity-95"
              >
                Add subscription
              </Link>
            ) : null}
          </div>

          {loadError ? (
            <p className="mt-6 rounded-xl border border-[#FECACA] bg-white px-4 py-3 text-sm text-[#E8203B]">
              Could not load subscriptions: {loadError}
            </p>
          ) : null}

          {section === "overview" ? (
            <>
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
                      const dayLabel = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
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

              <section className="mt-10" aria-labelledby="overview-subs-heading">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 id="overview-subs-heading" className="text-lg font-bold text-[#1E254A]">
                      Subscriptions preview
                    </h2>
                    <p className="mt-1 text-sm text-[#64748B]">Showing your first few subscriptions.</p>
                  </div>
                  <Link
                    href="/dashboard?section=subscriptions"
                    className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#1E254A] transition hover:border-[#1FA168]/35"
                  >
                    View all subscriptions
                  </Link>
                </div>
                <SubscriptionCards subscriptions={overviewPreview} section={section} />
              </section>
            </>
          ) : section === "subscriptions" ? (
            <section className="mt-8" aria-labelledby="all-heading">
              <form method="GET" className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <input type="hidden" name="section" value="subscriptions" />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                  <input
                    type="search"
                    name="q"
                    defaultValue={filters.q}
                    placeholder="Search subscriptions"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E254A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20 xl:col-span-2"
                  />
                  <select
                    name="category"
                    defaultValue={filters.category}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E254A] outline-none transition focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {formatCategoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                  <select
                    name="billing_cycle"
                    defaultValue={filters.billingCycle}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E254A] outline-none transition focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20"
                  >
                    <option value="all">All billing</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <select
                    name="currency"
                    defaultValue={filters.currency}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E254A] outline-none transition focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20"
                  >
                    <option value="ALL">All currencies</option>
                    {currencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                  <select
                    name="remind_to_cancel"
                    defaultValue={filters.remindToCancel}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E254A] outline-none transition focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20"
                  >
                    <option value="all">All reminder states</option>
                    <option value="flagged">Remind to cancel only</option>
                  </select>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    Apply filters
                  </button>
                  <Link
                    href="/dashboard?section=subscriptions"
                    className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#1E254A] transition hover:bg-white"
                  >
                    Reset
                  </Link>
                </div>
              </form>

              <h2 id="all-heading" className="mt-6 text-lg font-bold text-[#1E254A]">
                All subscriptions
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {filteredSubscriptions.length} result{filteredSubscriptions.length === 1 ? "" : "s"} found.
              </p>
              <SubscriptionCards subscriptions={filteredSubscriptions} section={section} />
            </section>
          ) : (
            <section className="mt-8">
              <div className="max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold text-[#1E254A]">Profile settings</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  You can update your name and phone number here.
                </p>

                <div className="mt-6">
                  <ProfileSettingsForm
                    initialName={profileName}
                    initialPhoneNumber={profilePhoneNumber}
                    email={profileEmail}
                  />
                </div>
              </div>
            </section>
          )}

          {!isPro ? (
            <section className="mt-10">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] sm:flex-row sm:items-center sm:justify-between">
                <p>Upgrade to Pro to unlock SMS and WhatsApp reminders as soon as they launch.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-lg border border-[#1FA168]/35 bg-[#ECFDF3] px-3 py-2 font-semibold text-[#0F5C3A] transition hover:bg-[#DFF8EA]"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        {isAddModalOpen || isEditModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0F172A]/45 p-4 sm:p-8">
            <div className="my-6 w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1E254A]">
                    {isEditModalOpen ? "Edit subscription" : "Add subscription"}
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {isEditModalOpen
                      ? "Update your subscription details and save."
                      : "Fill in details to add a new subscription."}
                  </p>
                </div>
                <Link
                  href={baseSectionHref}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm font-semibold text-[#1E254A] transition hover:bg-white"
                >
                  Close
                </Link>
              </div>

              {isEditModalOpen && !editingSubscription ? (
                <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#E8203B]">
                  Subscription not found.
                </p>
              ) : isEditModalOpen ? (
                <EditSubscriptionForm subscription={editingSubscription} redirectTo={baseSectionHref} />
              ) : (
                <AddSubscriptionForm redirectTo={baseSectionHref} />
              )}
            </div>
          </div>
        ) : null}
      </main>
      <BottomNav />
    </div>
  );
}
