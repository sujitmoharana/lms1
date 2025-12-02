import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const LessonSkeleton = () => {
  return (
    <div className='flex flex-col space-y-3 h-full pl-6'>
        <div className='relative aspect-video bg-muted rounded-lg overflow-hidden'>
            <Skeleton className='w-full h-full'/>
        </div>
        <div className='flex-1 space-y-6'>
            <div className='space-y-2 '>
                <Skeleton className='h-8 max-w-1/6'/>
                <Skeleton className='h-0.5 w-full'/>
                <Skeleton className='h-4 w-1/4'/>
            </div>
        </div>
    </div>
  )
}

export default LessonSkeleton