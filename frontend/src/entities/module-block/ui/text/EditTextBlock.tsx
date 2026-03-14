import { useEffect, useRef } from "react"
import { EditBlockProps } from "@/entities/module-block/model/types"
import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";

export function EditTextBlock({
                                  block,
                                  isActive,
                                  updateBlock
                              }: EditBlockProps<TextBlockContent>) {

    const ref = useRef<HTMLDivElement>(null)

    const { text } = block.content

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
        if (isActive) {
            focusEnd(ref.current)
        }
    }, [isActive])

    const handleBlur = () => {

        if (!ref.current) return

        const newText = ref.current.innerHTML

        if (newText !== text) {
            updateBlock(block.id, { text: newText })
        }
    }

    return (
        <div
            ref={ref}
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    )
}