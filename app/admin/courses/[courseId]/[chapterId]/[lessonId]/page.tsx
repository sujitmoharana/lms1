import { adminGetLesson } from '@/app/data/admin/admin-get-lesson'
import React from 'react'
import LessonForm from './_components/LessonForm'


type params = Promise<{
    courseId:string,
    chapterId:string,
    lessonId:string
}>

const LessonIdPage = async({params}:{params:params}) => {
    const {chapterId,courseId,lessonId} = await params;
    const lesson = await adminGetLesson(lessonId)
  return (
    <LessonForm chapterId={chapterId} data={lesson} courseId={courseId}/>
  )
}

export default LessonIdPage