import styles from "./canvas.module.css"

type Props = {
    name: string
}

export function CanvasHeader({ name }: Props) {
    return (
        <div
            className={styles.canvasHeaderEdit}
             onClick={(e) => e.stopPropagation()}>
            <div
                contentEditable
                className={`${styles.title} }`}
                suppressContentEditableWarning
            >Заголовок урока</div>

            <div className={styles.subtitle}>
                Редактирование структуры урока
            </div>
        </div>
    )
}