import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email || "friend";

  return (
    <main className="container-width mx-auto flex flex-1 items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#1E254A]">Welcome back, {userName}!</h1>
        <p className="mt-3 text-[#475569]">Dashboard coming soon.</p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
