"use client"
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const  Page = () => {
const {data:session}= authClient.useSession()
const router  = useRouter()
async function signout(){
  await authClient.signOut({
    fetchOptions:{
      onSuccess:()=>{
        router.push("/")
        toast.success("signed out successfully")
      }
    }
  })
}

  return (
    <div>
    <div>hello world</div>
    <ThemeToggle/>
    {session?(
      <div>
      <p>{session.user.name}</p>
      <Button onClick={signout}>
        Logout
        </Button>
      </div>
    ):(
      <button>Login</button>
    )}
    </div>
  )
}

export default Page