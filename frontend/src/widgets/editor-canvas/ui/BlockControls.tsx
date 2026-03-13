import React from "react"
import styles from "./canvas.module.css"
import {Trash} from "lucide-react";

type BlockControlsProps = {
    onRemove: () => void
}

export const BlockControls: React.FC<BlockControlsProps> = ({onRemove}) => {

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