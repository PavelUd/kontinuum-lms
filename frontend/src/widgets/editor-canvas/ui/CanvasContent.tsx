'use client'

import styles from "./canvas.module.css"
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import "@/entities/module-block/lib/register-blocks"
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    useSensors,
    useSensor,
    DragStartEvent, DragOverlay, PointerSensor
} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableBlock} from "@/widgets/editor-canvas/ui/SortableBlock";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {useState} from "react";
import {BlockControls} from "@/widgets/editor-canvas/ui/BlockControls";
import {BLOCKS_WITHOUT_HOVER} from "@/widgets/editor-canvas/model/types";


export function CanvasContent() {
    const blockOrder = useLessonBlocksStore(s => s.blockOrder)
    const blocksById = useLessonBlocksStore(s => s.blocksById)

    const updateBlock = useLessonBlocksStore(s => s.updateBlock)
    const setActiveBlock = useLessonBlocksStore(s => s.setActiveBlock)
    const moveBlock = useLessonBlocksStore(s => s.moveBlock)
    const removeBlock = useLessonBlocksStore(s => s.removeBlock)
    const [draggingId, setDraggingId] = useState<string | null>(null)

    const activeBlock = useLessonBlocksStore(s => s.activeBlockId)

    const [isDragging, setIsDragging] = useState(false)

    function handleDragStart(event: DragStartEvent) {
        setDraggingId(event.active.id.toString())
        setIsDragging(true)
    }

    function handleDragEnd(event: DragEndEvent) {

        const { active, over } = event

        if (!over || active.id === over.id){
            setIsDragging(false)
            return
        }

        const oldIndex = blockOrder.indexOf(active.id as string)
        const newIndex = blockOrder.indexOf(over.id as string)

        moveBlock(oldIndex, newIndex, draggingId ?? "");

        setDraggingId(null)
        setIsDragging(false)
    }

    const activate = (id: string) => {
        setActiveBlock(id)
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5
            }
        })
    )

    return (
                <div className={styles.canvasContainer} >
                    <div className={styles.blocks}>
                    <DndContext sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                                onDragStart={handleDragStart}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={blockOrder}
                            strategy={verticalListSortingStrategy}

                        >

                        {blockOrder.map(id => {

                            const block = blocksById[id]
                            const disableHover = BLOCKS_WITHOUT_HOVER.includes(block.type)
                            const BlockComponent = getBlock(block.type, "editor")
                            if (!BlockComponent){
                              return
                            }

                            return (
                                <SortableBlock key={block.id} id={block.id}>
                                    {({ listeners, attributes }) => (
                                        <div
                                            className={`${styles.editableBlockWrapper} ${
                                                activeBlock === block.id ? styles.active : ''
                                            } ${disableHover ? styles.disableHover : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveBlock(block.id)
                                            }}
                                        >
                                            {!isDragging && (
                                                <BlockControls
                                                    onRemove={() => removeBlock(block.id)}
                                                    dragListeners={listeners}
                                                    dragAttributes={attributes}
                                                />
                                            )}

                                            <BlockComponent
                                                block={block}
                                                setActiveBlock={activate}
                                                isActive={activeBlock === block.id}
                                                updateBlock={updateBlock}
                                            />
                                        </div>
                                    )}
                                </SortableBlock>
                            )
                        })}
                        </SortableContext>

                        <DragOverlay>
                            {draggingId && (() => {

                                const block = blocksById[draggingId]
                                if (!block) return null

                                const BlockComponent = getBlock(block.type, "editor")
                                if (!BlockComponent) return null

                                const disableHover = BLOCKS_WITHOUT_HOVER.includes(block.type)
                                return (
                                    <div className={`${styles.editableBlockOverlay} ${disableHover ? styles.disableHover : ''}`}>
                                        <BlockComponent
                                            key={block.id}
                                            block={block}
                                            isActive={false}
                                            updateBlock={() =>{}}
                                        />
                                    </div>
                                )
                            })()}
                        </DragOverlay>
                    </DndContext>
                    </div>

                    <div className={styles.lessonEnd}>
                        <div className={styles.lessonEndText}>
                            Конец урока
                        </div>
                    </div>
                </div>

    )
}