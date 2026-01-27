"use client";

import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <TiptapBubbleMenu
      editor={editor}
      className={cn(
        "flex items-center gap-1 p-1.5 rounded-lg shadow-lg",
        "bg-background border border-border",
        "animate-in fade-in-0 zoom-in-95"
      )}
    >
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded hover:bg-secondary transition-colors cursor-pointer",
          editor.isActive("bold") && "bg-secondary text-foreground font-semibold"
        )}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold className="h-4 w-4" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded hover:bg-secondary transition-colors cursor-pointer",
          editor.isActive("italic") && "bg-secondary text-foreground font-semibold"
        )}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic className="h-4 w-4" />
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "p-2 rounded hover:bg-secondary transition-colors cursor-pointer",
          editor.isActive("strike") && "bg-secondary text-foreground font-semibold"
        )}
        title="Strikethrough (Ctrl+Shift+X)"
        type="button"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(
          "p-2 rounded hover:bg-secondary transition-colors cursor-pointer",
          editor.isActive("code") && "bg-secondary text-foreground font-semibold"
        )}
        title="Code (Ctrl+E)"
        type="button"
      >
        <Code className="h-4 w-4" />
      </button>

      {/* Heading Buttons */}
      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "px-2 py-1 rounded hover:bg-secondary transition-colors cursor-pointer text-sm font-semibold",
          editor.isActive("heading", { level: 1 }) && "bg-secondary text-foreground"
        )}
        title="Heading 1"
        type="button"
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "px-2 py-1 rounded hover:bg-secondary transition-colors cursor-pointer text-sm font-semibold",
          editor.isActive("heading", { level: 2 }) && "bg-secondary text-foreground"
        )}
        title="Heading 2"
        type="button"
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "px-2 py-1 rounded hover:bg-secondary transition-colors cursor-pointer text-sm font-semibold",
          editor.isActive("heading", { level: 3 }) && "bg-secondary text-foreground"
        )}
        title="Heading 3"
        type="button"
      >
        H3
      </button>
    </TiptapBubbleMenu>
  );
}
