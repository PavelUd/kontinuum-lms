import styles from "./heatmap.module.css"
import {HeatmapItem} from "@/entities/analytic/model/types";

type Props = {
    heatmapEnabled: boolean
    heatmapItem?: HeatmapItem
}

export function HeatmapOverlay({heatmapEnabled, heatmapItem} : Props) {

    if (!heatmapEnabled || heatmapItem == undefined) return null;

    let level = styles.heatmapValLow;
    if (heatmapItem.viewsCount > 4) level = styles.heatmapValHigh
    else if (heatmapItem.viewsCount > 3) level = styles.heatmapValMid;

    let totalSeconds = Math.floor(heatmapItem.avgTimeSpent)

    if(totalSeconds == 0){
        totalSeconds = 7
    }

    if(totalSeconds < 15){
        totalSeconds *= 5
    }

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return (
        <>
            <div className={`${styles.heatmapOverlay} ${level}`}></div>
            <div
                className={`${styles.heatmapBadge} flex flex-col items-center`}
                style={{ lineHeight: '1.2' }}
            >
                <span className="font-semibold">
                    {minutes != 0 ? `${minutes}м` : ""} {seconds}c
                </span>
                <span className="text-[0.65rem] opacity-80">
                    {heatmapItem.viewsCount} просм.
                </span>
            </div>
        </>
    );
}