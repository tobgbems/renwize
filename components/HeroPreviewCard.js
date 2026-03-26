/**
 * Floating app preview for the hero — mini “dashboard” with sample subscriptions.
 * Uses brand-adjacent avatar colors (Netflix red, Spotify green, iCloud blue).
 */
const rows = [
  {
    name: "Netflix",
    meta: "Monthly · Next: 28 Oct",
    amount: "₦3,600",
    avatarClass: "bg-[#E50914]",
    initial: "N",
  },
  {
    name: "Spotify",
    meta: "Monthly · Next: 12 Nov",
    amount: "$9.99",
    avatarClass: "bg-[#1DB954]",
    initial: "S",
  },
  {
    name: "iCloud",
    meta: "Monthly · Next: 10 Dec",
    amount: "₦900",
    avatarClass: "bg-[#007AFF]",
    initial: "i",
  },
];

export default function HeroPreviewCard() {
  return (
    <div className="relative w-full max-w-md lg:max-w-lg">
      {/* soft glow behind card */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#1FA168]/10 blur-2xl"
        aria-hidden
      />
      <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_20px_50px_-12px_rgba(30,37,74,0.15)] sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#1E254A]">Upcoming subscriptions</h2>
            <p className="text-xs font-medium text-[#64748B]">Demo preview</p>
          </div>
          <span className="rounded-full bg-[#FFDAB9]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#1E254A]">
            Preview
          </span>
        </div>

        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex items-center gap-3 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-3 py-2.5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${row.avatarClass}`}
              >
                {row.initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1E254A]">{row.name}</p>
                <p className="truncate text-xs text-[#64748B]">{row.meta}</p>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums text-[#1E254A]">{row.amount}</p>
            </li>
          ))}
        </ul>

       
      </div>
    </div>
  );
}
