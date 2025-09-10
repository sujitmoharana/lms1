"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from "@/public/online-course.png"
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { buttonVariants } from '@/components/ui/button'
const navigationItems = [
    {name:"home",href:"/"},
    {name:"courses",href:"/courses"},
    {name:"dashboard",href:"/dashboard"}
]
const Navbar = () => {
    const {data:session,isPending} = authClient.useSession();
    console.log(session);
    console.log(isPending);
  return (
  <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-backgrond/60 '>
    <div className='container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8'>
        <Link href="/" className='flex items-center space-x-2 mr-4'>
        <Image src={Logo} alt='logo' className='size-9'/>
        <span className='font-bold'>SujitLMS.</span>
        </Link>
        <nav className='hidden md:flex md:w-full md:items-center md:justify-between'>
            <div className='flex items-center space-x-2'>
                {navigationItems.map((item)=>{
                 return(
                    <Link key={item.name} href={item.href} className='text-sm font-medium transition-colors hover:text-primary'>
                        {item.name}
                    </Link>
                 )
                })}
            </div>
            <div className='flex items-center space-x-4'>
                <ThemeToggle/>
                {
                    isPending?null:session?(
                      <p>logged in</p>
                    ):(
                        <>
                        <Link href="/login" className={buttonVariants({variant:"secondary"})}>
                        Login
                        </Link>
                        <Link href="/login" className={buttonVariants()}>
                        Get Started
                        </Link>
                        </>
                    )
                }
            </div>
        </nav>
    </div>
  </header>
  )
}

export default Navbar