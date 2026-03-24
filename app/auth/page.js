import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import AuthForm from "@/components/AuthForm";

export default async function AuthPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="inline-flex" aria-label="Renwize home">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand lockup from public/ */}
            <img
              src="/logo-lockup.svg"
              alt="Renwize"
              className="h-9 w-auto sm:h-10"
              width={200}
              height={64}
            />
          </Link>
        </div>
        <h1 className="mb-2 text-center text-3xl font-bold text-[#1E254A]">Welcome to Renwize</h1>
        <p className="mb-6 text-center text-[#64748B]">
          Create your account or log in to manage your subscriptions.
        </p>
        <AuthForm />
      </div>
    </main>
  );
}
