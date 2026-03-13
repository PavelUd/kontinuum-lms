import {ModuleBlock} from "@/entities/module-block/model/types";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import styles from "./canvas.module.css"
import {BLOCKS_WITHOUT_HOVER} from "@/widgets/editor-canvas/model/types";


type BlockOverlayProps = {
    block?: ModuleBlock<any>
}

export function BlockOverlay({ block }: BlockOverlayProps) {

    if (!block) {
        return null
    }

    const BlockComponent = getBlock(block.type, "view")

    if (!BlockComponent) {
        return null
    }

    const disableHover = BLOCKS_WITHOUT_HOVER.includes(block.type)

    return (
        <div
            className={`${styles.editableBlockOverlay} ${
                disableHover ? styles.disableHover : ""
            }`}
        >
            <BlockComponent
                key={block.id}
                content={block.content}
            />
        </div>
    )
}