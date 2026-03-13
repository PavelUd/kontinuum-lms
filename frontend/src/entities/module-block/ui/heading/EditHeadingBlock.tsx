import { useEffect, useRef } from "react"
import { EditBlockProps, HeadingBlockContent } from "@/entities/module-block/model/types"

export function EditHeadingBlock({
                                     block,
                                     isActive,
                                     updateBlock
                                 }: EditBlockProps<HeadingBlockContent>) {

    const ref = useRef<HTMLHeadingElement>(null)

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

        const newText = ref.current.innerText.trim()

        if (newText !== text) {
            updateBlock(block.id, { text: newText })
        }
    }

    return (
        <h2
            ref={ref}
            className="text-3xl font-bold"
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    )
}