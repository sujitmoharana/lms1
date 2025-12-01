import "server-only"
import { reuireUser } from "../user/require-user"
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarDate(slug:string)
{
    const session = await reuireUser();

    const courses = await prisma.course.findUnique({
        where:{
            slug:slug
        },
        select:{
            id:true,
            title:true,
            filekey:true,
            duration:true,
            lavel:true,
            category:true,
            slug:true,
            chapter:{
                orderBy:{
                position:"asc"
                },
                select:{
                    id:true,
                    title:true,
                    position:true,
                    lessons:{
                        orderBy:{
                          position:"asc"  
                        }
                    }
                }
            }
        }
    })
  console.log("course",courses);
    if (!courses) {
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId:session.id,
                courseId:courses.id
            }
        }
    })
console.log("enrollment",enrollment);
    if (!enrollment || enrollment.status !== "Active") {
        return notFound()
    }

    return {
        courses,
    }
}


export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarDate>>