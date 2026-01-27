"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import BubbleMenu from "./bubble-menu";

interface TipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  className?: string;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  className,
  placeholder = "Write your post content... Try typing some markdown!",
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-secondary/50 text-foreground rounded p-4 font-mono text-sm",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-secondary/50 text-foreground rounded px-1.5 py-0.5 font-mono text-sm",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary pl-4 italic text-foreground/80",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown.configure({
        markedOptions: {
          gfm: true, // GitHub Flavored Markdown
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate dark:prose-invert max-w-none",
          "focus:outline-none px-4 py-3"
        ),
        spellcheck: "false", // Disable browser spellcheck
      },
    },
    onUpdate: ({ editor }) => {
      // Get markdown content
      const markdown = editor.getMarkdown();
      onChange(markdown);
    },
  });

  // Update editor content when content prop changes (e.g., loading existing post)
  useEffect(() => {
    if (editor && content && editor.markdown) {
      const currentMarkdown = editor.getMarkdown();
      if (content !== currentMarkdown) {
        // Parse markdown to JSON first, then set content
        const parsedContent = editor.markdown.parse(content);
        editor.commands.setContent(parsedContent, false);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background transition-colors",
        "hover:border-foreground/20",
        "h-[600px] overflow-y-auto", // Fixed height with scroll
        className
      )}
    >
      {editor && <BubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
