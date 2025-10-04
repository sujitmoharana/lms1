"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arject, { detectBot, fixedWindow } from "@/lib/arject";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/ZodSchema";
import { request } from "@arcjet/next";


const aj = arject.withRule(
    detectBot({
      mode:"LIVE",
      allow:[]
    })
  ).withRule(
    fixedWindow({
      mode:"LIVE",
      window:"1m",
      max:5
    })
  )


export async function editCourse(data:CourseSchemaType,courseId:string):Promise<ApiResponse>
{
    const user = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req,{
            fingerprint:user.user.id
          })

          if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
             return {
               status:"error",
               message:"you have been block due to rate limiting"
             }
            }else
            {
             return{
               status:"error",
               message:"you are a bot ! if this is mistake contact our support"
             }
            }
           }

        const result = courseSchema.safeParse(data);

        if (!result.success) {
            return {
                status:"error",
                message:"invalid data"
            }
        }

        await prisma.course.update({
            where:{
                id:courseId,
                userID:user.user.id
             },
                data:{
                   ...result.data 
                
             }
        })

        return {
            status:"success",
            message:"Course updated successfully"
        }
    } catch (error) {
        return {
            status:"error",
            message:"failed to update course"
        }
    }
}