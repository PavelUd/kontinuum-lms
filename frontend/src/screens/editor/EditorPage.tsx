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
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useModuleQuery(moduleId);

    if (moduleLoading)
        return <Loader />
    if (moduleError)
        return <div>Ошибка загрузки</div>


    const title = moduleData?.data.title;
    const draft = moduleData?.data.draftLessonId ?? "";
    const courseId = moduleData?.data.courseId;

    console.log(draft);

    return (
        <div className={styles.editorLayout}>
        <EditorSidebar moduleId={moduleId} draftId={draft ?? ""} courseId={courseId ?? ""}></EditorSidebar>
        <Canvas courseId={courseId ?? ""} moduleId={draft ?? ""} moduleTitle={title ?? ""} />
        </div>
    )
}