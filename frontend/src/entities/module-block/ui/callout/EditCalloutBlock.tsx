import {EditBlockProps} from "@/entities/module-block/model/types";
import {useEffect, useRef} from "react";
import styles from "@/entities/module-block/ui/callout/callout.module.css"
import {Info} from "lucide-react";
import {
    CALLOUT_TITLES,
    CalloutBlockContent,
    CalloutVariant
} from "@/entities/module-block/ui/callout/callout-block-content";

export function EditCalloutBlock({
                                     block,
                                     isActive,
                                     updateBlock
                                 }: EditBlockProps<CalloutBlockContent>) {

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
            updateBlock(block.id, { text: newText, variant: block.content.variant })
        }
    }
    const type = block.content.variant.toLowerCase() as CalloutVariant;
    return (
        <div className={`${styles.calloutBlock} ${styles[`callout-${type}`]}`}>
            <div className={styles.calloutTitle}>
                <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>{CALLOUT_TITLES[type]}</span>
                </div>
            </div>

            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                className={styles.noteContent}
                dangerouslySetInnerHTML={{ __html: text }}
                onBlur={handleBlur}
            />
        </div>
    )
}