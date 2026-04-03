import styles from "@/widgets/module/ui/module.module.css";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import "@/entities/module-block/lib/register-blocks"

type Props = {
    blocks: any[]
}

export function PreviewModuleContent({ blocks }: Props) {
    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                console.log(block);
                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id}
                    >
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}