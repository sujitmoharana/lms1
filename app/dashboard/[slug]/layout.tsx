import React, { ReactNode } from 'react'
import CourseSidebar from '../_components/CourseSidebar'
import { getCourseSidebarDate } from '@/app/data/course/get-course-sidebar-data';


interface iAppProps{
  params : Promise<{slug:string}>;
  children:ReactNode
}

const layout = async({children,params}:iAppProps) => {

  const {slug} = await params;
   console.log("slug",slug)
  //server-side security check and lightweight data fetching
  const course = await getCourseSidebarDate(slug);
  console.log("courses",course);
  return (
    <div className='flex flex-1'>
       {/* sidebar -30% */}
       <div className='w-80 border-r border-border shrink-0'>
        <CourseSidebar course={course.courses}/>
       </div>
       {/* main content - 70% */}
       <div className='flex-1 overflow-hidden'>
        {children}
       </div>
    </div>
  )
}

export default layout