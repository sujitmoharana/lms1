import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses()
{
      await requireAdmin()

      const data =  await prisma.course.findMany({
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
            title:true,
            smallDescription:true,
            duration:true,
            lavel:true,
            status:true,
            price:true,
            filekey:true,
            slug:true,
            category:true
        }
      })

      return data;
}

export type AdminCourseType =  Awaited<ReturnType<typeof adminGetCourses>>[0]

