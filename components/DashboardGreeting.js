"use client";

/**
 * Client-only greeting so "morning / afternoon / evening" matches the user's local clock.
 */
export default function DashboardGreeting({ userName }) {
  const hour = new Date().getHours();
  let phrase = "Good evening";
  if (hour < 12) phrase = "Good morning";
  else if (hour < 17) phrase = "Good afternoon";

  return (
    <h1 className="text-2xl font-bold tracking-tight text-[#1E254A] sm:text-3xl">
      {phrase}, {userName}!
    </h1>
  );
}
