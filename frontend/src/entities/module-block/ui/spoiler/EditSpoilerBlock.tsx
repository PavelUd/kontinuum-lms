import styles from "./spoiler.module.css"
import {SpoilerBlockContent} from "@/entities/module-block/ui/spoiler/spoiler-block-content";

import {EditBlockProps} from "@/entities/module-block/model/types";
import {EyeOff} from "lucide-react";
import {EditorContent, useEditor} from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import {useEffect} from "react";
import { BubbleMenu } from "@/features/bubble-menu/BubbleMenu";


export function EditSpoilerBlock({
                                     block,
                                     isActive,
                                     updateBlock,
                                 }: EditBlockProps<SpoilerBlockContent>) {

    const { title, text } = block.content

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
            updateBlock(block.id, {
                title,
                text: editor.getHTML(),
            })
        },
    })

    useEffect(() => {
        if (!editor) return

        editor.setEditable(isActive)

        if (!isActive) {
            editor.commands.blur()
        }
    }, [isActive, editor])

    if (!editor) return null

    return (
        <div className={styles.spoilerBlockPreview}>
            <div className={styles.spoilerHeaderPreview}>
                <div className={styles.row}>
                    <EyeOff
                        size={18}
                        className={styles.iconMuted}
                    />

                    <span
                        contentEditable={isActive}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                            updateBlock(block.id, {
                                title: e.currentTarget.innerText,
                                text,
                            })
                        }
                        dangerouslySetInnerHTML={{
                            __html: title,
                        }}
                    />
                </div>
            </div>

            <div className="relative">
                <BubbleMenu
                    editor={editor}
                />

                <EditorContent
                    editor={editor}
                    className={`
                        ${styles.spoilerContentPreview}
                        [&_ul]:list-disc
                        [&_ul]:pl-6
                        [&_ol]:list-decimal
                        [&_ol]:pl-6
                    `}
                />
            </div>
        </div>
    )
}