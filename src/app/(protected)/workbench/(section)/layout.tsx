import { WorkbenchNav } from "@/features/workbench/WorkbenchNav"

export default function WorkbenchSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col bg-background">
      <WorkbenchNav />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

