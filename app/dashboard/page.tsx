import EmptyState from "@/components/general/EmptyState"
import { getAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourse } from "../data/user/get-enrolled-course"
import PublicCourseCard from "../(public)/_components/PublicCourseCard"

export  default async function DashboardPage()
{

  const [courses,enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourse()
  ])
  return (
    <>
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">
        Enrolled Courses
      </h1>
      <p className="text-muted-foreground">here you can see all the courses you have access to</p>
    </div>
    {
      enrolledCourses.length === 0 ?(
        <EmptyState title="no courses putches" description="you have not purches any course yet" buttonText="Browse courses" href="/courses"/>
      ):(
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          enrolledCourses.map((course)=>(
            <PublicCourseCard data={course.Course} key={course.Course.id}/>
          ))
        }
       </div>
      )
    }

    <section className="mt-10">
    <div className="flex flex-col gap-2 mb-5">
      <h1 className="text-3xl font-bold">
        Avalaible Courses
      </h1>
      <p className="text-muted-foreground">here you can see all the courses you can purchese</p>
    </div>
    </section>
    {
      courses.filter((course)=>!enrolledCourses.some(({Course:enrolled})=>enrolled.id === course.id)).length === 0 ?(
        <EmptyState title="no courses avalaible" description="you have already purchese all avaliable course " buttonText="Browse Courses" href="/courses" />
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {
            courses.filter((course)=>!enrolledCourses.some(({Course:enrolled})=>enrolled.id === course.id)).map((course)=>(
              <PublicCourseCard data={course} key={course.id}/>
            ))
          }
        </div>
      )
    }
    </>
  )
}