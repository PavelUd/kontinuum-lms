import { EditBlockProps } from "@/entities/module-block/model/types"
import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align"
import {BubbleMenu} from "@/features/bubble-menu/BubbleMenu";
import {useState} from "react";

export function EditTextBlock({
                                  block,
                                  updateBlock,
                              }: EditBlockProps<TextBlockContent>) {
    const { text } = block.content
    const [showBubbleMenu, setShowBubbleMenu] = useState(false)
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: text,
        immediatelyRender: false,
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection

            // есть выделение текста
            setShowBubbleMenu(from !== to)
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()

            if (html !== text) {
                updateBlock(block.id, { text: html })
            }
        },
    })

    if (!editor) return null

    return (
        <div className="relative">
            {/* твой отдельный BubbleMenu компонент */}
            {showBubbleMenu && (
                <BubbleMenu editor={editor} />
            )}

            <EditorContent
                editor={editor}
                className="[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            />
        </div>
    )
}