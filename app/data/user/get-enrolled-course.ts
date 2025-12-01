import "server-only"
import { reuireUser } from "./require-user"
import { prisma } from "@/lib/db"

export async function getEnrolledCourse()
{
    const user = await reuireUser()

    const data = await prisma.enrollment.findMany({
        where:{
            userId:user.id
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
                    duration:true,
                    chapter:{
                        select:{
                        id:true,
                        lessons:{
                            select:{
                                id:true
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