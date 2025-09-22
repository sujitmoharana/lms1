"use client" //2
import React, { useCallback, useEffect, useState } from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import RenderEmptystate, { RenderErrorState, RenderUploadingState, RenderUplodedState } from './Renderstate'
import { toast } from 'sonner'
import {v4 as uuidv4} from "uuid"
interface UploaderState{
    id:string | null,
    file:File|null,
    uploading:boolean,
    progress:number,
    key?:string,
    isDeleting:boolean,
    error:boolean,
    objectUrl?:string,
    fileType :"image"|"video"
}

const Uploader = () => {


    const [filestate,setFileState] = useState<UploaderState>({
        error:false,
        file:null,
        id:null,
        uploading:false,
        progress:0,
        isDeleting:false,
        fileType:"image"
    })
   async function uploadFile (file:File)
    {
        console.log(file);
        
        setFileState((prev)=>({...prev,uploading:true,progress:0,error:false}))
        
        try {
            //1 get the presignedurl 
            
            const presignedResponse = await fetch('/api/s3/upload',{method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    fileName:file.name,
                    contentType:file.type,
                    size:file.size,
                    isImage:true
                })
            })
            console.log(presignedResponse);
            
            if (!presignedResponse.ok) {
                toast.error('fails to get presigned url')
                setFileState((prev)=>({...prev,uploading:false,progress:0,error:true}))
                return;
            }
         
            const {presignedurl,key} = await presignedResponse.json();
           console.log(presignedurl);
        //    console.log(key);
            await new Promise<void>((resolve,reject)=>{
                const xhr = new XMLHttpRequest();
                console.log("xhr",xhr);
                xhr.upload.onprogress = (event)=>{
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded /event.total)*100
                        toast(`hello1 ${xhr.status}`)
                        console.log(percentageCompleted)
                        setFileState((prev)=>({...prev,uploading:true,progress:Math.round(percentageCompleted)}))

                    }
                    xhr.onload = ()=>{
                        toast(xhr.status);
                        
                        if (xhr.status === 200 || xhr.status ===204) {
                            setFileState((prev)=>({...prev,uploading:false,progress:100,key:key}))
                            toast.success("file uploaded sucessfully")
                            resolve()
                        }else{
                            toast.error("upload failed")
                            reject(new Error("uploaded failed..."))
                        }
                    }
    
                }
                xhr.onerror = ()=>{
                    reject(new Error ("Uploaded error"))
                }
                
                xhr.open("PUT",presignedurl);
               xhr.setRequestHeader("Content-Type",file.type)
                xhr.send(file)
            })

        } catch (error) {
            toast.error("something went wrong")
            setFileState((prev)=>({...prev,progress:0,error:true,uploading:false}))

        }
    }

    const onDrop = useCallback((acceptedFiles:File[]) => {
        console.log(acceptedFiles);
        
       if (acceptedFiles.length>0) {
        const file = acceptedFiles[0]
      console.log(file);
      
        setFileState({
           file:file,
           uploading:false,
           progress:0,
           objectUrl:URL.createObjectURL(file),
           error:false,
           id:uuidv4(),
           isDeleting:false,
           fileType:"image"
        })

        uploadFile(file)
       }
      }, [])


      function rejectedFiles(filerejection:FileRejection[])
      {
        if (filerejection.length) {
            const toomanyFiles = filerejection.find((rejection)=>rejection.errors[0].code === "too-many-files");
           
            const filesizetobig = filerejection.find((rejection)=>rejection.errors[0].code === "file-too-large")

           if (filesizetobig) {
            toast.error("file size exceed limit.... file should be under 5mb")
           }
            if (toomanyFiles) {
                toast.error('too many selected , max is 1')
            }
        }
      }
      function renderContent(){
        if (filestate.uploading) {
            return (
                <RenderUploadingState file={filestate.file as File} progress={filestate.progress}/>
            )
        }
        if (filestate.error) {
            return <RenderErrorState/>
        }

        if (filestate.objectUrl) {
            return (
                <RenderUplodedState previewUrl={filestate.objectUrl}/>
            )
        }
        return <RenderEmptystate isDragActive={isDragActive}/>
      }

 const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept:{"image/*":[]},
     maxFiles:1,
     multiple:false,
     maxSize:5*1024*1024, /* i want to store 5mb ..... 1mb is 1024 * 1024 ..... */
     onDropRejected: rejectedFiles
})


  return (
    <Card {...getRootProps()} className={cn("relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",isDragActive?"border-primary bg-primary/10 border-solid":"border-border hover:border-primary")}>
   <CardContent className='flex items-center justify-center h-full w-full p-4'>
   <input {...getInputProps()} />
  {renderContent()}
   </CardContent>
  </Card>
  )
}

export default Uploader