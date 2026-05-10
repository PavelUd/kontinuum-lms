'use client'

import {EditorSidebar} from "@/features/editor-sidebar/EditorSidebar";
import {Canvas} from "@/widgets/editor-canvas/ui/Canvas";
import styles from "./editor-page.module.css"
import {Loader} from "@/shared/ui/loader";
import {useModuleQuery} from "@/entities/module/model/useModulesQuery";

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
    const lesson = moduleData?.data

    const draft =
        lesson?.status !== "draft"
            ? (lesson?.draftLessonId ?? "")
            : (lesson?.id ?? "")

    const courseId = moduleData?.data.courseId;

    return (
        <div className={styles.editorLayout}>
        <EditorSidebar moduleId={moduleId} draftId={draft ?? ""} courseId={courseId ?? ""}></EditorSidebar>
        <Canvas courseId={courseId ?? ""} moduleId={draft ?? ""} moduleTitle={title ?? ""} />
        </div>
    )
}