import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type SortableBlockProps = {
    id: string
    children: any
}
export const SortableBlock = ({ id, children }: SortableBlockProps) => {

    const {
        setNodeRef,
        listeners,
        attributes,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1
    }

    return (
        <div ref={setNodeRef} style={style}>
            {children({ listeners, attributes })}
        </div>
    )
}