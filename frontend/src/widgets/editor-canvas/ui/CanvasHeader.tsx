import styles from "./canvas.module.css"
import {useMutation} from "@tanstack/react-query";
import {updateModuleTitle} from "@/entities/module/api/module.api";
import {queryClient} from "@/shared/api";

type Props = {
    name: string
    moduleId: string
    updateModuleTitle: ({ title, id }: { title: string; id: string }) => void
}

export function CanvasHeader({ name, moduleId, updateModuleTitle }: Props) {

    const handleTextBlur = (e: React.FocusEvent<HTMLDivElement>) => {

        const newTitle = e.currentTarget.textContent?.trim() ?? ""

        if (!newTitle || newTitle === name) return

        updateModuleTitle({
            id: moduleId,
            title: newTitle
        })
    }

    return (
        <div
            className={styles.canvasHeaderEdit}
             onClick={(e) => e.stopPropagation()}>
            <div
                contentEditable
                className={`${styles.title} }`}
                suppressContentEditableWarning
                onBlur={handleTextBlur}
            >{name}</div>

            <div className={styles.subtitle}>
                Редактирование структуры урока
            </div>
        </div>
    )
}