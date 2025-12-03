import { requireAdmin } from "@/app/data/admin/require-admin";
import arject, { detectBot, fixedWindow } from "@/lib/arject";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const aj = arject.withRule(
    detectBot({
      mode:"LIVE",
      allow:[]
    })
  ).withRule(
    fixedWindow({
      mode:"LIVE",
      window:"1m",
      max:5
    })
  )

export async function DELETE(request:Request)
{
  const session = await requireAdmin ()
  console.log(session);
    try {

        const decision = await aj.protect(request,{
            fingerprint:session?.user.id as string
          });
      console.log(decision);
          if (decision.isDenied()) {
            return NextResponse.json({error:"dude not good"},{status:429})
          }
      
        const body = await request.json();

        console.log("body",body);
        
        const key = body.key;

        if (!key) {
            return NextResponse.json({error:'missing or invalid object key'},{status:400})
        }

        const command = new DeleteObjectCommand({
            Bucket:env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key:key
        })

        await S3.send(command)


        return NextResponse.json({message:"file deleted successfully"},{status:200})

    } catch (error) {
      console.log(error);
        return NextResponse.json({error:'missing or invalid object key'},{status:500})

    }
}