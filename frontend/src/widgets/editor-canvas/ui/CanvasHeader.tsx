import styles from "./canvas.module.css"
import {useMutation} from "@tanstack/react-query";
import {updateModuleTitle} from "@/entities/module/api/module.api";

type Props = {
    name: string
    moduleId: string
}

export function CanvasHeader({ name, moduleId }: Props) {

    const updateTitleMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            updateModuleTitle(id, {title: title})
    })

    const handleTextBlur = (e: React.FocusEvent<HTMLDivElement>) => {

        const newTitle = e.currentTarget.textContent?.trim() ?? ""

        if (!newTitle || newTitle === name) return

        updateTitleMutation.mutate({
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