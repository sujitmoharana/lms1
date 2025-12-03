"use client" //2
import React, { useCallback, useEffect, useState } from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import RenderEmptystate, { RenderErrorState, RenderUploadingState, RenderUplodedState } from './Renderstate'
import { toast } from 'sonner'
import {v4 as uuidv4} from "uuid"
import { Useconstructurl } from '@/hooks/use-construct-url'
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

interface iAppProps
{
    value?:string;
    onChange?:(value:string)=>void
    fileTypeAccepted:"image" | "video"
}
const Uploader = ({onChange,value,fileTypeAccepted}:iAppProps) => {
    console.log(value);
    const fileUrl = Useconstructurl(value || '');  
   console.log( Useconstructurl(value || ''));
    const [filestate,setFileState] = useState<UploaderState>({
        error:false,
        file:null,
        id:null,
        uploading:false,
        progress:0,
        isDeleting:false,
        fileType:fileTypeAccepted,
        key:value,
        objectUrl:value ? fileUrl : undefined
    })
    const uploadFile = useCallback(async (file: File) => {
        setFileState((prev) => ({
          ...prev,
          uploading: true,
          progress: 0,
          error: false
        }));
      
        try {
          const presignedResponse = await fetch("/api/s3/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
              size: file.size,
              isImage: fileTypeAccepted === "image",
            }),
          });
      
          if (!presignedResponse.ok) {
            toast.error("failed to get presigned url");
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 0,
              error: true,
            }));
            return;
          }
      
          const { presignedurl, key } = await presignedResponse.json();
      
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
      
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setFileState((prev) => ({ ...prev, progress: percent }));
              }
            };
      
            xhr.onload = () => {
              if (xhr.status === 200 || xhr.status === 204) {
                setFileState((prev) => ({
                  ...prev,
                  uploading: false,
                  progress: 100,
                  key,
                }));
                onChange?.(key);
                toast.success("file uploaded successfully");
                resolve();
              } else {
                toast.error("upload failed");
                reject("upload failed");
              }
            };
      
            xhr.onerror = () => reject("upload error");
      
            xhr.open("PUT", presignedurl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
          });
        } catch (error) {
            console.log(error);
          toast.error("something went wrong");
          setFileState((prev) => ({
            ...prev,
            error: true,
            uploading: false,
            progress: 0,
          }));
        }
      }, [fileTypeAccepted, onChange]);
      
      const onDrop = useCallback(
        (acceptedFiles: File[]) => {
          if (filestate.objectUrl && !filestate.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(filestate.objectUrl);
          }
      
          if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
      
            setFileState({
              file,
              uploading: false,
              progress: 0,
              objectUrl: URL.createObjectURL(file),
              error: false,
              id: uuidv4(),
              isDeleting: false,
              fileType: fileTypeAccepted,
            });
      
            uploadFile(file);
          }
        },
        [filestate.objectUrl, uploadFile, fileTypeAccepted]
      );
      

      async function handleRemoveFile()
      {
        if (filestate.isDeleting || !filestate.objectUrl) {
            return
        }

        if (!filestate.key) {
            toast.error("No file key found — cannot delete");
            return;
          }

         // console.log(filestate.key);
          

        try {

            setFileState((prev)=>({...prev,isDeleting:true}))
            
            const response = await fetch('/api/s3/delete',{method:'DELETE',headers:{"Content-Type":"application/json"},body:JSON.stringify({key:filestate.key})});

          //  console.log(response);
            if (!response.ok) {
                toast.error("failed to remove file from storage ")
                setFileState((prev)=>({...prev,isDeleting:true,error:true}))
                return;
            }
        
            console.log(filestate.objectUrl);

            if (filestate.objectUrl && !filestate.objectUrl.startsWith("http")) {
                console.log(filestate.objectUrl);
                URL.revokeObjectURL(filestate.objectUrl)
            }

           onChange?.("")

            setFileState(()=>({file:null,uploading:false,progress:0,objectUrl:undefined,fileType:fileTypeAccepted,error:false,id:null,isDeleting:false}))

            toast.success("file removed successfully")
        } catch (error) {
            console.log(error);
            toast.error("error removing file ,please try again");
            setFileState((prev)=>({...prev,isDeleting:false,error:true}))

        }
      }

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
                <RenderUplodedState filetype={filestate.fileType} handleRemoveFile={handleRemoveFile} isDeleting={filestate.isDeleting}   previewUrl={filestate.objectUrl}/>
            )
        }
        return <RenderEmptystate isDragActive={isDragActive}/>
      }
      useEffect(()=>{  /* it is called cleanup function it will run on previous data */
        return ()=>{
            if (filestate.objectUrl && !filestate.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(filestate.objectUrl)
            }
        }
      },[filestate.objectUrl])

 const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept:fileTypeAccepted ==="video"?{'video/*':[]}:{"image/*":[]},
     maxFiles:1,
     multiple:false,
     maxSize:fileTypeAccepted ==="image" ? 5*1024*1024:5000*1024*1024, /* i want to store 5mb ..... 1mb is 1024 * 1024 ..... */
     onDropRejected: rejectedFiles,
     disabled:filestate.uploading || !!filestate.objectUrl
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