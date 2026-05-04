import styles from "./heatmap.module.css"
import {HeatmapItem} from "@/entities/analytic/model/types";

type Props = {
    heatmapEnabled: boolean
    heatmapItem?: HeatmapItem
}

export function HeatmapOverlay({heatmapEnabled, heatmapItem} : Props) {

    if (!heatmapEnabled || heatmapItem == undefined) return null;

    let level = styles.heatmapValLow;
    if (heatmapItem.viewsCount > 60) level = styles.heatmapValHigh
    else if (heatmapItem.viewsCount > 20) level = styles.heatmapValMid;

    return (
        <>
            <div className={`${styles.heatmapOverlay} ${level}`}></div>
            <div
                className={`${styles.heatmapBadge} flex flex-col items-center`}
                style={{ lineHeight: '1.2' }}
            >
                <span className="font-semibold">
                    {Math.round(heatmapItem.avgTimeSpent)}с
                </span>
                <span className="text-[0.65rem] opacity-80">
                    {heatmapItem.viewsCount} просм.
                </span>
            </div>
        </>
    );
}