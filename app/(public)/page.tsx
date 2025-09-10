"use client"
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { title } from 'process'
import React from 'react'
import { toast } from 'sonner'

interface featureProps {
    title:string;
    description:string,
    icon:string
}

const features: Array<featureProps> = [
    {
      title: "Comprehensive Courses",
      description: "Access a wide range of carefully curated courses designed by industry experts",
      icon: "📚"
    },
    {
      title: "Interactive Learning",
      description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience",
      icon: "🎮"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your progress and achievement with detailed analytics and personalized dashboard",
      icon: "📊"
    },
    {
      title: "Community Support",
      description: "Join a vibrant community of learners and instructors to collaborate and share knowledge",
      icon: "👥"
    }
  ];
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
  <>
  <section className='relative py-20'>
  <div className='flex-col items-center text-center flex   space-y-8'>
    <Badge variant="outline">
        The Future of online Education
    </Badge>
    <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>Elevate your Learning Experience</h1>
    <p className='max-w-[800px] text-muted-foreground md:text-xl '>Discover a new way to learn woth our modern,interactive learning management system.Access high-quality course anytime,anywhere</p>
    <div className='flex flex-col sm:flex-row gap-4 mt-8'>
     <Link className={buttonVariants({size:"lg"})} href="/courses">Expolore courses</Link>
     <Link className={buttonVariants({size:"lg",variant:"outline"})} href="/login"  >Sign in </Link>
    </div>
  </div>
  </section>
  <section className='grid grid-cols-1 md:grid-cols-4  lg:grid-col-4 gap-6'>
    {features.map((feature,index)=>{
        return (
            <Card key={index} className='hover:shadow-lg transition-shadow'>
               <CardHeader>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <CardTitle>
                    <p>{feature.title}</p>
                </CardTitle>
               </CardHeader> 
               <CardContent>
                <p className='text-muted-foreground'>{feature.description}</p>
               </CardContent>
            </Card>
        )
    })}
  </section>
  </>
  )
}

export default Page