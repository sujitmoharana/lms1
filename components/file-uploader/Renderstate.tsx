import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon, ImagesIcon, Loader2, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const RenderEmptystate = ({isDragActive}:{isDragActive:boolean}) => {
  return (
    <div className='text-center'>
       <div className='flex mx-auto items-center justify-center size-12 rounded-full bg-muted mb-4'>
        <CloudUploadIcon className={cn("size-6 text-muted-foreground",isDragActive && "text-primary")}/>
       </div>
       <p className='text-base font-semibold text-foreground'>Drop your file here to <span className='text-primary font-bold cursor-pointer'>Click to upload</span></p>
       <Button className='mt-4  text-cyan-400 bg-cyan-900'>Select File</Button>
    </div>
  )
}

export default RenderEmptystate


export function RenderErrorState(){
    return(
        <div className=' text-center'>
         <div className='flex mx-auto items-center justify-center size-12 rounded-full bg-destructive/30 mb-4'>
        <ImageIcon className={cn("size-6 text-destructive")}/>
       </div>
       <p className=' text-base font-semibold'>Upload Failed</p>
       <p className='text-xs mt-1 text-muted-foreground'>Something went wrong</p>
       <Button  className='mt-4' type='button'>Retry File selection</Button>
        </div>
    )
}

export function RenderUplodedState({previewUrl,isDeleting,handleRemoveFile}:{previewUrl:string,isDeleting:boolean,handleRemoveFile:()=>void})
{
  return(
    <div>
      <Image src={previewUrl} alt='uploded file' fill className='object-contain p-2 '/>
      <Button onClick={handleRemoveFile} disabled={isDeleting} variant="destructive" size="icon" className={cn('absolute top-4 right-4')}>
       {isDeleting?(<Loader2 className='size-4 animate-spin'/>):(<XIcon className='size-4'/>)}
      </Button>
    </div>
  )
}

export function RenderUploadingState({progress,file}:{progress:number,file:File})
{
  return(
     <div className='text-center flex justify-center items-center flex-col'>
      <p>{progress}</p>
          <p className='mt-2 text-sm font-medium text-foreground'>Uploading....</p>
          <p className='mt-1 text-xs text-muted-foreground truncate max-w-xs'>{file.name}</p>
     </div>
  )
}