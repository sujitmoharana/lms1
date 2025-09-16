import React from 'react' //3
import {type Editor} from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Toggle } from '../ui/toggle'
import { AlignCenter, AlignLeftIcon, AlignRight, Bold, Heading1Icon, Heading2Icon, Heading3Icon, HeadingIcon, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
interface iAppprops{
  editor:Editor | null
}

const Menubar = ({editor}:iAppprops) => {  https://chatgpt.com/s/t_68c54f3a69c4819198e01078829e35b1   https://chatgpt.com/s/t_68c54f80bfc08191b13cf7e2f08177de   
    if (!editor) {
        return null
    }
    console.log(editor.isActive("bold"));
    console.log(editor.chain().focus().toggleStrike().run());
    
  return (
    <div className='flex items-center flex-wrap border rounded-t-lg p-2 gap-2 bg-card border-input'>
        <TooltipProvider >
            <div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={()=>editor.chain().focus().toggleBold().run()} className={cn(editor.isActive("bold") && 'bg-muted text-muted-foreground')}>  {/*onPressedChange={()=>editor.chain().focus().toggleBold().run()}   https://chatgpt.com/s/t_68c64acece0c81919df5ff8b0e124c27  https://chatgpt.com/s/t_68c64b8e5e648191a27d5d8d6632bc0a  without chain method we run editor.focus()
                                                                                                                                                                                                                                                                                                                                                                                                                                               editor.togglebold() .. we run like this separtly with chain methd we can run in line ..all focus().togglebold()*/}
                           <Bold/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Bold
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={()=>editor.chain().focus().toggleItalic().run()} className={cn(editor.isActive("italic") && 'bg-muted text-muted-foreground')}>
                           <Italic/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Italic
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={()=>editor.chain().focus().toggleStrike().run()} className={cn(editor.isActive("strike") && 'bg-muted text-muted-foreground')}>
                           <Strikethrough/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Strike
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("heading",{level:1})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:1}).run()} className={cn(editor.isActive("heading",{level:1}) && 'bg-muted text-muted-foreground')}>
                           <Heading1Icon/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Heading 1
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("heading",{level:2})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:2}).run()} className={cn(editor.isActive("heading",{level:2}) && 'bg-muted text-muted-foreground')}>
                           <Heading2Icon/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Heading 2
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("heading",{level:3})} onPressedChange={()=>editor.chain().focus().toggleHeading({level:3}).run()} className={cn(editor.isActive("heading",{level:3}) && 'bg-muted text-muted-foreground')}>
                           <Heading3Icon/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Heading 3
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("bulletlList")} onPressedChange={()=>editor.chain().focus().toggleBulletList().run()} className={cn(editor.isActive("bulletList") && 'bg-muted text-muted-foreground')}>
                           <ListIcon/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Bullet List
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={()=>editor.chain().focus().toggleOrderedList().run()} className={cn(editor.isActive("orderedList") && 'bg-muted text-muted-foreground')}>
                           <ListOrdered/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        orderList
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className='w-px h-6 bg-border  mx-2'></div>
            <div className='flex flex-wrap gap-1'>
            <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive({textAlign:"left"})} onPressedChange={()=>editor.chain().focus().setTextAlign("left").run()} className={cn(editor.isActive({trxtAlign:"left"}) && 'bg-muted text-muted-foreground')}>
                           <AlignLeftIcon/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Align left
                    </TooltipContent>
                </Tooltip>

            <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive({textAlign:"center"})} onPressedChange={()=>editor.chain().focus().setTextAlign("center").run()} className={cn(editor.isActive({trxtAlign:"center"}) && 'bg-muted text-muted-foreground')}>
                           <AlignCenter/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Align center
                    </TooltipContent>
                </Tooltip>

            <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive({textAlign:"right"})} onPressedChange={()=>editor.chain().focus().setTextAlign("right").run()} className={cn(editor.isActive({trxtAlign:"right"}) && 'bg-muted text-muted-foreground')}>
                           <AlignRight/>
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                        Align right
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className='w-px h-6 ng-border mx-2'></div>
            <div className='flex flex-wrap gap'>
                
            <Tooltip>
                    <TooltipTrigger asChild>
                       <Button size="sm" variant="ghost" type='button' onClick={()=>editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                        <Undo/>
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Undo
                    </TooltipContent>
                </Tooltip>

            <Tooltip>
                    <TooltipTrigger asChild>
                       <Button size="sm" variant="ghost" type='button' onClick={()=>editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                        <Redo/>
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Redo
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    </div>
  )
}

export default Menubar