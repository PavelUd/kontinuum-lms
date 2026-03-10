'use client'

import {CurriculumSidebar} from "@/features/editor-sidebar/EditorSidebar";
import {Canvas} from "@/widgets/editor-canvas/ui/Canvas";
import styles from "./editor-page.module.css"
type Props = {
    moduleId: string
}

export function EditorPage({ moduleId }: Props) {
    return (
        <div className={styles.editorLayout}>
        <CurriculumSidebar></CurriculumSidebar>
        <Canvas moduleId={moduleId} />
        </div>
    )
}