
import {  ModuleBlock } from "@/entities/module-block/model/types"
import {getBlock} from "@/entities/module-block/lib/block-registry"
import "@/entities/module-block/lib/register-blocks"
import styles from "./module.module.css"

type Props = {
    blocks: ModuleBlock[]
}

export function ModuleContent({ blocks }: Props) {

console.log(blocks)
    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)
                if (!Block) return null

                return <Block key={block.id} content={block.content} />
            })}
        </div>
    )
}