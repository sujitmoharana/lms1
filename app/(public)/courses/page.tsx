import { getAllCourses } from '@/app/data/course/get-all-courses'
import React, { Suspense } from 'react'
import PublicCourseCard, { PublicCourseCardSkeleton } from '../_components/PublicCourseCard'

const PublicCourseRoute = () => {
  return (
    <div className='mt-5'>
           <div className='flex flex-col space-y-2 mb-10'>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tighter'>Explore Courses</h1>
            <p className='text-muted-foreground '>Discover ourwide range of course designed to help you achive your learing goals</p>
           </div>
      <Suspense fallback={<LoadingSkeletonLayout/>}>
      <RenderCourse/>
      </Suspense>
    </div>
  )
}

export default PublicCourseRoute

 async function RenderCourse()
{
    const courses = await getAllCourses()
    console.log(courses);
    return(
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
           {courses.map((course)=>(
            <PublicCourseCard key={course.id} data={course}/>
           ))}
        </div>
    )
}


function LoadingSkeletonLayout()
{
    return(
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
       {Array.from({length:9}).map((_,index)=>(
        <PublicCourseCardSkeleton key={index}/>
       ))}
        </div>
    )
}