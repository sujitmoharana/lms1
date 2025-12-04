"use client";

import React from "react"
import { Editor } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

import {
  Bold,
  Italic,
  Strikethrough,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrdered,
  AlignLeftIcon,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"

const Menubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/30">
      <TooltipProvider>
        {/* Bold */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        {/* Italic */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        {/* Strike */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("strike")}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={16} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>

        {/* Headings */}
        <Toggle
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1Icon size={16} />
        </Toggle>

        <Toggle
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2Icon size={16} />
        </Toggle>

        <Toggle
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3Icon size={16} />
        </Toggle>

        {/* Lists */}
        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon size={16} />
        </Toggle>

        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </Toggle>

        {/* Alignment */}
        <Toggle
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeftIcon size={16} />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={16} />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} />
        </Toggle>

        {/* Undo / Redo */}
        <Toggle onPressedChange={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </Toggle>

        <Toggle onPressedChange={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </Toggle>
      </TooltipProvider>
    </div>
  )
}

export default Menubar
