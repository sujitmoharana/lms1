import { adminGetCourse } from '@/app/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'
import EditCourseform from './_components/EditCourseform';
import CourseStructure from './_components/CourseStructure';

type Params = Promise<{courseId:string}>

const page = async({params}:{params:Params}) => {
    const {courseId} = await params;
    const data = await adminGetCourse(courseId)
  return (
    <div>
        <h1 className='text-3xl font-bold mb-8'>
            Edit course : <span className='text-primary underline'> {data.title}</span>
        </h1>
        <Tabs defaultValue='basic-info' className='w-full'>
         <TabsList className='grid grid-cols-2 w-full'>
          <TabsTrigger value='basic-info'>basic Info</TabsTrigger>
          <TabsTrigger value='course-structure'>Course Structure</TabsTrigger>
         </TabsList>
         <TabsContent value='basic-info'>
          <Card>
            <CardHeader>
              <CardTitle>Basic info</CardTitle>
              <CardDescription>Edit basic information about the course</CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseform data={data}/>
            </CardContent>
          </Card>
         </TabsContent>
         <TabsContent value='course-structure'>
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can update Course Structure</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data}/>
            </CardContent>
          </Card>
         </TabsContent>
        </Tabs>
    </div>
  )
}

export default page