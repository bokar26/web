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
  metadataBase: new URL("https://sla.ai"),
  title: "SLA - Enterprise planning that thinks ahead.",
  description: "SLA fuses ERP essentials with AI and ML intelligence to build faster, smarter, and more robust workflows.",
  keywords: ["logistics", "sourcing", "supply chain", "shipping", "suppliers", "cost optimization"],
  authors: [{ name: "SLA Team" }],
  creator: "SLA",
  publisher: "SLA",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sla.ai",
    siteName: "SLA",
    title: "SLA - Enterprise planning that thinks ahead.",
    description: "SLA fuses ERP essentials with AI and ML intelligence to build faster, smarter, and more robust workflows.",
    images: [
      {
        url: "https://sla.ai/images/SLA-Logo copy.png",
        width: 1200,
        height: 630,
        alt: "SLA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLA - Enterprise planning that thinks ahead.",
    description: "SLA fuses ERP essentials with AI and ML intelligence to build faster, smarter, and more robust workflows.",
    creator: "@sla_ai",
    images: ["https://sla.ai/images/SLA-Logo copy.png"],
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
