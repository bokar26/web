import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} marketing-dark bg-black text-white min-h-screen antialiased`}>
      {children}
    </div>
  )
}
