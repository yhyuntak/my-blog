"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import ImageResize from "tiptap-extension-resize-image";
import { marked } from "marked";
import { useEffect } from "react";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { cn } from "@/lib/utils";
import BubbleMenu from "./bubble-menu";

interface TipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  className?: string;
  placeholder?: string;
}

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.url;
}

const ImageResizeMarkdown = ImageResize.extend({
  name: 'image',

  renderMarkdown(node) {
    const src = node.attrs?.src ?? '';
    const alt = node.attrs?.alt ?? '';
    const width = node.attrs?.width;

    if (width) {
      return `<img src="${src}" alt="${alt}" width="${width}" />`;
    }
    return `![${alt}](${src})`;
  },
});

const ImageUpload = Extension.create({
  name: 'imageUpload',

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handlePaste(view, event) {
            const items = event.clipboardData?.items;
            if (!items) return false;

            for (let i = 0; i < items.length; i++) {
              if (items[i].type.startsWith('image/')) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                  uploadImage(file).then((url) => {
                    if (url) {
                      const { state } = editor.view;
                      const { selection } = state;
                      const position = selection.$head.end();
                      editor.chain().focus().insertContentAt(position, {
                        type: 'image',
                        attrs: { src: url, alt: file.name },
                      }).run();
                    }
                  }).catch((error) => {
                    console.error('Image upload failed:', error);
                  });
                }
                return true;
              }
            }
            return false;
          },
          handleDrop(view, event) {
            const files = event.dataTransfer?.files;
            if (!files || files.length === 0) return false;

            for (let i = 0; i < files.length; i++) {
              if (files[i].type.startsWith('image/')) {
                event.preventDefault();
                const droppedFile = files[i];
                uploadImage(droppedFile).then((url) => {
                  if (url) {
                    const { state } = editor.view;
                    const { selection } = state;
                    const position = selection.$head.end();
                    editor.chain().focus().insertContentAt(position, {
                      type: 'image',
                      attrs: { src: url, alt: droppedFile.name },
                    }).run();
                  }
                }).catch((error) => {
                  console.error('Image upload failed:', error);
                });
                return true;
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

export default function TipTapEditor({
  content,
  onChange,
  className,
  placeholder = "Write your post content... Try typing some markdown!",
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
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
          gfm: true,
        },
      }),
      ImageResizeMarkdown.configure({
        inline: false,
      }),
      ImageUpload,
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate dark:prose-invert max-w-none",
          "focus:outline-none px-4 py-3"
        ),
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.getMarkdown();
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (editor && content) {
      const currentMarkdown = editor.getMarkdown();
      if (content !== currentMarkdown) {
        const html = marked.parse(content, { async: false }) as string;
        editor.commands.setContent(html, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "tiptap-editor", // Custom class for editor-specific CSS
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
