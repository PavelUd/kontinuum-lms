import {FilePlus} from "lucide-react";
import commonStyles from '../upload/upload.module.css'
import styles from "./file.module.css"

type FilePlaceholderProps = {
    blockId: string
    isDragging: string | null
    onClick: () => void
    onDrop: (e: React.DragEvent) => void
    setIsDragging: (v: string | null) => void
}

export function FileUploadPlaceholder({ blockId, isDragging, onClick, onDrop, setIsDragging}: FilePlaceholderProps){
return (
    <div
        className={`${commonStyles.uploadZoneBase} ${commonStyles.uploadZone} ${styles.uploadSizeFile} ${
            isDragging === blockId ? "active" : ""
        }`}
        onClick={onClick}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setIsDragging(null)}
        onDrop={onDrop}
    >
        <FilePlus size={32} className={styles.uploadIcon} />

        <div className={styles.uploadTitle}>
            Кликните или перетащите файл (PDF, DOCX)
        </div>

        <div className={styles.uploadHint}>
            Для скачивания учениками
        </div>
    </div>
)}