import {CanvasHeader} from "@/widgets/editor-canvas/ui/CanvasHeader";
import {CanvasContent} from "@/widgets/editor-canvas/ui/CanvasContent";
import styles from "./canvas.module.css"

type Props = {
    moduleId: string
}

export function Canvas({ moduleId }: Props) {
    return (
        <div className={styles.editorCanvas}>
            <CanvasHeader name={"hello"}></CanvasHeader>
            <CanvasContent name={"hello"}></CanvasContent>
        </div>
    )
}