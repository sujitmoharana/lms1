import { auth } from "@/lib/auth"
import LoginFrom from "./_components/loginFrom"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
const loginPage = async() => {
  const session = await auth.api.getSession({
    headers:await headers()
  })
  if (session) {
    return redirect("/");
  }
  return (
   <LoginFrom/>
  )
}

export default loginPage