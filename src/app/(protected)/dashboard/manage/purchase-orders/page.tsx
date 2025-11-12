import { redirect } from "next/navigation"

export default function PurchaseOrdersRedirect() {
  redirect("/workbench/inventory/purchase-orders")
}

