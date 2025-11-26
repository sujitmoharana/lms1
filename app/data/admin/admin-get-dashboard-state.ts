import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function admingetdashboardState()
{
    await requireAdmin()

     const [totalSignups,totalcustomers,totalCourses,totalLesson] = await Promise.all([
        //total signup     
        prisma.user.count(),
        
        //total customers
        prisma.user.count({
            where:{
                enrollment:{
                    every:{}
                }
            }
        }),

        //total courses
        prisma.course.count(),

        //total lessons
        prisma.lesson.count()
     ])

     return {totalSignups,totalCourses,totalLesson,totalcustomers}

}