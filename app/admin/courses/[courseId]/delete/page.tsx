"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { tryCatch } from '@/hooks/try-catch'
import Link from 'next/link'
import React, { useTransition } from 'react'
import { deleteCourse } from './action'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

const DeleteCourseRoute = () => {

    const [pending,startTransition] = useTransition();
    const {courseId} = useParams<{courseId:string}>();
    const router = useRouter()
    function onSubmit() {
      startTransition(async()=>{
        const {data:result,error} = await tryCatch(deleteCourse(courseId))
  
        if (error) {
           toast.error("an unexpected error occured ,please try again");
           return;
        }
  
        if (result.status === "success") {
          toast.success(result.message)
          router.push("/admin/courses")
        }else if(result.status==="error")
        {
           toast.error(result.message)
        }
      })
  
        
      }
  return (
    <div className='max-w-xl mx-auto w-full'>
         <Card className='mt-18'>
            <CardHeader>
                <CardTitle>Are you sure you want to delete this course</CardTitle>
                <CardDescription>this action can not be undone</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-between items-center'>
                <Link href="/admin/courses">cencel</Link>
                <Button variant="destructive" onClick={onSubmit} disabled={pending}>
                    {pending ? (
                        <>
                        <Loader2 className='size-4 animate-spin'/>deleting
                        </>
                    ):(
                        <>
                        <Trash2 className='size-4 '/>Delete
                        </>
                    )}
                </Button>
            </CardContent>
         </Card>
    </div>
  )
}

export default DeleteCourseRoute