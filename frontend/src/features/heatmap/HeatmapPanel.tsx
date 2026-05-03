import {Flame} from "lucide-react";
import styles from "./heatmap.module.css"

type Props = {
    heatmapEnabled : boolean
    setHeatmapEnabled : (heatmapEnabled : boolean) => void
}

export function HeatmapPanel({heatmapEnabled, setHeatmapEnabled} : Props) {

    return (
        <div className={`${styles.methodistPanel} flex items-center gap-3`}>
            <div className="flex items-center gap-2">
                <Flame size={18} className="text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">
                    Тепловая карта
                </span>
            </div>

            <div
                className={`${styles.methodistToggle} ${
                    heatmapEnabled ? styles.active : ''
                }`}
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
            />

            <div className="w-px h-4 bg-gray-300"></div>

            <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-900">8</span> просмотров сегодня
            </div>
        </div>
    );
}