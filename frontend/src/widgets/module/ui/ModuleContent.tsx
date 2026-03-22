
import {  ModuleBlock } from "@/entities/module-block/model/types"
import {getBlock} from "@/entities/module-block/lib/block-registry"
import "@/entities/module-block/lib/register-blocks"
import styles from "./module.module.css"
import {useBlocksObserver} from "@/widgets/module/ui/useBlocksObserver";
type Props = {
    blocks: ModuleBlock<any>[]
}

export function ModuleContent({ blocks }: Props) {

    const observerRef = useBlocksObserver((id) => {
        console.log("viewed:", id)
    })

    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id}
                        data-id={block.id}
                        ref={(el) => {
                            if (el && observerRef.current) {
                                observerRef.current.observe(el)
                            }
                        }}
                    >
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}