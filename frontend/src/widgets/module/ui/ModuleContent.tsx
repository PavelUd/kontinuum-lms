
import {  ModuleBlock } from "@/entities/module-block/model/types"
import {getBlock} from "@/entities/module-block/lib/block-registry"
import "@/entities/module-block/lib/register-blocks"
import styles from "./module.module.css"
import {useBlocksObserver} from "@/widgets/module/ui/useBlocksObserver";
import {useCallback} from "react";

type Props = {
    blocks: ModuleBlock<any>[]
}

export function ModuleContent({ blocks }: Props) {

    const { observe, unobserve } = useBlocksObserver((id, duration) => {
        console.log("viewed:", id, duration)
    })

    const setRef = useCallback(
        (el: HTMLElement | null) => {
            if (el) {
                observe(el)
            }
        },
        [observe]
    )

    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id}
                        data-id={block.id}
                        ref={setRef}
                    >
                        <div>{block.id}</div>
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}