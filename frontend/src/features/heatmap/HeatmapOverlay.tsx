import styles from "./heatmap.module.css"

type Props = {
    heatmapEnabled: boolean
    time : number
    views: number
}

export function HeatmapOverlay({heatmapEnabled, time, views} : Props) {

    if (!heatmapEnabled || time == 0 && views == 0) return null;

    let level = styles.heatmapValLow;
    if (views > 60) level = styles.heatmapValHigh
    else if (views > 20) level = styles.heatmapValMid;

    return (
        <>
            <div className={`${styles.heatmapOverlay} ${level}`}></div>
            <div
                className={`${styles.heatmapBadge} flex flex-col items-center`}
                style={{ lineHeight: '1.2' }}
            >
                <span className="font-semibold">
                    {Math.round(time)}с
                </span>
                <span className="text-[0.65rem] opacity-80">
                    {views} просм.
                </span>
            </div>
        </>
    );
}