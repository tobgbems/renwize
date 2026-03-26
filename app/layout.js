import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Renwize",
  description: "Track subscriptions and avoid surprise charges.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Renwize — Smart Subscription Tracker",
    description: "Track your subscriptions and get email reminders before you're charged. Works in Naira and USD.",
    url: "https://www.renwize.com",
    siteName: "Renwize",
    images: [
      {
        url: "https://www.renwize.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Renwize - Smart Subscription Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renwize — Smart Subscription Tracker",
    description: "Track your subscriptions and get email reminders before you're charged.",
    images: ["https://www.renwize.com/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
