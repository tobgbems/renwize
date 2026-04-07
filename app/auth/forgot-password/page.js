import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
  robots: { index: false, follow: true },
};

export default async function ForgotPasswordPage() {
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
        <h1 className="mb-2 text-center text-3xl font-bold text-[#1E254A]">Forgot password</h1>
        <p className="mb-6 text-center text-[#64748B]">
          Enter your email and we will send you a link to reset your password.
        </p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
