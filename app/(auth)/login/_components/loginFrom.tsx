'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { GithubIcon, Loader, Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

const LoginFrom = () => {
const [githubpending,startGithubTransition] = useTransition()
const [emailpending,startEmailTransition] = useTransition()
const [email,setEmail] = useState('');
const router = useRouter();
const signInWithGithub = ()=>{
    startGithubTransition(async()=>{        // https://chatgpt.com/s/t_68baa79c0e308191aa7ece475ee67503 
      await authClient.signIn.social({
        provider:"github",
        callbackURL:"/",
        fetchOptions:{
          onSuccess:()=>{
            toast.success('signed in with github,you will be redirected... ')
          },
          onError:(error)=>{
            toast.error("internal server error")
          }
        }})
     })
  }

   function signInwithEmail()  //5
  {
     startEmailTransition(async()=>{
       await authClient.emailOtp.sendVerificationOtp({
            email: email, // required
            type: "sign-in", // required
            fetchOptions:{
                onSuccess:()=>{
                  toast.success('email sent')
                  router.push(`/verify-request?email=${email}`)
                },
                onError:(error)=>{
                  toast.error("error sending email")
                }
              }
        });
     })
  }
  return (
    <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Welcome back!</CardTitle>  
          <CardDescription>Login with your Github or Email Account</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
            <Button disabled={githubpending} onClick={signInWithGithub} className='w-full' variant ='outline'>
           {githubpending?(
            <>
            <Loader className="size-4 animate-spin"/>
            <span>Loading...</span>
            </>
           ):(
            <>
            <GithubIcon className='size-4'/>
            Sign in with Github
            </>
           )}
            </Button>
            <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-card px-2 text-muted-foreground'>Or continue with</span>
            </div>

            <div className='grid gap-3'>
                 <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' placeholder='m@example.com'/>
                 </div>
                 <Button onClick={signInwithEmail} disabled={emailpending}>
                    {emailpending?(
                        <>
                        <Loader2 className='size-4 animate-spin'/>
                        <span>loading...</span>
                        </>
                    ):(
                        <>
                        <Send className='size-4'/>
                        <p>Continue with email</p>
                        </>
                    )}
                    </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default LoginFrom