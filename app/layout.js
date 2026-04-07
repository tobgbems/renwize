import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://renwize.com"),
  verification: {
    google: "3fZvPmudiTzMOI4O82tKluiYDhMyJ1UUw1c-IeEdi7Q",
  },
  title: {
    default: "Renwize — Subscription tracker & renewal reminders",
    template: "%s | Renwize",
  },
  description:
    "Track subscriptions in Naira and USD, see what you spend, and get email reminders before renewals so you are never surprised by charges.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Renwize — Subscription tracker & renewal reminders",
    description:
      "Track your subscriptions and get email reminders before you are charged. Works in Naira and USD.",
    url: "https://renwize.com",
    siteName: "Renwize",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renwize — Subscription tracker & renewal reminders",
    description:
      "Track your subscriptions and get email reminders before you are charged. Works in Naira and USD.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
