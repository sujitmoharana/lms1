"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { useState } from 'react'
import {CSS} from '@dnd-kit/utilities';

const CourseStructure = () => {
    const [items,setItems] = useState(["1","2","3"])
    function SortableItem(props) {
        const {
          attributes,
          listeners,
          setNodeRef,
          transform,
          transition,
        } = useSortable({id: props.id});
        
        const style = {
          transform: CSS.Transform.toString(transform),
          transition,
        };
        
        return (
          <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
             {props.id}
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
                   {items.map((id)=>{
                    return(
                        <SortableItem key={id} id={id}/>
                    )
                   })}
            </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
}
export default CourseStructure