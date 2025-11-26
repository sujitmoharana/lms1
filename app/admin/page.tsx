import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"
import { adminGetEnrollmentsState } from "../data/admin/admin-get-enrollments-state"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses"
import EmptyState from "@/components/general/EmptyState"
import AdminCourseCard, { AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard"
import { Suspense } from "react"
export default async function Page() {
  const enrollmentData = await adminGetEnrollmentsState()
  return (
    <>
      <SectionCards />
        <ChartAreaInteractive data={enrollmentData} />
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold">
             Recent courses
             </h2>
             <Link className={buttonVariants({variant:"outline"})} href="/admin/courses">View All courses</Link>
           </div>
           <Suspense fallback={<RenderRecentCoursesSkeletonlayot/>}>
           <RenderRecentCourses/>
           </Suspense>
        </div>
      <DataTable data={data} />
    </>
  )
}


async function RenderRecentCourses()
{
  const datas =await adminGetRecentCourses()
  console.log("data",datas);
  if ( datas.length === 0) {
    return (
      <EmptyState buttonText="Create new Course" description="you dont have any courses.create some to see them here" title="you dont ave any courses" href="/admin/courses/create"/>
    )
  }

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {
      datas.map((course)=>(
        <AdminCourseCard key={course.id} data={course}/>
      ))
     }
     </div>
  )
}

function RenderRecentCoursesSkeletonlayot()
{
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({length:2}).map((_,index)=>(
        <AdminCourseCardSkeleton key={index}/>
      ))}
    </div>
  )
}