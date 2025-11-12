import { redirect } from "next/navigation"

export default function OrdersRedirect() {
  redirect("/dashboard/manage/orders")
}
