import {z} from "zod" /* 3 in react hook form 1st step is zod validation*/
export const courselavel = ["Beginner","intermedi","Advanced"] as const
export const coursestatus = ["Draft","Published","Archived"] as const
export const courseCategories = [
    "Development", 
    "Business",
    "Finance",
    "IT & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Health & Fitness",
    "Music",
    "Teaching & Academics",
    ] as const
export const courseSchema = z.object({
    title:z.string().min(3,{message:"Title must be atleast 3 character long"}).max(100,{message:"title must be most 100 character as long"}),
    description:z.string().min(3,{message:"Description must be atleast 3 character long"}),
    filekey:z.string().min(1,{message:"Filekey must be atleast 1 character long"}),
    price:z.number().min(1,{message:"Price must be atleast 1 character long"}),
    duration:z.number().min(1,{message:"duration must be atleast 1 character "}).max(500, {message:"duration must be most 500 hours "}),
    lavel:z.enum(courselavel,{message:"Level is required"}),
    category:z.enum(courseCategories,{message:"category is required"}),
    smallDescription:z.string().min(3,{message:"Smalldescription must be atleast 3 character long"}).max(200,{message:"Smalldescription must be most 200 character long"}),
    slug:z.string().min(3,{message:"Slug must be atleast 3 character long"}),
    status:z.enum(coursestatus,{message:"status is required"})
});

export const chapterSchema = z.object({
    name:z.string().min(3,{message:"must be atleast 3 character long"}),
    courseId:z.string().uuid({message:"invalid course id"})
})

export const lessonSchema = z.object({
    name:z.string().min(3,{message:"must be atleast 3 character long"}),
    courseId:z.string().uuid({message:"invalid course id"}),
    chapterId : z.string().uuid({message:"invalid chapter id"}),
    description:z.string().min(3,{message:"Description must be at least 3 character long"}).optional(),
    thumbnailKey:z.string().optional(),
    videoKey:z.string().optional()
})

export type CourseSchemaType = z.infer<typeof courseSchema>  //https://chatgpt.com/s/t_68c3cb2a56848191bac4d47962f5e307

export type chapterSchemaType = z.infer<typeof chapterSchema>

export type LessonSchemaType = z.infer<typeof lessonSchema>