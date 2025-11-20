"use client"
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { enrollInCourseAction } from '../action'
import { Loader2 } from 'lucide-react'

const EnrollmentButton = ({courseId }:{courseId:string}) => {
const [pending,startTransition] = useTransition()
console.log("course id for enrollment",courseId);
    function onSubmit() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
      startTransition(async()=>{
        const {data:result,error} = await tryCatch(enrollInCourseAction(courseId))
  
        if (error) {
           toast.error("an unexpected error occured ,please try again");
           return;
        }
  
        if (result.status === "success") {
          toast.success(result.message);
        }else if(result.status==="error")
        {
           toast.error(result.message)
        }
      })
  
        
      }

  return (
    <Button onClick={onSubmit} disabled = {pending} className='w-full'>
     {
        pending ? (
            <>
            <Loader2 className='animate-spin size-4'/>
            Loading...
            </>
        ):(
            "Enroll now"
        )
     }
    </Button>
  )
}

export default EnrollmentButton