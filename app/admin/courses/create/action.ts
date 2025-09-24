"use server"
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema,CourseSchemaType } from "@/lib/ZodSchema";
import { headers } from "next/headers";

export async function CreateCourse(value:CourseSchemaType):Promise<ApiResponse>
{
    
    try {

        const session =  await auth.api.getSession({headers:await headers()})
        const validation =  courseSchema.safeParse(value);

        //  i want to know where is come data,error,seccess ...... i want to here here this answer https://chatgpt.com/s/t_68d38de30a2881918208dc0ec3abee51
        console.log(validation.data);
        console.log(validation.error);
        console.log(validation.success); 
        if (!validation) {
            return {status:"error",message:"invalid form data"}
        }

        const data = await prisma.course.create({
          data:{
            ...validation.data,
            userID:session?.user.id as string
          }
        })

        return {status:"success",message:"course created successfully"}
    } catch (error) {
        console.log(error);
        return {status:"error",message:"failed to create course"}
    }
}