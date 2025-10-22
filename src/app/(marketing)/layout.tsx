export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing-dark bg-black text-white min-h-screen antialiased">
      {children}
    </div>
  )
}
