import { useEffect, useRef, useState } from "react"
import { EditBlockProps, TextBlockContent } from "@/entities/module-block/model/types"

export function EditTextBlock({
                                  block,
                                  isActive,
                                  updateBlock
                              }: EditBlockProps<TextBlockContent>) {

    const titleRef = useRef<HTMLHeadingElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    const [focusTarget, setFocusTarget] = useState<"title" | "text">("title")

    const { title, text } = block.content

    function focusEnd(el: HTMLElement | null) {
        if (!el) return

        el.focus()

        const selection = window.getSelection()
        if (!selection) return

        const range = document.createRange()

        range.selectNodeContents(el)
        range.collapse(false)

        selection.removeAllRanges()
        selection.addRange(range)
    }

    useEffect(() => {

        if (!isActive) return

        if (focusTarget === "title") {
            focusEnd(titleRef.current)
        } else {
            focusEnd(textRef.current)
        }

    }, [isActive, focusTarget])

    const handleTitleBlur = () => {
        if (!titleRef.current) return

        const newTitle = titleRef.current.innerText.trim()

        if (newTitle !== title) {
            updateBlock(block.id, { title: newTitle, text: block.content.text })
        }
    }

    const handleTextBlur = () => {
        if (!textRef.current) return

        const newText = textRef.current.innerHTML

        if (newText !== text) {
            updateBlock(block.id, { text: newText, title: block.content.title })
        }
    }

    return (
        <div>

            <h2
                ref={titleRef}
                className="text-3xl font-bold mb-6"
                contentEditable={isActive}
                suppressContentEditableWarning
                onClick={() => setFocusTarget("title")}
                onBlur={handleTitleBlur}
                dangerouslySetInnerHTML={{ __html: title }}
            />

            <div
                ref={textRef}
                contentEditable={isActive}
                suppressContentEditableWarning
                onClick={() => setFocusTarget("text")}
                onBlur={handleTextBlur}
                dangerouslySetInnerHTML={{ __html: text }}
            />

        </div>
    )
}