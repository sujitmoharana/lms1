"use server"

import { reuireUser } from "@/app/data/user/require-user";
import arject, { fixedWindow } from "@/lib/arject";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arject.withRule(
    fixedWindow({
      mode:"LIVE",
      window:"1m",
      max:5
    })
)

export async function enrollInCourseAction(courseId:string):Promise<ApiResponse | never>
{
   const user = await reuireUser()
   console.log("user for stripe",user);
   let checkoutUrl:string
    try {

        const req = await request()
        const decision =  await aj.protect(req,{
            fingerprint:user.id
        });

        if (decision.isDenied())
        {
            return {
                status:"error",
                message:"you have been blocked"
            }
        }

         const course = await prisma.course.findUnique({
            where:{
                id:courseId
            },
            select:{
                id:true,
                title:true,
                price:true,
                slug:true
            }
         })
         console.log("course for stripe",course);
         
         if (!course) {
            return {
                status:"error",
                message:"course not found"
            }
         }

         let stripeCoustomerId:string

         const userWithStripeCoustomerId = await prisma.user.findUnique({
            where:{
                id:user.id
            },
            select:{
                stripeCoustomerId:true
            }
         })

         console.log("userWithStripeCoustomerId sujit",userWithStripeCoustomerId);

         if (userWithStripeCoustomerId?.stripeCoustomerId) {
            stripeCoustomerId = userWithStripeCoustomerId.stripeCoustomerId
            console.log("stripeCoustomerId sujit",stripeCoustomerId);
            
         }else {
            const customer = await stripe.customers.create({
                email:user.email,
                name:user.name,
                metadata:{
                    userId:user.id
                }
            })

            console.log("customer sujit",customer);
            

            stripeCoustomerId = customer.id
          
            await prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    stripeCoustomerId:stripeCoustomerId
                }
            })
         }

         const result = await prisma.$transaction(async (tx)=>{
              const existingEnrollment = await tx.enrollment.findUnique({
                where:{
                   userId_courseId:{
                    userId:user.id,
                    courseId:courseId
                   }
                },
                select:{
                    status:true,
                    id:true
                }
              })

              console.log("existingEnrollment sujit",existingEnrollment);
              

              if (existingEnrollment?.status === "Active") {
                return {
                  status:"success",
                  message:"you are already enrolled in this course"                    
                }
              }

              let enrollment;
              
              if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where:{
                        id:existingEnrollment.id
                    },
                    data:{
                        amount:course.price,
                        status:"Pending",
                        updatedAt:new Date()
                    }
                })

                console.log("enrollment sujit",enrollment);
                
              } else{
                enrollment = await tx.enrollment.create({
                    data:{
                        userId:user.id,
                        courseId:course.id,
                        amount:course.price,
                        status:"Pending"
                    }
                })
                console.log("enrollment sujit",enrollment);
                
              }

              const checkoutSession = await stripe.checkout.sessions.create({
                customer:stripeCoustomerId,
                line_items:[
                    {
                       price:"price_1STjLCPCArAFchDsZGtLHp1B",
                       quantity:1
                    }
            ],
            mode:"payment",
            success_url:`${env.BETTER_AUTH_URL}/payment/success`,
            cancel_url:`${env.BETTER_AUTH_URL}/payment/cancel`,
            metadata:{
                userId:user.id,
                courseId:course.id,
                enrollmentId:enrollment.id
            }
              });

              return {
                enrollment:enrollment,
                checkoutUrl:checkoutSession.url
              }
              
         })
         console.log("result",result);
     checkoutUrl = result.checkoutUrl as string
         
    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            console.log("error sujit",error);
            return {
                status:"error",
                message:"payment system error , plaese try again"
            }
        }
        return {
            status:"error",
            message:"failed to enroll course"
        }
    }
  console.log(checkoutUrl);
    redirect(checkoutUrl)
}