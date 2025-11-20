import { getIndividualCourse } from '@/app/data/course/get-course';
import RenderDescription from '@/components/rich-text-editor/RenderDesscription';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { IconBook, IconCategory, IconChartBar, IconChevronDown, IconClock, IconPlayerPlay } from '@tabler/icons-react';
import { CheckCheckIcon, CheckIcon } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import { enrollInCourseAction } from './action';
import checkIfCourseBought from '@/app/data/user/user-is-enrolled';
import Link from 'next/link';
import EnrollmentButton from './_components/EnrollmentButton';


type Params = Promise<{slug:string}>

const Slugpage = async({params}:{params:Params}) => {
    const {slug} = await params;
    const course = await getIndividualCourse(slug);
    const thumbnailUrl = useConstructUrl(course.filekey)
    console.log(JSON.parse(course.description));
    const enrolled = await checkIfCourseBought(course.id)
    console.log(enrolled);
    
    
  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5'>
         <div className='order-1 lg:col-span-2'>
           <div className='relative aspect-video overflow-hidden rounded-xl shadow-lg'>
            <Image priority fill src={thumbnailUrl} alt='' className='object-cover' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'>
            </div>
           </div>
           <div className='mt-8 space-y-6'>
            <div className='space-y-4'>
                <h1 className='text-4xl font-bold tracking-tight'>{course.title}</h1>
                <p className='text-lg text-muted-foreground leading-relaxed line-clamp-2'>{course.smallDescription}</p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Badge className='flex items-center gap-1 px-3 py-1'>
                <IconChartBar className='size-4'/>
                <span>{course.title}</span>
              </Badge>
              <Badge className='flex items-center gap-1 px-3 py-1'>
                <IconCategory className='size-4'/>
                <span>{course.category}</span>
              </Badge>
              <Badge className='flex items-center gap-1 px-3 py-1'>
                <IconClock className='size-4'/>
                <span>{course.duration}</span>
              </Badge>
            </div>
            <Separator className='my-8'/>
            <div className='space-y-6'> 
              <h2 className='text-3xl font-semibold tracking-tight'>Course Description</h2>
                    <RenderDescription json={JSON.parse(course.description)}/>
            </div>
           </div>
           <div className='mt-12 space-y-6 '>
            <div className='flex items-center justify-between'>
           <h2 className='text-3xl font-semibold tracking-tight'> course Content</h2>
           <div>
            {course.chapter.length} chapter|{""}
            {course.chapter.reduce((total,chapter)=>total+chapter.lessons.length,0) || 0}{" "}Lessons
           </div>
            </div>
              <div className='space-y-4'>
               {course.chapter.map((chapter,index)=>(
                    <Collapsible key={chapter.id} defaultOpen={index===0}>
                        <Card className='p-0 gap-0 overflow-hidden border-2  transition-all duration-200 hover:shadow-md'>
                            <CollapsibleTrigger>
                            <div>
                                <CardContent className='p-6 hover:bg-muted/50 transition-colors'>
                                   <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-4'>
                                        <p className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold'>{index+1}</p>
                                        <div>
                                           <h3 className='text-xl font-semibold text-left'>{chapter.title}</h3> 
                                           <p className='text-sm text-muted-foreground mt-1 text-left'> 
                                            {chapter.lessons.length}lesson
                                            {chapter.lessons.length !== 1 ? "s" :""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                       <Badge variant="outline" className='text-xs'>
                                       {chapter.lessons.length}lesson
                                       {chapter.lessons.length !== 1 ? "s" :""}
                                       </Badge>
                                       <IconChevronDown className='size-5 text-muted-foreground'/>
                                    </div>
                                   </div>
                                </CardContent>
                            </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                            <div className='border-t bg-muted/55'>
                             <div className='p-6 pt-4 space-y-3'>
                             {chapter.lessons.map((lessons,lessonIndex)=>(
                                <div key={lessons.id} className='flex items-center gap-4 rounded-lg p-3 hover:bg-zinc-800 transition-colors'>
                                  <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/38'>
                                    <IconPlayerPlay className='size-4 text-muted-foreground group-hover:text-primary transition-colors'/>
                                  </div>
                                  <div className='flex-1 '>
                                     <p className='font-medium text-sm'>
                                        {lessons.title}
                                     </p>
                                     <p>Lesson {lessonIndex +1}</p>
                                  </div>
                                </div>
                             ))}
                             </div>
                            </div>
                            </CollapsibleContent>

                        </Card>
                    </Collapsible>
               ))}
              </div>
           </div>
         </div>
        
        {/* Enrollment Card */}

        <div className='order-2 lg:col-span-1'>
          <div className='sticky top-20'>
          <Card className='py-0'>
             <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                    <span className='text-lg font-medium'>
                        Price
                    </span>
                    <span className='text-2xl font-bold text-primary'>
                        {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR"
                            }).format(course.price)
                            }
                    </span>
                </div>
                <div className='mb-6 space-y-3 rounded-lg bg-zinc-950 p-4'>
                    <h4 className='font-medium'>What you will get:</h4>
                    <div className='flex flex-col gap-3'>
                       <div className='flex items-center gap-3'>
                        <div className='size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <IconClock className='size-4'/>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Couse Duration</p>
                            <p className='text-sm text-muted-foreground'>{course.duration}hours</p>
                        </div>
                       </div>
                       <div className='flex items-center gap-3'>
                        <div className='size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <IconChartBar className='size-4'/>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Difficulty level</p>
                            <p className='text-sm text-muted-foreground'>{course.lavel}</p>
                        </div>
                       </div>
                       <div className='flex items-center gap-3'>
                        <div className='size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <IconCategory className='size-4'/>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>category</p>
                            <p className='text-sm text-muted-foreground'>{course.category}</p>
                        </div>
                       </div>
                       <div className='flex items-center gap-3'>
                        <div className='size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <IconBook className='size-4'/>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Total Lessons</p>
                            <p className='text-sm text-muted-foreground'>
                            {course.chapter.reduce((total,chapter)=>total+chapter.lessons.length,0) || 0}{" "}Lessons 
                            </p>
                        </div>
                       </div>
                    </div>
                </div>
                <div className='mb-6 space-y-3'>
                <h4>This course includes:</h4>
                <ul className='space-y-2'>
                 <li className='flex items-center gap-2 test-sm'>
                    <div className='rounded-full p-1 bg-green-500/10 text-green-500'>
                        <CheckIcon className='size-4'/>
                    </div>
                    <span>Full Lifetime aceess</span>
                 </li>
                 <li className='flex items-center gap-2 test-sm'>
                    <div className='rounded-full p-1 bg-green-500/10 text-green-500'>
                        <CheckIcon className='size-4'/>
                    </div>
                    <span>Access on mobile and desktop</span>
                 </li>
                 <li className='flex items-center gap-2 test-sm'>
                    <div className='rounded-full p-1 bg-green-500/10 text-green-500'>
                        <CheckIcon className='size-4'/>
                    </div>
                    <span>Certificate of completion</span>
                 </li>
                </ul>
                </div>
              {
                enrolled ? (
                  <Link className={buttonVariants({className:"w-full"})} href="/dashboard">
                  watch course
                  </Link> ): (
                    <EnrollmentButton courseId={course.id} /> 

                  )
                
              }
                <p className='mt-3 text-center text-xs text-muted-foreground'>30-days money-back guarantee</p>
             </CardContent>
          </Card>
          </div>
        </div>

    </div>
  )
}

export default Slugpage