import styles from "@/widgets/module/ui/module.module.css";
import {getBlock} from "@/entities/module-block/lib/block-registry";
import "@/entities/module-block/lib/register-blocks"
import {HeatmapOverlay} from "@/features/heatmap/HeatmapOverlay";

type Props = {
    blocks: any[],
    heatmapEnabled: boolean
}

export function PreviewModuleContent({ blocks, heatmapEnabled }: Props) {
    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id} style={{ position: 'relative' }}
                    >
                        <HeatmapOverlay heatmapEnabled={heatmapEnabled} views={1} time={1} />
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}