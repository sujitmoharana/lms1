"use client"
import { LessonContentType } from '@/app/data/course/get-lesson-content'
import RenderDescription from '@/components/rich-text-editor/RenderDesscription';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { BookIcon, CheckCheckIcon, CheckCircle } from 'lucide-react';
import React, { useTransition } from 'react'
import { markLessonComplete } from '../action';
import { toast } from 'sonner';
import { useConfetti } from '@/hooks/use-confetti';

interface iAppProps{
  data:LessonContentType
}

const CourseContent = ({data}:iAppProps) => {
 console.log("lessonprogress",data.lessonProgress);
 
  const [pending,startTransition] =useTransition()
   const {triggerConfetti} = useConfetti()
  function VideopLayer({thumbnailKey,videoKey}:{thumbnailKey:string,videoKey:string})
  {
         const videoUrl = useConstructUrl(videoKey)
         const thumbnailurl = useConstructUrl(thumbnailKey)

         if (!videoKey) {
        return(
          <div className='aspect-video bg-muted rounded-lg flex flex-col items-center justify-center'>
          <BookIcon className='size-16 text-primary mx-auto mb-4'/>
          <p>this lesson does not have video yet</p>
            </div>
        )
         }

         return(
           <div className='aspect-video bg-black rounded-lg relative overflow-hidden'>
            <video src={videoUrl} className='w-full h-full object-cover' controls poster={thumbnailurl}/>
           </div>
         )
  }

  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
  startTransition(async()=>{
    const {data:result,error} = await tryCatch(markLessonComplete(data.id,data.Chapter.Course.slug))

    if (error) {
       toast.error("an unexpected error occured ,please try again");
       return;
    }

    if (result.status === "success") {
      toast.success(result.message);
      triggerConfetti()
    }else if(result.status==="error")
    {
       toast.error(result.message)
    }
  })

    
  }

  return (
    <div className='flex flex-col h-full bg-background pl-6 '>
      <VideopLayer thumbnailKey={data.thumbnailKey ?? ""} videoKey={data.videoKey ?? ""} />
      <div className='py-4 border-b'>
          {data.lessonProgress.length > 0 ?(
            <Button variant="outline" className='bg-green-500/10 text-green-600'>
              <CheckCircle className='size-4 mr-2 text-green-500'/>
              Completed
            </Button>
          ):(
            <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className='size-4 mr-2 text-green-500'/> 
            Mark as a Complete       
         </Button>
          )}
      </div>
      <div className='space-y-3 pt-3'>
        <h1 className='text-3xl font-bold tracking-tight'>{data.title}</h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)}/>
        )}
      </div>
    </div>
  )
}

export default CourseContent