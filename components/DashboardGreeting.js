"use client";

/**
 * Client-only greeting so "morning / afternoon / evening" matches the user's local clock.
 */
export default function DashboardGreeting({ userName, isPro = false }) {
  const hour = new Date().getHours();
  let phrase = "Good evening";
  if (hour < 12) phrase = "Good morning";
  else if (hour < 17) phrase = "Good afternoon";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">
        {phrase}, {userName}!
      </h1>
      {isPro ? (
        <span className="inline-flex items-center rounded-full bg-[#1FA168]/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#0F5C3A] ring-1 ring-[#1FA168]/30">
          Pro
        </span>
      ) : null}
    </div>
  );
}
