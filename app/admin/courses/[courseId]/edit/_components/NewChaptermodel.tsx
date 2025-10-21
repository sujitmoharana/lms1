"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { chapterSchema, chapterSchemaType } from '@/lib/ZodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { act, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { createChapter } from '../action';
import { toast } from 'sonner';

const NewChaptermodel = ({courseId}:{courseId:string}) => {

const [isOpen, setisOpen] = useState(false);
const [isPending,startTransaction] = useTransition()

const form = useForm<chapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
     name:"",
     courseId
    }
  });
  
  async function onSubmit(values:chapterSchemaType)
  {
    console.log(values);
     startTransaction(async ()=>{
        const {data:result,error} = await tryCatch(createChapter(values))

        if (error) {
            toast.error("an unexpected error please try again ")
        }

        if (result?.status === "success") {
            toast.success(result.message)
            form.reset();
            setisOpen(false);
        } else if(result?.status === "error")
        {
            toast.error(result.message)
        }
     })
  }

function handleOpenChnage(open:boolean)
{
    setisOpen(open);
}
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChnage}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className='gap-2'>
            <Plus className='size-4'/> New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
         <DialogHeader>
            <DialogTitle>Create New Chapter</DialogTitle>
            <DialogDescription>What would you like to name your chapter?</DialogDescription>
         </DialogHeader>
         <Form  {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
             <FormField control={form.control} name='name' render={({field})=>(
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder='chapter name ' {...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
             )}/>

             <DialogFooter>
                <Button disabled={isPending} type='submit'>
                    {isPending ? "saving...":"save change"}
                </Button>
             </DialogFooter>
          </form>
         </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewChaptermodel