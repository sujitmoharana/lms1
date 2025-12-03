"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext,  DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { ReactNode, useEffect, useState } from 'react'
import {CSS} from '@dnd-kit/utilities';
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { cn } from '@/lib/utils'    
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, FileText, GripVertical, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { reorderChapter, reorderLessons } from '../action'
import NewChaptermodel from './NewChaptermodel'
import NewLessonModel from './NewLessonModel'
import DeleteLesson from './DeleteLesson'
import DeleteChapter from './DeleteChapter'
import { DragEndEvent } from "@dnd-kit/core";


interface iAppProps{
  data:AdminCourseSingularType
}

interface SortableItemProps{
  id:string;
  children:(listeners:DraggableSyntheticListeners)=>ReactNode;
  clasName?:string;
  data?:{
    type: 'chapter' | 'lesson' ,
    chapterId?:string 
  }
}

const CourseStructure = ({data}:iAppProps) => {

console.log(data.chapter);
  const initialItems = data.chapter.map((chapter)=>({
        id:chapter.id,
        title:chapter.title,
        order:chapter.position,
        isOpen:true,
        lessons:chapter.lessons.map((lessons)=>({
            
              id:lessons.id,
              title:lessons.title,
              order:lessons.position
        })),
      
    
  })) || []
  console.log(initialItems);
  
    const [items,setItems] = useState(initialItems)
     console.log(items);  // check note in note name some importtant doubt
               
  useEffect(() => {
         setItems((prevItems)=>{
          const updatedItems = data.chapter.map((chapter)=>{
            return {
              id:chapter.id,
              title:chapter.title,
              order:chapter.position,
              isOpen:prevItems.find((item)=>item.id === chapter.id)?.isOpen ?? true,
              lessons:chapter.lessons.map((lessons)=>({
                  
                    id:lessons.id,
                    title:lessons.title,
                    order:lessons.position
              })),
            }}) || []
           console.log(updatedItems);
            return updatedItems
         })
    }, [data])
    function SortableItem({children,id,clasName,data}:SortableItemProps) {
        const {
          attributes,
          listeners,
          setNodeRef,
          transform,
          transition,
          isDragging
        } = useSortable({id: id,data:data});
        
        const style = {
          transform: CSS.Transform.toString(transform),
          transition,
        };
        
        return (
          <div ref={setNodeRef} style={style} {...attributes} className={cn("touch-none",clasName,isDragging? "z-10":"")}>
             {children(listeners)}
          </div>
        );
      }

      function handleDragEnd(event:DragEndEvent) {
        const {active, over} = event;
     /*    console.log("active id",active.id,"active data",active.data);
        console.log("over id",over.id,"over data",over.data);
        console.log("over",over);
        console.log("active",active); */
        
                
        if (!over || active.id === over.id) {
          return;
        }

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";
        const courseId = data.id;
        console.log(activeId,overId,activeType,overType);
        

      if (activeType === 'chapter') {
        let targetChapterId = null;
         
       if (overType === 'chapter') {
        targetChapterId = overId
        console.log("targetChapterId",targetChapterId);
       }else if(overType==='lesson')
       {
        targetChapterId = over.data.current?.chapterId ?? null
        console.log("targetChapterId",targetChapterId);
       }

       if (!targetChapterId) {
        toast.error("could not determine chapter for recording");
        return;
       }

       const oldIndex = items.findIndex((item)=>item.id === activeId)
       console.log(oldIndex);
       const newindex = items.findIndex((item)=>item.id === targetChapterId)
       console.log(newindex);
        if (oldIndex===-1 || oldIndex ===-1) {
          toast.error('could not find chapter old/new index for recording')
          return;
        }

        const reordedLocalchapters = arrayMove(items,oldIndex,newindex);
     console.log(reordedLocalchapters);
        const updatedChapterForState = reordedLocalchapters.map((chapter,index)=>({
          ...chapter,order:index+1
        }))
          console.log(updatedChapterForState);

        const previousItems = [...items];
       console.log(previousItems);
         setItems(updatedChapterForState)

    if (courseId) {
         const chaptersToupdate = updatedChapterForState.map((chapter)=>{
          return {
            id:chapter.id,
            position:chapter.order
          }
         })

         const reorderPromise = ()=>{
            return reorderChapter(courseId,chaptersToupdate)
         }

         toast.promise(reorderPromise(),{
          loading:"reodering chapters....",
          success:(result)=>{
         if (result.status === "success") {
          return result.message
         }
         throw new Error(result.message)
          },
          error:()=>{
            setItems(previousItems);
            return "failed to reoder chapters."
          }
         })

      }
     
      return;
      }
        if (activeType === "lesson" && overType === "lesson") {
          const chapterId = active.data.current?.chapterId;
          const overChapterId = over.data.current?.chapterId
        
          if (!chapterId || chapterId!==overChapterId) {
            toast.error("Lesson move between different chapters or invalid chapter Id is not allowed")
            return;
          }

          const chapterindex = items.findIndex((chapter)=>chapter.id === chapterId);
          console.log(chapterindex);
          if (chapterindex === -1) {
             toast.error("could not find chapter for lesson")
          }

          const chapterToUpdate = items[chapterindex]
        console.log(chapterToUpdate);
          const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson)=>lesson.id === activeId)
          console.log(oldLessonIndex);
          const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson)=>lesson.id === overId)
         console.log(newLessonIndex);
          if (oldLessonIndex === -1 && newLessonIndex === -1) {
            toast.error("could not find lesson for lecoring")
            return;
          }

          const reordedLesson = arrayMove(chapterToUpdate.lessons,oldLessonIndex,newLessonIndex);
          console.log(reordedLesson);
          const updatedLessonForState = reordedLesson.map((lesson,index)=>({
            ...lesson,
            order:index+1
          }))
         console.log(updatedLessonForState);
          const newItems = [...items];
         console.log(newItems);
          newItems[chapterindex] = {
            ...chapterToUpdate,
            lessons:updatedLessonForState
          }

          const previousItems = [...items]

           setItems(newItems);

          if (courseId) {
            const lessonToupdate = updatedLessonForState.map((lesson)=>({
              id:lesson.id,
              position:lesson.order
            }))
         console.log(lessonToupdate);
            const reorderLessonsPromise = ()=>{
            return reorderLessons(chapterId,lessonToupdate,courseId)
            }

            toast.promise(reorderLessonsPromise(),{
            loading:"reodering lesson",
            success:(result)=>{
           if (result.status === "success") {
             return result.message
           }
           throw new Error(result.message)
         },
         error:()=>{
          setItems(previousItems)
          return "failed to reorder lesson"
         }
          })

          }

          return;
        } 
        
    }

    function togglechapter(chapterId:string)
    {
      setItems(
        items.map((chapter)=>chapter.id === chapterId ? {...chapter, isOpen : !chapter.isOpen}:chapter)
      )
    }

      const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );
  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
            <CardTitle>Chapters</CardTitle>
            <NewChaptermodel courseId={data.id}/>
        </CardHeader>
        <CardContent className='space-y-7'>
            <SortableContext strategy={verticalListSortingStrategy} items={items}>
                   {items.map((items)=>(
                        <SortableItem id={items.id} data={{type:'chapter'}} key={items.id}>

                          {(listeners)=>(
                               <Card>
                               <Collapsible open={items.isOpen} onOpenChange={()=> togglechapter(items.id)}>
                                 <div className='flex items-center justify-between p-3 border-b border-border'>
                                   <div className='flex items-center gap-2'>
                                     <Button size="icon" variant="ghost"  {...listeners}>
                                       <GripVertical className='size-4'/>
                                     </Button>
                                     <CollapsibleTrigger asChild>
                                     <Button size="icon" variant="ghost" className='flex items-center'>
                                       {items.isOpen?(<ChevronDown className='size-4'/>):(<ChevronRight className='size-4'/>)}
                                     </Button>
                                     </CollapsibleTrigger>
                                     <p className='cursor-pointer hover:text-primary pl-2'>{items.title}</p>
                                   </div>
                                  <DeleteChapter chapterId={items.id} courseId={data.id} />
                                 </div>
                                 <CollapsibleContent>
                                 <div className='p-1'>
                                     <SortableContext items={items.lessons.map((lesson)=>lesson.id)} strategy={verticalListSortingStrategy}>
                                         {items.lessons.map((lesson)=>{
                                          return(
                                            <SortableItem key={lesson.id} id={lesson.id} data={{type:"lesson",chapterId:items.id}}>
                                                {(lessonListeners)=>(
                                                  <div className='flex items-center justify-between p-2 hover:bg-accent rounded-sm'>
                                                     <div className='flex items-center gap-2'>
                                                         <Button variant="ghost" size="icon" {...lessonListeners}>
                                                            <GripVertical className='size-4'/>
                                                         </Button>
                                                         <FileText className='size-4'/>
                                                         <Link href={`/admin/courses/${data.id}/${items.id}/${lesson.id}`}>  {lesson.title} </Link>
                                                      </div> 

                                                  <DeleteLesson chapterId={items.id} courseId={data.id} lessonId={lesson.id}/>

                                                  </div>
                                                )} 
                                            </SortableItem>
                                          )
                                         })}
                                     </SortableContext>
                                     <div className='p-2'>
                                     <NewLessonModel chapterId={items.id} courseId={data.id}/>
                                     </div>
                                 </div>
                                 </CollapsibleContent>
                               </Collapsible>
                             </Card>
                          )}
                        </SortableItem>
                   ))}
            </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
}
export default CourseStructure