import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";

/**
 * Same structure as the landing navbar: logo, section anchors (to marketing page), Log out on the right.
 */
export default function DashboardNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="container-width mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="Renwize home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#1E254A] lg:flex">
          <Link href="/#features" className="transition hover:text-[#1FA168]">
            Features
          </Link>
          <Link href="/#how-it-works" className="transition hover:text-[#1FA168]">
            How it works
          </Link>
          <Link href="/#pricing" className="transition hover:text-[#1FA168]">
            Pricing
          </Link>
          <Link href="/#faq" className="transition hover:text-[#1FA168]">
            FAQ
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
