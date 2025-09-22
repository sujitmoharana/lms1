"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseCategories, courselavel, courseSchema, CourseSchema, coursestatus } from '@/lib/ZodSchema'
import { ArrowLeft, PlusIcon, SparkleIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import slugify from "slugify"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Richtexteditor from '@/components/rich-text-editor/Editor'
import Uploader from '@/components/file-uploader/Uploader'
const CourseCreate = () => {
     // 1. Define your form. here we use react hook form  /* 4 */
     const form = useForm<CourseSchema>({
      resolver: zodResolver(courseSchema) ,
      defaultValues: {
        title: "",
        description: "",
        filekey: "",
        price: 0,
        duration: 0,
        category: "IT & Software",
        status: "Draft",
        lavel: "Beginner",
        smallDescription: "",
        slug: ""
      }
    });
    
    function onSubmit(values:CourseSchema) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values.title)
    }
  console.log(form.getValues("title"));
  console.log(form.watch("title"));
  console.log(form);
  return (
     <>
     <div className='flex items-center gap-4'>
        <Link href="/admin/courses" className={buttonVariants({variant:"outline"})}>
        <ArrowLeft className='size-4'/>
        </Link>
        <h1 className='text-2xl font-bold'>
            Create Courses
        </h1>
     </div>
     <Card>
        <CardHeader>
            <CardTitle>basic information</CardTitle>
            <CardDescription>Privide basic information about the course</CardDescription>
        </CardHeader>
        <CardContent>
         {/* here  start react hook form */}
            <Form {...form}>
              <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name='title' render={({field})=>(
               <FormItem>
                  <FormLabel>Title</FormLabel>
                     <FormControl>
                        <Input placeholder='title' {...field}/>
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>

            <div className='flex items-end gap-4'>
            <FormField  control={form.control} name='slug' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>slug</FormLabel>
                     <FormControl>
                        <Input placeholder='slug' {...field}/>
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>
            
            <Button type='button' className='w-fit' onClick={()=>{
               const titlevalue = form.getValues("title")
               const slug = slugify(titlevalue)
               form.setValue("slug",slug,{shouldValidate:true})
            }}>generate slug <SparkleIcon className='ml-1' size={16}/></Button>
            </div>

            <FormField  control={form.control} name='smallDescription' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>Small Description</FormLabel>
                     <FormControl>
                        <Textarea placeholder='Small description' {...field} className='min-h-[120px]'/>
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>

               <FormField  control={form.control} name='description' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>description</FormLabel>

                  <Richtexteditor field={field} /> {/* 1 */}
                     {/* <FormControl>
                        <Textarea placeholder='description' {...field}/>
                     </FormControl> */}
                     <FormMessage/>
               </FormItem>
              )}/>

               <FormField  control={form.control} name='filekey' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>Thumbnail image</FormLabel>
                     <FormControl>
                        {/* <Input placeholder='Thumbnail url' {...field}/> */}
                        <Uploader/>{/* 1 */}
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>

             <div className='grid grid-col-1 md:grid-cols-2  gap-4'>
             
             <FormField control={form.control}
                        name="category"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                              
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select category" />
                                 </SelectTrigger>
                                
                                 <SelectContent>
                                    {courseCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                       {category}
                                    </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                        />

                  <FormField control={form.control}
                        name="lavel"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Lavel</FormLabel>
                              <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                              
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select value" />
                                 </SelectTrigger>
                                
                                 <SelectContent>
                                    {courselavel.map((category) => (
                                    <SelectItem key={category} value={category}>
                                       {category}
                                    </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                        />

                      
               <FormField  control={form.control} name='duration' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>Duration</FormLabel>
                     <FormControl>
                        <Input placeholder='Duration' type='number' {...field}/>
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>

             
              <FormField  control={form.control} name='price' render={({field})=>(
               <FormItem className='w-full'>
                  <FormLabel>Price ($)</FormLabel>
                     <FormControl>
                        <Input placeholder='Price' type='number' {...field}/>
                     </FormControl>
                     <FormMessage/>
               </FormItem>
              )}/>

<FormField control={form.control}
                        name="category"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                              
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select category" />
                                 </SelectTrigger>
                                
                                 <SelectContent>
                                    {courseCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                       {category}
                                    </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                        />
             </div>
             <FormField control={form.control}
                        name="status"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                              
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select Status" />
                                 </SelectTrigger>
                                
                                 <SelectContent>
                                    {coursestatus.map((category) => (
                                    <SelectItem key={category} value={category}>
                                       {category}
                                    </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                        />

                        <Button>
                           Create course <PlusIcon className='ml-1' size={16} />
                        </Button>
              </form>
            </Form>
        </CardContent>
     </Card>
     </>
  )
}

export default CourseCreate