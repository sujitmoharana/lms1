import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from "@/public/online-course.png"
const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
       <div className='relative flex flex-col min-h-svh items-center  justify-center'>
        <Link href="/" className={buttonVariants({variant:"outline",className:"absolute top-4 left-4"})}>
        <ArrowLeft className='size-4'/> Back
        </Link>
       <div className='w-full max-w-sm flex flex-col gap-6'>
        <Link className='flex items-center self-center  font-medium ' href="/">
        <Image src={logo} alt='logo' height={40} width={40}/>
        SujitLms
        </Link>
        {children}
        <div className='text-balance text-center text-xs text-muted-foreground'>
          By clicking continue, you agree to our <span className='hover:underline hover:text-primary'> Terms of service </span> and <span className='hover:underline hover:text-primary'> Privacy Policy </span> 
        </div>
        </div>
       </div>
    </div>
  )
}

export default Layout