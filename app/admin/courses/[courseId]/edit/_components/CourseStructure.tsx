"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { ReactNode, useState } from 'react'
import {CSS} from '@dnd-kit/utilities';
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { cn } from '@/lib/utils'    
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, DeleteIcon, FileText, GripVertical, Trash2, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

    const [items,setItems] = useState(initialItems)
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

      function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            
            return arrayMove(items, oldIndex, newIndex);
          });
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
        </CardHeader>
        <CardContent>
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
                                   <Button size="icon" variant="ghost">
                                    <Trash2 className='size-4'/>
                                   </Button>
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

                                                      <Button variant="ghost"  size="icon">
                                                        <Trash2Icon className='size-4'/>
                                                      </Button>

                                                  </div>
                                                )} 
                                            </SortableItem>
                                          )
                                         })}
                                     </SortableContext>
                                     <div className='p-2'>
                                      <Button variant="outline" className='w-full'>
                                        Create New Lesson
                                      </Button>
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