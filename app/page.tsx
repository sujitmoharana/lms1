import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'

const  Page = async() => {

  const session = await auth.api.getSession({
    headers:await headers()
  })
  console.log(session);
  
  return (
    <div>
    <div>hello world</div>
    <ThemeToggle/>
    {session?(
      <p>{session.user.name}</p>
    ):(
      <button>Logout</button>
    )}
    </div>
  )
}

export default Page