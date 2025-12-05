import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentsState()
{
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  console.log("thirtyDaysAgo",thirtyDaysAgo);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  console.log("thirtyDaysAgo2",thirtyDaysAgo);
  const enrollments = await prisma.enrollment.findMany({
    where:{
        createdAt:{
            gte:thirtyDaysAgo //gte fullform is greterthen or equalto
        },
        status:"Active"
    },
    select:{
        createdAt:true
    },
    orderBy:{
        createdAt:"asc"
    }

  })
  console.log("enrollments",enrollments);
  

  const last30days:{date:string,enrollments:number}[] = [];
  for (let i = 29; i >=0; i--) {
   const date = new Date();
   console.log("date1",date);
   date.setDate(date.getDate() - i)
    console.log("date2",date);
    
   last30days.push({
    date:date.toISOString().split("T")[0],
    enrollments:0
   })
   console.log("last30days",last30days);
  }
console.log(last30days); 
  enrollments.forEach((enrollment)=>{
   const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0]
   console.log("enrollments",enrollmentDate);
   const dayIndex = last30days.findIndex((day)=>day.date === enrollmentDate)
   console.log("dayIndex",dayIndex);

   if (dayIndex !== -1) {
        last30days[dayIndex].enrollments++
   }
  })
   console.log("last30days",last30days);
  return last30days;
}