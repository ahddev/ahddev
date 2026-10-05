"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  TextQuote,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EditorProps = {
  content: string;
  /** Called with the HTML, or "" when the editor is empty. */
  onChange: (html: string) => void;
  autoFocus?: boolean;
  className?: string;
};

export function Editor({ content, onChange, autoFocus, className }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // plain correspondence: no headings or code blocks in the toolbar
        heading: false,
        codeBlock: false,
        link: { openOnClick: false },
      }),
    ],
    content,
    autofocus: autoFocus ? "end" : false,
    // required by Tiptap when the page is server-rendered
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap min-h-40 px-4 py-3 text-[15px] leading-relaxed outline-none",
        "aria-label": "Message",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      strike: editor?.isActive("strike") ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      link: editor?.isActive("link") ?? false,
    }),
  });

  if (!editor) return <div className={cn("min-h-40", className)} />;

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", current ?? "https://");
    if (url === null) return;
    const chain = editor.chain().focus().extendMarkRange("link");
    if (url.trim() === "") chain.unsetLink().run();
    else chain.setLink({ href: url.trim() }).run();
  }

  const tools = [
    { label: "Bold", icon: Bold, on: active?.bold, run: () => editor.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, on: active?.italic, run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Underline", icon: Underline, on: active?.underline, run: () => editor.chain().focus().toggleUnderline().run() },
    { label: "Strikethrough", icon: Strikethrough, on: active?.strike, run: () => editor.chain().focus().toggleStrike().run() },
    { label: "Bulleted list", icon: List, on: active?.bulletList, run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, on: active?.orderedList, run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", icon: TextQuote, on: active?.blockquote, run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Link", icon: LinkIcon, on: active?.link, run: setLink },
    { label: "Undo", icon: Undo2, on: false, run: () => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, on: false, run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex shrink-0 gap-0.5 overflow-x-auto border-b px-2 py-1"
      >
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={tool.on}
            // keep the text selection while clicking a toolbar button
            onMouseDown={(event) => event.preventDefault()}
            onClick={tool.run}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              tool.on && "bg-accent text-accent-foreground"
            )}
          >
            <tool.icon className="size-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} className="min-h-0 flex-1 overflow-y-auto" />
    </div>
  );
}
