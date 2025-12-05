import "server-only"
import { reuireUser } from "./require-user"
import { prisma } from "@/lib/db"

export async function getEnrolledCourse()
{
    const user = await reuireUser()

    const data = await prisma.enrollment.findMany({
        where:{
            userId:user.id,
            status:"Active"
        },
        select:{
            Course:{
                select:{
                    id:true,
                    title:true,
                    smallDescription:true,
                    filekey:true,
                    lavel:true,
                    slug:true,
                    category:true,
                    duration:true,
                    chapter:{
                        select:{
                        id:true,
                        title:true,
                        position:true,
                        lessons:{
                            select:{
                                id:true,
                                title: true,
                                description:true,
                                lessonProgress:{
                                    where:{
                                     userId:user.id   
                                    },
                                    select:{
                                     id:true,
                                     completed:true,
                                     lessonId:true   
                                    }
                                },
                                position:true
                            }
                        }    
                        }
                    }
                }
            }
        }
    })
    return data;
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourse>>[0]