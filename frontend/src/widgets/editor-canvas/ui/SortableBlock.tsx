import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {DraggableSyntheticListeners} from "@dnd-kit/core";

type SortableBlockProps = {
    id: string
    children: (props: {
        listeners?: DraggableSyntheticListeners
        attributes?: Record<string, any>
    }) => React.ReactNode
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