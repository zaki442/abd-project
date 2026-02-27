import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  metadataBase: new URL("https://agilebdarija.com"),
  title: "Agile B Darija: Master Agility as a Way of Life in Morocco",
  description: "Agile B Darija is the premier Moroccan hub for Agile practitioners, students, and leaders to collaborate, learn, and grow through workshops and community events.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Agile B Darija: Master Agility as a Way of Life in Morocco",
    description: "Agile B Darija is the premier Moroccan hub for Agile practitioners, students, and leaders to collaborate, learn, and grow through workshops and community events.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Agile B Darija Community - Moroccan Agile Hub",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agile B Darija: Master Agility as a Way of Life in Morocco",
    description: "Agile B Darija is the premier Moroccan hub for Agile practitioners, students, and leaders to collaborate, learn, and grow through workshops and community events.",
    images: ["/og-image.png"],
  },
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="dark">
      <body className={`font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
