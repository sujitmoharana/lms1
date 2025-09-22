import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import {z}from "zod";
import {v4 as uuidv4} from "uuid"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/S3Client";
export const fileUploadSchema  = z.object({
    fileName:z.string().min(1,{message:"filename is required"}),
    contentType:z.string().min(1,{message:"content type is required"}),
    size:z.number().min(1,{message:"size is required"}),
    isImage:z.boolean()
})

export async function POST  (request:Request)
{
    try {
        const body = await request.json()
      console.log("body",body);
  
        const validation = fileUploadSchema.safeParse(body)
        console.log("validation",validation);
        
        if(!validation.success)
        {
          return NextResponse.json({error:"invalid Requst Body"},{status:400})
        }
   
        const {fileName,contentType,size} = validation.data;

        const uniquekey = `${uuidv4()}-${fileName}`
  console.log("unikley",uniquekey);
  
  const command = new PutObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    Key: uniquekey,
    ContentType: contentType,  // keep this
    //ContentLength:size
  })
  
console.log("command",command);

        const presignedurl =await getSignedUrl(S3 , command , {expiresIn:360}) /* 360 means 6 min  */
        console.log("presignedurl",presignedurl);
        
        const response = {
            presignedurl,
            key:uniquekey
        }

        console.log("response",response);
        

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({error:"Failed to generate presigned URl"},{status:500})
    }
}