'use client'

import {EditorSidebar} from "@/features/editor-sidebar/EditorSidebar";
import {Canvas} from "@/widgets/editor-canvas/ui/Canvas";
import styles from "./editor-page.module.css"
import {Loader} from "@/shared/ui/loader";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {useModuleBlocks} from "@/entities/module-block/model/useModuleBlocks";
import {useModuleQuery, useModulesQuery} from "@/entities/module/model/useModulesQuery";
import {SaveStatusIndicator} from "@/features/save-status-indicator/SaveStatusIndicator";

type Props = {
    moduleId: string
}

export function EditorPage({ moduleId }: Props) {

    const {
        data: blocks,
        isLoading: blocksLoading,
        isError: blocksError
    } = useModuleBlocks(moduleId);



    const {
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useModuleQuery(moduleId);

    if (moduleLoading && blocksLoading)
        return <Loader />
    if (moduleError && blocksError)
        return <div>Ошибка загрузки</div>


    const title = moduleData?.data.title;
    const courseId = moduleData?.data.courseId;

    return (
        <div className={styles.editorLayout}>
        <EditorSidebar moduleId={moduleId} courseId={courseId ?? ""}></EditorSidebar>
        <Canvas blocks={blocks} courseId={courseId ?? ""} moduleId={moduleId} moduleTitle={title ?? ""} />
        </div>
    )
}