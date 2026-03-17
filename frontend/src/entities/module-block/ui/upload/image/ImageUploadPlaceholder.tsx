import styles from "./image.module.css"
import {UploadCloud} from "lucide-react";


type ImageUploadPlaceholderProps = {
    blockId: string
    isDragging: string | null
    onClick: () => void
    onDrop: (e: React.DragEvent) => void
    setIsDragging: (id: string | null) => void
}

export function ImageUploadPlaceholder({
                                           blockId,
                                           isDragging,
                                           onClick,
                                           onDrop,
                                           setIsDragging
                                       }: ImageUploadPlaceholderProps) {

    return (
        <div
            className={`${styles.uploadZone} ${
                isDragging === blockId ? "active" : ""
            }`}
            onClick={onClick}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragging(null)}
            onDrop={onDrop}
        >
            <div className={styles.uploadIconWrapper}>
                <UploadCloud size={28} className="text-primary" />
            </div>

            <div className="fw-bold text-main">
                Перетащите картинку сюда
            </div>

            <div className="small">
                или кликните для выбора
            </div>
        </div>

    )
}