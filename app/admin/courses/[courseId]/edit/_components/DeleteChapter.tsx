import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react'
import { deletechapter, } from '../action';
import { toast } from 'sonner';

const DeleteChapter = ({chapterId,courseId}:{chapterId:string,courseId:string}) => {
    const [open,setOpen] = useState(false);
    const [pending,startTransition] = useTransition()
    async function onSubmit()
    {
        startTransition(async()=>{
          const {data:result,error} = await tryCatch(deletechapter({chapterId,courseId}))

          if (error) {
            toast.error("an unexpected error occured,please try again");
            return;
          }

          if (result.status === "success") {
            toast.success(result.message)
            setOpen(false)
          }else if(result.status === "error")
          {
            toast.error(result.message)
          }
        })
    }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
            <Trash2 className="size-4"/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            are you absolutely sure
          </AlertDialogTitle>
          <AlertDialogDescription>this action can not be undo . this will permanently delete the chapter.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cencel
          </AlertDialogCancel>
          <Button onClick={onSubmit} disabled={pending}>
            {pending ? "deleting...":"Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteChapter