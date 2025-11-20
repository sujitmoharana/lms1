import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { env } from "@/lib/env";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function POST(req:Request)
{
    const body =  await req.text();
    console.log("sujit",body);
    
    const headerList = await headers()
    //  console.log("sujuit",headerList);
     
    const signature = headerList.get("Stripe-Signature") as string;
    console.log("signature",signature);
    
    let event:Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
         body,
         signature,
         env.STRIPE_WEBHOOK_SECRET
        )
        console.log("event",event);
        
    } catch (error) {
        return new Response("webhook error",{status:400})
    }

    const session = event.data.object as Stripe.Checkout.Session
    console.log("session",session);
    
    if (event.type === "checkout.session.completed") {
        const courseId  = session.metadata?.courseId
        const customerId =  session.customer as string
      console.log("courseid",courseId);
      console.log("customerId",customerId);
      
        if (!courseId) {
            throw new Error("courseid is not found")
        }

        const user = await prisma.user.findUnique({
            where:{
                stripeCoustomerId : customerId 
            }
        })

        console.log("user",user);
        

        if (!user) {
            throw new Error("User not found")
        }

        await prisma.enrollment.update({
            where:{
                id:session.metadata?.enrollmentId
            },
            data:{
               userId:user.id, 
               courseId:courseId,
               amount:session.amount_total as number,
               status:"Active"
            }
        })

        return new Response(null,{status:200})
    }
}