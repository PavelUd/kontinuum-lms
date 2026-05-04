"use client"

import styles from "@/widgets/module/ui/module.module.css";
import {ModuleHero} from "@/widgets/module/ui/ModuleHero";
import {PreviewHeader} from "@/widgets/module-header/PreviewHeader";
import {PreviewModuleContent} from "@/widgets/module/ui/PreviewModuleContent";
import {Loader} from "@/shared/ui/loader";
import {useModuleQuery} from "@/entities/module/model/useModulesQuery";
import {useCourseQuery} from "@/entities/course";
import {useModuleBlocks} from "@/entities/module-block/model/useModuleBlocks";
import {HeatmapPanel} from "@/features/heatmap/HeatmapPanel";
import {useState} from "react";
import { UseEngagementStatsQuery } from "@/entities/analytic/model/useEngagementStatsQuery";

type Props = {
    lessonId: string
}

export function ModulePreviewPage({ lessonId }: Props) {

    const {
        isLoading: blocksLoading,
        data: blocks,
        isError: isBlocksErrors
    } = useModuleBlocks(lessonId)

    const {
        isLoading: heatmapLoading,
        data: heatmap,
        isError: isHeatmapErrors
    } = UseEngagementStatsQuery(lessonId)

    const {
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useModuleQuery(lessonId);

    const lesson = moduleData?.data;

    const {
        isLoading: courseLoading,
        data: courseData,
    } = useCourseQuery(lesson?.courseId ?? "");

    const [heatmapEnabled, setHeatmapEnabled] = useState(false);

    if (blocksLoading && moduleLoading && courseLoading && heatmapLoading) return <Loader />
    if (isBlocksErrors) return <div>Ошибка загрузки</div>

    return (
        <>
            <PreviewHeader courseId={lesson?.courseId ?? ""}></PreviewHeader>
            <div className={styles.container}>
                <ModuleHero module={1} category={courseData?.data.name} title={lesson?.title ?? ""}></ModuleHero>
                <PreviewModuleContent heatmapEnabled={heatmapEnabled} heatmap={heatmap ?? []} blocks={blocks ?? []}></PreviewModuleContent>
                <HeatmapPanel heatmapEnabled={heatmapEnabled} setHeatmapEnabled={setHeatmapEnabled}></HeatmapPanel>
            </div>
        </>
    )
}