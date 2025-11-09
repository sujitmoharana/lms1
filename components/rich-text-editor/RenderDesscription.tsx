"use client"
import React, { useMemo } from 'react'
import {generateHTML, JSONContent} from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import parse from "html-react-parser"
const RenderDescription = ({json}:{json:JSONContent}) => {
  const output = useMemo(()=>{
    return generateHTML(json,[
        StarterKit,TextAlign.configure({types:["heading","paragraph"]})
    ])
  },[json])
 console.log(output);
 
  return (
  <div className='prose dark:prose-invert prose-li:marker:text-primary'>
    {parse(output)}
  </div>
  )
}

export default RenderDescription