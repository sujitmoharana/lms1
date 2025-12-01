import { LessonContentType } from '@/app/data/course/get-lesson-content'
import RenderDescription from '@/components/rich-text-editor/RenderDesscription';
import { Button } from '@/components/ui/button';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { BookIcon, CheckCheckIcon, CheckCircle } from 'lucide-react';
import React from 'react'

interface iAppProps{
  data:LessonContentType
}

const CourseContent = ({data}:iAppProps) => {
 

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

  return (
    <div className='flex flex-col h-full bg-background pl-6 '>
      <VideopLayer thumbnailKey={data.thumbnailKey ?? ""} videoKey={data.videoKey ?? ""} />
      <div className='py-4 border-b'>
           <Button variant="outline">
               <CheckCircle className='size-4 mr-2 text-green-500'/> 
               Mark as a Complete       
            </Button>
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