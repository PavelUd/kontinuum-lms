'use client'

import {EditorSidebar} from "@/features/editor-sidebar/EditorSidebar";
import {Canvas} from "@/widgets/editor-canvas/ui/Canvas";
import styles from "./editor-page.module.css"
import {useModuleQuery} from "@/entities/module/model/useModulesQuery";
import {Loader} from "@/shared/ui/loader";
type Props = {
    moduleId: string
}

export function EditorPage({ moduleId }: Props) {

    const {
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useModuleQuery(moduleId);


    const data = moduleData?.data

    if (moduleLoading)
        return <Loader />
    if (moduleError)
        return <div>Ошибка загрузки</div>

    return (
        <div className={styles.editorLayout}>
        <EditorSidebar moduleId={moduleId} courseId={data?.courseId ?? ""}></EditorSidebar>
        <Canvas blocks={data?.blocks ?? []} moduleId={moduleId} moduleTitle={data?.title ?? ""} />
        </div>
    )
}