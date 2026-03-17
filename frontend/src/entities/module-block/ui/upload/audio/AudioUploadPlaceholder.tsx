import commonStyles from '@/entities/module-block/ui/upload/image/image.module.css'
import {Music} from "lucide-react";
import styles from "./audio.module.css"

type AudioPlaceholderProps = {
    blockId: string
    isDragging: string | null
    onClick: () => void
    onDrop: (e: React.DragEvent) => void
    setIsDragging: (v: string | null) => void
}

export function AudioUploadPlaceholder({ blockId, isDragging, onClick, onDrop, setIsDragging}: AudioPlaceholderProps){
    return (
        <div
            className={`${commonStyles.uploadZone} ${
                isDragging === blockId ? "active" : ""
            }`}
            onClick={onClick}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragging(null)}
            onDrop={onDrop}
        >
            <div className={commonStyles.uploadIconWrapper}>
                <Music size={28} className={styles.icon} />
            </div>

            <div className={commonStyles.title}>
                Загрузите аудио
            </div>

            <div className={commonStyles.subtitle}>
                или кликните для выбора
            </div>
        </div>
    )
}