import React from "react"
import styles from "./canvas.module.css"
import {ChevronDown, ChevronUp, Trash} from "lucide-react";

type BlockControlsProps = {
    onRemove: () => void
    onMoveUp: () => void
    onMoveDown: () => void
}

export const BlockControls: React.FC<BlockControlsProps> = ({onRemove, onMoveUp, onMoveDown}) => {

    const handleClick =
        (handler: () => void) =>
            (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()

                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                }

                handler()
            }

    return (
        <div className={styles.blockControls}>

            <button
                className={styles.controlBtn}
                onClick={handleClick(onMoveUp)}
                onMouseDown={(e) => e.preventDefault()}
                title="Вверх"
                type="button"
            >
                <ChevronUp size={18} />
            </button>

            <button
                className={styles.controlBtn}
                onClick={handleClick(onMoveDown)}
                onMouseDown={(e) => e.preventDefault()}
                title="Вниз"
                type="button"
            >
                <ChevronDown size={18} />
            </button>

            <button
                className={`${styles.controlBtn} ${styles.textDanger}`}

                onClick={handleClick(onRemove)}
                title="Удалить"
                type="button"
            >
                <Trash size={18} />
            </button>

        </div>
    )
}