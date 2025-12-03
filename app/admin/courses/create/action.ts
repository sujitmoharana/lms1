"use server"
import { requireAdmin } from "@/app/data/admin/require-admin";
import arject, { detectBot, fixedWindow } from "@/lib/arject";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema,CourseSchemaType } from "@/lib/ZodSchema";
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
export async function CreateCourse(value:CourseSchemaType):Promise<ApiResponse>
{
    const session = await requireAdmin();
    try {   
      const req = await request();
      const decision = await aj.protect(req,{
        fingerprint:session.user.id
      })
      console.log("decision",decision);
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

        const validation =  courseSchema.safeParse(value);

        //  i want to know where is come data,error,seccess ...... i want to here here this answer https://chatgpt.com/s/t_68d38de30a2881918208dc0ec3abee51
        console.log(validation.data);
        console.log(validation.error);
        console.log(validation.success); 
        if (!validation) {
            return {status:"error",message:"invalid form data"}
        }

        const datas = await stripe.products.create({
          name:validation.data?.title as string ,
          description:validation.data?.description,
          default_price_data:{
            currency:"inr",
            unit_amount:validation.data?.price
          }
        })

      await prisma.course.create({
          data:{
            title:validation.data?.title as string,
            description:validation.data?.description as string,
            filekey : validation.data?.filekey as string,
            price:validation.data?.price as number,
            duration:validation.data?.duration as number,
            lavel:validation.data?.lavel,
            category:validation.data?.category as string,
            smallDescription:validation.data?.smallDescription as string,
            slug:validation.data?.slug as string,
            status:validation.data?.status,
            userID:session?.user.id as string,
            stripePriceId:datas.default_price as string
          }
        })

        return {status:"success",message:"course created successfully"}
    } catch (error) {
        console.log(error);
        return {status:"error",message:"failed to create course"}
    }
}