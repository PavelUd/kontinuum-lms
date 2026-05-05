"use client"

import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus"
import {Bold, Italic, Code, AlignLeft, AlignCenter, AlignRight, List, ListOrdered} from "lucide-react"
import {Editor} from "@tiptap/react";
import {MenuButton} from "@/features/bubble-menu/MenuButton";

type Props = {
    editor: Editor | null
}

export function BubbleMenu({ editor }: Props) {
    if (!editor) return null

    return (
        <TiptapBubbleMenu
            editor={editor}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-1 py-1 shadow-xl"
        >
            {/* Группа: форматирование */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200">
                <MenuButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} />
                </MenuButton>

                <MenuButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} />
                </MenuButton>

                <MenuButton
                    active={editor.isActive("code")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code size={16} />
                </MenuButton>
            </div>

            {/* Группа: выравнивание */}
            <div className="flex items-center gap-0.5 px-1 border-r border-slate-200">
                <MenuButton
                    active={editor.isActive({ textAlign: "left" })}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                    <AlignLeft size={16} />
                </MenuButton>

                <MenuButton
                    active={editor.isActive({ textAlign: "center" })}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                >
                    <AlignCenter size={16} />
                </MenuButton>

                <MenuButton
                    active={editor.isActive({ textAlign: "right" })}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                    <AlignRight size={16} />
                </MenuButton>
            </div>

            {/* Группа: списки */}
            <div className="flex items-center gap-0.5 pl-1">
                <MenuButton
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} />
                </MenuButton>

                <MenuButton
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={16} />
                </MenuButton>
            </div>
        </TiptapBubbleMenu>
    )
}