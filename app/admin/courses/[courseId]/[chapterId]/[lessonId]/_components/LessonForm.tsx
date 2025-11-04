"use client"
import { AdminLessonType } from '@/app/data/admin/admin-get-lesson'
import Uploader from '@/components/file-uploader/Uploader';
import Richtexteditor from '@/components/rich-text-editor/Editor';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { lessonSchema, LessonSchemaType } from '@/lib/ZodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateLesson } from '../action';

interface iAppProps{
    data:AdminLessonType;
    chapterId:string,
    courseId:string
}

const LessonForm = ({chapterId,data,courseId}:iAppProps) => {

    const [pending,startTransition] = useTransition()

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema) ,
        defaultValues: {
          name:data.title,
          chapterId:chapterId,
          courseId:courseId,
          description:data.description ?? undefined,
          thumbnailKey:data.thumbnailKey ?? undefined,
          videoKey:data.videoKey ?? undefined
        }
      });

      function onSubmit(values:LessonSchemaType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      startTransition(async()=>{
        const {data:result,error} = await tryCatch(updateLesson(values,data.id))
  
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
    <div>
        <Link href={`/admin/courses/${courseId}/edit`} className={buttonVariants({variant:"outline",className:"mb-6"})}>
        <ArrowLeft className='size-4'/>
        <span>Go back</span>
        </Link>

        <Card>
            <CardHeader>
                <CardTitle>Lesson Configuration</CardTitle>
                <CardDescription>
                    configure the video and description for this lesson
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                      <FormField control={form.control} name="name" render={({field})=>(
                        <FormItem>
                            <FormLabel>Lesson Name</FormLabel>
                            <FormControl>
                                <Input placeholder='chapter name' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}/>

                    <FormField control={form.control} name="description" render={({field})=>(
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Richtexteditor field={field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}/>

                     <FormField control={form.control} name="thumbnailKey" render={({field})=>(
                        <FormItem>
                            <FormLabel>Thumbnail image</FormLabel>
                            <FormControl>
                               <Uploader fileTypeAccepted='image' onChange={field.onChange} value={field.value}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="videoKey" render={({field})=>(
                        <FormItem>
                            <FormLabel>Video File</FormLabel>
                            <FormControl>
                            <Uploader fileTypeAccepted='video' onChange={field.onChange} value={field.value}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}/>
                   <Button disabled={pending} type='submit'>
                    {pending ? "saving...":"save lesson"}
                   </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}

export default LessonForm