import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import ThemeProvider from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SLA - Data-Driven Logistics & Sourcing",
  description: "Cut landed costs by 30% with AI-powered supplier matching and route optimization. Trusted by 1,000+ buyers & suppliers worldwide.",
  keywords: ["logistics", "sourcing", "supply chain", "shipping", "suppliers", "cost optimization"],
  authors: [{ name: "SLA Team" }],
  creator: "SLA",
  publisher: "SLA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sla.ai",
    title: "SLA - Data-Driven Logistics & Sourcing",
    description: "Cut landed costs by 30% with AI-powered supplier matching and route optimization",
    siteName: "SLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "SLA - Data-Driven Logistics & Sourcing",
    description: "Cut landed costs by 30% with AI-powered supplier matching and route optimization",
    creator: "@sla_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
