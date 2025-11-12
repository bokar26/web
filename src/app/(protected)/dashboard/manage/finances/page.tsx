import { redirect } from "next/navigation"

export default function FinancesRedirect() {
  redirect("/workbench/accounting?tab=finances")
}

