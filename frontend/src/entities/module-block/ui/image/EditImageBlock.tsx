

import {EditBlockProps} from "@/entities/module-block/model/types";
import {ImageBlockContent} from "@/entities/module-block/ui/image/image-block-content";
import {UploadCloud, X} from "lucide-react";
import {useState} from "react";
import styles from "./image.module.css"

export function EditImageBlock({block, isActive, updateBlock}: EditBlockProps<ImageBlockContent>) {

    const {url, caption} = block.content
    const [isDragging, setIsDragging] = useState(null);
    const [imgError, setImgError] = useState(false)


    const handleDrop = (e, blockId: string, field: string) => {
        e.preventDefault();
        setIsDragging(null);
    };

    const triggerFileUpload = (blockId : string, field: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = field === 'imageUrl' ? 'image/*' : (field === 'videoUrl' ? 'video/*' : (field === 'audioUrl' ? 'audio/*' : '*/*'));
        input.onchange = (e) => {
        };
        input.click();
    };

    return (
        <div className={styles.articleImageWrapper}>
            {url && !imgError ? (
                <div className={styles.imagePreviewContainer}>
                    <img
                        src={url}
                        alt="Uploaded"
                        onError={() => setImgError(true)}
                    />

                    <button
                        className={styles.removeImgBtn}
                        onClick={(e) => {
                            e.stopPropagation()
                            updateBlock(block.id, { url: '', caption: caption })
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : imgError ? (

                <div className={styles.errorPlaceholder}>
                    <div className={styles.errorIcon}>⚠</div>
                    <div className={styles.errorText}>Не удалось загрузить изображение</div>

                    <button
                        className={styles.retryBtn}
                        onClick={(e) => {
                            e.stopPropagation()
                            triggerFileUpload(block.id, 'imageUrl')
                        }}
                    >
                        Загрузить другое
                    </button>
                </div>

            ) : (

                <div
                    className={`${styles.uploadZone} ${isDragging === block.id ? 'active' : ''}`}
                    onClick={() => triggerFileUpload(block.id, 'imageUrl')}
                    onDragOver={(e) => { e.preventDefault() }}
                    onDragLeave={() => setIsDragging(null)}
                    onDrop={(e) => handleDrop(e, block.id, 'imageUrl')}
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
            )}
        <input
            className={`${styles.editorInput}`}
            placeholder="Вставить URL изображения..."
            value={url}
            onChange={(e) =>{ setImgError(false); updateBlock(block.id, { url: e.target.value, caption: caption })}}
        />
        <div
            className={`${styles.editorInput} ${styles.editorInputText}`}
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={(e) => updateBlock(block.id, { url: url, caption: e.target.innerText })}
            placeholder="Подпись к картинке"
            dangerouslySetInnerHTML={{ __html: caption ?? "" }}
        />
    </div>)
}