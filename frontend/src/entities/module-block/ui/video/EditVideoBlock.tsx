import {EditBlockProps} from "@/entities/module-block/model/types";
import {VideoBlockContent} from "@/entities/module-block/ui/video/video-block-content";
import {Play, Video, X} from "lucide-react";
import {useState} from "react";
import styles from "./video.module.css";
import commonStyles from '../image/image.module.css'

export function EditVideoBlock({ block, isActive, updateBlock }: EditBlockProps<VideoBlockContent>) {
    const [isDragging, setIsDragging] = useState(null);
    const {url, caption} = block.content

    return (
        <div className={styles.articleVideoWrapper}>
            {url ? (
                <div className={styles.videoPlaceholder}>
                    <Play size={48} className="text-white opacity-50" />
                    <div className="mt-2 small opacity-75">{url.startsWith('http') ? 'Ссылка на видео' : 'Файл загружен'}</div>
                    <button className={styles.removeImgBtn} onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { url: '', caption: caption }) ; }}>
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    className={`${commonStyles.uploadZone} ${isDragging === block.id ? 'active' : ''}`}
                    onClick={() => {}}
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDragLeave={() => setIsDragging(null)}
                    onDrop={(e) => {}}
                >
                    <div className={commonStyles.uploadIconWrapper}>
                        <Video size={28} className={commonStyles.icon} />
                    </div>

                    <div className={commonStyles.title}>
                        Загрузите видео-лекция
                    </div>

                    <div className={commonStyles.subtitle}>
                        или кликните для выбора
                    </div>
                </div>
            )}
            <input
                className={commonStyles.editorInput}
                placeholder="Вставить ссылку на YouTube / Vimeo / MP4..."
                value={url}
                onChange={(e) => updateBlock(block.id, { url: e.target.value, caption: caption })}
            />
        </div>
    )
}