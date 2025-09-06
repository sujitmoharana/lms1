"use client" //6
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

const Verify = () => {
    const router= useRouter();
    const [otp,setOtp] = useState('');
    const [emailpending,starTransition] = useTransition() 
    const params = useSearchParams()
    const email = params.get('email') as string
    const iscompleted = otp.length === 6;

    console.log(otp,email);    
    function veriyotp()
    {
        starTransition(async()=>{
            await authClient.signIn.emailOtp({
                email:email,
                otp:otp,
                fetchOptions:{
                    onSuccess:()=>{
                        toast.success('Email verifid')
                        router.push("/")
                    },
                    onError:()=>{
                        toast.error("error verifying email/otp")
                    }
                }
            })
        })
    }
  return (
    <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Plaese check your email</CardTitle>
          <CardDescription>we have send a verification email code to your email address. please open the email and paste the code below</CardDescription>
        </CardHeader>
        <CardContent className='gap-5 flex flex-col'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <InputOTP value={otp} onChange={(value)=>setOtp(value)} maxLength={6} className='gap-2'>
                <InputOTPGroup>
                <InputOTPSlot index={0}/>
                <InputOTPSlot index={1}/>
                <InputOTPSlot index={2}/>
                </InputOTPGroup>
                <InputOTPGroup>
                <InputOTPSlot index={3}/>
                <InputOTPSlot index={4}/>
                <InputOTPSlot index={5}/>
                </InputOTPGroup>
                </InputOTP>
                <p className='test-sm text-muted-foreground'>Enter the 6-digit code send to your email</p>
            </div>
             <Button onClick={veriyotp} disabled={emailpending || !iscompleted} className='w-full'>
                {emailpending?(
                    <>
                    <Loader2 className='ize-4 animate-spin'/>
                    <span>Loading....</span>
                    </>
                ):(
                    <>
                    <p>Verify Account</p>
                    </>
                )}
             </Button>
        </CardContent>
    </Card>
  )
}

export default Verify