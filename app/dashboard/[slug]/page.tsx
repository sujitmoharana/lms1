import { getCourseSidebarDate } from '@/app/data/course/get-course-sidebar-data';
import { redirect } from 'next/navigation';
import React from 'react'


interface iAppProps{
  params:Promise<{slug:string}>
}
const CourseSlugRoute = async({params}:iAppProps) => {
  const {slug} =await params;

  const course = await getCourseSidebarDate(slug)

  const firstChapter = course.courses.chapter[0]
  const firstlesson = firstChapter.lessons[0]

  if (firstlesson) {
    redirect(`/dashboard/${slug}/${firstlesson.id}`)
  }
  return (
    <div className='flex items-center justify-center h-full text-center'>
         <h2 className='text-2xl font-bold mb-2'>No Lesson avalaible</h2>
         <p className='text-muted-foreground'>this course does not have any lessons yet!</p>
    </div>
  )
}

export default CourseSlugRoute