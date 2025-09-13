import { buttonVariants } from '@/components/ui/button' //1
import Link from 'next/link'
import React from 'react'
const Courses = () => {
  return (
    <>
  <div className='flex items-center justify-between'>
     <h1 className='text-2xl font-bold'>Your Courses</h1>
     <Link className={buttonVariants({variant:"outline"})} href="/admin/courses/create">
     Create Course
     </Link>
    </div>
    <div>
      <h1>Here you will see all of the courses</h1>
      </div>     
    </>
  )
}

export default Courses