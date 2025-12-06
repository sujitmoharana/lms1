import { prisma } from "@/lib/db";
import { reuireUser } from "../user/require-user";

export async function getAllCourses()
{

    await new Promise((resolve)=>setTimeout(resolve,2000))
    const user = await reuireUser();
    const data = await prisma.course.findMany({
        where:{
            status:"Published",
            User:{
             email:user.email
            }
        },
        orderBy:{
        createdAt:"desc"
        },
        select:{
            title:true,
            price:true,
            smallDescription:true,
            slug:true,
            filekey:true,
            id:true,
            lavel:true,
            duration:true,
            category:true
        }
    })
    console.log("hello",data);
    return data;
}


export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]
