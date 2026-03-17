import commonStyles from '@/entities/module-block/ui/upload/image/image.module.css'
import {Video} from "lucide-react";

type VideoPlaceholderProps = {
    blockId: string
    isDragging: string | null
    onClick: () => void
    onDrop: (e: React.DragEvent) => void
    setIsDragging: (v: string | null) => void
}

export function VideoUploadPlaceholder({
                                     blockId,
                                     isDragging,
                                     onClick,
                                     onDrop,
                                     setIsDragging
                                 }: VideoPlaceholderProps) {

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
                <Video size={28} className={commonStyles.icon} />
            </div>

            <div className={commonStyles.title}>
                Загрузите видео-лекцию
            </div>

            <div className={commonStyles.subtitle}>
                или кликните для выбора
            </div>
        </div>
    )
}