import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PublicChrome from "@/components/layout/PublicChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devphoenix.tech'),
  title: {
    template: '%s | DevPhoeniX',
    default: 'DevPhoeniX — Build. Ship. Rise.',
  },
  description: 'DevPhoeniX is India\'s premium AI-native education platform. Learn Full Stack, AI Automation, Cloud, and Data — from real builders, for real careers.',
  keywords: ['devphoenix', 'learn coding india', 'AI automation course', 'full stack development india', 'cloud computing course', 'tech education', 'builder ecosystem'],
  authors: [{ name: 'DevPhoeniX Team', url: 'https://devphoenix.tech' }],
  creator: 'DevPhoeniX Technologies',
  publisher: 'DevPhoeniX Technologies',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://devphoenix.tech' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://devphoenix.tech',
    siteName: 'DevPhoeniX',
    title: 'DevPhoeniX — Build. Ship. Rise.',
    description: 'India\'s premium AI-native education platform. Real projects. Real systems. Real careers.',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'DevPhoeniX — Build. Ship. Rise.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPhoeniX — Build. Ship. Rise.',
    description: 'India\'s premium AI-native education platform.',
    images: ['/og/default.png'],
    creator: '@devphoenix_in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#FFF9F5] text-slate-900 selection:bg-orange-200"
        suppressHydrationWarning
      >
        {/* PublicChrome renders Navbar + LeadPopup only on non-admin pages */}
        <PublicChrome />
        {children}
      </body>
    </html>
  );
}
