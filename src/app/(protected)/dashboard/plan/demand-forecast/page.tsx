import { redirect } from "next/navigation"

export default function DemandForecastRedirect() {
  redirect("/dashboard/plan/demand")
}
