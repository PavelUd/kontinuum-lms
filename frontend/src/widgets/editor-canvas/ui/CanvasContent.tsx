import styles from "./canvas.module.css"
import {PlusCircle} from "lucide-react";

type Props = {
    name: string
}

export function CanvasContent({ name }: Props) {
    return (
        <div className={styles.canvasContainer}>
            <div className={styles.lessonEnd}>
                <div className={styles.lessonEndText}>Конец урока</div>
            </div>
        </div>
    )
}