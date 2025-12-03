"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arject, { detectBot, fixedWindow } from "@/lib/arject";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { chapterSchema, chapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/ZodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";


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
      console.log(error);
        return {
            status:"error",
            message:"failed to update course"
        }
    }
}


export async function  reorderLessons(chapterId:string,lessons:{id:string,position:number}[],courseId:string):Promise<ApiResponse>
{
  await requireAdmin();
   try {

    if (!lessons || lessons.length === 0 ) {
      return {
        status:"error",
        message:"no lesson provided for reordering"
      }
    }


    const update = lessons.map((lesson)=>{
      return  prisma.lesson.update({
        where:{
          id:lesson.id,chapterId:chapterId
        }
        ,
        data:{
          position:lesson.position
        }
      })
    })
     await prisma.$transaction(update)
     console.log(update);
    revalidatePath(`/admin/courses/${courseId}/edit`)
    return {
      status:"success",
      message:"lesson reordered sucessfully"
    }
    
   } catch (error) {
    console.log(error);
    return {
      message:"failed to reoder lesson",
      status:"error"
    }
   }
}

export async function reorderChapter(courseId:string,chapters:{id:string,position:number}[]):Promise<ApiResponse>
{
  await requireAdmin();
   try {

    if (!chapters || chapters.length === 0) {
      return {
        status:"error",
        message:"no cchapter provided for reordering"
      }
    }

    const updates =  chapters.map((chapter)=>{
      return prisma.chapter.update({
        where:{
          id:chapter.id ,courseId:courseId
        },
        data:{
          position:chapter.position
        }
      })
    })

    await prisma.$transaction(updates)

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status:"success",
      message:"chapter reoder sucessfully"
    }
    
   } catch (error) {
    console.log(error);
    return {
      status:"error",
      message:"failed to reoreder chapter"
    }
   }
}

export async function createChapter(values:chapterSchemaType):Promise<ApiResponse>
{
  await requireAdmin()
  console.log("value",values);
  try {
    const result = chapterSchema.safeParse(values)
    console.log(result);
    if (!result) {
      return {status:"error",message:"invalid data"}
    }

    await prisma.$transaction(async (tx)=>{
        const maxpos = await tx.chapter.findFirst({
          where:{courseId:result.data?.courseId},
          select:{
            position:true,
          },
          orderBy:{
            position:"desc"
          }
        })
     console.log("maxop",maxpos);
        await tx.chapter.create({
          data:{
            title:result.data?.name as string ,
            courseId:result.data?.courseId as string,
            position: (maxpos?.position ?? 0) + 1
          }
        })
    })

    revalidatePath(`/admin/courses/${result.data?.courseId}/edit`)
    
    return {status:"success",message:"chapter created sucessfully"}
  } catch (error) {
    console.log(error);
    return {status:"error",message:"failed to create chapter"}
  }
}

export async function createLesson(values:LessonSchemaType):Promise<ApiResponse>
{
  await requireAdmin()
  console.log("value",values);
  try {
    const result = lessonSchema.safeParse(values)
     console.log("result",result);
    if (!result) {
      return {status:"error",message:"invalid data"}
    }

    await prisma.$transaction(async (tx)=>{
        const maxpos = await tx.lesson.findFirst({
          where:{chapterId:result.data?.chapterId},
          select:{
            position:true,
          },
          orderBy:{
            position:"desc"
          }
        })
     console.log("maxop",maxpos);
        await tx.lesson.create({
          data:{
            title:result.data?.name as string,
            description:result.data?.description as string,
            videoKey:result.data?.videoKey as string,
            thumbnailKey:result.data?.thumbnailKey as string,
            chapterId:result.data?.chapterId as string,
            position: (maxpos?.position ?? 0) + 1
          }
        })
    })

    revalidatePath(`/admin/courses/${result.data?.courseId}/edit`)
    
    return {status:"success",message:"Lesson created sucessfully"}
  } catch (error) {
    console.log(error)
    return {status:"error",message:"failed to create lesson"}
  }
}

export async function deleteleson({chapterId,courseId,lessonId}:{chapterId:string,courseId:string,lessonId:string,}):Promise<ApiResponse>
{
  await requireAdmin();
  try {
    
    const chapterWithLessons = await prisma.chapter.findUnique({
      where:{
        id:chapterId
      },
      select:{
        lessons:{
          orderBy:{
            position:"asc"
          },
          select:{
            id:true,
            position:true
          }
        }
      }
    })

    console.log("chapterwithlesson",chapterWithLessons);
    if (!chapterWithLessons) {
      return{
      status:"error",
      message:"chapter not found"  
      }
    }

    const lessons = chapterWithLessons.lessons

    const lessonTodelete = lessons.find((lesson)=>lesson.id === lessonId)
 
    if (!lessonTodelete) {
      return {status:"error",message:"lesson not found in the chapter"}
    }

    const remainingLesson = lessons.filter((lesson)=>lesson.id !== lessonId)
    console.log("remaing",remainingLesson);
    const updates = remainingLesson.map((lesson,index)=>{
      return prisma.lesson.update({
        where:{
          id:lesson.id
        },
        data:{ position:index + 1 }
      })
    })
  console.log("updates",updates);
  

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where:{
          id:lessonId,
          chapterId:chapterId
        }
      })  
    ])

    revalidatePath(`/admin/courses/${courseId}/edit`)
return {
  status:"success",
  message:"lesson deleted and positions reordered successfully"
}
  } catch (error) {
    console.log(error);
    return {
      status:"error",
      message:"failed to delete lesson"
    }
  }
}

export async function deletechapter({chapterId,courseId}:{chapterId:string,courseId:string}):Promise<ApiResponse>
{
  await requireAdmin();
  try {
    
    const courseWithchapter = await prisma.course.findUnique({
      where:{
        id:courseId
      },
      select:{
      chapter:{
        orderBy:{
          position:"asc"
        },
        select:{
          id:true,
          position:true
        }
      }
      }
    })

    console.log("chapterwithlesson",courseWithchapter);
    if (!courseWithchapter) {
      return{
      status:"error",
      message:"chapter not found"  
      }
    }
  console.log(courseWithchapter.chapter);
    const chapters = courseWithchapter.chapter

    const chaptertodelete = chapters.find((chapter)=>chapter.id === chapterId)
 
    if (!chaptertodelete) {
      return {status:"error",message:"chapter not found in the course"}
    }

    const remainingChapters = chapters.filter((chap)=>chap.id !== chapterId)
    console.log("remaing",remainingChapters);
    const updates = remainingChapters.map((chap,index)=>{
      return prisma.chapter.update({
        where:{
          id:chap.id
        },
        data:{ position:index + 1 }
      })
    })
  console.log("updates",updates);
  

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where:{
          id:chapterId,
        }
      })  
    ])

    revalidatePath(`/admin/courses/${courseId}/edit`)
return {
  status:"success",
  message:"lesson deleted and positions reordered successfully"
}
  } catch (error) {
    console.log(error);
    return {
      status:"error",
      message:"failed to delete lesson"
    }
  }
}