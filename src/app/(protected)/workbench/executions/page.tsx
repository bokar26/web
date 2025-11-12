import { redirect } from "next/navigation"

export default function ExecutionsRedirect() {
  redirect("/workbench#execute")
}

