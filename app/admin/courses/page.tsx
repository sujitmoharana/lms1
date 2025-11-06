import { adminGetCourses } from '@/app/data/admin/admin-get-courses'
import { buttonVariants } from '@/components/ui/button' //1
import Link from 'next/link'
import React, { Suspense } from 'react'
import AdminCourseCard, { AdminCourseCardSkeleton } from './_components/AdminCourseCard'
import EmptyState from '@/components/general/EmptyState'
const Courses = () => {
  return (
    <>
  <div className='flex items-center justify-between'>
     <h1 className='text-2xl font-bold'>Your Courses</h1>
     <Link className={buttonVariants({variant:"outline"})} href="/admin/courses/create">
     Create Course
     </Link>
    </div>
     <Suspense fallback = {<AdminCourseCardSkeletonlayout/>}>
     <Rendercourse/> 
     </Suspense>
    </>
  )
}

export default Courses

async function Rendercourse()
{
   const data = await adminGetCourses()

   return (
    <>
        {
      data.length === 0 ?(
        <EmptyState title='No courses found' description='create a new course to startted' buttonText='create course' href='/admin/courses/create'/>
      ):(
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7'>
        {data.map((course)=>{
          return(
           <AdminCourseCard key={course.id} data={course} />         
          )
        })}
        </div>    
      )
    } 
    </>
   )
}

function AdminCourseCardSkeletonlayout()
{
  return(
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7'>

      {Array.from({length:4}).map((_,index)=>(
        <AdminCourseCardSkeleton key={index}/>
      ))}

    </div>
  )
}