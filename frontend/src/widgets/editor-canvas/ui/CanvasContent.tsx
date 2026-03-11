'use client'

import styles from "./canvas.module.css"
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import "@/entities/module-block/lib/register-blocks"
import {BlockControls} from "@/widgets/editor-canvas/ui/BlockControls";
import {ModuleBlock} from "@/entities/module-block/model/types";


export function CanvasContent() {

    const blockOrder = useLessonBlocksStore(s => s.blockOrder)
    const blocksById = useLessonBlocksStore(s => s.blocksById)

    const updateBlock = useLessonBlocksStore(s => s.updateBlock)
    const setActiveBlock = useLessonBlocksStore(s => s.setActiveBlock)
    const moveBlock = useLessonBlocksStore(s => s.moveBlock)
    const removeBlock = useLessonBlocksStore(s => s.removeBlock)

    const activeBlock = useLessonBlocksStore(s => s.activeBlockId)

    return (
        <div className={styles.canvasContainer}>

            <div className={styles.blocks} onClick={() => setActiveBlock(null)}>
                {blockOrder.map(id => {

                    const block = blocksById[id]
                    const BlockComponent = getBlock(block.type, "editor")
                    if (!BlockComponent) return null

                    return (
                        <div key={block.id} className={`${styles.editableBlockWrapper} ${activeBlock === block.id ? styles.active : ''}`} onClick={(e) => { e.stopPropagation(); setActiveBlock(block.id); }}>
                            <BlockControls
                                onMoveUp={() => moveBlock(block.id, "up")}
                                onMoveDown={() => moveBlock(block.id, "down")}
                                onRemove={() => removeBlock(block.id)}
                            />
                        <BlockComponent
                            key={block.id}
                            block={block}
                            isActive={activeBlock === block.id}
                            updateBlock={updateBlock}
                        />
                        </div>
                    )
                })}
            </div>
            <div className={styles.lessonEnd}>
                <div className={styles.lessonEndText}>Конец урока</div>
            </div>
        </div>
    )
}