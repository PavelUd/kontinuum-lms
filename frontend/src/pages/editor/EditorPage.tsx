'use client'

import {EditorSidebar} from "@/features/editor-sidebar/EditorSidebar";
import {Canvas} from "@/widgets/editor-canvas/ui/Canvas";
import styles from "./editor-page.module.css"
import {Loader} from "@/shared/ui/loader";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {useManualModule} from "@/entities/module/model/useManualModule";

type Props = {
    moduleId: string
}

export function EditorPage({ moduleId }: Props) {

    const loadBlocks = useLessonBlocksStore(s => s.loadBlocks)

    const {
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useManualModule(moduleId);

    const data = moduleData

    if (moduleLoading)
        return <Loader />
    if (moduleError)
        return <div>Ошибка загрузки</div>

    loadBlocks(data?.blocks ?? [], moduleId)

    const title = data?.title;
    const courseId = data?.courseId;

    return (
        <div className={styles.editorLayout}>
        <EditorSidebar moduleId={moduleId} courseId={courseId ?? ""}></EditorSidebar>
        <Canvas courseId={courseId ?? ""} moduleId={moduleId} moduleTitle={title ?? ""} />
        </div>
    )
}