import styles from "@/widgets/module/ui/module.module.css";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import "@/entities/module-block/lib/register-blocks"
import {HeatmapOverlay} from "@/features/heatmap/HeatmapOverlay";
import {HeatmapItem} from "@/entities/analytic/model/types";

type Props = {
    blocks: any[],
    heatmap : HeatmapItem[],
    heatmapEnabled: boolean
}

export function PreviewModuleContent({ blocks, heatmap, heatmapEnabled }: Props) {
    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)

                const heatmapItem = heatmap.find(x => x.blockId === block.id)

                if (!Block) return null

                return (
                    <div
                        key={block.id} style={{ position: 'relative' }}
                    >
                        <HeatmapOverlay heatmapEnabled={heatmapEnabled} heatmapItem={heatmapItem} />
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}