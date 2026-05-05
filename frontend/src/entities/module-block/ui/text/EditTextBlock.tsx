import { useEffect } from "react"
import { EditBlockProps } from "@/entities/module-block/model/types"
import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";
import {BubbleMenu} from "@/features/bubble-menu/BubbleMenu";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align"

export function EditTextBlock({
                                  block,
                                  isActive,
                                  updateBlock,
                              }: EditBlockProps<TextBlockContent>) {
    const { text } = block.content
    console.log(text)
    const editor = useEditor({
        extensions: [
            StarterKit,

            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: text,
        editable: true,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            if (html !== text) {
                updateBlock(block.id, { text: html })
            }
        },
    })

    // фокус при активации
    useEffect(() => {
        console.log(isActive, editor);
        if (isActive && editor) {
            editor.commands.focus("end")
        }
    }, [isActive, editor])

    if (!editor) return null

    return (
        <div className="relative">
            {/* 🔥 вот здесь BubbleMenu */}
            <BubbleMenu editor={editor} />
            <EditorContent editor={editor} className=" [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6" />
        </div>
    )
}