import {CanvasHeader} from "@/widgets/editor-canvas/ui/CanvasHeader";
import {CanvasContent} from "@/widgets/editor-canvas/ui/CanvasContent";
import styles from "./canvas.module.css"
import {ModuleBlock} from "@/entities/module-block/model/types";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";

type Props = {
    blocks : ModuleBlock<any>[],
    moduleTitle: string,
    moduleId: string
}

export function Canvas({ blocks, moduleTitle, moduleId }: Props) {

    const loadBlocks = useLessonBlocksStore(s => s.loadBlocks)
    loadBlocks(blocks)

    const setActiveBlock = useLessonBlocksStore(s => s.setActiveBlock)

    return (
        <div className={styles.editorCanvas} onClick={() => setActiveBlock("")}>
            <CanvasHeader moduleId={moduleId} name={moduleTitle}></CanvasHeader>
            <CanvasContent></CanvasContent>
        </div>
    )
}